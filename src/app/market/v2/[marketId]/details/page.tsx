import { createPublicClient, http } from "viem";
import {
  V2contractAddress,
  V2contractAbi,
  PolicastViews,
  PolicastViewsAbi,
} from "@/constants/contract";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { MarketDetailsClient } from "@/components/MarketDetailsClient";
import { customBase } from "@/constants/chains";

// V2 Market Info Contract Return
type MarketInfoV2ContractReturn = readonly [
  string, // question
  string, // description
  bigint, // endTime
  number, // category
  bigint, // optionCount
  boolean, // resolved
  boolean, // disputed
  bigint, // winningOptionId
  string, // creator
  boolean // earlyResolutionAllowed
];

interface Props {
  params: Promise<{ marketId: string }>;
}

// Helper function to fetch V2 market data only
async function fetchV2MarketData(marketId: string, publicClient: any) {
  const marketIdBigInt = BigInt(marketId);

  try {
    // Fetch both basic market info and extended info (which includes marketType)
    const [marketInfo, extendedInfo] = await Promise.all([
      publicClient.readContract({
        address: V2contractAddress,
        abi: V2contractAbi,
        functionName: "getMarketInfo",
        args: [marketIdBigInt],
      }) as Promise<MarketInfoV2ContractReturn>,
      publicClient
        .readContract({
          address: PolicastViews,
          abi: PolicastViewsAbi,
          functionName: "getMarketInfo",
          args: [marketIdBigInt],
        })
        .catch(() => null), // Fallback if PolicastViews fails
    ]);

    // Check if market exists (question should not be empty)
    if (!marketInfo[0]) {
      throw new Error(`V2 Market ${marketId} not found`);
    }

    // Extract marketType from extended info if available
    let marketType = 0; // Default to PAID market
    if (
      extendedInfo &&
      Array.isArray(extendedInfo) &&
      extendedInfo.length > 7
    ) {
      marketType = Number(extendedInfo[7]) || 0;
    }

    return {
      version: "v2" as const,
      data: marketInfo,
      marketType: marketType,
    };
  } catch (error) {
    console.error(`Error fetching V2 market ${marketId}:`, error);
    throw new Error(`V2 Market ${marketId} not found`);
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ marketId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { marketId } = await params;

  console.log("generateMetadata (V2): Processing marketId:", marketId);

  if (!marketId || isNaN(Number(marketId))) {
    console.error("generateMetadata (V2): Invalid marketId", marketId);
    return {
      title: "Market Not Found",
      description: "Unable to load V2 market data for metadata",
    };
  }

  try {
    const publicClient = createPublicClient({
      chain: customBase,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    });

    const result = await fetchV2MarketData(marketId, publicClient);
    const marketData = result.data;

    const question = marketData[0];
    const description = marketData[1];
    const endTime = Number(marketData[2]);
    const resolved = marketData[5];

    const endDate = new Date(endTime * 1000);
    const formattedEndTime = endDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const status = resolved ? "Resolved" : "Active";

    const title = `${question} | V2 Prediction Market`;
    const desc = description
      ? `${description} • Market ends ${formattedEndTime} • Status: ${status}`
      : `Prediction market: ${question} • Ends ${formattedEndTime} • Status: ${status}`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
      },
    };
  } catch (error) {
    console.error("generateMetadata (V2): Error generating metadata:", error);
    return {
      title: "V2 Market Not Found",
      description: "Unable to load V2 market data for metadata",
    };
  }
}

export default async function MarketV2DetailsPage({ params }: Props) {
  const { marketId } = await params;

  console.log("MarketV2DetailsPage: Processing marketId:", marketId);

  if (!marketId || isNaN(Number(marketId))) {
    console.error("MarketV2DetailsPage: Invalid marketId", marketId);
    notFound();
  }

  try {
    const publicClient = createPublicClient({
      chain: customBase,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    });

    const result = await fetchV2MarketData(marketId, publicClient);
    const marketData = result.data;

    console.log("MarketV2DetailsPage: Successfully fetched V2 market data");

    // Build market object with V2 data
    const optionCount = Number(marketData[4]);
    const options: string[] = [];
    const optionShares: bigint[] = [];

    // Fetch individual option data
    for (let i = 0; i < optionCount; i++) {
      try {
        const [name, , totalShares]: readonly [
          string,
          string,
          bigint,
          bigint,
          bigint,
          boolean
        ] = await publicClient.readContract({
          address: V2contractAddress,
          abi: V2contractAbi,
          functionName: "getMarketOption",
          args: [BigInt(marketId), BigInt(i)],
        });
        options.push(name);
        optionShares.push(totalShares);
      } catch (error) {
        console.error(`Error fetching option ${i}:`, error);
        options.push(`Option ${i + 1}`);
        optionShares.push(0n);
      }
    }

    const market = {
      question: marketData[0],
      description: marketData[1],
      endTime: marketData[2],
      category: marketData[3],
      optionCount: optionCount,
      resolved: marketData[5],
      disputed: marketData[6],
      winningOptionId: Number(marketData[7]),
      creator: marketData[8],
      version: "v2" as const,
      outcome: marketData[5] ? Number(marketData[7]) : 0, // Set outcome based on resolved state
      options,
      optionShares,
      earlyResolutionAllowed: marketData[9],
      marketType: result.marketType,
    };

    console.log(
      `MarketV2DetailsPage: Built market object for ${marketId}`,
      market
    );

    return <MarketDetailsClient marketId={marketId} market={market} />;
  } catch (error) {
    console.error("MarketV2DetailsPage: Error:", error);
    notFound();
  }
}

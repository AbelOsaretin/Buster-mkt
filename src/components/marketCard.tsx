"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useAccount, useReadContract } from "wagmi";
import { contract, contractAbi } from "@/constants/contract";
import { MarketProgress } from "./market-progress";
import MarketTime from "./market-time";
import { MarketResolved } from "./market-resolved";
import { MarketPending } from "./market-pending";
import { MarketBuyInterface } from "./market-buy-interface";
import { MarketSharesDisplay } from "./market-shares-display";
import { sdk } from "@farcaster/frame-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareFromSquare,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

export interface Market {
  question: string;
  optionA: string;
  optionB: string;
  endTime: bigint;
  outcome: number;
  totalOptionAShares: bigint;
  totalOptionBShares: bigint;
  resolved: boolean;
}

interface SharesBalance {
  optionAShares: bigint;
  optionBShares: bigint;
}

interface MarketCardProps {
  index: number;
  market: Market;
}

export function MarketCard({ index, market }: MarketCardProps) {
  const { address } = useAccount();

  const marketData = market;

  const { data: sharesBalanceData } = useReadContract({
    address: contract.address,
    abi: contractAbi,
    functionName: "getShareBalance",
    args: [BigInt(index), address as `0x${string}`],
    query: { enabled: !!address && !!marketData },
  });

  const sharesBalance: SharesBalance | undefined = sharesBalanceData
    ? {
        optionAShares: sharesBalanceData[0],
        optionBShares: sharesBalanceData[1],
      }
    : undefined;

  const isExpired = new Date(Number(marketData.endTime) * 1000) < new Date();
  const isResolved = marketData.resolved;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://buster-mkt.vercel.app";
  const marketPageUrl = `${appUrl}/market/${index}/details`;
  const handleShare = async () => {
    try {
      await sdk.actions.composeCast({
        text: `Check out this market on Buster Market: ${
          marketData?.question || `Market ${index}`
        }`,
        embeds: [marketPageUrl],
      });
    } catch (error) {
      console.error("Failed to compose cast:", error);
      // Optionally, show a toast notification to the user
    }
  };

  return (
    <Card key={index} className="flex flex-col">
      <CardHeader>
        <MarketTime endTime={marketData.endTime} />
        <CardTitle>{marketData.question}</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <MarketProgress
          optionA={marketData.optionA}
          optionB={marketData.optionB}
          totalOptionAShares={marketData.totalOptionAShares}
          totalOptionBShares={marketData.totalOptionBShares}
        />
        {isExpired ? (
          isResolved ? (
            <MarketResolved
              marketId={index}
              outcome={marketData.outcome}
              optionA={marketData.optionA}
              optionB={marketData.optionB}
            />
          ) : (
            <MarketPending />
          )
        ) : (
          <MarketBuyInterface marketId={index} market={marketData} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        {sharesBalance &&
        (sharesBalance.optionAShares > 0n ||
          sharesBalance.optionBShares > 0n) ? (
          <MarketSharesDisplay
            market={marketData}
            sharesBalance={sharesBalance}
          />
        ) : (
          <div />
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border border-gray-300 hover:bg-gray-100 hover:text-gray-900 rounded-md px-4 py-2 transition-colors"
            onClick={handleShare}
          >
            <FontAwesomeIcon icon={faShareFromSquare} />
          </Button>
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors"
          >
            <Link href={`/market/${index}/details`} legacyBehavior>
              <a>
                <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
              </a>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

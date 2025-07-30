"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { type Address } from "viem";
import { useToast } from "@/components/ui/use-toast";
import {
  publicClient,
  contractAddress,
  contractAbi,
  tokenAddress as defaultTokenAddress,
  tokenAbi as defaultTokenAbi,
} from "@/constants/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Vote {
  marketId: number;
  isOptionA: boolean;
  amount: bigint;
  timestamp: bigint;
}

interface MarketInfo {
  question: string;
  optionA: string;
  optionB: string;
  outcome: number; // 0: Pending, 1: OptionA, 2: OptionB, 3: Invalid
  resolved: boolean;
}

interface UserStatsData {
  totalVotes: number;
  wins: number;
  losses: number;
  winRate: number;
  totalInvested: bigint;
  netWinnings: bigint;
}

const CACHE_KEY_STATS = "user_stats_cache_v1";
const CACHE_TTL_STATS = 60 * 60; // 1 hour in seconds

export function UserStats() {
  const { address: accountAddress, isConnected } = useAccount();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenSymbol, setTokenSymbol] = useState<string>("BSTR");
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const { data: bettingTokenAddr } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "bettingToken",
  });

  const tokenAddress = (bettingTokenAddr as Address) || defaultTokenAddress;

  const { data: symbolData } = useReadContract({
    address: tokenAddress,
    abi: defaultTokenAbi,
    functionName: "symbol",
    query: { enabled: !!tokenAddress },
  });

  const { data: decimalsData } = useReadContract({
    address: tokenAddress,
    abi: defaultTokenAbi,
    functionName: "decimals",
    query: { enabled: !!tokenAddress },
  });

  useEffect(() => {
    if (symbolData) setTokenSymbol(symbolData as string);
    if (decimalsData) setTokenDecimals(Number(decimalsData));
  }, [symbolData, decimalsData]);

  const { data: totalWinningsData } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "totalWinnings",
    args: [accountAddress!],
    query: { enabled: !!accountAddress },
  });
  const totalWinnings = (totalWinningsData as bigint | undefined) ?? 0n;

  const fetchUserStats = useCallback(
    async (address: Address) => {
      setIsLoading(true);
      try {
        const cached = localStorage.getItem(`${CACHE_KEY_STATS}_${address}`);
        if (cached) {
          const data = JSON.parse(cached);
          if (Date.now() - data.timestamp < CACHE_TTL_STATS * 1000) {
            setStats(data.stats);
            setIsLoading(false);
            return;
          }
        }

        const voteCount = (await publicClient.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "getVoteHistoryCount",
          args: [address],
        })) as bigint;

        if (voteCount === 0n) {
          setStats({
            totalVotes: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            totalInvested: 0n,
            netWinnings: 0n,
          });
          setIsLoading(false);
          return;
        }

        const allVotes: Vote[] = [];
        for (let i = 0; i < voteCount; i += 50) {
          const votes = (await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: "getVoteHistory",
            args: [address, BigInt(i), 50n],
          })) as readonly {
            marketId: bigint;
            isOptionA: boolean;
            amount: bigint;
            timestamp: bigint;
          }[];
          allVotes.push(
            ...votes.map((v) => ({
              ...v,
              marketId: Number(v.marketId),
            }))
          );
        }

        const marketIds = [...new Set(allVotes.map((v) => v.marketId))];
        const marketInfosData = await publicClient.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "getMarketInfoBatch",
          args: [marketIds.map(BigInt)],
        });

        const marketInfos: Record<number, MarketInfo> = {};
        marketIds.forEach((id, i) => {
          marketInfos[id] = {
            question: marketInfosData[0][i],
            optionA: marketInfosData[1][i],
            optionB: marketInfosData[2][i],
            outcome: marketInfosData[4][i],
            resolved: marketInfosData[7][i],
          };
        });

        let wins = 0;
        let losses = 0;
        const totalInvested = allVotes.reduce((acc, v) => acc + v.amount, 0n);

        allVotes.forEach((vote) => {
          const market = marketInfos[vote.marketId];
          if (market && market.resolved) {
            const won =
              (vote.isOptionA && market.outcome === 1) ||
              (!vote.isOptionA && market.outcome === 2);
            if (won) {
              wins++;
            } else if (market.outcome !== 0 && market.outcome !== 3) {
              // Not pending or invalid
              losses++;
            }
          }
        });

        const totalVotes = wins + losses;
        const winRate = totalVotes > 0 ? (wins / totalVotes) * 100 : 0;

        const newStats = {
          totalVotes,
          wins,
          losses,
          winRate,
          totalInvested,
          netWinnings: totalWinnings,
        };
        setStats(newStats);
        localStorage.setItem(
          `${CACHE_KEY_STATS}_${address}`,
          JSON.stringify({ stats: newStats, timestamp: Date.now() })
        );
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        toast({
          title: "Error",
          description: "Could not load your performance statistics.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, totalWinnings]
  );

  useEffect(() => {
    if (isConnected && accountAddress) {
      fetchUserStats(accountAddress);
    } else {
      setIsLoading(false);
    }
  }, [isConnected, accountAddress, fetchUserStats]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to view your performance.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const formatAmount = (amount: bigint) => {
    return (Number(amount) / 10 ** tokenDecimals).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem label="Win Rate" value={`${stats.winRate.toFixed(2)}%`} />
          <StatItem label="Total Wins" value={stats.wins} />
          <StatItem label="Total Losses" value={stats.losses} />
          <StatItem
            label="Total Voted"
            value={`${formatAmount(stats.totalInvested)} ${tokenSymbol}`}
          />
          <StatItem
            label="Net Winnings"
            value={`${formatAmount(stats.netWinnings)} ${tokenSymbol}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

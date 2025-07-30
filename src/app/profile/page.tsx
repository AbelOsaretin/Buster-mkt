"use client";

import { UserStats } from "@/components/UserStats";
import { VoteHistory } from "@/components/VoteHistory";
import { useAccount } from "wagmi";

export default function ProfilePage() {
  const { isConnected } = useAccount();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      {isConnected ? (
        <div className="space-y-8">
          <UserStats />
          <VoteHistory />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Please connect your wallet to view your profile.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";
import { approveUSDC } from "@/lib/usdc";

type PollData = {
  question: string;
  options: string[];
  votePriceUsd: bigint;
};

export default function Poll() {
  const params = useParams();
  const pollId = Number(params.id);

  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔵 REQUIRED: tell Base the mini app is ready
  useEffect(() => {
    window.parent?.postMessage({ type: "miniapp-ready" }, "*");
  }, []);

  // 🔵 Load poll
  useEffect(() => {
    if (Number.isNaN(pollId)) return;

    let cancelled = false;

    async function loadPoll() {
      try {
        const c = await getContract();
        const p = await c.polls(pollId);

        if (!cancelled) {
          setPoll({
            question: p.question,
            options: p.options,
            votePriceUsd: p.votePriceUsd
          });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load poll");
      }
    }

    loadPoll();
    return () => {
      cancelled = true;
    };
  }, [pollId]);

  async function vote(option: number, payEth: boolean) {
    try {
      if (!poll) return;

      setError(null);
      setLoading(true);

      const c = await getContract();

      let tx;

      if (payEth) {
        const value = await c.usdToEth(poll.votePriceUsd);
        tx = await c.voteWithETH(pollId, option, { value });
      } else {
        // 🔵 USDC has 6 decimals
        const usdcAmount = poll.votePriceUsd * 1_000_000n;
        await approveUSDC(usdcAmount);
        tx = await c.voteWithUSDC(pollId, option);
      }

      await tx.wait();
      alert("Vote successful!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  if (!poll) {
    return (
      <main className="p-6 text-zinc-400">
        Loading poll…
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4 text-white">
      <h2 className="text-xl font-bold">{poll.question}</h2>

      {error && (
        <p className="text-red-400 bg-red-900/30 p-2 rounded">
          {error}
        </p>
      )}

      {poll.options.map((o, i) => (
        <div key={i} className="flex items-center gap-3">
          <button
            disabled={loading}
            onClick={() => vote(i, true)}
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
          >
            Vote ETH
          </button>

          <button
            disabled={loading}
            onClick={() => vote(i, false)}
            className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
          >
            Vote USDC
          </button>

          <span>{o}</span>
        </div>
      ))}
    </main>
  );
}

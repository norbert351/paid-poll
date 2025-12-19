"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";
import { approveUSDC } from "@/lib/usdc";


export default function Poll() {
  const { id } = useParams();
  const [poll, setPoll] = useState<any>();

  useEffect(() => {
    (async () => {
      const c = await getContract();
      const p = await c.polls(id);
      setPoll(p);
    })();
  }, [id]);

  async function vote(option: number, eth: boolean) {
    const c = await getContract();

    if (eth) {
      const value = await c.usdToEth(poll.votePriceUsd);
      await c.voteWithETH(id, option, { value });
    } else {
      await approveUSDC(BigInt(poll.votePriceUsd) * 10000n);
      await c.voteWithUSDC(id, option);
    }
  }

  if (!poll) return null;

  return (
    <main className="p-6 space-y-4">
      <h2 className="text-xl font-bold">{poll.question}</h2>

      {poll.options.map((o: string, i: number) => (
        <div key={i} className="flex gap-2">
          <button onClick={() => vote(i, true)} className="bg-blue-600 px-4 py-2 rounded">
            Vote ETH
          </button>
          <button onClick={() => vote(i, false)} className="bg-green-600 px-4 py-2 rounded">
            Vote USDC
          </button>
          <span>{o}</span>
        </div>
      ))}
    </main>
  );
}

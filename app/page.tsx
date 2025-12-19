"use client";

import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";
import Link from "next/link";

type PollPreview = {
  id: number;
  question: string;
};

export default function Home() {
  const [polls, setPolls] = useState<PollPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolls() {
      try {
        const contract = await getContract();

        // ✅ correct way to get poll count
        const count: bigint = await contract.getPollCount();
        const total = Number(count);

        const items: PollPreview[] = [];

        for (let i = 0; i < total; i++) {
          const poll = await contract.polls(i);
          items.push({
            id: i,
            question: poll.question
          });
        }

        setPolls(items);
      } catch (err) {
        console.error("Failed to load polls:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPolls();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🗳 Paid Polls</h1>

      <Link
        href="/create"
        className="inline-block bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
      >
        Create Poll
      </Link>

      {loading && <p className="text-zinc-400">Loading polls...</p>}

      {!loading && polls.length === 0 && (
        <p className="text-zinc-400">No polls yet.</p>
      )}

      {polls.map((p) => (
        <Link
          key={p.id}
          href={`/poll/${p.id}`}
          className="block p-4 bg-zinc-800 rounded hover:bg-zinc-700"
        >
          {p.question}
        </Link>
      ))}
    </main>
  );
}

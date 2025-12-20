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

  // 🔵 REQUIRED: tell Base the mini app is ready
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.parent?.postMessage(
        { type: "miniapp-ready" },
        "*"
      );
    }
  }, []);

  // 🔵 Load polls AFTER ready
  useEffect(() => {
    let cancelled = false;

    async function loadPolls() {
      try {
        const contract = await getContract();

        const count = await contract.getPollCount();
        const total = Number(count);

        const items: PollPreview[] = [];

        for (let i = 0; i < total; i++) {
          const poll = await contract.polls(i);
          items.push({
            id: i,
            question: poll.question,
          });
        }

        if (!cancelled) {
          setPolls(items);
        }
      } catch (err) {
        console.error("Failed to load polls:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPolls();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold">🗳 Paid Polls</h1>

      <Link
        href="/create"
        className="inline-block bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
      >
        Create Poll ($0.20)
      </Link>

      {loading && <p className="text-zinc-400">Loading polls…</p>}

      {!loading && polls.length === 0 && (
        <p className="text-zinc-400">No polls yet.</p>
      )}

      <div className="space-y-3">
        {polls.map((p) => (
          <Link
            key={p.id}
            href={`/poll/${p.id}`}
            className="block p-4 bg-zinc-800 rounded hover:bg-zinc-700"
          >
            {p.question}
          </Link>
        ))}
      </div>
    </main>
  );
}

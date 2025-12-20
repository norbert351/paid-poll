"use client";

import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [votePrice, setVotePrice] = useState(10);
  const [payEth, setPayEth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔵 REQUIRED: tell Base the page is ready
  useEffect(() => {
    window.parent?.postMessage({ type: "miniapp-ready" }, "*");
  }, []);

  async function submit() {
    try {
      setError(null);

      if (!question.trim()) {
        throw new Error("Question is required");
      }

      const cleanOptions = options.filter(o => o.trim());
      if (cleanOptions.length < 2) {
        throw new Error("At least two options are required");
      }

      setLoading(true);
      const contract = await getContract();

      let tx;

      if (payEth) {
        // 🔵 $0.20 in ETH (contract handles conversion)
        const value = await contract.usdToEth(20);

        tx = await contract.createPoll(
          question,
          cleanOptions,
          votePrice,
          true,
          { value }
        );
      } else {
        tx = await contract.createPoll(
          question,
          cleanOptions,
          votePrice,
          false
        );
      }

      await tx.wait();

      // Reset form on success
      setQuestion("");
      setOptions(["", ""]);
      alert("Poll created successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 space-y-4 text-white">
      <h2 className="text-xl font-bold">Create Poll</h2>

      {error && (
        <p className="text-red-400 bg-red-900/30 p-2 rounded">
          {error}
        </p>
      )}

      <input
        placeholder="Question"
        className="w-full p-2 rounded bg-zinc-800"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          className="w-full p-2 rounded bg-zinc-800"
          value={opt}
          onChange={e => {
            const o = [...options];
            o[i] = e.target.value;
            setOptions(o);
          }}
        />
      ))}

      <button
        onClick={() => setOptions([...options, ""])}
        className="text-sm text-blue-400"
      >
        + Add Option
      </button>

      <input
        type="number"
        min={1}
        value={votePrice}
        onChange={e => setVotePrice(Number(e.target.value))}
        className="w-full p-2 rounded bg-zinc-800"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={payEth}
          onChange={() => setPayEth(!payEth)}
        />
        Pay creation fee with ETH ($0.20)
      </label>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </main>
  );
}

"use client";

import { useState } from "react";
import { getContract } from "@/lib/contract";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [votePrice, setVotePrice] = useState(10);
  const [payEth, setPayEth] = useState(true);

  async function submit() {
    const contract = await getContract();
    const value = payEth ? await contract.usdToEth(20) : undefined;

    await contract.createPoll(
      question,
      options,
      votePrice,
      payEth,
      payEth ? { value } : {}
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Create Poll</h2>

      <input
        placeholder="Question"
        className="w-full p-2 bg-blue-300 text-black"
        onChange={e => setQuestion(e.target.value)}
      />

      {options.map((_, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          className="w-full p-2 bg-blue-300 text-black"
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
        value={votePrice}
        onChange={e => setVotePrice(+e.target.value)}
        className=" bg-white rounded p-3"
      />

      <label className="p-3">
        <input type="checkbox" checked={payEth} onChange={() => setPayEth(!payEth)} />
        Pay creation fee with ETH
      </label>

      <button onClick={submit} className="bg-blue-400 px-4 py-2 rounded">
        Create
      </button>
    </main>
  );
}

"use client";

import { ethers } from "ethers";
import PaidPollsABI from "./PaidPolls.json";

/**
 * Get BrowserProvider safely
 */
export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Wallet not found");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

/**
 * Get signer-connected PaidPolls contract
 */
export async function getContract(): Promise<ethers.Contract> {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT!,
    PaidPollsABI,
    signer
  );
}

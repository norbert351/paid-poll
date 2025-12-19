"use client";

import { ethers } from "ethers";
import { getProvider } from "./contract";

/**
 * Minimal ERC20 ABI (USDC)
 */
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

/**
 * Approve USDC spending for PaidPolls contract
 */
export async function approveUSDC(amount: bigint) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const usdc = new ethers.Contract(
    process.env.NEXT_PUBLIC_USDC!,
    ERC20_ABI,
    signer
  );

  return usdc.approve(
    process.env.NEXT_PUBLIC_CONTRACT!,
    amount
  );
}

export async function getUSDCAllowance(
  owner: string
): Promise<bigint> {
  const provider = await getProvider();
  const usdc = new ethers.Contract(
    process.env.NEXT_PUBLIC_USDC!,
    ERC20_ABI,
    provider
  );

  return usdc.allowance(
    owner,
    process.env.NEXT_PUBLIC_CONTRACT!
  );
}

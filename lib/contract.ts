import { ethers } from "ethers";
import PaidPollsABI from "./PaidPolls.json";

// ✅ MUST be NEXT_PUBLIC
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAID_POLLS_ADDRESS;

export async function getContract() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address is missing");
  }

  if (!window.ethereum) {
    throw new Error("No wallet found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    PaidPollsABI,
    signer
  );
}

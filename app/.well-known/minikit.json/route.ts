import { NextResponse } from "next/server";
import { minikitConfig } from "@/lib/minikit.config";

export function GET() {
  return NextResponse.json(minikitConfig, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

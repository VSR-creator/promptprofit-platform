import { NextResponse } from "next/server";

/**
 * PromptProfit Brain
 *
 * SDK Verification Endpoint
 */
export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    verified: true,
    received: body,
  });
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const events = await req.json();

  console.log("📦 Received Brain Events:", events);

  return NextResponse.json({
    success: true,
    received: events.length,
  });
}

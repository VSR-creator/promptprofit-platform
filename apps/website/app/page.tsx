"use client";
import Script from "next/script";
import Image from "next/image";
import { Brain } from "@promptprofit/brain-sdk";
import FlowPopup from "./components/promptprofit/FlowPopup";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white"
      onClick={() =>
        Brain.emit({
          id: crypto.randomUUID(),
          type: "click",
          timestamp: Date.now(),
          path: "/",
        })
      }
    >
      <main className="flex flex-col items-center gap-6">
        <Image src="/next.svg" alt="logo" width={120} height={30} />

        <h1 className="text-3xl font-bold">PromptProfit Conversion Engine</h1>

        <p className="text-zinc-500">
          Click anywhere to trigger AI conversion flow
        </p>

        {/* ðŸ”¥ FLOW ENGINE UI */}
        <FlowPopup />      <Script
        src="/sdk.js"
        data-key="f5630a25b93446bda951fb78e818e753"
        data-api-base="http://localhost:3000"
        strategy="afterInteractive"
      />

      </main>
    </div>
  );
}





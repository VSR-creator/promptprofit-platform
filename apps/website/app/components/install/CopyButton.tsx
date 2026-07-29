"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded bg-black px-4 py-2 text-white"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

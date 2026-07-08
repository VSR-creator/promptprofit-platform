"use client";

import { useState } from "react";

type Props = {
  snippet: string;
};

export default function CopySnippetButton({ snippet }: Props) {
  const [copied, setCopied] = useState(false);

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={copySnippet}
      className="mt-4 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
    >
      {copied ? "Copied ✓" : "Copy snippet"}
    </button>
  );
}

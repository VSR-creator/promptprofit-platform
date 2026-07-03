"use client";

import { useEffect, useState } from "react";

export default function Popup() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setMessage(e.detail);

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    };

    window.addEventListener("pp-conversation", handler);

    return () => {
      window.removeEventListener("pp-conversation", handler);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-xl shadow-lg z-50">
      {message}
    </div>
  );
}

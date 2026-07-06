import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptProfit | Find the enquiries your website is losing",
  description:
    "PromptProfit identifies where interested visitors lose momentum and gives service businesses a clear Fix First plan to turn more attention into enquiries.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

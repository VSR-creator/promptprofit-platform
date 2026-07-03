import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptProfit",
  description: "Write your way to profit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {" "}
      <body>{children}</body>{" "}
    </html>
  );
}

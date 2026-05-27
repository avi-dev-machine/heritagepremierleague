import type { Metadata } from "next";
import Preloader from "@/components/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heritage Premier League 2026",
  description: "Honor the past. Play for the legacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Preloader />
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}

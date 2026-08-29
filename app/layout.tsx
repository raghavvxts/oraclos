import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oraclos",
  description: "Autonomous Onchain Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="ambient-bg">
            <div className="noise-overlay"></div>
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
            <div className="ambient-blob blob-3"></div>
          </div>
          <main className="relative min-h-screen z-10 font-sans antialiased text-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

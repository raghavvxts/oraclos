import { NextResponse } from 'next/server';

export async function GET() {
  // Mocking live Polymarket data for the MVP demo
  const mockMarkets = [
    {
      id: "btc-150k-2024",
      question: "Bitcoin reaches $150K in 2024",
      probability: 42,
      volume: "$1.2M",
      liquidity: "$450K"
    },
    {
      id: "eth-etf-flows",
      question: "ETH ETF net inflows > $5B in 2024",
      probability: 68,
      volume: "$800K",
      liquidity: "$200K"
    }
  ];

  return NextResponse.json(mockMarkets);
}

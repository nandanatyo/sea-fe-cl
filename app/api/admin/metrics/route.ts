import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const metrics = {
      newSubscriptions: Math.floor(Math.random() * 50) + 20,
      monthlyRecurringRevenue: Math.floor(Math.random() * 100000000) + 50000000,
      reactivations: Math.floor(Math.random() * 15) + 5,
      subscriptionGrowth: Math.floor(Math.random() * 30) - 5,
      totalActiveSubscriptions: Math.floor(Math.random() * 500) + 200,
      totalUsers: Math.floor(Math.random() * 1000) + 500,
      conversionRate: Math.floor(Math.random() * 20) + 10,
      churnRate: Math.floor(Math.random() * 10) + 2,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Metrics fetch error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

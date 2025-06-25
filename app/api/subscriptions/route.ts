import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, plan, mealTypes, deliveryDays, totalPrice } = body;

    if (
      !name ||
      !phone ||
      !plan ||
      !mealTypes?.length ||
      !deliveryDays?.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subscription = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    console.log("New subscription created:", subscription);

    return NextResponse.json({
      success: true,
      subscription,
      message: "Subscription created successfully",
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const mockSubscriptions = [
    {
      id: "1",
      name: "John Doe",
      phone: "08123456789",
      plan: "protein",
      mealTypes: ["breakfast", "lunch"],
      deliveryDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      totalPrice: 1720000,
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
    },
  ];

  return NextResponse.json({ subscriptions: mockSubscriptions });
}

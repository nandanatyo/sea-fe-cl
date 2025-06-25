import { type NextRequest, NextResponse } from "next/server";

// This would typically connect to a real database
// For demo purposes, we'll simulate database operations

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      name,
      phone,
      plan,
      mealTypes,
      deliveryDays,
      totalPrice,
      address,
      city,
    } = body;

    if (
      !name ||
      !phone ||
      !plan ||
      !mealTypes?.length ||
      !deliveryDays?.length ||
      !address ||
      !city
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Phone validation
    if (!/^08[0-9]{8,11}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Simulate database save
    const subscription = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    // In a real app, you would save to database here
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
  // This would fetch subscriptions from database
  // For demo purposes, return mock data
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

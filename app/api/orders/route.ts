import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dbOperations } from "@/lib/db";

// Create a new order
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order" },
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentDetails, total } = await request.json();

    if (!items || items.length === 0 || !shippingAddress || !total) {
      return NextResponse.json(
        { error: "Missing order details" },
        { status: 400 }
      );
    }

    // Create order document
    const order = {
      userId: user.id,
      userEmail: user.email,
      customerName: shippingAddress.fullName,
      shippingAddress,
      items,
      total,
      paymentMethod: paymentDetails.method || "Credit Card",
      status: "Processing",
    };

    const newOrder = await dbOperations.createOrder(order);

    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

// Fetch user orders
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view your orders" },
        { status: 401 }
      );
    }

    const orders = await dbOperations.getOrdersByUser(user.email);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
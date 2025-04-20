import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDB from "@/lib/connectDB";
import { OrderInterface, UserInterface } from "@/Interfaces";
import Order from "@/lib/models/Order";

export interface VerifyBody {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderIdDb: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      razorpayPaymentId,
      razorpaySignature,
      orderIdDb,
    }: VerifyBody = await request.json();

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required parameters", success: false },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret not found" },
        { status: 400 }
      );
    }

    const HMAC = crypto.createHmac("sha256", secret);
    HMAC.update(`${orderId}|${razorpayPaymentId}`);
    const generatedSignature = HMAC.digest("hex");

    if (generatedSignature === razorpaySignature) {
      await ConnectDB();
      const order: OrderInterface | null = await Order.findById(
        String(orderIdDb)
      ).populate({
        path: "customer",
        model: "User",
        select: "email",
      }).exec();

      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      order.isPaid = true;
      if (!order.paymentResult) order.paymentResult = {};

      order.paymentResult.email_address =
        (order.customer as UserInterface).email || "Anonymous";

      order.paymentResult.status = "Completed";
      order.paymentResult.update_time = Number(Date.now());
      order.paymentResult.id = String(razorpayPaymentId);

      await order.save();

      return NextResponse.json({
        message: "Payment verified successfully",
        success: true,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid signature", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred", success: false },
      { status: 500 }
    );
  }
}

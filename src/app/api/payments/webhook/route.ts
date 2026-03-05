import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentClient } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // MP sends notifications with different topics
    if (body.type === "payment" || body.action === "payment.created" || body.action === "payment.updated") {
      const paymentId = body.data?.id;
      if (!paymentId) {
        return NextResponse.json({ received: true });
      }

      // Get payment details from MP
      const mpPayment = await paymentClient.get({ id: paymentId });

      if (!mpPayment || !mpPayment.external_reference) {
        return NextResponse.json({ received: true });
      }

      const orderId = mpPayment.external_reference;

      // Map MP status to our order status
      let orderStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
      if (mpPayment.status === "approved") orderStatus = "PAID";
      if (mpPayment.status === "rejected" || mpPayment.status === "cancelled") {
        orderStatus = "CANCELLED";
      }

      // Upsert payment record
      await prisma.payment.upsert({
        where: { orderId },
        create: {
          orderId,
          mpPaymentId: String(paymentId),
          mpStatus: mpPayment.status || null,
          mpDetail: mpPayment.status_detail || null,
          amount: mpPayment.transaction_amount || 0,
          method: mpPayment.payment_type_id || null,
          rawData: JSON.parse(JSON.stringify(mpPayment)),
        },
        update: {
          mpPaymentId: String(paymentId),
          mpStatus: mpPayment.status || null,
          mpDetail: mpPayment.status_detail || null,
          amount: mpPayment.transaction_amount || 0,
          method: mpPayment.payment_type_id || null,
          rawData: JSON.parse(JSON.stringify(mpPayment)),
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
      });

      // If cancelled, restore stock
      if (orderStatus === "CANCELLED") {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });
        for (const item of orderItems) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderId, paymentId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId requerido" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // If already has a payment record, return current status
    if (order.payment) {
      return NextResponse.json({
        status: order.status,
        paymentStatus: order.payment.mpStatus,
      });
    }

    // If we have a paymentId from MP redirect, verify it directly
    if (paymentId) {
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (mpResponse.ok) {
        const mpPayment = await mpResponse.json();

        // Verify this payment belongs to this order
        if (mpPayment.external_reference === orderId) {
          let orderStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
          if (mpPayment.status === "approved") orderStatus = "PAID";
          if (mpPayment.status === "rejected" || mpPayment.status === "cancelled") {
            orderStatus = "CANCELLED";
          }

          // Create payment record
          await prisma.payment.create({
            data: {
              orderId,
              mpPaymentId: String(paymentId),
              mpStatus: mpPayment.status || null,
              mpDetail: mpPayment.status_detail || null,
              amount: mpPayment.transaction_amount || 0,
              method: mpPayment.payment_type_id || null,
              rawData: mpPayment,
            },
          });

          // Update order status
          await prisma.order.update({
            where: { id: orderId },
            data: { status: orderStatus },
          });

          // If cancelled, restore stock
          if (orderStatus === "CANCELLED") {
            for (const item of order.items) {
              await prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }

          return NextResponse.json({
            status: orderStatus,
            paymentStatus: mpPayment.status,
          });
        }
      }
    }

    return NextResponse.json({
      status: order.status,
      paymentStatus: null,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Error al verificar el pago" },
      { status: 500 }
    );
  }
}

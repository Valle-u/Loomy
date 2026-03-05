import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preferenceClient } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId requerido" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { name: true, images: true } } },
            },
          },
        },
        user: { select: { email: true, name: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const preference = await preferenceClient.create({
      body: {
        items: order.items.map((item) => ({
          id: item.variantId,
          title: item.variant.product.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: "ARS",
          picture_url: item.variant.product.images[0] || undefined,
        })),
        payer: {
          email: order.user.email,
          name: order.user.name || undefined,
        },
        back_urls: {
          success: `${baseUrl}/checkout/resultado?status=success&order=${orderId}`,
          pending: `${baseUrl}/checkout/resultado?status=pending&order=${orderId}`,
          failure: `${baseUrl}/checkout/resultado?status=failure&order=${orderId}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/payments/webhook`,
        external_reference: orderId,
        statement_descriptor: "LUMMY",
      },
    });

    return NextResponse.json({
      initPoint: preference.init_point,
      preferenceId: preference.id,
    });
  } catch (error) {
    console.error("Error creating MP preference:", error);
    return NextResponse.json(
      { error: "Error al crear preferencia de pago" },
      { status: 500 }
    );
  }
}

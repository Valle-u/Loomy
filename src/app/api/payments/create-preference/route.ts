import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

    const body: Record<string, unknown> = {
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
      external_reference: orderId,
      statement_descriptor: "LOOMY",
    };

    // auto_return requires HTTPS back_urls — skip on localhost to avoid MP validation error
    if (!isLocalhost) {
      body.auto_return = "approved";
      body.notification_url = `${baseUrl}/api/payments/webhook`;
    }

    console.log("MP preference request body:", JSON.stringify(body, null, 2));

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const preference = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("MP API error:", preference);
      return NextResponse.json(
        { error: "Error al crear preferencia de pago" },
        { status: 500 }
      );
    }

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

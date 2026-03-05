import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, items } = await request.json();

    if (!userId || !items?.length) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Verify stock and calculate total
    let total = 0;
    const orderItems: { variantId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { select: { price: true } } },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variante no encontrada: ${item.variantId}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para la variante seleccionada` },
          { status: 400 }
        );
      }

      const unitPrice = variant.priceOverride ?? variant.product.price;
      total += unitPrice * item.quantity;
      orderItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // Create order and reduce stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          subtotal: total,
          status: "PENDING",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: { include: { variant: { include: { product: true } } } },
        },
      });

      // Reduce stock
      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, categoryId, images, featured, active, variants } = body;

    let slug: string | undefined;
    if (name) {
      slug = slugify(name);
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.$transaction(async (tx) => {
      // Update product
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(name && { name, slug }),
          ...(description !== undefined && { description }),
          ...(price != null && { price: parseFloat(price) }),
          ...(categoryId !== undefined && { categoryId: categoryId || null }),
          ...(images && { images }),
          ...(featured !== undefined && { featured }),
          ...(active !== undefined && { active }),
        },
      });

      // Update variants if provided
      if (variants) {
        // Delete removed variants
        await tx.productVariant.deleteMany({
          where: {
            productId: id,
            id: { notIn: variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id) },
          },
        });

        // Upsert variants
        for (const v of variants) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                size: v.size || null,
                color: v.color || null,
                stock: v.stock || 0,
                sku: v.sku || null,
                priceOverride: v.priceOverride ? parseFloat(String(v.priceOverride)) : null,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                size: v.size || null,
                color: v.color || null,
                stock: v.stock || 0,
                sku: v.sku || null,
                priceOverride: v.priceOverride ? parseFloat(String(v.priceOverride)) : null,
              },
            });
          }
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { variants: true, category: true },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

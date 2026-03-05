import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, images, featured, active, variants } = body;

    if (!name || price == null) {
      return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 });
    }

    const slug = slugify(name);

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        price: parseFloat(price),
        categoryId: categoryId || null,
        images: images || [],
        featured: featured || false,
        active: active !== false,
        variants: {
          create:
            variants?.map((v: { size?: string; color?: string; stock?: number; sku?: string; priceOverride?: number }) => ({
              size: v.size || null,
              color: v.color || null,
              stock: v.stock || 0,
              sku: v.sku || null,
              priceOverride: v.priceOverride ? parseFloat(String(v.priceOverride)) : null,
            })) || [],
        },
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}

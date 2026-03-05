import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/store/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, images: true },
  });

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description || `Comprá ${product.name} en Lummy`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: {
        orderBy: [{ size: "asc" }, { color: "asc" }],
      },
    },
  });

  if (!product) notFound();

  return <ProductDetail product={product} />;
}

import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/store/ProductGrid";
import CatalogFilters from "@/components/store/CatalogFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explorá todas nuestras prendas. Filtrá por categoría, talle y precio.",
};

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const where: Record<string, unknown> = { active: true };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.featured === "true") {
    where.featured = true;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (params.sort === "price_asc") orderBy = { price: "asc" };
  if (params.sort === "price_desc") orderBy = { price: "desc" };
  if (params.sort === "name") orderBy = { name: "asc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy,
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-3">
            {params.category || params.featured === "true"
              ? "Filtrando"
              : "Todas las prendas"}
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-bold tracking-tight">
            Catálogo
          </h1>
          <p className="text-muted text-sm mt-2">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-56 flex-shrink-0">
            <CatalogFilters
              categories={categories}
              currentCategory={params.category}
              currentSort={params.sort}
              currentSearch={params.search}
            />
          </aside>

          <div className="flex-1">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}

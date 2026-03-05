import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/store/HeroSection";
import ProductGrid from "@/components/store/ProductGrid";
import FeaturedSection from "@/components/store/FeaturedSection";
import CategoriesShowcase from "@/components/store/CategoriesShowcase";
import NewsletterSection from "@/components/store/NewsletterSection";

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      include: { category: { select: { name: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { category: { select: { name: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
  ]);

  return (
    <>
      <HeroSection />

      <FeaturedSection />

      {/* Categories */}
      {categories.length > 0 && (
        <CategoriesShowcase categories={categories} />
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <ProductGrid
            products={featuredProducts}
            title="Destacados"
            viewAllHref="/catalogo?featured=true"
          />
        </section>
      )}

      {/* New arrivals */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
        <ProductGrid
          products={newProducts}
          title="Lo Más Nuevo"
          viewAllHref="/catalogo"
        />
      </section>

      <NewsletterSection />
    </>
  );
}

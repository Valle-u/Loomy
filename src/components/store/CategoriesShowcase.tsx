"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

export default function CategoriesShowcase({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] uppercase tracking-[0.3em] text-muted mb-4"
        >
          Explorá por categoría
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl font-bold tracking-tight"
        >
          Categorías
        </motion.h2>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto"
            >
              <Link
                href={`/catalogo?category=${cat.slug}`}
                className="group block relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 1024px) 320px, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-[family-name:var(--font-syne)] text-lg sm:text-xl font-bold text-background mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-background/60 text-[12px] uppercase tracking-[0.15em]">
                      {cat._count.products}{" "}
                      {cat._count.products === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

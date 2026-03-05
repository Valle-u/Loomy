"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: { name: string } | null;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  viewAllHref?: string;
}

export default function ProductGrid({
  products,
  title,
  viewAllHref,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-muted text-sm">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <div className="flex items-end justify-between mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl font-bold tracking-tight"
          >
            {title}
          </motion.h2>
          {viewAllHref && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href={viewAllHref}
                className="text-[12px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition-colors duration-300 font-medium flex items-center gap-2"
              >
                Ver todo
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category?: { name: string } | null;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasImage = product.images.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/catalogo/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#F0F0F0] overflow-hidden mb-4">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Hover overlay with CTA */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <span className="inline-block bg-foreground text-background text-[11px] font-medium px-5 py-2.5 uppercase tracking-[0.15em]">
              Ver producto
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          {product.category && (
            <p className="text-[11px] text-muted uppercase tracking-[0.15em]">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-medium leading-snug group-hover:text-muted transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-[family-name:var(--font-syne)] text-sm font-bold">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

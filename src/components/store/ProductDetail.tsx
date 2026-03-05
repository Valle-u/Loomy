"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import VariantSelector from "./VariantSelector";

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string | null;
  priceOverride: number | null;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    images: string[];
    category: { id: string; name: string; slug: string } | null;
    variants: Variant[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] || null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const price = selectedVariant?.priceOverride ?? product.price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  function handleAddToCart() {
    if (!selectedVariant || !inStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0] || "",
      price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity,
      stock: selectedVariant.stock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-muted mb-10 flex items-center gap-2 flex-wrap">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/catalogo"
            className="hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
          {product.category && (
            <>
              <span className="text-border">/</span>
              <Link
                href={`/catalogo?category=${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="text-border">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <motion.div
              className="relative aspect-[3/4] bg-[#F0F0F0] overflow-hidden"
              layoutId={`product-image-${product.id}`}
            >
              {product.images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-light">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
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
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      i === selectedImageIndex
                        ? "border-foreground"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info - sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {product.category && (
                <p className="text-[11px] text-muted uppercase tracking-[0.2em]">
                  {product.category.name}
                </p>
              )}

              <h1 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl font-bold tracking-tight">
                {product.name}
              </h1>

              <p className="font-[family-name:var(--font-syne)] text-xl sm:text-2xl font-bold">
                {formatPrice(price)}
              </p>

              {product.description && (
                <p className="text-muted text-sm leading-relaxed border-t border-border-light pt-6">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="border-t border-border-light pt-6">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariantId={selectedVariant?.id || null}
                    onSelect={(v) => setSelectedVariant(v as Variant)}
                  />
                </div>
              )}

              {/* Stock */}
              {selectedVariant && (
                <p
                  className={`text-[12px] uppercase tracking-wider font-medium ${
                    inStock ? "text-success" : "text-error"
                  }`}
                >
                  {inStock
                    ? `${selectedVariant.stock} disponibles`
                    : "Agotado"}
                </p>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
                  Cantidad
                </h3>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-sm hover:bg-border-light transition-colors"
                  >
                    &minus;
                  </button>
                  <span className="px-5 py-2.5 text-sm font-medium min-w-[48px] text-center border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedVariant?.stock || 1, quantity + 1)
                      )
                    }
                    className="px-4 py-2.5 text-sm hover:bg-border-light transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!selectedVariant || !inStock}
                className={`w-full py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                  addedToCart
                    ? "bg-success text-white"
                    : inStock
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-border text-muted cursor-not-allowed"
                }`}
              >
                {addedToCart
                  ? "Agregado al carrito"
                  : inStock
                  ? "Agregar al carrito"
                  : "Sin stock"}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

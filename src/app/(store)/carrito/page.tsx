"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-24 sm:pt-28 pb-20 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 px-6"
        >
          <div className="w-16 h-16 mx-auto border border-border-light flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-light"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-muted text-sm">
              Explorá nuestro catálogo y encontrá lo que buscás
            </p>
          </div>
          <Link href="/catalogo">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
            >
              Ver catálogo
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-3">
            Tu selección
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-bold tracking-tight">
            Carrito
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden sm:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-4 border-b border-border text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              <span>Producto</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Subtotal</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_40px] gap-4 items-center py-6 border-b border-border-light"
                >
                  {/* Product */}
                  <div className="flex gap-4">
                    <Link
                      href={`/catalogo/${item.productSlug}`}
                      className="relative w-20 h-24 flex-shrink-0 bg-[#F0F0F0] overflow-hidden"
                    >
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-light text-xs">
                          Sin imagen
                        </div>
                      )}
                    </Link>
                    <div className="space-y-1.5 min-w-0">
                      <Link
                        href={`/catalogo/${item.productSlug}`}
                        className="text-sm font-medium hover:text-muted transition-colors block truncate"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-[11px] text-muted uppercase tracking-wider">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                      <p className="text-sm font-semibold sm:hidden">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-border w-fit mx-auto sm:mx-0">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-sm hover:bg-border-light transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium min-w-[32px] text-center border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-sm hover:bg-border-light transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-semibold text-right hidden sm:block">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-muted hover:text-error transition-colors justify-self-end"
                    aria-label="Eliminar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="border border-border p-8 space-y-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                Resumen del pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Envío</span>
                  <span className="text-muted text-xs uppercase tracking-wider">
                    A calcular
                  </span>
                </div>
                <div className="border-t border-border-light pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-[family-name:var(--font-syne)] text-lg font-bold">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                >
                  Ir al checkout
                </motion.button>
              </Link>

              <Link
                href="/catalogo"
                className="block text-center text-[12px] text-muted hover:text-foreground uppercase tracking-[0.1em] transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

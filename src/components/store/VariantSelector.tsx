"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
  sku?: string | null;
  priceOverride: number | null;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const selectedSize = selectedVariant?.size;
  const selectedColor = selectedVariant?.color;

  function findVariant(size: string | null, color: string | null) {
    return variants.find(
      (v) =>
        (size ? v.size === size : !v.size) &&
        (color ? v.color === color : !v.color)
    );
  }

  function handleSizeSelect(size: string) {
    const variant = findVariant(size, selectedColor || null);
    if (variant) onSelect(variant);
  }

  function handleColorSelect(color: string) {
    const variant = findVariant(selectedSize || null, color);
    if (variant) onSelect(variant);
  }

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">
            Talle
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = findVariant(size!, selectedColor || null);
              const outOfStock = !variant || variant.stock === 0;
              const isSelected = selectedSize === size;

              return (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSizeSelect(size!)}
                  disabled={outOfStock}
                  className={cn(
                    "min-w-[48px] h-10 px-4 text-sm border transition-all duration-200",
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground",
                    outOfStock && "opacity-30 cursor-not-allowed line-through"
                  )}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">
            Color {selectedColor && <span className="font-normal normal-case text-muted">— {selectedColor}</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = findVariant(selectedSize || null, color!);
              const outOfStock = !variant || variant.stock === 0;
              const isSelected = selectedColor === color;

              return (
                <motion.button
                  key={color}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(color!)}
                  disabled={outOfStock}
                  className={cn(
                    "min-w-[48px] h-10 px-4 text-sm border transition-all duration-200",
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground",
                    outOfStock && "opacity-30 cursor-not-allowed line-through"
                  )}
                >
                  {color}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

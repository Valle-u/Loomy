"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Variant {
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  priceOverride: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string | null;
    images: string[];
    featured: boolean;
    active: boolean;
    variants: {
      id: string;
      size: string | null;
      color: string | null;
      stock: number;
      sku: string | null;
      priceOverride: number | null;
    }[];
  };
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    categoryId: product?.categoryId || "",
    images: product?.images?.join("\n") || "",
    featured: product?.featured || false,
    active: product?.active !== false,
  });

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      size: v.size || "",
      color: v.color || "",
      stock: v.stock,
      sku: v.sku || "",
      priceOverride: v.priceOverride?.toString() || "",
    })) || [{ size: "", color: "", stock: 0, sku: "", priceOverride: "" }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateVariant(index: number, field: string, value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { size: "", color: "", stock: 0, sku: "", priceOverride: "" },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      categoryId: form.categoryId || null,
      images,
      variants: variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        size: v.size || null,
        color: v.color || null,
        stock: Number(v.stock),
        sku: v.sku || null,
        priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
      })),
    };

    const url = isEditing ? `/api/products/${product.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al guardar");
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <p className="text-sm text-error p-3 border border-error/20 bg-error/5">
          {error}
        </p>
      )}

      {/* Basic info */}
      <div className="space-y-4 border border-border-light p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          Información básica
        </h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="w-full px-4 py-3 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Precio base (ARS) *
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Categoría
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full px-4 py-3 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
            URLs de imágenes (una por línea)
          </label>
          <textarea
            value={form.images}
            onChange={(e) => updateField("images", e.target.value)}
            rows={3}
            placeholder="https://res.cloudinary.com/..."
            className="w-full px-4 py-3 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors resize-none font-mono"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Activo</span>
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4 border border-border-light p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Variantes
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors"
          >
            + Agregar variante
          </button>
        </div>

        {variants.map((variant, i) => (
          <div
            key={i}
            className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end p-4 bg-border-light/30 border border-border-light"
          >
            <div>
              <label className="block text-xs text-muted mb-1">Talle</label>
              <input
                type="text"
                value={variant.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                placeholder="M"
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Color</label>
              <input
                type="text"
                value={variant.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
                placeholder="Negro"
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Stock</label>
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => updateVariant(i, "stock", e.target.value)}
                min={0}
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">SKU</label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariant(i, "sku", e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Precio esp.</label>
              <input
                type="number"
                step="0.01"
                value={variant.priceOverride}
                onChange={(e) => updateVariant(i, "priceOverride", e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-error text-sm hover:text-error/80 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-foreground text-background text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border border-border text-sm font-semibold uppercase tracking-widest hover:bg-border-light transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

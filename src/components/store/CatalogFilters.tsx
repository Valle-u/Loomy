"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}

export default function CatalogFilters({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasFilters = !!(currentCategory || currentSort || currentSearch);

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search || null);
  }

  const filterContent = (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
          Buscar
        </h3>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-4 py-2.5 text-sm border border-border bg-transparent focus:border-foreground outline-none transition-colors pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
          Categorías
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateFilter("category", null)}
              className={`text-sm w-full text-left py-1.5 transition-colors ${
                !currentCategory
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateFilter("category", cat.slug)}
                className={`text-sm w-full text-left py-1.5 transition-colors ${
                  currentCategory === cat.slug
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
          Ordenar
        </h3>
        <ul className="space-y-1">
          {[
            { value: "", label: "Más recientes" },
            { value: "price_asc", label: "Precio: menor a mayor" },
            { value: "price_desc", label: "Precio: mayor a menor" },
            { value: "name", label: "Nombre A-Z" },
          ].map((option) => (
            <li key={option.value}>
              <button
                onClick={() => updateFilter("sort", option.value || null)}
                className={`text-sm w-full text-left py-1.5 transition-colors ${
                  (currentSort || "") === option.value
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear */}
      {hasFilters && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push("/catalogo")}
          className="text-[12px] uppercase tracking-[0.1em] text-muted hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Limpiar filtros
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 text-sm font-medium mb-6 border border-border px-4 py-2.5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        Filtros
        {hasFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
        )}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden mb-8"
          >
            {filterContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-24">{filterContent}</div>
    </>
  );
}

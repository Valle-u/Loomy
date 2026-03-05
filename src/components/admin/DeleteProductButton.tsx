"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Estás seguro de que querés eliminar "${productName}"?`)) return;

    setLoading(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-error hover:text-error/80 underline underline-offset-4 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}

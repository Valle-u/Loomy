"use client";

import { useState } from "react";

const exports = [
  {
    id: "products",
    label: "Productos",
    description: "Todos los productos con variantes, precios y stock",
  },
  {
    id: "orders",
    label: "Pedidos",
    description: "Historial completo de pedidos con items y totales",
  },
  {
    id: "users",
    label: "Usuarios",
    description: "Lista de usuarios registrados con datos de contacto",
  },
  {
    id: "payments",
    label: "Pagos",
    description: "Historial de pagos con estado y método",
  },
];

export default function AdminExportPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(type: string) {
    setLoading(type);

    const res = await fetch(`/api/admin/export?type=${type}`);

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lummy-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Exportar Datos</h1>
      <p className="text-muted">Descargá los datos del sistema en formato CSV</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exports.map((item) => (
          <div
            key={item.id}
            className="border border-border-light p-6 space-y-4"
          >
            <div>
              <h3 className="font-semibold">{item.label}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
            <button
              onClick={() => handleExport(item.id)}
              disabled={loading === item.id}
              className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === item.id ? "Exportando..." : "Descargar CSV"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

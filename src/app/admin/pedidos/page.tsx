import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  PAID: "bg-success/10 text-success",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-error/10 text-error",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { id: true } },
      payment: { select: { mpStatus: true, method: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>

      <div className="border border-border-light overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left">
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">ID</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Cliente</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Items</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Total</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Pago</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Estado</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Fecha</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border-light hover:bg-border-light/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">
                  <p className="font-medium">{order.user.name || "Sin nombre"}</p>
                  <p className="text-xs text-muted">{order.user.email}</p>
                </td>
                <td className="px-6 py-4">{order.items.length}</td>
                <td className="px-6 py-4 font-semibold">{formatPrice(order.total)}</td>
                <td className="px-6 py-4 text-xs text-muted">
                  {order.payment?.method || "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || ""}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted">
                  No hay pedidos aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

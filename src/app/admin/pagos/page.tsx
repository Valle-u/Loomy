import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    approved: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    rejected: "bg-error/10 text-error",
    cancelled: "bg-error/10 text-error",
    in_process: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>

      <div className="border border-border-light overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left">
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">ID MP</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Cliente</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Monto</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Método</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Estado</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Detalle</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border-light hover:bg-border-light/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  {payment.mpPaymentId || "—"}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{payment.order.user.name || "—"}</p>
                  <p className="text-xs text-muted">{payment.order.user.email}</p>
                </td>
                <td className="px-6 py-4 font-semibold">{formatPrice(payment.amount)}</td>
                <td className="px-6 py-4 text-muted">{payment.method || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[payment.mpStatus || ""] || "bg-border-light text-muted"}`}>
                    {payment.mpStatus || "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-muted">{payment.mpDetail || "—"}</td>
                <td className="px-6 py-4 text-muted">
                  {new Date(payment.createdAt).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted">
                  No hay pagos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

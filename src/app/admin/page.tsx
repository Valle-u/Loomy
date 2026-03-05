import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import DashboardCharts from "@/components/admin/DashboardCharts";

export default async function AdminDashboard() {
  const [totalOrders, totalSales, totalCustomers, paidOrders, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { mpStatus: "approved" },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          payment: { select: { mpStatus: true } },
        },
      }),
    ]);

  const salesTotal = totalSales._sum.amount || 0;
  const averageTicket = paidOrders > 0 ? salesTotal / paidOrders : 0;

  // Sales by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySales = await prisma.payment.findMany({
    where: {
      mpStatus: "approved",
      createdAt: { gte: sixMonthsAgo },
    },
    select: { amount: true, createdAt: true },
  });

  const salesByMonth: Record<string, number> = {};
  monthlySales.forEach((p) => {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
    salesByMonth[key] = (salesByMonth[key] || 0) + p.amount;
  });

  const chartData = Object.entries(salesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));

  const stats = [
    { label: "Ventas Totales", value: formatPrice(salesTotal) },
    { label: "Pedidos", value: totalOrders.toString() },
    { label: "Clientes", value: totalCustomers.toString() },
    { label: "Ticket Promedio", value: formatPrice(averageTicket) },
  ];

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 border border-border-light bg-background"
          >
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="border border-border-light p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Ventas por Mes
          </h2>
          <DashboardCharts data={chartData} />
        </div>
      )}

      {/* Recent orders */}
      <div className="border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Pedidos Recientes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light text-left">
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                  Pedido
                </th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                  Cliente
                </th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                  Total
                </th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                  Estado
                </th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border-light hover:bg-border-light/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user.name || "Sin nombre"}</p>
                    <p className="text-xs text-muted">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    No hay pedidos aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

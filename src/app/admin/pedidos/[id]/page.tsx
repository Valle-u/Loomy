import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import OrderStatusChanger from "@/components/admin/OrderStatusChanger";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: { product: { select: { name: true, images: true } } },
          },
        },
      },
      payment: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedido</h1>
          <p className="text-sm text-muted font-mono">{order.id}</p>
        </div>
        <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer info */}
        <div className="border border-border-light p-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Cliente</h2>
          <div className="text-sm space-y-1">
            <p><span className="text-muted">Nombre:</span> {order.user.name || "—"}</p>
            <p><span className="text-muted">Email:</span> {order.user.email}</p>
            <p><span className="text-muted">Teléfono:</span> {order.user.phone || "—"}</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="border border-border-light p-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Pago</h2>
          {order.payment ? (
            <div className="text-sm space-y-1">
              <p><span className="text-muted">Estado MP:</span> {order.payment.mpStatus || "—"}</p>
              <p><span className="text-muted">Método:</span> {order.payment.method || "—"}</p>
              <p><span className="text-muted">Monto:</span> {formatPrice(order.payment.amount)}</p>
              <p><span className="text-muted">ID MP:</span> <span className="font-mono text-xs">{order.payment.mpPaymentId || "—"}</span></p>
              <p><span className="text-muted">Detalle:</span> {order.payment.mpDetail || "—"}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">Sin información de pago</p>
          )}
        </div>
      </div>

      {/* Order items */}
      <div className="border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Items del pedido
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Producto</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Variante</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Cantidad</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border-light">
                <td className="px-6 py-4 font-medium">{item.variant.product.name}</td>
                <td className="px-6 py-4 text-muted">
                  {[item.variant.size, item.variant.color].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4 text-right font-semibold">
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td colSpan={3} className="px-6 py-4 text-right">Total</td>
              <td className="px-6 py-4 text-right text-lg">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

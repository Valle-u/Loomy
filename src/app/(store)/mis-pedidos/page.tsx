import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Pedidos",
};

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

export default async function MyOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as { id: string }).id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: { select: { name: true, images: true, slug: true } } },
          },
        },
      },
      payment: { select: { mpStatus: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="pt-24 sm:pt-28 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-4">
            Mis Pedidos
          </h1>
          <p className="text-muted mb-6">Todavía no tenés pedidos</p>
          <Link
            href="/catalogo"
            className="inline-block px-8 py-3 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.15em]"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-3">
          Tu historial
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight mb-10">
          Mis Pedidos
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-border">
              <div className="p-6 flex flex-col sm:flex-row justify-between gap-4 border-b border-border bg-border-light/30">
                <div className="space-y-1">
                  <p className="text-[11px] text-muted">
                    Pedido <span className="font-mono">{order.id.slice(0, 8)}...</span>
                  </p>
                  <p className="text-sm text-muted">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-block px-3 py-1 rounded text-[11px] font-medium ${statusColors[order.status] || ""}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <p className="font-[family-name:var(--font-syne)] font-bold">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Link
                      href={`/catalogo/${item.variant.product.slug}`}
                      className="text-sm font-medium hover:text-muted transition-colors"
                    >
                      {item.variant.product.name}
                    </Link>
                    <span className="text-xs text-muted">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}
                    </span>
                    <span className="text-xs text-muted">x{item.quantity}</span>
                    <span className="ml-auto text-sm font-semibold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

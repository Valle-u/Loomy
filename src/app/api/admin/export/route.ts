import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));
  return [headerLine, ...dataLines].join("\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let csv = "";
  let filename = "export";

  switch (type) {
    case "products": {
      const products = await prisma.product.findMany({
        include: { category: true, variants: true },
      });

      const headers = ["ID", "Nombre", "Slug", "Precio", "Categoría", "Activo", "Destacado", "Talle", "Color", "Stock", "SKU"];
      const rows: string[][] = [];

      for (const p of products) {
        if (p.variants.length === 0) {
          rows.push([p.id, p.name, p.slug, String(p.price), p.category?.name || "", String(p.active), String(p.featured), "", "", "0", ""]);
        } else {
          for (const v of p.variants) {
            rows.push([p.id, p.name, p.slug, String(v.priceOverride || p.price), p.category?.name || "", String(p.active), String(p.featured), v.size || "", v.color || "", String(v.stock), v.sku || ""]);
          }
        }
      }

      csv = toCsv(headers, rows);
      filename = "productos";
      break;
    }

    case "orders": {
      const orders = await prisma.order.findMany({
        include: {
          user: { select: { email: true, name: true } },
          items: {
            include: {
              variant: { include: { product: { select: { name: true } } } },
            },
          },
          payment: { select: { mpStatus: true, method: true } },
        },
      });

      const headers = ["ID Pedido", "Email", "Cliente", "Total", "Estado", "Pago Estado", "Método Pago", "Producto", "Variante", "Cantidad", "Precio Unit", "Fecha"];
      const rows: string[][] = [];

      for (const o of orders) {
        for (const item of o.items) {
          rows.push([
            o.id, o.user.email, o.user.name || "",
            String(o.total), o.status,
            o.payment?.mpStatus || "", o.payment?.method || "",
            item.variant.product.name,
            [item.variant.size, item.variant.color].filter(Boolean).join("/"),
            String(item.quantity), String(item.unitPrice),
            o.createdAt.toISOString(),
          ]);
        }
      }

      csv = toCsv(headers, rows);
      filename = "pedidos";
      break;
    }

    case "users": {
      const users = await prisma.user.findMany({
        include: { orders: { select: { total: true } } },
      });

      const headers = ["ID", "Email", "Nombre", "Teléfono", "Rol", "Total Pedidos", "Total Gastado", "Registrado"];
      const rows = users.map((u) => [
        u.id, u.email, u.name || "", u.phone || "", u.role,
        String(u.orders.length),
        String(u.orders.reduce((sum, o) => sum + o.total, 0)),
        u.createdAt.toISOString(),
      ]);

      csv = toCsv(headers, rows);
      filename = "usuarios";
      break;
    }

    case "payments": {
      const payments = await prisma.payment.findMany({
        include: {
          order: { include: { user: { select: { email: true } } } },
        },
      });

      const headers = ["ID", "ID MP", "Email Cliente", "Monto", "Estado", "Detalle", "Método", "Fecha"];
      const rows = payments.map((p) => [
        p.id, p.mpPaymentId || "", p.order.user.email,
        String(p.amount), p.mpStatus || "", p.mpDetail || "",
        p.method || "", p.createdAt.toISOString(),
      ]);

      csv = toCsv(headers, rows);
      filename = "pagos";
      break;
    }

    default:
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      variants: { select: { id: true, stock: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="border border-border-light overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left">
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Producto
              </th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Categoría
              </th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Precio
              </th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Stock Total
              </th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Estado
              </th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id} className="border-b border-border-light hover:bg-border-light/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted">{product.variants.length} variantes</p>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {product.category?.name || "Sin categoría"}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={totalStock === 0 ? "text-error" : ""}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      product.active
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}>
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                  No hay productos. Creá el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

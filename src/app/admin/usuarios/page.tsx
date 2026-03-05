import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: { select: { id: true, total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>

      <div className="border border-border-light overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left">
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Nombre</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Email</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Teléfono</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Rol</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Pedidos</th>
              <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);
              return (
                <tr key={user.id} className="border-b border-border-light hover:bg-border-light/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name || "—"}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-muted">{user.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-border-light text-muted"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.orders.length} ({totalSpent > 0 ? `$${totalSpent.toLocaleString("es-AR")}` : "$0"})
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(user.createdAt).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

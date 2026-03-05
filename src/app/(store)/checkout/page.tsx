"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito");
    }
  }, [items, router]);

  // Form for guest or logged-in user
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      setForm((prev) => ({
        ...prev,
        email: user.email || "",
        name: user.name || "",
      }));
    }
  }, [session]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userId = (session?.user as { id?: string })?.id;

      // If not logged in, register first
      if (!userId) {
        if (!form.password) {
          setError("Creá una contraseña para tu cuenta");
          setLoading(false);
          return;
        }

        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            phone: form.phone,
            password: form.password,
          }),
        });

        if (!registerRes.ok) {
          const data = await registerRes.json();
          setError(data.error || "Error al crear la cuenta");
          setLoading(false);
          return;
        }

        const user = await registerRes.json();
        userId = user.id;
      }

      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        setError(data.error || "Error al crear el pedido");
        setLoading(false);
        return;
      }

      const order = await orderRes.json();

      // Create Mercado Pago preference
      const mpRes = await fetch("/api/payments/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!mpRes.ok) {
        setError("Error al crear el pago. Intentá de nuevo.");
        setLoading(false);
        return;
      }

      const { initPoint } = await mpRes.json();

      clearCart();
      window.location.href = initPoint;
    } catch {
      setError("Error inesperado. Intentá de nuevo.");
      setLoading(false);
    }
  }

  if (items.length === 0) return null;

  const isLoggedIn = status === "authenticated";

  const inputClass =
    "w-full px-4 py-3.5 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors";

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-3">
          Finalizar compra
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight mb-10">
          Checkout
        </h1>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Customer info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5">
                  {isLoggedIn ? "Tus datos" : "Creá tu cuenta para comprar"}
                </h2>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error p-3 border border-error/20 bg-error/5 mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                      disabled={isLoggedIn}
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      disabled={isLoggedIn}
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {!isLoggedIn && (
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5">
                        Contraseña (para tu cuenta)
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required={!isLoggedIn}
                        minLength={6}
                        className={inputClass}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <p className="text-xs text-muted mt-1">
                        Se creará una cuenta para que puedas ver tus pedidos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 h-fit">
                <div className="border border-border p-8 space-y-6">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Tu pedido
                  </h2>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted">
                            {[item.size, item.color].filter(Boolean).join(" / ")} x{item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Envío</span>
                      <span className="text-muted">A calcular</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="font-[family-name:var(--font-syne)] text-lg font-bold">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Procesando..." : "Pagar con Mercado Pago"}
                  </motion.button>

                  <p className="text-xs text-muted text-center">
                    Serás redirigido a Mercado Pago para completar el pago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear la cuenta");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Cuenta creada pero hubo un error al iniciar sesión");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  const inputClass =
    "w-full px-4 py-3.5 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight"
        >
          LOOMY
        </Link>
        <p className="text-muted text-sm mt-3">Creá tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-error text-center p-3.5 border border-error/20 bg-error/5"
          >
            {error}
          </motion.p>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
            className={inputClass}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass}
            placeholder="+54 11 1234-5678"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Contraseña *
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
            minLength={6}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Confirmar contraseña *
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            required
            className={inputClass}
            placeholder="Repetí tu contraseña"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </motion.button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline underline-offset-4 hover:text-muted transition-colors"
        >
          Ingresá
        </Link>
      </p>
    </motion.div>
  );
}

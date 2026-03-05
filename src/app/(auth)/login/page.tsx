"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/");
      router.refresh();
    }
  }

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
          LUMMY
        </Link>
        <p className="text-muted text-sm mt-3">Ingresá a tu cuenta</p>
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
            htmlFor="email"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-border bg-transparent text-sm focus:border-foreground outline-none transition-colors"
            placeholder="Tu contraseña"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-foreground text-background text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </motion.button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        ¿No tenés cuenta?{" "}
        <Link
          href="/registro"
          className="text-foreground font-medium underline underline-offset-4 hover:text-muted transition-colors"
        >
          Registrate
        </Link>
      </p>
    </motion.div>
  );
}

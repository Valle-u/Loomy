"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";

function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("order");
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
  const [verified, setVerified] = useState(false);

  // Verify payment with backend when returning from MercadoPago
  useEffect(() => {
    if (orderId && !verified) {
      setVerified(true);
      fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId }),
      }).catch(() => {});
    }
  }, [orderId, paymentId, verified]);

  const configs = {
    success: {
      title: "Pago aprobado",
      message: "Tu pedido fue procesado correctamente. Te enviaremos un email con los detalles.",
      color: "text-success",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    pending: {
      title: "Pago pendiente",
      message: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
      color: "text-warning",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    failure: {
      title: "Pago rechazado",
      message: "No pudimos procesar tu pago. Podés intentar de nuevo o usar otro medio de pago.",
      color: "text-error",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  };

  const config = configs[status as keyof typeof configs] || configs.failure;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className={`${config.color} mx-auto w-fit`}>{config.icon}</div>
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <p className="text-muted">{config.message}</p>
        {orderId && (
          <p className="text-sm text-muted">
            Pedido: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/catalogo">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-foreground text-background text-sm font-semibold uppercase tracking-widest"
            >
              Seguir comprando
            </motion.button>
          </Link>
          <Link href="/mis-pedidos">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border border-foreground text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              Ver mis pedidos
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-20 text-center text-muted">Cargando...</div>}>
      <ResultContent />
    </Suspense>
  );
}

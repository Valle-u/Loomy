"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="bg-foreground text-background py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.3em] text-background/40 mb-6"
          >
            Mantenete al día
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Sé el primero en enterarte
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-background/50 text-sm sm:text-base mb-10"
          >
            Nuevos drops, piezas vintage únicas y ofertas exclusivas directo a
            tu inbox.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            {submitted ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-success text-center w-full py-3"
              >
                ¡Gracias! Te mantendremos al día.
              </motion.p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-5 py-3.5 bg-background/10 border border-background/20 text-background text-sm placeholder:text-background/30 focus:border-background/50 outline-none transition-colors"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-background text-foreground text-[12px] font-semibold uppercase tracking-[0.15em] hover:bg-background/90 transition-colors"
                >
                  Suscribir
                </motion.button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

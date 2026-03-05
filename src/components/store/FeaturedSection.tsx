"use client";

import { motion } from "framer-motion";

export default function FeaturedSection() {
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      {/* Marquee strip */}
      <div className="border-y border-border py-5 mb-24 sm:mb-32 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-syne)] text-xl sm:text-2xl font-bold uppercase tracking-wider mx-8 text-foreground/10"
            >
              Estilo Único &bull; Calidad Garantizada &bull; Envío Nacional
              &bull; Mercado Pago &bull; Prendas Seleccionadas &bull;
            </span>
          ))}
        </div>
      </div>

      {/* Brand values */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-4">
          {/* Left column */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-6">
                Por qué Lummy
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
                Prendas que
                <br />
                cuentan historias
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-md">
                Seleccionamos cada pieza pensando en quién la va a usar.
                Ropa nueva con diseños propios y vintage curada con criterio.
              </p>
            </div>
          </motion.div>

          {/* Right - Feature cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                title: "Curación\nPersonal",
                desc: "Cada prenda es seleccionada a mano. No vas a encontrar lo mismo en otro lado.",
              },
              {
                num: "02",
                title: "Calidad\nReal",
                desc: "Revisamos cada pieza antes de que llegue a vos. Si no nos convence, no la vendemos.",
              },
              {
                num: "03",
                title: "Pagá como\nQuieras",
                desc: "Tarjeta, débito, transferencia o billetera virtual. Todo a través de Mercado Pago.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-6 sm:p-8 border border-border-light hover:border-foreground/20 transition-colors duration-500 bg-background"
              >
                <span className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-border-light group-hover:text-border transition-colors duration-500 leading-none">
                  {feature.num}
                </span>
                <h3 className="font-[family-name:var(--font-syne)] text-base font-bold mt-6 mb-3 whitespace-pre-line leading-tight">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

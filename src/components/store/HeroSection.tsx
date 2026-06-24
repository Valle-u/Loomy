"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-foreground text-background"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80"
          alt="Loomy Fashion"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
      </motion.div>

      {/* Marquee strip at top */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-background/10 overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[11px] uppercase tracking-[0.3em] text-background/40 mx-8 font-medium"
            >
              Nueva Colección Disponible &mdash; Envíos a Todo el País
              &mdash; Prendas Únicas &mdash;
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-28"
        style={{ opacity, scale }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Small intro text */}
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] uppercase tracking-[0.35em] text-background/50 mb-6 sm:mb-8 font-medium"
          >
            Moda con actitud &mdash; Buenos Aires
          </motion.p>

          {/* Main headline */}
          <div className="overflow-hidden mb-4 sm:mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-[family-name:var(--font-syne)] text-[clamp(3.5rem,12vw,11rem)] font-extrabold leading-[0.85] tracking-[-0.04em]"
            >
              LOOMY
            </motion.h1>
          </div>

          {/* Subtitle row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-background/50 text-sm sm:text-base max-w-sm leading-relaxed"
            >
              Prendas únicas que reflejan tu estilo.
              <br />
              Nueva colección y vintage seleccionado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Link href="/catalogo">
                <motion.span
                  className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-background/80 hover:text-background transition-colors duration-300 cursor-pointer"
                  whileHover="hover"
                >
                  Explorar catálogo
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    variants={{
                      hover: { x: 6 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </motion.svg>
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Scroll line */}
          <motion.div
            className="mt-12 sm:mt-16 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="w-12 h-[1px] bg-background/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              style={{ transformOrigin: "left" }}
            />
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-[10px] uppercase tracking-[0.3em] text-background/30"
            >
              Scroll
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

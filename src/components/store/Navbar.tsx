"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const cartCount = getTotalItems();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const showSolid = scrolled || !isHome || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolid
          ? "bg-background/90 backdrop-blur-xl border-b border-border-light"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span
              className={`font-[family-name:var(--font-syne)] text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-500 ${
                showSolid ? "text-foreground" : "text-background"
              }`}
            >
              LOOMY
            </span>
          </Link>

          {/* Center nav (desktop) */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <NavLink href="/" active={pathname === "/"} light={!showSolid}>
              Inicio
            </NavLink>
            <NavLink
              href="/catalogo"
              active={pathname.startsWith("/catalogo")}
              light={!showSolid}
            >
              Catálogo
            </NavLink>
            <NavLink
              href="/mis-pedidos"
              active={pathname === "/mis-pedidos"}
              light={!showSolid}
            >
              Pedidos
            </NavLink>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 z-10">
            <Link href="/carrito" className="relative group">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  showSolid
                    ? "hover:bg-foreground/5"
                    : "hover:bg-background/10"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-colors duration-500 ${
                    showSolid ? "text-foreground" : "text-background"
                  }`}
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0.5 right-0.5 bg-foreground text-background text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            <Link href="/login" className="hidden md:block">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  showSolid
                    ? "hover:bg-foreground/5"
                    : "hover:bg-background/10"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-colors duration-500 ${
                    showSolid ? "text-foreground" : "text-background"
                  }`}
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.div>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 z-[60]"
              aria-label="Menú"
            >
              <div className="flex flex-col gap-[5px] w-5">
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: 45, y: 7 }
                      : { rotate: 0, y: 0 }
                  }
                  className="block h-[1.5px] w-full origin-center"
                  style={{
                    background: menuOpen || showSolid ? "#0A0A0A" : "#FAFAFA",
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-[1.5px] w-full"
                  style={{
                    background: menuOpen || showSolid ? "#0A0A0A" : "#FAFAFA",
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0 }
                  }
                  className="block h-[1.5px] w-full origin-center"
                  style={{
                    background: menuOpen || showSolid ? "#0A0A0A" : "#FAFAFA",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 w-screen h-screen bg-background z-[55] md:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full gap-8">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/carrito", label: "Carrito" },
                { href: "/mis-pedidos", label: "Mis Pedidos" },
                { href: "/login", label: "Mi Cuenta" },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-bold text-foreground hover:text-muted transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
  light,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  light: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${
        light
          ? active
            ? "text-background"
            : "text-background/50 hover:text-background"
          : active
          ? "text-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className={`absolute -bottom-1.5 left-0 right-0 h-[1.5px] ${
            light ? "bg-background" : "bg-foreground"
          }`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

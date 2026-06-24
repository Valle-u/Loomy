import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight inline-block mb-4"
            >
              LOOMY
            </Link>
            <p className="text-muted text-sm max-w-sm leading-relaxed mb-6">
              Moda con actitud. Prendas nuevas y vintage seleccionadas que
              reflejan tu estilo personal. Desde Buenos Aires para todo el país.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-border-light hover:border-foreground/30 text-muted hover:text-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-border-light hover:border-foreground/30 text-muted hover:text-foreground transition-all duration-300"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5 text-foreground">
              Tienda
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/catalogo?featured=true", label: "Destacados" },
                { href: "/catalogo?category=vintage", label: "Vintage" },
                { href: "/catalogo?category=remeras", label: "Remeras" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5 text-foreground">
              Cuenta
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/login", label: "Iniciar Sesión" },
                { href: "/registro", label: "Crear Cuenta" },
                { href: "/mis-pedidos", label: "Mis Pedidos" },
                { href: "/carrito", label: "Carrito" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5 text-foreground">
              Info
            </h4>
            <ul className="space-y-3">
              <li className="text-sm text-muted">Buenos Aires, Argentina</li>
              <li>
                <a
                  href="mailto:hola@loomy.com"
                  className="text-sm text-muted hover:text-foreground transition-colors duration-300"
                >
                  hola@loomy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border-light flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-muted-light tracking-wide">
            &copy; {new Date().getFullYear()} Loomy. Todos los derechos
            reservados.
          </p>
          <p className="text-[11px] text-muted-light tracking-wide">
            Pagos seguros con Mercado Pago
          </p>
        </div>
      </div>
    </footer>
  );
}

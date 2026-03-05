import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lummy | Moda con Actitud",
    template: "%s | Lummy",
  },
  description:
    "Descubrí prendas únicas que reflejan tu estilo personal. Ropa nueva y vintage con envío a todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${syne.variable} antialiased grain`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Desarrollador de aplicaciones",
  description: "Portfolio técnico de Miquel Manzano: desarrollo de aplicaciones web, móviles e interactivas.",
  alternates: {
    canonical: "/",
    languages: { en: "/en", es: "/" },
  },
};

interface SpanishLayoutProps {
  readonly children: ReactNode;
}

export default function SpanishLayout({ children }: SpanishLayoutProps): React.JSX.Element {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${jetBrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

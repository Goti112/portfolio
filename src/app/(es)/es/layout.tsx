import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Desarrollador full-stack",
  description: "Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.",
  alternates: {
    canonical: "/es",
    languages: { en: "/", es: "/es" },
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

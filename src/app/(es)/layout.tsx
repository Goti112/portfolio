import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Desarrollador full-stack",
  description: "Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};

interface SpanishLayoutProps {
  readonly children: ReactNode;
}

export default function SpanishLayout({ children }: SpanishLayoutProps): React.JSX.Element {
  return (
    <html lang="es">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.querySelector("[data-motion-root]");if(r){var m=window.matchMedia("(prefers-reduced-motion: reduce)");r.dataset.motionState=m.matches?"reduced":"ready";}})()`,
          }}
        />
      </body>
    </html>
  );
}

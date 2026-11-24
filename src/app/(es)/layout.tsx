import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import { portfolioSpanish } from "@/content/portfolio.es";
import "../globals.css";

export const metadata: Metadata = {
  title: portfolioSpanish.meta.title,
  description: portfolioSpanish.meta.description,
  openGraph: {
    type: "website",
    url: "https://www.miquelmanzano.com/",
    siteName: "Miquel Manzano",
    locale: "es_ES",
    title: portfolioSpanish.meta.title,
    description: portfolioSpanish.meta.description,
    images: [{ url: "https://www.miquelmanzano.com/og.jpg", width: 1200, height: 630, alt: portfolioSpanish.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioSpanish.meta.title,
    description: portfolioSpanish.meta.description,
    images: ["https://www.miquelmanzano.com/og.jpg"],
  },
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

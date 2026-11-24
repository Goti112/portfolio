import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import { portfolioEnglish } from "@/content/portfolio.en";
import "../globals.css";

export const metadata: Metadata = {
  title: portfolioEnglish.meta.title,
  description: portfolioEnglish.meta.description,
  openGraph: {
    type: "website",
    url: "https://www.miquelmanzano.com/en",
    siteName: "Miquel Manzano",
    locale: "en_US",
    title: portfolioEnglish.meta.title,
    description: portfolioEnglish.meta.description,
    images: [{ url: "https://www.miquelmanzano.com/og.jpg", width: 1200, height: 630, alt: portfolioEnglish.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioEnglish.meta.title,
    description: portfolioEnglish.meta.description,
    images: ["https://www.miquelmanzano.com/og.jpg"],
  },
  alternates: {
    canonical: "/en",
    languages: { en: "/en", es: "/" },
  },
};

interface EnglishLayoutProps {
  readonly children: ReactNode;
}

export default function EnglishLayout({ children }: EnglishLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${jetBrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Full-stack developer",
  description: "Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.",
  alternates: {
    canonical: "/",
    languages: { en: "/", es: "/es" },
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

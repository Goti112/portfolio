import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, jetBrainsMono } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Application developer",
  description: "Technical portfolio of Miquel Manzano: web, mobile, and interactive application development.",
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

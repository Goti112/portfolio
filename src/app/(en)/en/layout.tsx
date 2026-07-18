import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Full-stack developer",
  description: "Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.",
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
};

interface EnglishLayoutProps {
  readonly children: ReactNode;
}

export default function EnglishLayout({ children }: EnglishLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
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

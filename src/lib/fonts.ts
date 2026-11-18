import localFont from "next/font/local";

export const archivo = localFont({
  src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2",
  variable: "--font-archivo",
  display: "swap",
  preload: true,
  weight: "100 900",
  style: "normal",
});

export const jetBrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  weight: "100 800",
  style: "normal",
});

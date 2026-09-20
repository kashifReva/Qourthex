import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({
  src: [
    { path: "../fonts/archivo/archivo-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/archivo/archivo-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/archivo/archivo-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../fonts/archivo/archivo-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../fonts/inter/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/inter/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/jetbrains-mono/jetbrains-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qourt Hex · Padel & Tennis Engineering",
  description:
    "Qourt Hex — Padel & Tennis Engineering in Qatar. We design, engineer, and maintain premium padel and tennis courts built for Qatar's conditions and delivered to premium standards.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon-180.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

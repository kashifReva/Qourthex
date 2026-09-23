import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { withBasePath } from "@/lib/assetPath";

// Oswald — the condensed, bold-cut display face behind most sports/athletic
// branding (scoreboards, league sites, jersey numerals). Swapped in as the
// site's headline font in place of Archivo for a more overtly "sports" feel.
const oswald = localFont({
  src: [
    { path: "../fonts/oswald/oswald-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/oswald/oswald-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/oswald/oswald-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-oswald",
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
    icon: withBasePath("/favicon.png"),
    apple: withBasePath("/favicon-180.png"),
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
      className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

"use client";

import { goTo } from "@/lib/scroll";

export default function FooterNavButton({ href, label }: { href: string; label: string }) {
  return <button onClick={() => goTo(href)}>{label}</button>;
}

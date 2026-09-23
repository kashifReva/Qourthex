"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { goTo } from "@/lib/scroll";
import { withBasePath } from "@/lib/assetPath";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#courts", label: "Court Systems" },
  { href: "#engineering", label: "Engineering" },
  { href: "#services", label: "Services" },
];

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { href: "#quote", label: "Request a Quote" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function navigate(href: string) {
    setMenuOpen(false);
    goTo(href);
  }

  return (
    <>
      <header id="siteHeader" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => navigate("#home")}>
            <Image src={withBasePath("/logo-lime.png")} alt="Qourt Hex" height={28} width={140} style={{ height: 28, width: "auto" }} priority />
          </button>
          <nav className="nav-links">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => navigate(l.href)}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="nav-right">
            <button className="btn-primary nav-cta" onClick={() => navigate("#quote")}>
              Initiate Build
            </button>
            <button className="menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <div className="mobile-menu-bg"></div>
        <div className="mobile-menu-inner">
          <div className="mmenu-top">
            <button className="menu-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="mmenu-nav">
            {MOBILE_LINKS.map((l, i) => (
              <button key={l.href} onClick={() => navigate(l.href)}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </nav>
          <div className="mmenu-foot">Excellence Tower &middot; Doha &middot; Qatar</div>
        </div>
      </div>
    </>
  );
}

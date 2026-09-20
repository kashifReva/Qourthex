"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { goTo } from "@/lib/scroll";
import Reveal from "./Reveal";

export default function Hero() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1000 1000");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.position = "absolute";
    svg.style.inset = "0";

    for (let i = 0; i < 16; i++) {
      const r = 30 + Math.random() * 90;
      const cx = Math.random() * 1000;
      const cy = Math.random() * 1000;
      const poly = document.createElementNS(svgNS, "polygon");
      const pts: string[] = [];
      for (let a = 0; a < 6; a++) {
        const ang = (Math.PI / 3) * a;
        pts.push((cx + Math.cos(ang) * r).toFixed(1) + "," + (cy + Math.sin(ang) * r).toFixed(1));
      }
      poly.setAttribute("points", pts.join(" "));
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke", "#D4FF00");
      poly.setAttribute("stroke-opacity", (0.08 + Math.random() * 0.22).toFixed(2));
      poly.setAttribute("stroke-width", "1");
      poly.style.animation =
        "floatHex " + (6 + Math.random() * 8).toFixed(1) + "s ease-in-out " + (Math.random() * 4).toFixed(1) + "s infinite";
      svg.appendChild(poly);
    }
    host.appendChild(svg);

    const styleTag = document.createElement("style");
    styleTag.textContent = "@keyframes floatHex{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}";
    document.head.appendChild(styleTag);

    return () => {
      host.removeChild(svg);
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-field hex-grid"></div>
      <div className="hero-field" id="heroHexes" ref={hostRef}></div>
      <div className="hero-vignette"></div>
      <div className="hero-coord mono">25&deg;17&prime;N &middot; 51&deg;32&prime;E &mdash; Doha</div>
      <div className="hero-sys mono">SYS / QH-01 // INTERACTIVE</div>

      <div className="wrap hero-content">
        <Image
          className="hero-logo"
          src="/logo-lime.png"
          alt="Qourt Hex — Padel & Tennis Engineering"
          height={60}
          width={300}
          style={{ height: 44, width: "auto" }}
          priority
        />
        <h1>
          <span className="lit text-glow">ENGINEER</span>
          <span className="dim">THE</span>
          <span className="lit text-glow">GAME</span>
        </h1>
        <p className="hero-lede">
          Precision padel &amp; tennis courts, engineered, built, and maintained for Qatar. Explore the systems behind the play.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary glow-accent" onClick={() => goTo("#quote")}>
            Initiate Your Build →
          </button>
          <button className="btn-text" onClick={() => goTo("#courts")}>
            Explore Court Systems
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <Reveal className="hero-stats">
          <div className="cell">
            <div className="v">14+</div>
            <div className="l mono">Years of Live-Event Standard</div>
          </div>
          <div className="cell">
            <div className="v">FIP</div>
            <div className="l mono">Approved Tournament Turf</div>
          </div>
          <div className="cell">
            <div className="v">12mm</div>
            <div className="l mono">Tempered Glass Systems</div>
          </div>
          <div className="cell">
            <div className="v">200W</div>
            <div className="l mono">LED Court Lighting</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

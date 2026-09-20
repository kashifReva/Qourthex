"use client";

import dynamic from "next/dynamic";
import { goTo } from "@/lib/scroll";
import Reveal from "./Reveal";

const Hero3DScene = dynamic(() => import("./Hero3DScene"), { ssr: false });

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-field hex-grid"></div>
      <div className="hero-field" id="heroHexes">
        <Hero3DScene />
      </div>
      <div className="hero-vignette"></div>
      <div className="hero-coord mono">25&deg;17&prime;N &middot; 51&deg;32&prime;E &mdash; Doha</div>
      <div className="hero-sys mono">SYS / QH-01 // INTERACTIVE</div>

      <div className="wrap hero-content">
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

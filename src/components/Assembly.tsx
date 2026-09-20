"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const STAGE_CARDS = [
  { n: "Stage 01", h: "Components scattered", p: "Hex glass panels, turf modules, and padel balls drift in the build space." },
  { n: "Stage 02", h: "The frame aligns", p: "Galvanized steel joints lock into position, mapping the 20 × 10 metre footprint." },
  { n: "Stage 03", h: "Glass walls rise", p: "12mm tempered panels lift into place, reinforced for Qatar's wind loads." },
  { n: "Stage 04", h: "The court appears", p: "Net tensioned. Turf laid. Lighting calibrated. Ready to play." },
];

export default function Assembly() {
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const scrollWrap = scrollWrapRef.current;
    if (!scrollWrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = () => window.matchMedia("(min-width:901px)").matches;

    function onAssemblyScroll() {
      if (!scrollWrap) return;
      if (reduceMotion || !isDesktop()) {
        setStage(3);
        return;
      }
      const rect = scrollWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setStage(3);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      setStage(Math.min(3, Math.floor(progress * 4)));
    }

    document.addEventListener("scroll", onAssemblyScroll, { passive: true });
    window.addEventListener("resize", onAssemblyScroll);
    onAssemblyScroll();

    return () => {
      document.removeEventListener("scroll", onAssemblyScroll);
      window.removeEventListener("resize", onAssemblyScroll);
    };
  }, []);

  return (
    <section className="assembly">
      <div className="wrap assembly-intro">
        <Reveal className="section-head" style={{ marginBottom: 0 }}>
          <div className="eyebrow">
            <span className="idx mono">// 04</span>
            <span className="rule"></span>
            <span className="label">Built, Piece By Piece</span>
          </div>
          <h2>
            From scattered parts to a court that&apos;s <span className="lime">ready to play.</span>
          </h2>
          <p className="assembly-note">
            Scroll to watch it come together: steel frame, tempered glass, tensioned net, laid turf, one system, engineered
            piece by piece.
          </p>
        </Reveal>
      </div>

      <div className="assembly-scroll" id="assemblyScroll" ref={scrollWrapRef}>
        <div className="assembly-pin">
          <div className="wrap assembly-inner">
            <div className="assembly-visual" id="assemblyVisual" data-stage={stage}>
              <svg
                viewBox="0 0 400 300"
                fill="none"
                role="img"
                aria-label="Diagram of a padel court assembling from steel posts, glass panels, net and turf"
              >
                <rect
                  className="assembly-part p-turf"
                  x="40"
                  y="40"
                  width="320"
                  height="220"
                  rx="4"
                  fill="#D4FF00"
                  fillOpacity="0.05"
                  stroke="#D4FF00"
                  strokeOpacity="0.35"
                  strokeWidth="1.4"
                />
                <line
                  className="assembly-part p-turf"
                  x1="200"
                  y1="40"
                  x2="200"
                  y2="260"
                  stroke="#D4FF00"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />

                <rect className="assembly-part p-panel-l" x="40" y="40" width="10" height="220" fill="#D4FF00" fillOpacity="0.14" />
                <rect className="assembly-part p-panel-r" x="350" y="40" width="10" height="220" fill="#D4FF00" fillOpacity="0.14" />

                <circle className="assembly-part p-post-tl" cx="40" cy="40" r="7" fill="#D4FF00" />
                <circle className="assembly-part p-post-tr" cx="360" cy="40" r="7" fill="#D4FF00" />
                <circle className="assembly-part p-post-bl" cx="40" cy="260" r="7" fill="#D4FF00" />
                <circle className="assembly-part p-post-br" cx="360" cy="260" r="7" fill="#D4FF00" />

                <rect className="assembly-part p-net" x="196" y="90" width="8" height="120" fill="#D4FF00" fillOpacity="0.5" />

                <circle className="assembly-part p-ball1" cx="130" cy="110" r="6" fill="#D4FF00" />
                <circle className="assembly-part p-ball2" cx="260" cy="150" r="6" fill="#D4FF00" />
                <circle className="assembly-part p-ball3" cx="180" cy="200" r="6" fill="#D4FF00" />
              </svg>
            </div>
            <div className="assembly-copy">
              <div className="assembly-progress" id="assemblyDots">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`assembly-dot${i <= stage ? " is-active" : ""}`} data-dot={i}></div>
                ))}
              </div>
              {STAGE_CARDS.map((card, i) => (
                <div key={i} className={`assembly-stage-card${i === stage ? " is-active" : ""}`} data-card={i}>
                  <div className="n mono">{card.n}</div>
                  <h4>{card.h}</h4>
                  <p>{card.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

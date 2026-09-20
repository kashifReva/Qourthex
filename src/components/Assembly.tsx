"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import StaticAssemblyDiagram from "./StaticAssemblyDiagram";

const Assembly3DScene = dynamic(() => import("./Assembly3DScene"), { ssr: false });

const STAGE_CARDS = [
  { n: "Stage 01", h: "Components scattered", p: "Hex glass panels, turf modules, and padel balls drift in the build space." },
  { n: "Stage 02", h: "The frame aligns", p: "Galvanized steel joints lock into position, mapping the 20 × 10 metre footprint." },
  { n: "Stage 03", h: "Glass walls rise", p: "12mm tempered panels lift into place, reinforced for Qatar's wind loads." },
  { n: "Stage 04", h: "The court appears", p: "Net tensioned. Turf laid. Lighting calibrated. Ready to play." },
];

export default function Assembly() {
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enabled3D, setEnabled3D] = useState(false);

  useEffect(() => {
    const scrollWrap = scrollWrapRef.current;
    if (!scrollWrap) return;

    const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduceMotionMQ);
    setEnabled3D(window.matchMedia("(min-width:901px)").matches);

    const isDesktop = () => window.matchMedia("(min-width:901px)").matches;
    let lastStage = -1;

    function onAssemblyScroll() {
      if (!scrollWrap) return;
      if (reduceMotionMQ || !isDesktop()) {
        progressRef.current = 1;
        if (lastStage !== 3) {
          lastStage = 3;
          setStage(3);
        }
        return;
      }
      const rect = scrollWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      let progress: number;
      if (total <= 0) {
        progress = 1;
      } else {
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        progress = scrolled / total;
      }
      progressRef.current = progress;
      const newStage = Math.min(3, Math.floor(progress * 4));
      if (newStage !== lastStage) {
        lastStage = newStage;
        setStage(newStage);
      }
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
              {enabled3D ? (
                <Assembly3DScene progressRef={progressRef} reduceMotion={reduceMotion} />
              ) : (
                <StaticAssemblyDiagram />
              )}
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

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const Assembly3DScene = dynamic(() => import("./Assembly3DScene"), { ssr: false });

const STAGE_CARDS = [
  {
    n: "Stage 01",
    tag: "Frame",
    h: "The frame aligns",
    p: "Galvanized steel joints lock into position, mapping the 20 × 10 metre footprint.",
  },
  {
    n: "Stage 02",
    tag: "Walls",
    h: "Glass walls rise",
    p: "12mm tempered panels lift into place, reinforced for Qatar's wind loads.",
  },
  {
    n: "Stage 03",
    tag: "Roof",
    h: "The roof locks in",
    p: "Cross-braced steel roofing spans the frame, engineered for sun, wind, and Doha summers.",
  },
  {
    n: "Stage 04",
    tag: "Court",
    h: "The court appears",
    p: "Net tensioned. Turf laid. Lighting calibrated. Ready to play.",
  },
];

export default function Assembly() {
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const scrollWrap = scrollWrapRef.current;
    if (!scrollWrap) return;

    const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduceMotionMQ);

    let lastStage = -1;

    function onAssemblyScroll() {
      if (!scrollWrap) return;
      if (reduceMotionMQ) {
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
          <div className="assembly-stagetag mono">
            <span className="assembly-stagetag-n">{STAGE_CARDS[stage].n}</span>
            <span className="assembly-stagetag-rule"></span>
            <span className="assembly-stagetag-label">{STAGE_CARDS[stage].tag}</span>
          </div>

          <div className="assembly-visual-full" id="assemblyVisual" data-stage={stage}>
            <Assembly3DScene progressRef={progressRef} reduceMotion={reduceMotion} />
          </div>

          <div className="wrap assembly-bottom">
            <div className="assembly-bars" id="assemblyBars">
              {STAGE_CARDS.map((card, i) => (
                <div key={i} className={`assembly-bar-row${i <= stage ? " is-active" : ""}`} data-bar={i}>
                  <span className="assembly-bar-track">
                    <span className="assembly-bar-fill"></span>
                  </span>
                  <span className="assembly-bar-label mono">{card.tag}</span>
                </div>
              ))}
            </div>

            <div className="assembly-stagecopy">
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

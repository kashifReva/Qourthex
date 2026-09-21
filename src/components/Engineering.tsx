"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Reveal from "./Reveal";
import StaticEngineeringDiagram from "./StaticEngineeringDiagram";

const EngineeringScene = dynamic(() => import("./EngineeringScene"), { ssr: false });

const FEATURES = [
  {
    icon: "turf",
    t: "Turf Systems",
    d: "FIP-approved, texturized monofilament PE fiber, 8-12mm pile, prefibrillated for consistent grip and bounce.",
  },
  {
    icon: "base",
    t: "Shock Pad & Base",
    d: "12-15mm closed-cell elastic pad over a compacted sub-base, absorbing impact and extending turf lifespan.",
  },
  {
    icon: "infill",
    t: "Infill",
    d: "Kiln-dried silica sand with rubber granulate, evenly distributed for consistent ball response underfoot.",
  },
  {
    icon: "canopy",
    t: "Canopy Membrane",
    d: "450 to 650g UV-resistant, waterproof, flame-retardant PVC-coated fabric rated for Gulf summers.",
  },
  {
    icon: "climate",
    t: "Climate Control",
    d: "Retractable roof structure on motorized tracks, deployed in under 3 minutes for all-weather, year-round play.",
  },
  {
    icon: "heat",
    t: "Heat Reduction",
    d: "Engineered shading geometry cuts surface temperature by up to 8 to 15°C under direct Qatar sun.",
  },
] as const;

function FeatureIcon({ icon }: { icon: (typeof FEATURES)[number]["icon"] }) {
  if (icon === "turf") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "base") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="15" width="18" height="5" rx="0.5" />
        <path d="M5 15v-2.5h14V15M7 12.5V11h10v1.5" strokeOpacity="0.6" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "infill") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="8" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="11" cy="6" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="9" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="8" cy="13" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="14" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="16" r="1.1" fill="currentColor" stroke="none" />
        <path d="M3 20h18" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>
    );
  }
  if (icon === "canopy") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 15a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 15H7z" strokeLinejoin="round" />
        <path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "climate") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v10M9 9l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="14" width="14" height="7" rx="1" />
    </svg>
  );
}

const HOURS = [6, 8, 10, 12, 14, 16, 18, 20];
// Relative shape of a Doha summer day, peaking at 14:00 — the slider sets
// that peak, the rest of the day scales off it.
const HOUR_FACTOR = [0.62, 0.72, 0.85, 0.95, 1, 0.97, 0.85, 0.7];
const DAY_SWING = 9;

function reductionFor(ambient: number) {
  return Math.round((ambient - 50) * 0.4 + 8);
}

function comfortFor(under: number) {
  if (under <= 28) return { label: "Comfortable", color: "#9be564" };
  if (under <= 34) return { label: "Warm", color: "#e6c94d" };
  if (under <= 40) return { label: "Hot", color: "#e69a4d" };
  return { label: "Extreme", color: "#e6604d" };
}

export default function Engineering() {
  const [temp, setTemp] = useState(38);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enabled3D, setEnabled3D] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setEnabled3D(window.matchMedia("(min-width:901px)").matches);
  }, []);

  const reduction = reductionFor(temp);
  const under = Math.max(temp - reduction, 24);
  const turfExcess = Math.round(14 + (temp - 30) * 0.32);
  const turfSurface = temp + turfExcess;
  const comfort = comfortFor(under);

  const dayCurve = useMemo(() => {
    return HOURS.map((h, i) => {
      const factor = HOUR_FACTOR[i];
      const ambient = Math.round(temp - (1 - factor) * DAY_SWING);
      const red = reductionFor(ambient);
      const canopy = Math.max(ambient - red, 24);
      return { h, ambient, canopy };
    });
  }, [temp]);

  const chart = useMemo(() => {
    const w = 320;
    const hpad = 8;
    const top = 8;
    const bottom = 58;
    const domainMin = 24;
    const domainMax = 60;
    const x = (i: number) => hpad + (i / (dayCurve.length - 1)) * (w - hpad * 2);
    const y = (v: number) => top + (1 - (v - domainMin) / (domainMax - domainMin)) * (bottom - top);
    const ambientPts = dayCurve.map((d, i) => `${x(i)},${y(d.ambient)}`).join(" ");
    const canopyPts = dayCurve.map((d, i) => `${x(i)},${y(d.canopy)}`).join(" ");
    const areaPts = `${x(0)},${bottom} ${canopyPts} ${x(dayCurve.length - 1)},${bottom}`;
    return { w, top, bottom, x, y, ambientPts, canopyPts, areaPts };
  }, [dayCurve]);

  return (
    <section className="section" id="engineering">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">
            <span className="idx mono">// 03</span>
            <span className="rule"></span>
            <span className="label">The Engineering Layer</span>
          </div>
          <h2>
            Macro-zoom into the <span className="lime">precision</span> behind the play.
          </h2>
        </Reveal>

        <div className="eng-grid">
          <Reveal className="eng-visual">
            {enabled3D ? (
              <EngineeringScene reduceMotion={reduceMotion} turfSurface={turfSurface} />
            ) : (
              <StaticEngineeringDiagram />
            )}
            <div className="hud-tag" style={{ top: "40%", left: 20 }}>
              ↳ MONOFILAMENT FIBER &middot; TEXTURIZED
            </div>
            <div className="hud-tag" style={{ bottom: "20%", right: 20 }}>
              HEX BOLT JOINT &middot; GALVANIZED ↲
            </div>
            <div className="hud-tag" style={{ top: 68, left: 20, color: "var(--w40)", borderColor: "rgba(255,255,255,0.15)" }}>
              CANOPY MEMBRANE
            </div>
            <div
              className="hud-tag mono"
              style={{ top: 16, right: 16, color: "var(--w40)", borderColor: "rgba(255,255,255,0.15)" }}
            >
              ZOOM 200%
            </div>
          </Reveal>

          <Reveal className="eng-copy">
            <p>
              Every QourtHex court is engineered from the ground up: a compacted base, shock-absorbing pad, and
              FIP-approved monofilament turf below, paired with a retractable canopy system above, selected for
              consistent grip, controlled slide, and predictable bounce in high-usage, high-heat venues.
            </p>

            <div className="eng-features">
              {FEATURES.map((f) => (
                <div className="eng-feature" key={f.t}>
                  <FeatureIcon icon={f.icon} />
                  <div className="t">{f.t}</div>
                  <div className="d">{f.d}</div>
                </div>
              ))}
            </div>

            <div className="slider-card">
              <div className="slider-head">
                <span className="l">Solar Load Simulator</span>
                <span className="r">QATAR &middot; SUMMER</span>
              </div>

              <div className="slider-stats">
                <div className="stat">
                  <div className="lab mono">Ambient</div>
                  <div className="val">{temp}&deg;</div>
                </div>
                <div className="stat">
                  <div className="lab mono">Turf Surface</div>
                  <div className="val warn">{turfSurface}&deg;</div>
                </div>
                <div className="stat">
                  <div className="lab mono">Under Canopy</div>
                  <div className="val good">{under}&deg;</div>
                </div>
              </div>

              <div className="comfort-badge" style={{ color: comfort.color, borderColor: comfort.color }}>
                <span className="dot" style={{ background: comfort.color }}></span>
                {comfort.label} under canopy
              </div>

              <div className="range-custom">
                <input
                  type="range"
                  min={30}
                  max={55}
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  style={{ "--range-pct": `${((temp - 30) / 25) * 100}%` } as React.CSSProperties}
                />
                <div className="range-ticks">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i}></span>
                  ))}
                </div>
                <div className="slider-scale">
                  <span>30&deg;C</span>
                  <span className="mid">↓ {reduction}&deg; reduction</span>
                  <span>55&deg;C</span>
                </div>
              </div>

              <div className="eng-chart">
                <div className="eng-chart-head mono">
                  <span>AMBIENT VS UNDER CANOPY &middot; TYPICAL DAY</span>
                </div>
                <svg viewBox={`0 0 ${chart.w} 74`} fill="none">
                  <polygon points={chart.areaPts} fill={LIME_FILL} />
                  <polyline points={chart.ambientPts} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" />
                  <polyline points={chart.canopyPts} fill="none" stroke="#bbff2e" strokeWidth="1.6" />
                  {dayCurve.map((d, i) => (
                    <circle key={i} cx={chart.x(i)} cy={chart.y(d.canopy)} r="2" fill="#bbff2e" />
                  ))}
                </svg>
                <div className="eng-chart-axis mono">
                  {HOURS.map((h) => (
                    <span key={h}>{h}:00</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const LIME_FILL = "rgba(187,255,46,0.08)";

"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Engineering() {
  const [temp, setTemp] = useState(50);
  const reduction = Math.round((temp - 50) * 0.4 + 8);
  const under = Math.max(temp - reduction, 24);

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
            <svg viewBox="0 0 400 400" fill="none">
              <defs>
                <pattern id="weavepat" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M0 8h16M8 0v16" stroke="#D4FF00" strokeOpacity="0.12" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#weavepat)" />
              <circle cx="200" cy="200" r="70" stroke="#D4FF00" strokeOpacity="0.4" strokeWidth="1.2" />
              <circle cx="200" cy="200" r="3" fill="#D4FF00" />
              <line x1="130" y1="130" x2="270" y2="270" stroke="#D4FF00" strokeOpacity="0.25" strokeWidth="1" />
            </svg>
            <div className="hud-tag" style={{ top: "22%", left: 24 }}>
              ↳ MONOFILAMENT FIBER &middot; TEXTURIZED
            </div>
            <div className="hud-tag" style={{ bottom: "26%", right: 24 }}>
              HEX BOLT JOINT &middot; GALVANIZED ↲
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
              We offer certified, competition-ready turf and surface systems selected to deliver consistent grip, controlled
              slide, and predictable bounce, durable for high-usage venues. Our padel turf includes FIP-approved systems,
              engineered with internationally certified manufacturers.
            </p>

            <div className="eng-features">
              <div className="eng-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
                </svg>
                <div className="t">Turf Systems</div>
                <div className="d">FIP-approved, texturized monofilament to prefibrillated polypropylene</div>
              </div>
              <div className="eng-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 15a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 15H7z" strokeLinejoin="round" />
                  <path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" strokeLinecap="round" />
                </svg>
                <div className="t">Canopy Membrane</div>
                <div className="d">450 to 650g UV-resistant, waterproof, flame-retardant fabric</div>
              </div>
              <div className="eng-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="t">Climate Control</div>
                <div className="d">Retractable roofs for all-weather, year-round play</div>
              </div>
              <div className="eng-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v10M9 9l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="5" y="14" width="14" height="7" rx="1" />
                </svg>
                <div className="t">Heat Reduction</div>
                <div className="d">Engineered shading to lower surface temperature in the Qatar sun</div>
              </div>
            </div>

            <div className="slider-card">
              <div className="slider-head">
                <span className="l">Solar Load Simulator</span>
                <span className="r">QATAR &middot; SUMMER</span>
              </div>
              <div className="slider-vals">
                <div>
                  <div className="lab mono">Ambient</div>
                  <div className="amb">{temp}&deg;</div>
                </div>
                <div>
                  <div className="lab mono">Under Canopy</div>
                  <div className="under">{under}&deg;</div>
                </div>
              </div>
              <input
                type="range"
                min={30}
                max={55}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
              />
              <div className="slider-scale">
                <span>30&deg;C</span>
                <span className="mid">↓ {reduction}&deg; reduction</span>
                <span>55&deg;C</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

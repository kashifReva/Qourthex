"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import CourtIllustration from "./CourtIllustration";

const COURTS = [
  {
    id: "panoramic",
    code: "QH-PAN",
    name: "Panoramic Court",
    tagline: "Immersive spectator visibility",
    desc: "A premium panoramic court engineered for strong wind loads and sideline visibility, built for an elevated player and spectator experience.",
    specs: [
      ["Glass", "12mm Tempered"],
      ["Wind Load", "Reinforced"],
      ["Lighting", "200W LED"],
      ["Visibility", "Full Sideline"],
    ],
  },
  {
    id: "standard",
    code: "QH-STD",
    name: "Standard Court",
    tagline: "Robust, wind-ready, durable",
    desc: "A robust, wind-ready court system for indoor or outdoor venues, featuring reinforced structure, tempered glass panels, and consistent play over the long term.",
    specs: [
      ["Glass", "Tempered Panels"],
      ["Wind Load", "Wind-Ready"],
      ["Lighting", "LED Array"],
      ["Use", "Indoor / Outdoor"],
    ],
  },
  {
    id: "portable",
    code: "QH-PRT",
    name: "Portable Court",
    tagline: "Modular. Quick-install. Relocatable.",
    desc: "A modular, quick-install court for maximum flexibility, easy to relocate and adapt to different venue sizes, built on a robust steel frame with interlocking joints for stable, consistent play.",
    specs: [
      ["Install", "Quick Modular"],
      ["Frame", "Interlocking Steel"],
      ["Panels", "Impact-Resistant"],
      ["Use", "Temporary / Multi-Use"],
    ],
  },
];

function SpecIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 9h16M9 4v16" strokeOpacity="0.5" />
    </svg>
  );
}

export default function CourtMatrix() {
  const [active, setActive] = useState(0);
  const c = COURTS[active];

  return (
    <section className="section alt" id="courts">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">
            <span className="idx mono">// 02</span>
            <span className="rule"></span>
            <span className="label">The Court Matrix</span>
          </div>
          <h2>
            Three systems. One <span className="lime">standard</span> of engineering.
          </h2>
        </Reveal>

        <Reveal className="court-tabs" id="courtTabs">
          {COURTS.map((court, i) => (
            <button
              key={court.id}
              className={`court-tab${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <div className="code mono">{court.code}</div>
              <div className="name">{court.name}</div>
            </button>
          ))}
        </Reveal>

        <Reveal className="court-display" id="courtDisplay">
          <div className="court-visual">
            <CourtIllustration variant={c.id as "panoramic" | "standard" | "portable"} />
            <div className="chip mono">{c.code} / SPEC SHEET</div>
            <div className="caption mono">Blue hour &middot; Doha &middot; {c.name}</div>
          </div>
          <div>
            <div className="court-tagline mono">{c.tagline}</div>
            <h3 className="court-name">{c.name}</h3>
            <p className="court-desc">{c.desc}</p>
            <div className="court-specs">
              {c.specs.map(([k, v]) => (
                <div className="court-spec" key={k}>
                  <SpecIcon />
                  <div>
                    <div className="k mono">{k}</div>
                    <div className="v">{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

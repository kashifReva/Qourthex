"use client";

import Image from "next/image";
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
    footprint: "20 × 10m",
    photo: "/images/courts/panoramic.jpg" as string | null,
    specs: [
      ["Glass", "12mm Tempered"],
      ["Wind Load", "Reinforced"],
      ["Lighting", "200W LED"],
      ["Visibility", "Full Sideline"],
    ],
    compare: { glass: "12mm full glass box", wind: "Reinforced, high", install: "4-5 weeks", bestFor: "Flagship / spectator venues" },
  },
  {
    id: "standard",
    code: "QH-STD",
    name: "Standard Court",
    tagline: "Robust, wind-ready, durable",
    desc: "A robust, wind-ready court system for indoor or outdoor venues, featuring reinforced structure, tempered glass panels, and consistent play over the long term.",
    footprint: "20 × 10m",
    photo: "/images/courts/standard.jpg" as string | null,
    specs: [
      ["Glass", "Tempered Panels"],
      ["Wind Load", "Wind-Ready"],
      ["Lighting", "LED Array"],
      ["Use", "Indoor / Outdoor"],
    ],
    compare: { glass: "Back-wall glass panel", wind: "Wind-ready, standard", install: "3-4 weeks", bestFor: "Clubs / everyday play" },
  },
  {
    id: "portable",
    code: "QH-PRT",
    name: "Portable Court",
    tagline: "Modular. Quick-install. Relocatable.",
    desc: "A modular, quick-install court for maximum flexibility, easy to relocate and adapt to different venue sizes, built on a robust steel frame with interlocking joints for stable, consistent play.",
    footprint: "20 × 10m",
    photo: "/images/courts/portable.jpg" as string | null,
    specs: [
      ["Install", "Quick Modular"],
      ["Frame", "Interlocking Steel"],
      ["Panels", "Impact-Resistant"],
      ["Use", "Temporary / Multi-Use"],
    ],
    compare: { glass: "Impact-resistant mesh panel", wind: "Moderate, seasonal", install: "1-2 weeks", bestFor: "Events / temporary sites" },
  },
];

const COMPARE_ROWS: { key: keyof (typeof COURTS)[number]["compare"]; label: string }[] = [
  { key: "glass", label: "Enclosure" },
  { key: "wind", label: "Wind Rating" },
  { key: "install", label: "Install Time" },
  { key: "bestFor", label: "Best For" },
];

// Distinct icon per spec so the sheet reads at a glance instead of one
// repeated generic square.
function SpecIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  if (key.includes("glass") || key.includes("panel")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="11" height="18" rx="1" />
        <rect x="10" y="7" width="11" height="14" rx="1" strokeOpacity="0.55" />
        <path d="M4 8h11M4 13h11" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (key.includes("wind")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 8h11a2.5 2.5 0 1 0-2.3-3.4" />
        <path d="M3 13h15a2.5 2.5 0 1 1-2.3 3.4" />
        <path d="M3 18h9a2 2 0 1 0-1.8-2.8" strokeOpacity="0.6" />
      </svg>
    );
  }
  if (key.includes("light")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v2M4.2 4.2l1.4 1.4M2 12h2M19.8 4.2l-1.4 1.4M22 12h-2" strokeOpacity="0.5" />
        <path d="M9 21h6M10 18h4" />
        <path d="M12 6a5 5 0 0 0-3 9c.6.5 1 1.1 1 1.8V18h4v-1.2c0-.7.4-1.3 1-1.8a5 5 0 0 0-3-9Z" />
      </svg>
    );
  }
  if (key.includes("visib")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (key.includes("install")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L14.7 6.3Z" />
      </svg>
    );
  }
  if (key.includes("frame")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M3 3l18 18M21 3 3 21" strokeOpacity="0.5" />
      </svg>
    );
  }
  if (key.includes("use")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    );
  }
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
            {c.photo ? (
              <Image src={c.photo} alt={c.name} fill sizes="(min-width: 900px) 50vw, 100vw" className="court-visual-photo" priority={active === 0} />
            ) : (
              <CourtIllustration variant={c.id as "panoramic" | "standard" | "portable"} />
            )}
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
                  <SpecIcon label={k} />
                  <div>
                    <div className="k mono">{k}</div>
                    <div className="v">{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="court-compare" id="courtCompare">
          <div className="court-compare-head">
            <span className="idx mono">// AT A GLANCE</span>
            <span className="court-compare-title">How the three systems compare</span>
          </div>
          <div className="court-compare-table" role="table">
            <div className="court-compare-row court-compare-row--head" role="row">
              <div className="court-compare-cell court-compare-cell--label" role="columnheader" />
              {COURTS.map((court, i) => (
                <div
                  className={`court-compare-cell court-compare-cell--head${i === active ? " is-active" : ""}`}
                  role="columnheader"
                  key={court.id}
                >
                  <button type="button" onClick={() => setActive(i)} className="court-compare-head-btn">
                    <span className="code mono">{court.code}</span>
                    <span>{court.name}</span>
                  </button>
                </div>
              ))}
            </div>
            {COMPARE_ROWS.map((row) => (
              <div className="court-compare-row" role="row" key={row.key}>
                <div className="court-compare-cell court-compare-cell--label mono" role="rowheader">
                  {row.label}
                </div>
                {COURTS.map((court, i) => (
                  <div
                    className={`court-compare-cell${i === active ? " is-active" : ""}`}
                    role="cell"
                    key={court.id}
                  >
                    {court.compare[row.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

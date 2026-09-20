"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const COURT_TYPES = [
  { code: "QH-PAN", label: "Panoramic" },
  { code: "QH-STD", label: "Standard" },
  { code: "QH-PRT", label: "Portable" },
  { code: "QH-TEN", label: "Tennis" },
  { code: "QH-FPAN", label: "Full Panoramic" },
  { code: "QH-WPC", label: "WP Challenge" },
];

const SURFACES = [
  "FIP-Approved Padel Turf",
  "Texturized Monofilament (Semi-Sanded)",
  "Prefibrillated Polypropylene",
  "Curly Filament System",
  "Tennis Surface System",
];

type QState = {
  courtType: string;
  quantity: number;
  location: string;
  surface: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const EMPTY_STATE: QState = {
  courtType: "",
  quantity: 1,
  location: "",
  surface: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export default function QuoteForm() {
  const [q, setQ] = useState<QState>(EMPTY_STATE);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Recomputed on every render from current state — a field change on ANY
  // step immediately reflects in the Continue button, never stale.
  function canNext(): boolean {
    if (step === 1) return !!q.courtType;
    if (step === 2) return !!q.location && q.quantity > 0;
    return true;
  }

  const nextDisabled = !canNext() && step < 3;

  const rows: [string, string][] = [];
  if (q.courtType) rows.push(["Court Type", q.courtType]);
  if (q.quantity > 0) rows.push(["Quantity", `${q.quantity} court(s)`]);
  if (q.location) rows.push(["Location", q.location]);
  if (q.surface) rows.push(["Surface", q.surface]);

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleNext() {
    if (step < 3) {
      if (canNext()) setStep(step + 1);
      return;
    }
    if (!q.name || !q.email) {
      setError("Please provide your name and email.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  function resetForm() {
    setQ(EMPTY_STATE);
    setStep(1);
    setError("");
    setSubmitted(false);
  }

  return (
    <section className="section" id="quote">
      <div className="hero-field hex-grid" style={{ opacity: 0.5 }}></div>
      <div className="wrap" style={{ position: "relative" }}>
        <Reveal className="section-head">
          <div className="eyebrow">
            <span className="idx mono">// 06</span>
            <span className="rule"></span>
            <span className="label">Lead Gen Nexus</span>
          </div>
          <h2>
            Configure your <span className="lime">build.</span>
          </h2>
        </Reveal>

        <div className={`qsuccess${submitted ? " active" : ""}`} id="quoteSuccess">
          <div className="mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Build request received.</h3>
          <p id="successMsg">
            {submitted
              ? `Thank you, ${q.name.split(" ")[0]}. The Qourt Hex engineering team will review your project coordinates and reach out within 48 hours to begin your consultation.`
              : ""}
          </p>
          <button className="btn-text" style={{ color: "var(--lime)", margin: "0 auto" }} onClick={resetForm}>
            Submit another request →
          </button>
        </div>

        {!submitted && (
          <Reveal className="quote-grid" id="quoteFormWrap">
            <div className="quote-summary">
              <div className="qs-top">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
                </svg>
                <span>Project Summary</span>
              </div>
              <div className="qs-ct" id="qsCourtType">
                {q.courtType || "—"}
              </div>
              <div className="qs-rows" id="qsRows">
                {rows.length === 0 ? (
                  <p className="qs-empty mono">Your configuration will build here as you make selections...</p>
                ) : (
                  rows.map(([k, v]) => (
                    <div className="qs-row" key={k}>
                      <span className="k mono">{k}</span>
                      <span className="v">{v}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="qs-step mono" id="qsStepLabel">
                Step {step} / 3 — Qourt Hex Configurator
              </div>
            </div>

            <div>
              <div className="step-indicator">
                <div className="si-item">
                  <div className={`si-dot${step >= 1 ? " active" : ""}`} id="dot1">
                    {step > 1 ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      1
                    )}
                  </div>
                  <div className={`si-line${step > 1 ? " done" : ""}`} id="line1"></div>
                </div>
                <div className="si-item">
                  <div className={`si-dot${step >= 2 ? " active" : ""}`} id="dot2">
                    {step > 2 ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      2
                    )}
                  </div>
                  <div className={`si-line${step > 2 ? " done" : ""}`} id="line2"></div>
                </div>
                <div className="si-item" style={{ flex: 0 }}>
                  <div className={`si-dot${step >= 3 ? " active" : ""}`} id="dot3">
                    3
                  </div>
                </div>
              </div>

              <div className={`qstep${step === 1 ? " active" : ""}`} id="qstep1">
                <h3>Select your court type</h3>
                <p className="sub">Choose the system that fits your venue.</p>
                <div className="ct-grid" id="ctGrid">
                  {COURT_TYPES.map((ct) => (
                    <button
                      key={ct.code}
                      className={`ct-opt${q.courtType === ct.label ? " sel" : ""}`}
                      onClick={() => setQ((s) => ({ ...s, courtType: ct.label }))}
                    >
                      <div className="code mono">{ct.code}</div>
                      <div className="lab">{ct.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`qstep${step === 2 ? " active" : ""}`} id="qstep2">
                <h3>Quantity &amp; location</h3>
                <p className="sub">How many courts, and where in Qatar?</p>
                <label
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: ".12em",
                    color: "var(--w40)",
                    marginBottom: 12,
                  }}
                >
                  Number of Courts
                </label>
                <div className="qty-row">
                  <button
                    className="qty-btn"
                    id="qtyMinus"
                    onClick={() => setQ((s) => ({ ...s, quantity: Math.max(1, s.quantity - 1) }))}
                  >
                    &minus;
                  </button>
                  <div className="qty-val" id="qtyVal">
                    {q.quantity}
                  </div>
                  <button className="qty-btn" id="qtyPlus" onClick={() => setQ((s) => ({ ...s, quantity: s.quantity + 1 }))}>
                    +
                  </button>
                </div>
                <div className="qfield">
                  <label>Project Location</label>
                  <input
                    type="text"
                    id="qLocation"
                    placeholder="e.g. The Pearl, Lusail, West Bay..."
                    value={q.location}
                    onChange={(e) => setQ((s) => ({ ...s, location: e.target.value }))}
                  />
                </div>
                <div className="qfield">
                  <label>Surface Requirements</label>
                  <div className="surface-chips" id="surfaceChips">
                    {SURFACES.map((surf) => (
                      <button
                        key={surf}
                        className={`chip-opt${q.surface === surf ? " sel" : ""}`}
                        onClick={() => setQ((s) => ({ ...s, surface: surf }))}
                      >
                        {surf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`qstep${step === 3 ? " active" : ""}`} id="qstep3">
                <h3>Your details</h3>
                <p className="sub">Where should we send the consultation?</p>
                <div className="form-grid2">
                  <div className="qfield">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      id="qName"
                      placeholder="Your name"
                      value={q.name}
                      onChange={(e) => setQ((s) => ({ ...s, name: e.target.value }))}
                    />
                  </div>
                  <div className="qfield">
                    <label>Email *</label>
                    <input
                      type="email"
                      id="qEmail"
                      placeholder="you@company.com"
                      value={q.email}
                      onChange={(e) => setQ((s) => ({ ...s, email: e.target.value }))}
                    />
                  </div>
                  <div className="qfield">
                    <label>Phone</label>
                    <input
                      type="tel"
                      id="qPhone"
                      placeholder="+974 ..."
                      value={q.phone}
                      onChange={(e) => setQ((s) => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                  <div className="qfield">
                    <label>Company / Organization</label>
                    <input
                      type="text"
                      id="qCompany"
                      placeholder="Organization"
                      value={q.company}
                      onChange={(e) => setQ((s) => ({ ...s, company: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="qfield">
                  <label>Project Notes</label>
                  <textarea
                    id="qMessage"
                    placeholder="Tell us about your facility, timeline, or vision..."
                    value={q.message}
                    onChange={(e) => setQ((s) => ({ ...s, message: e.target.value }))}
                  />
                </div>
                {error && (
                  <div className="qerror" id="qError">
                    {error}
                  </div>
                )}
              </div>

              <div className="qnav">
                <button className="btn-text" id="qBack" style={{ visibility: step === 1 ? "hidden" : "visible" }} onClick={handleBack}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
                <button className="btn-primary" id="qNext" disabled={nextDisabled} onClick={handleNext}>
                  {step < 3 ? (
                    <>
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  ) : (
                    "Submit Build Request"
                  )}
                </button>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

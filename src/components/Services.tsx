import Reveal from "./Reveal";

const SERVICES = [
  {
    n: "01",
    title: "Lighting Systems",
    desc: "Court lighting designed for clear visibility and night play, performance-focused installation and alignment.",
    icon: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    n: "02",
    title: "Nets & Court Equipment",
    desc: "Competition-grade nets and equipment, installed to spec for consistent, tournament-ready play.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" strokeOpacity="0.5" />
      </>
    ),
  },
  {
    n: "03",
    title: "Consulting & Facility Concept",
    desc: "End-to-end facility planning, from site assessment to court layout, flow, and venue experience.",
    icon: (
      <>
        <path d="M3 21V9l9-6 9 6v12" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    n: "04",
    title: "Accessories & Venue Setup",
    desc: "Benches, gates, protective elements, and branding touches, finishing details that elevate the venue.",
    icon: (
      <path
        d="M4 20v-6a2 2 0 012-2h12a2 2 0 012 2v6M6 12V7a2 2 0 012-2h8a2 2 0 012 2v5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    n: "05",
    title: "Maintenance",
    desc: "Planned inspections, cleaning, tuning, and repairs keeping play quality, safety, and finish consistent.",
    icon: (
      <path
        d="M14.7 6.3a3 3 0 010 4.24l-4.16 4.16a3 3 0 01-4.24-4.24l1.06-1.06M9.3 17.7a3 3 0 010-4.24l4.16-4.16a3 3 0 014.24 4.24l-1.06 1.06"
        strokeLinecap="round"
      />
    ),
  },
  {
    n: "06",
    title: "Renewals & Transitions",
    desc: "Surface renewal and system upgrades to extend the life and performance of your investment.",
    icon: (
      <path
        d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 5v4h4M20 19v-4h-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Services() {
  return (
    <section className="section alt" id="services">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">
            <span className="idx mono">// 05</span>
            <span className="rule"></span>
            <span className="label">Full Facility Solutions</span>
          </div>
          <h2>
            Beyond the court. <span className="lime">Everything</span> that keeps it playing.
          </h2>
        </Reveal>
        <Reveal className="services-grid">
          {SERVICES.map((s) => (
            <div className="service" key={s.n}>
              <div className="service-top">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {s.icon}
                </svg>
                <span className="n mono">{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

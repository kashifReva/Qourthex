import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal className="about-grid">
          <div className="eyebrow-col">
            <div className="eyebrow">
              <span className="idx mono">// 01</span>
              <span className="rule"></span>
              <span className="label">Who We Are</span>
            </div>
          </div>
          <div className="head-col">
            <h2>
              Born from <span className="lime">14+ years</span> of delivering Qatar&apos;s most high-profile live moments.
            </h2>
          </div>
        </Reveal>
        <Reveal className="about-copy">
          <p>
            Where pressure is real, details matter, and the audience feels everything, Qourt Hex was created to bring that same
            standard into sport. We&apos;ve spent years on the front line of community gatherings and major tennis events,
            learning what makes people show up, stay longer, and come back.
          </p>
          <p>
            That&apos;s why we chose padel and tennis, not just to &ldquo;build courts,&rdquo; but to build places where
            connection happens naturally. We engineer courts with the mindset of a live event, so the court feels effortless,
            and the experience feels unforgettable.
          </p>
        </Reveal>
        <Reveal className="pillars">
          <div className="pillar">
            <div className="pillar-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  d="M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="n mono">01</span>
            </div>
            <h3>Community First</h3>
            <p>A well-built court becomes a social destination, not just an amenity, a place where connection happens naturally.</p>
          </div>
          <div className="pillar">
            <div className="pillar-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
              </svg>
              <span className="n mono">02</span>
            </div>
            <h3>Engineered Quality</h3>
            <p>Premium finish, safety, and performance built with the mindset of a live event, where every detail matters.</p>
          </div>
          <div className="pillar">
            <div className="pillar-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  d="M14.7 6.3a3 3 0 010 4.24l-4.16 4.16a3 3 0 01-4.24-4.24l1.06-1.06M9.3 17.7a3 3 0 010-4.24l4.16-4.16a3 3 0 014.24 4.24l-1.06 1.06"
                  strokeLinecap="round"
                />
              </svg>
              <span className="n mono">03</span>
            </div>
            <h3>Long-Term Care</h3>
            <p>Planned maintenance keeps everything playing beautifully over time, so the experience stays effortless.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

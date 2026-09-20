import Image from "next/image";
import FooterNavButton from "./FooterNavButton";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#courts", label: "Court Systems" },
  { href: "#engineering", label: "Engineering" },
  { href: "#services", label: "Services" },
  { href: "#quote", label: "Request a Quote" },
];

export default function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer>
      <div className="hex-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }}></div>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="foot-grid">
          <div className="foot-brand-col">
            <Image src="/logo-lime.png" alt="Qourt Hex" height={34} width={170} style={{ height: 34, width: "auto" }} />
            <p>
              Padel &amp; tennis engineering for Qatar. We design, build, and maintain premium courts that perform every day,
              built for performance, designed for community.
            </p>
            <div className="foot-ar mono">QOURT HEX</div>
          </div>
          <div className="foot-links-col">
            <div className="foot-title">Navigate</div>
            <ul>
              {NAV.map((l) => (
                <li key={l.href}>
                  <FooterNavButton href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-contact-col">
            <div className="foot-title">Excellence Tower &middot; Doha</div>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.4" />
                </svg>
                <span>
                  Zone 63, Street 850, Building 10
                  <br />
                  Office 3403, Doha, Qatar
                  <br />
                  PO Box 10116, Excellence Tower
                </span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <a href="mailto:info@qourthex.com">info@qourthex.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
                </svg>
                <a href="tel:+97466444291">+974 6644 4291</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span id="footYear">&copy; {year} Qourt Hex &middot; Padel &amp; Tennis Engineering</span>
          <span>Engineered in Doha &middot; Built for Qatar</span>
        </div>
      </div>
    </footer>
  );
}

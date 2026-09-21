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
            <div className="foot-social">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8.5v3H11v7h3z" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    d="M13 3v11.2a2.8 2.8 0 11-2.2-2.74M13 3a5.5 5.5 0 004.8 4.6M13 6.2a5.5 5.5 0 004.8 3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7.5 10v6.5M7.5 7.2v.1M12 16.5V13a2 2 0 014 0v3.5M12 10v6.5" strokeLinecap="round" />
                </svg>
              </a>
              <a href="https://wa.me/97466444291" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    d="M20.5 11.6a8.4 8.4 0 01-12.2 7.5L4 20l1-4.1a8.4 8.4 0 1115.5-4.3z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.2 9.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.2.1.4.1.5-.1.1-.2.5-.6.7-.8.2-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.1.4.3 0 .2 0 1-.3 1.4-.3.4-1.4 1-2.3.9-.9-.1-2.6-.7-3.9-2-1.6-1.5-2.6-3.3-2.8-3.7-.2-.4-1-1.6-1-3 0-1.4.7-2.1 1-2.4z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
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

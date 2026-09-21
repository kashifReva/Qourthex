// Flat SVG fallback for the Engineering section's blueprint visual, shown
// below the 3D breakpoint (mobile / reduced-motion) so nothing heavier than
// an SVG ever has to mount there.
export default function StaticEngineeringDiagram() {
  return (
    <svg viewBox="0 0 400 400" fill="none">
      <defs>
        <pattern id="weavepat-static" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 8h16M8 0v16" stroke="#D4FF00" strokeOpacity="0.12" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#weavepat-static)" />
      <circle cx="200" cy="200" r="70" stroke="#D4FF00" strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="3" fill="#D4FF00" />
      <line x1="130" y1="130" x2="270" y2="270" stroke="#D4FF00" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

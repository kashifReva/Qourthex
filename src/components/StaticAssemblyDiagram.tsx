// Lightweight, fully-assembled flat diagram used on mobile / when the
// viewer prefers reduced motion instead of mounting the WebGL scene.
export default function StaticAssemblyDiagram() {
  return (
    <svg viewBox="0 0 400 300" fill="none" role="img" aria-label="Diagram of an assembled padel court: steel posts, glass panels, net and turf">
      <rect x="40" y="40" width="320" height="220" rx="4" fill="#bbff2e" fillOpacity="0.05" stroke="#bbff2e" strokeOpacity="0.35" strokeWidth="1.4" />
      <line x1="200" y1="40" x2="200" y2="260" stroke="#bbff2e" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="40" y="40" width="10" height="220" fill="#bbff2e" fillOpacity="0.14" />
      <rect x="350" y="40" width="10" height="220" fill="#bbff2e" fillOpacity="0.14" />
      <circle cx="40" cy="40" r="7" fill="#bbff2e" />
      <circle cx="360" cy="40" r="7" fill="#bbff2e" />
      <circle cx="40" cy="260" r="7" fill="#bbff2e" />
      <circle cx="360" cy="260" r="7" fill="#bbff2e" />
      <rect x="196" y="90" width="8" height="120" fill="#bbff2e" fillOpacity="0.5" />
      <circle cx="130" cy="110" r="6" fill="#bbff2e" />
      <circle cx="260" cy="150" r="6" fill="#bbff2e" />
      <circle cx="180" cy="200" r="6" fill="#bbff2e" />
    </svg>
  );
}

type Variant = "panoramic" | "standard" | "portable";

// Hand-built isometric-style court illustrations, one per system, sharing a
// projection so posts/floor/glass line up consistently across variants.
// Floor corners in a simple oblique projection (front-left, front-right, back-right, back-left).
const FLOOR = {
  fl: [30, 132],
  fr: [190, 132],
  br: [214, 60],
  bl: [54, 60],
} as const;

function floorPath() {
  const { fl, fr, br, bl } = FLOOR;
  return `M${fl[0]},${fl[1]} L${fr[0]},${fr[1]} L${br[0]},${br[1]} L${bl[0]},${bl[1]} Z`;
}

function lerp(a: number[], b: number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function Post({ base, height, id }: { base: [number, number]; height: number; id: string }) {
  return (
    <g>
      <line x1={base[0]} y1={base[1]} x2={base[0]} y2={base[1] - height} stroke="#bbff2e" strokeWidth="2" strokeOpacity="0.85" />
      <circle cx={base[0]} cy={base[1] - height} r="2.4" fill="#bbff2e" />
      <circle cx={base[0]} cy={base[1]} r="2" fill="#bbff2e" fillOpacity="0.6" id={id} />
    </g>
  );
}

function GlassWall({ a, b, height, gradId, opacity = 1 }: { a: [number, number]; b: [number, number]; height: number; gradId: string; opacity?: number }) {
  const path = `M${a[0]},${a[1]} L${b[0]},${b[1]} L${b[0]},${b[1] - height} L${a[0]},${a[1] - height} Z`;
  return (
    <g opacity={opacity}>
      <path d={path} fill={`url(#${gradId})`} stroke="#bbff2e" strokeOpacity="0.4" strokeWidth="1" />
      <line x1={(a[0] + b[0]) / 2} y1={a[1] + (b[1] - a[1]) / 2} x2={(a[0] + b[0]) / 2} y2={a[1] + (b[1] - a[1]) / 2 - height} stroke="#bbff2e" strokeOpacity="0.2" strokeWidth="0.75" />
    </g>
  );
}

export default function CourtIllustration({ variant }: { variant: Variant }) {
  const { fl, fr, br, bl } = FLOOR;
  const gid = `g-${variant}`;

  return (
    <svg viewBox="-55 -8 300 200" fill="none">
      <defs>
        <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbff2e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#bbff2e" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`${gid}-floor`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bbff2e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#bbff2e" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${gid}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fb400" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8fb400" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* back walls, drawn first so the floor/front posts sit above them */}
      {variant === "panoramic" && (
        <>
          <GlassWall a={bl as unknown as [number, number]} b={br as unknown as [number, number]} height={54} gradId={`${gid}-glass`} />
          <GlassWall a={fl as unknown as [number, number]} b={bl as unknown as [number, number]} height={54} gradId={`${gid}-glass`} opacity={0.85} />
        </>
      )}
      {variant === "standard" && <GlassWall a={bl as unknown as [number, number]} b={br as unknown as [number, number]} height={44} gradId={`${gid}-glass`} />}
      {variant === "portable" && (
        <path
          d={`M${bl[0]},${bl[1]} L${br[0]},${br[1]} L${br[0]},${br[1] - 30} L${bl[0]},${bl[1] - 30} Z`}
          fill={`url(#${gid}-panel)`}
          stroke="#bbff2e"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      )}

      {/* floor */}
      <path d={floorPath()} fill={`url(#${gid}-floor)`} stroke="#bbff2e" strokeOpacity="0.55" strokeWidth="1.4" />
      <line x1={lerp(fl as unknown as number[], bl as unknown as number[], 0.5)[0]} y1={lerp(fl as unknown as number[], bl as unknown as number[], 0.5)[1]} x2={lerp(fr as unknown as number[], br as unknown as number[], 0.5)[0]} y2={lerp(fr as unknown as number[], br as unknown as number[], 0.5)[1]} stroke="#bbff2e" strokeOpacity="0.3" strokeWidth="1" />
      {/* net */}
      <line
        x1={lerp(fl as unknown as number[], bl as unknown as number[], 0.5)[0]}
        y1={lerp(fl as unknown as number[], bl as unknown as number[], 0.5)[1]}
        x2={lerp(fr as unknown as number[], br as unknown as number[], 0.5)[0]}
        y2={lerp(fr as unknown as number[], br as unknown as number[], 0.5)[1]}
        stroke="#bbff2e"
        strokeOpacity="0.7"
        strokeWidth="2.4"
      />

      {/* front walls (panoramic + standard) */}
      {variant === "panoramic" && (
        <>
          <GlassWall a={fr as unknown as [number, number]} b={br as unknown as [number, number]} height={54} gradId={`${gid}-glass`} opacity={0.7} />
        </>
      )}
      {variant === "standard" && (
        <path
          d={`M${fl[0]},${fl[1]} L${bl[0]},${bl[1]} L${bl[0]},${bl[1] - 30} L${fl[0]},${fl[1] - 30} Z`}
          fill={`url(#${gid}-panel)`}
          stroke="#bbff2e"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      )}
      {variant === "portable" && (
        <path
          d={`M${fl[0]},${fl[1]} L${fr[0]},${fr[1]} L${fr[0]},${fr[1] - 20} L${fl[0]},${fl[1] - 20} Z`}
          fill={`url(#${gid}-panel)`}
          stroke="#bbff2e"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      )}

      {/* corner posts */}
      <Post base={fl as unknown as [number, number]} height={variant === "panoramic" ? 56 : variant === "standard" ? 46 : 32} id="p1" />
      <Post base={fr as unknown as [number, number]} height={variant === "panoramic" ? 56 : variant === "standard" ? 46 : 32} id="p2" />
      <Post base={br as unknown as [number, number]} height={variant === "panoramic" ? 56 : variant === "standard" ? 46 : 32} id="p3" />
      <Post base={bl as unknown as [number, number]} height={variant === "panoramic" ? 56 : variant === "standard" ? 46 : 32} id="p4" />

      {/* portable: modular interlocking braces */}
      {variant === "portable" && (
        <>
          <line x1={fl[0]} y1={fl[1] - 32} x2={fr[0]} y2={fr[1] - 32} stroke="#bbff2e" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1={bl[0]} y1={bl[1] - 32} x2={br[0]} y2={br[1] - 32} stroke="#bbff2e" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 3" />
        </>
      )}

      {/* panoramic: roofline accent */}
      {variant === "panoramic" && (
        <line x1={fl[0]} y1={fl[1] - 56} x2={fr[0]} y2={fr[1] - 56} stroke="#bbff2e" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
      )}

      {/* dimension callouts, blueprint-style, so the drawing reads as a spec */}
      <g fontFamily="ui-monospace, 'JetBrains Mono', monospace" fill="#bbff2e" fillOpacity="0.55">
        <line x1={fl[0]} y1={fl[1] + 4} x2={fl[0]} y2={fl[1] + 14} stroke="#bbff2e" strokeOpacity="0.4" strokeWidth="0.75" />
        <line x1={fr[0]} y1={fr[1] + 4} x2={fr[0]} y2={fr[1] + 14} stroke="#bbff2e" strokeOpacity="0.4" strokeWidth="0.75" />
        <line x1={fl[0]} y1={fl[1] + 10} x2={fr[0]} y2={fr[1] + 10} stroke="#bbff2e" strokeOpacity="0.4" strokeWidth="0.75" />
        <text x={(fl[0] + fr[0]) / 2} y={fl[1] + 22} textAnchor="middle" fontSize="7" letterSpacing="0.5">
          20M COURT LENGTH
        </text>

        <line
          x1={(fl[0] + bl[0]) / 2}
          y1={(fl[1] + bl[1]) / 2}
          x2={(fl[0] + bl[0]) / 2 - 20}
          y2={(fl[1] + bl[1]) / 2 - 8}
          stroke="#bbff2e"
          strokeOpacity="0.4"
          strokeWidth="0.75"
        />
        <text x={(fl[0] + bl[0]) / 2 - 22} y={(fl[1] + bl[1]) / 2 - 10} textAnchor="end" fontSize="7" letterSpacing="0.5">
          10M WIDTH
        </text>
      </g>
    </svg>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LIME = "#d4ff00";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
// Remaps a global 0..1 assembly progress into a per-part 0..1 window that
// starts at `delay`, so parts animate in one after another instead of all
// at once.
function seg(progress: number, delay: number, span = 0.35) {
  return easeOutCubic(clamp01((progress - delay) / span));
}

// Ground-stack cross section, bottom to top: compacted sub-base, elastic
// shock pad, woven backing, sand/rubber infill. The monofilament turf
// blades sit on top as their own layer (below).
const GROUND_LAYERS = [
  { key: "subbase", delay: 0, y: 0, size: [2.4, 0.12, 1.6] as [number, number, number], color: "#3c3c2e", opacity: 0.92 },
  { key: "shockpad", delay: 0.08, y: 0.32, size: [2.3, 0.09, 1.52] as [number, number, number], color: "#5c6238", opacity: 0.55 },
  { key: "backing", delay: 0.16, y: 0.5, size: [2.22, 0.05, 1.42] as [number, number, number], color: "#20220f", opacity: 0.85 },
  { key: "infill", delay: 0.24, y: 0.68, size: [2.14, 0.08, 1.36] as [number, number, number], color: "#8d7c3f", opacity: 0.55 },
];

const STRUT_CORNERS: [number, number][] = [
  [-1.18, -0.78],
  [1.18, -0.78],
  [-1.18, 0.78],
  [1.18, 0.78],
];

function GroundLayer({
  progress,
  layer,
}: {
  progress: React.RefObject<number>;
  layer: (typeof GROUND_LAYERS)[number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = seg(progress.current, layer.delay);
    ref.current.position.y = lerp(0.04, layer.y, p);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = lerp(0, layer.opacity, p);
  });
  return (
    <mesh ref={ref} position={[0, 0.04, 0]}>
      <boxGeometry args={layer.size} />
      <meshStandardMaterial color={layer.color} transparent opacity={0} roughness={0.65} metalness={0.05} />
    </mesh>
  );
}

// The monofilament turf fiber layer — many thin upright blades over the
// infill, instead of a flat plane, so it reads as an actual textured
// surface rather than a diagram of one.
function TurfBlades({ progress }: { progress: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Mesh>(null);
  const blades = useMemo(() => {
    const arr: { x: number; z: number; h: number; rotY: number }[] = [];
    const cols = 15;
    const rows = 9;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i / (cols - 1) - 0.5) * 2.0 + (Math.random() - 0.5) * 0.06;
        const z = (j / (rows - 1) - 0.5) * 1.28 + (Math.random() - 0.5) * 0.06;
        const h = 0.1 + Math.random() * 0.06;
        arr.push({ x, z, h, rotY: Math.random() * Math.PI });
      }
    }
    return arr;
  }, []);

  useFrame(() => {
    const p = seg(progress.current, 0.3);
    if (groupRef.current) {
      groupRef.current.position.y = lerp(0.04, 0.86, p);
      groupRef.current.children.forEach((c) => {
        const mesh = c as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) mat.opacity = lerp(0, 0.9, p);
      });
    }
    if (baseRef.current) {
      (baseRef.current.material as THREE.MeshStandardMaterial).opacity = lerp(0, 0.85, p);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.04, 0]}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.rotY, 0]}>
          <boxGeometry args={[0.018, b.h, 0.018]} />
          <meshStandardMaterial color={LIME} transparent opacity={0} roughness={0.3} />
        </mesh>
      ))}
      <mesh ref={baseRef} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.16, 1.38]} />
        <meshStandardMaterial color="#1c2a0e" transparent opacity={0} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// The retractable canopy membrane, floating above the ground stack like a
// roof, supported by 4 thin struts with a hex bolt joint detail on one —
// mirroring the corner-post hex caps used elsewhere on the site.
function Canopy({ progress }: { progress: React.RefObject<number> }) {
  const fillRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const strutRefs = useRef<(THREE.Mesh | null)[]>([]);
  const capRef = useRef<THREE.Mesh>(null);

  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.5, 1.7)), []);

  useFrame(() => {
    const pCanopy = seg(progress.current, 0.55);
    if (fillRef.current) {
      fillRef.current.position.y = lerp(0.5, 1.55, pCanopy);
      (fillRef.current.material as THREE.MeshStandardMaterial).opacity = lerp(0, 0.2, pCanopy);
    }
    if (edgeRef.current) {
      edgeRef.current.position.y = lerp(0.5, 1.55, pCanopy);
      (edgeRef.current.material as THREE.LineBasicMaterial).opacity = lerp(0, 0.75, pCanopy);
    }
    const pStrut = seg(progress.current, 0.45);
    strutRefs.current.forEach((m) => {
      if (!m) return;
      (m.material as THREE.MeshStandardMaterial).opacity = lerp(0, 0.35, pStrut);
    });
    if (capRef.current) {
      const pCap = seg(progress.current, 0.68);
      (capRef.current.material as THREE.MeshStandardMaterial).opacity = lerp(0, 0.85, pCap);
    }
  });

  return (
    <>
      <mesh ref={fillRef} rotation={[-Math.PI / 2, 0, 0.02]} position={[0, 0.5, 0]}>
        <planeGeometry args={[2.5, 1.7]} />
        <meshStandardMaterial color={LIME} transparent opacity={0} side={THREE.DoubleSide} roughness={0.2} />
      </mesh>
      <lineSegments ref={edgeRef} geometry={edgeGeometry} rotation={[-Math.PI / 2, 0, 0.02]} position={[0, 0.5, 0]}>
        <lineBasicMaterial color={LIME} transparent opacity={0} />
      </lineSegments>

      {STRUT_CORNERS.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            strutRefs.current[i] = el;
          }}
          position={[c[0], 0.78, c[1]]}
        >
          <cylinderGeometry args={[0.022, 0.022, 1.56, 10]} />
          <meshStandardMaterial color={LIME} transparent opacity={0} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* hex bolt joint detail, anchoring one strut to the canopy */}
      <mesh ref={capRef} position={[STRUT_CORNERS[1][0], 1.56, STRUT_CORNERS[1][1]]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[0.075, 0.09, 0.05, 6]} />
        <meshStandardMaterial
          color={LIME}
          transparent
          opacity={0}
          metalness={0.5}
          roughness={0.25}
          emissive={LIME}
          emissiveIntensity={0.35}
        />
      </mesh>
    </>
  );
}

// Slow continuous turntable spin once the exploded assembly has finished
// coming together, echoing the same "showcase" moment used in the Assembly
// scene elsewhere on the page.
function Spinner({ progress, children }: { progress: React.RefObject<number>; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const spinFactor = seg(progress.current, 0.85, 0.15);
    groupRef.current.rotation.y += delta * 0.16 * spinFactor;
  });
  return <group ref={groupRef}>{children}</group>;
}

function Scene({ reduceMotion }: { reduceMotion: boolean }) {
  const progress = useRef(reduceMotion ? 1 : 0);
  useFrame((state, delta) => {
    if (reduceMotion) return;
    progress.current = Math.min(1, progress.current + delta * 0.55);
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 2]} intensity={1.05} />
      <pointLight position={[-2, 1.4, -1.6]} intensity={0.45} color={LIME} />
      <Spinner progress={progress}>
        <group position={[0, -0.55, 0]}>
          {GROUND_LAYERS.map((layer) => (
            <GroundLayer key={layer.key} progress={progress} layer={layer} />
          ))}
          <TurfBlades progress={progress} />
          <Canopy progress={progress} />
        </group>
      </Spinner>
    </>
  );
}

export default function EngineeringScene({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [3.3, 1.7, 4.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}
    >
      <Scene reduceMotion={reduceMotion} />
    </Canvas>
  );
}

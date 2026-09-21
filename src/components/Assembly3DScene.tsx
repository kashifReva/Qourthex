"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LIME = "#d4ff00";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
// Remap progress from [inStart, inEnd] to [0,1], clamped.
function seg(progress: number, inStart: number, inEnd: number) {
  return Math.min(1, Math.max(0, (progress - inStart) / (inEnd - inStart)));
}

function useTurfTexture() {
  return useMemo(() => {
    const w = 512;
    const h = 320;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0d130a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(212,255,0,0.6)";
    ctx.lineWidth = 4;
    const pad = 14;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    ctx.beginPath();
    ctx.moveTo(w / 2, pad);
    ctx.lineTo(w / 2, h - pad);
    ctx.stroke();
    ctx.strokeStyle = "rgba(212,255,0,0.28)";
    ctx.lineWidth = 1.5;
    for (let x = pad; x < w - pad; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, pad);
      ctx.lineTo(x, h - pad);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function usePadelBallTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#c8e600";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#0d1a00";
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo(size * 0.28, size * 0.05, size * 0.72, size * 0.05, size, size * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo(size * 0.28, size * 0.95, size * 0.72, size * 0.95, size, size * 0.5);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

type Part = { group: THREE.Group | null };

// Court footprint corners (x, z) — posts, walls, turf and roof all share
// these so nothing can drift apart the way the old hard-coded wall
// transforms did.
const CORNERS = {
  fl: [-1.8, -1] as [number, number],
  fr: [1.8, -1] as [number, number],
  bl: [-1.8, 1] as [number, number],
  br: [1.8, 1] as [number, number],
};
const WALL_HEIGHT = 1.3;
const POST_HEIGHT = 2.7; // half (1.35) is the visible height above ground
const ROOF_Y = POST_HEIGHT / 2 + 0.05;

function Rig({ progressRef }: { progressRef: React.RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    camera.position.set(lerp(5.2, 4.0, p), lerp(4.2, 3.5, p), lerp(6.0, 4.8, p));
    camera.lookAt(0, 0.55, 0);
  });
  return null;
}

function Posts({ progressRef }: { progressRef: React.RefObject<number> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  // corner target positions (x, z) and scattered origin per post
  const corners = useMemo(
    () => [
      { target: [CORNERS.fl[0], 0, CORNERS.fl[1]] as [number, number, number], from: [-4.4, 1.6, -3.2] as [number, number, number], rot: -0.9 },
      { target: [CORNERS.fr[0], 0, CORNERS.fr[1]] as [number, number, number], from: [4.6, 1.8, -3.4] as [number, number, number], rot: 0.8 },
      { target: [CORNERS.bl[0], 0, CORNERS.bl[1]] as [number, number, number], from: [-4.8, 2.0, 3.2] as [number, number, number], rot: 0.7 },
      { target: [CORNERS.br[0], 0, CORNERS.br[1]] as [number, number, number], from: [5.0, 1.4, 3.0] as [number, number, number], rot: -0.75 },
    ],
    []
  );

  useFrame(() => {
    const p = seg(progressRef.current, 0, 0.32);
    corners.forEach((c, i) => {
      const g = refs.current[i];
      if (!g) return;
      g.position.set(lerp(c.from[0], c.target[0], p), lerp(c.from[1], c.target[1], p), lerp(c.from[2], c.target[2], p));
      g.rotation.z = lerp(c.rot, 0, p);
      const postMat = (g.children[0] as THREE.Mesh)?.material as THREE.MeshStandardMaterial;
      if (postMat) postMat.opacity = lerp(0.25, 1, p);
      const capMat = (g.children[1] as THREE.Mesh)?.material as THREE.MeshStandardMaterial;
      if (capMat) capMat.opacity = lerp(0.2, 0.95, p);
    });
  });

  return (
    <>
      {corners.map((_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, POST_HEIGHT, 16]} />
            <meshStandardMaterial color={LIME} transparent opacity={0.25} roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, POST_HEIGHT / 2 + 0.03, 0]} rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.06, 6]} />
            <meshStandardMaterial
              color={LIME}
              transparent
              opacity={0.2}
              roughness={0.25}
              metalness={0.5}
              emissive={LIME}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// A single wall panel spanning two real court corners, so it always sits
// flush with the floor edge and the corner posts instead of a hand-tuned
// position/rotation that can drift apart from the rest of the geometry.
function Wall({
  progressRef,
  a,
  b,
  inStart,
  inEnd,
  outward,
  fromAngleDelta,
}: {
  progressRef: React.RefObject<number>;
  a: [number, number];
  b: [number, number];
  inStart: number;
  inEnd: number;
  outward: number;
  fromAngleDelta: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { midX, midZ, width, angle, fromX, fromZ } = useMemo(() => {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const width = Math.hypot(dx, dz);
    const midX = (a[0] + b[0]) / 2;
    const midZ = (a[1] + b[1]) / 2;
    const angle = Math.atan2(-dz, dx);
    const nLen = Math.hypot(dz, -dx) || 1;
    const nx = dz / nLen;
    const nz = -dx / nLen;
    return { midX, midZ, width, angle, fromX: midX + nx * outward, fromZ: midZ + nz * outward };
  }, [a, b, outward]);

  useFrame(() => {
    const p = seg(progressRef.current, inStart, inEnd);
    if (!groupRef.current) return;
    groupRef.current.position.set(lerp(fromX, midX, p), WALL_HEIGHT / 2, lerp(fromZ, midZ, p));
    groupRef.current.rotation.y = lerp(angle + fromAngleDelta, angle, p);
    const fillMat = (groupRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
    fillMat.opacity = lerp(0, 0.4, p);
    const edgeMat = (groupRef.current.children[1] as THREE.LineSegments).material as THREE.LineBasicMaterial;
    edgeMat.opacity = lerp(0, 0.85, p);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[width, WALL_HEIGHT]} />
        <meshStandardMaterial color="#8fb400" transparent opacity={0} roughness={0.15} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, WALL_HEIGHT)]} />
        <lineBasicMaterial color={LIME} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

function GlassPanels({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <>
      <Wall progressRef={progressRef} a={CORNERS.fl} b={CORNERS.bl} inStart={0.28} inEnd={0.55} outward={2.6} fromAngleDelta={-0.6} />
      <Wall progressRef={progressRef} a={CORNERS.fl} b={CORNERS.fr} inStart={0.32} inEnd={0.58} outward={2.6} fromAngleDelta={0.6} />
    </>
  );
}

// A light mesh/truss roof over the whole footprint — translucent so the
// court underneath stays visible, with a couple of cross-braces so it
// reads as a structure rather than a flat lid.
function Roof({ progressRef }: { progressRef: React.RefObject<number> }) {
  const fillRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const braceRef = useRef<THREE.LineSegments>(null);
  const w = CORNERS.fr[0] - CORNERS.fl[0];
  const d = CORNERS.bl[1] - CORNERS.fl[1];

  const braceGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pts = new Float32Array([
      -w / 2, 0, -d / 2, w / 2, 0, d / 2,
      w / 2, 0, -d / 2, -w / 2, 0, d / 2,
      0, 0, -d / 2, 0, 0, d / 2,
      -w / 2, 0, 0, w / 2, 0, 0,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geom;
  }, [w, d]);

  useFrame(() => {
    const p = seg(progressRef.current, 0.45, 0.75);
    if (fillRef.current) (fillRef.current.material as THREE.MeshStandardMaterial).opacity = lerp(0, 0.14, p);
    if (edgeRef.current) (edgeRef.current.material as THREE.LineBasicMaterial).opacity = lerp(0, 0.6, p);
    if (braceRef.current) (braceRef.current.material as THREE.LineBasicMaterial).opacity = lerp(0, 0.4, p);
  });

  return (
    <group position={[(CORNERS.fl[0] + CORNERS.fr[0]) / 2, ROOF_Y, (CORNERS.fl[1] + CORNERS.bl[1]) / 2]}>
      <mesh ref={fillRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={LIME} transparent opacity={0} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments ref={edgeRef} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color={LIME} transparent opacity={0} />
      </lineSegments>
      <lineSegments ref={braceRef} geometry={braceGeometry}>
        <lineBasicMaterial color={LIME} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

function Turf({ progressRef }: { progressRef: React.RefObject<number> }) {
  const texture = useTurfTexture();
  const meshRef = useRef<THREE.Mesh>(null);
  const w = CORNERS.fr[0] - CORNERS.fl[0];
  const d = CORNERS.bl[1] - CORNERS.fl[1];

  useFrame(() => {
    const p = seg(progressRef.current, 0, 0.5);
    const mat = meshRef.current?.material as THREE.MeshStandardMaterial;
    if (mat) mat.opacity = lerp(0.08, 0.95, p);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={texture} transparent opacity={0.08} roughness={1} />
    </mesh>
  );
}

function Net({ progressRef }: { progressRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = seg(progressRef.current, 0.5, 0.78);
    if (groupRef.current) {
      groupRef.current.scale.y = Math.max(0.001, p);
      const mesh = groupRef.current.children[0] as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = lerp(0, 1, p);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.35, 0]} scale={[1, 0.001, 1]}>
      <mesh>
        <planeGeometry args={[0.05, 0.7]} />
        <meshBasicMaterial color={LIME} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Balls({ progressRef }: { progressRef: React.RefObject<number> }) {
  const texture = usePadelBallTexture();
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const specs = useMemo(
    () => [
      { from: [-1.1, 2.0, -0.6] as [number, number, number], to: [-0.7, 0.06, -0.4] as [number, number, number] },
      { from: [1.3, 2.4, 0.4] as [number, number, number], to: [0.6, 0.06, 0.5] as [number, number, number] },
      { from: [0.2, 2.8, 1.1] as [number, number, number], to: [0.1, 0.06, -0.7] as [number, number, number] },
    ],
    []
  );

  useFrame((state) => {
    const p = seg(progressRef.current, 0.05, 0.4);
    specs.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.set(lerp(s.from[0], s.to[0], p), lerp(s.from[1], s.to[1], p), lerp(s.from[2], s.to[2], p));
      m.rotation.y = state.clock.elapsedTime * 0.6 + i;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = lerp(0.3, 1, p);
    });
  });

  return (
    <>
      {specs.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshStandardMaterial map={texture} transparent opacity={0.3} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

// Once the court is mostly assembled, let the whole model turn slowly like a
// product turntable — the "showcase" moment after the build sequence.
function Spinner({ progressRef, children }: { progressRef: React.RefObject<number>; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const spinFactor = seg(progressRef.current, 0.72, 1);
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.22 * spinFactor;
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <pointLight position={[-2, 1, -2]} intensity={0.5} color={LIME} />
      <Spinner progressRef={progressRef}>
        <Turf progressRef={progressRef} />
        <Posts progressRef={progressRef} />
        <GlassPanels progressRef={progressRef} />
        <Roof progressRef={progressRef} />
        <Net progressRef={progressRef} />
        <Balls progressRef={progressRef} />
      </Spinner>
      <Rig progressRef={progressRef} />
    </>
  );
}

export default function Assembly3DScene({
  progressRef,
  reduceMotion,
}: {
  progressRef: React.RefObject<number>;
  reduceMotion: boolean;
}) {
  // When reduced motion / mobile fallback is active, pin progress at 1 (fully assembled).
  const staticProgress = useRef(1);
  const activeRef = reduceMotion ? staticProgress : progressRef;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [5.2, 4.2, 6.0], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene progressRef={activeRef} />
    </Canvas>
  );
}

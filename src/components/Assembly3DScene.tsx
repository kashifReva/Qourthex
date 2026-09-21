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

function Rig({ progressRef }: { progressRef: React.RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    camera.position.set(lerp(4.6, 3.4, p), lerp(3.6, 2.9, p), lerp(5.4, 4.2, p));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Posts({ progressRef }: { progressRef: React.RefObject<number> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  // corner target positions (x, z) and scattered origin per post
  const corners = useMemo(
    () => [
      { target: [-1.8, 0, -1] as [number, number, number], from: [-3.6, 1.2, -2.6] as [number, number, number], rot: -0.9 },
      { target: [1.8, 0, -1] as [number, number, number], from: [3.8, 1.4, -2.8] as [number, number, number], rot: 0.8 },
      { target: [-1.8, 0, 1] as [number, number, number], from: [-4.0, 1.6, 2.6] as [number, number, number], rot: 0.7 },
      { target: [1.8, 0, 1] as [number, number, number], from: [4.2, 1.1, 2.4] as [number, number, number], rot: -0.75 },
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
            <cylinderGeometry args={[0.045, 0.045, 1.4, 16]} />
            <meshStandardMaterial color={LIME} transparent opacity={0.25} roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.74, 0]} rotation={[0, Math.PI / 6, 0]}>
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

function GlassPanels({ progressRef }: { progressRef: React.RefObject<number> }) {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = seg(progressRef.current, 0.28, 0.55);
    if (leftRef.current) {
      leftRef.current.position.set(lerp(-4.5, -1.8, p), 0.7, lerp(-0.4, 0, p));
      leftRef.current.rotation.y = lerp(-0.6, 0, p);
      const fillMat = (leftRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      fillMat.opacity = lerp(0, 0.4, p);
      const edgeMat = (leftRef.current.children[1] as THREE.LineSegments).material as THREE.LineBasicMaterial;
      edgeMat.opacity = lerp(0, 0.85, p);
    }
    if (rightRef.current) {
      rightRef.current.position.set(lerp(4.5, 1.8, p), 0.7, lerp(0.4, 0, p));
      rightRef.current.rotation.y = lerp(0.6, 0, p);
      const fillMat = (rightRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      fillMat.opacity = lerp(0, 0.4, p);
      const edgeMat = (rightRef.current.children[1] as THREE.LineSegments).material as THREE.LineBasicMaterial;
      edgeMat.opacity = lerp(0, 0.85, p);
    }
  });

  return (
    <>
      <group ref={leftRef}>
        <mesh>
          <planeGeometry args={[2.2, 1.4, 1, 1]} />
          <meshStandardMaterial color="#8fb400" transparent opacity={0} roughness={0.15} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 1.4)]} />
          <lineBasicMaterial color={LIME} transparent opacity={0} />
        </lineSegments>
      </group>
      <group ref={rightRef}>
        <mesh>
          <planeGeometry args={[2.2, 1.4, 1, 1]} />
          <meshStandardMaterial color="#8fb400" transparent opacity={0} roughness={0.15} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 1.4)]} />
          <lineBasicMaterial color={LIME} transparent opacity={0} />
        </lineSegments>
      </group>
    </>
  );
}

function Turf({ progressRef }: { progressRef: React.RefObject<number> }) {
  const texture = useTurfTexture();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = seg(progressRef.current, 0, 0.5);
    const mat = meshRef.current?.material as THREE.MeshStandardMaterial;
    if (mat) mat.opacity = lerp(0.08, 0.95, p);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[3.6, 2.2]} />
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
      camera={{ position: [4.6, 3.6, 5.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene progressRef={activeRef} />
    </Canvas>
  );
}

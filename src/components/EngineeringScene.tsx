"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const LIME = "#bbff2e";

// The real, authored reference model for this section's visual — the exact
// ground-stack/turf/canopy/post/ball assembly (geometry, colors, materials)
// exported directly from the reference build, dropped in as a static asset
// rather than hand-approximated. See public/models/.
const MODEL_URL = "/models/qourt-hex-macro-zoom.glb";

// The model is authored across a ~9x9 unit footprint (X/Z +-4.5), ~3 units
// tall. This scale brings it down to roughly the same on-screen footprint
// the old hand-built scene was tuned around.
const SCALE = 0.28;

// How far (in the model's own, pre-scale units) each part rises into its
// baked resting position as it fades in.
const RISE = 0.9;

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

// Some nodes (the 4 corner posts, notably) reference the SAME glTF mesh
// index, so three.js's GLTFLoader gives each node its own Object3D but they
// all point at the SAME shared Material instance. Mutating opacity/emissive
// per-part would then stomp on every other part sharing it (each post
// overwriting the last), so every material gets cloned to its own instance
// before we touch it.
function collectMaterials(object: THREE.Object3D): THREE.Material[] {
  const mats: THREE.Material[] = [];
  object.traverse((child) => {
    const withMat = child as unknown as { material?: THREE.Material | THREE.Material[] };
    if (withMat.material) {
      if (Array.isArray(withMat.material)) {
        const cloned = withMat.material.map((m) => m.clone());
        withMat.material = cloned;
        mats.push(...cloned);
      } else {
        const cloned = withMat.material.clone();
        withMat.material = cloned;
        mats.push(cloned);
      }
    }
  });
  return mats;
}

type Part = {
  object: THREE.Object3D;
  targetY: number;
  mats: THREE.Material[];
  targetOpacities: number[];
};

// Unlike the Assembly section's court model, this GLB carries no baked
// scatter/settle extras — so instead of lerping between two authored
// transforms, each part simply rises a fixed offset into its own baked
// resting position while fading in, staggered per bucket by `seg()`.
function makePart(object: THREE.Object3D): Part {
  const mats = collectMaterials(object);
  const targetOpacities = mats.map((m) => {
    const mat = m as THREE.Material & { opacity: number };
    mat.transparent = true;
    return mat.opacity ?? 1;
  });
  mats.forEach((m) => {
    (m as THREE.Material & { opacity: number }).opacity = 0;
  });
  return { object, targetY: object.position.y, mats, targetOpacities };
}

function updatePart(part: Part, t: number) {
  const { object, targetY, mats, targetOpacities } = part;
  object.position.y = lerp(targetY - RISE, targetY, t);
  mats.forEach((m, i) => {
    (m as THREE.Material & { opacity: number }).opacity = lerp(0, targetOpacities[i], t);
  });
}

type Buckets = {
  floor: Part[];
  floorLines: Part[];
  turf: Part[];
  canopy: Part[];
  posts: Part[];
  ball: Part[];
  particles: Part[];
};

// Sort the model's top-level renderable nodes (skipping the 2 embedded
// lights and 2 empty helper nodes) back into the buckets that match the
// file's own authoring order: floor, floor lines, the instanced turf infill
// granules, canopy (fill + edge), 4 corner posts, the ball, and the dust
// particles.
function bucketParts(scene: THREE.Object3D): Buckets {
  const renderable = scene.children.filter((o) => {
    const flags = o as unknown as {
      isLight?: boolean;
      isMesh?: boolean;
      isLine?: boolean;
      isLineSegments?: boolean;
      isPoints?: boolean;
    };
    return !flags.isLight && (flags.isMesh || flags.isLine || flags.isLineSegments || flags.isPoints);
  });

  let i = 0;
  const take = (n: number) => renderable.slice(i, (i += n));
  const floor = take(1).map(makePart);
  const floorLines = take(1).map(makePart);
  const turf = take(1).map(makePart);
  const canopy = take(2).map(makePart);
  const posts = take(4).map(makePart);
  const ball = take(1).map(makePart);
  const particles = take(1).map(makePart);

  // The posts' dark structural metal reads correctly under a full studio
  // light rig, but against our near-black canvas background it needs a
  // touch more of its own baked emissive glow to stay legible as the frame
  // assembles — a small, targeted boost, not a color change.
  posts.forEach((part) => {
    part.mats.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (typeof mat.emissiveIntensity === "number") {
        mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 0.05) * 6;
      }
    });
  });

  return { floor, floorLines, turf, canopy, posts, ball, particles };
}

function EngineeringModel({ progress }: { progress: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const bucketsRef = useRef<Buckets | null>(null);

  useEffect(() => {
    bucketsRef.current = bucketParts(scene);
  }, [scene]);

  useFrame(() => {
    const b = bucketsRef.current;
    if (!b) return;
    const p = progress.current;

    b.floor.forEach((part) => updatePart(part, seg(p, 0)));
    b.floorLines.forEach((part) => updatePart(part, seg(p, 0)));
    b.turf.forEach((part) => updatePart(part, seg(p, 0.15)));
    b.posts.forEach((part) => updatePart(part, seg(p, 0.3)));
    b.canopy.forEach((part) => updatePart(part, seg(p, 0.5)));
    b.ball.forEach((part) => updatePart(part, seg(p, 0.65)));
    b.particles.forEach((part) => updatePart(part, seg(p, 0.75)));
  });

  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_URL);

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
        <group scale={SCALE} position={[0, -0.42, 0]}>
          <Suspense fallback={null}>
            <EngineeringModel progress={progress} />
          </Suspense>
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

"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";

// The real, authored reference model — the exact glass-box padel court
// (geometry, colors, materials, and even the part-by-part scatter/settle
// animation data) exported directly from the reference build, dropped in
// as a static asset rather than hand-approximated. See public/models/.
const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/qourt-hex-padel-court.glb`;

// The model is authored in real-world meters (a 20m x 10m court, 3m walls).
// This scale brings it down to the same rough on-screen footprint our
// camera/bloom/post-processing setup was already tuned around.
const SCALE = 0.18;

// The playing surface's own color — overrides the reference file's baked
// (very dark) floor material with the brand's court-turf green.
const COURT_COLOR = "#6d840a";

// A uniform "black touch" darkening applied across every material in the
// scene (walls, roof, net, balls, floor lines) so the whole court reads as
// a deeper, moodier palette instead of stark bright-lime accents on black.
const BLACK_TOUCH = 0.7;

// Scales a material's base color (and emissive, if it has one) toward black
// by `factor`, leaving hue and transparency untouched.
function applyBlackTouch(parts: Part[], factor: number) {
  parts.forEach((part) => {
    part.mats.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (mat.color) mat.color.multiplyScalar(factor);
      if (mat.emissive) mat.emissive.multiplyScalar(factor);
    });
  });
}

// Builds a soft, fully procedural (no network/HDRI fetch) environment map so
// the glass and metal materials below have something believable to reflect —
// this is what turns a flat-shaded panel into something that reads as glass.
function EnvironmentSetup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmrem.dispose();
    return () => {
      envTexture.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
// Remap progress from [inStart, inEnd] to [0,1], clamped.
function seg(progress: number, inStart: number, inEnd: number) {
  return Math.min(1, Math.max(0, (progress - inStart) / (inEnd - inStart)));
}

// The reference model bakes each animated part's final ("settle") transform
// as its normal glTF node transform, and stores the chaotic starting
// ("scatter") transform as custom node extras — which three.js's GLTFLoader
// carries straight through onto object.userData. So every part already
// knows both endpoints of its own build-in animation; we just lerp between
// them off scroll progress instead of inventing our own from/to values.
type ScatterExtra = { x: number; y: number; z: number; rx?: number; ry?: number };

type Part = {
  object: THREE.Object3D;
  scatterPos?: THREE.Vector3;
  targetPos?: THREE.Vector3;
  scatterRot?: THREE.Euler;
  targetRot?: THREE.Euler;
  mats: THREE.Material[];
  targetOpacities: number[];
};

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

function makePart(object: THREE.Object3D): Part {
  const ud = object.userData as { scatter?: ScatterExtra; settle?: ScatterExtra };
  const mats = collectMaterials(object);
  const targetOpacities = mats.map((m) => {
    const mat = m as THREE.Material & { opacity: number };
    mat.transparent = true;
    return mat.opacity ?? 1;
  });
  mats.forEach((m) => {
    (m as THREE.Material & { opacity: number }).opacity = 0;
  });

  let scatterPos: THREE.Vector3 | undefined;
  let targetPos: THREE.Vector3 | undefined;
  let scatterRot: THREE.Euler | undefined;
  let targetRot: THREE.Euler | undefined;
  if (ud?.scatter) {
    targetPos = object.position.clone();
    scatterPos = new THREE.Vector3(ud.scatter.x, ud.scatter.y, ud.scatter.z);
    if (ud.scatter.rx !== undefined || ud.scatter.ry !== undefined) {
      targetRot = object.rotation.clone();
      scatterRot = new THREE.Euler(ud.scatter.rx ?? targetRot.x, ud.scatter.ry ?? targetRot.y, targetRot.z);
    }
  }
  return { object, scatterPos, targetPos, scatterRot, targetRot, mats, targetOpacities };
}

function updatePart(part: Part, t: number) {
  const { object, scatterPos, targetPos, scatterRot, targetRot, mats, targetOpacities } = part;
  if (scatterPos && targetPos) {
    object.position.set(
      lerp(scatterPos.x, targetPos.x, t),
      lerp(scatterPos.y, targetPos.y, t),
      lerp(scatterPos.z, targetPos.z, t)
    );
  }
  if (scatterRot && targetRot) {
    object.rotation.set(lerp(scatterRot.x, targetRot.x, t), lerp(scatterRot.y, targetRot.y, t), targetRot.z);
  }
  mats.forEach((m, i) => {
    (m as THREE.Material & { opacity: number }).opacity = lerp(0, targetOpacities[i], t);
  });
}

type Buckets = {
  floor: Part[];
  floorLines: Part[];
  walls: Part[];
  net: Part[];
  balls: Part[];
  hex: Part[];
  posts: Part[];
};

// Sort the model's top-level renderable nodes (skipping the two embedded
// lights) back into the buckets that match the file's own authoring order:
// floor, floor lines, 4 walls (fill+edge pairs), the net line, 6 balls, 8
// hex roof/canopy fixtures, 4 corner posts.
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
  const walls = take(8).map(makePart);
  const net = take(1).map(makePart);
  const balls = take(6).map(makePart);
  const hex = take(8).map(makePart);
  const posts = take(4).map(makePart);

  // The posts' dark structural metal reads correctly against a lit
  // environment, but on our near-black canvas background it needs a touch
  // more of its own baked emissive glow to stay legible as the frame
  // assembles — a small, targeted boost, not a color change. Scaled by the
  // same black-touch factor as everything else below so the posts' glow
  // stays consistent with the rest of the now-darker palette.
  posts.forEach((part) => {
    part.mats.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (typeof mat.emissiveIntensity === "number") {
        mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 0.05) * 16 * BLACK_TOUCH;
      }
      if (typeof mat.envMapIntensity === "number") {
        mat.envMapIntensity = 2.4 * BLACK_TOUCH;
      }
    });
  });

  // The playing surface itself is recolored to the brand's court-turf
  // green (with the same black touch baked in), overriding the reference
  // file's own near-black baked floor.
  floor.forEach((part) => {
    part.mats.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (mat.color) mat.color.set(COURT_COLOR).multiplyScalar(BLACK_TOUCH);
    });
  });

  // Every other lime-accented surface (glass walls, roof fixtures, net,
  // balls) and the white floor grid lines get the same black-touch
  // darkening, so the whole court reads as one deeper, moodier palette
  // instead of a dark court with stark bright-lime accents.
  applyBlackTouch(walls, BLACK_TOUCH);
  applyBlackTouch(net, BLACK_TOUCH);
  applyBlackTouch(hex, BLACK_TOUCH);
  applyBlackTouch(balls, BLACK_TOUCH);
  applyBlackTouch(floorLines, BLACK_TOUCH);

  return { floor, floorLines, walls, net, balls, hex, posts };
}

function CourtModel({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const bucketsRef = useRef<Buckets | null>(null);

  useEffect(() => {
    bucketsRef.current = bucketParts(scene);
  }, [scene]);

  useFrame(() => {
    const b = bucketsRef.current;
    if (!b) return;
    const p = progressRef.current;

    const floorP = seg(p, 0, 0.5);
    b.floor.forEach((part) => updatePart(part, floorP));
    b.floorLines.forEach((part) => updatePart(part, floorP));

    const postP = seg(p, 0, 0.24);
    b.posts.forEach((part) => updatePart(part, postP));

    const wallP = seg(p, 0.25, 0.5);
    b.walls.forEach((part) => updatePart(part, wallP));

    const hexP = seg(p, 0.5, 0.74);
    b.hex.forEach((part) => updatePart(part, hexP));

    const netP = seg(p, 0.6, 0.8);
    b.net.forEach((part) => updatePart(part, netP));

    const ballP = seg(p, 0.76, 0.96);
    b.balls.forEach((part) => updatePart(part, ballP));
  });

  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_URL);

function Rig({ progressRef }: { progressRef: React.RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    camera.position.set(lerp(3.6, 2.7, p), lerp(2.5, 1.95, p), lerp(3.9, 3.0, p));
    camera.lookAt(0, 0.22, 0);
  });
  return null;
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={0.7} />
      <EnvironmentSetup />
      <group scale={SCALE}>
        <Spinner progressRef={progressRef}>
          <Suspense fallback={null}>
            <CourtModel progressRef={progressRef} />
          </Suspense>
        </Spinner>
      </group>
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
      camera={{ position: [3.6, 2.5, 3.9], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene progressRef={activeRef} />
    </Canvas>
  );
}

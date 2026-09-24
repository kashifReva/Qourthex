"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import HeroBounceTrail from "./HeroBounceTrail";
import CourtFloor from "./CourtFloor";
import * as THREE from "three";
import { applyResponsiveFov } from "@/lib/responsiveFov";

// The scene (camera position, ball placement) was tuned against a wide
// desktop canvas around this aspect ratio (roughly 1440x900).
const BASE_FOV = 32;
const BASE_ASPECT = 1.6;

function Rig({ reduceMotion }: { reduceMotion: boolean }) {
  const target = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (reduceMotion) return;
    function onMove(e: PointerEvent) {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  useFrame(({ camera, size }) => {
    if (!reduceMotion) {
      camera.position.x += (target.current.x * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (-target.current.y * 0.3 + 0.2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
    applyResponsiveFov(camera, size, BASE_FOV, BASE_ASPECT);
  });

  return null;
}

export default function Hero3DScene() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const narrowMQ = window.matchMedia("(max-width: 640px)");
    setIsNarrow(narrowMQ.matches);
    const onChange = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    narrowMQ.addEventListener("change", onChange);
    return () => narrowMQ.removeEventListener("change", onChange);
  }, []);

  // Centered in the hero as a whole (not tucked to one side), just nudged up
  // slightly so it reads behind the text block rather than the stats row.
  // The mobile heading is much narrower (stacked to two lines) than the
  // wide desktop one, so the arc needs fewer/tighter bounces there too, not
  // just a smaller scale, or it reads as a flat squiggle instead of bounces.
  const trailPosition: [number, number, number] = isNarrow ? [0, 5.0, -1.0] : [0, 0.35, -1.2];
  const trailScale = isNarrow ? 0.85 : 0.95;
  const trailPathWidth = isNarrow ? 3.1 : 6.4;
  const trailBounces = isNarrow ? 2.2 : 3.4;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 7.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 3]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#bbff2e" />

      <Suspense fallback={null}>
        <CourtFloor />
        <HeroBounceTrail
          position={trailPosition}
          scale={trailScale}
          pathWidth={trailPathWidth}
          bounces={trailBounces}
          animate={!reduceMotion}
        />
      </Suspense>

      <Rig reduceMotion={reduceMotion} />
    </Canvas>
  );
}

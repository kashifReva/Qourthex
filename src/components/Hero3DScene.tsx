"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import PadelRacket from "./PadelRacket";
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

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

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
        <PadelRacket position={[3.1, 0.15, -1]} scale={0.62} animate={!reduceMotion} />
      </Suspense>

      <Rig reduceMotion={reduceMotion} />
    </Canvas>
  );
}

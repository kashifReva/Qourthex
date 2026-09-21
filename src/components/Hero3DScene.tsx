"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import PadelBall from "./PadelBall";
import CourtFloor from "./CourtFloor";
import * as THREE from "three";

function Rig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
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

  useFrame(() => {
    if (reduceMotion) return;
    camera.position.x += (target.current.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-target.current.y * 0.3 + 0.2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Hero3DScene() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    // Skip the WebGL scene on small screens entirely: saves battery/GPU on
    // phones and the text-only hero already reads well without it there.
    setEnabled(window.matchMedia("(min-width:901px)").matches);
  }, []);

  if (!enabled) return null;

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
        <PadelBall position={[3.1, -0.35, -1]} scale={0.95} animate={!reduceMotion} />
      </Suspense>

      <Rig reduceMotion={reduceMotion} />
    </Canvas>
  );
}

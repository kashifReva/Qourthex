"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A glowing arc tracing a ball's bounce path across the hero, with a small
// glowing ball riding along it. Built from a couple of layered tubes (a wide
// soft one plus a thin bright core) to fake a glow without a post-processing
// bloom pass.

function useBouncePath(width: number, bounces: number) {
  return useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 140;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const x = -width / 2 + u * width;
      // Decaying bounce: each hop a little lower than the last, like a real
      // ball settling, three and a bit hops across the hero width.
      const phase = u * bounces * Math.PI;
      const envelope = 1 - u * 0.35;
      const y = Math.abs(Math.sin(phase)) * 1.15 * envelope - 0.35;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [width, bounces]);
}

export default function HeroBounceTrail({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  animate = true,
  pathWidth = 6.4,
  bounces = 3.4,
}: {
  position?: [number, number, number];
  scale?: number;
  animate?: boolean;
  pathWidth?: number;
  bounces?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  const width = pathWidth;
  const curvePoints = useBouncePath(width, bounces);

  const { coreGeo, haloGeo } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    return {
      coreGeo: new THREE.TubeGeometry(curve, 220, 0.018, 8, false),
      haloGeo: new THREE.TubeGeometry(curve, 220, 0.055, 8, false),
    };
  }, [curvePoints]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = 0.06 + Math.sin(t.current * 0.15) * 0.05;

    if (!animate) return;
    t.current += delta * 0.32;
    const progress = t.current % 1;
    const idx = Math.min(curvePoints.length - 1, Math.floor(progress * (curvePoints.length - 1)));
    const p = curvePoints[idx];
    if (ballRef.current && p) ballRef.current.position.set(p.x, p.y, p.z);
    if (glowRef.current && p) glowRef.current.position.set(p.x, p.y, p.z);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Soft outer glow along the path */}
      <mesh geometry={haloGeo}>
        <meshBasicMaterial color="#bbff2e" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      {/* Bright core line */}
      <mesh geometry={coreGeo}>
        <meshBasicMaterial color="#e6ff8a" transparent opacity={0.85} depthWrite={false} />
      </mesh>

      {/* Faint dot markers along the path for a technical/measured feel */}
      {curvePoints
        .filter((_, i) => i % 20 === 0)
        .map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshBasicMaterial color="#bbff2e" transparent opacity={0.5} />
          </mesh>
        ))}

      {/* Traveling ball glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial color="#bbff2e" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {/* Traveling ball core */}
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#eaff6e" emissive="#bbff2e" emissiveIntensity={0.9} roughness={0.4} metalness={0.05} />
      </mesh>
    </group>
  );
}

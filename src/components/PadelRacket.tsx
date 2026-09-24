"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Procedural padel racket (paddle): a flattened, holed paddle head built as
// an extruded 2D shape with circular holes punched out, plus a wrapped
// handle. No external 3D model needed, mirrors the approach used for
// PadelBall (canvas-texture + primitive geometry).

function useGripTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#131513";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "#bbff2e";
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 7;
    for (let i = -size; i < size * 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - size, size);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

// Half-width / half-height of the paddle head ellipse, and how much of that
// footprint the hole grid is allowed to fill.
const HEAD_A = 0.82;
const HEAD_B = 0.98;
const HEAD_CENTER_Y = 0.62;

function usePaddleGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absellipse(0, HEAD_CENTER_Y, HEAD_A, HEAD_B, 0, Math.PI * 2, false, 0);

    const holeRadius = 0.052;
    const marginA = HEAD_A * 0.74;
    const marginB = HEAD_B * 0.74;
    const spacing = 0.195;
    const rows = Math.ceil((marginB * 2) / spacing);
    const cols = Math.ceil((marginA * 2) / spacing);

    for (let row = 0; row <= rows; row++) {
      const y = HEAD_CENTER_Y - marginB + row * spacing;
      const stagger = row % 2 === 0 ? 0 : spacing / 2;
      for (let col = 0; col <= cols; col++) {
        const x = -marginA + col * spacing + stagger;
        const ny = (y - HEAD_CENTER_Y) / marginB;
        const nx = x / marginA;
        if (nx * nx + ny * ny > 0.92) continue;
        const hole = new THREE.Path();
        hole.absarc(x, y, holeRadius, 0, Math.PI * 2, true);
        shape.holes.push(hole);
      }
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 48,
    });
    geometry.center();
    geometry.translate(0, HEAD_CENTER_Y - 0.02, 0);
    return geometry;
  }, []);
}

export default function PadelRacket({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  animate = true,
}: {
  position?: [number, number, number];
  scale?: number;
  animate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const paddleGeometry = usePaddleGeometry();
  const gripTexture = useGripTexture();
  const t0 = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!animate) return;
    t0.current += delta;
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.x = Math.sin(t0.current * 0.4) * 0.12;
    groupRef.current.position.y = position[1] + Math.sin(t0.current * 0.8) * 0.16;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Paddle head */}
      <mesh geometry={paddleGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#14161b" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Lime edge rim, traced just outside the paddle silhouette */}
      <mesh position={[0, HEAD_CENTER_Y, 0]} castShadow>
        <torusGeometry args={[HEAD_A - 0.015, 0.026, 12, 64]} />
        <meshStandardMaterial color="#bbff2e" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Throat / neck */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.26, 16]} />
        <meshStandardMaterial map={gripTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.92, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.085, 0.1, 0.62, 16]} />
        <meshStandardMaterial map={gripTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Handle end cap knob */}
      <mesh position={[0, -1.26, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0d0f0d" roughness={0.6} metalness={0.15} />
      </mesh>
    </group>
  );
}

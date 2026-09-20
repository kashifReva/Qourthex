"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Procedural "felt" texture: lime-yellow base + the characteristic curved
// seam of a padel/tennis ball, drawn on a canvas and mapped onto the sphere.
function usePadelBallTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base felt color
    ctx.fillStyle = "#c8e600";
    ctx.fillRect(0, 0, size, size);

    // Subtle felt noise
    const noise = ctx.createImageData(size, size);
    for (let i = 0; i < noise.data.length; i += 4) {
      const v = 200 + Math.random() * 55;
      noise.data[i] = v * 0.78;
      noise.data[i + 1] = v;
      noise.data[i + 2] = v * 0.05;
      noise.data[i + 3] = 18;
    }
    ctx.putImageData(noise, 0, 0);

    // Seam curves (two mirrored S-curves, like a tennis ball)
    ctx.strokeStyle = "#0d1a00";
    ctx.lineWidth = size * 0.018;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.85;

    ctx.beginPath();
    ctx.moveTo(size * 0.02, size * 0.5);
    ctx.bezierCurveTo(size * 0.28, size * 0.05, size * 0.72, size * 0.05, size * 0.98, size * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.02, size * 0.5);
    ctx.bezierCurveTo(size * 0.28, size * 0.95, size * 0.72, size * 0.95, size * 0.98, size * 0.5);
    ctx.stroke();

    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

export default function PadelBall({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  animate = true,
}: {
  position?: [number, number, number];
  scale?: number;
  animate?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = usePadelBallTexture();
  const t0 = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!animate) return;
    t0.current += delta;
    meshRef.current.rotation.y += delta * 0.35;
    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.position.y = position[1] + Math.sin(t0.current * 0.8) * 0.18;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

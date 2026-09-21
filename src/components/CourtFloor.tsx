"use client";

import { useMemo } from "react";
import * as THREE from "three";

// A dim padel-court floor plane with lime court lines, seen at a raking
// angle behind the ball for depth. Purely decorative geometry, no textures
// beyond a generated line-grid canvas so it stays cheap to render.
export default function CourtFloor() {
  const texture = useMemo(() => {
    const w = 512;
    const h = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0a0c0a";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(187,255,46,0.55)";
    ctx.lineWidth = 4;
    const pad = 40;
    // outer court boundary
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    // center service line
    ctx.beginPath();
    ctx.moveTo(w / 2, pad);
    ctx.lineTo(w / 2, h - pad);
    ctx.stroke();
    // net line
    ctx.strokeStyle = "rgba(187,255,46,0.85)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(pad, h / 2);
    ctx.lineTo(w - pad, h / 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.6, -1.2]} receiveShadow>
      <planeGeometry args={[6, 10]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} transparent opacity={0.55} />
    </mesh>
  );
}

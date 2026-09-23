import * as THREE from "three";

// Every hand-tuned scene camera in this project (fov, position, look-at) was
// designed and eyeballed against a wide desktop canvas. A three.js
// PerspectiveCamera's `fov` is the VERTICAL field of view, so the HORIZONTAL
// field of view shrinks as the canvas narrows (mobile portrait), cropping
// most of a horizontally-composed scene out of frame even though nothing
// about the model or camera position changed.
//
// This widens the vertical fov on narrower canvases so the horizontal field
// of view stays the same as it was at `baseAspect` (the aspect ratio the
// scene was actually tuned against), trading unused vertical headroom for
// keeping the full width of the scene in view. No-ops once the canvas is at
// least as wide as `baseAspect`.
export function applyResponsiveFov(
  camera: THREE.Camera,
  size: { width: number; height: number },
  baseFovDeg: number,
  baseAspect: number
) {
  const persp = camera as THREE.PerspectiveCamera;
  if (!persp.isPerspectiveCamera) return;

  const aspect = size.width / size.height;
  if (aspect >= baseAspect) {
    if (persp.fov !== baseFovDeg) {
      persp.fov = baseFovDeg;
      persp.updateProjectionMatrix();
    }
    return;
  }

  const baseFovRad = THREE.MathUtils.degToRad(baseFovDeg);
  const targetHorizontalFovRad = 2 * Math.atan(Math.tan(baseFovRad / 2) * baseAspect);
  const newVFovRad = 2 * Math.atan(Math.tan(targetHorizontalFovRad / 2) / aspect);
  const newVFovDeg = THREE.MathUtils.radToDeg(newVFovRad);

  if (persp.fov !== newVFovDeg) {
    persp.fov = newVFovDeg;
    persp.updateProjectionMatrix();
  }
}

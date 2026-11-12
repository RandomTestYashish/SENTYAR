// Lazy-loaded WebGL bottle (Pebble concept). Physically based glass via
// MeshPhysicalMaterial transmission + a studio environment map. Falls back
// to the SVG bottle when WebGL is missing or a frame fails.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface Bottle3DProps {
  fill: number; // 0..1
  name: string;
  accents: string[];
  autoRotate: boolean;
  resetKey: number;
  onError: (msg: string) => void;
  onReady: () => void;
}

// Pebble body: a lathe profile, then a gentle asymmetric deformation
// (controlled asymmetry, still mouldable with a flat, stable base).
function bodyGeometry(scale = 1, segments = 64) {
  const pts: THREE.Vector2[] = [];
  const prof = [
    [0, 0], [0.52, 0], [0.7, 0.04], [0.82, 0.16], [0.88, 0.36], [0.86, 0.58], [0.76, 0.78], [0.56, 0.94], [0.34, 1.02], [0.2, 1.05], [0.17, 1.08],
  ];
  prof.forEach(([r, y]) => pts.push(new THREE.Vector2(r * scale, y * scale + (1 - scale) * 0.5)));
  // smooth the profile so the silhouette is curved, not faceted
  const smooth = new THREE.SplineCurve(pts).getPoints(56);
  const g = new THREE.LatheGeometry(smooth, segments);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const h = v.y;
    v.z *= 0.58; // flatten front-to-back
    v.x *= 1 + 0.08 * Math.sin(h * 2.4) * Math.sign(v.x); // asymmetric shoulder
    v.y += 0.05 * Math.max(0, v.x) * h; // right shoulder slightly higher
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function labelTexture(name: string, accents: string[]) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const x = c.getContext("2d")!;
  x.fillStyle = "#fbfaf7"; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = "#b89972"; x.lineWidth = 3; x.strokeRect(14, 14, 484, 484);
  x.fillStyle = "#0b0b0b"; x.textAlign = "center";
  // emblem
  x.save(); x.translate(256, 120); x.strokeStyle = "#0b0b0b"; x.lineWidth = 5;
  for (let r = 0; r < 4; r++) {
    x.save(); x.rotate((r * Math.PI) / 2);
    x.beginPath(); x.moveTo(0, -14); x.bezierCurveTo(-11, -18, -16, -32, -9, -42); x.bezierCurveTo(-5, -48, -1, -52, 0, -58);
    x.bezierCurveTo(1, -52, 5, -48, 9, -42); x.bezierCurveTo(16, -32, 11, -18, 0, -14); x.stroke(); x.restore();
  }
  x.beginPath(); x.moveTo(9, -9); x.bezierCurveTo(6, -14, -7, -14, -7, -6); x.bezierCurveTo(-7, 1, 7, 1, 7, 8); x.bezierCurveTo(7, 15, -6, 15, -9, 10); x.stroke();
  x.restore();
  x.font = "500 64px 'Cormorant Garamond', Georgia, serif";
  (x as unknown as { letterSpacing: string }).letterSpacing = "18px";
  x.fillText("SENTYAR", 262, 270);
  (x as unknown as { letterSpacing: string }).letterSpacing = "0px";
  x.font = "italic 44px 'Cormorant Garamond', Georgia, serif";
  x.fillStyle = "#34312d";
  x.fillText(name.slice(0, 20) || "Your creation", 256, 340);
  accents.slice(0, 6).forEach((col, i, arr) => {
    x.beginPath(); x.fillStyle = col; x.arc(256 + (i - (arr.length - 1) / 2) * 30, 392, 8, 0, Math.PI * 2); x.fill();
  });
  x.font = "500 22px Inter, Arial, sans-serif"; x.fillStyle = "#57534d";
  (x as unknown as { letterSpacing: string }).letterSpacing = "4px";
  x.fillText("10 ML · DEMO CONCEPT", 260, 452);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export default function Bottle3D({ fill, name, accents, autoRotate, resetKey, onError, onReady }: Bottle3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ setFill: (f: number) => void; setLabel: (n: string, a: string[]) => void; reset: () => void; setAuto: (b: boolean) => void } | null>(null);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      onError("WebGL could not start on this device.");
      return;
    }
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = true;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    // Transmission samples what is behind the glass, so give it the studio backdrop colour.
    scene.background = new THREE.Color("#f1ede6");
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.95, 5.4);
    camera.lookAt(0, 0.72, 0);

    const key = new THREE.DirectionalLight(0xfff4e6, 2.2); key.position.set(2, 3, 2.5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(-3, 2, -2); scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // glass
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.06, transmission: 1, thickness: 0.5, ior: 1.5,
      envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.05, attenuationColor: new THREE.Color("#f3eadb"), attenuationDistance: 3,
      specularIntensity: 1, transparent: false,
    });
    const body = new THREE.Mesh(bodyGeometry(1, mobile ? 48 : 96), glass);
    group.add(body);

    // liquid (inner body, clipped at the fill height)
    const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.5);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d79a45"), roughness: 0.15, transmission: 0.55, thickness: 1, ior: 1.36,
      attenuationColor: new THREE.Color("#b8721f"), attenuationDistance: 0.6, clippingPlanes: [clip], side: THREE.DoubleSide,
    });
    const liquid = new THREE.Mesh(bodyGeometry(0.86, mobile ? 40 : 72), liquidMat);
    liquid.position.y = 0.06;
    group.add(liquid);
    // meniscus disc
    const menMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#f2c47c"), roughness: 0.05, transmission: 0.4, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const meniscus = new THREE.Mesh(new THREE.CircleGeometry(1, 64), menMat);
    meniscus.rotation.x = -Math.PI / 2;
    group.add(meniscus);

    // collar + faceted cap
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 48), new THREE.MeshStandardMaterial({ color: 0xc9ab7f, metalness: 1, roughness: 0.28 }));
    collar.position.y = 1.12; group.add(collar);
    const capGeo = new THREE.DodecahedronGeometry(0.21, 0);
    capGeo.scale(1, 1.2, 0.75);
    const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0x141312, roughness: 0.55, metalness: 0.1, flatShading: true }));
    cap.position.set(0.02, 1.36, 0); cap.rotation.set(0.15, 0.4, -0.12); group.add(cap);

    // label on the front face
    let labelTex = labelTexture(name, accents);
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.7, transparent: true, opacity: 0.96 });
    const labelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.44, 32, 1, true, -0.42, 0.84);
    labelGeo.scale(1, 1, 0.6);
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(0.02, 0.5, 0.0);
    group.add(label);

    // ground + soft shadow
    const shadowTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d")!; const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
      grd.addColorStop(0, "rgba(30,20,10,0.35)"); grd.addColorStop(1, "rgba(30,20,10,0)");
      g.fillStyle = grd; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
    })();
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.001; scene.add(shadow);

    // fill handling
    const minY = 0.12, maxY = 0.98;
    let fillTarget = fill, fillNow = 0;
    const applyFill = (f: number) => {
      const y = minY + (maxY - minY) * f;
      clip.constant = y;
      // approximate inner cross-section radius at y for the meniscus
      const t = (y - 0.06) / 0.86 / 1.0;
      const r = 0.86 * Math.max(0.05, Math.sin(Math.min(Math.PI, Math.max(0, t * Math.PI * 0.98 + 0.2)))) * 0.88;
      meniscus.position.y = y;
      meniscus.scale.set(r, r * 0.58, 1);
      meniscus.visible = f > 0.01;
    };
    applyFill(0);

    // interaction
    let rotY = -0.35, velocity = 0, dragging = false, lastX = 0, auto = autoRotate;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; rotY += dx * 0.01; velocity = dx * 0.01; };
    const up = () => { dragging = false; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.cursor = "grab";

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    let raf = 0, alive = true, frames = 0, last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (!alive) return;
      try {
        const now = performance.now(); const dt = Math.min(0.1, (now - last) / 1000); last = now;
        fillNow += (fillTarget - fillNow) * (reduced ? 1 : 1 - Math.exp(-dt * 2.6));
        if (Math.abs(fillTarget - fillNow) < 0.001) fillNow = fillTarget;
        applyFill(fillNow);
        if (!dragging) { velocity *= 0.94; rotY += velocity; if (auto && !reduced) rotY += 0.22 * dt; }
        group.rotation.y = rotY;
        renderer.render(scene, camera);
        if (++frames === 2) onReady();
      } catch (err) {
        alive = false;
        onError("The 3D view stopped unexpectedly.");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const lost = (e: Event) => { e.preventDefault(); alive = false; onError("The graphics context was lost."); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    tick();

    api.current = {
      setFill: (f) => { fillTarget = Math.max(0, Math.min(1, f)); },
      setLabel: (n, a) => { const old = labelTex; labelTex = labelTexture(n, a); labelMat.map = labelTex; labelMat.needsUpdate = true; old.dispose(); },
      reset: () => { rotY = -0.35; velocity = 0; },
      setAuto: (b) => { auto = b; },
    };

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | undefined;
        if (mat) mat.dispose();
      });
      labelTex.dispose(); shadowTex.dispose(); env.dispose(); pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { api.current?.setFill(fill); }, [fill]);
  useEffect(() => { api.current?.setLabel(name, accents); }, [name, accents.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { api.current?.reset(); }, [resetKey]);
  useEffect(() => { api.current?.setAuto(autoRotate); }, [autoRotate]);

  return <div ref={host} className="bottle3d" />;
}


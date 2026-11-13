// Real-time 3D SENTYAR bottles for the Preview stage.
// Seven silhouettes (same set as the home carousel), physically based crystal,
// gold / onyx / stone / pearl caps, amber liquid, studio reflections, and the
// emblem + wordmark + creation name projected onto the curved glass.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { EMBLEM_PATH } from "../../components/Logo";
import type { BottleConceptId, BottleVolume, CapChoice } from "../../lib/types";
import { bodyById } from "../../data/bottles";

export interface Bottle3DProps {
  concept: BottleConceptId;
  cap?: CapChoice;
  volume?: BottleVolume;
  name: string;
  tint?: string;            // liquid colour
  autoRotate: boolean;
  resetKey: number;
  background?: string;
  onReady?: () => void;
  onError?: (msg: string) => void;
}

/* ---------- materials ---------- */
const mats = () => ({
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.0, transmission: 1, thickness: 0.3, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 1, envMapIntensity: 1.25, attenuationColor: new THREE.Color("#fffaf0"), attenuationDistance: 6,
  }),
  gold: new THREE.MeshStandardMaterial({ color: "#d9b46c", metalness: 1, roughness: 0.22, envMapIntensity: 1.4 }),
  goldFacet: new THREE.MeshStandardMaterial({ color: "#e2c07e", metalness: 1, roughness: 0.12, envMapIntensity: 1.6, flatShading: true }),
  onyx: new THREE.MeshPhysicalMaterial({ color: "#0d0c0b", metalness: 0.1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, flatShading: true }),
  matteBlack: new THREE.MeshStandardMaterial({ color: "#131212", metalness: 0.1, roughness: 0.55 }),
  stone: new THREE.MeshStandardMaterial({ color: "#ece4d6", metalness: 0, roughness: 0.75 }),
  pearl: new THREE.MeshPhysicalMaterial({ color: "#f7f2ea", metalness: 0, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 1, sheenColor: new THREE.Color("#f3d9e6"), iridescence: 0.35 }),
});

/* ---------- geometry helpers ---------- */
function lathe(profile: [number, number][], segs = 128) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segs);
}
function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape(); const x = -w / 2, y = 0;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function extrudeCentered(shape: THREE.Shape, depth: number, bevel: number, bevelSegs: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: bevelSegs, curveSegments: 48 });
  g.translate(0, 0, -depth / 2);
  return g;
}
function shiftUp(g: THREE.BufferGeometry) { g.computeBoundingBox(); g.translate(0, -g.boundingBox!.min.y, 0); return g; }

type Built = { body: THREE.BufferGeometry; top: number; label: { y: number; w: number }; cap: THREE.Object3D; flat?: boolean };

function buildShape(id: BottleConceptId, m: ReturnType<typeof mats>): Built {
  const capGroup = new THREE.Group();
  switch (id) {
    case "orb": {
      const body = shiftUp(new THREE.SphereGeometry(0.82, 128, 96));
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.72, 28, 1), m.goldFacet);
      cap.position.y = 0.36; capGroup.add(cap);
      return { body, top: 1.64, label: { y: 0.7, w: 0.62 }, cap: capGroup };
    }
    case "facet": {
      const s = new THREE.Shape(); const w = 0.5, h = 1.72, c = 0.2;
      s.moveTo(-w + c, 0); s.lineTo(w - c, 0); s.lineTo(w, c); s.lineTo(w, h - c * 1.4); s.lineTo(w - c, h); s.lineTo(-w + c, h); s.lineTo(-w, h - c * 1.4); s.lineTo(-w, c); s.closePath();
      const body = shiftUp(extrudeCentered(s, 0.46, 0.06, 1));
      const gem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.34, 8, 1), m.onyx); gem.position.y = 0.17;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.2, 8, 1), m.onyx); crown.position.y = 0.44;
      capGroup.add(gem, crown);
      return { body, top: 1.84, label: { y: 0.92, w: 0.56 }, cap: capGroup, flat: true };
    }
    case "fluid": {
      const g = new THREE.SphereGeometry(0.8, 128, 96); const p = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        p.setXYZ(i, x * (1 + 0.07 * Math.sin(y * 3.2 + 0.6)) + 0.05 * Math.sin(y * 2), y * 1.12, z * 0.72);
      }
      g.computeVertexNormals();
      const body = shiftUp(g);
      const stone = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 3), m.stone);
      stone.scale.set(1.15, 0.95, 0.9); stone.rotation.z = 0.3; stone.position.y = 0.22; capGroup.add(stone);
      return { body, top: 1.79, label: { y: 0.78, w: 0.56 }, cap: capGroup };
    }
    case "atelier": {
      const g = lathe([[0, 0], [0.62, 0], [0.7, 0.04], [0.8, 0.3], [0.84, 0.7], [0.8, 1.1], [0.66, 1.36], [0.34, 1.48], [0.16, 1.5], [0, 1.5]], 160);
      const p = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(z, x);
        const front = Math.abs(Math.sin(a)) > 0.86 && z > 0; // clear window at the front
        const rib = front ? 0 : 0.022 * Math.cos(a * 30);
        const k = 1 + rib; p.setXYZ(i, x * k, y, z * k * 0.8);
      }
      g.computeVertexNormals();
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.48, 0.42), m.matteBlack); cap.position.y = 0.24; capGroup.add(cap);
      return { body: g, top: 1.5, label: { y: 0.72, w: 0.6 }, cap: capGroup };
    }
    case "column": {
      const body = lathe([[0, 0], [0.3, 0], [0.33, 0.04], [0.33, 2.05], [0.3, 2.12], [0.14, 2.14], [0, 2.14]], 96);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.16, 64), m.gold); disc.position.y = 0.08; capGroup.add(disc);
      return { body, top: 2.14, label: { y: 1.12, w: 0.42 }, cap: capGroup };
    }
    case "pearl": {
      const g = new THREE.SphereGeometry(0.86, 128, 96); g.scale(1, 0.92, 0.5);
      const body = shiftUp(g);
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.21, 64, 48), m.pearl); pearl.position.y = 0.21; capGroup.add(pearl);
      return { body, top: 1.58, label: { y: 0.74, w: 0.66 }, cap: capGroup };
    }
    case "pebble":
    default: {
      const body = shiftUp(extrudeCentered(roundedRect(1.36, 1.28, 0.42), 0.5, 0.22, 10));
      // faceted gem cap in gold
      const gem = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.26, 10, 1), m.goldFacet); gem.position.y = 0.13;
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.34, 0.2, 10, 1), m.goldFacet); crown.position.y = 0.36;
      capGroup.add(gem, crown);
      return { body, top: 1.72, label: { y: 0.82, w: 0.82 }, cap: capGroup };
    }
  }
}

/** Interchangeable caps. The body's own default keeps its signature material (stone, pearl). */
function buildCap(body: BottleConceptId, cap: CapChoice, m: ReturnType<typeof mats>, own: THREE.Object3D): THREE.Object3D {
  const d = bodyById(body).defaultCap;
  if (cap.shape === "classic" && cap.shape === d.shape && cap.finish === d.finish) return own;
  const g = new THREE.Group();
  const gold = cap.finish === "gold";
  switch (cap.shape) {
    case "tall": { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.72, 28), gold ? m.goldFacet : m.matteBlack); c.position.y = 0.36; g.add(c); break; }
    case "disc": { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.16, 64), gold ? m.gold : m.matteBlack); c.position.y = 0.08; g.add(c); break; }
    case "gem": {
      const mat = gold ? m.goldFacet : m.onyx;
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.24, 10), mat); a.position.y = 0.12;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.3, 0.2, 10), mat); b.position.y = 0.34; g.add(a, b); break;
    }
    case "classic":
    default: {
      // the silhouette's own cap geometry, re-finished in black or gold
      own.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) mesh.material = gold ? m.gold : m.matteBlack; });
      return own;
    }
  }
  return g;
}

/* ---------- label texture: emblem + SENTYAR + name ---------- */
function drawLabel(ctx: CanvasRenderingContext2D, name: string) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  const foil = ctx.createLinearGradient(0, 0, W, H);
  foil.addColorStop(0, "#7d5a26"); foil.addColorStop(0.45, "#e9cf95"); foil.addColorStop(0.6, "#b48a48"); foil.addColorStop(1, "#7d5a26");
  ctx.fillStyle = foil;
  ctx.shadowColor = "rgba(255, 245, 225, 0.55)"; ctx.shadowBlur = 0; ctx.shadowOffsetY = -2;
  const em = H * 0.34;
  ctx.save(); ctx.translate(W / 2 - em / 2, H * 0.06); ctx.scale(em / 100, em / 100); ctx.fill(new Path2D(EMBLEM_PATH), "evenodd"); ctx.restore();
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  const fs = H * 0.15;
  ctx.font = `500 ${fs}px "Cormorant Garamond", Georgia, serif`;
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${fs * 0.32}px`;
  ctx.fillText("SENTYAR", W / 2 + fs * 0.16, H * 0.06 + em + fs * 1.15);
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  let ns = H * 0.12; ctx.font = `italic 400 ${ns}px "Cormorant Garamond", Georgia, serif`;
  const tw = ctx.measureText(name).width; if (tw > W * 0.9) { ns *= (W * 0.9) / tw; ctx.font = `italic 400 ${ns}px "Cormorant Garamond", Georgia, serif`; }
  ctx.fillText(name, W / 2, H * 0.06 + em + fs * 1.15 + ns * 1.45);
}

const VOLUME_SCALE: Record<BottleVolume, number> = { 10: 0.8, 50: 1, 100: 1.14 };

export default function Bottle3D({ concept, cap, volume = 50, name, tint = "#d99a35", autoRotate, resetKey, background = "#fbf7f0", onReady, onError }: Bottle3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const nameRef = useRef(name);
  const volumeRef = useRef<BottleVolume>(volume);
  const capKey = cap ? `${cap.shape}.${cap.finish}` : "";
  const api = useRef<{ setScale: (v: BottleVolume) => void; setName: (n: string) => void; setAuto: (a: boolean) => void; reset: () => void; setTint: (c: string) => void } | null>(null);

  // one renderer per mount; rebuild the bottle when the concept changes
  useEffect(() => {
    const el = host.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch { onError?.("WebGL isn’t available in this browser."); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = true;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 1.25, 5.6);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI / 2.9; controls.maxPolarAngle = Math.PI / 1.95;
    controls.autoRotate = autoRotate; controls.autoRotateSpeed = 1.3;

    const key = new THREE.DirectionalLight(0xfff3df, 1.6); key.position.set(-3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(3, 2, -4); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8dcc6, 0.5));

    // soft contact shadow
    const sc = document.createElement("canvas"); sc.width = sc.height = 256;
    const sx = sc.getContext("2d")!; const grd = sx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(70,48,18,0.42)"); grd.addColorStop(0.5, "rgba(70,48,18,0.14)"); grd.addColorStop(1, "rgba(70,48,18,0)");
    sx.fillStyle = grd; sx.fillRect(0, 0, 256, 256);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.002; scene.add(shadow);

    // label texture (shared, redrawn on rename)
    const lc = document.createElement("canvas"); lc.width = 1024; lc.height = 640;
    const lctx = lc.getContext("2d")!;
    const labelTex = new THREE.CanvasTexture(lc); labelTex.colorSpace = THREE.SRGBColorSpace; labelTex.anisotropy = 8;
    const setName = (n: string) => { drawLabel(lctx, n || "Your creation"); labelTex.needsUpdate = true; };
    document.fonts?.load('500 40px "Cormorant Garamond"').then(() => setName(nameRef.current)).catch(() => {});
    setName(nameRef.current);

    const m = mats();
    const liquidMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(tint), roughness: 0.2, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6, side: THREE.DoubleSide, clippingPlanes: [] });
    const bottle = new THREE.Group(); scene.add(bottle);
    const b = buildShape(concept, m);
    const body = new THREE.Mesh(b.body, m.glass); bottle.add(body);
    // liquid: the body shrunk inside its walls, clipped at the fill line
    const inner = b.body.clone(); inner.computeBoundingBox();
    const bb = inner.boundingBox!; const cy = (bb.max.y + bb.min.y) / 2;
    inner.translate(0, -cy, 0); inner.scale(0.9, 0.9, b.flat ? 0.8 : 0.88); inner.translate(0, cy + 0.03, 0);
    const fillY = bb.min.y + (bb.max.y - bb.min.y) * 0.9;
    liquidMat.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), fillY)];
    const liquid = new THREE.Mesh(inner, liquidMat); bottle.add(liquid);
    // neck + gold collar + cap
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.14, 48), m.glass); neck.position.y = b.top + 0.05; bottle.add(neck);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 64), m.gold); collar.position.y = b.top + 0.16; bottle.add(collar);
    const capObj = cap ? buildCap(concept, cap, m, b.cap) : b.cap;
    capObj.position.y = b.top + 0.22; bottle.add(capObj);
    bottle.scale.setScalar(VOLUME_SCALE[volumeRef.current]);
    // centre the bottle vertically in frame
    const height = b.top + 0.9;
    bottle.position.y = 0;
    controls.target.set(0, height * 0.46, 0);
    camera.position.set(0, height * 0.62, 5.2 + height * 0.35);

    // engraved label projected onto the curved front of the glass
    body.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(new THREE.Vector3(0, b.label.y, 5), new THREE.Vector3(0, 0, -1));
    const hit = ray.intersectObject(body)[0];
    let decal: THREE.Mesh | null = null;
    if (hit) {
      const size = new THREE.Vector3(b.label.w, b.label.w * 0.625, 1.2);
      decal = new THREE.Mesh(
        new DecalGeometry(body, hit.point, new THREE.Euler(0, 0, 0), size),
        new THREE.MeshStandardMaterial({ map: labelTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, roughness: 0.28, metalness: 0.75, envMapIntensity: 1.3 }),
      );
      bottle.add(decal);
    }

    // sizing
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    // render loop, paused when off-screen or hidden
    let raf = 0, visible = true, ready = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
    io.observe(el);
    const loop = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      controls.update();
      renderer.render(scene, camera);
      if (!ready) { ready = true; onReady?.(); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    const onVis = () => { if (!document.hidden && !raf) loop(); };
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => { e.preventDefault(); onError?.("The 3D view was interrupted."); };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    const home = { pos: camera.position.clone() };
    api.current = {
      setScale: (v: BottleVolume) => { bottle.scale.setScalar(VOLUME_SCALE[v]); },
      setName,
      setAuto: (a) => { controls.autoRotate = a; },
      reset: () => { camera.position.copy(home.pos); controls.update(); },
      setTint: (c) => { liquidMat.color.set(c); },
    };

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      controls.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mm = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach((x) => { (x as THREE.MeshStandardMaterial).map?.dispose(); x.dispose(); });
      });
      Object.values(m).forEach((x) => x.dispose());
      labelTex.dispose(); envTex.dispose(); pmrem.dispose(); renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept, capKey, background]);

  useEffect(() => { nameRef.current = name; api.current?.setName(name); }, [name]);
  useEffect(() => { api.current?.setAuto(autoRotate); }, [autoRotate]);
  useEffect(() => { if (resetKey) api.current?.reset(); }, [resetKey]);
  useEffect(() => { api.current?.setTint(tint); }, [tint]);
  useEffect(() => { volumeRef.current = volume; api.current?.setScale(volume); }, [volume]);

  return <div ref={host} className="bottle3d" />;
}

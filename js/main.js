/* ============================================================
   NEXURAA — 3D wrist hero scene + page interactions
   Procedurally modeled wrist/hand wearing the Nexuraa band.
   ============================================================ */

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------
   Renderer / scene / camera
   ------------------------------------------------------------ */
const canvas = document.getElementById("wrist-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
camera.position.set(0, 0.35, 5.4);
camera.lookAt(0, 0, 0);

/* ------------------------------------------------------------
   Lights — dark sculptural look with cyan/violet rims
   ------------------------------------------------------------ */
scene.add(new THREE.AmbientLight(0x404a5c, 0.9));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(3.2, 4, 4.5);
scene.add(keyLight);

const rimCyan = new THREE.PointLight(0x22d3ee, 26, 20);
rimCyan.position.set(-4, 1.6, -2.4);
scene.add(rimCyan);

const rimViolet = new THREE.PointLight(0x8b5cf6, 20, 20);
rimViolet.position.set(4.2, -2.2, -1.8);
scene.add(rimViolet);

const screenGlow = new THREE.PointLight(0x67e8f9, 4, 3);
scene.add(screenGlow);

/* ------------------------------------------------------------
   Materials
   ------------------------------------------------------------ */
const skinMat = new THREE.MeshStandardMaterial({
  color: 0x2b3040,          // sculptural charcoal "mannequin" finish
  roughness: 0.42,
  metalness: 0.25,
});
const bandMat = new THREE.MeshStandardMaterial({
  color: 0x11141c,
  roughness: 0.3,
  metalness: 0.75,
});
const caseMat = new THREE.MeshStandardMaterial({
  color: 0x1a1e2a,
  roughness: 0.22,
  metalness: 0.9,
});
const glowMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

/* ------------------------------------------------------------
   Arm group — forearm, hand, fingers
   ------------------------------------------------------------ */
const arm = new THREE.Group();
scene.add(arm);

// Forearm: lathe profile tapering from elbow to wrist
const profile = [
  [0.66, -2.9], [0.64, -2.3], [0.58, -1.6], [0.49, -0.9],
  [0.42, -0.4], [0.385, -0.05], [0.38, 0.2],
].map(([r, y]) => new THREE.Vector2(r, y));
const forearm = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), skinMat);
forearm.scale.z = 0.78; // elliptical cross-section
arm.add(forearm);

// Wrist cap so the lathe isn't hollow at the top
const wristCap = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), skinMat);
wristCap.position.y = 0.2;
wristCap.scale.set(1, 0.55, 0.78);
arm.add(wristCap);

// Palm
const palm = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.9, 0.34, 4, 0.13), skinMat);
palm.position.set(0, 0.72, 0);
arm.add(palm);

// Knuckle ridge
const knuckles = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 16), skinMat);
knuckles.position.set(0, 1.12, 0);
knuckles.scale.set(1.02, 0.42, 0.42);
arm.add(knuckles);

// Fingers — two-segment capsules, gently curled
function makeFinger(x, baseLen, tipLen, radius, curl) {
  const finger = new THREE.Group();

  const base = new THREE.Mesh(new THREE.CapsuleGeometry(radius, baseLen, 6, 12), skinMat);
  base.position.y = baseLen / 2;
  const baseJoint = new THREE.Group();
  baseJoint.rotation.x = curl;
  baseJoint.add(base);
  finger.add(baseJoint);

  const tip = new THREE.Mesh(new THREE.CapsuleGeometry(radius * 0.88, tipLen, 6, 12), skinMat);
  tip.position.y = tipLen / 2;
  const tipJoint = new THREE.Group();
  tipJoint.position.y = baseLen;
  tipJoint.rotation.x = curl * 1.35;
  tipJoint.add(tip);
  baseJoint.add(tipJoint);

  finger.position.set(x, 1.14, 0.02);
  return finger;
}
arm.add(makeFinger(-0.285, 0.30, 0.24, 0.082, 0.55)); // pinky side
arm.add(makeFinger(-0.095, 0.36, 0.28, 0.09, 0.5));
arm.add(makeFinger(0.095, 0.38, 0.30, 0.092, 0.48));
arm.add(makeFinger(0.285, 0.33, 0.26, 0.086, 0.52)); // index

// Thumb
const thumb = new THREE.Group();
const thumbBase = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.3, 6, 12), skinMat);
thumbBase.position.y = 0.15;
thumb.add(thumbBase);
const thumbTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.088, 0.2, 6, 12), skinMat);
thumbTip.position.set(0, 0.42, 0.06);
thumbTip.rotation.x = 0.5;
thumb.add(thumbTip);
thumb.position.set(0.42, 0.52, 0.1);
thumb.rotation.set(0.35, 0, -0.55);
arm.add(thumb);

/* ------------------------------------------------------------
   The Nexuraa band — strap, case, live screen, hologram edge
   ------------------------------------------------------------ */
const band = new THREE.Group();
band.position.y = -0.16;
arm.add(band);

// Strap wrapping the wrist
const strap = new THREE.Mesh(new THREE.TorusGeometry(0.415, 0.075, 20, 60), bandMat);
strap.rotation.x = Math.PI / 2;
strap.scale.set(1, 0.8, 1); // match elliptical wrist (torus local Y = world Z)
band.add(strap);

// Hologram edge strip — the glowing signature line
const holoEdge = new THREE.Mesh(new THREE.TorusGeometry(0.435, 0.014, 10, 72), glowMat);
holoEdge.rotation.x = Math.PI / 2;
holoEdge.scale.set(1, 0.8, 1);
holoEdge.position.y = 0.055;
band.add(holoEdge);

// Watch case sitting on the front of the wrist
const watchCase = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.64, 0.15, 4, 0.07), caseMat);
watchCase.position.set(0, 0, 0.38);
watchCase.rotation.x = -0.06;
band.add(watchCase);

// Crown button
const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16), caseMat);
crown.rotation.z = Math.PI / 2;
crown.position.set(0.3, 0.12, 0.38);
band.add(crown);

// Live screen — canvas texture with clock + heart rate
const screenCanvas = document.createElement("canvas");
screenCanvas.width = 256;
screenCanvas.height = 288;
const sctx = screenCanvas.getContext("2d");
const screenTex = new THREE.CanvasTexture(screenCanvas);
screenTex.colorSpace = THREE.SRGBColorSpace;

const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.53), screenMat);
screen.position.set(0, 0.003, 0.457);
screen.rotation.x = -0.06;
band.add(screen);
screenGlow.position.set(0, -0.16, 0.9);

let bpm = 62;
function drawScreen(t) {
  const w = screenCanvas.width, h = screenCanvas.height;

  // background
  const g = sctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#060a12");
  g.addColorStop(1, "#0b1526");
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, w, h);

  // time
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  sctx.fillStyle = "#eef6ff";
  sctx.font = "700 64px 'Space Grotesk', sans-serif";
  sctx.textAlign = "center";
  sctx.fillText(`${hh}:${mm}`, w / 2, 96);

  sctx.fillStyle = "#5eead4";
  sctx.font = "500 20px 'Space Grotesk', sans-serif";
  sctx.fillText("NEXURAA", w / 2, 34);

  // heart rate
  bpm += (Math.sin(t * 0.0006) * 4 + 62 - bpm) * 0.02;
  const beat = 1 + 0.25 * Math.max(0, Math.sin(t * 0.008)) ** 6;
  sctx.save();
  sctx.translate(w / 2 - 52, 150);
  sctx.scale(beat, beat);
  sctx.fillStyle = "#f0648c";
  sctx.font = "40px sans-serif";
  sctx.fillText("♥", 0, 12);
  sctx.restore();
  sctx.fillStyle = "#eef6ff";
  sctx.font = "600 40px 'Space Grotesk', sans-serif";
  sctx.fillText(`${Math.round(bpm)}`, w / 2 + 22, 164);
  sctx.fillStyle = "#8fa3c0";
  sctx.font = "400 17px 'Space Grotesk', sans-serif";
  sctx.fillText("bpm", w / 2 + 78, 164);

  // ecg trace
  sctx.strokeStyle = "#22d3ee";
  sctx.lineWidth = 2.5;
  sctx.beginPath();
  const baseY = 224;
  for (let x = 0; x <= w - 40; x += 2) {
    const phase = (x / (w - 40) + t * 0.0004) % 1;
    const p = (phase * 3) % 1;
    let y = 0;
    if (p > 0.42 && p < 0.5) y = -34 * Math.sin((p - 0.42) / 0.08 * Math.PI);
    else if (p > 0.5 && p < 0.56) y = 14 * Math.sin((p - 0.5) / 0.06 * Math.PI);
    else y = Math.sin(phase * 40) * 2;
    sctx[x === 0 ? "moveTo" : "lineTo"](20 + x, baseY + y);
  }
  sctx.stroke();

  // activity dots
  sctx.fillStyle = "#8fa3c0";
  sctx.font = "400 15px 'Space Grotesk', sans-serif";
  sctx.fillText("recovery 94 · steps 8,412", w / 2, 268);

  screenTex.needsUpdate = true;
}

/* ------------------------------------------------------------
   Floating particles
   ------------------------------------------------------------ */
const particleCount = 260;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.02, transparent: true, opacity: 0.55 })
);
scene.add(particles);

/* ------------------------------------------------------------
   Pose + interaction
   ------------------------------------------------------------ */
arm.rotation.z = -0.42;      // diagonal presentation pose
arm.rotation.x = 0.12;
arm.position.set(0.1, 0.15, 0);

let targetRotY = 0.5;
let currentRotY = 0.5;
let targetRotX = 0;
let currentRotX = 0;
let autoSpin = !prefersReducedMotion;
let lastInteraction = 0;

let dragging = false;
let lastX = 0, lastY = 0;

canvas.addEventListener("pointerdown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  targetRotY += (e.clientX - lastX) * 0.008;
  targetRotX = THREE.MathUtils.clamp(targetRotX + (e.clientY - lastY) * 0.004, -0.4, 0.4);
  lastX = e.clientX;
  lastY = e.clientY;
  lastInteraction = performance.now();
});
const endDrag = () => { dragging = false; };
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

// subtle camera parallax from mouse position
let parallaxX = 0, parallaxY = 0;
window.addEventListener("pointermove", (e) => {
  parallaxX = (e.clientX / window.innerWidth - 0.5) * 0.3;
  parallaxY = (e.clientY / window.innerHeight - 0.5) * 0.2;
});

/* ------------------------------------------------------------
   Resize
   ------------------------------------------------------------ */
function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  if (canvas.width !== w * renderer.getPixelRatio() || canvas.height !== h * renderer.getPixelRatio()) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
window.addEventListener("resize", resize);

/* ------------------------------------------------------------
   Render loop
   ------------------------------------------------------------ */
let lastScreenDraw = 0;
function tick(t) {
  requestAnimationFrame(tick);
  resize();

  // resume slow auto-spin a moment after the user lets go
  if (autoSpin && !dragging && t - lastInteraction > 2500) {
    targetRotY += 0.0016;
  }
  currentRotY += (targetRotY - currentRotY) * 0.08;
  currentRotX += (targetRotX - currentRotX) * 0.08;
  arm.rotation.y = currentRotY;
  arm.rotation.x = 0.12 + currentRotX;

  // gentle float
  arm.position.y = 0.15 + (prefersReducedMotion ? 0 : Math.sin(t * 0.0009) * 0.06);

  // scroll pull-back
  const scrollN = Math.min(window.scrollY / window.innerHeight, 1);
  camera.position.z = 5.4 + scrollN * 1.4;
  camera.position.x += (parallaxX - camera.position.x) * 0.05;
  camera.position.y += (0.35 - parallaxY - camera.position.y) * 0.05;
  camera.lookAt(0, 0.1, 0);

  // hologram edge shimmer
  glowMat.color.setHSL(0.5 + Math.sin(t * 0.0012) * 0.06, 0.85, 0.6);

  if (!prefersReducedMotion) particles.rotation.y = t * 0.00002;

  // screen refreshes at ~12 fps — plenty for a clock + ecg
  if (t - lastScreenDraw > 80) {
    drawScreen(t);
    lastScreenDraw = t;
  }

  renderer.render(scene, camera);
}
requestAnimationFrame(tick);

/* ------------------------------------------------------------
   Page interactions — scroll reveal + mobile nav
   ------------------------------------------------------------ */
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  observer.observe(el);
});

const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");
burger.addEventListener("click", () => nav.classList.toggle("is-open"));
nav.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("is-open"))
);

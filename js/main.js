/* ============================================================
   KAIROS — hero carousel, collection grid, page interactions
   ============================================================ */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_38FFTATqq99ejp1QmXUChIBsr4F";

const WATCHES = [
  {
    collection: "Aperture Collection",
    title: "Aperture<br />Skeleton",
    spec: "42 MM · Grade-5 Titanium",
    desc: "The manufacture calibre laid bare. Golden gears and black bridges suspended behind sapphire — nothing hidden, nothing spared.",
    price: "£12,400",
    name: "Aperture Skeleton",
    img: `${CDN}/hf_20260702_130604_97ac780f-2ccc-42dc-8e33-f3915ccbeca2.png`,
  },
  {
    collection: "Abyss Collection",
    title: "Abyss<br />Carbon",
    spec: "44 MM · Carbon Composite",
    desc: "Built for the dark. A carbon cushion case, luminous sandwich dial and the crown bridge that became our signature.",
    price: "£9,800",
    name: "Abyss Carbon",
    img: `${CDN}/hf_20260702_130607_7ca57ded-5fda-4c0d-90b3-aca3d591e70c.png`,
  },
  {
    collection: "Monolith Collection",
    title: "Monolith<br />Steel",
    spec: "40 MM · Single-Block Steel",
    desc: "Machined from one billet of steel. No numerals, no noise — time reduced to its purest gesture.",
    price: "£7,200",
    name: "Monolith Steel",
    img: `${CDN}/hf_20260702_130614_fb68b35d-556f-4a3b-885a-d3a8d769abcf.png`,
  },
  {
    collection: "Machina Collection",
    title: "Machina<br />Avant-Garde",
    spec: "45 MM · Steel & Ceramic",
    desc: "A machine sculpture for the wrist. Suspended gear train, floating hour ring, crown at twelve. Horology, rebuilt.",
    price: "£15,900",
    name: "Machina Avant-Garde",
    img: `${CDN}/hf_20260702_130615_340aaf35-ccba-4f72-b0d9-5dee3404025a.png`,
  },
];

/* Exploded engineering media — image now, video swapped in when ready */
const EXPLODED_IMAGE = `${CDN}/hf_20260702_131231_67e9f776-5cdf-4fc6-a46e-f2463d486b86.png`;
const EXPLODED_VIDEO = `${CDN}/hf_20260702_131620_568d46a2-29c7-409f-ae7f-3cce5e6e3436.mp4`;

/* ------------------------------------------------------------
   Build hero slides + dots
   ------------------------------------------------------------ */
const slidesEl = document.getElementById("slides");
const dotsEl = document.getElementById("dots");
const panelEl = document.getElementById("heroPanel");
const idxEl = document.getElementById("slideIndex");
document.getElementById("slideTotal").textContent = String(WATCHES.length).padStart(2, "0");

WATCHES.forEach((w, i) => {
  const slide = document.createElement("article");
  slide.className = "slide" + (i === 0 ? " is-active" : "");
  slide.innerHTML = `
    <div class="slide__copy">
      <p class="slide__collection">${w.collection}</p>
      <h1 class="slide__title">${w.title}</h1>
      <p class="slide__spec">${w.spec}</p>
      <p class="slide__desc">${w.desc}</p>
      <a class="slide__cta" href="#detail">Discover <i>→</i></a>
    </div>
    <div class="slide__img-wrap">
      <img src="${w.img}" alt="KAIROS ${w.name}" ${i === 0 ? "" : 'loading="lazy"'} />
    </div>`;
  slidesEl.appendChild(slide);

  const dot = document.createElement("button");
  dot.className = i === 0 ? "is-active" : "";
  dot.setAttribute("aria-label", `Show ${w.name}`);
  dot.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(dot);
});

const slides = [...slidesEl.children];
const dots = [...dotsEl.children];
let current = 0;
let sweeping = false;

function goTo(next) {
  if (sweeping || next === current) return;
  sweeping = true;

  // the right-to-left sweep panel, then swap content mid-sweep
  panelEl.classList.add("is-sweeping");
  setTimeout(() => {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (next + WATCHES.length) % WATCHES.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    idxEl.textContent = String(current + 1).padStart(2, "0");
  }, 480);

  panelEl.addEventListener("animationend", () => {
    panelEl.classList.remove("is-sweeping");
    sweeping = false;
  }, { once: true });
}

document.getElementById("nextBtn").addEventListener("click", () => goTo(current + 1));
document.getElementById("prevBtn").addEventListener("click", () => goTo(current - 1));

/* keyboard + touch swipe */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goTo(current + 1);
  if (e.key === "ArrowLeft") goTo(current - 1);
});
let touchX = null;
slidesEl.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
slidesEl.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* auto-advance, paused while the tab is hidden */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion) {
  setInterval(() => {
    if (!document.hidden) goTo(current + 1);
  }, 7000);
}

/* ------------------------------------------------------------
   Engineering media (exploded view)
   ------------------------------------------------------------ */
const media = document.getElementById("explodedMedia");
const video = document.getElementById("explodedVideo");
document.getElementById("explodedImage").src = EXPLODED_IMAGE;

if (EXPLODED_VIDEO) {
  const src = document.createElement("source");
  src.src = EXPLODED_VIDEO;
  src.type = "video/mp4";
  video.appendChild(src);
  media.classList.add("has-video");

  // play only while on screen
  new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => (en.isIntersecting ? video.play().catch(() => {}) : video.pause())),
    { threshold: 0.35 }
  ).observe(video);
}

/* ------------------------------------------------------------
   Product detail — featured watch
   ------------------------------------------------------------ */
document.getElementById("detailImage").src = WATCHES[0].img;
document.getElementById("detailImage").alt = `KAIROS ${WATCHES[0].name}`;

/* ------------------------------------------------------------
   Collection grid
   ------------------------------------------------------------ */
const grid = document.getElementById("watchGrid");
WATCHES.forEach((w) => {
  const card = document.createElement("article");
  card.className = "watch-card reveal";
  card.innerHTML = `
    <img src="${w.img}" alt="KAIROS ${w.name}" loading="lazy" />
    <h3>${w.name}</h3>
    <p>${w.spec}</p>
    <strong>${w.price}</strong>
    <span class="discover">Discover →</span>`;
  card.addEventListener("click", () => {
    document.getElementById("detailImage").src = w.img;
    document.getElementById("detailImage").alt = `KAIROS ${w.name}`;
    document.getElementById("detail").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
  grid.appendChild(card);
});

/* ------------------------------------------------------------
   Scroll reveal + mobile nav
   ------------------------------------------------------------ */
const observer = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        observer.unobserve(en.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");
burger.addEventListener("click", () => nav.classList.toggle("is-open"));
nav.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("is-open"))
);

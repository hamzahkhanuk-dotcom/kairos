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
    img: `${CDN}/hf_20260702_133652_f6e8f930-20a3-4b5b-b5e2-2287b941a07c.png`,
  },
  {
    collection: "Abyss Collection",
    title: "Abyss<br />Carbon",
    spec: "44 MM · Carbon Composite",
    desc: "Built for the dark. A carbon cushion case, luminous sandwich dial and the crown bridge that became our signature.",
    price: "£9,800",
    name: "Abyss Carbon",
    img: `${CDN}/hf_20260702_133653_12bd53e9-a01f-4ae1-ba67-4419296812c4.png`,
  },
  {
    collection: "Monolith Collection",
    title: "Monolith<br />Steel",
    spec: "40 MM · Single-Block Steel",
    desc: "Machined from one billet of steel. No numerals, no noise — time reduced to its purest gesture.",
    price: "£7,200",
    name: "Monolith Steel",
    img: `${CDN}/hf_20260702_140521_24b0504e-ee32-4663-b649-10ab60ea30ed.png`,
  },
  {
    collection: "Machina Collection",
    title: "Machina<br />Avant-Garde",
    spec: "45 MM · Steel & Ceramic",
    desc: "A machine sculpture for the wrist. Suspended gear train, floating hour ring, crown at twelve. Horology, rebuilt.",
    price: "£15,900",
    name: "Machina Avant-Garde",
    img: `${CDN}/hf_20260702_133701_45a89cdd-bdee-4dc1-b236-1192f0b77096.png`,
  },
];

/* Exploded engineering media — image now, video swapped in when ready */
const EXPLODED_IMAGE = `${CDN}/hf_20260702_131231_67e9f776-5cdf-4fc6-a46e-f2463d486b86.png`;
const EXPLODED_VIDEO = `${CDN}/hf_20260702_132503_ae6df21c-ed64-49d8-add3-b9d1c34d0c72.mp4`;
const EXPLODED_POSTER = `${CDN}/hf_20260702_132346_fde47a2a-ddf5-45f6-ad86-cc28099e9f40.png`;

/* ------------------------------------------------------------
   Build hero slides + dots
   ------------------------------------------------------------ */
const slidesEl = document.getElementById("slides");
const dotsEl = document.getElementById("dots");
const idxEl = document.getElementById("slideIndex");
/* brush-stroke mask — the watch is "painted" onto the stage stroke by stroke */
function brushArt(i, url, name) {
  return `
  <svg class="slide__art" viewBox="0 0 900 1200" role="img" aria-label="KAIROS ${name}">
    <defs>
      <mask id="brush${i}" maskUnits="userSpaceOnUse">
        <rect width="900" height="1200" fill="#000" />
        <g class="strokes" fill="none" stroke="#fff" stroke-linecap="round">
          <path pathLength="1000" stroke-width="200" d="M-60,110 C240,30 620,190 960,80" />
          <path pathLength="1000" stroke-width="205" d="M960,300 C640,210 260,390 -60,290" />
          <path pathLength="1000" stroke-width="205" d="M-60,490 C280,400 600,580 960,470" />
          <path pathLength="1000" stroke-width="205" d="M960,680 C620,590 280,770 -60,670" />
          <path pathLength="1000" stroke-width="205" d="M-60,870 C280,780 620,960 960,850" />
          <path pathLength="1000" stroke-width="215" d="M960,1075 C620,985 280,1165 -60,1055" />
        </g>
        <rect class="mask-fill" width="900" height="1200" fill="#fff" opacity="0" />
      </mask>
    </defs>
    <image href="${url}" x="0" y="0" width="900" height="1200"
           preserveAspectRatio="xMidYMid meet" mask="url(#brush${i})" />
  </svg>`;
}

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
    <div class="slide__img-wrap">${brushArt(i, w.img, w.name)}</div>`;
  slidesEl.appendChild(slide);
});

/* final slide — the calibre burst film, full-bleed */
const videoSlide = document.createElement("article");
videoSlide.className = "slide slide--video";
videoSlide.innerHTML = `
  <video muted loop playsinline preload="metadata" poster="${EXPLODED_POSTER}">
    <source src="${EXPLODED_VIDEO}" type="video/mp4" />
  </video>
  <div class="slide__copy slide__copy--video">
    <p class="slide__collection">In-house Calibre K-01</p>
    <h1 class="slide__title">Engineered<br />to defy time</h1>
    <a class="slide__cta" href="#engineering">Discover <i>→</i></a>
  </div>`;
slidesEl.appendChild(videoSlide);
const heroVideo = videoSlide.querySelector("video");

const slides = [...slidesEl.children];
document.getElementById("slideTotal").textContent = String(slides.length).padStart(2, "0");
slides.forEach((s, i) => {
  const dot = document.createElement("button");
  dot.className = i === 0 ? "is-active" : "";
  dot.setAttribute("aria-label", `Show slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(dot);
});
const dots = [...dotsEl.children];
let current = 0;
let sweeping = false;

function goTo(next) {
  if (sweeping || next === current) return;
  sweeping = true;

  slides[current].classList.remove("is-active");
  dots[current].classList.remove("is-active");
  current = (next + slides.length) % slides.length;
  slides[current].classList.add("is-active");
  dots[current].classList.add("is-active");
  idxEl.textContent = String(current + 1).padStart(2, "0");

  // the film slide plays only while it is on stage
  if (slides[current] === videoSlide) {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  } else {
    heroVideo.pause();
  }

  // lock until the paint-in finishes
  setTimeout(() => (sweeping = false), 900);
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
   Engineering media — exploded still (film lives in the hero)
   ------------------------------------------------------------ */
document.getElementById("explodedImage").src = EXPLODED_IMAGE;

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

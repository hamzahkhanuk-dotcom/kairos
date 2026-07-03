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
/* brush-stroke mask — a pencil "sketch" ghost is scribbled in first,
   then the full watch is painted over it stroke by stroke */
function brushArt(i, url, name) {
  return `
  <svg class="slide__art" viewBox="0 0 900 1200" role="img" aria-label="KAIROS ${name}">
    <defs>
      <mask id="sketch${i}" maskUnits="userSpaceOnUse">
        <rect width="900" height="1200" fill="#000" />
        <g class="scribbles" fill="none" stroke="#fff" stroke-linecap="round">
          <path pathLength="1000" stroke-width="80" d="M-60,80 C300,10 560,170 960,60 C600,150 340,40 -60,140" />
          <path pathLength="1000" stroke-width="85" d="M960,240 C580,160 300,330 -60,230 C320,330 620,190 960,310" />
          <path pathLength="1000" stroke-width="85" d="M-60,420 C340,330 580,500 960,400 C560,510 300,370 -60,490" />
          <path pathLength="1000" stroke-width="85" d="M960,590 C600,510 300,680 -60,580 C340,680 620,540 960,660" />
          <path pathLength="1000" stroke-width="85" d="M-60,770 C340,680 580,850 960,750 C560,860 300,720 -60,840" />
          <path pathLength="1000" stroke-width="85" d="M960,940 C600,860 300,1030 -60,930 C340,1030 620,890 960,1010" />
          <path pathLength="1000" stroke-width="90" d="M-60,1120 C340,1030 580,1190 960,1090 C560,1200 300,1080 -60,1170" />
        </g>
      </mask>
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
    <image class="slide__sketch" href="${url}" x="0" y="0" width="900" height="1200"
           preserveAspectRatio="xMidYMid meet" mask="url(#sketch${i})" />
    <image href="${url}" x="0" y="0" width="900" height="1200"
           preserveAspectRatio="xMidYMid meet" mask="url(#brush${i})" />
  </svg>`;
}

WATCHES.forEach((w, i) => {
  const slide = document.createElement("article");
  slide.className = "slide"; // slide 1 activates after the intro curtain lifts
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

  // lock until the sketch + paint passes finish
  setTimeout(() => (sweeping = false), 1400);
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
   Engineering media — exploded still with cycling spec callouts
   ------------------------------------------------------------ */
document.getElementById("explodedImage").src = EXPLODED_IMAGE;

const CALLOUTS = [
  { x: 15, y: 48, t: "Sapphire crystal", s: "Double anti-reflective · 9H hardness" },
  { x: 34, y: 40, t: "Openworked dial", s: "Hand-finished · gilded gear train" },
  { x: 50, y: 40, t: "Mainspring barrel", s: "96-hour power reserve" },
  { x: 58, y: 66, t: "Free-sprung balance", s: "28,800 vph · ±2 s/day" },
  { x: 68, y: 46, t: "Gear train", s: "214 components · 31 jewels" },
  { x: 85, y: 44, t: "Case middle", s: "Grade-5 titanium · 5 ATM" },
];

const calloutsEl = document.getElementById("callouts");
CALLOUTS.forEach((c) => {
  const el = document.createElement("div");
  el.className = "callout" + (c.x > 62 ? " callout--flip" : "");
  el.style.left = c.x + "%";
  el.style.top = c.y + "%";
  el.innerHTML = `
    <span class="callout__dot"></span>
    <span class="callout__stem"></span>
    <span class="callout__label"><strong>${c.t}</strong><em>${c.s}</em></span>`;
  calloutsEl.appendChild(el);
});

const calloutEls = [...calloutsEl.children];
let calloutIdx = 0;
calloutEls[0].classList.add("is-on");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    if (document.hidden) return;
    calloutEls[calloutIdx].classList.remove("is-on");
    calloutIdx = (calloutIdx + 1) % calloutEls.length;
    calloutEls[calloutIdx].classList.add("is-on");
  }, 3200);
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
WATCHES.forEach((w, i) => {
  const card = document.createElement("article");
  card.className = "watch-card reveal";
  card.innerHTML = `
    <span class="watch-card__num">0${i + 1}</span>
    <img src="${w.img}" alt="KAIROS ${w.name}" loading="lazy" style="animation-delay:${i * 1.1}s" />
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

/* ------------------------------------------------------------
   Intro curtain — mark draws, wordmark spreads, curtain lifts.
   Full show once per browser session; skipped for reduced motion.
   ------------------------------------------------------------ */
const intro = document.getElementById("intro");

function startSite() {
  slides[0].classList.add("is-active");
  dots[0].classList.add("is-active");
}

let introSeen = false;
try {
  introSeen = sessionStorage.getItem("kairos-intro") === "1";
} catch (e) { /* storage blocked — just play it */ }

if (!intro || reducedMotion || introSeen) {
  if (intro) intro.classList.add("is-removed");
  startSite();
} else {
  document.body.classList.add("intro-locked");
  intro.classList.add("is-playing");

  setTimeout(() => {
    intro.classList.add("is-done");        // curtain lifts
    startSite();                           // hero paints in underneath
    document.body.classList.remove("intro-locked");
    try { sessionStorage.setItem("kairos-intro", "1"); } catch (e) {}
  }, 2650);

  intro.addEventListener("transitionend", () => intro.classList.add("is-removed"), { once: true });
}

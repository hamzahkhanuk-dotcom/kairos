# NEXURAA — 3D Wrist Landing Page

A front landing page for the Nexuraa smart band, featuring an interactive 3D wrist
wearing the band — procedurally modeled in [Three.js](https://threejs.org/) with no
external 3D assets.

## Highlights

- **Interactive 3D hero** — a sculptural wrist + hand wearing the Nexuraa band.
  Drag to rotate, auto-spins when idle, subtle mouse parallax and scroll pull-back.
- **Live watch screen** — the band's display is a real canvas texture showing the
  current time, an animated heart-rate readout and a scrolling ECG trace.
- **Full landing layout** — hero, feature marquee, capability cards, technology
  split section, spec grid, pre-order CTA and footer.
- **Zero build step** — plain HTML/CSS/ES modules. Three.js (v0.160.0) loads from
  the jsDelivr CDN via an import map; to work offline, drop `three.module.js` and
  `RoundedBoxGeometry.js` into `js/vendor/` and point the import map there.
- Responsive (mobile nav + stacked hero) and respects `prefers-reduced-motion`.

## Run it

Serve the folder with any static server and open `index.html`:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

(A server is required because the page uses ES module imports.)

## Structure

```
index.html          Page markup + import map
css/style.css       All styling
js/main.js          Three.js scene (wrist, hand, band, screen) + page interactions
```

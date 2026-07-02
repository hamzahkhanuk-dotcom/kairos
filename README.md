# KAIROS — Luxury Watch Concept Site

A premium front landing page concept for **KAIROS**, a fictional haute-horlogerie
brand. Monochrome design (white / grey / black), editorial typography, AI-generated
product photography and video.

## Sections

- **Hero collection carousel** — four watch models with a right-to-left panel
  sweep transition (dots, arrows, keyboard and touch swipe, auto-advance).
- **Engineering** — exploded view of the in-house calibre; a generated video of
  the components drifting apart plays when it scrolls into view.
- **Boutique detail** — split product page: image panel + purchase panel with
  wishlist/share, add-to-bag, price, and service links.
- **Collections grid** — all four models; clicking a card loads it into the
  boutique section.
- Manifesto quote and full footer.

## The four models

| Model | Case | Price |
|---|---|---|
| Aperture Skeleton | 42 mm grade-5 titanium, openworked dial | £12,400 |
| Abyss Carbon | 44 mm carbon composite diver | £9,800 |
| Monolith Steel | 40 mm single-block steel, minimal | £7,200 |
| Machina Avant-Garde | 45 mm steel & ceramic, exposed mechanics | £15,900 |

## Assets

All product imagery and the exploded-calibre video were generated with
Higgsfield (nano-banana image model + Seedance 2.0 video) and are served from
Higgsfield's CDN. To make the site fully self-contained, download the files
referenced at the top of `js/main.js` into `assets/` and update the URLs.

## Run it

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

No build step — plain HTML/CSS/JS, no dependencies.

## Structure

```
index.html      Page markup
css/style.css   All styling
js/main.js      Watch data, carousel, grid, reveal animations
```

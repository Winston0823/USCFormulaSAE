# Homepage Overhaul — Events Visibility, Free Scroll, Performance

**Date:** 2026-07-15
**Goal:** Make the site convert better for two audiences — prospective members and sponsors — by making events visible on the homepage, letting users scroll freely, and killing the 42 MB hero payload.

## Approved decisions

- Events carousel: **Approach A** — extract/improve the existing custom framer-motion carousel, place on homepage below hero; `/events` keeps carousel + timeline.
- New media: **design with placeholders** (real photos swapped in later).
- Scroll: **fully native** — remove Lenis entirely.
- Perf: fix the big items in this pass.
- **Hero stays untouched** — fixed pinning, mouse parallax, pixel reveal, scroll-over fade all preserved. Keep everything else as close to original as possible.
- **TrackVideoScroll removed entirely** (component + 97 track frames + video).

## 1. New homepage section order (`src/app/page.tsx`)

1. **Hero — unchanged** except the two background SVG paths swap to optimized WebP (visually identical).
2. **Events carousel — new**, first section inside the content container (first thing revealed as content scrolls over the hero). Section header + "View all events →" link to `/events`.
3. **Stats** (40 MPH / 2.8 SEC) — same content, unpinned.
4. **Built by Students** — same content, unpinned.
5. **Specialized Divisions** (DiagonalBars, `#teams` anchor preserved) — same content, unpinned.
6. **Sponsorship CTA — unchanged.**

## 2. Events carousel (shared component)

- Extract carousel from `src/app/events/page.tsx` into `src/components/EventsCarousel.tsx`; move the events array to `src/lib/events.ts`. One implementation, rendered on homepage and `/events`.
- Keep: three-panel flex choreography (`layoutId`), black/gold styling, phase state machine, keyboard arrows.
- Fix:
  - Gallery arrows always visible on touch/coarse pointers (hover-reveal kept for desktop).
  - Real swipe via framer-motion `drag="x"` on the active card.
  - Image auto-advance pauses during interaction; disabled under `prefers-reduced-motion`.
  - Broken `/placeholder-event-*.jpg` refs replaced by designed placeholder cards: brand gradient, event tag, gold "photos coming soon" mark.
- `/events` page: renders shared component + existing timeline, otherwise unchanged.

## 3. Scroll behavior

- Delete `src/components/SmoothScroll.tsx` and the `lenis` dependency; unwrap in `layout.tsx`.
- Hash anchors already smooth via `scroll-behavior: smooth` (globals.css). Verify no other `window.__lenis` consumers; verify route changes land at top (native App Router behavior returns).
- Stats/Students/Divisions: collapse `h-[130vh]`/`h-[140vh]`/`h-[150vh]` spacers + `sticky top-0 h-screen` wrappers to natural-height sections; rewire reveals (fades, CountUp) to `whileInView` triggers.

## 4. Removals

- `src/components/TrackVideoScroll.tsx`, `public/track-frames/` (97 JPGs), `public/TrackVideo.mp4` (after verifying no other consumers). Middle sections sit on plain brand-black.

## 5. Performance

- Rasterize `HeroPageBackgroundSVG.svg` (25 MB) and `HeroPageBackgroundHolographicVFXSVG.svg` (17 MB) — both are base64-PNG wrappers — to compressed WebP at display resolution via sharp. Swap refs; loading gate stays but now waits on ~100s of KB.
- `next/image` for major content imagery (collab-on-car, competition photos, event images).
- Delete verified-unused heavy assets (e.g. 11 MB `HeroPageBackgroundHolographicVFX.png`). `fe-ignite.mp4` only if unreferenced.

## 6. Verification

Run dev; drive in Chrome at desktop + 375 px: hero feel unchanged, carousel arrows/swipe on touch, free scroll through all sections, `#teams` anchor works, `/events` intact, network payload measured before/after.

## Out of scope

Hero visuals/interactions, DiagonalBars content, sponsorship CTA, navigation, footer, other routes, brand tokens.

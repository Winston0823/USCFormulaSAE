/**
 * ASCII → photo carousel engine.
 *
 * Runs on a single canvas. Every frame is described by five scalars
 * (asciiAlpha, photoAlpha, photoScale, morph, glitch), so the whole effect is
 * one render function driven by a small timeline state machine.
 *
 * Three decisions carry the performance budget:
 *   1. Glyphs are blitted from a pre-rendered atlas, never drawn with fillText.
 *   2. "Blur" is a low-resolution draw scaled back up, not a CSS/canvas filter.
 *   3. The loop is cancelled outright during the hold phase — a settled slide
 *      costs nothing because the canvas simply retains its last paint.
 */

/** Luminance ramp, sparse → dense. */
const RAMP = " .,:;-~=+*xoO#%@";

const SEGMENTS = {
  glitchIn: 1000, // glyphs sweep out of black, scrambled
  settle: 800, // scramble decays, glyphs lock to the real luminance map
  deres: 1100, // a settled photo dissolves back into glyphs
  morph: 1800, // glyph field A flows and travels into glyph field B
  emerge: 1000, // glyphs fade out, blurred photo fades in
  clarify: 1100, // blurred photo resolves to full resolution
  hold: 5500, // static. loop cancelled.
} as const;

/** Peak distance a glyph travels during a morph, in whole grid cells. */
const TRAVEL_CELLS = 3;
/** Fraction of the morph any single cell spends transforming. */
const MORPH_WINDOW = 0.45;

type Segment = keyof typeof SEGMENTS;

const SEQ_FIRST: Segment[] = ["glitchIn", "settle", "emerge", "clarify", "hold"];
const SEQ_NEXT: Segment[] = ["deres", "morph", "emerge", "clarify", "hold"];

/* ─── easing ─────────────────────────────────────────── */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInExpo = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * (t - 1)));
const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/** A source image, prepared for both the glyph pass and the photo pass. */
interface Sampled {
  img: HTMLImageElement;
  /** Canvas-sized copy, so per-frame draws never touch the full-res JPEG. */
  mid: HTMLCanvasElement;
  /** One luminance byte per grid cell. */
  lum: Uint8Array;
  /** cols × rows colour source used to tint the glyph mask. */
  tint: HTMLCanvasElement;
}

/** Per-frame render parameters produced by the timeline. */
interface Frame {
  asciiAlpha: number;
  photoAlpha: number;
  photoScale: number;
  morph: number;
  glitch: number;
  aberration: number;
  /** Wipe progress for the initial glyph build-on; 1 = fully revealed. */
  reveal: number;
  /** Advection strength, in grid cells. Drives the flow and the slide. */
  travel: number;
}

export interface AsciiCarouselOptions {
  /** Called whenever the active slide changes, including the initial one. */
  onIndexChange?: (index: number) => void;
  /** Page background, painted behind everything. */
  background?: string;
}

function cover(iw: number, ih: number, w: number, h: number) {
  const s = Math.max(w / iw, h / ih);
  const dw = iw * s;
  const dh = ih * s;
  return [(w - dw) / 2, (h - dh) / 2, dw, dh] as const;
}

export class AsciiCarousel {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: AsciiCarouselOptions;

  /* geometry (CSS pixels, except dpr-scaled backing stores) */
  private dpr = 1;
  private W = 0;
  private H = 0;
  private cols = 0;
  private rows = 0;
  private cellW = 10;
  private cellH = 18;

  /* offscreen surfaces */
  private atlas: HTMLCanvasElement;
  private mask: HTMLCanvasElement;
  private maskCtx: CanvasRenderingContext2D;
  private scratch: HTMLCanvasElement; // low-res photo buffer
  private scratchCtx: CanvasRenderingContext2D;
  private tintScratch: HTMLCanvasElement; // cols × rows, blended tint source
  private tintCtx: CanvasRenderingContext2D;

  /* pre-seeded noise — no Math.random inside the render loop */
  private noise = new Float32Array(0);
  private rowNoise = new Float32Array(0);
  /** Smooth per-cell direction field that advection and travel follow. */
  private flowX = new Float32Array(0);
  private flowY = new Float32Array(0);

  private sources: string[] = [];
  private samples: Sampled[] = [];
  private index = 0;
  private nextIndex = 0;

  private seq: Segment[] = SEQ_FIRST;
  private segIdx = 0;
  private segStart = 0;
  private raf = 0;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private holdEndsAt = 0;
  private paused = false;
  private destroyed = false;
  private started = false;
  private frameCount = 0;

  constructor(canvas: HTMLCanvasElement, opts: AsciiCarouselOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.opts = opts;

    this.atlas = document.createElement("canvas");
    this.mask = document.createElement("canvas");
    this.maskCtx = this.mask.getContext("2d")!;
    this.scratch = document.createElement("canvas");
    this.scratchCtx = this.scratch.getContext("2d")!;
    this.tintScratch = document.createElement("canvas");
    this.tintCtx = this.tintScratch.getContext("2d")!;
  }

  /** Loads every image, builds all caches, and starts the cycle. */
  async load(sources: string[]) {
    this.sources = sources;
    const imgs = await Promise.all(sources.map(loadImage));
    if (this.destroyed) return;
    // The atlas is font-dependent, so wait for webfonts before measuring.
    if (document.fonts?.ready) await document.fonts.ready;
    if (this.destroyed) return;

    this.resize();
    this.samples = imgs.map((img) => this.buildSample(img));
    this.started = true;
    this.segIdx = 0;
    this.seq = SEQ_FIRST;
    this.segStart = performance.now();
    this.opts.onIndexChange?.(this.index);
    this.run();
  }

  /* ─── sizing & caches ──────────────────────────────── */

  /** Recomputes geometry and every size-dependent cache. Safe to call often. */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const W = Math.max(1, Math.round(rect.width));
    const H = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (W === this.W && H === this.H && dpr === this.dpr) return;

    this.W = W;
    this.H = H;
    this.dpr = dpr;

    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);

    // Coarser cells on small screens: chunky ASCII reads better at phone size
    // and keeps the per-frame blit count down.
    let cellW = W < 768 ? 9 : W < 1400 ? 10 : 11;
    let cellH = Math.round(cellW * 1.8);
    // Hard ceiling on cell count so an ultrawide monitor can't blow the budget.
    while ((W / cellW) * (H / cellH) > 7200) {
      cellW += 1;
      cellH = Math.round(cellW * 1.8);
    }
    this.cellW = cellW;
    this.cellH = cellH;
    this.cols = Math.ceil(W / cellW);
    this.rows = Math.ceil(H / cellH);

    this.mask.width = this.canvas.width;
    this.mask.height = this.canvas.height;
    this.scratch.width = this.canvas.width;
    this.scratch.height = this.canvas.height;
    this.tintScratch.width = this.cols;
    this.tintScratch.height = this.rows;

    this.buildAtlas();
    this.buildNoise();
    this.buildFlow();
    // Existing samples were keyed to the old grid — rebuild them.
    if (this.samples.length) {
      this.samples = this.samples.map((s) => this.buildSample(s.img));
    }
  }

  private buildAtlas() {
    const { dpr, cellW, cellH } = this;
    const cw = Math.ceil(cellW * dpr);
    const ch = Math.ceil(cellH * dpr);
    this.atlas.width = cw * RAMP.length;
    this.atlas.height = ch;
    const a = this.atlas.getContext("2d")!;
    a.clearRect(0, 0, this.atlas.width, this.atlas.height);
    const family =
      getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() ||
      "monospace";
    a.font = `${Math.round(cellH * dpr * 0.92)}px ${family}, monospace`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    a.fillStyle = "#fff";
    for (let i = 0; i < RAMP.length; i++) {
      a.fillText(RAMP[i], i * cw + cw / 2, ch / 2);
    }
  }

  private buildNoise() {
    const n = this.cols * this.rows;
    this.noise = new Float32Array(n);
    for (let i = 0; i < n; i++) this.noise[i] = Math.random();
    this.rowNoise = new Float32Array(this.rows * 4);
    for (let i = 0; i < this.rowNoise.length; i++) this.rowNoise[i] = Math.random();
  }

  /**
   * A smooth, divergence-light direction field built from a few sine terms.
   * Precomputed because per-cell trig every frame would dominate the budget.
   * A slight rightward bias gives the drift a direction without letting it
   * smear into pure horizontal streaking.
   */
  private buildFlow() {
    const { cols, rows } = this;
    const n = cols * rows;
    this.flowX = new Float32Array(n);
    this.flowY = new Float32Array(n);
    for (let r = 0; r < rows; r++) {
      const v = r / rows;
      for (let c = 0; c < cols; c++) {
        const u = c / cols;
        const a = Math.sin(u * 6.1 + 1.3) * Math.cos(v * 4.7 - 0.7);
        const b = Math.sin(v * 7.3 + 2.1) * Math.cos(u * 5.2 + 0.4);
        const i = r * cols + c;
        this.flowX[i] = a * 0.7 + b * 0.35 + 0.12;
        this.flowY[i] = b * 0.72 - a * 0.4;
      }
    }
  }

  private buildSample(img: HTMLImageElement): Sampled {
    const { cols, rows, W, H, dpr } = this;

    // Canvas-sized copy for the photo pass.
    const mid = document.createElement("canvas");
    mid.width = Math.max(1, Math.round(W * dpr));
    mid.height = Math.max(1, Math.round(H * dpr));
    const mctx = mid.getContext("2d")!;
    const [dx, dy, dw, dh] = cover(img.naturalWidth, img.naturalHeight, mid.width, mid.height);
    mctx.drawImage(img, dx, dy, dw, dh);

    // cols × rows copy, doubling as luminance source and glyph tint.
    const tint = document.createElement("canvas");
    tint.width = cols;
    tint.height = rows;
    const tctx = tint.getContext("2d", { willReadFrequently: true })!;
    tctx.drawImage(mid, 0, 0, cols, rows);
    const image = tctx.getImageData(0, 0, cols, rows);
    const data = image.data;
    const n = cols * rows;

    const raw = new Uint8Array(n);
    const hist = new Uint32Array(256);
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      const l = (data[o] * 77 + data[o + 1] * 150 + data[o + 2] * 29) >> 8;
      raw[i] = l;
      hist[l]++;
    }

    // Auto-levels. Without this a dim photo maps most of the frame onto the
    // blank end of the ramp and the glyph field falls apart into sparse specks.
    const cut = Math.max(1, Math.floor(n * 0.015));
    let lo = 0;
    let hi = 255;
    for (let acc = 0, v = 0; v < 256; v++) { acc += hist[v]; if (acc >= cut) { lo = v; break; } }
    for (let acc = 0, v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= cut) { hi = v; break; } }
    const span = Math.max(24, hi - lo);

    const lum = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const t = (raw[i] - lo) / span;
      // Gamma < 1 lifts the shadows so mid-dark cells still earn a character.
      const g = Math.pow(t < 0 ? 0 : t > 1 ? 1 : t, 0.78);
      lum[i] = (g * 255) | 0;
    }

    // The glyphs are tinted by the photo, so the tint gets the same lift —
    // otherwise shadow characters are legible in shape but invisible in colour.
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      for (let k = 0; k < 3; k++) {
        const c = Math.pow(data[o + k] / 255, 0.62) * 272;
        data[o + k] = c > 255 ? 255 : c;
      }
    }
    tctx.putImageData(image, 0, 0);

    return { img, mid, lum, tint };
  }

  /* ─── timeline ─────────────────────────────────────── */

  private frameParams(seg: Segment, t: number): Frame {
    switch (seg) {
      case "glitchIn":
        // Glyphs sweep on across the field rather than appearing all at once,
        // so the build-on reads as a scan, not a fade.
        return {
          asciiAlpha: smoothstep(t * 2.2),
          photoAlpha: 0,
          photoScale: 0,
          morph: 0,
          glitch: 0.95 - t * 0.3,
          aberration: 7 - 2 * t, // → 5, where settle picks up
          reveal: t,
          travel: 0,
        };
      case "settle":
        return {
          asciiAlpha: 1,
          photoAlpha: 0,
          photoScale: 0,
          morph: 0,
          glitch: 0.6 * (1 - smoothstep(t)),
          aberration: 5,
          reveal: 1,
          travel: 0,
        };
      case "deres":
        // Photo collapses back to glyphs: resolution falls away as glyphs rise
        // and the field starts drifting, pre-loading the travel.
        return {
          asciiAlpha: smoothstep(t * 1.5),
          photoAlpha: 1 - smoothstep(t * 1.2),
          photoScale: 1 - easeInExpo(t) * 0.92,
          morph: 0,
          glitch: 0.4 * smoothstep(t),
          aberration: 5 * smoothstep(t), // hold leaves it at 0
          reveal: 1,
          travel: 0,
        };
      case "morph":
        // Travel plateaus through the middle of the morph so the glyph field
        // visibly streams from one image into the other instead of snapping.
        return {
          asciiAlpha: 1,
          photoAlpha: 0,
          photoScale: 0,
          morph: t,
          // Lower than before: motion carries this phase now, not scramble.
          glitch: 0.1 + 0.13 * Math.sin(Math.PI * t),
          aberration: 5 + 2 * Math.sin(Math.PI * t),
          reveal: 1,
          travel: TRAVEL_CELLS,
        };
      case "emerge":
        return {
          asciiAlpha: 1 - smoothstep(t * 1.2),
          photoAlpha: smoothstep(t * 1.4),
          photoScale: 0.07 + 0.23 * t,
          morph: 0,
          glitch: 0.2 * (1 - t),
          aberration: 5,
          reveal: 1,
          travel: 0,
        };
      case "clarify":
        return {
          asciiAlpha: 0,
          photoAlpha: 1,
          photoScale: 0.3 + 0.7 * easeOutExpo(t),
          morph: 0,
          glitch: 0,
          aberration: 5 * (1 - t) * (1 - t),
          reveal: 1,
          travel: 0,
        };
      case "hold":
        return {
          asciiAlpha: 0,
          photoAlpha: 1,
          photoScale: 1,
          morph: 0,
          glitch: 0,
          aberration: 0,
          reveal: 1,
          travel: 0,
        };
    }
  }

  private run() {
    if (this.raf || this.paused || this.destroyed || !this.started) return;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (this.paused || this.destroyed) return;

    const seg = this.seq[this.segIdx];

    if (seg === "hold") {
      // Paint the settled frame once, then stop the loop entirely and wake on a
      // timer. A held slide costs zero CPU.
      this.render(this.frameParams("hold", 1));
      this.holdEndsAt = now + SEGMENTS.hold;
      this.holdTimer = setTimeout(() => {
        this.holdTimer = null;
        this.advance();
        this.run();
      }, SEGMENTS.hold);
      return;
    }

    const dur = SEGMENTS[seg];
    const t = clamp01((now - this.segStart) / dur);
    this.frameCount++;
    this.render(this.frameParams(seg, t));

    if (t >= 1) this.advance(now);
    this.raf = requestAnimationFrame(this.tick);
  };

  private advance(now = performance.now()) {
    const finished = this.seq[this.segIdx];
    if (finished === "morph") {
      // The glyph field has already become B — commit the index.
      this.index = this.nextIndex;
      this.opts.onIndexChange?.(this.index);
    }
    this.segIdx++;
    if (this.segIdx >= this.seq.length) {
      this.seq = SEQ_NEXT;
      this.segIdx = 0;
      this.nextIndex = (this.index + 1) % this.samples.length;
    }
    this.segStart = now;
  }

  /* ─── render ───────────────────────────────────────── */

  private render(f: Frame) {
    const { ctx, W, H, dpr } = this;
    const a = this.samples[this.index];
    if (!a) return;
    const b = this.samples[this.nextIndex] ?? a;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.opts.background ?? "#0b0b0d";
    ctx.fillRect(0, 0, W, H);

    if (f.photoAlpha > 0.003) this.drawPhoto(a, f);
    if (f.asciiAlpha > 0.003) this.drawAscii(a, b, f);

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /**
   * Draws the photo at a fraction of canvas resolution and scales it back up.
   * Smoothed upscaling of a tiny buffer is optically a blur and costs a
   * fraction of what an actual blur filter would per frame.
   */
  private drawPhoto(s: Sampled, f: Frame) {
    const { ctx, W, H, dpr } = this;
    const scale = Math.max(0.02, Math.min(1, f.photoScale));

    ctx.globalAlpha = f.photoAlpha;
    ctx.imageSmoothingEnabled = true;

    if (scale >= 0.995) {
      ctx.drawImage(s.mid, 0, 0, W, H);
    } else {
      const sw = Math.max(2, Math.round(W * dpr * scale));
      const sh = Math.max(2, Math.round(H * dpr * scale));
      this.scratchCtx.globalAlpha = 1;
      this.scratchCtx.clearRect(0, 0, sw, sh);
      this.scratchCtx.imageSmoothingEnabled = true;
      this.scratchCtx.drawImage(s.mid, 0, 0, sw, sh);
      ctx.drawImage(this.scratch, 0, 0, sw, sh, 0, 0, W, H);
    }

    if (f.aberration > 0.01) {
      const ab = f.aberration;
      // Alpha tracks the offset itself. A hard cutoff here reads as an
      // exposure snap, because `screen` brightens whatever it touches.
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = f.photoAlpha * 0.16 * Math.min(1, ab / 4);
      ctx.drawImage(s.mid, -ab, 0, W, H);
      ctx.drawImage(s.mid, ab, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Renders the glyph field into an offscreen mask, then pours the image
   * through it with `source-in` so every character takes the colour of the
   * pixel it stands for. One composite op replaces per-cell fillStyle churn.
   */
  private drawAscii(a: Sampled, b: Sampled, f: Frame) {
    const { maskCtx: m, cols, rows, cellW, cellH, dpr, W, H, noise, rowNoise } = this;
    const atlasCW = Math.ceil(cellW * dpr);
    const atlasCH = Math.ceil(cellH * dpr);
    const last = RAMP.length - 1;
    const n = noise.length;

    m.setTransform(dpr, 0, 0, dpr, 0, 0);
    m.globalCompositeOperation = "source-over";
    m.globalAlpha = 1;
    m.clearRect(0, 0, W, H);
    m.imageSmoothingEnabled = false;

    // Glitch is stuttered to every third frame — smooth per-frame noise reads
    // as fizz, held noise reads as signal interference.
    // Glyph churn is stepped rather than per-frame: characters that change on
    // every frame read as fizz, characters that hold for a few frames read as
    // deliberate transformation.
    const seed = (this.frameCount / 3) | 0;
    const g = f.glitch;
    const morphing = f.morph > 0;
    const flowX = this.flowX;
    const flowY = this.flowY;
    const revealing = f.reveal < 1;

    for (let r = 0; r < rows; r++) {
      // Only a subset of rows shear, and only while glitch is high.
      const rn = rowNoise[(r * 3 + seed) % rowNoise.length];
      const shear = rn < g * 0.3 ? (rowNoise[(r + seed) % rowNoise.length] - 0.5) * g * cellW * 4 : 0;
      const rowOff = r * cols;

      for (let c = 0; c < cols; c++) {
        const i = rowOff + c;

        if (revealing) {
          // Diagonal scan-on, roughened per cell so the edge isn't a clean line.
          const p = (c / cols) * 0.6 + (r / rows) * 0.4;
          if (p + noise[i] * 0.22 > f.reveal * 1.5) continue;
        }

        let v: number;
        let hopC = 0;
        let hopR = 0;
        let flare = 0; // this cell's own transition intensity, 0 → 1 → 0

        if (morphing) {
          // Every cell gets its own slice of the morph. Mixing a diagonal sweep
          // with per-cell noise means the transformation crosses the frame as a
          // wave while individual characters still flip at their own moment.
          const stagger = ((c / cols + r / rows) * 0.5) * 0.72 + noise[i] * 0.28;
          const lp = clamp01((f.morph - stagger * (1 - MORPH_WINDOW)) / MORPH_WINDOW);
          const la = a.lum[i];
          const lb = b.lum[i];
          v = la + (lb - la) * lp;

          if (lp > 0 && lp < 1) {
            flare = Math.sin(Math.PI * lp);
            // Cells whose character has to change the most travel the furthest.
            const delta = Math.abs(lb - la) / 255;
            const d = f.travel * flare * (0.7 + 0.6 * delta);
            // Whole-cell hops only: a glyph belongs to the character grid, so
            // it steps between cells instead of sliding through them.
            hopC = Math.round(flowX[i] * d);
            hopR = Math.round(flowY[i] * d);
          }
        } else {
          v = a.lum[i];
        }

        let idx = (v * last) / 255;

        // Mid-transition the glyph walks off its luminance value and through
        // neighbouring ramp characters — this is the visible "transforming"
        // step, and it lands back on the true character as flare returns to 0.
        const churn = flare * 2.4 + g * 3.2;
        if (churn > 0.01) {
          const nz = noise[(i + seed * 7919) % n];
          if (nz < g * 0.28 + flare * 0.07) {
            // Scrambled cell: pick an unrelated glyph.
            idx = noise[(i * 31 + seed * 104729) % n] * last;
          } else {
            idx += (nz - 0.5) * churn;
          }
        }

        idx = idx < 0 ? 0 : idx > last ? last : idx;
        const gi = idx | 0;
        if (gi === 0) continue; // space — nothing to blit

        const dc = c + hopC;
        const dr = r + hopR;
        if (dc < 0 || dc >= cols || dr < 0 || dr >= rows) continue;

        m.drawImage(
          this.atlas,
          gi * atlasCW, 0, atlasCW, atlasCH,
          dc * cellW + shear, dr * cellH, cellW, cellH
        );
      }
    }

    // Tint source: image A, with B blended in as the morph progresses.
    const t = this.tintCtx;
    t.globalCompositeOperation = "source-over";
    t.globalAlpha = 1;
    t.clearRect(0, 0, cols, rows);
    t.drawImage(a.tint, 0, 0);
    if (morphing) {
      t.globalAlpha = f.morph;
      t.drawImage(b.tint, 0, 0);
      t.globalAlpha = 1;
    }

    m.globalCompositeOperation = "source-in";
    m.imageSmoothingEnabled = true;
    m.drawImage(this.tintScratch, 0, 0, W, H);
    m.globalCompositeOperation = "source-over";

    const ctx = this.ctx;
    ctx.globalAlpha = f.asciiAlpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.mask, 0, 0, W, H);

    if (f.aberration > 0.01) {
      const ab = f.aberration;
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = f.asciiAlpha * 0.3 * Math.min(1, ab / 4);
      ctx.drawImage(this.mask, -ab, 0, W, H);
      ctx.drawImage(this.mask, ab, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
  }

  /* ─── control ──────────────────────────────────────── */

  setPaused(paused: boolean) {
    if (paused === this.paused) return;
    this.paused = paused;
    if (paused) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
        // Rewind the segment clock so hold resumes with time left, not expired.
        this.segStart = performance.now() - (SEGMENTS.hold - Math.max(0, this.holdEndsAt - performance.now()));
      }
    } else if (this.started) {
      this.segStart = performance.now();
      this.run();
    }
  }

  /** Jumps straight to a slide, restarting the cycle from its glitch-in. */
  goTo(i: number) {
    if (!this.started || i === this.index) return;
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.nextIndex = ((i % this.samples.length) + this.samples.length) % this.samples.length;
    this.seq = SEQ_NEXT;
    this.segIdx = 0;
    this.segStart = performance.now();
    this.run();
  }

  /** Repaints the current state without advancing — used after a resize. */
  repaint() {
    if (!this.started) return;
    const seg = this.seq[this.segIdx];
    this.render(this.frameParams(seg, seg === "hold" ? 1 : 0.999));
  }

  destroy() {
    this.destroyed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.holdTimer) clearTimeout(this.holdTimer);
    this.raf = 0;
    this.holdTimer = null;
    this.samples = [];
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

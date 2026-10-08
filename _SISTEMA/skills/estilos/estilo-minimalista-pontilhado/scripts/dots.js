/*
 * dots.js — gerador de figuras pontilhadas (estilo minimalista conceitual).
 * Tudo determinístico: mesma entrada → mesmos pontos (seed fixa), seguro para seek/render.
 *
 *   DOTS.fill(d, {step, ox, oy, s})      pontos numa grade dentro de um path SVG (matriz de pontos)
 *   DOTS.stroke(d, {gap, ox, oy, s})     pontos ao longo do contorno de um path (linha pontilhada)
 *   DOTS.text(str, {font, size, step})   pontos que formam um texto
 *   DOTS.draw(svg, pts, {r, color, opacity, cls}) → <circle>[]
 *   DOTS.grid(svg, {w, h, step, r, opacity})       grade de fundo
 *   DOTS.rand(seed)                       PRNG (mulberry32)
 *   DOTS.SHAPES                           biblioteca de formas (coordenadas locais)
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const WHITE = "#FFFFFF";
  const ORANGE = "#F97316";

  function rand(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  let _ctx = null;
  function ctx() {
    if (!_ctx) {
      const c = document.createElement("canvas");
      c.width = 2;
      c.height = 2;
      _ctx = c.getContext("2d");
    }
    return _ctx;
  }

  // bbox aproximada de um path via elemento SVG oculto
  let _svg = null;
  function probe(d) {
    if (!_svg) {
      _svg = document.createElementNS(NS, "svg");
      _svg.setAttribute("width", "0");
      _svg.setAttribute("height", "0");
      _svg.style.position = "absolute";
      _svg.style.visibility = "hidden";
      document.body.appendChild(_svg);
    }
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    _svg.appendChild(p);
    return p;
  }

  function fill(d, o = {}) {
    const step = o.step || 14;
    const ox = o.ox || 0, oy = o.oy || 0, s = o.s || 1;
    const p = probe(d);
    const b = p.getBBox();
    p.remove();
    const path = new Path2D(d);
    const c = ctx();
    const pts = [];
    const x0 = Math.floor(b.x / step) * step;
    const y0 = Math.floor(b.y / step) * step;
    for (let y = y0; y <= b.y + b.height; y += step) {
      for (let x = x0; x <= b.x + b.width; x += step) {
        if (c.isPointInPath(path, x, y, o.rule || "nonzero")) pts.push({ x: ox + x * s, y: oy + y * s });
      }
    }
    return pts;
  }

  function stroke(d, o = {}) {
    const gap = o.gap || 14;
    const ox = o.ox || 0, oy = o.oy || 0, s = o.s || 1;
    const pts = [];
    // cada subpath "M..." é amostrado separado para não ligar figuras
    const subs = d.split(/(?=M)/).filter((x) => x.trim());
    for (const sub of subs) {
      const p = probe(sub);
      const L = p.getTotalLength();
      const n = Math.max(1, Math.round((L * s) / gap));
      for (let i = 0; i <= n; i++) {
        const q = p.getPointAtLength((L * i) / n);
        pts.push({ x: ox + q.x * s, y: oy + q.y * s });
      }
      p.remove();
    }
    return pts;
  }

  function text(str, o = {}) {
    const size = o.size || 160;
    const step = o.step || 10;
    const font = o.font || `900 ${size}px Montserrat, Arial, sans-serif`;
    const c = document.createElement("canvas");
    const g = c.getContext("2d");
    g.font = font;
    const w = Math.ceil(g.measureText(str).width) + 20;
    const h = Math.ceil(size * 1.3);
    c.width = w;
    c.height = h;
    g.font = font;
    g.textBaseline = "middle";
    g.fillStyle = "#fff";
    g.fillText(str, 10, h / 2);
    const data = g.getImageData(0, 0, w, h).data;
    const cx = o.cx || 0, cy = o.cy || 0;
    const pts = [];
    for (let y = 0; y < h; y += step)
      for (let x = 0; x < w; x += step)
        if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x: cx - w / 2 + x, y: cy - h / 2 + y });
    return pts;
  }

  function draw(svg, pts, o = {}) {
    const r = o.r || 4;
    const out = [];
    for (const p of pts) {
      const el = document.createElementNS(NS, "circle");
      el.setAttribute("cx", p.x.toFixed(1));
      el.setAttribute("cy", p.y.toFixed(1));
      el.setAttribute("r", p.r || r);
      el.setAttribute("fill", p.color || o.color || WHITE);
      if (o.opacity != null) el.setAttribute("opacity", o.opacity);
      if (o.cls) el.setAttribute("class", o.cls);
      svg.appendChild(el);
      out.push(el);
    }
    return out;
  }

  function grid(svg, o = {}) {
    const w = o.w || 1080, h = o.h || 1920, step = o.step || 48;
    const pts = [];
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) pts.push({ x, y });
    return draw(svg, pts, { r: o.r || 1.6, color: WHITE, opacity: o.opacity ?? 0.08, cls: o.cls || "grid-dot" });
  }

  // Formas em coordenadas locais. Escala/posição via {ox, oy, s}.
  const SHAPES = {
    // boneco 200x400
    person:
      "M50,50 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0 Z " +
      "M28,128 Q100,104 172,128 L184,272 L150,272 L144,400 L108,400 L100,292 L92,400 L56,400 L50,272 L16,272 Z",
    // cadeira de perfil 220x300
    chair:
      "M150,0 L178,0 L178,170 L150,170 Z " +
      "M20,150 L178,150 L178,180 L20,180 Z " +
      "M28,180 L52,180 L52,300 L28,300 Z M150,180 L174,180 L174,300 L150,300 Z",
    // balança: poste + base (fill)
    scaleBase: "M190,40 L210,40 L210,380 L190,380 Z M110,380 L290,380 L300,410 L100,410 Z",
    // prato (meia-lua) 160 de largura, origem no centro do topo
    pan: "M-80,0 L80,0 Q80,60 0,60 Q-80,60 -80,0 Z",
    // seta pra cima 200x320
    arrow: "M100,0 L200,110 L135,110 L135,320 L65,320 L65,110 L0,110 Z",
  };

  window.DOTS = { rand, fill, stroke, text, draw, grid, SHAPES, WHITE, ORANGE };
})();

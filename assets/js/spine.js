/* Builds the spine diagram as inline SVG from the geometry tables in data.js.
   Geometry only — every colour and weight lives in app.css so the diagram
   re-skins with the theme. Two views share one set of levels: 'side' uses the
   sagittal offsets, 'front' uses the coronal ones. */

const Spine = (function () {
  const VIEW_W = 330;
  const TOP = 14;
  const SKULL_H = 88;
  const BOTTOM_PAD = 16;

  const CENTER = { side: 105, front: 132 };
  // Spinous process: length, where the tip sits down the body (thoracic ones angle
  // steeply downward and overlap like shingles), and how deep the tip is.
  const PROC = {
    cervical: { len: 15, drop: 0.42, tip: 0.20 },
    thoracic: { len: 22, drop: 0.70, tip: 0.18 },
    lumbar: { len: 18, drop: 0.40, tip: 0.22 }
  };
  const CANAL = { normal: 13, mild: 10, moderate: 7.5, severe: 5 };
  const CANAL_GAP = 13;   // posterior elements start behind the canal, as they do in life

  const RAIL_END = 202;   // where connector lines stop
  const METER_X = 208;
  const GLYPH_X = 236;
  const LABEL_X = 252;
  const ROW_MIN = 15;     // minimum vertical gap between rail rows

  const SACRUM_H = 62, COCCYX_H = 22;

  const byId = id => LEVELS.find(l => l.id === id);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n = v => Math.round(v * 100) / 100;

  /* ---------- layout ---------------------------------------------------- */

  function layout(view) {
    const off = v => (view === 'side' ? v.sag : v.cor);
    const cx0 = CENTER[view];
    const verts = {}, units = [];
    let y = TOP + SKULL_H;

    VERTEBRAE.forEach(v => {
      const u = { kind: 'vertebra', id: v.id, region: v.region, y0: y, y1: y + v.h,
                  cx: cx0 + off(v), w: v.w, h: v.h };
      verts[v.id] = u;
      units.push(u);
      y += v.h;

      const d = DISCS.find(x => x.after === v.id);
      if (d) {
        const next = VERTEBRAE[VERTEBRAE.indexOf(v) + 1];
        const level = d.level ? byId(d.level) : null;
        units.push({
          kind: 'disc', id: d.id, region: v.region, y0: y, y1: y + d.h, joint: !!d.joint,
          level, imaged: !!level,
          topCx: cx0 + off(v), topW: v.w,
          botCx: next ? cx0 + off(next) : cx0 + off(v),
          botW: next ? next.w : v.w
        });
        y += d.h;
      }
    });

    const last = VERTEBRAE[VERTEBRAE.length - 1];
    const sacrum = { y0: y, y1: y + SACRUM_H, cx: cx0 + (view === 'side' ? -4 : 0), w: last.w };
    y += SACRUM_H;
    const coccyx = { y0: y, y1: y + COCCYX_H, cx: cx0 + (view === 'side' ? 8 : 0) };
    y += COCCYX_H;

    return { units, verts, sacrum, coccyx, height: y + BOTTOM_PAD, skullBase: TOP + SKULL_H };
  }

  /* Vertical band each level owns for hit-testing: the disc plus half of the
     vertebra above and below, so the bands tile without gaps or overlap. */
  function bands(L) {
    const out = {};
    L.units.forEach((u, i) => {
      if (u.kind !== 'disc' || !u.level) return;
      const above = L.units[i - 1], below = L.units[i + 1];
      out[u.level.id] = {
        y0: above ? above.y0 + above.h / 2 : u.y0,
        // L5-S1 has no vertebra below it in the table, so borrow from the sacrum.
        y1: below && below.kind === 'vertebra' ? below.y0 + below.h / 2 : u.y1 + 10,
        mid: (u.y0 + u.y1) / 2,
        disc: u
      };
    });
    out.ccj = { y0: TOP, y1: L.skullBase, mid: L.skullBase - 26, disc: null };
    return out;
  }

  /* ---------- pieces ---------------------------------------------------- */

  function skull(L, view) {
    const b = L.skullBase;
    let s = `<g class="skull" aria-hidden="true">`;

    if (view === 'side') {
      // Lateral skull profile, facing left. Drawn open at the base so the foramen
      // magnum reads as the opening the cord passes through.
      const x = 86;
      s += `<path class="cranium" d="`
         + `M ${x - 56} ${b - 20}`
         + ` C ${x - 62} ${b - 46} ${x - 44} ${b - 74} ${x - 10} ${b - 76}`
         + ` C ${x + 24} ${b - 78} ${x + 50} ${b - 56} ${x + 52} ${b - 30}`
         + ` C ${x + 53} ${b - 16} ${x + 46} ${b - 5} ${x + 34} ${b - 1}`
         + ` L ${x + 16} ${b}`
         + ` L ${x - 12} ${b}`
         + ` C ${x - 34} ${b - 1} ${x - 50} ${b - 8} ${x - 56} ${b - 20} Z"/>`;
      // Craniectomy: the wedge of occipital bone removed in 2014, postero-inferior.
      s += `<path class="craniectomy" d="M ${x + 47} ${b - 22} C ${x + 45} ${b - 10} ${x + 34} ${b - 2} ${x + 20} ${b - 1}"/>`;
      s += `<path class="skull-base" d="M ${x - 12} ${b} L ${x + 16} ${b}" stroke-dasharray="2 3"/>`;
    } else {
      const x = CENTER.front;
      s += `<path class="cranium" d="`
         + `M ${x - 40} ${b - 34}`
         + ` C ${x - 42} ${b - 62} ${x - 24} ${b - 78} ${x} ${b - 78}`
         + ` C ${x + 24} ${b - 78} ${x + 42} ${b - 62} ${x + 40} ${b - 34}`
         + ` C ${x + 38} ${b - 18} ${x + 26} ${b - 4} ${x + 14} ${b}`
         + ` L ${x - 14} ${b}`
         + ` C ${x - 26} ${b - 4} ${x - 38} ${b - 18} ${x - 40} ${b - 34} Z"/>`;
      s += `<path class="craniectomy" d="M ${x - 17} ${b - 6} A 18 13 0 0 0 ${x + 17} ${b - 6}"/>`;
      s += `<path class="skull-base" d="M ${x - 14} ${b} L ${x + 14} ${b}" stroke-dasharray="2 3"/>`;
    }
    return s + `</g>`;
  }

  function canalRibbon(L, view) {
    if (view !== 'side') return '';
    const grade = u => (u.level && u.level.canal) || 'normal';
    const samples = [];
    L.units.forEach((u, i) => {
      if (u.kind === 'vertebra') {
        const prev = L.units[i - 1], next = L.units[i + 1];
        const g = [prev, next].filter(x => x && x.kind === 'disc')
          .reduce((acc, d) => (CANAL[grade(d)] < CANAL[acc] ? grade(d) : acc), 'normal');
        samples.push({ y: u.y0 + u.h / 2, ax: u.cx + u.w / 2, w: CANAL[g] });
      } else {
        samples.push({ y: (u.y0 + u.y1) / 2, ax: (u.topCx + u.topW / 2 + u.botCx + u.botW / 2) / 2, w: CANAL[grade(u)] });
      }
    });
    if (!samples.length) return '';
    const front = samples.map(s => `${n(s.ax)} ${n(s.y)}`).join(' L ');
    const back = samples.slice().reverse().map(s => `${n(s.ax + s.w)} ${n(s.y)}`).join(' L ');
    return `<path class="canal" d="M ${front} L ${back} Z" aria-hidden="true"/>`;
  }

  function vertebraShape(u, view) {
    const x = u.cx - u.w / 2;
    let s = `<rect class="body" x="${n(x)}" y="${n(u.y0)}" width="${n(u.w)}" height="${n(u.h)}"/>`;
    if (view === 'side') {
      const px = u.cx + u.w / 2 + CANAL_GAP, p = PROC[u.region];
      // Pedicles bridging the body to the posterior elements, one above and one below the canal.
      s += `<path class="pedicle-bar" d="M ${n(u.cx + u.w / 2)} ${n(u.y0 + 2.5)} H ${n(px)}`
         + ` M ${n(u.cx + u.w / 2)} ${n(u.y1 - 2.5)} H ${n(px)}"/>`;
      s += `<path class="process" d="M ${n(px)} ${n(u.y0 + 1.5)} L ${n(px + p.len)} ${n(u.y0 + u.h * p.drop)}`
         + ` L ${n(px + p.len)} ${n(u.y0 + u.h * (p.drop + p.tip))} L ${n(px)} ${n(u.y1 - 1.5)} Z"/>`;
    } else {
      s += `<ellipse class="process-ap" cx="${n(u.cx)}" cy="${n(u.y0 + u.h / 2)}" rx="4" ry="${n(u.h * 0.3)}"/>`;
      s += `<ellipse class="pedicle" cx="${n(u.cx - u.w * 0.28)}" cy="${n(u.y0 + u.h * 0.42)}" rx="3.4" ry="4"/>`;
      s += `<ellipse class="pedicle" cx="${n(u.cx + u.w * 0.28)}" cy="${n(u.y0 + u.h * 0.42)}" rx="3.4" ry="4"/>`;
    }
    return s;
  }

  function discPath(u) {
    return `M ${n(u.topCx - u.topW / 2)} ${n(u.y0)} L ${n(u.topCx + u.topW / 2)} ${n(u.y0)}`
         + ` L ${n(u.botCx + u.botW / 2)} ${n(u.y1)} L ${n(u.botCx - u.botW / 2)} ${n(u.y1)} Z`;
  }

  function sacrum(L, view) {
    const s = L.sacrum, c = L.coccyx, half = s.w / 2;
    const lean = view === 'side' ? 14 : 0;
    let out = `<g class="sacral" aria-hidden="true">`;
    out += `<path class="body" d="M ${n(s.cx - half)} ${n(s.y0)} L ${n(s.cx + half)} ${n(s.y0)}`
         + ` L ${n(s.cx + half * 0.32 + lean)} ${n(s.y1)} L ${n(s.cx - half * 0.32 + lean)} ${n(s.y1)} Z"/>`;
    for (let i = 1; i <= 3; i++) {
      const t = i / 4, y = s.y0 + (s.y1 - s.y0) * t;
      const hw = half * (1 - 0.68 * t), dx = lean * t;
      out += `<line class="sacral-line" x1="${n(s.cx - hw + dx)}" y1="${n(y)}" x2="${n(s.cx + hw + dx)}" y2="${n(y)}"/>`;
    }
    out += `<path class="body" d="M ${n(c.cx - 7)} ${n(c.y0)} L ${n(c.cx + 7)} ${n(c.y0)}`
         + ` L ${n(c.cx + 2)} ${n(c.y1)} L ${n(c.cx - 3)} ${n(c.y1)} Z"/>`;
    return out + `</g>`;
  }

  function regionBands(L) {
    const spans = { cervical: [1e9, -1e9], thoracic: [1e9, -1e9], lumbar: [1e9, -1e9] };
    L.units.forEach(u => {
      const s = spans[u.region];
      if (s) { s[0] = Math.min(s[0], u.y0); s[1] = Math.max(s[1], u.y1); }
    });
    spans.sacral = [L.sacrum.y0, L.coccyx.y1];
    let out = `<g class="regions" aria-hidden="true">`;
    REGIONS.forEach(r => {
      const [y0, y1] = spans[r.id];
      const mid = (y0 + y1) / 2;
      out += `<line class="region-bar" x1="9" y1="${n(y0)}" x2="9" y2="${n(y1)}"/>`;
      out += `<text class="region-label" x="9" y="${n(mid)}" transform="rotate(-90 9 ${n(mid)})">${esc(r.label.toUpperCase())}</text>`;
    });
    return out + `</g>`;
  }

  /* Cobb construction lines for the three measured curves, front view only. */
  const COBB = [
    { from: 'C5', to: 'T2', deg: 9, dir: 1, text: '9° left' },
    { from: 'T3', to: 'T10', deg: 10, dir: -1, text: '10° right' },
    { from: 'T12', to: 'L4', deg: 20, dir: 1, text: '20° left' }
  ];

  function cobbLines(L, view) {
    if (view !== 'front') return '';
    let out = `<g class="cobb" aria-hidden="true">`;
    COBB.forEach(c => {
      const a = L.verts[c.from], b = L.verts[c.to];
      if (!a || !b) return;
      const tilt = (c.deg / 2) * (Math.PI / 180) * c.dir;
      const draw = (v, y, sign) => {
        const x2 = v.cx - v.w / 2, x1 = 34;
        const yy = y + (x2 - x1) * Math.tan(tilt) * sign;
        return `<line class="cobb-line" x1="${n(x1)}" y1="${n(yy)}" x2="${n(x2)}" y2="${n(y)}"/>`;
      };
      out += draw(a, a.y0, 1) + draw(b, b.y1, -1);
      const my = (a.y0 + b.y1) / 2;
      out += `<line class="cobb-brace" x1="34" y1="${n(a.y0 - 2)}" x2="34" y2="${n(b.y1 + 2)}"/>`;
      out += `<text class="cobb-text" x="30" y="${n(my)}" transform="rotate(-90 30 ${n(my)})">${esc(c.text)}</text>`;
    });
    return out + `</g>`;
  }

  /* ---------- interactive levels ---------------------------------------- */

  function meter(x, y, sev) {
    const rank = SEVERITY[sev] ? SEVERITY[sev].rank : 0;
    let out = '';
    for (let i = 0; i < 3; i++) {
      out += `<rect class="tick${i < rank ? ' on' : ''}" x="${n(x + i * 8)}" y="${n(y - 4)}" width="6" height="8"/>`;
    }
    return out;
  }

  function levelGroups(L, view) {
    const B = bands(L);
    const rows = [];

    // Connectors start clear of the posterior elements so they read as leader lines
    // rather than crossing back over the anatomy.
    const clearOf = u => view === 'side'
      ? Math.max(u.topCx + u.topW / 2, u.botCx + u.botW / 2) + CANAL_GAP + PROC[u.region].len + 4
      : Math.max(u.topCx + u.topW / 2, u.botCx + u.botW / 2) + 4;

    rows.push({ id: 'ccj', level: byId('ccj'), band: B.ccj, anchorX: view === 'side' ? 142 : 150, anchorY: B.ccj.mid });
    L.units.forEach(u => {
      if (u.kind !== 'disc' || !u.level) return;
      const band = B[u.level.id];
      rows.push({
        id: u.level.id, level: u.level, band, disc: u,
        anchorX: clearOf(u),
        anchorY: band.mid
      });
    });

    // Nudge rail labels apart where the anatomy packs levels closer than the text.
    let prev = -1e9;
    rows.forEach(r => {
      r.labelY = Math.max(r.anchorY, prev + ROW_MIN);
      prev = r.labelY;
    });

    return rows.map(r => {
      const lv = r.level;
      const sev = lv.severity;
      const cls = ['level', `sev-${sev}`, lv.surgical ? 'is-surgical' : ''].filter(Boolean).join(' ');
      const name = `${lv.label}. ${SEVERITY[sev].label}${lv.surgical ? ', prior surgery at this level' : ''}. ${lv.status}.`;

      let s = `<g class="${cls}" id="tab-${esc(lv.id)}" data-level="${esc(lv.id)}" role="tab" tabindex="-1"`
            + ` aria-selected="false" aria-controls="detail" aria-label="${esc(name)}">`;

      s += `<rect class="row-bg" x="24" y="${n(r.band.y0)}" width="290" height="${n(r.band.y1 - r.band.y0)}"/>`;

      if (r.disc) {
        // The surgical halo goes first so it reads as an outline behind the disc.
        if (lv.surgical) s += `<path class="disc-surgical" d="${discPath(r.disc)}"/>`;
        s += `<path class="disc" d="${discPath(r.disc)}"/>`;
      }

      s += `<line class="connector" x1="${n(r.anchorX)}" y1="${n(r.anchorY)}" x2="${RAIL_END}" y2="${n(r.labelY)}"/>`;
      s += meter(METER_X, r.labelY, sev);
      if (lv.surgical) {
        s += `<path class="glyph-surgical" d="M ${GLYPH_X} ${n(r.labelY - 5)} V ${n(r.labelY + 5)}`
           + ` M ${GLYPH_X - 5} ${n(r.labelY)} H ${GLYPH_X + 5}"/>`;
      }
      s += `<text class="rail-label" x="${LABEL_X}" y="${n(r.labelY)}">${esc(lv.label === 'Craniocervical junction' ? 'Skull base' : lv.label)}</text>`;
      s += `<rect class="hit" x="24" y="${n(r.band.y0)}" width="290" height="${n(r.band.y1 - r.band.y0)}"/>`;
      s += `<rect class="focus-ring" x="26" y="${n(r.band.y0 + 1)}" width="286" height="${n(r.band.y1 - r.band.y0 - 2)}"/>`;
      return s + `</g>`;
    }).join('');
  }

  /* ---------- assembly -------------------------------------------------- */

  const PATTERNS = ['mild', 'moderate', 'severe'].map(sev => {
    const size = sev === 'mild' ? 7 : sev === 'moderate' ? 4 : 4.5;
    const lines = `<line class="pat-line" x1="0" y1="0" x2="0" y2="${size}"/>`
      + (sev === 'severe' ? `<line class="pat-line" x1="0" y1="0" x2="${size}" y2="0"/>` : '');
    return `<pattern id="pat-${sev}" class="pat-${sev}" width="${size}" height="${size}"`
         + ` patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`
         + `<rect class="pat-bg" x="-1" y="-1" width="${size + 2}" height="${size + 2}"/>${lines}</pattern>`;
  }).join('');

  function render(view) {
    const L = layout(view);
    const defs = `<defs>${PATTERNS}</defs>`;

    return {
      html: `<svg class="spine" viewBox="0 0 ${VIEW_W} ${n(L.height)}" role="tablist"`
          + ` aria-label="Spine levels, skull base to sacrum" aria-orientation="vertical"`
          + ` preserveAspectRatio="xMidYMin meet">`
          + defs
          + regionBands(L)
          + cobbLines(L, view)
          + canalRibbon(L, view)
          + `<g class="bones" aria-hidden="true">`
          + L.units.filter(u => u.kind === 'vertebra').map(u => vertebraShape(u, view)).join('')
          + L.units.filter(u => u.kind === 'disc' && !u.imaged).map(u => `<path class="disc unimaged" d="${discPath(u)}"/>`).join('')
          + `</g>`
          + skull(L, view)
          + sacrum(L, view)
          + levelGroups(L, view)
          + `</svg>`,
      order: ['ccj'].concat(DISCS.filter(d => d.level).map(d => d.level))
    };
  }

  return { render };
})();

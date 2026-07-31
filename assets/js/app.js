/* Selection state, the tab keyboard model, and the detail panel. */

(function () {
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const els = {
    mount: $('#spine-mount'),
    virtual: $('#virtual-tabs'),
    detail: $('#detail'),
    caption: $('#view-caption'),
    viewToggle: $('#view-toggle')
  };

  let view = 'side';
  let selected = null;
  let spineIds = [];
  const virtualIds = LEVELS.filter(l => l.virtual).map(l => l.id);
  let tabOrder = [];

  const scanById = id => SCANS.find(s => s.id === id);
  const levelById = id => LEVELS.find(l => l.id === id);

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.getAttribute('data-motion') === 'off';

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }
  function scanDateLabel(scan) {
    return scan.dateLabel || fmtDate(scan.date);
  }

  /* ---------- detail panel --------------------------------------------- */

  function sevTag(sev) {
    return `<span class="tag sev-${sev}">${esc(SEVERITY[sev].label)}</span>`;
  }

  /* The verbatim report text is local-only — it is not published with the site.
     When the bundle is present the finding expands to the original report; when it
     is not, the entry just names its source file. */
  function reportBlock(scan) {
    const text = window.REPORT_TEXT ? window.REPORT_TEXT[scan.file] : null;
    if (!text) return `<p class="tl-file">${esc(scan.file)}</p>`;
    return `<details class="report"><summary>Full report — ${esc(scan.file)}</summary>`
         + `<pre>${esc(text)}</pre></details>`;
  }

  function findingItem(f) {
    const scan = scanById(f.scan);
    if (!scan) return '';
    const postOp = f.event === 'post-op';
    let s = `<li class="tl-item sev-${f.severity}">`;
    s += `<p class="tl-head">`
       + `<span class="tl-date">${esc(scanDateLabel(scan))}</span>`
       + `<span class="tl-mod">${esc(scan.modality)}</span>`
       + sevTag(f.severity)
       + (postOp ? `<span class="tag tag-surgery">First look after surgery</span>` : '')
       + (scan.dateUncertain ? `<span class="tag tag-flag">Date uncertain</span>` : '')
       + `</p>`;
    s += `<p class="tl-body">${esc(f.text)}</p>`;
    if (f.quote) s += `<blockquote class="tl-quote">${esc(f.quote)}</blockquote>`;
    if (scan.dateUncertain && scan.dateNote) s += `<p class="tl-note">${esc(scan.dateNote)}</p>`;
    s += `<p class="tl-src">${esc(scan.title)}</p>`;
    s += reportBlock(scan);
    return s + `</li>`;
  }

  /* A surgery is its own event on the timeline, not a property of whichever scan
     happened to catch it. Dating it off the scan would have implied the operation
     took place on the day of the imaging, which is wrong for both lumbar surgeries. */
  function surgeryItem(op) {
    let s = `<li class="tl-item is-surgery">`;
    s += `<p class="tl-head">`
       + `<span class="tl-date">${esc(op.dateLabel || fmtDate(op.date))}</span>`
       + `<span class="tag tag-surgery">Surgery</span>`
       + (op.dateUncertain ? `<span class="tag tag-flag">Date inferred</span>` : '')
       + `</p>`;
    s += `<p class="tl-body tl-surgery">${esc(op.label)}</p>`;
    if (op.note) s += `<p class="tl-note">${esc(op.note)}</p>`;
    return s + `</li>`;
  }

  const surgeriesFor = id => SURGERIES.filter(op => op.levels.indexOf(id) >= 0);

  /* Imaging-coverage figures, counted from SCANS rather than written down. */
  function coverageMetrics() {
    const tally = region => {
      const hits = SCANS.filter(s => s.region === region);
      if (!hits.length) return 'No dedicated study, ever';
      const by = {};
      hits.forEach(s => { by[s.modality] = (by[s.modality] || 0) + 1; });
      const parts = Object.keys(by).sort().map(m => `${by[m]} ${m}${by[m] > 1 && m === 'X-ray' ? 's' : ''}`);
      const years = hits.map(s => +s.date.slice(0, 4));
      const lo = Math.min(...years), hi = Math.max(...years);
      return `${parts.join(', ')} · ${lo === hi ? lo : lo + '–' + hi}`;
    };

    const dates = SCANS.map(s => s.date).sort();
    let gap = { from: dates[0], to: dates[0], days: 0 };
    for (let i = 1; i < dates.length; i++) {
      const days = (Date.parse(dates[i]) - Date.parse(dates[i - 1])) / 86400000;
      if (days > gap.days) gap = { from: dates[i - 1], to: dates[i], days };
    }

    return [
      ['Cervical spine', tally('Cervical')],
      ['Thoracic spine', 'No dedicated study, ever'],
      ['Lumbar spine', tally('Lumbar')],
      ['Whole spine (standing)', tally('Full spine')],
      ['Brain / posterior fossa', tally('Brain')],
      ['Longest gap in the record', `${(gap.days / 365.25).toFixed(1)} years — ${fmtDate(gap.from)} to ${fmtDate(gap.to)}`]
    ];
  }

  function renderLevel(lv) {
    // Scans and surgeries interleave on one chronological track.
    const ops = surgeriesFor(lv.id);
    const entries = lv.findings
      .map(f => ({ date: (scanById(f.scan) || {}).date || '', rank: 1, html: () => findingItem(f) }))
      .concat(ops.map(op => ({ date: op.date, rank: 0, html: () => surgeryItem(op) })))
      // Same-day ties put the operation first: the scan that shares its date is the
      // post-operative film, so it can only come after.
      .sort((a, b) => a.date.localeCompare(b.date) || a.rank - b.rank);

    let s = `<p class="backline">`
      + `<button type="button" class="back" data-home><span class="back-arrow" aria-hidden="true">←</span>Overview</button>`
      + `<kbd class="back-kbd">Esc</kbd></p>`;
    s += `<p class="eyebrow">${esc(REGION_LABEL[lv.region] || lv.region)}${lv.sub ? ' · ' + esc(lv.sub) : ''}</p>`;
    s += `<h2 class="detail-title">${esc(lv.label)}</h2>`;
    s += `<p class="status-line">${sevTag(lv.severity)}`
       + (lv.surgical ? `<span class="tag tag-surgery">Prior surgery</span>` : '')
       + `<span class="status-text">${esc(lv.status)}</span></p>`;
    s += `<p class="lede">${esc(lv.summary)}</p>`;

    // Surgeries up front — for a level that has been operated on twice, that is the
    // first thing you want, not something to find partway down the timeline.
    if (ops.length) {
      s += `<h3 class="section-head">Surgery at this level — ${ops.length}</h3>`;
      s += `<ul class="ops">` + ops.map(op =>
        `<li class="op">`
        + `<p class="op-head"><span class="op-date">${esc(op.dateLabel || fmtDate(op.date))}</span>`
        + (op.dateUncertain ? `<span class="tag tag-flag">Date inferred</span>` : '') + `</p>`
        + `<p class="op-label">${esc(op.label)}</p>`
        + `</li>`).join('') + `</ul>`;
    }

    const metrics = lv.coverage ? coverageMetrics() : lv.metrics;
    if (metrics && metrics.length) {
      s += `<h3 class="section-head">Detail</h3><dl class="metrics">`;
      metrics.forEach(([k, v]) => {
        s += `<div class="metric"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`;
      });
      s += `</dl>`;
    }

    const nScans = lv.findings.length;
    s += `<h3 class="section-head">Progression — ${nScans} report${nScans === 1 ? '' : 's'}`
       + (ops.length ? ` and ${ops.length} operation${ops.length === 1 ? '' : 's'}` : '') + `</h3>`;
    s += `<ol class="timeline">${entries.map(e => e.html()).join('')}</ol>`;
    // The timeline can run long enough to push the link at the top out of view, so
    // the end of the level is also an exit.
    s += `<p class="backline backline-end">`
      + `<button type="button" class="back" data-home><span class="back-arrow" aria-hidden="true">←</span>Back to overview</button></p>`;
    return s;
  }

  function renderOverview() {
    const real = LEVELS.filter(l => !l.virtual);
    const worst = real.filter(l => l.severity === 'severe');
    const moderate = real.filter(l => l.severity === 'moderate');
    const treated = real.filter(l => l.surgical);

    const chip = l => `<button type="button" class="jump sev-${l.severity}" data-jump="${esc(l.id)}">`
      + `${esc(l.label)}<span class="jump-sub">${esc(l.status)}</span></button>`;

    let s = `<p class="eyebrow">Whole spine · 2014 to 2026</p>`;
    s += `<h2 class="detail-title">Overview</h2>`;
    const years = SCANS.map(s2 => +s2.date.slice(0, 4));
    s += `<p class="lede">${SCANS.length} imaging studies spanning ${Math.max(...years) - Math.min(...years)}`
       + ` years — MRI, CT and x-ray of the brain, neck and spine. Select any level on the diagram to see`
       + ` what is happening there and every dated report that describes it.</p>`;

    s += `<h3 class="section-head">Needs attention now</h3>`;
    s += `<div class="jumps">${worst.map(chip).join('')}</div>`;

    s += `<h3 class="section-head">Moderate and progressing</h3>`;
    s += `<div class="jumps">${moderate.map(chip).join('')}</div>`;

    s += `<h3 class="section-head">Operated levels</h3>`;
    s += `<ol class="timeline">`;
    SURGERIES.forEach(op => {
      s += `<li class="tl-item is-surgery">`
         + `<p class="tl-head"><span class="tl-date">${esc(op.dateLabel || fmtDate(op.date))}</span>`
         + `<span class="tag tag-surgery">Surgery</span>`
         + (op.dateUncertain ? `<span class="tag tag-flag">Date inferred</span>` : '')
         + `</p>`
         + `<p class="tl-body">${esc(op.label)}</p>`
         + `<p class="tl-note">${esc(op.note)}</p>`
         + `<div class="jumps">${op.levels.map(id => {
              const l = levelById(id);
              return l ? `<button type="button" class="jump sev-${l.severity}" data-jump="${esc(id)}">${esc(l.label)}</button>` : '';
            }).join('')}</div>`
         + `</li>`;
    });
    s += `</ol>`;

    s += `<h3 class="section-head">Whole-spine findings</h3>`;
    s += `<div class="jumps">${LEVELS.filter(l => l.virtual).map(chip).join('')}</div>`;

    s += `<h3 class="section-head">How to read this</h3>`;
    s += `<ul class="notes">`
       + `<li>Colour and hatching both carry severity, so the diagram still reads without colour.</li>`
       + `<li>A green outline and a cross mark levels that have been operated on — separately from how bad they currently are. `
       + `${esc(treated.map(l => l.label).join(', '))} all carry that mark.</li>`
       + `<li>Dotted discs have never been imaged. They are not known to be healthy.</li>`
       + `<li>The narrowing band running behind the vertebrae in the side view is the spinal canal, drawn narrower where a report measured it narrower.</li>`
       + `</ul>`;
    s += `<p class="disclaimer">This page reorganises what your radiology reports already say. `
       + `It adds no interpretation of its own and is not medical advice — the wording of each finding is `
       + `kept close to the original, and every entry links to the full report it came from.</p>`;
    return s;
  }

  function renderDetail() {
    const lv = selected ? levelById(selected) : null;
    els.detail.innerHTML = lv ? renderLevel(lv) : renderOverview();
    if (lv) els.detail.setAttribute('aria-labelledby', 'tab-' + lv.id);
    else els.detail.removeAttribute('aria-labelledby');
  }

  /* ---------- tabs ------------------------------------------------------ */

  const tabEl = id => document.querySelector(`[data-level="${CSS.escape(id)}"]`);

  function activeId() {
    return selected || tabOrder[0];
  }

  /* The spine and the whole-spine buttons are two separate tablists, so each keeps
     its own tab stop. Arrow keys still run across both. */
  function syncTabs() {
    [spineIds, virtualIds].forEach(ids => {
      const active = ids.indexOf(selected) >= 0 ? selected : ids[0];
      ids.forEach(id => {
        const el = tabEl(id);
        if (!el) return;
        const isSel = id === selected;
        el.setAttribute('aria-selected', isSel ? 'true' : 'false');
        el.setAttribute('tabindex', id === active ? '0' : '-1');
        el.classList.toggle('is-selected', isSel);
      });
    });
  }

  function select(id, opts) {
    opts = opts || {};
    selected = id;
    renderDetail();
    syncTabs();
    if (opts.focus) {
      const el = tabEl(id);
      if (el && el.focus) el.focus();
    }
    if (opts.scroll && window.matchMedia('(max-width: 900px)').matches) {
      els.detail.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* Back to the landing state. Focus moves onto the panel rather than staying on
     whichever control was clicked, because the in-content links do not survive the
     re-render and focus would otherwise fall to <body>. */
  function goHome() {
    if (selected === null) return;
    selected = null;
    renderDetail();
    syncTabs();
    var inner = els.detail.parentElement;
    if (inner) inner.scrollTop = 0;
    if (window.matchMedia('(max-width: 900px)').matches) {
      els.detail.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    els.detail.focus({ preventScroll: true });
  }

  function move(delta) {
    const idx = tabOrder.indexOf(activeId());
    const next = tabOrder[Math.min(tabOrder.length - 1, Math.max(0, idx + delta))];
    if (next) select(next, { focus: true });
  }

  function onKeydown(e) {
    const tab = e.target.closest ? e.target.closest('[data-level]') : null;
    if (!tab) return;
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); move(1); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); move(-1); }
    else if (k === 'Home') { e.preventDefault(); select(tabOrder[0], { focus: true }); }
    else if (k === 'End') { e.preventDefault(); select(tabOrder[tabOrder.length - 1], { focus: true }); }
    // Native buttons already turn Enter/Space into a click; only the SVG groups need this.
    else if ((k === 'Enter' || k === ' ') && tab.tagName.toLowerCase() !== 'button') {
      e.preventDefault();
      select(tab.dataset.level, { focus: true, scroll: true });
    }
    else if (k === 'Escape' && selected) { e.preventDefault(); goHome(); }
  }

  function onClick(e) {
    if (e.target.closest('[data-home]')) { goHome(); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) {
      select(jump.dataset.jump, { focus: true });
      return;
    }
    const tab = e.target.closest('[data-level]');
    if (tab) select(tab.dataset.level, { scroll: true });
  }

  /* ---------- views ----------------------------------------------------- */

  const CAPTIONS = {
    side: 'Side view — head to the left. The pale band behind the vertebrae is the spinal canal; it narrows where a report measured it narrow.',
    front: 'Front view — as if facing you, so your left is on the right of the diagram. The S-curve is schematic; the labelled angles are the Cobb measurements from the 2025 standing survey.'
  };

  function mount() {
    const out = Spine.render(view);
    els.mount.innerHTML = out.html;
    spineIds = out.order;
    tabOrder = spineIds.concat(virtualIds);
    els.caption.textContent = CAPTIONS[view];
    syncTabs();
  }

  function renderVirtualTabs() {
    els.virtual.innerHTML = LEVELS.filter(l => l.virtual).map(l =>
      `<button type="button" class="vtab sev-${l.severity}" id="tab-${esc(l.id)}" data-level="${esc(l.id)}"`
      + ` role="tab" aria-selected="false" aria-controls="detail" tabindex="-1">`
      + `<span class="vtab-label">${esc(l.label)}</span>`
      + `<span class="vtab-sub">${esc(l.status)}</span></button>`
    ).join('');
  }

  function setView(next) {
    view = next;
    els.viewToggle.querySelectorAll('[data-view]').forEach(b => {
      const on = b.dataset.view === view;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    });
    const hadFocus = els.mount.contains(document.activeElement);
    mount();
    if (hadFocus && selected) { const el = tabEl(selected); if (el) el.focus(); }
  }

  /* ---------- init ------------------------------------------------------ */

  function start() {
    renderVirtualTabs();
    mount();
    renderDetail();

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    els.viewToggle.addEventListener('click', e => {
      const b = e.target.closest('[data-view]');
      if (b) setView(b.dataset.view);
    });
  }

  /* The report bundle is local-only and absent from the published site, so it is
     loaded here rather than with a <script> tag in the page — that way a missing
     file is an expected outcome we handle, not a broken dependency. */
  const bundle = document.createElement('script');
  bundle.src = 'assets/js/reports.js';
  bundle.onload = bundle.onerror = start;
  document.head.appendChild(bundle);
})();

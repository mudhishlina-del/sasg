/* SASG26 Riyadh research site · charts and interactions.
   Every plotted value comes from data.js, a transcription of the verified
   MATLAB exports in data/. verify() re-derives the reported KPIs on load. */
(() => {
  const D = globalThis.SASG_DATA;

  /* ---------- palette and series (match the poster brief) ---------- */
  /* Warm palette: heat for load, cool teal for load moved into cooler hours.
     Keys keep their old names so every chart picks up the new colours. */
  const C = {
    navy: '#2a1c16', direct: '#2f5fa7', teal: '#2a8c84', tealSoft: '#f2a066', copper: '#d9480f',
    fourier: '#d9480f', fixed: '#e09b1a', removed: '#e8692c', returned: '#2a8c84', cap: '#a3201b',
    slate: '#8c8178', grid: '#eee4d7', axis: '#b3a596', text: '#5b4f46', faint: '#fcf8f1',
    tealTint: '#e3f0ec', copperTint: '#fce6d6', tie: '#e8ddd0', white: '#ffffff'
  };
  const HEAT = ['#f9e7b9', '#f6c36a', '#f08a2c', '#d9480f', '#a3201b', '#5e1313'];
  function heat(v, lo = 11500, hi = 14200) {
    const f = Math.max(0, Math.min(1, (v - lo) / (hi - lo))) * (HEAT.length - 1), i = Math.min(HEAT.length - 2, Math.floor(f)), t = f - i;
    const a = HEAT[i].match(/\w\w/g).map(x => parseInt(x, 16)), b = HEAT[i + 1].match(/\w\w/g).map(x => parseInt(x, 16));
    return 'rgb(' + a.map((c, k) => Math.round(c + (b[k] - c) * t)).join(',') + ')';
  }
  const fmt = (v, d = 2) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const signed = (v, d = 2) => (v > 0.0005 ? '+' : v < -0.0005 ? '−' : '±') + fmt(Math.abs(v), d);
  const pct = (v, d = 2) => fmt(v, d) + '%';
  const sum = a => a.reduce((t, v) => t + v, 0);
  const hour = h => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const base = D.profiles.map(r => r.Original_Load_MW);
  const peak = Math.max(...base);
  const peakHour = base.indexOf(peak);
  const energy = sum(base);
  const a0 = energy / base.length;
  const hourlyLimit = 0.04 * Math.min(...base);
  const threshold = 13500;
  const above = vals => vals.filter(v => v > threshold).length;

  const series = [
    { key: 'base', name: 'No control', color: C.slate, dash: '2 4', width: 2, marker: 'open', row: D.kpis[0], values: base },
    { key: 'fixed', name: 'Fixed-time', color: C.fixed, dash: '8 5', width: 2.4, field: 'Fixed_Time_MW', row: D.kpis[2] },
    { key: 'direct', name: 'Peak shaving only', color: C.direct, dash: '', width: 2.6, field: 'Direct_DR_MW', row: D.kpis[3] },
    { key: 'fourier', name: 'Proposed: Fourier + shaving', color: C.fourier, dash: '', width: 2.8, marker: 'dot', field: 'Proposed_Fourier_DR_MW', row: D.kpis[4] }
  ];
  series.slice(1).forEach(s => { s.values = D.profiles.map(r => r[s.field]); });
  const reportName = { fixed: 'Fixed-time DR', direct: 'Direct DR', fourier: 'Fourier-guided DR' };

  /* ---------- model ---------- */
  function term(row, t) {
    const w = 2 * Math.PI * row.Harmonic * t / 24;
    return row.a_k_MW * Math.cos(w) + row.b_k_MW * Math.sin(w);
  }
  const fitAt = (order, t) => a0 + sum(D.harmonics.slice(0, order).map(r => term(r, t)));
  function fit(order) {
    const values = base.map((_, t) => fitAt(order, t));
    const sse = sum(values.map((v, i) => (base[i] - v) ** 2));
    const sst = sum(base.map(v => (v - a0) ** 2));
    return { values, rmse: Math.sqrt(sse / base.length), explained: 100 * (1 - sse / sst) };
  }
  const sst = sum(base.map(v => (v - a0) ** 2));
  const share = row => 100 * (row.Amplitude_MW ** 2 * base.length / 2) / sst;

  function capScenario(cap) {
    const input = D.capBaseline;
    const values = input.map(v => Math.min(v, cap));
    const shifted = sum(input.map(v => Math.max(0, v - cap)));
    for (let i = 0; i < 6; i++) values[i] += shifted / 6;
    const before = Math.max(...input), after = Math.max(...values);
    return { values, before, after, afterHour: values.indexOf(after), shifted, diff: sum(values) - sum(input),
      reduction: 100 * (before - after) / before };
  }

  function verify() {
    const near = (a, e, what, tol = 0.005) => { if (!(Math.abs(a - e) < tol)) throw new Error('Mismatch: ' + what + ' (' + a + ' vs ' + e + ')'); };
    near(peak, 14110.9, 'baseline peak'); near(peakHour, 13, 'peak hour');
    near(energy, 303492.7, 'daily energy', 0.01);
    D.orders.forEach(r => { const f = fit(r.Harmonics_K); near(f.rmse, r.Fit_RMSE_MW, 'RMSE K' + r.Harmonics_K); near(f.explained, r.Variation_Explained_pct, 'explained K' + r.Harmonics_K); });
    fit(5).values.forEach((v, i) => near(v, D.profiles[i].Fourier_K5_MW, 'K5 hour ' + i));
    near(share(D.harmonics[0]), fit(1).explained, 'K1 share');
    D.harmonics.forEach(r => {
      near(r.Amplitude_MW * Math.cos(r.Phase_rad), r.a_k_MW, 'phase/cos K' + r.Harmonic, 0.01);
      near(-r.Amplitude_MW * Math.sin(r.Phase_rad), r.b_k_MW, 'phase/sin K' + r.Harmonic, 0.01);
    });
    series.forEach(({ name, row, values }) => {
      near(Math.max(...values), row.Peak_MW, name + ' peak');
      near(sum(values), row.Daily_Energy_MWh, name + ' energy', 0.01);
      near(sum(values.map((v, i) => Math.max(0, base[i] - v))), row.Shifted_Energy_MWh, name + ' shifted', 0.01);
      near(100 * (peak - row.Peak_MW) / peak, row.Peak_Reduction_pct, name + ' reduction');
      near(a0 / row.Peak_MW, row.Load_Factor, name + ' load factor');
      near(Math.max(...values.slice(1).map((v, i) => Math.abs(v - values[i]))), row.Max_Ramp_MW_per_h, name + ' ramp');
      if (values.some((v, i) => Math.abs(v - base[i]) > hourlyLimit + 0.005)) throw new Error(name + ' exceeds hourly limit');
    });
    near(series[3].values[23], 12578.1179214153, 'Fourier 23:00');
    [0, 1, 2].forEach(i => near(series[i].values[23], 12338.1, series[i].name + ' 23:00'));
    near(above(base), 5, 'baseline hours above'); series.slice(1).forEach(s => near(above(s.values), 1, s.name + ' hours above'));
    series.slice(1).forEach(s => {
      const rec = D.demandReport.filter(r => r.Method === reportName[s.key]);
      near(rec.length, 24, s.name + ' report length');
      rec.forEach((r, i) => { near(r.Baseline_MW, base[i], 'report base'); near(r.ControlledLoad_MW, s.values[i], 'report load'); near(r.Change_MW, s.values[i] - base[i], 'report change'); });
      near(D.demandSummary.find(r => r.Method === reportName[s.key]).EnergyShifted_MWh, s.row.Shifted_Energy_MWh, s.name + ' summary', 0.01);
    });
    D.presets.forEach(r => { const c = capScenario(r.PeakCap_MW); near(c.before, r.PeakBefore_MW, 'T5 before'); near(c.after, r.PeakAfter_MW, 'T5 after'); near(c.shifted, r.EnergyShift_MWh, 'T5 shift', 0.01); near(c.reduction, r.PeakReduction_pct, 'T5 reduction'); near(c.diff, 0, 'T5 energy', 0.01); });
    D.audit.forEach(r => near(r.Wins_vs_Direct_n + r.Ties_vs_Direct_n + r.Losses_vs_Direct_n, 200, 'audit count'));
    return true;
  }

  globalThis.SASG_DASHBOARD = { verify, fit, capScenario };
  if (typeof document === 'undefined') return;

  const el = id => document.getElementById(id);

  /* ---------- SVG helpers (drawn at the container's real pixel width) ---------- */
  const T = (x, y, s, cls = 'ax', extra = '') => `<text x="${x}" y="${y}" class="${cls}" ${extra}>${esc(s)}</text>`;
  const L = (x1, y1, x2, y2, stroke, w = 1, dash = '', extra = '') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} ${extra}/>`;
  const R = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(0, h)}" fill="${fill}" ${extra}/>`;
  const svg = (w, h, label, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const poly = (pts, stroke, w, dash = '', fill = 'none') =>
    `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const swatch = s => `<svg class="sw" width="26" height="10" aria-hidden="true">${L(1, 5, 25, 5, s.color, s.width, s.dash)}${s.marker === 'open' ? `<circle cx="13" cy="5" r="3" fill="#fff" stroke="${s.color}" stroke-width="1.6"/>` : s.marker === 'dot' ? `<circle cx="13" cy="5" r="2.8" fill="${s.color}"/>` : ''}</svg>`;

  const charts = [];
  function mount(id, draw) {
    const host = el(id); if (!host) return null;
    const c = { host, draw, w: 0, render() { const w = Math.round(host.clientWidth); if (!w) return; this.w = w; draw(host, w); } };
    charts.push(c);
    new ResizeObserver(() => { if (Math.round(host.clientWidth) !== c.w) c.render(); }).observe(host);
    c.render();
    return c;
  }

  /* hour scrubbing on any 24-hour chart */
  function scrub(host, x0, x1, onHour) {
    const s = host.querySelector('svg'); if (!s) return;
    let down = false;
    const pick = e => {
      const r = s.getBoundingClientRect(), px = (e.clientX - r.left) * (s.viewBox.baseVal.width / r.width);
      if (px < x0 - 14 || px > x1 + 14) return;
      onHour(Math.max(0, Math.min(23, Math.round(23 * (px - x0) / (x1 - x0)))));
    };
    s.addEventListener('pointerdown', e => { down = true; pick(e); });
    s.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse') pick(e); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => s.addEventListener(n, () => { down = false; }));
  }

  /* shared hourly axes */
  function hourFrame(w, h, m, yMin, yMax, yStep, yFmt = v => fmt(v, 0), pad = false) {
    const x = pad ? t => m.l + (w - m.l - m.r) * (t + 0.5) / 24 : t => m.l + (w - m.l - m.r) * t / 23;
    const y = v => m.t + (h - m.t - m.b) * (yMax - v) / (yMax - yMin);
    let g = R(m.l, m.t, w - m.l - m.r, h - m.t - m.b, C.faint);
    for (let v = yMin; v <= yMax + 1e-9; v += yStep) g += L(m.l, y(v), w - m.r, y(v), C.grid) + T(m.l - 8, y(v) + 4, yFmt(v), 'ax', 'text-anchor="end"');
    return { x, y, g };
  }
  function hourTicks(w, h, m, x, sel) {
    const step = w < 520 ? 6 : w < 820 ? 3 : 2;
    let g = L(m.l, h - m.b, w - m.r, h - m.b, C.axis);
    for (let t = 0; t <= 23; t += step) if (Math.abs(t - sel) > (step >= 6 ? 2 : 1)) g += T(x(t), h - m.b + 17, hour(t), 'ax', 'text-anchor="middle"');
    if (Math.abs(23 - sel) > 1 && 23 % step && 23 - Math.floor(23 / step) * step >= 2) g += T(Math.min(x(23) + 6, w - 1), h - m.b + 17, '23:00', 'ax', 'text-anchor="end"');
    const px = Math.max(22, Math.min(w - 22, x(sel)));
    g += `<g class="pill">${R(px - 22, h - m.b + 4, 44, 18, C.navy, 'rx="0"')}${T(px, h - m.b + 17, hour(sel), 'pill-t', 'text-anchor="middle"')}</g>`;
    return g;
  }

  /* ---------- readouts ---------- */
  const stat = (dt, dd, cls = '') => `<div class="${cls}"><dt>${dt}</dt><dd>${dd}</dd></div>`; /* dt is trusted static markup */

  /* ===================================================================
     OVERVIEW PAGE
     =================================================================== */
  if (el('peak-bars')) {
    const k5 = fit(5), direct = series[2].row, guided = series[3].row;
    const nD = D.audit.find(r => r.Noise_pct === 3 && r.Method === 'Direct');
    const nK = D.audit.find(r => r.Noise_pct === 3 && r.Method === 'Fourier K5');
    el('hero-baseline').textContent = 'Baseline peak: ' + fmt(peak) + ' MW at ' + hour(peakHour);
    el('peak-bars').innerHTML = series.slice(1).map(s =>
      `<div><div class="peak-bar-label"><span>${swatch(s)}${esc(s.name)}</span><strong>${pct(s.row.Peak_Reduction_pct)}</strong></div>` +
      `<div class="peak-bar-track" aria-hidden="true"><span style="width:${100 * s.row.Peak_Reduction_pct / 4}%;background:${s.color}"></span></div>` +
      `<p class="peak-bar-sub">${fmt(s.row.Peak_MW)} MW peak · ramp ${fmt(s.row.Max_Ramp_MW_per_h)} MW/h</p></div>`).join('') +
      '<p class="peak-scale">Scale: 0–4% peak reduction</p>';
    el('hero-tie').innerHTML = '<strong>Peak shaving only and the proposed method tie on peak.</strong> Peak shaving only has the smaller largest hour-to-hour change: ' +
      fmt(direct.Max_Ramp_MW_per_h) + ' vs ' + fmt(guided.Max_Ramp_MW_per_h) + ' MW/h.';
    el('finding-fit').innerHTML = 'Five harmonics explain <strong>' + pct(k5.explained) + '</strong> of hourly variation with <strong>' + fmt(k5.rmse) + ' MW</strong> RMSE. The 24-hour wave alone explains ' + pct(fit(1).explained) + '.';
    el('finding-energy').innerHTML = 'Each method moved <strong>' + fmt(direct.Shifted_Energy_MWh) + ' MWh</strong> to other hours. Daily energy stayed at ' + fmt(energy) + ' MWh, so the peak fell through redistribution, not savings.';
    el('finding-noise').innerHTML = 'With 3% synthetic noise on the one profile, Fourier K5 averaged <strong>' + pct(nK.Mean_PeakReduction_pct) + '</strong> vs ' + pct(nD.Mean_PeakReduction_pct) +
      ' for peak shaving only: ' + nK.Wins_vs_Direct_n + ' wins, ' + nK.Ties_vs_Direct_n + ' ties, ' + nK.Losses_vs_Direct_n + ' losses in 200 paired trials.';
    return;
  }
  if (!el('dr-chart')) return;

  if (el('kpi-compare')) {
    const fo = D.kpis[1], ps = series[2].row, pr = series[3].row;
    const nD = D.audit.find(r => r.Noise_pct === 3 && r.Method === 'Direct');
    const nK = D.audit.find(r => r.Noise_pct === 3 && r.Method === 'Fourier K5');
    const cell = (v, sub, best) => `<div class="kc-v${best ? ' best' : ''}"><strong>${v}</strong>${sub ? `<small>${sub}</small>` : ''}</div>`;
    const card = (title, def, a, b, c, note) => `<article class="kc"><h3>${title}</h3><p class="kc-def">${def}</p>` +
      `<div class="kc-row"><span>Fourier only</span>${a}</div><div class="kc-row"><span>Peak shaving only</span>${b}</div><div class="kc-row prop"><span>Proposed</span>${c}</div>` +
      (note ? `<p class="kc-note">${note}</p>` : '') + '</article>';
    el('kpi-compare').innerHTML =
      card('Energy consumption', 'Daily energy and energy moved',
        cell(fmt(fo.Daily_Energy_MWh) + ' MWh', 'nothing shifted'), cell(fmt(ps.Daily_Energy_MWh) + ' MWh', fmt(ps.Shifted_Energy_MWh) + ' MWh shifted'), cell(fmt(pr.Daily_Energy_MWh) + ' MWh', fmt(pr.Shifted_Energy_MWh) + ' MWh shifted'),
        'Energy is conserved: the peak falls through load shifting, not saving.') +
      card('Peak demand reduction', 'Clean profile · 3% synthetic noise (mean, worst 5%)',
        cell('0%', fmt(fo.Peak_MW) + ' MW peak'), cell(pct(ps.Peak_Reduction_pct), 'noise: ' + pct(nD.Mean_PeakReduction_pct) + ' · ' + pct(nD.FifthPercentile_pct)), cell(pct(pr.Peak_Reduction_pct), 'noise: ' + pct(nK.Mean_PeakReduction_pct) + ' · ' + pct(nK.FifthPercentile_pct), true),
        'Tie on clean data; the proposed method holds more of the cut under noise. Moving averages do about as well.') +
      card('Demand response', 'Largest hour-to-hour change · load factor',
        cell(fmt(fo.Max_Ramp_MW_per_h) + ' MW/h', pct(100 * fo.Load_Factor)), cell(fmt(ps.Max_Ramp_MW_per_h) + ' MW/h', pct(100 * ps.Load_Factor), true), cell(fmt(pr.Max_Ramp_MW_per_h) + ' MW/h', pct(100 * pr.Load_Factor)),
        'Same flatter day, but the proposed schedule ramps harder than even the uncontrolled day.') +
      card('Operational cost', 'Hypothetical cost-exposure index, reduction',
        cell('0%', ''), cell(ps.Cost_Exposure_Change_pct.toFixed(2) + '%', '', true), cell(pr.Cost_Exposure_Change_pct.toFixed(2) + '%', ''),
        'A proxy computed under assumed weights. No tariff data, so no monetary saving is claimed.');
  }

  try { verify(); console.info('SASG26: data checks passed'); }
  catch (e) { const b = el('verification'); b.hidden = false; b.textContent = 'Data check failed: ' + e.message; console.error(e); }

  /* legacy links (QR, old anchors) */
  const legacy = { spectrum: 'harmonics', meter: 'control', 'demand-report': 'hourly', context: 'hourly' };
  if (new URLSearchParams(location.search).get('view') === 'noise' && !location.hash) location.hash = 'noise';
  if (legacy[location.hash.slice(1)]) location.replace('#' + legacy[location.hash.slice(1)]);

  /* ===================================================================
     HERO · 24-hour clock and heat strip
     =================================================================== */
  const hero = { hour: peakHour };
  const guided = series[3];
  const radial = mount('hero-radial', (host, w) => {
    const size = Math.min(w, 520), cx = size / 2, cy = size / 2;
    const r1 = Math.min(size * 0.43, size / 2 - 48), r0 = r1 * 0.46, lo = 11000, hi = 14500;
    const rad = v => r0 + (r1 - r0) * (v - lo) / (hi - lo);
    const ang = t => (t / 24) * 2 * Math.PI - Math.PI / 2;
    const pt = (t, v) => [cx + rad(v) * Math.cos(ang(t)), cy + rad(v) * Math.sin(ang(t))];
    const path = vals => 'M' + vals.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(' ')).join(' L') + ' Z';
    let b = `<defs><radialGradient id="gR" cx="${cx}" cy="${cy}" r="${r1}" gradientUnits="userSpaceOnUse">` +
      `<stop offset="${(r0 / r1).toFixed(2)}" stop-color="#f9e7b9"/><stop offset=".7" stop-color="#f6c36a"/><stop offset=".86" stop-color="#f08a2c"/><stop offset="1" stop-color="#d9480f"/></radialGradient></defs>`;
    for (let t = 0; t < 24; t++) { const [x1, y1] = pt(t, lo), [x2, y2] = pt(t, hi + 250); b += L(x1, y1, x2, y2, 'rgba(255,240,220,.08)'); }
    [12000, 13000, 14000].forEach(v => { b += `<circle cx="${cx}" cy="${cy}" r="${rad(v)}" fill="none" stroke="rgba(255,240,220,.1)"/>`; });
    b += `<circle cx="${cx}" cy="${cy}" r="${rad(threshold)}" fill="none" stroke="rgba(255,236,210,.55)" stroke-dasharray="3 4"/>`;
    const [tx, ty] = pt(1.3, threshold);
    b += T(tx + 4, ty - 4, '13,500', 'rad-s');
    b += `<path d="${path(base)}" fill="url(#gR)" opacity=".95"/>`;
    b += `<path d="${path(guided.values)}" fill="none" stroke="#fff4e6" stroke-width="2" stroke-dasharray="5 4"/>`;
    b += `<circle cx="${cx}" cy="${cy}" r="${r0 - 2}" fill="#1c1411"/>`;
    [[0, '00:00'], [6, '06:00'], [12, '12:00'], [18, '18:00']].forEach(([t, l]) => {
      const a = ang(t), rr = r1 + 22; b += T(cx + rr * Math.cos(a), cy + rr * Math.sin(a) + 4, l, 'rad-l', 'text-anchor="middle"');
    });
    const t = hero.hour, [hx, hy] = pt(t, base[t]), [gx, gy] = pt(t, guided.values[t]), [ex, ey] = pt(t, hi + 150), [sx, sy] = pt(t, lo + 200);
    b += L(sx, sy, ex, ey, 'rgba(255,244,230,.55)', 1.2) + `<circle cx="${gx}" cy="${gy}" r="4" fill="#1c1411" stroke="#fff4e6" stroke-width="2"/><circle cx="${hx}" cy="${hy}" r="6" fill="#fff" stroke="#1c1411" stroke-width="2"/>`;
    const fv = Math.min(26, r0 * 0.42), fh = Math.min(13, r0 * 0.24), fs2 = Math.min(10.5, r0 * 0.19);
    b += T(cx, cy - r0 * 0.36, hour(t), 'rad-h', `text-anchor="middle" style="font-size:${fh.toFixed(1)}px"`) + T(cx, cy + fv * 0.36, fmt(base[t], 0), 'rad-v', `text-anchor="middle" style="font-size:${fv.toFixed(1)}px"`) +
      T(cx, cy + r0 * 0.5, 'MW baseline', 'rad-s', `text-anchor="middle" style="font-size:${fs2.toFixed(1)}px"`);
    host.innerHTML = svg(size, size, 'Radial 24-hour view of baseline load with the Fourier-guided profile dashed. Selected ' + hour(t) + ', ' + fmt(base[t]) + ' MW baseline.', b);
    const el2 = host.querySelector('svg'); let down = false;
    const pick = e => { const r = el2.getBoundingClientRect(), k = size / r.width, dx = (e.clientX - r.left) * k - cx, dy = (e.clientY - r.top) * k - cy;
      if (Math.hypot(dx, dy) < r0 * 0.6) return; let a = Math.atan2(dy, dx) + Math.PI / 2; if (a < 0) a += 2 * Math.PI; setHero(Math.round(a / (2 * Math.PI) * 24) % 24); };
    el2.addEventListener('pointerdown', e => { down = true; pick(e); });
    el2.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse') pick(e); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => el2.addEventListener(n, () => { down = false; }));
  });
  function heatStrip(host, w, sel, onPick, opt = {}) {
    const h = opt.h ?? 64, cellH = opt.cellH ?? 34, gap = w < 480 ? 2 : 4, cw = (w - gap * 23) / 24;
    let b = '';
    base.forEach((v, i) => {
      const x = i * (cw + gap), on = i === sel;
      b += `<rect x="${x}" y="${on ? 0 : 6}" width="${cw}" height="${on ? cellH + 6 : cellH}" rx="0" fill="${heat(v)}"${on ? ` stroke="${opt.ring ?? '#fff4e6'}" stroke-width="2.5"` : ''}><title>${hour(i)} · ${fmt(v)} MW</title></rect>`;
    });
    if (!opt.noTicks) [0, 6, 12, 18, 23].forEach(t => { b += T(t === 0 ? 0 : t === 23 ? w : t * (cw + gap) + cw / 2, h - 4, hour(t), opt.tickCls ?? 'rad-s', `text-anchor="${t === 0 ? 'start' : t === 23 ? 'end' : 'middle'}"`); });
    host.innerHTML = svg(w, h, opt.label ?? 'Baseline load by hour as a heat strip', b);
    scrub(host, cw / 2, w - cw / 2, onPick);
  }
  const strip = mount('hero-strip', (host, w) => heatStrip(host, w, hero.hour, setHero));
  function setHero(t) {
    if (t === hero.hour) return; hero.hour = t; radial.render(); strip.render();
    el('strip-readout').textContent = hour(t) + ' · ' + fmt(base[t]) + ' MW';
    heroLegend();
  }
  const heroLegend = () => { el('hero-legend').innerHTML = `<span class="lg-item"><span class="lg-base"></span>Baseline <b>${fmt(base[hero.hour])} MW</b></span><span class="lg-item"><span class="lg-dash"></span>Proposed <b>${fmt(guided.values[hero.hour])} MW</b></span><span class="lg-note">Radius = load, 11,000–14,500 MW · drag the clock or the strip</span>`; };
  heroLegend();

  /* ===================================================================
     1 · MATCHED DEMAND RESPONSE
     =================================================================== */
  const dr = { hour: peakHour, visible: new Set(series.map(s => s.key)) };
  function windowOf(h) { return h <= 5 ? 'Fixed-time receiving hour' : h >= 12 && h <= 17 ? 'Fixed-time donor hour' : 'Outside the fixed-time windows'; }

  const drChart = mount('dr-chart', (host, w) => {
    const narrow = w < 560;
    const h = narrow ? 320 : 410, m = { l: narrow ? 48 : 58, r: 12, t: 46, b: 28 };
    const { x, y, g } = hourFrame(w, h, m, 11500, 14500, 500);
    const pw = w - m.l - m.r, half = pw / 46;
    const showWin = dr.visible.has('fixed');
    let b = T(m.l - (narrow ? 40 : 50), 14, 'Total load (MW)', 'at');
    let shade = '';
    if (showWin) {
      shade += R(x(0) - half + 0.5, m.t, x(5) - x(0) + 2 * half, h - m.t - m.b, C.tealTint) + R(x(12) - half, m.t, x(17) - x(12) + 2 * half, h - m.t - m.b, C.copperTint);
      b += R(x(0) - half + 0.5, m.t - 7, x(5) - x(0) + 2 * half, 3, C.teal) + T(x(0) - half + 4, m.t - 12, narrow ? 'Receiving' : 'Fixed-time receiving', 'win', `fill="${C.teal}"`);
      b += R(x(12) - half, m.t - 7, x(17) - x(12) + 2 * half, 3, C.copper) + T(x(12) - half + 4, m.t - 12, narrow ? 'Donor' : 'Fixed-time donor', 'win', `fill="${C.copper}"`);
    }
    b += g.replace(R(m.l, m.t, pw, h - m.t - m.b, C.faint), R(m.l, m.t, pw, h - m.t - m.b, C.faint) + shade);
    b += L(m.l, y(threshold), w - m.r, y(threshold), C.navy, 1.2, '6 4') +
      (narrow ? T(m.l + 4, y(threshold) - 6, '13,500 MW threshold', 'note-t')
        : T(w - m.r - 4, y(threshold) - 6, '13,500 MW analytical threshold', 'note-t', 'text-anchor="end"'));
    if (dr.visible.has('fourier')) {
      const fv = series[3].values;
      b += `<path d="M${x(0)} ${h - m.b} ${fv.map((v, i) => 'L' + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')} L${x(23)} ${h - m.b} Z" fill="url(#gF)"/>`;
    }
    series.forEach(s => {
      if (!dr.visible.has(s.key)) return;
      b += poly(s.values.map((v, i) => [x(i), y(v)]), s.color, s.width, s.dash);
      if (s.marker === 'open') b += s.values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="#fff" stroke="${s.color}" stroke-width="1.4"/>`).join('');
      if (s.marker === 'dot') b += s.values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="${s.color}"/>`).join('');
    });
    /* peak annotation */
    const px = x(peakHour), cut = peak - series[2].row.Peak_MW;
    if (dr.visible.has('base') && (dr.visible.has('direct') || dr.visible.has('fourier'))) {
      b += `<path d="M${px} ${y(peak) + 6} L${px} ${y(series[2].row.Peak_MW) - 6}" stroke="${C.navy}" stroke-width="1.4" marker-end="url(#ah)" marker-start="url(#ah)"/>`;
      b += T(px - 9, y(14300) + 4, narrow ? '−' + fmt(cut, 0) + ' MW' : '13:00 peak  −' + fmt(cut) + ' MW (−' + pct(series[2].row.Peak_Reduction_pct) + ')', 'callout', 'text-anchor="end"');
    }
    b += hourTicks(w, h, m, x, dr.hour);
    const t = dr.hour;
    b += L(x(t), m.t, x(t), h - m.b, C.navy, 1, '3 3');
    series.forEach(s => { if (dr.visible.has(s.key)) b += `<circle cx="${x(t)}" cy="${y(s.values[t])}" r="5" fill="#fff" stroke="${s.color}" stroke-width="2.4"/>`; });
    const defs = `<defs><linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.fourier}" stop-opacity=".22"/><stop offset="1" stop-color="${C.fourier}" stop-opacity="0"/></linearGradient><marker id="ah" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" fill="${C.navy}"/></marker></defs>`;
    host.innerHTML = svg(w, h, 'Hourly total load for no control, fixed-time, direct and Fourier-guided schedules. Selected hour ' + hour(t) + '.', defs + b);
    scrub(host, m.l, w - m.r, setDrHour);
  });

  function drReadout() {
    const t = dr.hour, bv = base[t];
    const rows = series.filter(s => dr.visible.has(s.key)).map(s => {
      const d = s.values[t] - bv;
      return `<li style="--c:${s.color}">${swatch(s)}<span class="nm">${esc(s.name)}</span><span class="v">${fmt(s.values[t])}<small> MW</small></span>` +
        (s.key === 'base' ? '<span class="d">baseline</span>' : `<span class="d ${Math.abs(d) < 0.005 ? '' : d < 0 ? 'down' : 'up'}">${Math.abs(d) < 0.005 ? 'no change' : signed(d) + ' MW'}</span>`) + '</li>';
    }).join('');
    const ctx = t === peakHour ? 'Baseline daily peak' : windowOf(t);
    el('dr-readout').innerHTML = `<p class="ro-k">Selected hour</p><p class="ro-time">${hour(t)}</p><p class="ro-ctx">${ctx}</p><ul class="ro-list">${rows}</ul>`;
    const input = el('dr-hour'); input.value = t; input.setAttribute('aria-valuetext', hour(t));
    document.querySelectorAll('[data-jump]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.jump === t)));
  }
  function setDrHour(t) { if (t === dr.hour) return; dr.hour = t; drChart.render(); drReadout(); }

  el('profile-choices').innerHTML = series.map(s => `<button type="button" aria-pressed="true" data-key="${s.key}" style="--c:${s.color}">${swatch(s)}${esc(s.name)}</button>`).join('');
  el('profile-choices').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = b.dataset.key;
    if (dr.visible.has(k)) { if (dr.visible.size === 1) return; dr.visible.delete(k); } else dr.visible.add(k);
    b.setAttribute('aria-pressed', String(dr.visible.has(k)));
    drChart.render(); drReadout();
  });
  el('dr-hour').addEventListener('input', e => setDrHour(+e.target.value));
  document.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => setDrHour(+b.dataset.jump)));
  drReadout();

  /* row charts (peak, ramp, secondary) */
  function rowChart(host, w, o) {
    const narrow = w < 480;
    const labelW = narrow ? 150 : 205, valW = o.valW ?? (narrow ? 70 : 92), rowH = 34;
    const m = { l: labelW, r: valW, t: o.title ? 40 : 12, b: 30 };
    const h = m.t + o.rows.length * rowH + m.b;
    const [d0, d1] = o.domain, x = v => m.l + (w - m.l - m.r) * (v - d0) / (d1 - d0);
    let b = o.title ? T(0, 15, o.title, 'ct') + (o.sub ? T(0, 31, o.sub, 'cs') : '') : '';
    b += R(m.l, m.t, w - m.l - m.r, o.rows.length * rowH, C.faint);
    o.ticks.forEach(v => { b += L(x(v), m.t, x(v), m.t + o.rows.length * rowH, C.grid) + T(x(v), h - m.b + 16, o.tickFmt(v), 'ax', 'text-anchor="middle"'); });
    o.rows.forEach((r, i) => {
      const cy = m.t + i * rowH + rowH / 2;
      if (r.highlight) b += R(0, cy - rowH / 2 + 2, w, rowH - 4, '#fcebdc');
      b += `<g transform="translate(0 ${cy - 5})">${swatchRaw(r)}</g>` + T(32, cy + 4, r.name, r.highlight ? 'rl b' : 'rl');
      if (o.mode === 'bar') b += R(x(Math.max(d0, 0)), cy - 7, x(r.value) - x(Math.max(d0, 0)), 14, r.color, 'rx="0"');
      else b += L(x(o.stemFrom ?? d0), cy, x(r.value), cy, r.color, 2) + `<circle cx="${x(r.value)}" cy="${cy}" r="6" fill="${r.open ? '#fff' : r.color}" stroke="${r.color}" stroke-width="2"/>`;
      b += T(w - 2, cy + 4, r.label, r.highlight ? 'rv b' : 'rv', 'text-anchor="end"');
    });
    if (o.annotate) b += o.annotate({ x, m, rowH, w, h });
    host.innerHTML = svg(w, h, o.aria, b);
  }
  const swatchRaw = s => L(2, 5, 26, 5, s.color, s.width ?? 2.4, s.dash ?? '') +
    (s.marker === 'open' ? `<circle cx="14" cy="5" r="3" fill="#fff" stroke="${s.color}" stroke-width="1.6"/>` : s.marker === 'dot' ? `<circle cx="14" cy="5" r="2.8" fill="${s.color}"/>` : '');

  mount('peak-chart', (host, w) => rowChart(host, w, {
    title: 'Peak reduction', sub: 'Higher is better', domain: [0, 4], ticks: [0, 1, 2, 3, 4], tickFmt: v => v + '%', stemFrom: 0,
    aria: 'Peak reduction: Fixed-time 2.51%, peak shaving only 3.29%, proposed Fourier plus shaving 3.29%.',
    rows: series.map(s => ({ ...s, value: s.row.Peak_Reduction_pct, label: pct(s.row.Peak_Reduction_pct), highlight: s.key === 'direct' || s.key === 'fourier' })),
    annotate: ({ x, m, rowH, w }) => {
      const xr = x(series[2].row.Peak_Reduction_pct) + 12, y1 = m.t + 2 * rowH + rowH / 2, y2 = m.t + 3 * rowH + rowH / 2;
      return `<path d="M${xr} ${y1} h5 V${y2} h-5" fill="none" stroke="${C.navy}" stroke-width="1.2"/>` + T(xr + 9, (y1 + y2) / 2 + 4, 'Tie', 'callout');
    }
  }));
  mount('ramp-chart', (host, w) => rowChart(host, w, {
    title: 'Maximum hourly ramp (MW/h)', sub: w < 360 ? 'Lower is smoother' : 'Lower is smoother · Shaving only is ' + fmt(series[3].row.Max_Ramp_MW_per_h - series[2].row.Max_Ramp_MW_per_h) + (w < 520 ? ' lower' : ' MW/h below the proposed'), domain: [0, 800], ticks: [0, 200, 400, 600, 800], tickFmt: v => fmt(v, 0), stemFrom: 0,
    aria: 'Maximum hourly ramp: no control and fixed-time 536.30, peak shaving only 489.20, proposed 686.02 MW per hour.',
    rows: series.map(s => ({ ...s, value: s.row.Max_Ramp_MW_per_h, label: fmt(s.row.Max_Ramp_MW_per_h), highlight: s.key === 'direct' || s.key === 'fourier' })),
  }));

  const secondary = [
    { name: 'Load factor', draw: (host, w) => rowChart(host, w, {
      domain: [88, 94], ticks: [88, 90, 92, 94], tickFmt: v => v + '%', stemFrom: 88, aria: 'Load factor by method',
      rows: series.map(s => ({ ...s, value: 100 * s.row.Load_Factor, label: pct(100 * s.row.Load_Factor) }))
    }), caption: 'Load factor is mean load divided by peak load, so higher means a flatter day. The axis starts at 88% to show the differences.' },
    { name: 'Hours above 13,500 MW', draw: (host, w) => rowChart(host, w, {
      mode: 'bar', domain: [0, 6], ticks: [0, 1, 2, 3, 4, 5, 6], tickFmt: v => v + ' h', aria: 'Hours above the 13,500 MW threshold by method', valW: w < 480 ? 92 : 150,
      rows: series.map(s => { const hrs = s.values.map((v, i) => v > threshold ? i : -1).filter(i => i >= 0); return { ...s, value: hrs.length, label: hrs.length + ' h · ' + (hrs.length > 1 ? hour(hrs[0]) + '–' + hour(hrs[hrs.length - 1]) : hour(hrs[0])) }; })
    }), caption: 'Hourly samples strictly above the study’s 13,500 MW analytical threshold. Every controlled profile stays above it only at 13:00.' },
    { name: 'Energy shifted', draw: (host, w) => rowChart(host, w, {
      mode: 'bar', domain: [0, 2500], ticks: [0, 500, 1000, 1500, 2000, 2500], tickFmt: v => fmt(v, 0), aria: 'Energy shifted by method in MWh', valW: w < 480 ? 92 : 120,
      rows: series.map(s => ({ ...s, value: s.row.Shifted_Energy_MWh, label: fmt(s.row.Shifted_Energy_MWh) + ' MWh' }))
    }), caption: 'Energy moved from donor hours to receiving hours, in MWh. Daily energy is 303,492.70 MWh for all four profiles: load is redistributed, not reduced.' }
  ,
    { name: 'Cost-exposure index', draw: (host, w) => rowChart(host, w, {
      mode: 'bar', domain: [0, 0.4], ticks: [0, 0.1, 0.2, 0.3, 0.4], tickFmt: v => v.toFixed(1) + '%', aria: 'Reduction in the hypothetical cost-exposure index by method', valW: w < 480 ? 70 : 92,
      rows: series.map(s => ({ ...s, value: s.row.Cost_Exposure_Change_pct, label: s.row.Cost_Exposure_Change_pct.toFixed(2) + '%' }))
    }), caption: 'Reduction in a unit-less cost-exposure index computed in MATLAB under assumed weights. No tariff or cost data were available, so this is an operational-cost proxy, not a monetary saving. Peak shaving only scores slightly better than the proposed method.' }
  ];
  let secIndex = 0;
  const secChart = mount('secondary-chart', (host, w) => secondary[secIndex].draw(host, w));
  el('secondary-tabs').innerHTML = secondary.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-i="${i}">${esc(s.name)}</button>`).join('');
  const setSec = i => { secIndex = i; [...el('secondary-tabs').children].forEach((b, j) => b.setAttribute('aria-pressed', String(i === j))); el('secondary-caption').textContent = secondary[i].caption; secChart.render(); };
  el('secondary-tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setSec(+b.dataset.i); });
  setSec(0);

  /* ===================================================================
     2 · FOURIER RECONSTRUCTION
     =================================================================== */
  const fs = { order: 5, hour: peakHour };
  const resScale = 600;
  const fitChart = mount('fit-chart', (host, w) => {
    const narrow = w < 560;
    const m = { l: narrow ? 48 : 58, r: 12, t: narrow ? 40 : 24, b: 0 }, h1 = narrow ? 266 : 310, gap = 44, h2 = narrow ? 96 : 116, h = h1 + gap + h2 + 26;
    const { x, y, g } = hourFrame(w, h1, m, 11500, 14500, 500);
    const f = fit(fs.order), t = fs.hour;
    let b = T(m.l - (narrow ? 40 : 50), 13, 'Total load (MW)', 'at') + g;
    const pts = []; for (let s = 0; s <= 230; s++) pts.push([x(s / 10), y(fitAt(fs.order, s / 10))]);
    b += `<defs><linearGradient id="gFit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.fourier}" stop-opacity=".2"/><stop offset="1" stop-color="${C.fourier}" stop-opacity="0"/></linearGradient></defs>` +
      `<path d="M${x(0)} ${h1} ${pts.map(p => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')} L${x(23)} ${h1} Z" fill="url(#gFit)"/>` + poly(pts, C.fourier, 2.8);
    b += base.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.6" fill="#fff" stroke="${C.slate}" stroke-width="1.6"/>`).join('');
    /* residual panel */
    const top = h1 + gap, ry = v => top + h2 / 2 - v * (h2 / 2) / resScale;
    b += T(m.l - (narrow ? 40 : 50), top - 12, 'Residual: estimate − fit (MW)', 'at');
    b += R(m.l, top, w - m.l - m.r, h2, C.faint);
    [-resScale, 0, resScale].forEach(v => { b += L(m.l, ry(v), w - m.r, ry(v), v ? C.grid : C.axis, v ? 1 : 1.2) + T(m.l - 8, ry(v) + 4, v ? signed(v, 0) : '0', 'ax', 'text-anchor="end"'); });
    base.forEach((v, i) => { const e = v - f.values[i]; b += L(x(i), ry(0), x(i), ry(e), e >= 0 ? C.fixed : C.cap, narrow ? 3 : 4); });
    b += hourTicks(w, h, { l: m.l, r: m.r, b: 26 }, x, t);
    b += L(x(t), m.t, x(t), h - 26, C.navy, 1, '3 3') +
      `<circle cx="${x(t)}" cy="${y(f.values[t])}" r="5" fill="#fff" stroke="${C.fourier}" stroke-width="2.4"/><circle cx="${x(t)}" cy="${y(base[t])}" r="5" fill="#fff" stroke="${C.slate}" stroke-width="2.4"/>`;
    /* legend */
    b += `<g transform="translate(${narrow ? 0 : w - m.r - 300} ${narrow ? 20 : 4})"><circle cx="6" cy="5" r="3.6" fill="#fff" stroke="${C.slate}" stroke-width="1.6"/>${T(15, 9, narrow ? 'Estimates' : 'Digitized hourly estimates', 'lg')}${L(narrow ? 88 : 172, 5, narrow ? 108 : 192, 5, C.fourier, 2.8)}${T(narrow ? 113 : 197, 9, 'K = ' + fs.order + ' fit', 'lg')}</g>`;
    host.innerHTML = svg(w, h, 'Digitized hourly load and Fourier reconstruction with ' + fs.order + ' harmonics, with residuals on the same time axis.', b);
    scrub(host, m.l, w - m.r, setFitHour);
  });
  function fitReadout() {
    const f = fit(fs.order), t = fs.hour, e = base[t] - f.values[t];
    el('fit-readout').innerHTML = `<p class="ro-k">Selected hour</p><p class="ro-time">${hour(t)}</p><ul class="ro-list">` +
      `<li style="--c:${C.slate}"><span class="nm">Digitized estimate</span><span class="v">${fmt(base[t])}<small> MW</small></span></li>` +
      `<li style="--c:${C.fourier}"><span class="nm">K = ${fs.order} fit</span><span class="v">${fmt(f.values[t])}<small> MW</small></span></li>` +
      `<li style="--c:${C.fixed}"><span class="nm">Residual</span><span class="v">${signed(e)}<small> MW</small></span></li></ul>`;
    el('fit-hour').value = t; el('fit-hour').setAttribute('aria-valuetext', hour(t));
  }
  function fitStats() {
    const f = fit(fs.order);
    el('fourier-stats').innerHTML = stat('Hourly RMSE', fmt(f.rmse) + '<small> MW</small>', 'hl') + stat('Variation explained', pct(f.explained)) + stat('RMSE ÷ peak', pct(100 * f.rmse / peak));
    el('order-value').textContent = 'K = ' + fs.order; el('order').value = fs.order;
    const tag = el('order-tag');
    tag.textContent = fs.order === 5 ? 'Used in control comparison' : fs.order === 7 ? 'Exploratory fit' : 'Comparison only';
    tag.className = 'order-tag' + (fs.order === 5 ? ' on' : fs.order === 7 ? ' warn' : '');
  }
  function setFitHour(t) { if (t === fs.hour) return; fs.hour = t; fitChart.render(); fitReadout(); }
  function setOrder(k) { fs.order = k; fitStats(); fitChart.render(); fitReadout(); orderChart.render(); }
  el('fit-hour').addEventListener('input', e => setFitHour(+e.target.value));
  el('order').addEventListener('input', e => setOrder(+e.target.value));

  const orderChart = mount('order-chart', (host, w) => {
    const narrow = w < 560, m = { l: narrow ? 44 : 58, r: 16, t: 34, b: 44 }, h = narrow ? 230 : 250;
    const fits = [1, 2, 3, 4, 5, 6, 7].map(k => ({ k, ...fit(k) }));
    const x = k => m.l + (w - m.l - m.r) * (k - 0.5) / 7, y = v => m.t + (h - m.t - m.b) * (300 - v) / 300;
    let b = T(0, 13, 'Hourly RMSE (MW)', 'at') + R(m.l, m.t, w - m.l - m.r, h - m.t - m.b, C.faint);
    [0, 100, 200, 300].forEach(v => { b += L(m.l, y(v), w - m.r, y(v), C.grid) + T(m.l - 8, y(v) + 4, fmt(v, 0), 'ax', 'text-anchor="end"'); });
    b += L(m.l, y(0), w - m.r, y(0), C.axis);
    b += poly(fits.map(f => [x(f.k), y(f.rmse)]), C.slate, 1.5);
    fits.forEach(f => {
      const sel = f.k === fs.order, k5 = f.k === 5;
      b += `<g class="hit" data-k="${f.k}" tabindex="0" role="button" aria-label="Use ${f.k} harmonics, RMSE ${fmt(f.rmse)} MW">` + R(x(f.k) - (w - m.l - m.r) / 14, m.t, (w - m.l - m.r) / 7, h - m.t, 'transparent') +
        (sel ? `<circle cx="${x(f.k)}" cy="${y(f.rmse)}" r="10" fill="none" stroke="${C.navy}" stroke-width="1.5"/>` : '') +
        `<circle cx="${x(f.k)}" cy="${y(f.rmse)}" r="${k5 ? 6.5 : 5}" fill="${k5 ? C.fourier : f.k === 7 ? '#fff' : C.slate}" stroke="${k5 ? C.fourier : C.slate}" stroke-width="1.8"/>` +
        T(x(f.k), y(f.rmse) - 14, fmt(f.rmse, narrow ? 0 : 1), sel || k5 ? 'rv b' : 'rv', 'text-anchor="middle"') +
        T(x(f.k), h - m.b + 17, 'K' + f.k, sel ? 'ax b' : 'ax', 'text-anchor="middle"') +
        T(x(f.k), h - m.b + 32, narrow ? fmt(f.explained, 1) + '%' : fmt(f.explained, 1) + '% expl.', 'ax sm', 'text-anchor="middle"') + '</g>';
    });
    b += T(x(5), y(fits[4].rmse) + 26, narrow ? 'control' : 'control model', 'callout sm', `text-anchor="middle" fill="${C.fourier}"`);
    b += T(x(7), y(fits[6].rmse) + 24, 'exploratory', 'callout sm', 'text-anchor="middle"');
    host.innerHTML = svg(w, h, 'Hourly RMSE falls from 274.84 MW with one harmonic to 125.12 MW with five and 94.43 MW with seven.', b);
    host.querySelectorAll('[data-k]').forEach(g => {
      g.addEventListener('click', () => setOrder(+g.dataset.k));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOrder(+g.dataset.k); } });
    });
  });
  fitStats(); fitReadout();

  /* ===================================================================
     3 · HARMONICS
     =================================================================== */
  const hs = { k: 1 };
  const spectrumChart = mount('spectrum-chart', (host, w) => {
    const narrow = w < 420, m = { l: narrow ? 44 : 52, r: 6, t: 42, b: 58 }, h = narrow ? 310 : 340;
    const pw = w - m.l - m.r, slot = pw / 7, bw = Math.min(64, slot * 0.72);
    const y = v => m.t + (h - m.t - m.b) * (1000 - v) / 1000;
    let b = T(0, 13, 'Amplitude (MW)', 'at') + R(m.l, m.t, pw, h - m.t - m.b, C.faint);
    [0, 250, 500, 750, 1000].forEach(v => { b += L(m.l, y(v), w - m.r, y(v), v ? C.grid : C.axis) + T(m.l - 8, y(v) + 4, fmt(v, 0), 'ax', 'text-anchor="end"'); });
    D.harmonics.forEach((r, i) => {
      const cx = m.l + slot * (i + 0.5), sel = r.Harmonic === hs.k;
      const fill = sel ? '#8f1d1a' : heat(11500 + 2700 * Math.sqrt(r.Amplitude_MW / 1000));
      b += `<g class="hit" data-k="${r.Harmonic}" tabindex="0" role="button" aria-pressed="${sel}" aria-label="Harmonic ${r.Harmonic}: period ${fmt(r.Period_h, 2)} hours, amplitude ${fmt(r.Amplitude_MW)} MW, ${fmt(share(r), 1)}% of variation">` +
        R(cx - slot / 2, m.t, slot, h - m.t, 'transparent') +
        R(cx - bw / 2, y(r.Amplitude_MW), bw, y(0) - y(r.Amplitude_MW), fill, 'rx="0"') +
        T(cx, y(r.Amplitude_MW) - 7, fmt(r.Amplitude_MW, 0), sel ? 'rv b' : 'rv', 'text-anchor="middle"') +
        R(cx - bw / 2, h - m.b + 8, bw, 24, sel ? C.fourier : '#fff', `rx="0" stroke="${sel ? C.fourier : C.grid}"`) +
        T(cx, h - m.b + 25, 'K' + r.Harmonic, sel ? 'kbtn on' : 'kbtn', 'text-anchor="middle"') +
        T(cx, h - m.b + 48, fmt(share(r), 1) + '%', sel ? 'ax b' : 'ax', 'text-anchor="middle"') + '</g>';
    });
    host.innerHTML = svg(w, h, 'Amplitude spectrum. The 24-hour harmonic has 996.88 MW amplitude and 86.80% of hourly variation; the next largest is 304.48 MW.', b);
    host.querySelectorAll('[data-k]').forEach(g => {
      g.addEventListener('click', () => setHarmonic(+g.dataset.k));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHarmonic(+g.dataset.k); } });
    });
  });
  const crest = r => { const wk = 2 * Math.PI * r.Harmonic / 24; let t = (-r.Phase_rad / wk) % r.Period_h; if (t < 0) t += r.Period_h; return t; };
  const waveChart = mount('wave-chart', (host, w) => {
    const narrow = w < 420, m = { l: narrow ? 50 : 58, r: 12, t: 24, b: 28 }, h = narrow ? 210 : 240;
    const r = D.harmonics[hs.k - 1], k1 = D.harmonics[0];
    const x = t => m.l + (w - m.l - m.r) * t / 24, y = v => m.t + (h - m.t - m.b) * (1000 - v) / 2000;
    let b = T(0, 13, 'Contribution to load (MW)', 'at') + R(m.l, m.t, w - m.l - m.r, h - m.t - m.b, C.faint);
    [-1000, -500, 0, 500, 1000].forEach(v => { b += L(m.l, y(v), w - m.r, y(v), v ? C.grid : C.axis, v ? 1 : 1.2) + T(m.l - 8, y(v) + 4, v ? signed(v, 0) : '0', 'ax', 'text-anchor="end"'); });
    [0, 6, 12, 18, 24].forEach(t => { b += T(t === 24 ? w - 1 : x(t), h - m.b + 17, t === 24 ? '24:00' : hour(t), 'ax', `text-anchor="${t === 24 ? 'end' : 'middle'}"`); });
    const curve = row => { const p = []; for (let s = 0; s <= 240; s++) p.push([x(s / 10), y(term(row, s / 10))]); return p; };
    if (hs.k !== 1) b += poly(curve(k1), C.slate, 1.3, '4 4');
    const cv = curve(r);
    b += `<defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.fourier}" stop-opacity=".22"/><stop offset=".5" stop-color="${C.fourier}" stop-opacity="0"/><stop offset="1" stop-color="${C.direct}" stop-opacity=".12"/></linearGradient></defs>` +
      `<path d="M${x(0)} ${y(0)} ${cv.map(p => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')} L${x(24)} ${y(0)} Z" fill="url(#gW)"/>` + poly(cv, C.fourier, 2.8);
    const tc = crest(r);
    b += `<circle cx="${x(tc)}" cy="${y(r.Amplitude_MW)}" r="4.5" fill="${C.fourier}"/>` + L(x(tc), y(r.Amplitude_MW), x(tc), y(0), C.fourier, 1, '2 3') +
      (r.Amplitude_MW > 250 ? T(x(tc) + (x(tc) - 80 < m.l ? 6 : -6), (y(r.Amplitude_MW) + y(0)) / 2 + 4, 'crest ' + hour(tc), 'callout sm', x(tc) - 80 < m.l ? '' : 'text-anchor="end"')
        : T(Math.min(x(tc), w - m.r - 40), y(r.Amplitude_MW) - 9, 'crest ' + hour(tc), 'callout sm', 'text-anchor="middle"'));
    if (hs.k !== 1) b += T(w - m.r - 4, m.t + 14, 'dashed: K1 for scale', 'ax sm', 'text-anchor="end"');
    host.innerHTML = svg(w, h, 'Harmonic ' + r.Harmonic + ' over 24 hours: amplitude ' + fmt(r.Amplitude_MW) + ' MW, period ' + fmt(r.Period_h, 2) + ' h.', b);
  });
  function harmonicStats() {
    const r = D.harmonics[hs.k - 1];
    el('harmonic-stats').innerHTML = stat('Harmonic', 'K' + r.Harmonic, 'hl') + stat('Amplitude <span class="lc">A</span>', fmt(r.Amplitude_MW) + '<small> MW</small>') + stat('Period', fmt(r.Period_h, 2) + '<small> h</small>') +
      stat('Phase <span class="lc">φ</span>', signed(r.Phase_deg) + '°') + stat('Cosine <span class="lc">a</span>', signed(r.a_k_MW) + '<small> MW</small>') + stat('Sine <span class="lc">b</span>', signed(r.b_k_MW) + '<small> MW</small>') + stat('Share of variation', pct(share(r)));
    el('wave-caption').textContent = 'K' + r.Harmonic + ' over one day: amplitude ' + fmt(r.Amplitude_MW) + ' MW, period ' + fmt(r.Period_h, 2) + ' h, phase ' + signed(r.Phase_deg) + '°, first crest at ' + hour(crest(r)) + '. Fixed ±1,000 MW axis for every harmonic' + (hs.k !== 1 ? '; the 24-hour wave is dashed for scale.' : '.');
  }
  function coefChart(host, w, o) {
    const narrow = w < 420, m = { l: narrow ? 74 : 84, r: narrow ? 70 : 80, t: 40, b: 28 }, rowH = 30, h = m.t + 7 * rowH + m.b;
    const [d0, d1] = o.domain, x = v => m.l + (w - m.l - m.r) * (v - d0) / (d1 - d0);
    let b = T(0, 15, o.title, 'ct') + T(0, 31, o.sub, 'cs') + R(m.l, m.t, w - m.l - m.r, 7 * rowH, C.faint);
    o.ticks.forEach(v => { b += L(x(v), m.t, x(v), m.t + 7 * rowH, v === 0 ? C.axis : C.grid, v === 0 ? 1.2 : 1) + T(x(v), h - m.b + 16, o.tickFmt(v), 'ax', 'text-anchor="middle"'); });
    D.harmonics.forEach((r, i) => {
      const cy = m.t + i * rowH + rowH / 2, v = r[o.key], sel = r.Harmonic === hs.k;
      const col = o.dots ? (sel ? C.fourier : C.slate) : v < 0 ? C.direct : C.fourier;
      const z = o.dots ? d0 : 0;
      b += `<g class="hit" data-k="${r.Harmonic}" tabindex="0" role="button" aria-label="Harmonic ${r.Harmonic}: ${o.title} ${o.fmt(v)}">` +
        R(0, cy - rowH / 2 + 1, w, rowH - 2, sel ? '#fcebdc' : 'transparent') +
        T(4, cy + 4, 'K' + r.Harmonic, sel ? 'rl b' : 'rl') + T(32, cy + 4, fmt(r.Period_h, r.Period_h % 1 ? 1 : 0) + ' h', 'ax') +
        (o.dots ? L(x(z), cy, x(v), cy, col, 1.5) + `<circle cx="${x(v)}" cy="${cy}" r="${sel ? 6 : 4.5}" fill="${col}"/>`
                : R(Math.min(x(0), x(v)), cy - 7, Math.abs(x(v) - x(0)), 14, col, `rx="0"${sel ? '' : ' opacity=".75"'}`)) +
        T(w - 2, cy + 4, o.fmt(v), sel ? 'rv b' : 'rv', 'text-anchor="end"') + '</g>';
    });
    host.innerHTML = svg(w, h, o.title + ' for harmonics K1 to K7', b);
    host.querySelectorAll('[data-k]').forEach(g => {
      g.addEventListener('click', () => setHarmonic(+g.dataset.k));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHarmonic(+g.dataset.k); } });
    });
  }
  const coefCharts = [
    mount('coef-period', (host, w) => coefChart(host, w, { title: 'Period', sub: 'Hours per cycle (24 h ÷ k)', key: 'Period_h', dots: true, domain: [0, 24], ticks: [0, 6, 12, 18, 24], tickFmt: v => v + ' h', fmt: v => fmt(v, 2) + ' h' })),
    mount('coef-phase', (host, w) => coefChart(host, w, { title: 'Phase φ', sub: 'Each term written as A cos(ωt + φ)', key: 'Phase_deg', domain: [-180, 180], ticks: [-180, -90, 0, 90, 180], tickFmt: v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°', fmt: v => signed(v, 1) + '°' })),
    mount('coef-a', (host, w) => coefChart(host, w, { title: 'Cosine coefficient a', sub: 'Weight of the cosine term (MW)', key: 'a_k_MW', domain: [-900, 900], ticks: [-900, -450, 0, 450, 900], tickFmt: v => v ? signed(v, 0) : '0', fmt: v => signed(v, 1) })),
    mount('coef-b', (host, w) => coefChart(host, w, { title: 'Sine coefficient b', sub: 'Weight of the sine term (MW)', key: 'b_k_MW', domain: [-900, 900], ticks: [-900, -450, 0, 450, 900], tickFmt: v => v ? signed(v, 0) : '0', fmt: v => signed(v, 1) }))
  ];
  function setHarmonic(k) { hs.k = k; harmonicStats(); spectrumChart.render(); waveChart.render(); coefCharts.forEach(c => c && c.render()); }
  el('harmonics-intro').textContent = 'The 24-hour component alone explains ' + pct(share(D.harmonics[0])) + ' of the hourly variation. Its amplitude is more than three times the next harmonic’s. Select a harmonic to see its wave.';
  harmonicStats();

  /* ===================================================================
     4 · NOISE AUDIT
     =================================================================== */
  const ns = { level: 3 };
  const noiseStyle = {
    'Direct': { color: C.direct, name: 'Peak shaving only' }, 'Fourier K5': { color: C.fourier, name: 'Proposed (K5)', marker: 'dot' },
    'Fourier K3': { color: C.tealSoft, name: 'Fourier K3' }, 'Moving Average 3h': { color: C.slate, name: 'Moving avg 3 h', dash: '5 3' },
    'Moving Average 5h': { color: C.slate, name: 'Moving avg 5 h', dash: '1.5 3' }
  };
  const order = ['Direct', 'Fourier K5', 'Fourier K3', 'Moving Average 3h', 'Moving Average 5h'];
  const auditRows = () => order.map(n => D.audit.find(r => r.Noise_pct === ns.level && r.Method === n));
  const outcomeChart = mount('outcome-chart', (host, w) => {
    const narrow = w < 480, rows = auditRows().slice(1), labelW = narrow ? 126 : 150, m = { l: labelW, r: 8, t: 50, b: 10 }, rowH = 38, h = m.t + rows.length * rowH + m.b;
    const x = n => m.l + (w - m.l - m.r) * n / 200;
    let b = T(0, 15, 'Outcome vs peak shaving only (of 200 trials)', 'ct');
    const leg = [['Better', C.fourier], ['Tie', C.tie], ['Shaving only better', C.direct]];
    let lx = 0; leg.forEach(([t, c]) => { b += R(lx, 26, 12, 12, c) + T(lx + 16, 36, t, 'lg'); lx += 16 + t.length * 6.6 + 14; });
    rows.forEach((r, i) => {
      const cy = m.t + i * rowH + rowH / 2, st = noiseStyle[r.Method];
      b += `<g transform="translate(0 ${cy - 5})">${swatchRaw({ ...st, width: 2.4 })}</g>` + T(32, cy + 4, st.name, r.Method === 'Fourier K5' ? 'rl b' : 'rl');
      let x0 = 0;
      [[r.Wins_vs_Direct_n, C.fourier, '#fff'], [r.Ties_vs_Direct_n, C.tie, C.navy], [r.Losses_vs_Direct_n, C.direct, '#fff']].forEach(([n, c, tc]) => {
        if (n > 0) { b += R(x(x0), cy - 11, x(x0 + n) - x(x0) - 1, 22, c); if (x(x0 + n) - x(x0) > 16) b += T((x(x0) + x(x0 + n)) / 2, cy + 4, n, 'seg', `text-anchor="middle" fill="${tc}"`); }
        x0 += n;
      });
      if (r.Losses_vs_Direct_n > 0 && x(200) - x(200 - r.Losses_vs_Direct_n) <= 16) b += T(w - 2, cy - 14, r.Losses_vs_Direct_n + ' shaving only better', 'ax sm', 'text-anchor="end"');
      if (r.Wins_vs_Direct_n > 0 && x(r.Wins_vs_Direct_n) - x(0) <= 16) b += T(x(0) + 2, cy - 14, r.Wins_vs_Direct_n + ' better', 'ax sm');
    });
    host.innerHTML = svg(w, h, 'Paired outcomes against Direct at ' + ns.level + '% noise', b);
  });
  const spreadChart = mount('spread-chart', (host, w) => {
    const narrow = w < 480, rows = auditRows(), labelW = narrow ? 126 : 140, m = { l: labelW, r: narrow ? 50 : 60, t: 50, b: 30 }, rowH = 34, h = m.t + rows.length * rowH + m.b;
    const x = v => m.l + (w - m.l - m.r) * (v - 1.5) / 2;
    let b = T(0, 15, 'Peak reduction under noise (%)', 'ct') + T(0, 36, 'Axis starts at 1.5%', 'cs');
    b += R(m.l, m.t, w - m.l - m.r, rows.length * rowH, C.faint);
    [1.5, 2, 2.5, 3, 3.5].forEach(v => { b += L(x(v), m.t, x(v), m.t + rows.length * rowH, C.grid) + T(x(v), h - m.b + 16, fmt(v, 1) + '%', 'ax', 'text-anchor="middle"'); });
    const ref = series[2].row.Peak_Reduction_pct;
    b += L(x(ref), m.t - 4, x(ref), m.t + rows.length * rowH, C.navy, 1, '4 3') + T(x(ref), m.t - 8, 'no noise ' + pct(ref), 'ax sm', 'text-anchor="middle"');
    rows.forEach((r, i) => {
      const cy = m.t + i * rowH + rowH / 2, st = noiseStyle[r.Method];
      b += `<g transform="translate(0 ${cy - 5})">${swatchRaw({ ...st, width: 2.4 })}</g>` + T(32, cy + 4, st.name, r.Method === 'Fourier K5' || r.Method === 'Direct' ? 'rl b' : 'rl');
      b += L(x(r.FifthPercentile_pct), cy, x(r.Mean_PeakReduction_pct), cy, st.color, 2.5) +
        `<circle cx="${x(r.FifthPercentile_pct)}" cy="${cy}" r="5.5" fill="#fff" stroke="${st.color}" stroke-width="2"><title>5th percentile ${pct(r.FifthPercentile_pct)}</title></circle>` +
        `<circle cx="${x(r.Mean_PeakReduction_pct)}" cy="${cy}" r="5.5" fill="${st.color}"><title>Mean ${pct(r.Mean_PeakReduction_pct)}</title></circle>` +
        T(w - 2, cy + 4, pct(r.Mean_PeakReduction_pct), 'rv', 'text-anchor="end"');
    });
    host.innerHTML = svg(w, h, 'Mean and 5th-percentile peak reduction at ' + ns.level + '% noise', b);
  });
  function noiseCallout() {
    const rows = auditRows(), d = rows[0], k = rows[1];
    el('noise-callout').innerHTML = ns.level === 3
      ? `At 3% synthetic noise, Fourier K5 averaged <strong>${pct(k.Mean_PeakReduction_pct)}</strong> peak reduction vs <strong>${pct(d.Mean_PeakReduction_pct)}</strong> for peak shaving only. It did better in ${k.Wins_vs_Direct_n} trials, tied in ${k.Ties_vs_Direct_n} and did worse in ${k.Losses_vs_Direct_n} of 200. Its 5th-percentile trial reached ${pct(k.FifthPercentile_pct)}, vs ${pct(d.FifthPercentile_pct)} for peak shaving only, so its low end is also higher. Fourier K3 averaged slightly more, ${pct(rows[2].Mean_PeakReduction_pct)}, and the 3 h and 5 h moving averages reached ${pct(rows[3].Mean_PeakReduction_pct)} and ${pct(rows[4].Mean_PeakReduction_pct)}: the gain comes from smoothing the noisy input before scheduling, not from the Fourier form alone. Fourier’s added value is an interpretable model of the daily cycle (amplitude and phase).`
      : `At 1% synthetic noise, every method stays at about the noise-free ${pct(series[2].row.Peak_Reduction_pct)}. Peak shaving only averaged ${pct(d.Mean_PeakReduction_pct)} and Fourier K5 ${pct(k.Mean_PeakReduction_pct)}, with ${k.Ties_vs_Direct_n} ties in 200 trials. At this noise level the methods are effectively tied.`;
  }
  el('noise-choices').innerHTML = [1, 3].map(v => `<button type="button" data-v="${v}" aria-pressed="${v === ns.level}">${v}% synthetic noise</button>`).join('');
  el('noise-choices').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; ns.level = +b.dataset.v;
    [...el('noise-choices').children].forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    noiseCallout(); outcomeChart.render(); spreadChart.render();
  });
  noiseCallout();

  /* ===================================================================
     5 · HOURLY DEMAND CONTROL
     =================================================================== */
  const rs = { key: 'fourier', hour: peakHour };
  const rec = () => D.demandReport.filter(r => r.Method === reportName[rs.key]);
  const reportChart = mount('report-chart', (host, w) => {
    const narrow = w < 560, m = { l: narrow ? 48 : 58, r: 12, t: narrow ? 54 : 38, b: 52 }, h = narrow ? 300 : 344;
    const { x, y, g } = hourFrame(w, h, m, -500, 500, 250, v => v ? signed(v, 0) : '0', true);
    const recs = rec(), bw = Math.max(5, Math.min(22, (w - m.l - m.r) / 24 * 0.62));
    let b = T(m.l - (narrow ? 40 : 50), 13, 'Change from baseline (MW)', 'at') + g;
    b += L(m.l, y(hourlyLimit), w - m.r, y(hourlyLimit), C.slate, 1, '2 3') + L(m.l, y(-hourlyLimit), w - m.r, y(-hourlyLimit), C.slate, 1, '2 3') +
      T(w - m.r - 4, y(hourlyLimit) - 5, 'hourly limit ±' + fmt(hourlyLimit) + ' MW', 'ax sm', 'text-anchor="end"');
    recs.forEach((r, i) => {
      const d = r.Change_MW, sel = i === rs.hour;
      if (Math.abs(d) > 0.005) b += R(x(i) - bw / 2, Math.min(y(0), y(d)), bw, Math.abs(y(d) - y(0)), d < 0 ? C.removed : C.returned, `rx="0"${sel ? ` stroke="${C.navy}" stroke-width="1.5"` : ''}`);
    });
    b += L(m.l, y(0), w - m.r, y(0), C.navy, 1.4);
    const lg = narrow ? [['Removed', C.removed], ['Returned', C.returned]] : [['Load removed', C.removed], ['Load returned', C.returned]];
    let lx = narrow ? 0 : w - m.r - 318; const ly = narrow ? 22 : 4; lg.forEach(([t, c]) => { b += R(lx, ly, 11, 11, c) + T(lx + 15, ly + 10, t, 'lg'); lx += narrow ? 82 : 108; });
    b += `<defs><linearGradient id="gH" x1="0" x2="1"><stop offset="0" stop-color="${HEAT[0]}"/><stop offset=".5" stop-color="${HEAT[2]}"/><stop offset="1" stop-color="${HEAT[5]}"/></linearGradient></defs>` + R(lx, ly, 18, 11, 'url(#gH)', 'rx="0"') + T(lx + 22, ly + 10, 'Baseline load', 'lg');
    const cw = (w - m.l - m.r) / 24;
    base.forEach((v, i) => { b += R(x(i) - cw / 2 + 1, h - m.b + 5, cw - 2, 14, heat(v), `rx="0"${i === rs.hour ? ` stroke="${C.navy}" stroke-width="1.5"` : ''}`); });
    b += hourTicks(w, h, { ...m, b: 28 }, x, rs.hour) + L(x(rs.hour), m.t, x(rs.hour), h - 28, C.navy, 1, '3 3');
    host.innerHTML = svg(w, h, 'Hourly change from baseline for ' + reportName[rs.key], b);
    scrub(host, x(0), x(23), setReportHour);
  });
  function reportReadout() {
    const r = rec()[rs.hour], d = r.Change_MW, s = series.find(s => s.key === rs.key);
    el('report-readout').innerHTML = `<p class="ro-k">${esc(s.name)} · selected hour</p><p class="ro-time">${hour(rs.hour)}</p><ul class="ro-list">` +
      `<li style="--c:${C.slate}"><span class="nm">Baseline</span><span class="v">${fmt(r.Baseline_MW)}<small> MW</small></span></li>` +
      `<li style="--c:${s.color}"><span class="nm">Controlled</span><span class="v">${fmt(r.ControlledLoad_MW)}<small> MW</small></span></li>` +
      `<li style="--c:${Math.abs(d) < 0.005 ? C.tie : d < 0 ? C.removed : C.returned}"><span class="nm">${Math.abs(d) < 0.005 ? 'No change' : d < 0 ? 'Load removed' : 'Load returned'}</span><span class="v">${signed(d)}<small> MW</small></span></li></ul>`;
    el('report-hour').value = rs.hour; el('report-hour').setAttribute('aria-valuetext', hour(rs.hour));
  }
  function reportStats() {
    const sm = D.demandSummary.find(r => r.Method === reportName[rs.key]);
    el('report-stats').innerHTML = stat('Hours with load removed', sm.HoursReduced + '<small> h</small>') + stat('Hours with load returned', sm.HoursAdded + '<small> h</small>') +
      stat('Largest hourly reduction', fmt(sm.MaxReduction_MW) + '<small> MW</small>') + stat('Energy shifted', fmt(sm.EnergyShifted_MWh) + '<small> MWh</small>', 'hl');
  }
  function setReportHour(t) { if (t === rs.hour) return; rs.hour = t; reportChart.render(); reportReadout(); meterChart.render(); el('meter-hour').value = t; el('meter-hour').setAttribute('aria-valuetext', hour(t)); }
  const meterChart = mount('meter-chart', (host, w) => {
    const narrow = w < 420, h = narrow ? 250 : 270, p = narrow ? 16 : 22, t = rs.hour, s = series.find(x => x.key === rs.key);
    const win = t <= 5 ? ['Fixed-time receiving hours', C.returned] : t >= 12 && t <= 17 ? ['Fixed-time donor hours', C.removed] : ['Outside fixed-time windows', '#8c8178'];
    let b = R(0, 0, w, h, '#1c1411', 'rx="0"');
    b += T(p, 26, 'SASG26 · METER VIEW', 'm-k') + (() => { const lab = narrow ? win[0].replace('Fixed-time ', '') : win[0]; return `<circle cx="${w - p - lab.length * 7.6 - 10}" cy="22" r="4" fill="${win[1]}"/>` + T(w - p, 26, lab, 'm-k', 'text-anchor="end"'); })();
    b += T(p, 58, 'HOUR', 'm-s') + T(p, 98, hour(t), 'm-big', `style="font-size:${w < 360 ? 22 : 30}px"`);
    const vx = narrow ? w * 0.44 : w * 0.42;
    b += T(vx, 58, 'REGIONAL TOTAL LOAD', 'm-s') + `<text x="${vx}" y="98" class="m-big" style="font-size:${w < 360 ? 22 : 30}px">${fmt(base[t], 1)}<tspan class="m-u"> MW</tspan></text>`;
    const d = s.values[t] - base[t];
    b += T(narrow ? p : vx, narrow ? 124 : 120, s.name + ': ' + fmt(s.values[t], 1) + ' MW' + (Math.abs(d) > 0.005 ? ' (' + signed(d, 1) + ')' : ''), 'm-s2');
    const top = narrow ? 142 : 138, bot = h - 30, bw = (w - 2 * p) / 24, yv = v => bot - (bot - top) * (v - 11000) / 3500;
    base.forEach((v, i) => {
      const c = i <= 5 ? C.returned : i >= 12 && i <= 17 ? (i === t ? C.fourier : '#a3341b') : '#4a3a33';
      b += R(p + i * bw + 1.5, yv(v), bw - 3, bot - yv(v), i === t ? (i <= 5 || (i >= 12 && i <= 17) ? c : '#d6c4b4') : c, `rx="0"${i === t ? ' stroke="#fff4e6" stroke-width="2"' : ' opacity=".9"'}`);
    });
    [0, 6, 12, 18].forEach(i => { b += T(p + i * bw, h - 10, hour(i), 'm-s'); });
    host.innerHTML = svg(w, h, 'Meter-style display for ' + hour(t) + ': ' + fmt(base[t]) + ' MW regional total load', b);
    scrub(host, p + bw / 2, w - p - bw / 2, setReportHour);
  });
  el('meter-hour').addEventListener('input', e => setReportHour(+e.target.value));
  el('report-methods').innerHTML = series.slice(1).map(s => `<button type="button" data-key="${s.key}" aria-pressed="${s.key === rs.key}" style="--c:${s.color}">${swatch(s)}${esc(s.name)}</button>`).join('');
  el('report-methods').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; rs.key = b.dataset.key;
    [...el('report-methods').children].forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    reportStats(); reportChart.render(); reportReadout(); meterChart.render();
  });
  el('report-hour').addEventListener('input', e => setReportHour(+e.target.value));
  reportStats(); reportReadout();

  /* ===================================================================
     6 · TASK 5 PEAK CAP
     =================================================================== */
  const cs = { cap: 13200 };
  const capChart = mount('cap-chart', (host, w) => {
    const narrow = w < 560, m = { l: narrow ? 48 : 58, r: 12, t: narrow ? 58 : 38, b: 28 }, h = narrow ? 300 : 360;
    const res = capScenario(cs.cap), all = [...D.capBaseline, ...res.values, cs.cap];
    const lo = Math.floor(Math.min(...all) / 500) * 500, hi = Math.ceil(Math.max(...all) / 500) * 500;
    const { x, y, g } = hourFrame(w, h, m, lo, hi, 500);
    let b = T(m.l - (narrow ? 40 : 50), 13, 'Task 5 load (MW)', 'at') + g;
    const inp = D.capBaseline;
    for (let i = 0; i < 23; i++) {
      const j = i + 1, d0 = res.values[i] - inp[i], d1 = res.values[j] - inp[j];
      const quad = (pts, d) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${d < 0 ? C.removed : C.returned}" fill-opacity=".28"/>`;
      if (d0 * d1 < 0) { const f = d0 / (d0 - d1), cx = x(i) + (x(j) - x(i)) * f, cy = y(inp[i] + (inp[j] - inp[i]) * f);
        b += quad([[x(i), y(inp[i])], [cx, cy], [x(i), y(res.values[i])]], d0) + quad([[cx, cy], [x(j), y(inp[j])], [x(j), y(res.values[j])]], d1);
      } else if (Math.abs(d0) > 0.01 || Math.abs(d1) > 0.01) b += quad([[x(i), y(inp[i])], [x(j), y(inp[j])], [x(j), y(res.values[j])], [x(i), y(res.values[i])]], d0 || d1);
    }
    b += L(m.l, y(cs.cap), w - m.r, y(cs.cap), C.cap, 1.6, '7 4') + T(w - m.r - 4, y(cs.cap) - 6, 'Target ' + fmt(cs.cap, 0) + ' MW', 'callout sm', `text-anchor="end" fill="${C.cap}"`);
    b += poly(inp.map((v, i) => [x(i), y(v)]), C.slate, 2, '2 4') + inp.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="#fff" stroke="${C.slate}" stroke-width="1.4"/>`).join('');
    b += poly(res.values.map((v, i) => [x(i), y(v)]), C.navy, 2.6);
    if (res.after > cs.cap + 0.005) b += `<circle cx="${x(res.afterHour)}" cy="${y(res.after)}" r="5" fill="#fff" stroke="${C.navy}" stroke-width="2.4"/>`;
    const lg = [['Task 5 input', C.slate, '2 4'], ['After redistribution', C.navy, '']];
    let lx = narrow ? 0 : w - m.r - 310; const ly = narrow ? 33 : 9; lg.forEach(([t, c, d]) => { b += L(lx, ly, lx + 22, ly, c, 2.4, d) + T(lx + 27, ly + 4, t, 'lg'); lx += narrow ? 110 : 138; });
    if (!narrow) { b += R(m.l + 140, 3, 11, 11, C.removed, 'fill-opacity=".45"') + T(m.l + 155, 13, 'Removed', 'lg') + R(m.l + 220, 3, 11, 11, C.returned, 'fill-opacity=".45"') + T(m.l + 235, 13, 'Added', 'lg'); }
    let xt = L(m.l, h - m.b, w - m.r, h - m.b, C.axis); const step = w < 520 ? 6 : 3;
    for (let t = 0; t <= 23; t += step) xt += T(x(t), h - m.b + 17, hour(t), 'ax', 'text-anchor="middle"');
    host.innerHTML = svg(w, h, 'Task 5 input and redistributed load for a ' + fmt(cs.cap, 0) + ' MW target', b + xt);
  });
  function capStats() {
    const r = capScenario(cs.cap);
    el('cap-stats').innerHTML = stat('Target', fmt(cs.cap, 0) + '<small> MW</small>') + stat('Input peak', fmt(r.before) + '<small> MW</small>') +
      stat('Resulting peak', fmt(r.after) + '<small> MW' + (r.after > cs.cap + 0.005 ? ' at ' + hour(r.afterHour) : '') + '</small>', 'hl') + stat('Peak reduction', pct(r.reduction)) + stat('Energy shifted', fmt(r.shifted) + '<small> MWh</small>');
    el('cap-value').textContent = fmt(cs.cap, 0) + ' MW'; el('cap').value = cs.cap;
    const preset = D.presets.find(p => p.PeakCap_MW === cs.cap);
    el('cap-caption').textContent = (r.after > cs.cap + 0.005
      ? 'At this target the night hours receive so much load that the new peak, ' + fmt(r.after) + ' MW at ' + hour(r.afterHour) + ', is above the target. '
      : 'The resulting peak equals the target. ') +
      'Daily energy is unchanged (difference ' + fmt(Math.abs(r.diff)) + ' MWh).' + (preset ? ' This is the saved ' + preset.Scenario.replace(/ \(.*/, '') + '.' : '');
    [...el('cap-choices').children].forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.v === cs.cap)));
  }
  el('cap-choices').innerHTML = D.presets.map(p => `<button type="button" data-v="${p.PeakCap_MW}">${fmt(p.PeakCap_MW, 0)} MW</button>`).join('');
  el('cap-choices').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cs.cap = +b.dataset.v; capStats(); capChart.render(); });
  el('cap').addEventListener('input', e => { cs.cap = +e.target.value; capStats(); capChart.render(); });
  capStats();
})();

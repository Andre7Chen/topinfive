/* ============================================================
   五女一 FIVE GIRLS ONE — 逻辑层
   ============================================================ */
(() => {
  const { GROUPS, MEMBERS, SONGS, TIMELINE, SOURCES, METHOD } = window.DATA;
  const PV = window.PV || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => n.toLocaleString('en-US');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------- 状态 ---------------- */
  const DIMS = [
    { key: 'brand', label: '韩国声量', w: 30 },
    { key: 'attention', label: '关注度', w: 20 },
    { key: 'fandom', label: '粉丝规模', w: 25 },
    { key: 'commerce', label: '商业价值', w: 15 },
    { key: 'works', label: '作品活动', w: 10 }
  ];
  const PRESETS = {
    balanced: { name: '均衡（基准）', w: { brand: 30, attention: 20, fandom: 25, commerce: 15, works: 10 } },
    kr: { name: '韩国本土', w: { brand: 45, attention: 15, fandom: 10, commerce: 20, works: 10 } },
    global: { name: '全球饭圈', w: { brand: 15, attention: 25, fandom: 40, commerce: 10, works: 10 } },
    works: { name: '只看作品', w: { brand: 10, attention: 5, fandom: 5, commerce: 20, works: 60 } }
  };
  const state = {
    weights: { ...PRESETS.balanced.w },
    preset: 'balanced',
    tab: 'ive',
    votes: {},
    quizStep: 0,
    quizTraits: {}
  };

  try { state.votes = JSON.parse(localStorage.getItem('wg1_votes') || '{}'); } catch { state.votes = {}; }

  /* ---------------- 画像 ---------------- */
  const TRAITS = {
    wy: ['visual', 'stage'], yj: ['variety', 'charm'], rei: ['variety', 'charm'],
    liz: ['vocal', 'charm'], ls: ['stage', 'charm'], gl: ['charm', 'stage'],
    kr: ['visual', 'stage'], wn: ['vocal', 'charm'], nn: ['vocal', 'visual'], gs: ['global', 'art'],
    yq: ['variety', 'global'], mn: ['art', 'vocal'], sh: ['charm', 'variety'],
    my: ['visual', 'vocal'], sy: ['art', 'stage'],
    sk: ['veteran', 'global'], hu: ['art', 'vocal'], cw: ['stage', 'veteran'],
    kz: ['stage', 'charm'], ec: ['variety', 'charm'],
    mj: ['visual', 'charm'], hn: ['global', 'variety'], hr: ['visual', 'charm'], hy: ['visual', 'stage']
  };

  /* ---------------- 评分 ---------------- */
  function rawMap() {
    const out = {};
    MEMBERS.forEach((m) => {
      const p = PV[m.id];
      out[m.id] = {
        brand: m.brand ? m.brand : null,
        attention: p && p.total ? p.total : null,
        fandom: m.ig ? m.ig * 1e6 : null,
        commerce: m.commerce,
        works: m.works
      };
    });
    return out;
  }
  const RAW = rawMap();

  function brandScore(m) {
    if (m.brand) return clamp(100 - 12 * Math.log(m.brand), 35, 100);
    return 42 + Math.min(3, m.brandPrev || 0) * 3;
  }

  function logScale(key, floor = 6) {
    const vals = MEMBERS.map((m) => RAW[m.id][key]).filter((v) => v != null && v > 0);
    if (!vals.length) return () => null;
    const lo = Math.log10(Math.min(...vals));
    const hi = Math.log10(Math.max(...vals));
    return (v) => (v == null ? null : clamp(((Math.log10(v) - lo) / (hi - lo || 1)) * 100, floor, 100));
  }
  function linScale(key, min, max, floor = 12) {
    return (v) => (v == null ? null : clamp(floor + ((v - min) / (max - min || 1)) * (100 - floor), floor, 100));
  }  const sAttention = logScale('attention');
  const sFandom = logScale('fandom');
  // 计数型指标用幂律压缩：避免「多一个代言」被放大成 20 分
  const sCommerce = (v) => (v == null ? null : 100 * Math.pow(v / 7, 0.65));
  const sWorks = (v) => (v == null ? null : 100 * Math.pow(v / 8, 0.65));

  function subscores(m) {
    const r = RAW[m.id];
    return {
      brand: brandScore(m),
      attention: sAttention(r.attention),
      fandom: sFandom(r.fandom),
      commerce: sCommerce(r.commerce),
      works: sWorks(r.works)
    };
  }

  function compute(weights = state.weights) {
    const list = MEMBERS.map((m) => {
      const s = subscores(m);
      let sum = 0, wsum = 0;
      DIMS.forEach((d) => {
        const v = s[d.key];
        if (v == null) return;
        sum += v * weights[d.key];
        wsum += weights[d.key];
      });
      return { m, s, score: wsum ? sum / wsum : 0, missing: s.fandom == null };
    });
    list.sort((a, b) => b.score - a.score);
    list.forEach((x, i) => (x.rank = i + 1));
    return list;
  }

  let BOARD = compute();

  /* ---------------- 工具 ---------------- */
  const groupOf = (m) => GROUPS[m.group];
  const img = (id) => `assets/m/${id}.jpg`;
  const pct = (v) => (v == null ? '—' : v.toFixed(1));

  function personHTML(id, cls = '') {
    const m = MEMBERS.find((x) => x.id === id);
    const c = m ? groupOf(m).color : '#888';
    return `<span class="pic ${cls}" style="background:radial-gradient(circle at 50% 30%,${c}33,#12121a 72%)"><img src="${img(id)}" alt="" loading="lazy" onerror="this.style.display='none'"></span>`;
  }

  /* ---------------- HERO ---------------- */
  function renderHero() {
    const top = BOARD[0];
    $('#heroFacts').innerHTML = [
      ['参与统计', '24 位成员'],
      ['当前第一', `${top.m.name} · ${top.score.toFixed(1)}`],
      ['数据快照', '2026.11.18']
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

    const names = BOARD.map((x) => `<span>${x.m.name} · ${groupOf(x.m).name}</span>`).join('');
    $('#ticker').innerHTML = names + names;
  }

  /* ---------------- 方法论 ---------------- */
  function renderMethod() {
    $('#metricList').innerHTML = METHOD.map((m, i) => `
      <div class="metric" data-i="${i}">
        <div class="metric-head">
          <span class="metric-w" data-w="${m.key}">${m.w}%</span>
          <span class="metric-name">${m.name}</span>
          <span class="metric-unit">${m.unit}</span>
        </div>
        <div class="metric-body">
          <span class="k">怎么取数</span>
          <p>${m.desc}</p>
          <span class="k">为什么用它</span>
          <p>${m.why}</p>
          <div class="note">${m.note}</div>
        </div>
      </div>`).join('');

    $$('#metricList .metric').forEach((el) => {
      el.addEventListener('click', () => el.classList.toggle('open'));
    });

    $('#presets').innerHTML = Object.entries(PRESETS)
      .map(([k, p]) => `<button class="preset${k === state.preset ? ' on' : ''}" data-preset="${k}">${p.name}</button>`).join('');

    $('#sliders').innerHTML = DIMS.map((d) => `
      <div class="slider-row">
        <div class="slider-top"><label for="s_${d.key}">${d.label}</label><output id="o_${d.key}">${state.weights[d.key]}%</output></div>
        <input type="range" id="s_${d.key}" min="0" max="60" step="1" value="${state.weights[d.key]}" data-k="${d.key}">
      </div>`).join('');

    $('#sliders').addEventListener('input', (e) => {
      const k = e.target.dataset.k;
      if (!k) return;
      state.weights[k] = +e.target.value;
      state.preset = null;
      $$('#presets .preset').forEach((b) => b.classList.remove('on'));
      updateWeights();
      refresh();
    });

    $('#presets').addEventListener('click', (e) => {
      const b = e.target.closest('[data-preset]');
      if (!b) return;
      const key = b.dataset.preset;
      state.preset = key;
      state.weights = { ...PRESETS[key].w };
      $$('#presets .preset').forEach((x) => x.classList.toggle('on', x === b));
      DIMS.forEach((d) => { const el = $(`#s_${d.key}`); if (el) el.value = state.weights[d.key]; });
      updateWeights();
      refresh();
    });

    updateWeights();
  }

  function updateWeights() {
    const total = DIMS.reduce((s, d) => s + state.weights[d.key], 0) || 1;
    DIMS.forEach((d) => {
      const el = $(`#o_${d.key}`);
      if (el) el.textContent = Math.round((state.weights[d.key] / total) * 100) + '%';
      const mw = $(`#metricList [data-w="${d.key}"]`);
      if (mw) mw.textContent = Math.round((state.weights[d.key] / total) * 100) + '%';
    });
    $('#weightFoot').innerHTML = state.preset
      ? `当前使用 <b>${PRESETS[state.preset].name}</b> 预设。分数 = Σ(维度分 × 权重) ÷ Σ权重，缺失维度自动剔除并重新分配权重。`
      : `自定义权重中。总分已按当前权重重新归一，缺失维度（如 NewJeans 无个人 IG）自动剔除。`;
  }

  /* ---------------- 总榜 ---------------- */
  function renderBoard(animate = false) {
    const old = new Map();
    if (animate) $$('.rank-row').forEach((el) => old.set(el.dataset.id, el.getBoundingClientRect().top));

    const top3 = BOARD.slice(0, 3);
    $('#podium').innerHTML = [top3[1], top3[0], top3[2]].filter(Boolean).map((x, i) => {
      const g = groupOf(x.m);
      const rank = x.rank;
      return `<div class="podium-card${rank === 1 ? ' first' : ''}" data-id="${x.m.id}" style="--gc:${g.color}">
        <div class="ph" style="background:radial-gradient(circle at 50% 25%,${g.color}30,#0a0a10 72%)"><img src="${img(x.m.id)}" alt="${x.m.name}" onerror="this.style.display='none'"></div>
        <div class="info">
          <div class="rk">${rank}<small>RANK</small></div>
          <div class="sc" style="color:${g.color}">${x.score.toFixed(1)}</div>
          <div class="nm">${x.m.name}</div>
          <div class="gp" style="color:${g.color}">${g.name} · ${x.m.pos}</div>
        </div>
      </div>`;
    }).join('');

    $('#rankList').innerHTML = BOARD.map((x) => {
      const g = groupOf(x.m);
      return `<div class="rank-row" data-id="${x.m.id}">
        <div class="no">${String(x.rank).padStart(2, '0')}</div>
        ${personHTML(x.m.id)}
        <div class="who"><b>${x.m.name}</b><span style="color:${g.color}">${g.name}</span></div>
        <div class="bar"><i style="width:${x.score}%;background:linear-gradient(90deg,${g.color}55,${g.color})"></i></div>
        <div class="sc">${x.score.toFixed(1)}</div>
        <div class="arrow">›</div>
      </div>`;
    }).join('');

    $('#boardMeta').innerHTML = `TOP 24 · 综合分<br><span style="opacity:.6">满分 100</span>`;
    const top = BOARD[0];
    $('#boardLead').innerHTML = `在<strong>当前权重</strong>下，${top.m.name}（${groupOf(top.m).name}）以 <strong>${top.score.toFixed(1)}</strong> 分排在第一。
      第二、三名是 ${BOARD[1].m.name} 与 ${BOARD[2].m.name}，差距 ${(top.score - BOARD[1].score).toFixed(1)} 分。`;

    if (animate) {
      requestAnimationFrame(() => {
        $$('.rank-row').forEach((el) => {
          const o = old.get(el.dataset.id);
          if (o == null) return;
          const d = o - el.getBoundingClientRect().top;
          if (Math.abs(d) < 2) return;
          el.style.transition = 'none';
          el.style.transform = `translateY(${d}px)`;
          requestAnimationFrame(() => {
            el.style.transition = 'transform .55s cubic-bezier(.2,.8,.2,1)';
            el.style.transform = '';
          });
        });
      });
    }
  }

  /* ---------------- 五团 ---------------- */
  function renderGroups() {
    $('#gtabs').innerHTML = Object.values(GROUPS).map((g) =>
      `<button class="gtab${g.id === state.tab ? ' on' : ''}" data-tab="${g.id}" style="${g.id === state.tab ? '' : `color:${g.color}`}">
        <i style="background:${g.color}"></i>${g.name}
      </button>`).join('');

    $('#gpanels').innerHTML = Object.values(GROUPS).map((g) => {
      const ms = BOARD.filter((x) => x.m.group === g.id).sort((a, b) => b.score - a.score);
      const cards = ms.map((x, i) => {
        const m = x.m;
        return `<div class="mcard" data-id="${m.id}">
          <div class="accent" style="background:linear-gradient(90deg,${g.color},transparent)"></div>
          ${i === 0 ? `<div class="badge" style="color:${g.color}">团内 01</div>` : ''}
          ${m.ig == null ? `<div class="naflag">无个人 IG</div>` : ''}
          <div class="fb" style="background:radial-gradient(circle at 50% 22%,${g.color}26,#0b0b11 74%)"><span>${m.name.slice(0, 1)}</span></div>
          <img src="${img(m.id)}" alt="${m.name}" loading="lazy" onerror="this.style.display='none'">
          <div class="veil"></div>
          <div class="body">
            <div class="pos">${m.pos}</div>
            <div class="nm">${m.name}</div>
            <div class="tags">${m.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          </div>
          <div class="mscore" style="color:${g.color}">${x.score.toFixed(1)}</div>
        </div>`;
      }).join('');

      return `<div class="group-panel${g.id === state.tab ? ' on' : ''}" id="panel_${g.id}">
        <div class="ghead">
          <div>
            <div class="gname" style="color:${g.color}">${g.name}<em>${g.ko} · ${g.agency} · ${g.debut}</em></div>
          </div>
          <div>
            <p class="gtag" style="color:${g.color}">“${g.tagline}”</p>
            <p class="gintro">${g.intro}</p>
            <div class="gfacts">${g.facts.map((f) => `<span>${f}</span>`).join('')}<span>FANDOM · ${g.fandom}</span></div>
          </div>
        </div>
        <div class="mgrid">${cards}</div>
      </div>`;
    }).join('');

  }

  /* ---------------- 颁奖 ---------------- */
  function computeAwards() {
    const by = (k) => [...BOARD].filter((x) => x.s[k] != null).sort((a, b) => b.s[k] - a.s[k]);
    const out = [];
    const top = BOARD[0];
    out.push({ cat: '最高荣誉', name: '五女一 2026', win: top.m, note: `综合 ${top.score.toFixed(1)} 分，五维加权第一`, color: groupOf(top.m).color, hero: true });

    Object.values(GROUPS).forEach((g) => {
      const m = BOARD.filter((x) => x.m.group === g.id).sort((a, b) => b.score - a.score)[0];
      out.push({ cat: `${g.name} 团内`, name: 'MVP', win: m.m, note: `${m.score.toFixed(1)} 分 · 队内第一`, color: g.color });
    });

    const dims = [
      ['brand', '韩网声量奖', '品牌声誉排名最靠前'],
      ['attention', '公共关注奖', '维基百科年浏览量最高'],
      ['fandom', '人气王', '个人 IG 粉丝最多'],
      ['commerce', '商业女王', '代言与大使加权最高'],
      ['works', '作品之王', '2026 年个人产出最多']
    ];
    dims.forEach(([k, name, why]) => {
      const list = by(k);
      if (!list.length) return;
      const x = list[0];
      const y = list[1];
      out.push({
        cat: '单项奖', name, win: x.m,
        note: `${why} · ${pct(x.s[k])} 分`,
        runner: y ? `${y.m.name} ${pct(y.s[k])}` : null,
        color: groupOf(x.m).color
      });
    });

    // 黑马：换成「只看作品」权重后名次上升最多
    const wlist = compute(PRESETS.works.w);
    const wrank = Object.fromEntries(wlist.map((x) => [x.m.id, x.rank]));
    const dark = [...BOARD].sort((a, b) => (a.rank - wrank[a.m.id]) - (b.rank - wrank[b.m.id]))[0];
    if (dark && dark.rank - wrank[dark.m.id] > 0) {
      out.push({ cat: '单项奖', name: '年度黑马', win: dark.m, note: `只看作品时上升 ${dark.rank - wrank[dark.m.id]} 位`, color: groupOf(dark.m).color });
    }
    // 最被低估：总分前十之外，作品分最高
    const under = BOARD.filter((x) => x.rank > 10).sort((a, b) => (b.s.works ?? 0) - (a.s.works ?? 0))[0];
    if (under) out.push({ cat: '单项奖', name: '最被低估', win: under.m, note: `综合第 ${under.rank}，但作品分 ${pct(under.s.works)}`, color: groupOf(under.m).color });
    return out;
  }

  function renderAwards() {
    const aw = computeAwards();
    const hero = aw.find((a) => a.hero);
    const rest = aw.filter((a) => !a.hero);

    $('#formalAwards').innerHTML = (hero ? `
      <div class="formal hero-award" style="--accent:${hero.color}">
        <div>
          <div class="cat">${hero.cat}</div>
          <div class="win" style="font-size:clamp(26px,3.4vw,40px)">${hero.name}</div>
          <div class="why">${hero.win.name} · ${groupOf(hero.win).name} —— ${hero.note}</div>
        </div>
        <div class="hero-score" style="color:${hero.color}">${BOARD[0].score.toFixed(1)}</div>
      </div>` : '') + rest.map((a) => `
      <div class="formal" style="--accent:${a.color}">
        <div class="cat">${a.cat}</div>
        <div class="win">${a.win.name}<small>${groupOf(a.win).name}</small></div>
        <div class="why">${a.name} · ${a.note}</div>
        ${a.runner ? `<div class="runner">次席 ${a.runner}</div>` : ''}
      </div>`).join('');

    $('#funAwards').innerHTML = MEMBERS.map((m) => `
      <div class="fun" data-id="${m.id}">
        <div class="avatar"><img src="${img(m.id)}" alt="" loading="lazy" onerror="this.style.display='none'"></div>
        <div>
          <div class="t">${m.fun.t}</div>
          <div class="n">${m.fun.n}</div>
          <div class="who">${m.name} · ${groupOf(m).name}</div>
        </div>
      </div>`).join('');
  }

  /* ---------------- 年表 ---------------- */
  function renderTimelines() {
    $('#timelines').innerHTML = Object.values(GROUPS).map((g) => `
      <div class="tl-group reveal">
        <div class="tl-head">
          <h3 style="color:${g.color}">${g.name}</h3>
          <span class="d">${g.debut} — 2026</span>
        </div>
        <div class="tl-scroll">
          ${TIMELINE[g.id].map(([y, t]) => `<div class="tl-node" style="--tc:${g.color}"><div class="yr">${y}</div><div class="tx">${t}</div></div>`).join('')}
        </div>
      </div>`).join('');
  }

  /* ---------------- 音乐 ---------------- */
  function renderSongs() {
    $('#songs').innerHTML = Object.values(GROUPS).map((g) => `
      <div class="sg">
        <h3 style="color:${g.color}"><i></i>${g.name}</h3>
        <p class="sg-sub">${g.fandom} · ${g.debut}</p>
        ${SONGS[g.id].map((s, i) => {
          const q = encodeURIComponent(`${g.name} ${s.t}`);
          return `<a class="song" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">
            <span class="idx">0${i + 1}</span>
            <span><span class="st">${s.t}</span><span class="sd">${s.d}</span></span>
            <span class="sy">${s.y} ↗</span>
          </a>`;
        }).join('')}
      </div>`).join('');
  }

  /* ---------------- 抽屉 ---------------- */
  function openMember(id) {
    const x = BOARD.find((b) => b.m.id === id);
    if (!x) return;
    const m = x.m, g = groupOf(m), s = x.s;
    const axes = [
      ['韩国声量', s.brand], ['关注度', s.attention], ['粉丝规模', s.fandom], ['商业价值', s.commerce], ['作品活动', s.works]
    ];
    const cx = 75, cy = 75, R = 58;
    const pt = (i, r) => {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    const poly = axes.map((a, i) => {
      const v = (a[1] ?? 0) / 100;
      const [px, py] = pt(i, R * v);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(' ');
    const grid = [0.25, 0.5, 0.75, 1].map((k) =>
      `<polygon points="${axes.map((_, i) => pt(i, R * k).map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".7"/>`).join('');
    const spokes = axes.map((_, i) => {
      const [px, py] = pt(i, R);
      return `<line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="rgba(255,255,255,.1)" stroke-width=".7"/>`;
    }).join('');

    const facts = [
      ['Instagram', m.ig == null ? '无个人账号' : fmt(Math.round(m.ig * 1e6)) + ' 粉丝'],
      ['品牌声誉', m.brand ? `2026.11 第 ${m.brand} 名` : (m.brandPrev ? '未入前 30（近月曾入榜）' : '未入前 30')],
      ['公共关注', PV[m.id] && PV[m.id].total ? fmt(PV[m.id].total) + ' 次/年' : '暂无数据'],
      ['商业', m.commerceNote],
      ['作品', m.worksNote]
    ];

    $('#drawerBody').innerHTML = `
      <div class="drawer-hero">
        <img src="${img(m.id)}" alt="${m.name}" onerror="this.style.display='none'">
        <div class="drawer-head">
          <div class="gp" style="color:${g.color}">${g.name} · ${m.pos}</div>
          <h3>${m.name}</h3>
          <div class="ko">${m.ko} · ${m.en}</div>
        </div>
      </div>
      <div class="drawer-body">
        <div class="dscore">
          <span class="big" style="color:${g.color}">${x.score.toFixed(1)}</span>
          <span class="of">/ 100 综合分</span>
          <span class="rk">总榜 NO.${x.rank}</span>
        </div>
        <p class="dblurb">${m.blurb}</p>

        <div class="dradar">
          <svg viewBox="0 0 150 150">${grid}${spokes}
            <polygon points="${poly}" fill="${g.color}33" stroke="${g.color}" stroke-width="1.6"/>
            ${axes.map((a, i) => { const v = (a[1] ?? 0) / 100; const [px, py] = pt(i, R * v); return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.2" fill="${g.color}"/>`; }).join('')}
          </svg>
          <div class="dbars">
            ${axes.map((a) => `<div class="dbar">
              <div class="lb"><span>${a[0]}</span><span>${pct(a[1])}</span></div>
              <div class="tr"><i style="width:${a[1] ?? 0}%;background:${g.color}"></i></div>
            </div>`).join('')}
          </div>
        </div>

        <div class="dsec">
          <h4>原始数据</h4>
          ${facts.map(([k, v]) => `<div class="dfact"><span>${k}</span><span>${v}</span></div>`).join('')}
        </div>

        <div class="dsec">
          <h4>关键词</h4>
          <div class="dtags">${m.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>

        <div class="dsec">
          <h4>她的那一座奖</h4>
          <div class="daward" style="border-color:${g.color}55">
            <div class="t" style="color:${g.color}">${m.fun.t}</div>
            <div class="n">${m.fun.n}</div>
          </div>
        </div>
        ${m.ig == null ? `<div class="dsec"><div class="note" style="font-size:11.5px;color:var(--ink-faint);border-left:2px solid rgba(255,255,255,.16);padding-left:12px">该成员无个人 Instagram，「粉丝规模」维度缺省，综合分由其余四项按权重重新归一。</div></div>` : ''}
      </div>`;

    $('#drawer').classList.add('on');
    $('#scrim').classList.add('on');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#drawerBody').scrollTop = 0;
  }
  function closeDrawer() {
    $('#drawer').classList.remove('on');
    $('#scrim').classList.remove('on');
    $('#drawer').setAttribute('aria-hidden', 'true');
  }

  /* ---------------- 互动 ---------------- */
  function renderVote() {
    $('#votePool').innerHTML = MEMBERS.map((m) => {
      const g = groupOf(m);
      const n = state.votes[m.id] || 0;
      return `<button class="voter${n ? ' on' : ''}" data-id="${m.id}" style="${n ? `background:${g.color};border-color:${g.color};color:#08080c` : ''}">
        ${m.name}${n ? ` <span class="vc">×${n}</span>` : ''}
      </button>`;
    }).join('');

    const entries = Object.entries(state.votes).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      $('#voteReadout').innerHTML = `还没有票。随便点几个名字，这里会长出你自己的排行榜。`;
    } else {
      const total = entries.reduce((s, [, n]) => s + n, 0);
      const top = entries.slice(0, 3).map(([id, n]) => {
        const m = MEMBERS.find((x) => x.id === id);
        return `<b>${m.name}</b> ×${n}`;
      }).join(' · ');
      $('#voteReadout').innerHTML = `已投 <b>${total}</b> 票，分布：${top}${entries.length > 3 ? ` 等 ${entries.length} 人` : ''}`;
    }
  }

  function renderGacha() {
    const pool = MEMBERS;
    const roll = () => {
      const stage = $('#gacha');
      stage.innerHTML = `<div class="gacha-out rolling"><div class="gname">?</div></div>`;
      let n = 0;
      const timer = setInterval(() => {
        const m = pool[Math.floor(Math.random() * pool.length)];
        stage.innerHTML = `<div class="gacha-out rolling"><div class="gname">${m.name}</div></div>`;
        if (++n > 12) {
          clearInterval(timer);
          const p = pool[Math.floor(Math.random() * pool.length)];
          const g = groupOf(p);
          stage.innerHTML = `<div class="gacha-out">
            <img class="gimg" src="${img(p.id)}" alt="" onerror="this.style.display='none'">
            <div class="gname" style="color:${g.color}">${p.name}</div>
            <div class="ggroup">${g.name} · ${p.pos}</div>
            <div class="gfun">「${p.fun.t}」<br>${p.fun.n}</div>
          </div>`;
        }
      }, 90);
    };
    $('#gachaBtn').addEventListener('click', roll);
  }

  const QUIZ = [
    {
      q: '刷到一个新舞台，你先看什么？',
      o: [['脸和造型', ['visual']], ['主唱那一句', ['vocal']], ['刀群舞和走位', ['stage']], ['有没有笑场', ['variety']]]
    },
    {
      q: '你更吃哪种气质？',
      o: [['冷到发光', ['visual', 'charm']], ['甜到齁', ['charm', 'variety']], ['野到犯规', ['stage', 'art']], ['邻家到想当同学', ['charm', 'global']]]
    },
    {
      q: '如果只能听一首她们的歌，你选？',
      o: [['大合唱式的副歌', ['vocal']], ['低音炮和 rap', ['art', 'stage']], ['能跳起来的舞曲', ['stage', 'variety']], ['深夜单曲循环的氛围', ['art', 'charm']]]
    },
    {
      q: '你欣赏哪种「业务能力」？',
      o: [['自己写歌自己制作', ['art']], ['现场稳到像 CD', ['vocal']], ['一个人救活整个舞台', ['stage']], ['采访比舞台还好看', ['variety', 'global']]]
    },
    {
      q: '对你来说，偶像最加分的瞬间是？',
      o: [['机场生图', ['visual']], ['安可清唱', ['vocal']], ['直拍里的小动作', ['stage', 'charm']], ['直播说漏嘴', ['variety']]]
    },
    {
      q: '你追团的年限偏好？',
      o: [['越老越香，考古有料', ['veteran']], ['正当年，天天有物料', ['stage', 'variety']], ['新团，参与她的成长', ['charm', 'global']], ['无所谓，只看作品', ['art', 'vocal']]]
    }
  ];

  function renderQuiz() {
    const el = $('#quiz');
    if (state.quizStep >= QUIZ.length) {
      const keys = Object.keys(state.quizTraits);
      let best = null, bestScore = -1;
      MEMBERS.forEach((m) => {
        const t = TRAITS[m.id] || [];
        const sc = keys.reduce((s, k) => s + (t.includes(k) ? 1 : 0) * (state.quizTraits[k] || 0), 0);
        const tie = (BOARD.find((b) => b.m.id === m.id)?.score || 0) / 1000;
        if (sc + tie > bestScore) { bestScore = sc + tie; best = m; }
      });
      const g = groupOf(best);
      el.innerHTML = `<div class="quiz-result">
        <div class="mono" style="font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:10px">你的答案是</div>
        <div class="qr-name" style="color:${g.color}">${best.name}</div>
        <div style="font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-faint);margin-top:6px">${g.name} · ${best.pos}</div>
        <div class="qr-why">${best.blurb}<br><br>她被记住的方式是「${best.fun.t}」。去点开她的卡片看看数据——如果数字不站在她这边，也不妨碍她是你的答案。</div>
        <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="quizRestart">再测一次</button>
          <button class="btn solid" id="quizOpen">看她主页</button>
        </div>
      </div>`;
      $('#quizRestart').addEventListener('click', () => { state.quizStep = 0; state.quizTraits = {}; renderQuiz(); });
      $('#quizOpen').addEventListener('click', () => openMember(best.id));
      return;
    }
    const q = QUIZ[state.quizStep];
    el.innerHTML = `
      <div class="quiz-progress">${QUIZ.map((_, i) => `<i class="${i <= state.quizStep ? 'on' : ''}"></i>`).join('')}</div>
      <div class="quiz-q">Q${state.quizStep + 1}. ${q.q}</div>
      <div class="quiz-opts">${q.o.map(([t, tr], i) => `<button class="quiz-opt" data-i="${i}">${t}</button>`).join('')}</div>`;
    $$('#quiz .quiz-opt').forEach((b) => b.addEventListener('click', () => {
      const tr = q.o[+b.dataset.i][1];
      tr.forEach((k) => (state.quizTraits[k] = (state.quizTraits[k] || 0) + 1));
      state.quizStep++;
      renderQuiz();
    }));
  }

  /* ---------------- 播放器 ---------------- */
  function initPlayer() {
    const audio = $('#trackAudio');
    const card = $('#trackCard');
    const pill = $('#musicToggle');
    if (!audio || !card) return;

    const fill = $('#trackFill');
    const time = $('#trackTime');
    const pillLabel = $('#musicToggleLabel');
    const fmtT = (s) => {
      if (!isFinite(s) || s < 0) return '--:--';
      return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    };

    // src 延迟到真正要播时才赋值；单文件版在这一刻才解码 base64
    const ensureSrc = () => {
      if (audio.getAttribute('src')) return true;
      if (window.__AUDIO_B64) {
        const bin = atob(window.__AUDIO_B64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        audio.src = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
        window.__AUDIO_B64 = null;
        return true;
      }
      const devSrc = audio.getAttribute('data-src');
      if (devSrc) { audio.src = devSrc; return true; }
      return false;
    };

    const setUI = (on) => {
      card.classList.toggle('playing', on);
      if (pill) {
        pill.classList.toggle('playing', on);
        if (on) pill.classList.remove('blocked');
        pill.setAttribute('aria-pressed', on ? 'true' : 'false');
        pill.setAttribute('aria-label', on ? '暂停背景音乐' : '播放背景音乐');
      }
      if (pillLabel) pillLabel.textContent = on ? 'PAUSE' : 'BANG BANG';
    };

    audio.addEventListener('loadedmetadata', () => {
      time.textContent = '0:00 / ' + fmtT(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = p + '%';
      time.textContent = fmtT(audio.currentTime) + ' / ' + fmtT(audio.duration);
    });
    audio.addEventListener('play', () => setUI(true));
    audio.addEventListener('pause', () => setUI(false));
    audio.addEventListener('ended', () => { setUI(false); audio.currentTime = 0; });
    audio.addEventListener('error', () => {
      card.classList.add('error');
      time.textContent = '音频未找到';
    });

    let lastAutoStart = 0;

    const start = () => {
      try {
        if (!ensureSrc()) { time.textContent = '音频未找到'; return; }
      } catch (e) {
        card.classList.add('error');
        time.textContent = '音频解码失败';
        return;
      }
      const p = audio.play();
      if (p && p.catch) p.catch(() => armGesture());
    };

    // 浏览器拦截自动播放时，把「第一次触摸 / 滚动 / 按键 / 点击」当作播放指令
    let armed = false;
    const armGesture = () => {
      if (armed) return;
      armed = true;
      if (pill) pill.classList.add('blocked');
      const go = () => {
        if (!armed) return;
        armed = false;
        ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((ev) =>
          document.removeEventListener(ev, go, true));
        if (audio.paused) { lastAutoStart = Date.now(); start(); }
      };
      ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((ev) =>
        document.addEventListener(ev, go, true));
      window.addEventListener('touchmove', go, { once: true, passive: true });
      window.addEventListener('scroll', go, { once: true, passive: true });
    };

    const toggle = () => {
      if (Date.now() - lastAutoStart < 600) return; // 避免和自动起播重复触发
      if (!audio.paused) { audio.pause(); return; }
      start();
    };

    if (pill) pill.addEventListener('click', toggle);
    const btn = $('#trackBtn');
    if (btn) btn.addEventListener('click', toggle);

    const seek = (el) => (e) => {
      if (!audio.duration) return;
      const r = el.getBoundingClientRect();
      audio.currentTime = clamp((e.clientX - r.left) / r.width, 0, 1) * audio.duration;
    };
    const bar = $('#trackBar');
    if (bar) bar.addEventListener('click', seek(bar));

    // 打开即播（延后一帧，先让页面画出来，避免解码大文件卡住首屏）
    setTimeout(start, 60);
  }

  /* ---------------- 刷新 ---------------- */
  function refresh() {
    BOARD = compute();
    renderHero();
    renderBoard(true);
    renderGroups();
    renderAwards();
  }

  /* ---------------- 事件 ---------------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('#gtabs [data-tab]');
      if (tab) {
        state.tab = tab.dataset.tab;
        $$('#gtabs .gtab').forEach((x) => {
          const on = x.dataset.tab === state.tab;
          x.classList.toggle('on', on);
          x.style.color = on ? '' : GROUPS[x.dataset.tab].color;
        });
        $$('.group-panel').forEach((p) => p.classList.toggle('on', p.id === 'panel_' + state.tab));
        return;
      }
      const row = e.target.closest('[data-id]');
      if (row && !e.target.closest('.voter') && !e.target.closest('.gacha-stage')) {
        openMember(row.dataset.id);
      }
    });
    $('#scrim').addEventListener('click', closeDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

    document.addEventListener('click', (e) => {
      const v = e.target.closest('.voter');
      if (!v) return;
      const id = v.dataset.id;
      state.votes[id] = (state.votes[id] || 0) + 1;
      localStorage.setItem('wg1_votes', JSON.stringify(state.votes));
      renderVote();
    });

    $('#clearVote').addEventListener('click', () => {
      state.votes = {};
      localStorage.removeItem('wg1_votes');
      renderVote();
    });

    $('#shareBtn').addEventListener('click', async () => {
      const entries = Object.entries(state.votes).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
      if (!entries.length) { alert('先点几个名字投票，再生成战报 🙂'); return; }
      const lines = entries.map(([id, n], i) => {
        const m = MEMBERS.find((x) => x.id === id);
        return `${['①', '②', '③', '④', '⑤'][i] || '·'} ${m.name}（${groupOf(m).name}）— ${n} 票`;
      });
      const text = `我的「五女一」应援榜 · 2026\n${lines.join('\n')}\n\n数据来自 five-girls-one · 快照 2026.11.18`;
      try {
        await navigator.clipboard.writeText(text);
        $('#shareBtn').textContent = '已复制 ✓';
        setTimeout(() => ($('#shareBtn').textContent = '生成我的战报'), 1800);
      } catch {
        alert(text);
      }
    });

    // 滚动出现
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach((el) => io.observe(el));

    // 导航高亮
    const secs = $$('section[id]');
    const links = $$('#navLinks a');
    const io2 = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => io2.observe(s));
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    renderHero();
    renderMethod();
    renderBoard();
    renderGroups();
    renderAwards();
    renderTimelines();
    renderSongs();
    renderVote();
    renderGacha();
    renderQuiz();
    try { initPlayer(); } catch (e) { console.warn('player init failed', e); }
    bindGlobal();

    $('#srcList').innerHTML = SOURCES.map(([t, u, w]) =>
      `<li><a href="${u}" target="_blank" rel="noopener">${t}</a><br><span style="opacity:.6">${w}</span></li>`).join('');

    const credit = window.CREDITS || [];
    $('#credit').innerHTML = credit.length
      ? '图片授权（Wikimedia Commons，CC BY / CC BY-SA）— ' +
        credit.map((c) => `${c.name}：${c.artist || '未署名'} / ${c.license} / <a href="${c.page}" target="_blank" rel="noopener">来源</a>`).join('　·　')
      : '图片来自 Wikimedia Commons，授权信息待补。';

    // 调试/预览：?...&sec=board 直接定位到某个分区
    const q = new URLSearchParams(location.search);
    if (q.get('sec') || q.get('shot')) {
      document.body.classList.add('shot');
      $$('.reveal').forEach((el) => el.classList.add('in'));
    }
    if (q.get('dbg')) {
      const pick = (sel) => {
        const n = document.querySelector(sel);
        if (!n) return sel + ': MISSING';
        const cs = getComputedStyle(n);
        const r = n.getBoundingClientRect();
        return `${sel}: display=${cs.display} opacity=${cs.opacity} vis=${cs.visibility} h=${Math.round(r.height)} top=${Math.round(r.top)} color=${cs.color}`;
      };
      const el = document.createElement('pre');
      el.id = 'dbgout';
      el.textContent = ['#play', '#play .wrap', '#play .play-grid', '#play .panel', '#votePool', '#gacha', '#quiz', 'body']
        .map(pick).join('\n');
      document.body.appendChild(el);
    }
    if (q.get('sec')) {
      const keep = q.get('sec');
      $$('main > section').forEach((s) => { s.style.display = s.id === keep ? '' : 'none'; });
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

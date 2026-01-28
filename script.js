// Enhanced Climate Website - Interactive Simulations & Animations
(function () {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function animateNumber(el, target, duration = 1600) {
    const start = parseFloat(el.textContent) || 0;
    const isFloat = String(target).includes('.');
    const end = parseFloat(target);
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const val = start + (end - start) * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }

  // ============================================
  // CARBON FOOTPRINT CALCULATOR
  // ============================================

  function initCarbonCalculator() {
    const transport = document.getElementById('transport');
    const energy = document.getElementById('energy');
    const meat = document.getElementById('meat');
    const waste = document.getElementById('waste');

    if (!transport || !energy || !meat || !waste) return;

    function calculateFootprint() {
      // Emission factors (kg CO2/unit)
      const transportFactor = 0.12; // kg CO2 per km
      const energyFactor = 0.5; // kg CO2 per kWh
      const meatFactor = 52; // kg CO2 per meal
      const wasteFactor = 0.5; // kg CO2 per kg

      const transportVal = parseFloat(transport.value);
      const energyVal = parseFloat(energy.value);
      const meatVal = parseFloat(meat.value);
      const wasteVal = parseFloat(waste.value);

      // Calculate annual emissions (tons)
      const transportEmissions = (transportVal * 52 * transportFactor) / 1000;
      const energyEmissions = (energyVal * 12 * energyFactor) / 1000;
      const meatEmissions = (meatVal * 52 * meatFactor) / 1000;
      const wasteEmissions = (wasteVal * 52 * wasteFactor) / 1000;

      const total = transportEmissions + energyEmissions + meatEmissions + wasteEmissions;

      // Update display
      const resultEl = document.getElementById('carbonResult');
      if (resultEl) animateNumber(resultEl, total.toFixed(1), 800);

      // Update percentages
      const transportPct = Math.round((transportEmissions / total) * 100);
      const energyPct = Math.round((energyEmissions / total) * 100);
      const meatPct = Math.round((meatEmissions / total) * 100);
      const wastePct = Math.round((wasteEmissions / total) * 100);

      updateElement('transportPercent', transportPct + '%');
      updateElement('energyPercent', energyPct + '%');
      updateElement('meatPercent', meatPct + '%');
      updateElement('wastePercent', wastePct + '%');

      updateProgressBar('transportBar', transportPct);
      updateProgressBar('energyBar', energyPct);
      updateProgressBar('meatBar', meatPct);
      updateProgressBar('wasteBar', wastePct);

      // Comparison
      const globalAvg = 4.0;
      const diff = ((total - globalAvg) / globalAvg * 100).toFixed(0);
      const comparisonEl = document.getElementById('carbonComparison');
      if (comparisonEl) {
        if (total > globalAvg) {
          comparisonEl.innerHTML = `<strong>Comparison:</strong> Global average is ${globalAvg} tons/year. Your footprint is ${Math.abs(diff)}% above average.`;
        } else {
          comparisonEl.innerHTML = `<strong>Comparison:</strong> Global average is ${globalAvg} tons/year. Your footprint is ${Math.abs(diff)}% below average! 🎉`;
        }
      }
    }

    function updateElement(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    function updateProgressBar(id, percent) {
      const el = document.getElementById(id);
      if (el) el.style.width = percent + '%';
    }

    // Event listeners
    transport.addEventListener('input', e => {
      updateElement('transportValue', e.target.value);
      calculateFootprint();
    });
    energy.addEventListener('input', e => {
      updateElement('energyValue', e.target.value);
      calculateFootprint();
    });
    meat.addEventListener('input', e => {
      updateElement('meatValue', e.target.value);
      calculateFootprint();
    });
    waste.addEventListener('input', e => {
      updateElement('wasteValue', e.target.value);
      calculateFootprint();
    });

    // Initial calculation
    calculateFootprint();
  }

  // ============================================
  // SEA LEVEL RISE SIMULATOR
  // ============================================

  function initSeaLevelSimulator() {
    const tempIncrease = document.getElementById('tempIncrease');
    const canvas = document.getElementById('seaLevelCanvas');

    if (!tempIncrease || !canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
      const ratio = devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function calculateSeaLevel(temp) {
      // Simplified model: ~0.4m per degree above 1.5°C
      const baseRise = 0.3; // meters at 1.5°C
      const additionalRise = (temp - 1.5) * 0.4;
      return baseRise + additionalRise;
    }

    function drawSeaLevel(temp) {
      const seaLevel = calculateSeaLevel(temp);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      ctx.clearRect(0, 0, cw, ch);

      // Draw city skyline
      const buildings = [
        { x: 50, w: 40, h: 120 },
        { x: 100, w: 50, h: 180 },
        { x: 160, w: 35, h: 100 },
        { x: 205, w: 45, h: 160 },
        { x: 260, w: 40, h: 140 },
        { x: 310, w: 50, h: 200 },
      ];

      const waterLevel = ch - (seaLevel / 2 * ch);

      // Draw buildings
      buildings.forEach(b => {
        const buildingColor = isDark ? 'rgba(200,210,230,0.8)' : 'rgba(50,60,80,0.8)';
        ctx.fillStyle = buildingColor;
        ctx.fillRect(b.x, ch - b.h, b.w, b.h);

        // Windows
        ctx.fillStyle = isDark ? 'rgba(255,220,100,0.6)' : 'rgba(255,230,150,0.7)';
        for (let i = 0; i < b.h; i += 20) {
          for (let j = 0; j < b.w; j += 15) {
            ctx.fillRect(b.x + j + 3, ch - b.h + i + 3, 8, 8);
          }
        }
      });

      // Draw water with gradient
      const gradient = ctx.createLinearGradient(0, waterLevel, 0, ch);
      gradient.addColorStop(0, 'rgba(79,172,254,0.6)');
      gradient.addColorStop(1, 'rgba(79,172,254,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, waterLevel, cw, ch - waterLevel);

      // Draw waves
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < cw; x += 10) {
        const y = waterLevel + Math.sin(x * 0.1) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Update result
      const resultEl = document.getElementById('seaLevelResult');
      if (resultEl) animateNumber(resultEl, seaLevel.toFixed(1), 600);

      // Update impacts
      updateSeaLevelImpacts(temp);
    }

    function updateSeaLevelImpacts(temp) {
      const impact1 = document.getElementById('seaLevelImpact1');
      const impact2 = document.getElementById('seaLevelImpact2');
      const impact3 = document.getElementById('seaLevelImpact3');

      if (temp < 2) {
        if (impact1) impact1.textContent = '100+ coastal cities at risk';
        if (impact2) impact2.textContent = '50-100 million people displaced';
        if (impact3) impact3.textContent = 'Small island nations threatened';
      } else if (temp < 3) {
        if (impact1) impact1.textContent = '200+ major cities severely flooded';
        if (impact2) impact2.textContent = '200-300 million people displaced';
        if (impact3) impact3.textContent = 'Multiple island nations submerged';
      } else {
        if (impact1) impact1.textContent = '400+ cities catastrophically flooded';
        if (impact2) impact2.textContent = '500+ million people displaced';
        if (impact3) impact3.textContent = 'Entire island nations lost';
      }
    }

    tempIncrease.addEventListener('input', e => {
      const temp = parseFloat(e.target.value);
      document.getElementById('tempIncreaseValue').textContent = temp.toFixed(1) + '°C';
      drawSeaLevel(temp);
    });

    // Initial draw
    drawSeaLevel(parseFloat(tempIncrease.value));
  }

  // ============================================
  // TEMPERATURE IMPACT SIMULATOR
  // ============================================

  function initTemperatureSimulator() {
    const scenario = document.getElementById('scenario');
    const canvas = document.getElementById('tempMapCanvas');

    if (!scenario || !canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
      const ratio = devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const scenarios = {
      1: { name: 'Paris Agreement', temp: 1.8, desc: 'Achieving all Paris Agreement commitments limits warming to 1.8°C, reducing but not eliminating severe climate impacts.' },
      2: { name: 'Current Policies', temp: 2.7, desc: 'Following current climate policies leads to approximately 2.7°C warming by 2100, causing severe impacts on ecosystems and human societies.' },
      3: { name: 'No Action', temp: 3.5, desc: 'Without climate action, warming could reach 3.5°C, triggering catastrophic tipping points and irreversible damage.' },
      4: { name: 'Worst Case', temp: 4.4, desc: 'In a worst-case scenario with continued high emissions, warming exceeds 4°C, making large parts of Earth uninhabitable.' }
    };

    function drawHeatMap(scenarioNum) {
      const data = scenarios[scenarioNum];
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      ctx.clearRect(0, 0, cw, ch);

      // Draw simplified world map with heat zones
      const regions = [
        { x: 50, y: 40, w: 80, h: 60, name: 'Arctic', mult: 1.8 },
        { x: 150, y: 60, w: 120, h: 50, name: 'N.America', mult: 1.1 },
        { x: 280, y: 70, w: 100, h: 50, name: 'Europe', mult: 1.0 },
        { x: 50, y: 120, w: 100, h: 60, name: 'S.America', mult: 0.9 },
        { x: 200, y: 140, w: 120, h: 70, name: 'Africa', mult: 1.2 },
        { x: 320, y: 120, w: 80, h: 80, name: 'Asia', mult: 1.1 },
      ];

      regions.forEach(r => {
        const tempIncrease = data.temp * r.mult;
        const intensity = Math.min(1, tempIncrease / 5);

        // Color gradient from blue to red
        const red = Math.round(255 * intensity);
        const blue = Math.round(255 * (1 - intensity));
        const green = Math.round(100 * (1 - intensity));

        ctx.fillStyle = `rgba(${red},${green},${blue},0.7)`;
        ctx.fillRect(r.x, r.y, r.w, r.h);

        // Border
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        // Label
        ctx.fillStyle = isDark ? '#fff' : '#000';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`+${tempIncrease.toFixed(1)}°C`, r.x + r.w / 2, r.y + r.h / 2);
      });

      // Update result
      const resultEl = document.getElementById('tempResult');
      if (resultEl) animateNumber(resultEl, data.temp.toFixed(1), 600);

      // Update scenario description
      const descEl = document.getElementById('scenarioDescription');
      if (descEl) descEl.textContent = data.desc;

      // Update regional impacts
      updateRegionalImpacts(data.temp);
    }

    function updateRegionalImpacts(temp) {
      const arcticEl = document.getElementById('arcticImpact');
      const tropicsEl = document.getElementById('tropicsImpact');
      const midLatEl = document.getElementById('midLatImpact');

      const arcticTemp = (temp * 1.8).toFixed(1);
      const tropicsTemp = (temp * 0.9).toFixed(1);
      const midLatTemp = (temp * 1.0).toFixed(1);

      if (arcticEl) arcticEl.textContent = `+${arcticTemp}°C - ${temp > 3 ? 'Ice-free summers' : 'Rapid ice loss'}`;
      if (tropicsEl) tropicsEl.textContent = `+${tropicsTemp}°C - ${temp > 2.5 ? 'Coral extinction' : 'Coral bleaching'}`;
      if (midLatEl) midLatEl.textContent = `+${midLatTemp}°C - ${temp > 3 ? 'Severe droughts' : 'Extreme weather'}`;
    }

    scenario.addEventListener('input', e => {
      const val = parseInt(e.target.value);
      const scenarioData = scenarios[val];
      document.getElementById('scenarioValue').textContent = scenarioData.name;
      drawHeatMap(val);
    });

    // Initial draw
    drawHeatMap(parseInt(scenario.value));
  }

  // ============================================
  // ORIGINAL FEATURES (Enhanced)
  // ============================================

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-target');
          animateNumber(el, target, 1700);
          obs.unobserve(el);
        }
      })
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  function initReveal() {
    const elems = document.querySelectorAll('.slide-up, .fade-in');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      })
    }, { threshold: 0.15 });
    elems.forEach(e => io.observe(e));
  }

  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      const px = Math.round(x * -10);
      const py = Math.round(y * -6);
      const p = hero.querySelector('.particles');
      if (p) p.style.transform = `translate(${px}px,${py}px)`;
    });
  }

  function initChart() {
    const canvas = document.getElementById('co2Chart');
    const tooltip = document.getElementById('chartTooltip');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const datasets = {
      co2: { values: [280, 290, 300, 310, 320, 330, 340, 360, 380, 400, 415], labels: ['Pre-1800', '1850', '1900', '1950', '1970', '1980', '1990', '2000', '2010', '2020', '2023'], unit: 'ppm' },
      temp: { values: [0.0, 0.1, 0.2, 0.3, 0.35, 0.45, 0.6, 0.75, 0.9, 1.02, 1.2], labels: ['Pre-1800', '1850', '1900', '1950', '1970', '1980', '1990', '2000', '2010', '2020', '2023'], unit: '°C' }
    };
    let currentKey = 'co2';

    function resize() {
      const ratio = devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function buildPath(points) {
      const n = points.length;
      if (n === 0) return null;
      const path = new Path2D();
      path.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < n; i++) {
        const prev = points[i - 1], curr = points[i];
        const xc = (prev.x + curr.x) / 2;
        const yc = (prev.y + curr.y) / 2;
        path.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
      const last = points[n - 1];
      path.quadraticCurveTo(last.x, last.y, last.x, last.y);
      return path;
    }

    function drawDataset(key, progress) {
      const ds = datasets[key];
      const data = ds.values;
      const unit = ds.unit;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(5,50,74,0.06)';
      const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(5,50,74,0.6)';

      ctx.clearRect(0, 0, cw, ch);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const paddingLeft = 40, paddingRight = 10, paddingTop = 20, paddingBottom = 30;
      const plotW = cw - paddingLeft - paddingRight;
      const plotH = ch - paddingTop - paddingBottom;

      const yTicks = 5;
      ctx.fillStyle = textColor;
      ctx.font = '12px Inter, system-ui';
      for (let i = 0; i <= yTicks; i++) {
        const y = paddingTop + i * (plotH) / yTicks;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(cw - paddingRight, y);
        ctx.stroke();
      }

      const min = data[0], max = data[data.length - 1];
      const points = data.map((v, i) => {
        const t = i / (data.length - 1);
        const x = paddingLeft + t * plotW;
        const y = paddingTop + (1 - (v - min) / (max - min)) * plotH;
        return { x, y, val: v, label: datasets[key].labels[i] };
      });

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      const labelStep = Math.ceil(points.length / 6);
      points.forEach((p, i) => {
        if (i % labelStep === 0) {
          ctx.fillText(p.label, p.x, ch - 8);
        }
      });

      ctx.textAlign = 'right';
      for (let i = 0; i <= yTicks; i++) {
        const v = min + (1 - i / yTicks) * (max - min);
        const y = paddingTop + i * (plotH) / yTicks;
        ctx.fillText(Math.round(v * 100) / 100 + (unit === 'ppm' ? '' : ''), paddingLeft - 8, y + 4);
      }

      const path = buildPath(points);
      ctx.save();
      ctx.beginPath();
      ctx.rect(paddingLeft, 0, Math.max(0, progress * (plotW)), ch);
      ctx.clip();
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, 'rgba(79,172,254,0.15)');
      grad.addColorStop(1, 'rgba(79,172,254,0)');
      ctx.fillStyle = grad;
      if (path) ctx.fill(path);
      ctx.strokeStyle = (key === 'co2' ? 'rgba(79,172,254,0.98)' : 'rgba(255,160,90,0.98)');
      ctx.lineWidth = 3;
      if (path) ctx.stroke(path);
      ctx.restore();

      points.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.stroke();
      });

      const annotationEl = document.getElementById('chartAnnotation');
      if (annotationEl) {
        if (key === 'temp') {
          const startYear = datasets[key].labels[0];
          const endYear = datasets[key].labels[datasets[key].labels.length - 1];
          const delta = (datasets[key].values[datasets[key].values.length - 1] - datasets[key].values[0]);
          annotationEl.textContent = `Rise ${delta.toFixed(2)} ${datasets[key].unit} from ${startYear} → ${endYear}`;
          annotationEl.style.opacity = 1;
          annotationEl.setAttribute('aria-hidden', 'false');
        } else {
          annotationEl.style.opacity = 0;
          annotationEl.setAttribute('aria-hidden', 'true');
        }
      }
    }

    let start = null;
    function animateDraw(key) {
      start = null;
      function step(ts) {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / 1800);
        drawDataset(key, easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    animateDraw(currentKey);

    canvas.addEventListener('mousemove', (ev) => {
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const cw = canvas.clientWidth;
      const ds = datasets[currentKey];
      const idx = Math.round(((x - 40) / (cw - 60)) * (ds.values.length - 1));
      const clamped = Math.max(0, Math.min(ds.values.length - 1, idx));
      const val = ds.values[clamped];
      const label = ds.labels[clamped] || '';
      if (tooltip) {
        tooltip.style.left = `${ev.clientX}px`;
        tooltip.style.top = `${rect.top + window.scrollY + 8}px`;
        tooltip.textContent = `${label}: ${val} ${ds.unit}`;
        tooltip.style.opacity = 1;
      }
    });
    canvas.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.opacity = 0;
    });

    document.querySelectorAll('.chart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-set');
        if (!key || key === currentKey) return;
        document.querySelectorAll('.chart-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentKey = key;
        animateDraw(currentKey);
      });
    });

    const observer = new MutationObserver(m => {
      m.forEach(r => {
        if (r.attributeName === 'data-theme') animateDraw(currentKey);
      })
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  function setYear() {
    const y = new Date().getFullYear();
    const el = document.getElementById('year');
    if (el) el.textContent = y;
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.setAttribute('data-theme', theme);
    window.setTimeout(() => root.classList.remove('theme-transition'), 500);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    try { localStorage.setItem('site-theme', theme); } catch (e) { }
  }

  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    let theme = 'dark'; // Default to dark theme
    try {
      const saved = localStorage.getItem('site-theme');
      if (saved) theme = saved;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
    } catch (e) { }
    applyTheme(theme);
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  function initNav() {
    const btn = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const header = document.querySelector('.site-header');

    if (btn && nav) {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        nav.setAttribute('aria-hidden', String(expanded));
        btn.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
          nav.setAttribute('aria-hidden', 'false');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    let lastY = 0;
    const threshold = 60;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > threshold) header.classList.add('small');
      else header.classList.remove('small');
      lastY = y;
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          if (nav && btn) {
            nav.setAttribute('aria-hidden', 'true');
            btn.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }

  function initModals() {
    const btnTips = document.getElementById('btnTips');
    const modalTips = document.getElementById('modalTips');

    const btnCons = document.getElementById('btnConsequences');
    const modalCons = document.getElementById('modalConsequences');

    function setup(btn, modal) {
      if (!btn || !modal) return;
      btn.addEventListener('click', () => modal.showModal());

      const close = modal.querySelector('.close-modal');
      if (close) close.addEventListener('click', () => modal.close());

      modal.addEventListener('click', e => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) modal.close();
      });
    }

    setup(btnTips, modalTips);
    setup(btnCons, modalCons);
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initReveal();
    initParallax();
    initChart();
    initNav();
    initModals();
    initThemeToggle();
    setYear();

    // Initialize simulations
    initCarbonCalculator();
    initSeaLevelSimulator();
    initTemperatureSimulator();
  });

})();

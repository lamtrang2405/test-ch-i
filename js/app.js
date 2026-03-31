/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarsBackground();
  initNavigation();
  initScrollAnimations();
  initTuViForm();
  initAnalysisTabs();
  initEngagementTracking();
  trackEvent('site_ready', { page_type: 'single_page_tuvi' });
});

let premiumNotiStarted = false;
let premiumNotiIntervalId = null;
const engagementState = {
  activeTab: 'lap-la-so',
  tabEnterAt: Date.now(),
  maxScrollPct: 0,
  firedDepths: new Set(),
  initialized: false
};

function trackEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function' && window.__gaLoaded) {
      window.gtag('event', eventName, params);
    } else {
      sendGaCollectFallback(eventName, params);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, transport: 'fallback', ...params });
    }
  } catch (e) {
    // Ignore tracking failures
  }
}

function getOrCreateClientId() {
  const key = 'ga_fallback_cid';
  let cid = '';
  try {
    cid = window.localStorage.getItem(key) || '';
    if (!cid) {
      cid = `${Math.floor(Math.random() * 1e10)}.${Date.now()}`;
      window.localStorage.setItem(key, cid);
    }
  } catch (e) {
    cid = `${Math.floor(Math.random() * 1e10)}.${Date.now()}`;
  }
  return cid;
}

function sendGaCollectFallback(eventName, params = {}) {
  const tid = window.__GA_MEASUREMENT_ID || 'G-9TW02BVZDR';
  const cid = getOrCreateClientId();
  const payload = new URLSearchParams({
    v: '2',
    tid,
    cid,
    en: eventName
  });
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    payload.append(`ep.${String(k)}`, String(v));
  });
  const url = `https://www.google-analytics.com/g/collect?${payload.toString()}`;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
    }
  } catch (e) {
    // Ignore fallback failures
  }
}

// Call this from payment success callback/webhook bridge when available.
window.trackPurchaseSuccess = function trackPurchaseSuccess(amount, plan = 'premium_99k', method = 'unknown') {
  trackEvent('purchase_success', {
    value: Number(amount) || 99000,
    currency: 'VND',
    plan_name: plan,
    payment_method: method
  });
};

function startPremiumFakeNotifications() {
  if (premiumNotiStarted) return;
  premiumNotiStarted = true;

  const show = () => {
    const names = ['Anh M***', 'Chị H***', 'Anh T***', 'Chị N***', 'Anh K***', 'Chị P***'];
    const plans = ['gói Premium 99K', 'gói Premium', 'gói phân tích AI chuyên sâu'];
    const name = names[Math.floor(Math.random() * names.length)];
    const plan = plans[Math.floor(Math.random() * plans.length)];
    showPremiumToast(`${name} vừa đăng ký ${plan}`);
  };

  setTimeout(() => {
    show();
    premiumNotiIntervalId = window.setInterval(show, 5 * 60 * 1000);
  }, 5000);
}

function showPremiumToast(message) {
  let host = document.getElementById('premium-fake-noti-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'premium-fake-noti-host';
    host.className = 'premium-fake-noti-host';
    document.body.appendChild(host);
  }

  const toast = document.createElement('div');
  toast.className = 'premium-fake-noti';
  toast.textContent = message;
  host.appendChild(toast);
  trackEvent('premium_noti_show', { message_type: 'social_proof' });

  requestAnimationFrame(() => toast.classList.add('show'));

  window.setTimeout(() => {
    toast.classList.remove('show');
    window.setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function initEngagementTracking() {
  if (engagementState.initialized) return;
  engagementState.initialized = true;

  const depthMarks = [25, 50, 75, 90];
  const currentScrollPct = () => {
    const doc = document.documentElement;
    const total = Math.max(0, doc.scrollHeight - window.innerHeight);
    if (total <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY / total) * 100));
  };

  window.addEventListener('scroll', () => {
    const pct = currentScrollPct();
    if (pct > engagementState.maxScrollPct) engagementState.maxScrollPct = pct;
    depthMarks.forEach(mark => {
      const key = `${engagementState.activeTab}:${mark}`;
      if (pct >= mark && !engagementState.firedDepths.has(key)) {
        engagementState.firedDepths.add(key);
        trackEvent('scroll_depth', { tab_name: engagementState.activeTab, depth_percent: mark });
      }
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const secs = Math.max(1, Math.round((Date.now() - engagementState.tabEnterAt) / 1000));
      trackEvent('time_on_tab', { tab_name: engagementState.activeTab, seconds_spent: secs });
    } else if (document.visibilityState === 'visible') {
      engagementState.tabEnterAt = Date.now();
    }
  });
}

function initStarsBackground() {
  const container = document.querySelector('.stars-bg');
  if (!container) return;

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    star.style.setProperty('--max-opacity', `${Math.random() * 0.6 + 0.2}`);
    star.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(star);
  }
}

function initNavigation() {
  const nav = document.querySelector('.nav');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const tabLinks = document.querySelectorAll('[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.textContent = '☰';
      });
    });
  }

  function activateTab(tabId, updateHash = true) {
    if (!tabId) return;
    let matched = false;
    tabPanels.forEach(panel => {
      const isActive = panel.id === tabId;
      panel.classList.toggle('active', isActive);
      if (isActive) matched = true;
    });
    if (!matched) return;

    tabLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabId);
    });

    if (updateHash) {
      history.replaceState(null, '', `#${tabId}`);
    }
    const spentSecs = Math.max(1, Math.round((Date.now() - engagementState.tabEnterAt) / 1000));
    trackEvent('time_on_tab', { tab_name: engagementState.activeTab, seconds_spent: spentSecs });
    engagementState.activeTab = tabId;
    engagementState.tabEnterAt = Date.now();
    engagementState.maxScrollPct = 0;
    trackEvent('tab_view', { tab_name: tabId });
    if (tabId === 'bang-gia') {
      trackEvent('premium_view', { source: 'tab_navigation' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(link.dataset.tab);
    });
  });

  const hashTab = (window.location.hash || '').replace('#', '');
  if (hashTab) activateTab(hashTab, false);
  else trackEvent('tab_view', { tab_name: engagementState.activeTab });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Chart layout: maps 12 earthly branches to grid positions
// Grid layout (4x4 with center 2x2):
// Row 0: Tỵ(5) Ngọ(6) Mùi(7) Thân(8)
// Row 1: Thìn(4) [center] [center] Dậu(9)
// Row 2: Mão(3) [center] [center] Tuất(10)
// Row 3: Dần(2) Sửu(1) Tý(0) Hợi(11)
const GRID_POSITIONS = {
  5: { col: 1, row: 1 }, // Tỵ
  6: { col: 2, row: 1 }, // Ngọ
  7: { col: 3, row: 1 }, // Mùi
  8: { col: 4, row: 1 }, // Thân
  4: { col: 1, row: 2 }, // Thìn
  9: { col: 4, row: 2 }, // Dậu
  3: { col: 1, row: 3 }, // Mão
  10: { col: 4, row: 3 }, // Tuất
  2: { col: 1, row: 4 }, // Dần
  1: { col: 2, row: 4 }, // Sửu
  0: { col: 3, row: 4 }, // Tý
  11: { col: 4, row: 4 } // Hợi
};

function initTuViForm() {
  const form = document.getElementById('tuvi-form');
  if (!form) return;

  const viewYearSelect = document.getElementById('view-year');
  if (viewYearSelect) {
    const nowYear = new Date().getFullYear();
    const hasOption = Array.from(viewYearSelect.options).some(opt => Number(opt.value) === nowYear);
    if (!hasOption) {
      const extra = document.createElement('option');
      extra.value = String(nowYear);
      extra.textContent = String(nowYear);
      viewYearSelect.appendChild(extra);
    }
    viewYearSelect.value = String(nowYear);
  }

  const calendarType = document.getElementById('calendar-type');
  if (calendarType) {
    calendarType.addEventListener('change', () => {
      const label = document.querySelector('label[for="birth-date"]');
      if (label) {
        label.textContent = calendarType.value === 'lunar' ? 'Ngày sinh (Âm lịch)' : 'Ngày sinh (Dương lịch)';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    trackEvent('generate_chart_submit');
    calculateAndDisplay();
  });
}

function calculateAndDisplay() {
  const name = document.getElementById('user-name')?.value || 'Bạn';
  const dateStr = document.getElementById('birth-date')?.value;
  const hourStr = document.getElementById('birth-hour')?.value;
  const minuteStr = document.getElementById('birth-minute')?.value;
  const timezoneStr = document.getElementById('timezone')?.value;
  const gender = document.getElementById('gender')?.value;
  const calType = document.getElementById('calendar-type')?.value;
  const viewYearStr = document.getElementById('view-year')?.value;
  const viewMonthStr = document.getElementById('view-month')?.value;

  if (!dateStr || hourStr === '' || minuteStr === '' || !gender || !viewYearStr || !viewMonthStr) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const timezone = Number(timezoneStr || 7);
  const viewYear = Number(viewYearStr);
  const viewMonth = Number(viewMonthStr);
  const isLunar = calType === 'lunar';

  const loading = document.querySelector('.loading-overlay');
  if (loading) {
    loading.classList.add('active');
  }

  setTimeout(() => {
    try {
      const chartData = TuViEngine.calculate({
        name, year, month, day, hour, minute, timezone, gender, isLunar, viewYear, viewMonth
      });

      renderChart(chartData);
      renderAnalysis(chartData);

      const result = document.querySelector('.tuvi-result');
      if (result) {
        result.classList.add('visible');
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      trackEvent('generate_chart_success', {
        calendar_type: isLunar ? 'lunar' : 'solar',
        gender: gender,
        view_year: viewYear,
        view_month: viewMonth
      });
      startPremiumFakeNotifications();
    } catch (err) {
      console.error('Calculation error:', err);
      trackEvent('generate_chart_error', { reason: 'calculation_exception' });
      alert('Có lỗi xảy ra khi tính toán. Vui lòng kiểm tra lại thông tin nhập.');
    } finally {
      if (loading) loading.classList.remove('active');
    }
  }, 1500);
}

function renderChart(data) {
  const container = document.getElementById('tuvi-chart');
  if (!container) return;
  container.innerHTML = '';

  // Title bar
  const titleBar = document.querySelector('.chart-title-bar');
  if (titleBar) {
    titleBar.querySelector('h2').textContent = `Tổng quan lá số của ${data.name || 'Bạn'}`;
  }

  // Position labels: T.1 through T.12 mapped to Dia Chi order starting from Dan
  const posLabels = {};
  for (let i = 0; i < 12; i++) {
    posLabels[(2 + i) % 12] = `T.${i + 1}`;
  }

  const brightnessLabels = { 'M': 'M', 'V': 'V', 'Đ': 'Đ', 'B': 'B', 'H': 'H' };

  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 4; col++) {
      if ((row === 2 || row === 3) && (col === 2 || col === 3)) continue;

      const branchIdx = Object.keys(GRID_POSITIONS).find(k =>
        GRID_POSITIONS[k].col === col && GRID_POSITIONS[k].row === row
      );
      if (branchIdx === undefined) continue;

      const palace = data.palaces[parseInt(branchIdx)];
      const posIdx = parseInt(branchIdx);

      const cell = document.createElement('div');
      cell.className = `chart-cell${palace.isMenh ? ' menh-palace' : ''}`;
      cell.style.gridColumn = col;
      cell.style.gridRow = row;

      // Build abbreviated Can+Chi
      const canAbbr = (palace.cungCan || '').charAt(0);
      const chiName = palace.branch;
      const posAbbr = `${canAbbr}.${chiName}`;

      // Palace name with markers
      let palaceName = palace.palaceName.toUpperCase();
      let markers = '';
      if (palace.isTuan) markers += '<span class="cell-marker">Tuần</span>';
      if (palace.isTriet) markers += '<span class="cell-marker">Triệt</span>';

      // Separate major stars from auxiliary stars
      const majorStars = palace.stars.filter(s => s.type === 'major');
      const auxStars = palace.stars.filter(s => s.type !== 'major');

      function renderStar(s) {
        const elClass = s.element ? `star-el-${s.element}` : 'star-el-default';
        const isMajor = s.type === 'major';
        const bLabel = s.brightness ? ` (${brightnessLabels[s.brightness] || s.brightness})` : '';
        return `<div class="star-text ${isMajor ? 'is-major' : ''} ${elClass}">${s.name}<span class="brightness">${bLabel}</span></div>`;
      }

      const mainHTML = majorStars.map(renderStar).join('');
      const auxHTML = auxStars.map(renderStar).join('');

      cell.innerHTML = `
        <div class="cell-header">
          <span class="cell-header-left">${posAbbr}</span>
          <span class="cell-header-palace">${palaceName}${markers}</span>
          <span class="cell-header-age">${palace.daiHan || ''}</span>
        </div>
        <div class="cell-body">
          <div class="cell-stars-main">${mainHTML}</div>
          <div class="cell-stars-aux">${auxHTML}</div>
        </div>
        <div class="cell-footer">
          <span class="cell-footer-branch">${chiName}</span>
          <span class="cell-footer-phase">${palace.truongSinh || ''}</span>
          <span class="cell-footer-pos">${posLabels[posIdx] || ''}</span>
        </div>
      `;

      cell.addEventListener('click', () => showPalaceDetail(data, palace.palaceName));
      container.appendChild(cell);
    }
  }

  // Center cell
  const center = document.createElement('div');
  center.className = 'chart-cell center';
  center.style.gridColumn = '2 / 4';
  center.style.gridRow = '2 / 4';

  const genderText = data.gender === 'male' ? 'Nam' : 'Nữ';
  const birthMinute = Number.isFinite(data.minute) ? String(data.minute).padStart(2, '0') : '00';
  const timezoneText = Number.isFinite(data.timezone) ? `GMT${data.timezone >= 0 ? '+' : ''}${data.timezone}` : 'GMT+7';
  const solarVn = data.solarDateVn || data.solarDate;
  const solarVnText = `${String(solarVn.day).padStart(2, '0')}/${String(solarVn.month).padStart(2, '0')}/${solarVn.year}`;

  center.innerHTML = `
    <div class="center-info">
      <div class="center-title">LÁ SỐ TỬ VI</div>
      <table class="center-info-table">
        <tr><td>Họ tên</td><td>${data.name || ''}</td></tr>
        <tr><td>Năm</td><td>${data.lunarDate.year} &nbsp; ${data.yearName}</td></tr>
        <tr><td>Tháng</td><td>${data.lunarDate.month}</td></tr>
        <tr><td>Ngày</td><td>${data.lunarDate.day}</td></tr>
        <tr><td>Giờ</td><td>${data.hourBranch} (${String(data.hour).padStart(2, '0')}:${birthMinute})</td></tr>
        <tr><td>Múi giờ</td><td>${timezoneText}</td></tr>
        <tr><td>Dương lịch (quy VN)</td><td>${solarVnText}</td></tr>
        <tr><td>Năm xem</td><td>${data.viewYear}</td></tr>
        <tr><td>Tháng xem</td><td>Âm lịch tháng ${data.viewMonth}</td></tr>
      </table>
      <div class="center-extra">
        ${data.amDuong} ${genderText}<br>
        Mệnh: <span>${data.napAm}</span><br>
        Cục: <span>${data.cucName}</span><br>
        Mệnh chủ: <span>${data.menhCung}</span><br>
        Thân chủ: <span>${data.thanCung}</span>
      </div>
    </div>
  `;

  container.appendChild(center);

  // Legend bar
  renderChartLegend();
}

function renderChartLegend() {
  let legend = document.querySelector('.chart-legend');
  if (legend) {
    legend.innerHTML = '';
  } else {
    legend = document.createElement('div');
    legend.className = 'chart-legend';
    const chartContainer = document.getElementById('tuvi-chart');
    if (chartContainer) chartContainer.parentNode.insertBefore(legend, chartContainer.nextSibling);
  }

  legend.innerHTML = `
    <div class="legend-brightness">
      <b>M</b>: <span>Miếu</span>
      <b>V</b>: <span>Vượng</span>
      <b>Đ</b>: <span>Đắc</span>
      <b>B</b>: <span>Bình hòa</span>
      <b>H</b>: <span>Hãm</span>
    </div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--el-kim)"></div> Kim</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--el-moc)"></div> Mộc</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--el-thuy)"></div> Thủy</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--el-hoa)"></div> Hỏa</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--el-tho)"></div> Thổ</div>
  `;
}

function renderAnalysis(data) {
  const panels = {
    'overview': TuViAnalysis.generateOverview(data),
    'menh': TuViAnalysis.generateMenhAnalysis(data),
    'stars': TuViAnalysis.generateStarAnalysis(data),
    'career': TuViAnalysis.generateCareerAnalysis(data),
    'love': TuViAnalysis.generateLoveAnalysis(data),
    'health': TuViAnalysis.generateHealthAnalysis(data),
    'fortune': TuViAnalysis.generateFortuneAnalysis(data)
  };

  for (const [id, html] of Object.entries(panels)) {
    const panel = document.getElementById(`panel-${id}`);
    if (panel) {
      panel.innerHTML = '';
      typeWriterEffect(panel, html);
      if (id !== 'overview') {
        panel.classList.add('analysis-panel-locked');
        if (!panel.querySelector('.analysis-lock-overlay')) {
          const lock = document.createElement('div');
          lock.className = 'analysis-lock-overlay';
          lock.innerHTML = `
            <div class="analysis-lock-inner">
              <p>Nội dung chuyên sâu chỉ dành cho gói Premium</p>
              <button type="button" class="btn-primary analysis-unlock-btn">Mở khóa</button>
            </div>
          `;
          panel.appendChild(lock);
          const unlockBtn = lock.querySelector('.analysis-unlock-btn');
          if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
              trackEvent('premium_unlock_click', { source: 'analysis_lock_overlay' });
              const pricingTab = document.querySelector('.nav-links [data-tab="bang-gia"]');
              if (pricingTab) pricingTab.click();
            });
          }
        }
      } else {
        panel.classList.remove('analysis-panel-locked');
      }
    }
  }

  const firstTab = document.querySelector('.analysis-tab');
  if (firstTab) firstTab.click();
}

function typeWriterEffect(container, html) {
  const wrapper = document.createElement('div');
  wrapper.className = 'analysis-card glass-card';
  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  wrapper.style.opacity = '0';
  wrapper.style.transform = 'translateY(10px)';

  requestAnimationFrame(() => {
    wrapper.style.transition = 'all 0.5s ease';
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translateY(0)';
  });
}

function showPalaceDetail(data, palaceName) {
  const palace = data.palaces.find(p => p.palaceName === palaceName);
  const html = TuViAnalysis.generatePalaceDetail(data, palaceName);
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; backdrop-filter: blur(5px);
  `;

  const majorStars = palace ? palace.stars.filter(s => s.type === 'major') : [];
  const auxStars = palace ? palace.stars.filter(s => s.type !== 'major') : [];

  function starListHTML(stars) {
    return stars.map(s => {
      const elClass = s.element ? `star-el-${s.element}` : '';
      const bLabel = s.brightness ? ` (${s.brightness})` : '';
      return `<span class="${elClass}" style="margin-right:8px;">${s.name}${bLabel}</span>`;
    }).join('');
  }

  modal.innerHTML = `
    <div style="max-width:520px;width:100%;max-height:80vh;overflow-y:auto;position:relative;
      background:#fff;border-radius:12px;padding:2rem;color:#333;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <button onclick="this.closest('div[style]').remove()" style="
        position:absolute;top:0.75rem;right:1rem;background:none;border:none;
        color:#999;font-size:1.5rem;cursor:pointer;
      ">✕</button>
      <h3 style="color:var(--accent-orange);font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;">
        ${palaceName} — ${palace ? palace.branch : ''}
      </h3>
      <div style="font-size:0.85rem;color:#666;margin-bottom:1rem;">
        Đại Hạn: ${palace ? palace.daiHan : ''} tuổi &nbsp;|&nbsp; ${palace ? palace.truongSinh : ''}
        ${palace && palace.isTuan ? ' &nbsp;| Tuần' : ''}${palace && palace.isTriet ? ' &nbsp;| Triệt' : ''}
      </div>
      ${majorStars.length ? `<div style="margin-bottom:0.75rem;"><strong style="font-size:0.8rem;color:#888;">Chính tinh:</strong><div style="font-size:0.95rem;font-weight:600;margin-top:4px;">${starListHTML(majorStars)}</div></div>` : ''}
      ${auxStars.length ? `<div style="margin-bottom:1rem;"><strong style="font-size:0.8rem;color:#888;">Phụ tinh:</strong><div style="font-size:0.85rem;margin-top:4px;">${starListHTML(auxStars)}</div></div>` : ''}
      <div style="border-top:1px solid #eee;padding-top:1rem;font-size:0.9rem;color:#555;line-height:1.7;">
        ${html}
      </div>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function initAnalysisTabs() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('analysis-tab')) {
      const tabs = document.querySelectorAll('.analysis-tab');
      const panels = document.querySelectorAll('.analysis-panel');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      e.target.classList.add('active');
      const targetPanel = document.getElementById(e.target.dataset.panel);
      if (targetPanel) targetPanel.classList.add('active');
      trackEvent('analysis_tab_click', { panel: e.target.dataset.panel || '' });
    }
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a,button');
    if (!link) return;

    if (link.matches('a[href*="zalo.me/0917389458"]')) {
      trackEvent('zalo_support_click', { placement: 'floating_or_footer' });
    }

    if (link.matches('.btn-pricing.primary, .btn-pricing.outline, [data-tab="bang-gia"]')) {
      trackEvent('pricing_cta_click', { text: (link.textContent || '').trim() });
    }
  });
}

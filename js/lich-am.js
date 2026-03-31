(() => {
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

  function pad2(n) { return String(n).padStart(2, '0'); }
  function weekdayVi(date) {
    return ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];
  }
  function getHourBranchLabel(hour) {
    const h = Number(hour);
    if (h >= 23 || h < 1) return 'Tý';
    if (h < 3) return 'Sửu'; if (h < 5) return 'Dần'; if (h < 7) return 'Mão';
    if (h < 9) return 'Thìn'; if (h < 11) return 'Tỵ'; if (h < 13) return 'Ngọ';
    if (h < 15) return 'Mùi'; if (h < 17) return 'Thân'; if (h < 19) return 'Dậu';
    if (h < 21) return 'Tuất'; return 'Hợi';
  }

  function buildMonthCalendar(y, mo) {
    const container = document.getElementById('month-calendar');
    if (!container) return;
    const firstDay = new Date(y, mo - 1, 1);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const startDow = firstDay.getDay();

    let html = '<table class="lunar-detail-table month-cal-table"><thead><tr>';
    ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].forEach(function(dn) { html += '<th>' + dn + '</th>'; });
    html += '</tr></thead><tbody><tr>';
    for (let i = 0; i < startDow; i++) html += '<td></td>';
    for (let day = 1; day <= daysInMonth; day++) {
      if ((startDow + day - 1) % 7 === 0 && day > 1) html += '</tr><tr>';
      let lunarStr = '';
      try {
        const sl = Solar.fromYmdHms(y, mo, day, 12, 0, 0).getLunar();
        const ld = sl.getDay();
        const lm = Math.abs(sl.getMonth());
        lunarStr = ld === 1 ? pad2(ld) + '/' + pad2(lm) : String(ld);
      } catch (e) {}
      const sel = document.getElementById('duong-date');
      const isSelected = sel && sel.value === y + '-' + pad2(mo) + '-' + pad2(day);
      html += '<td class="cal-day' + (isSelected ? ' cal-selected' : '') + '" data-day="' + day + '"><div class="cal-solar">' + day + '</div><div class="cal-lunar">' + lunarStr + '</div></td>';
    }
    const remaining = (7 - (startDow + daysInMonth) % 7) % 7;
    for (let i = 0; i < remaining; i++) html += '<td></td>';
    html += '</tr></tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.cal-day').forEach(function(td) {
      td.style.cursor = 'pointer';
      td.addEventListener('click', function() {
        const dateInput = document.getElementById('duong-date');
        if (dateInput) {
          dateInput.value = y + '-' + pad2(mo) + '-' + pad2(Number(td.getAttribute('data-day')));
          render();
        }
      });
    });
  }

  function render() {
    const dateInput = document.getElementById('duong-date');
    if (!dateInput || !dateInput.value || typeof Solar === 'undefined') return;
    const h = Number(document.getElementById('duong-hour')?.value || 12);
    const m = Number(document.getElementById('duong-minute')?.value || 0);
    const [y, mo, d] = dateInput.value.split('-').map(Number);
    const solar = Solar.fromYmdHms(y, mo, d, h, m, 0);
    const lunar = solar.getLunar();

    const lunarDay = lunar.getDay();
    const lunarMonthSigned = lunar.getMonth();
    const lunarMonth = Math.abs(lunarMonthSigned);
    const lunarYear = lunar.getYear();
    const isLeap = lunarMonthSigned < 0;

    const dayCanIdx = lunar.getDayGanIndex();
    const dayChiIdx = lunar.getDayZhiIndex();
    const monthCanIdx = lunar.getMonthGanIndex();
    const monthChiIdx = lunar.getMonthZhiIndex();
    const yearCanIdx = lunar.getYearGanIndex();
    const yearChiIdx = lunar.getYearZhiIndex();

    const canChiDay = CAN[dayCanIdx] + ' ' + CHI[dayChiIdx];
    const canChiMonth = CAN[monthCanIdx] + ' ' + CHI[monthChiIdx];
    const canChiYear = CAN[yearCanIdx] + ' ' + CHI[yearChiIdx];
    const weekday = weekdayVi(new Date(y, mo - 1, d));

    const setText = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };

    setText('lunar-title', 'Lịch âm ngày ' + d + ' tháng ' + mo + ' năm ' + y);
    setText('lunar-subtitle', weekday + ' — giờ ' + pad2(h) + ':' + pad2(m) + ' (' + getHourBranchLabel(h) + ')');
    setText('duong-summary', pad2(d) + '-' + pad2(mo) + '-' + y);
    setText('am-summary', pad2(lunarDay) + '-' + pad2(lunarMonth) + '-' + lunarYear + (isLeap ? ' (nhuận)' : ''));
    setText('canchi-summary', 'Ngày ' + canChiDay + ', tháng ' + canChiMonth + (isLeap ? ' (nhuận)' : '') + ', năm ' + canChiYear);
    setText('tbl-duong-month', 'Tháng ' + mo + ' năm ' + y);
    setText('tbl-am-month', 'Tháng ' + lunarMonth + (isLeap ? ' (nhuận)' : '') + ' năm ' + lunarYear);
    setText('tbl-duong-day', 'Ngày ' + d);
    setText('tbl-am-day', 'Ngày ' + lunarDay);
    setText('tbl-weekday', weekday);
    setText('tbl-canchi', 'Ngày ' + canChiDay + ', tháng ' + canChiMonth + (isLeap ? ' (nhuận)' : '') + ', năm ' + canChiYear);

    buildMonthCalendar(y, mo);

    var HOUR_RANGES = ['Tý (23-1)', 'Sửu (1-3)', 'Dần (3-5)', 'Mão (5-7)', 'Thìn (7-9)', 'Tỵ (9-11)',
                       'Ngọ (11-13)', 'Mùi (13-15)', 'Thân (15-17)', 'Dậu (17-19)', 'Tuất (19-21)', 'Hợi (21-23)'];
    var HOANG_DAO_MAP = {
      0: [0, 1, 4, 6, 7, 10],
      1: [2, 3, 6, 8, 9, 0],
      2: [4, 5, 8, 10, 11, 2],
      3: [0, 1, 4, 6, 7, 10],
      4: [2, 3, 6, 8, 9, 0],
      5: [4, 5, 8, 10, 11, 2],
      6: [0, 1, 4, 6, 7, 10],
      7: [2, 3, 6, 8, 9, 0],
      8: [4, 5, 8, 10, 11, 2],
      9: [0, 1, 4, 6, 7, 10],
      10: [2, 3, 6, 8, 9, 0],
      11: [4, 5, 8, 10, 11, 2]
    };
    var hdSet = HOANG_DAO_MAP[dayChiIdx] || [];
    var goodH = [];
    var badH = [];
    for (var gi = 0; gi < 12; gi++) {
      if (hdSet.indexOf(gi) >= 0) goodH.push(HOUR_RANGES[gi]);
      else badH.push(HOUR_RANGES[gi]);
    }
    setText('good-hours', goodH.join(', '));
    setText('bad-hours', badH.join(', '));
  }

  document.addEventListener('DOMContentLoaded', function() {
    var dateInput = document.getElementById('duong-date');
    if (dateInput && !dateInput.value) {
      var now = new Date();
      dateInput.value = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
    }
    var btn = document.getElementById('lookup-btn');
    if (btn) btn.addEventListener('click', render);
    render();
  });
})();

/**
 * Tử Vi Engine - Vietnamese Astrology Calculation
 * Implements traditional Tử Vi (Purple Star) astrology algorithms
 */

const TuViEngine = (() => {
  const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

  const CUNG_NAMES = [
    'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
    'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
  ];

  const NGU_HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];

  const CUC_TABLE = {
    'Giáp': [2, 6, 3, 5, 4, 2, 6, 3, 5, 4, 2, 6],
    'Ất':   [5, 4, 2, 6, 3, 5, 4, 2, 6, 3, 5, 4],
    'Bính': [6, 3, 5, 4, 2, 6, 3, 5, 4, 2, 6, 3],
    'Đinh': [4, 2, 6, 3, 5, 4, 2, 6, 3, 5, 4, 2],
    'Mậu': [3, 5, 4, 2, 6, 3, 5, 4, 2, 6, 3, 5],
    'Kỷ':   [2, 6, 3, 5, 4, 2, 6, 3, 5, 4, 2, 6],
    'Canh': [5, 4, 2, 6, 3, 5, 4, 2, 6, 3, 5, 4],
    'Tân':  [6, 3, 5, 4, 2, 6, 3, 5, 4, 2, 6, 3],
    'Nhâm': [4, 2, 6, 3, 5, 4, 2, 6, 3, 5, 4, 2],
    'Quý':  [3, 5, 4, 2, 6, 3, 5, 4, 2, 6, 3, 5]
  };

  const CUC_NAMES = { 2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục' };

  const NAP_AM_TABLE = [
    'Hải Trung Kim', 'Hải Trung Kim', 'Lư Trung Hỏa', 'Lư Trung Hỏa',
    'Đại Lâm Mộc', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Lộ Bàng Thổ',
    'Kiếm Phong Kim', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa', 'Sơn Đầu Hỏa',
    'Giản Hạ Thủy', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Thành Đầu Thổ',
    'Bạch Lạp Kim', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Dương Liễu Mộc',
    'Tuyền Trung Thủy', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Ốc Thượng Thổ',
    'Tích Lịch Hỏa', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Tùng Bách Mộc',
    'Trường Lưu Thủy', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sa Trung Kim',
    'Sơn Hạ Hỏa', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bình Địa Mộc',
    'Bích Thượng Thổ', 'Bích Thượng Thổ', 'Kim Bạch Kim', 'Kim Bạch Kim',
    'Phú Đăng Hỏa', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Thiên Hà Thủy',
    'Đại Dịch Thổ', 'Đại Dịch Thổ', 'Thoa Xuyến Kim', 'Thoa Xuyến Kim',
    'Tang Đố Mộc', 'Tang Đố Mộc', 'Đại Khê Thủy', 'Đại Khê Thủy',
    'Sa Trung Thổ', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thiên Thượng Hỏa',
    'Thạch Lựu Mộc', 'Thạch Lựu Mộc', 'Đại Hải Thủy', 'Đại Hải Thủy'
  ];

  // Simplified solar to lunar conversion with lookup-based approximation
  function solarToLunar(year, month, day) {
    // Approximate lunar date (simplified - for demo purposes)
    // In production, use a full lunar calendar database
    const lunarNewYear = getLunarNewYearDate(year);
    const solarDate = new Date(year, month - 1, day);
    const lnyDate = new Date(year, lunarNewYear.month - 1, lunarNewYear.day);

    if (solarDate < lnyDate) {
      const prevLny = getLunarNewYearDate(year - 1);
      const prevLnyDate = new Date(year - 1, prevLny.month - 1, prevLny.day);
      const daysDiff = Math.floor((solarDate - prevLnyDate) / 86400000);
      const lunarMonth = Math.floor(daysDiff / 29.5) + 1;
      const lunarDay = (daysDiff % 30) + 1;
      return {
        year: year - 1,
        month: Math.min(Math.max(lunarMonth, 1), 12),
        day: Math.min(Math.max(lunarDay, 1), 30),
        isLeap: false
      };
    }

    const daysDiff = Math.floor((solarDate - lnyDate) / 86400000);
    const lunarMonth = Math.floor(daysDiff / 29.5) + 1;
    const lunarDay = (daysDiff % 30) + 1;

    return {
      year: year,
      month: Math.min(Math.max(lunarMonth, 1), 12),
      day: Math.min(Math.max(lunarDay, 1), 30),
      isLeap: false
    };
  }

  function getLunarNewYearDate(year) {
    const lnyDates = {
      1940: {month:2,day:8}, 1941: {month:1,day:27}, 1942: {month:2,day:15}, 1943: {month:2,day:5},
      1944: {month:1,day:25}, 1945: {month:2,day:13}, 1946: {month:2,day:2}, 1947: {month:1,day:22},
      1948: {month:2,day:10}, 1949: {month:1,day:29}, 1950: {month:2,day:17}, 1951: {month:2,day:6},
      1952: {month:1,day:27}, 1953: {month:2,day:14}, 1954: {month:2,day:3}, 1955: {month:1,day:24},
      1956: {month:2,day:12}, 1957: {month:1,day:31}, 1958: {month:2,day:18}, 1959: {month:2,day:8},
      1960: {month:1,day:28}, 1961: {month:2,day:15}, 1962: {month:2,day:5}, 1963: {month:1,day:25},
      1964: {month:2,day:13}, 1965: {month:2,day:2}, 1966: {month:1,day:21}, 1967: {month:2,day:9},
      1968: {month:1,day:30}, 1969: {month:2,day:17}, 1970: {month:2,day:6}, 1971: {month:1,day:27},
      1972: {month:2,day:15}, 1973: {month:2,day:3}, 1974: {month:1,day:23}, 1975: {month:2,day:11},
      1976: {month:1,day:31}, 1977: {month:2,day:18}, 1978: {month:2,day:7}, 1979: {month:1,day:28},
      1980: {month:2,day:16}, 1981: {month:2,day:5}, 1982: {month:1,day:25}, 1983: {month:2,day:13},
      1984: {month:2,day:2}, 1985: {month:2,day:20}, 1986: {month:2,day:9}, 1987: {month:1,day:29},
      1988: {month:2,day:17}, 1989: {month:2,day:6}, 1990: {month:1,day:27}, 1991: {month:2,day:15},
      1992: {month:2,day:4}, 1993: {month:1,day:23}, 1994: {month:2,day:10}, 1995: {month:1,day:31},
      1996: {month:2,day:19}, 1997: {month:2,day:7}, 1998: {month:1,day:28}, 1999: {month:2,day:16},
      2000: {month:2,day:5}, 2001: {month:1,day:24}, 2002: {month:2,day:12}, 2003: {month:2,day:1},
      2004: {month:1,day:22}, 2005: {month:2,day:9}, 2006: {month:1,day:29}, 2007: {month:2,day:18},
      2008: {month:2,day:7}, 2009: {month:1,day:26}, 2010: {month:2,day:14}, 2011: {month:2,day:3},
      2012: {month:1,day:23}, 2013: {month:2,day:10}, 2014: {month:1,day:31}, 2015: {month:2,day:19},
      2016: {month:2,day:8}, 2017: {month:1,day:28}, 2018: {month:2,day:16}, 2019: {month:2,day:5},
      2020: {month:1,day:25}, 2021: {month:2,day:12}, 2022: {month:2,day:1}, 2023: {month:1,day:22},
      2024: {month:2,day:10}, 2025: {month:1,day:29}, 2026: {month:2,day:17}, 2027: {month:2,day:6},
      2028: {month:1,day:26}, 2029: {month:2,day:13}, 2030: {month:2,day:3}
    };
    return lnyDates[year] || { month: 2, day: 5 };
  }

  /** Dương → Âm chuẩn khi đã load `js/vendor/lunar-javascript.js` (global `Solar`). */
  function solarToLunarLib(year, month, day, hour, minute) {
    if (typeof Solar === 'undefined') return null;
    try {
      const solar = Solar.fromYmdHms(year, month, day, hour | 0, minute | 0, 0);
      const lunar = solar.getLunar();
      const lm = lunar.getMonth();
    return {
      year: lunar.getYear(),
      month: lm < 0 ? Math.abs(lm) : lm,
      monthSigned: lm,
      day: lunar.getDay(),
      isLeap: lm < 0,
      lunar
    };
    } catch (e) {
      return null;
    }
  }

  function getThienCan(year) {
    return THIEN_CAN[(year - 4) % 10];
  }

  function getDiaChi(year) {
    return DIA_CHI[(year - 4) % 12];
  }

  function getNapAm(year) {
    const idx = ((year - 4) % 60 + 60) % 60;
    return NAP_AM_TABLE[idx] || 'Chưa xác định';
  }

  // Get the chart layout position index from Địa Chi index
  // Chart layout: Tỵ(0) Ngọ(1) Mùi(2) Thân(3) / Thìn(4) ... Dậu(5) / Mão(6) ... Tuất(7) / Dần(8) Sửu(9) Tý(10) Hợi(11)
  // Mapping: Tý=0 Sửu=1 Dần=2 Mão=3 Thìn=4 Tỵ=5 Ngọ=6 Mùi=7 Thân=8 Dậu=9 Tuất=10 Hợi=11
  const BRANCH_INDEX = { 'Tý': 0, 'Sửu': 1, 'Dần': 2, 'Mão': 3, 'Thìn': 4, 'Tỵ': 5, 'Ngọ': 6, 'Mùi': 7, 'Thân': 8, 'Dậu': 9, 'Tuất': 10, 'Hợi': 11 };

  function getCungMenh(lunarMonth, hourBranch) {
    const monthIdx = lunarMonth;
    const hourIdx = BRANCH_INDEX[hourBranch];
    let menhIdx = (2 + monthIdx - 1 + (12 - hourIdx)) % 12;
    return menhIdx;
  }

  function getCungThan(lunarMonth, hourBranch) {
    const monthIdx = lunarMonth;
    const hourIdx = BRANCH_INDEX[hourBranch];
    let thanIdx = (2 + monthIdx - 1 + hourIdx) % 12;
    return thanIdx;
  }

  /** Cục (2–6) theo công thức phổ biến (iztro / nhiều trang tử vi VN): từ Thiên Can + Địa Chi của cung Mệnh */
  function fixIndex(idx, max) {
    let n = idx;
    while (n < 0) n += max;
    while (n > max - 1) n -= max;
    return n;
  }

  function getCucFromMenhStemBranch(stemIdx, branchIdx) {
    if (stemIdx < 0 || branchIdx < 0) return 4;
    const fiveElementsTable = [3, 4, 2, 6, 5];
    const heavenlyStemNumber = Math.floor(stemIdx / 2) + 1;
    const eb6 = fixIndex(branchIdx, 6);
    const earthlyBranchNumber = Math.floor(eb6 / 2) + 1;
    let index = heavenlyStemNumber + earthlyBranchNumber;
    while (index > 5) index -= 5;
    return fiveElementsTable[index - 1] || 4;
  }

  /** Fallback: bảng cũ theo can năm (không khớp chuẩn; chỉ khi không đủ dữ liệu) */
  function getCucLegacy(thienCan, menhPosition) {
    const canTable = CUC_TABLE[thienCan];
    if (!canTable) return 4;
    return canTable[menhPosition] || 4;
  }

  /** Giờ dương → chỉ số 0–12 (iztro): 0 sớm Tý, …, 11 Hợi, 12 hoàn Tý (23h). */
  function getIztroTimeIndex(hour) {
    const h = hour | 0;
    if (h >= 23) return 12;
    if (h < 1) return 0;
    return Math.floor((h + 1) / 2);
  }

  /**
   * Vị trí Tử Vi (index Địa Chi: Tý=0 … Hợi=11) — thuật toán「起紫微星诀」(chuẩn iztro / tuvi.vn).
   * Bước đếm trong thư viện gốc là từ Dần=0; ở đây đổi sang Tý=0 bằng (+2)%12.
   */
  function placeTuViStar(cucNum, lunarDay, hour, lunarYear, lunarMonthSigned) {
    const cucVal = cucNum;
    const d0 = Math.min(Math.max(lunarDay | 0, 1), 30);
    let maxDays = 30;
    if (typeof LunarMonth !== 'undefined' && lunarYear && lunarMonthSigned) {
      try {
        const mObj = LunarMonth.fromYm(lunarYear, lunarMonthSigned);
        if (mObj && mObj.getDayCount) maxDays = mObj.getDayCount();
      } catch (e) { /* ignore */ }
    }
    const timeIndex = getIztroTimeIndex(hour);
    let dayAdj = d0;
    if (timeIndex === 12) dayAdj += 1;
    if (dayAdj > maxDays) dayAdj -= maxDays;

    let remainder = -1;
    let quotient;
    let offset = -1;
    do {
      offset += 1;
      const divisor = dayAdj + offset;
      quotient = Math.floor(divisor / cucVal);
      remainder = divisor % cucVal;
    } while (remainder !== 0);

    quotient %= 12;
    let ziweiIztro = quotient - 1;
    if (offset % 2 === 0) ziweiIztro += offset;
    else ziweiIztro -= offset;
    ziweiIztro = fixIndex(ziweiIztro, 12);
    return (ziweiIztro + 2) % 12;
  }

  function placeStars(tuViPos, lunarMonth, lunarDay, thienCan, diaChi, hourBranch, gender, menhPos) {
    const stars = {};
    for (let i = 0; i < 12; i++) stars[i] = [];

    // Tử Vi star group (follows Tử Vi)
    const tuViGroupOffsets = {
      'Tử Vi': 0,
      'Thiên Cơ': -1,
      'Thái Dương': -3,
      'Vũ Khúc': -4,
      'Thiên Đồng': -5,
      'Liêm Trinh': -8
    };

    for (const [name, offset] of Object.entries(tuViGroupOffsets)) {
      const pos = ((tuViPos + offset) % 12 + 12) % 12;
      stars[pos].push({ name, type: 'major' });
    }

    // Thiên Phủ star group (mirrors Tử Vi)
    const thienPhuPos = (12 - tuViPos + 4) % 12;
    const thienPhuGroupOffsets = {
      'Thiên Phủ': 0,
      'Thái Âm': 1,
      'Tham Lang': 2,
      'Cự Môn': 3,
      'Thiên Tướng': 4,
      'Thiên Lương': 5,
      'Thất Sát': 6,
      'Phá Quân': 10
    };

    for (const [name, offset] of Object.entries(thienPhuGroupOffsets)) {
      const pos = (thienPhuPos + offset) % 12;
      stars[pos].push({ name, type: 'major' });
    }

    // Lộc Tồn and supporting stars
    const locTonMap = { 'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Đinh': 6, 'Mậu': 5, 'Kỷ': 6, 'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0 };
    const locTonPos = locTonMap[thienCan];
    if (locTonPos !== undefined) {
      stars[locTonPos].push({ name: 'Lộc Tồn', type: 'good' });
      stars[(locTonPos + 1) % 12].push({ name: 'Kình Dương', type: 'bad' });
      stars[(locTonPos + 11) % 12].push({ name: 'Đà La', type: 'bad' });
    }

    // Tả Phù, Hữu Bật (from month)
    stars[(4 + lunarMonth - 1) % 12].push({ name: 'Tả Phù', type: 'good' });
    stars[(10 - lunarMonth + 1 + 12) % 12].push({ name: 'Hữu Bật', type: 'good' });

    // Văn Xương, Văn Khúc (from hour)
    const hourIdx = BRANCH_INDEX[hourBranch];
    stars[(10 - hourIdx + 12) % 12].push({ name: 'Văn Xương', type: 'good' });
    stars[(4 + hourIdx) % 12].push({ name: 'Văn Khúc', type: 'good' });

    // Hóa stars (from Thiên Can)
    const hoaStars = getHoaStars(thienCan);
    for (const [hoaName, targetStar] of Object.entries(hoaStars)) {
      for (let i = 0; i < 12; i++) {
        const found = stars[i].find(s => s.name === targetStar);
        if (found) {
          const hoaType = hoaName === 'Hóa Kỵ' ? 'bad' : (hoaName === 'Hóa Lộc' || hoaName === 'Hóa Quyền' ? 'good' : 'neutral');
          stars[i].push({ name: hoaName, type: hoaType });
          break;
        }
      }
    }

    // Thiên Khôi, Thiên Việt
    const khoiVietMap = {
      'Giáp': [1, 7], 'Ất': [0, 8], 'Bính': [11, 9], 'Đinh': [11, 9],
      'Mậu': [1, 7], 'Kỷ': [0, 8], 'Canh': [6, 2], 'Tân': [6, 2],
      'Nhâm': [3, 5], 'Quý': [3, 5]
    };

    if (khoiVietMap[thienCan]) {
      stars[khoiVietMap[thienCan][0]].push({ name: 'Thiên Khôi', type: 'good' });
      stars[khoiVietMap[thienCan][1]].push({ name: 'Thiên Việt', type: 'good' });
    }

    // Thiên Mã (from Địa Chi)
    const maMap = { 'Tý': 2, 'Sửu': 11, 'Dần': 8, 'Mão': 5, 'Thìn': 2, 'Tỵ': 11, 'Ngọ': 8, 'Mùi': 5, 'Thân': 2, 'Dậu': 11, 'Tuất': 8, 'Hợi': 5 };
    const maPos = maMap[diaChi];
    if (maPos !== undefined) {
      stars[maPos].push({ name: 'Thiên Mã', type: 'good' });
    }

    // Hồng Loan, Thiên Hỉ
    const hlPos = (3 - BRANCH_INDEX[diaChi] + 12) % 12;
    stars[hlPos].push({ name: 'Hồng Loan', type: 'good' });
    stars[(hlPos + 6) % 12].push({ name: 'Thiên Hỉ', type: 'good' });

    // Địa Không, Địa Kiếp (from hour)
    stars[(11 - hourIdx + 12) % 12].push({ name: 'Địa Không', type: 'bad' });
    stars[(hourIdx + 11) % 12].push({ name: 'Địa Kiếp', type: 'bad' });

    // Thiên Không
    const thienKhongMap = { 'Giáp': 1, 'Ất': 2, 'Bính': 3, 'Đinh': 4, 'Mậu': 5, 'Kỷ': 8, 'Canh': 9, 'Tân': 10, 'Nhâm': 11, 'Quý': 0 };
    if (thienKhongMap[thienCan] !== undefined) {
      stars[thienKhongMap[thienCan]].push({ name: 'Thiên Không', type: 'bad' });
    }

    // Long Trì, Phượng Các (from year branch)
    const branchIdx = BRANCH_INDEX[diaChi];
    stars[(branchIdx + 4) % 12].push({ name: 'Long Trì', type: 'neutral' });
    stars[(10 - branchIdx + 12) % 12].push({ name: 'Phượng Các', type: 'neutral' });

    // ===== Thái Tuế cycle (12 stars from year branch) =====
    const thaiTueNames = [
      { name: 'Thái Tuế', type: 'bad' }, { name: 'Thiếu Dương', type: 'neutral' },
      { name: 'Tang Môn', type: 'bad' }, { name: 'Thiếu Âm', type: 'neutral' },
      { name: 'Quan Phù', type: 'bad' }, { name: 'Tử Phù', type: 'bad' },
      { name: 'Tuế Phá', type: 'bad' }, { name: 'Long Đức', type: 'good' },
      { name: 'Bạch Hổ', type: 'bad' }, { name: 'Phúc Đức', type: 'good' },
      { name: 'Điếu Khách', type: 'bad' }, { name: 'Trực Phù', type: 'neutral' }
    ];
    for (let i = 0; i < 12; i++) {
      const pos = (branchIdx + i) % 12;
      stars[pos].push(thaiTueNames[i]);
    }

    // ===== Hỏa Tinh, Linh Tinh (Sát tinh, from year branch + hour + gender) =====
    const amDuongLocal = getAmDuong(thienCan);
    const isDuongChieu = (amDuongLocal === 'Dương' && gender === 'male') || (amDuongLocal === 'Âm' && gender === 'female');
    const hoaTinhStart = { 2: 1, 6: 1, 10: 1, 8: 2, 0: 2, 4: 2, 5: 3, 9: 3, 1: 3, 11: 9, 3: 9, 7: 9 };
    const linhTinhStart = { 2: 3, 6: 3, 10: 3, 8: 10, 0: 10, 4: 10, 5: 10, 9: 10, 1: 10, 11: 10, 3: 10, 7: 10 };
    const htStart = hoaTinhStart[branchIdx] !== undefined ? hoaTinhStart[branchIdx] : 1;
    const ltStart = linhTinhStart[branchIdx] !== undefined ? linhTinhStart[branchIdx] : 3;
    const htPos = isDuongChieu ? (htStart + hourIdx) % 12 : ((htStart - hourIdx) % 12 + 12) % 12;
    const ltPos = isDuongChieu ? ((ltStart - hourIdx) % 12 + 12) % 12 : (ltStart + hourIdx) % 12;
    stars[htPos].push({ name: 'Hỏa Tinh', type: 'bad' });
    stars[ltPos].push({ name: 'Linh Tinh', type: 'bad' });

    // ===== Đào Hoa (from year branch) =====
    const daoHoaMap = { 0: 9, 4: 9, 8: 9, 2: 3, 6: 3, 10: 3, 1: 6, 5: 6, 9: 6, 3: 0, 7: 0, 11: 0 };
    const daoHoaPos = daoHoaMap[branchIdx];
    if (daoHoaPos !== undefined) {
      stars[daoHoaPos].push({ name: 'Đào Hoa', type: 'neutral' });
    }

    // ===== Cô Thần, Quả Tú (from year branch) =====
    const coQuaMap = {
      2: [5, 1], 3: [5, 1], 4: [5, 1],
      5: [8, 4], 6: [8, 4], 7: [8, 4],
      8: [11, 7], 9: [11, 7], 10: [11, 7],
      11: [2, 10], 0: [2, 10], 1: [2, 10]
    };
    const cq = coQuaMap[branchIdx];
    if (cq) {
      stars[cq[0]].push({ name: 'Cô Thần', type: 'bad' });
      stars[cq[1]].push({ name: 'Quả Tú', type: 'bad' });
    }

    // ===== Thiên Y (from month) =====
    const thienYMap = [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    const thienYPos = thienYMap[lunarMonth] !== undefined ? thienYMap[lunarMonth] : 0;
    stars[thienYPos].push({ name: 'Thiên Y', type: 'good' });

    // ===== Thiên Đức, Nguyệt Đức (from year stem) =====
    const thienDucMap = { 'Giáp': 9, 'Ất': 8, 'Bính': 11, 'Đinh': 10, 'Mậu': 1, 'Kỷ': 0, 'Canh': 3, 'Tân': 2, 'Nhâm': 5, 'Quý': 4 };
    const nguyetDucMap = { 'Giáp': 5, 'Ất': 4, 'Bính': 7, 'Đinh': 6, 'Mậu': 9, 'Kỷ': 8, 'Canh': 11, 'Tân': 10, 'Nhâm': 1, 'Quý': 0 };
    if (thienDucMap[thienCan] !== undefined) stars[thienDucMap[thienCan]].push({ name: 'Thiên Đức', type: 'good' });
    if (nguyetDucMap[thienCan] !== undefined) stars[nguyetDucMap[thienCan]].push({ name: 'Nguyệt Đức', type: 'good' });

    // ===== Ân Quang (from Văn Xương + day), Thiên Quý (from Văn Khúc + day) =====
    const vanXuongPos = (10 - hourIdx + 12) % 12;
    const vanKhucPos = (4 + hourIdx) % 12;
    const anQuangPos = (vanXuongPos + lunarDay - 2 + 12) % 12;
    const thienQuyPos = (vanKhucPos - lunarDay + 2 + 12) % 12;
    stars[anQuangPos].push({ name: 'Ân Quang', type: 'good' });
    stars[thienQuyPos].push({ name: 'Thiên Quý', type: 'good' });

    // ===== Thiên Quan, Thiên Phúc (from year stem) =====
    const thienQuanMap = { 'Giáp': 7, 'Ất': 4, 'Bính': 0, 'Đinh': 3, 'Mậu': 3, 'Kỷ': 6, 'Canh': 6, 'Tân': 9, 'Nhâm': 9, 'Quý': 0 };
    const thienPhucMap = { 'Giáp': 9, 'Ất': 8, 'Bính': 0, 'Đinh': 11, 'Mậu': 6, 'Kỷ': 5, 'Canh': 3, 'Tân': 2, 'Nhâm': 0, 'Quý': 11 };
    if (thienQuanMap[thienCan] !== undefined) stars[thienQuanMap[thienCan]].push({ name: 'Thiên Quan', type: 'good' });
    if (thienPhucMap[thienCan] !== undefined) stars[thienPhucMap[thienCan]].push({ name: 'Thiên Phúc', type: 'good' });

    // ===== Tam Thai (from Tả Phù + day), Bát Tọa (from Hữu Bật + month) =====
    const taPhuPos = (4 + lunarMonth - 1) % 12;
    const huuBatPos = (10 - lunarMonth + 1 + 12) % 12;
    const tamThaiPos = (taPhuPos + lunarDay - 1) % 12;
    const batToaPos = ((huuBatPos - lunarMonth + 1) % 12 + 12) % 12;
    stars[tamThaiPos].push({ name: 'Tam Thai', type: 'good' });
    stars[batToaPos].push({ name: 'Bát Tọa', type: 'good' });

    // ===== Thiên Hư (from year branch) =====
    stars[(branchIdx + 6) % 12].push({ name: 'Thiên Hư', type: 'bad' });

    // ===== Kiếp Sát (from year branch) =====
    const kiepSatMap = { 0: 5, 4: 5, 8: 5, 1: 2, 5: 2, 9: 2, 2: 11, 6: 11, 10: 11, 3: 8, 7: 8, 11: 8 };
    if (kiepSatMap[branchIdx] !== undefined) stars[kiepSatMap[branchIdx]].push({ name: 'Kiếp Sát', type: 'bad' });

    // ===== Phá Toái (from year branch) =====
    const phaToaiMap = { 0: 5, 1: 1, 2: 9, 3: 5, 4: 1, 5: 9, 6: 5, 7: 1, 8: 9, 9: 5, 10: 1, 11: 9 };
    if (phaToaiMap[branchIdx] !== undefined) stars[phaToaiMap[branchIdx]].push({ name: 'Phá Toái', type: 'bad' });

    // ===== Thiên Riêu (from month) =====
    stars[(lunarMonth + 3) % 12].push({ name: 'Thiên Riêu', type: 'bad' });

    // ===== Giải Thần (from month) =====
    stars[(lunarMonth + 5) % 12].push({ name: 'Giải Thần', type: 'good' });

    // ===== Thiên Thương (at Nô Bộc), Thiên Sứ (at Tật Ách) =====
    const noBocPos = (menhPos + 5) % 12;
    const tatAchPos = (menhPos + 7) % 12;
    stars[noBocPos].push({ name: 'Thiên Thương', type: 'bad' });
    stars[tatAchPos].push({ name: 'Thiên Sứ', type: 'bad' });

    // ===== Lưu Hà, Thiên Trù (from year stem) =====
    const luuHaMap = { 'Giáp': 9, 'Ất': 10, 'Bính': 0, 'Đinh': 3, 'Mậu': 6, 'Kỷ': 6, 'Canh': 3, 'Tân': 0, 'Nhâm': 9, 'Quý': 6 };
    const thienTruMap = { 'Giáp': 5, 'Ất': 6, 'Bính': 5, 'Đinh': 6, 'Mậu': 5, 'Kỷ': 6, 'Canh': 5, 'Tân': 6, 'Nhâm': 5, 'Quý': 6 };
    if (luuHaMap[thienCan] !== undefined) stars[luuHaMap[thienCan]].push({ name: 'Lưu Hà', type: 'bad' });
    if (thienTruMap[thienCan] !== undefined) stars[thienTruMap[thienCan]].push({ name: 'Thiên Trù', type: 'good' });

    // ===== Quốc Ấn (from year stem) =====
    const quocAnMap = { 'Giáp': 7, 'Ất': 8, 'Bính': 5, 'Đinh': 6, 'Mậu': 5, 'Kỷ': 6, 'Canh': 11, 'Tân': 0, 'Nhâm': 11, 'Quý': 0 };
    if (quocAnMap[thienCan] !== undefined) stars[quocAnMap[thienCan]].push({ name: 'Quốc Ấn', type: 'good' });

    // ===== Đường Phù (from year stem) =====
    const duongPhuMap = { 'Giáp': 1, 'Ất': 2, 'Bính': 4, 'Đinh': 5, 'Mậu': 4, 'Kỷ': 5, 'Canh': 7, 'Tân': 8, 'Nhâm': 10, 'Quý': 11 };
    if (duongPhuMap[thienCan] !== undefined) stars[duongPhuMap[thienCan]].push({ name: 'Đường Phù', type: 'neutral' });

    // ===== Thai Phụ, Phong Cáo (from year stem) =====
    const thaiPhuMap = { 'Giáp': 1, 'Ất': 2, 'Bính': 4, 'Đinh': 5, 'Mậu': 4, 'Kỷ': 5, 'Canh': 7, 'Tân': 8, 'Nhâm': 10, 'Quý': 11 };
    const phongCaoMap = { 'Giáp': 3, 'Ất': 4, 'Bính': 6, 'Đinh': 7, 'Mậu': 6, 'Kỷ': 7, 'Canh': 9, 'Tân': 10, 'Nhâm': 0, 'Quý': 1 };
    if (thaiPhuMap[thienCan] !== undefined) stars[thaiPhuMap[thienCan]].push({ name: 'Thai Phụ', type: 'good' });
    if (phongCaoMap[thienCan] !== undefined) stars[phongCaoMap[thienCan]].push({ name: 'Phong Cáo', type: 'good' });

    // ===== Thiên Hình (from month) =====
    stars[(9 + lunarMonth - 1) % 12].push({ name: 'Thiên Hình', type: 'bad' });

    // ===== Thiên La / Địa Võng (fixed positions) =====
    stars[4].push({ name: 'Thiên La', type: 'bad' });
    stars[10].push({ name: 'Địa Võng', type: 'bad' });

    // ===== Bác Sỹ cycle (12 stars from Lộc Tồn, direction by gender) =====
    if (locTonPos !== undefined) {
      const bacSyNames = [
        { name: 'Bác Sỹ', type: 'neutral' }, { name: 'Lực Sỹ', type: 'neutral' },
        { name: 'Thanh Long', type: 'good' }, { name: 'Tiểu Hao', type: 'bad' },
        { name: 'Tướng Quân', type: 'neutral' }, { name: 'Tấu Thư', type: 'good' },
        { name: 'Phi Liêm', type: 'bad' }, { name: 'Hỷ Thần', type: 'good' },
        { name: 'Bệnh Phù', type: 'bad' }, { name: 'Đại Hao', type: 'bad' },
        { name: 'Phục Bình', type: 'bad' }, { name: 'Quan Phủ', type: 'bad' }
      ];
      const bsForward = isDuongChieu;
      for (let i = 0; i < 12; i++) {
        const pos = bsForward ? (locTonPos + i) % 12 : ((locTonPos - i) % 12 + 12) % 12;
        stars[pos].push(bacSyNames[i]);
      }
    }

    return stars;
  }

  function getHoaStars(thienCan) {
    const hoaMap = {
      'Giáp': { 'Hóa Lộc': 'Liêm Trinh', 'Hóa Quyền': 'Phá Quân', 'Hóa Khoa': 'Vũ Khúc', 'Hóa Kỵ': 'Thái Dương' },
      'Ất':   { 'Hóa Lộc': 'Thiên Cơ', 'Hóa Quyền': 'Thiên Lương', 'Hóa Khoa': 'Tử Vi', 'Hóa Kỵ': 'Thái Âm' },
      'Bính': { 'Hóa Lộc': 'Thiên Đồng', 'Hóa Quyền': 'Thiên Cơ', 'Hóa Khoa': 'Văn Xương', 'Hóa Kỵ': 'Liêm Trinh' },
      'Đinh': { 'Hóa Lộc': 'Thái Âm', 'Hóa Quyền': 'Thiên Đồng', 'Hóa Khoa': 'Thiên Cơ', 'Hóa Kỵ': 'Cự Môn' },
      'Mậu': { 'Hóa Lộc': 'Tham Lang', 'Hóa Quyền': 'Thái Âm', 'Hóa Khoa': 'Hữu Bật', 'Hóa Kỵ': 'Thiên Cơ' },
      'Kỷ':   { 'Hóa Lộc': 'Vũ Khúc', 'Hóa Quyền': 'Tham Lang', 'Hóa Khoa': 'Thiên Lương', 'Hóa Kỵ': 'Văn Khúc' },
      'Canh': { 'Hóa Lộc': 'Thái Dương', 'Hóa Quyền': 'Vũ Khúc', 'Hóa Khoa': 'Thái Âm', 'Hóa Kỵ': 'Thiên Đồng' },
      'Tân':  { 'Hóa Lộc': 'Cự Môn', 'Hóa Quyền': 'Thái Dương', 'Hóa Khoa': 'Văn Khúc', 'Hóa Kỵ': 'Văn Xương' },
      'Nhâm': { 'Hóa Lộc': 'Thiên Lương', 'Hóa Quyền': 'Tử Vi', 'Hóa Khoa': 'Tả Phù', 'Hóa Kỵ': 'Vũ Khúc' },
      'Quý':  { 'Hóa Lộc': 'Phá Quân', 'Hóa Quyền': 'Cự Môn', 'Hóa Khoa': 'Thái Âm', 'Hóa Kỵ': 'Tham Lang' }
    };
    return hoaMap[thienCan] || {};
  }

  function getAmDuong(thienCan) {
    const amCan = ['Ất', 'Đinh', 'Kỷ', 'Tân', 'Quý'];
    return amCan.includes(thienCan) ? 'Âm' : 'Dương';
  }

  function getHourBranch(hour) {
    if (!Number.isFinite(hour)) return 'Tý';
    if (hour >= 23 || hour < 1) return 'Tý';
    if (hour < 3) return 'Sửu';
    if (hour < 5) return 'Dần';
    if (hour < 7) return 'Mão';
    if (hour < 9) return 'Thìn';
    if (hour < 11) return 'Tỵ';
    if (hour < 13) return 'Ngọ';
    if (hour < 15) return 'Mùi';
    if (hour < 17) return 'Thân';
    if (hour < 19) return 'Dậu';
    if (hour < 21) return 'Tuất';
    return 'Hợi';
  }

  /** Chuẩn hóa thời điểm sinh về múi giờ GMT+7 (chuẩn dùng trong đa số lá số Tử Vi VN). */
  function normalizeToVnTimezone(year, month, day, hour, minute, timezone) {
    const tz = Number.isFinite(Number(timezone)) ? Number(timezone) : 7;
    const h = Number.isFinite(Number(hour)) ? Number(hour) : 0;
    const m = Number.isFinite(Number(minute)) ? Number(minute) : 0;
    const utcMs = Date.UTC(year, month - 1, day, h - tz, m, 0);
    const vn = new Date(utcMs + 7 * 3600 * 1000);
    return {
      year: vn.getUTCFullYear(),
      month: vn.getUTCMonth() + 1,
      day: vn.getUTCDate(),
      hour: vn.getUTCHours(),
      minute: vn.getUTCMinutes()
    };
  }

  function calculate(input) {
    const {
      name, year, month, day, hour, minute = 0, timezone = 7, gender, isLunar,
      viewYear, viewMonth
    } = input;

    const parsedHour = typeof hour === 'string' ? Number(hour) : hour;
    const hNumInput = Number.isFinite(parsedHour) ? parsedHour : 0;
    const minNumInput = Number.isFinite(Number(minute)) ? Number(minute) : 0;
    const birthVn = normalizeToVnTimezone(year, month, day, hNumInput, minNumInput, timezone);
    const hNum = birthVn.hour;
    const minNum = birthVn.minute;

    let lunarDate;
    let lunarSource = 'input';
    let lunarMonthSigned = month;
    if (isLunar) {
      lunarDate = { year, month, day, isLeap: false };
      lunarMonthSigned = month;
    } else {
      const libLunar = solarToLunarLib(birthVn.year, birthVn.month, birthVn.day, birthVn.hour, birthVn.minute);
      if (libLunar) {
        lunarDate = {
          year: libLunar.year,
          month: libLunar.month,
          day: libLunar.day,
          isLeap: libLunar.isLeap
        };
        lunarMonthSigned = libLunar.monthSigned;
        lunarSource = 'lunar-javascript';
      } else {
        lunarDate = solarToLunar(year, month, day);
        lunarMonthSigned = lunarDate.month;
        lunarSource = 'approx';
      }
    }

    const thienCan = getThienCan(lunarDate.year);
    const diaChi = getDiaChi(lunarDate.year);
    const hourBranch = getHourBranch(hNum);
    const amDuong = getAmDuong(thienCan);
    const napAm = getNapAm(lunarDate.year);

    const menhPos = getCungMenh(lunarDate.month, hourBranch);
    const thanPos = getCungThan(lunarDate.month, hourBranch);
    const cungCan = getCungCanChi(thienCan);
    const menhStem = cungCan[menhPos] || thienCan;
    const cuc = getCucLegacy(thienCan, menhPos);
    const cucName = CUC_NAMES[cuc] || 'Chưa xác định';

    const tuViPos = placeTuViStar(cuc, lunarDate.day, hNum, lunarDate.year, lunarMonthSigned);
    const stars = placeStars(tuViPos, lunarDate.month, lunarDate.day, thienCan, diaChi, hourBranch, gender, menhPos);

    // Assign palaces to positions
    const palaces = [];
    for (let i = 0; i < 12; i++) {
      const palaceIdx = ((i - menhPos) % 12 + 12) % 12;
      const branchForPos = DIA_CHI[i];
      palaces.push({
        position: i,
        branch: branchForPos,
        palaceName: CUNG_NAMES[palaceIdx],
        stars: stars[i] || [],
        isMenh: palaceIdx === 0,
        isThan: i === thanPos
      });
    }

    // Additional calculations for detailed chart display
    const truongSinh = getTruongSinhPhases(cuc, amDuong, gender);
    const daiHan = getDaiHanAges(menhPos, cuc, amDuong, gender);
    const tuanTriet = getTuanTriet(thienCan, diaChi);

    // Enrich palaces with additional data
    for (let i = 0; i < 12; i++) {
      palaces[i].truongSinh = truongSinh[i] || '';
      palaces[i].daiHan = daiHan[i] || 0;
      palaces[i].cungCan = cungCan[i] || '';
      palaces[i].isTuan = tuanTriet.tuan.includes(i);
      palaces[i].isTriet = tuanTriet.triet.includes(i);
      palaces[i].stars = palaces[i].stars.map(s => ({
        ...s,
        element: STAR_ELEMENTS[s.name] || '',
        brightness: getStarBrightness(s.name, i)
      }));
    }

    // Đại Vận & Tiểu Hạn for current year
    const selectedViewYear = Number.isFinite(viewYear) ? viewYear : new Date().getFullYear();
    const selectedViewMonth = Number.isFinite(viewMonth) ? Math.min(Math.max(viewMonth, 1), 12) : 1;
    const currentYear = selectedViewYear;
    const currentAge = currentYear - lunarDate.year + 1; // Vietnamese age for selected view year
    const yearBranchIdx = BRANCH_INDEX[diaChi];
    const daiVanInfo = getCurrentDaiVan(menhPos, cuc, amDuong, gender, currentAge);
    const tieuHanInfo = getCurrentTieuHan(amDuong, gender, yearBranchIdx, currentAge);
    const tamTai = getTamTaiYears(diaChi);
    const currentYearBranch = DIA_CHI[(currentYear - 4) % 12];
    const isTamTaiYear = tamTai.includes(currentYearBranch);

    // Palace type: Tứ Sinh, Tứ Mộ, Tứ Chính
    const tuSinh = [2, 5, 8, 11]; // Dần Tỵ Thân Hợi
    const tuMo = [4, 10, 1, 7];   // Thìn Tuất Sửu Mùi
    const tuChinh = [0, 3, 6, 9]; // Tý Mão Ngọ Dậu
    let menhPalaceType = 'Tứ Sinh';
    if (tuMo.includes(menhPos)) menhPalaceType = 'Tứ Mộ';
    else if (tuChinh.includes(menhPos)) menhPalaceType = 'Tứ Chính';

    return {
      name,
      gender,
      lunarDate,
      lunarSource,
      solarDate: { year, month, day },
      solarDateVn: { year: birthVn.year, month: birthVn.month, day: birthVn.day },
      thienCan,
      diaChi,
      yearName: `${thienCan} ${diaChi}`,
      hourBranch,
      hour: hNum,
      minute: minNum,
      timezone,
      amDuong,
      napAm,
      menhPos,
      thanPos,
      mingMenhCanChi: `${menhStem} ${DIA_CHI[menhPos]}`,
      cuc,
      cucName,
      tuViPos,
      palaces,
      menhCung: DIA_CHI[menhPos],
      thanCung: DIA_CHI[thanPos],
      currentAge,
      currentYear,
      viewYear: selectedViewYear,
      viewMonth: selectedViewMonth,
      daiVanInfo,
      tieuHanInfo,
      tamTai,
      isTamTaiYear,
      currentYearBranch,
      menhPalaceType,
      branchIdx: BRANCH_INDEX[diaChi]
    };
  }

  // Star element mapping (Ngũ Hành)
  const STAR_ELEMENTS = {
    'Tử Vi': 'tho', 'Thiên Cơ': 'moc', 'Thái Dương': 'hoa',
    'Vũ Khúc': 'kim', 'Thiên Đồng': 'thuy', 'Liêm Trinh': 'hoa',
    'Thiên Phủ': 'tho', 'Thái Âm': 'thuy', 'Tham Lang': 'moc',
    'Cự Môn': 'thuy', 'Thiên Tướng': 'thuy', 'Thiên Lương': 'moc',
    'Thất Sát': 'kim', 'Phá Quân': 'thuy',
    'Lộc Tồn': 'tho', 'Tả Phù': 'tho', 'Hữu Bật': 'thuy',
    'Văn Xương': 'kim', 'Văn Khúc': 'thuy',
    'Kình Dương': 'kim', 'Đà La': 'kim',
    'Hóa Lộc': 'moc', 'Hóa Quyền': 'moc', 'Hóa Khoa': 'thuy', 'Hóa Kỵ': 'thuy',
    'Thiên Khôi': 'hoa', 'Thiên Việt': 'hoa',
    'Thiên Mã': 'hoa', 'Hồng Loan': 'thuy', 'Thiên Hỉ': 'hoa',
    'Địa Không': 'hoa', 'Địa Kiếp': 'hoa', 'Thiên Không': 'hoa',
    'Long Trì': 'thuy', 'Phượng Các': 'thuy',
    'Hỏa Tinh': 'hoa', 'Linh Tinh': 'hoa',
    'Thái Tuế': 'hoa', 'Bạch Hổ': 'kim', 'Tang Môn': 'moc',
    'Quan Phù': 'hoa', 'Tử Phù': 'thuy', 'Tuế Phá': 'hoa',
    'Đào Hoa': 'moc', 'Cô Thần': 'hoa', 'Quả Tú': 'hoa',
    'Thiên Y': 'thuy', 'Thiên Đức': 'hoa', 'Nguyệt Đức': 'hoa',
    'Ân Quang': 'hoa', 'Thiên Quý': 'hoa',
    'Thiên Quan': 'hoa', 'Thiên Phúc': 'hoa',
    'Tam Thai': 'tho', 'Bát Tọa': 'tho',
    'Đại Hao': 'hoa', 'Thiên Hư': 'thuy',
    'Long Đức': 'thuy', 'Phúc Đức': 'tho',
    'Thiên Riêu': 'thuy', 'Giải Thần': 'moc',
    'Kiếp Sát': 'hoa', 'Phá Toái': 'hoa',
    'Thiên Thương': 'hoa', 'Thiên Sứ': 'hoa',
    'Thiên Hình': 'hoa', 'Lưu Hà': 'thuy', 'Thiên Trù': 'tho',
    'Quốc Ấn': 'tho', 'Đường Phù': 'moc',
    'Thai Phụ': 'tho', 'Phong Cáo': 'hoa',
    'Trực Phù': 'hoa', 'Điếu Khách': 'hoa',
    'Thiếu Dương': 'hoa', 'Thiếu Âm': 'thuy',
    'Thiên La': 'tho', 'Địa Võng': 'tho',
    'Bác Sỹ': 'thuy', 'Lực Sỹ': 'hoa', 'Thanh Long': 'thuy',
    'Tiểu Hao': 'hoa', 'Tướng Quân': 'moc', 'Tấu Thư': 'kim',
    'Phi Liêm': 'hoa', 'Hỷ Thần': 'hoa', 'Bệnh Phù': 'thuy',
    'Phục Bình': 'thuy', 'Quan Phủ': 'hoa'
  };

  // Star brightness by position (M=Miếu, V=Vượng, Đ=Đắc, B=Bình, H=Hãm)
  // Index: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ, 6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
  const STAR_BRIGHTNESS_TABLE = {
    'Tử Vi':      ['H','Đ','V','B','H','M','M','Đ','V','B','H','B'],
    'Thiên Cơ':   ['M','Đ','Đ','M','H','V','M','B','H','V','H','B'],
    'Thái Dương':  ['H','H','V','M','M','M','M','Đ','B','H','H','H'],
    'Vũ Khúc':    ['Đ','M','V','H','M','B','Đ','M','V','H','M','B'],
    'Thiên Đồng':  ['V','H','H','B','Đ','M','H','B','H','Đ','H','V'],
    'Liêm Trinh':  ['H','B','M','H','Đ','M','V','B','Đ','H','V','B'],
    'Thiên Phủ':   ['V','M','Đ','B','M','Đ','V','M','B','Đ','B','B'],
    'Thái Âm':    ['M','M','H','H','H','H','H','B','Đ','V','M','V'],
    'Tham Lang':   ['V','H','M','B','M','Đ','H','B','H','Đ','B','V'],
    'Cự Môn':     ['V','B','M','M','H','B','H','B','H','Đ','B','Đ'],
    'Thiên Tướng':  ['M','B','Đ','V','B','B','M','M','V','B','H','Đ'],
    'Thiên Lương':  ['M','B','B','V','Đ','H','M','H','B','B','H','Đ'],
    'Thất Sát':    ['M','B','M','H','V','Đ','B','B','M','H','V','H'],
    'Phá Quân':    ['H','B','V','H','M','H','M','B','Đ','B','B','H']
  };

  function getStarBrightness(starName, positionIdx) {
    const table = STAR_BRIGHTNESS_TABLE[starName];
    if (!table) return '';
    return table[positionIdx] || '';
  }

  // Trường Sinh 12 phases
  const TRUONG_SINH_PHASES = [
    'Trường Sinh', 'Mộc Dục', 'Quan Đái', 'Lâm Quan',
    'Đế Vượng', 'Suy', 'Bệnh', 'Tử',
    'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
  ];

  const TRUONG_SINH_START = {
    2: 8,  // Thủy → Thân
    3: 11, // Mộc → Hợi
    4: 5,  // Kim → Tỵ
    5: 8,  // Thổ → Thân
    6: 2   // Hỏa → Dần
  };

  function getTruongSinhPhases(cuc, amDuong, gender) {
    const startPos = TRUONG_SINH_START[cuc];
    if (startPos === undefined) return {};
    const isForward = (amDuong === 'Dương' && gender === 'male') || (amDuong === 'Âm' && gender === 'female');
    const phases = {};
    for (let i = 0; i < 12; i++) {
      const pos = isForward ? (startPos + i) % 12 : ((startPos - i) % 12 + 12) % 12;
      phases[pos] = TRUONG_SINH_PHASES[i];
    }
    return phases;
  }

  // Đại Hạn age calculation
  function getDaiHanAges(menhPos, cuc, amDuong, gender) {
    const isForward = (amDuong === 'Dương' && gender === 'male') || (amDuong === 'Âm' && gender === 'female');
    const startAge = cuc;
    const ages = {};
    for (let i = 0; i < 12; i++) {
      const pos = isForward ? (menhPos + i) % 12 : ((menhPos - i) % 12 + 12) % 12;
      ages[pos] = startAge + (i * 10);
    }
    return ages;
  }

  // Cung Thiên Can for each position
  function getCungCanChi(thienCan) {
    const startCanMap = {
      'Giáp': 2, 'Kỷ': 2,
      'Ất': 4, 'Canh': 4,
      'Bính': 6, 'Tân': 6,
      'Đinh': 8, 'Nhâm': 8,
      'Mậu': 0, 'Quý': 0
    };
    const startIdx = startCanMap[thienCan] || 0;
    const cans = {};
    for (let i = 0; i < 12; i++) {
      const branchIdx = (2 + i) % 12;
      const canIdx = (startIdx + i) % 10;
      cans[branchIdx] = THIEN_CAN[canIdx];
    }
    return cans;
  }

  // Tuần Không and Triệt Không
  function getTuanTriet(thienCan, diaChi) {
    const canIdx = THIEN_CAN.indexOf(thienCan);
    const chiIdx = DIA_CHI.indexOf(diaChi);
    const startBranch = ((chiIdx - canIdx) % 12 + 12) % 12;
    const tuan = [(startBranch + 10) % 12, (startBranch + 11) % 12];

    const trietMap = {
      'Giáp': [8, 9], 'Kỷ': [8, 9],
      'Ất': [6, 7], 'Canh': [6, 7],
      'Bính': [4, 5], 'Tân': [4, 5],
      'Đinh': [2, 3], 'Nhâm': [2, 3],
      'Mậu': [0, 1], 'Quý': [0, 1]
    };
    const triet = trietMap[thienCan] || [];

    return { tuan, triet };
  }

  // Current Đại Vận (10-year major fortune period)
  function getCurrentDaiVan(menhPos, cuc, amDuong, gender, currentAge) {
    const isForward = (amDuong === 'Dương' && gender === 'male') || (amDuong === 'Âm' && gender === 'female');
    const startAge = cuc;
    for (let i = 0; i < 12; i++) {
      const pos = isForward ? (menhPos + i) % 12 : ((menhPos - i) % 12 + 12) % 12;
      const fromAge = startAge + (i * 10);
      const toAge = fromAge + 9;
      if (currentAge >= fromAge && currentAge <= toAge) {
        return { position: pos, branch: DIA_CHI[pos], fromAge, toAge, index: i };
      }
    }
    return { position: menhPos, branch: DIA_CHI[menhPos], fromAge: startAge, toAge: startAge + 9, index: 0 };
  }

  // Current Tiểu Hạn (yearly fortune)
  function getCurrentTieuHan(amDuong, gender, yearBranchIdx, currentAge) {
    const isMale = gender === 'male';
    const tieuHanStartMap = {
      8: 10, 0: 10, 4: 10,   // Thân/Tý/Thìn → Tuất
      11: 1, 3: 1, 7: 1,     // Hợi/Mão/Mùi → Sửu
      2: 4, 6: 4, 10: 4,     // Dần/Ngọ/Tuất → Thìn
      5: 7, 9: 7, 1: 7       // Tỵ/Dậu/Sửu → Mùi
    };
    const startPos = tieuHanStartMap[yearBranchIdx] !== undefined ? tieuHanStartMap[yearBranchIdx] : 10;
    const direction = isMale ? 1 : -1;
    const pos = ((startPos + direction * (currentAge - 1)) % 12 + 12) % 12;
    return { position: pos, branch: DIA_CHI[pos] };
  }

  // Tam Tai (Three Disasters) years
  function getTamTaiYears(diaChi) {
    const tamTaiMap = {
      'Thân': ['Dần', 'Mão', 'Thìn'], 'Tý': ['Dần', 'Mão', 'Thìn'], 'Thìn': ['Dần', 'Mão', 'Thìn'],
      'Dần': ['Thân', 'Dậu', 'Tuất'], 'Ngọ': ['Thân', 'Dậu', 'Tuất'], 'Tuất': ['Thân', 'Dậu', 'Tuất'],
      'Tỵ': ['Hợi', 'Tý', 'Sửu'], 'Dậu': ['Hợi', 'Tý', 'Sửu'], 'Sửu': ['Hợi', 'Tý', 'Sửu'],
      'Hợi': ['Tỵ', 'Ngọ', 'Mùi'], 'Mão': ['Tỵ', 'Ngọ', 'Mùi'], 'Mùi': ['Tỵ', 'Ngọ', 'Mùi']
    };
    return tamTaiMap[diaChi] || [];
  }

  // Ngũ Hành tương sinh tương khắc
  const NGU_HANH_DATA = {
    'Kim': { sinh: 'Thủy', khac: 'Mộc', biSinh: 'Thổ', biKhac: 'Hỏa' },
    'Mộc': { sinh: 'Hỏa', khac: 'Thổ', biSinh: 'Thủy', biKhac: 'Kim' },
    'Thủy': { sinh: 'Mộc', khac: 'Hỏa', biSinh: 'Kim', biKhac: 'Thổ' },
    'Hỏa': { sinh: 'Thổ', khac: 'Kim', biSinh: 'Mộc', biKhac: 'Thủy' },
    'Thổ': { sinh: 'Kim', khac: 'Thủy', biSinh: 'Hỏa', biKhac: 'Mộc' }
  };

  // Extract Ngũ Hành from Nạp Âm
  function getNguHanhFromNapAm(napAm) {
    if (napAm.includes('Kim')) return 'Kim';
    if (napAm.includes('Mộc')) return 'Mộc';
    if (napAm.includes('Thủy')) return 'Thủy';
    if (napAm.includes('Hỏa')) return 'Hỏa';
    if (napAm.includes('Thổ')) return 'Thổ';
    return '';
  }

  // Ngũ Hành of Cục
  function getNguHanhCuc(cuc) {
    const map = { 2: 'Thủy', 3: 'Mộc', 4: 'Kim', 5: 'Thổ', 6: 'Hỏa' };
    return map[cuc] || '';
  }

  // Ngũ Hành of Thiên Can
  function getNguHanhCan(can) {
    const map = { 'Giáp': 'Mộc', 'Ất': 'Mộc', 'Bính': 'Hỏa', 'Đinh': 'Hỏa', 'Mậu': 'Thổ', 'Kỷ': 'Thổ', 'Canh': 'Kim', 'Tân': 'Kim', 'Nhâm': 'Thủy', 'Quý': 'Thủy' };
    return map[can] || '';
  }

  // Ngũ Hành of Địa Chi
  function getNguHanhChi(chi) {
    const map = { 'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy' };
    return map[chi] || '';
  }

  return {
    calculate, getHourBranch, solarToLunar, solarToLunarLib,
    DIA_CHI, THIEN_CAN, BRANCH_INDEX,
    NGU_HANH_DATA, getNguHanhFromNapAm, getNguHanhCuc, getNguHanhCan, getNguHanhChi
  };
})();

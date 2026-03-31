/**
 * Comprehensive AI-style Tử Vi Analysis Generator
 * Covers all major aspects of chart reading
 */

const TuViAnalysis = (() => {
  const STAR_MEANINGS = {
    'Tử Vi': { nature: 'Đế tinh, chủ quyền quý', pos: 'Cao quý, lãnh đạo, uy nghiêm, quyền thế', neg: 'Kiêu ngạo, độc đoán khi gặp sát tinh' },
    'Thiên Cơ': { nature: 'Mưu sĩ tinh, chủ trí tuệ', pos: 'Thông minh, linh hoạt, giỏi tính toán', neg: 'Hay thay đổi, thiếu kiên định' },
    'Thái Dương': { nature: 'Quý tinh, chủ quang minh', pos: 'Rộng rãi, hào phóng, danh tiếng', neg: 'Vất vả, bận rộn, hay lo' },
    'Vũ Khúc': { nature: 'Tài tinh, chủ tài lộc', pos: 'Giỏi kinh doanh, quyết đoán, tài giỏi', neg: 'Cô đơn, cứng nhắc trong tình cảm' },
    'Thiên Đồng': { nature: 'Phúc tinh, chủ phúc đức', pos: 'Hiền lành, nhàn nhã, được hưởng phúc', neg: 'Lười biếng, thiếu quyết đoán' },
    'Liêm Trinh': { nature: 'Tù tinh, chủ hình sự', pos: 'Liêm chính, ngay thẳng, tài năng', neg: 'Hay gặp thị phi, kiện tụng' },
    'Thiên Phủ': { nature: 'Lệnh tinh, chủ kho tàng', pos: 'Giàu có, ổn định, bao dung', neg: 'Bảo thủ, ngại thay đổi' },
    'Thái Âm': { nature: 'Phú tinh, chủ điền sản', pos: 'Thanh nhã, tài hoa, giàu tình cảm', neg: 'Đa cảm, hay buồn phiền' },
    'Tham Lang': { nature: 'Đào hoa tinh', pos: 'Đa tài, giao thiệp rộng, nghệ thuật', neg: 'Ham mê, đa tình' },
    'Cự Môn': { nature: 'Ám tinh, chủ thị phi', pos: 'Ăn nói giỏi, phân tích sắc bén', neg: 'Thị phi, khẩu thiệt' },
    'Thiên Tướng': { nature: 'Ấn tinh, chủ quan tước', pos: 'Phúc hậu, được quý nhân phù trợ', neg: 'Phụ thuộc, thiếu chủ kiến' },
    'Thiên Lương': { nature: 'Ấm tinh, chủ thọ', pos: 'Từ bi, thọ, học rộng', neg: 'Cô độc, khó hòa nhập' },
    'Thất Sát': { nature: 'Tướng tinh, chủ quyền uy', pos: 'Mạnh mẽ, quyết đoán, dũng cảm', neg: 'Hung hãn, hay gặp nguy hiểm' },
    'Phá Quân': { nature: 'Háo tinh, chủ tiêu hao', pos: 'Khai phá, đổi mới, dũng cảm', neg: 'Phá tán, bất ổn' }
  };

  function getPalace(data, name) {
    return data.palaces.find(p => p.palaceName === name);
  }

  function getMajorStars(palace) {
    return palace ? palace.stars.filter(s => s.type === 'major') : [];
  }

  function getStarsByType(palace, type) {
    return palace ? palace.stars.filter(s => s.type === type) : [];
  }

  function hasStarInPalace(palace, starName) {
    return palace ? palace.stars.some(s => s.name === starName) : false;
  }

  function starNames(stars) {
    return stars.map(s => s.name).join(', ');
  }

  // ==========================================
  // SECTION 1: TỔNG QUAN (Overview)
  // ==========================================
  function generateOverview(data) {
    let h = '';

    h += `<h3>A. Giới thiệu chung về Tử Vi và nguyên tắc gốc/phụ</h3>`;
    h += `<p>Tử Vi là hệ thống quan sát quy luật vận động của đời người thông qua Can Chi, 12 cung và hệ thống sao. Mục đích chính là hiểu bản thân, xu hướng vận trình, từ đó chủ động điều chỉnh hành vi và lựa chọn phù hợp.</p>`;
    h += `<p>Trong luận đoán, <strong>yếu tố gốc</strong> gồm: Mệnh, Thân, Can Chi năm sinh, Mệnh Cục, chính tinh thủ Mệnh và tam hợp Mệnh-Tài-Quan. <strong>Yếu tố phụ</strong> gồm: phụ tinh, vòng sao, Tuần/Triệt, hạn vận theo từng giai đoạn. Nguyên tắc cơ bản là lấy gốc làm trục chính, phụ để hiệu chỉnh bối cảnh và thời điểm.</p>`;

    // 1a. Can-Chi năm sinh
    h += `<h3>1. Can-Chi Năm Sinh</h3>`;
    const hanhCan = TuViEngine.getNguHanhCan(data.thienCan);
    const hanhChi = TuViEngine.getNguHanhChi(data.diaChi);
    h += `<p>Năm sinh <strong>${data.yearName}</strong> — Hàng Can <strong>${data.thienCan}</strong> (hành ${hanhCan}) là gốc của vận mệnh, hàng Chi <strong>${data.diaChi}</strong> (hành ${hanhChi}) là cành ngọn.</p>`;

    const nguHanhData = TuViEngine.NGU_HANH_DATA;
    if (hanhCan && hanhChi && nguHanhData[hanhCan]) {
      if (hanhCan === hanhChi) {
        h += `<p>Can Chi <strong>đồng hành ${hanhCan}</strong>, cho thấy bản mệnh thuần nhất, tính cách rõ ràng, nhất quán. Đây là nét chính yếu của vận mệnh — sức mạnh nội tại mạnh mẽ.</p>`;
      } else if (nguHanhData[hanhCan].sinh === hanhChi) {
        h += `<p>Can ${hanhCan} <strong>sinh</strong> Chi ${hanhChi} — Can sinh Chi là dấu hiệu của sự ban phát, hao tốn năng lượng nhưng cũng là người hào phóng, rộng rãi. Cần chú ý giữ sức.</p>`;
      } else if (nguHanhData[hanhCan].biSinh === hanhChi) {
        h += `<p>Chi ${hanhChi} <strong>sinh</strong> Can ${hanhCan} — Chi sinh Can, gốc được hỗ trợ, cuộc đời có nền tảng tốt, dễ gặp quý nhân và được giúp đỡ.</p>`;
      } else if (nguHanhData[hanhCan].khac === hanhChi) {
        h += `<p>Can ${hanhCan} <strong>khắc</strong> Chi ${hanhChi} — Can khắc Chi cho thấy tính cách mạnh mẽ, quyết đoán nhưng đời có nhiều biến động, cần kiên nhẫn vượt qua thử thách.</p>`;
      } else if (nguHanhData[hanhCan].biKhac === hanhChi) {
        h += `<p>Chi ${hanhChi} <strong>khắc</strong> Can ${hanhCan} — Chi khắc Can, gốc bị thương tổn. Cuộc đời thường gặp cản trở từ hoàn cảnh, nhưng nhờ đó mà rèn luyện bản lĩnh.</p>`;
      }
    }

    // 1b. Mệnh cục, mùa sinh, chính tinh
    h += `<h3>2. Mệnh Cục & Mùa Sinh</h3>`;
    const hanhNapAm = TuViEngine.getNguHanhFromNapAm(data.napAm);
    const hanhCuc = TuViEngine.getNguHanhCuc(data.cuc);
    h += `<p><strong>Nạp Âm:</strong> ${data.napAm} (hành ${hanhNapAm})</p>`;
    h += `<p><strong>Mệnh Cục:</strong> ${data.cucName} (hành ${hanhCuc})</p>`;

    if (hanhNapAm && hanhCuc && nguHanhData[hanhNapAm]) {
      if (hanhNapAm === hanhCuc) {
        h += `<p>Mệnh và Cục <strong>đồng hành</strong> — tốt, bản mệnh thuận lợi, nội lực mạnh.</p>`;
      } else if (nguHanhData[hanhCuc].biSinh === hanhNapAm) {
        h += `<p>Nạp Âm <strong>sinh</strong> Cục — mệnh được nuôi dưỡng, đời sống thuận hòa.</p>`;
      } else if (nguHanhData[hanhNapAm].biKhac === hanhCuc) {
        h += `<p>Cục <strong>khắc</strong> Nạp Âm — mệnh bị kìm hãm, cần nỗ lực nhiều hơn để thành công.</p>`;
      }
    }

    // Mùa sinh
    const mua = data.lunarDate.month;
    let muaText = '';
    if (mua >= 1 && mua <= 3) muaText = 'Xuân (Mộc vượng)';
    else if (mua >= 4 && mua <= 6) muaText = 'Hạ (Hỏa vượng)';
    else if (mua >= 7 && mua <= 9) muaText = 'Thu (Kim vượng)';
    else muaText = 'Đông (Thủy vượng)';
    h += `<p><strong>Mùa sinh:</strong> ${muaText} — Tháng ${mua} Âm lịch.</p>`;

    // Chính tinh thủ mệnh
    const menh = getPalace(data, 'Mệnh');
    const menhMajors = getMajorStars(menh);
    h += `<h3>3. Chính Tinh Thủ Mệnh</h3>`;
    if (menhMajors.length > 0) {
      h += `<p>Cung Mệnh tại <strong>${data.menhCung}</strong> có chính tinh: <strong>${starNames(menhMajors)}</strong>.</p>`;
      menhMajors.forEach(s => {
        const info = STAR_MEANINGS[s.name];
        if (info) {
          h += `<p><strong>${s.name}</strong> (${info.nature}): ${info.pos}. ${s.brightness ? `Trạng thái: ${getBrightnessText(s.brightness)}.` : ''}</p>`;
        }
      });
    } else {
      h += `<p>Cung Mệnh tại <strong>${data.menhCung}</strong> <strong>không có chính tinh tọa thủ</strong>. Khi Mệnh vô chính diệu, cần xem tam hợp (cung cách 4 vị trí) để xác định sao hội chiếu, đồng thời các phụ tinh đóng vai trò quan trọng hơn bình thường.</p>`;
    }

    // 1c. Âm Dương Ngũ Hành khí chất
    h += `<h3>4. Luận Khí Chất Âm Dương Ngũ Hành</h3>`;
    h += `<p><strong>${data.amDuong} ${data.gender === 'male' ? 'Nam' : 'Nữ'}</strong> — `;
    if (data.amDuong === 'Dương') {
      h += `Người thuộc hàng Dương Can, khí chất thiên về năng động, chủ động, hướng ngoại. `;
      if (data.gender === 'male') h += `Dương Nam thuận hành — Đại vận và vận hạn đi thuận chiều, cuộc đời phát triển theo hướng tích cực dần.`;
      else h += `Dương Nữ nghịch hành — vận hạn đi ngược, cuộc đời nhiều biến chuyển bất ngờ nhưng cũng tiềm ẩn may mắn.`;
    } else {
      h += `Người thuộc hàng Âm Can, khí chất thiên về nhu thuận, hướng nội, sâu sắc. `;
      if (data.gender === 'female') h += `Âm Nữ thuận hành — vận hạn thuận chiều, phát triển ổn định.`;
      else h += `Âm Nam nghịch hành — cuộc đời nhiều thay đổi, cần thích nghi linh hoạt.`;
    }
    h += `</p>`;

    if (hanhCuc) {
      const cucTraits = {
        'Thủy': 'thông minh, linh hoạt, giỏi giao tiếp nhưng đôi khi hay thay đổi',
        'Mộc': 'nhân từ, kiên nhẫn, giàu lòng bao dung nhưng đôi khi nhu nhược',
        'Kim': 'cương nghị, quyết đoán, trung thành nhưng đôi khi cứng nhắc',
        'Thổ': 'trung hậu, ổn định, đáng tin cậy nhưng đôi khi bảo thủ',
        'Hỏa': 'nhiệt tình, năng động, sáng tạo nhưng đôi khi nóng nảy'
      };
      h += `<p>Hành ${hanhCuc} của ${data.cucName}: ${cucTraits[hanhCuc] || ''}.</p>`;
    }

    h += `<h3>B. Tác giả và phạm vi luận giải</h3>`;
    h += `<p>Nội dung được tổng hợp theo logic Tử Vi truyền thống và hệ quy chiếu dữ liệu của hệ thống AI Tử Vi. Luận giải mang tính định hướng, không thay thế tư vấn y khoa, pháp lý hay tài chính chuyên môn.</p>`;

    return h;
  }

  function getBrightnessText(b) {
    const map = { 'M': 'Miếu (rất sáng)', 'V': 'Vượng (sáng)', 'Đ': 'Đắc (khá)', 'B': 'Bình hòa', 'H': 'Hãm (yếu)' };
    return map[b] || b;
  }

  // ==========================================
  // SECTION 2: LUẬN MỆNH (Destiny Analysis)
  // ==========================================
  function generateMenhAnalysis(data) {
    let h = '';

    // 2a. Luận tinh hệ Tử Vi
    h += `<h3>5. Luận Tinh Hệ Tử Vi</h3>`;
    const tuViPalace = data.palaces.find(p => p.stars.some(s => s.name === 'Tử Vi'));
    if (tuViPalace) {
      h += `<p>Sao <strong>Tử Vi</strong> tọa tại cung <strong>${tuViPalace.branch}</strong> (${tuViPalace.palaceName}). `;
      h += `Tử Vi là Đế tinh, vị trí của nó định hướng toàn bộ tinh hệ trên 12 cung địa bàn.</p>`;
      if (tuViPalace.palaceName === 'Mệnh') {
        h += `<p>Tử Vi tọa Mệnh — cách cục rất quý, người có phong thái lãnh đạo, khí chất cao quý, dễ được người kính trọng.</p>`;
      } else {
        h += `<p>Tử Vi tại cung ${tuViPalace.palaceName} — ảnh hưởng mạnh đến lĩnh vực ${tuViPalace.palaceName.toLowerCase()} trong đời.</p>`;
      }
    }

    // 2b. Luận chính tinh thủ mệnh — ý nghĩa 12 cung
    h += `<h3>6. Luận 12 Cung Chức Năng</h3>`;
    const importantPalaces = ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Phúc Đức', 'Thiên Di'];
    importantPalaces.forEach(pName => {
      const p = getPalace(data, pName);
      if (!p) return;
      const majors = getMajorStars(p);
      const goods = getStarsByType(p, 'good');
      const bads = getStarsByType(p, 'bad');
      h += `<p><strong>Cung ${pName}</strong> (${p.branch}): `;
      if (majors.length) {
        h += `${starNames(majors)}. `;
        majors.forEach(s => {
          const info = STAR_MEANINGS[s.name];
          if (info) h += `${s.name}: ${info.pos}. `;
        });
      } else {
        h += `Vô chính diệu. `;
      }
      if (goods.length > 3) h += `Nhiều cát tinh hội tụ (${starNames(goods.slice(0, 4))}...) — thuận lợi. `;
      if (bads.length > 2) h += `Nhiều hung tinh (${starNames(bads.slice(0, 3))}...) — cần cẩn thận. `;
      h += `</p>`;
    });

    // 2c. Luận Cung An Thân
    h += `<h3>7. Luận Cung An Thân</h3>`;
    const thanPalace = data.palaces.find(p => p.isThan);
    if (thanPalace) {
      h += `<p>Cung Thân an tại <strong>${thanPalace.branch}</strong> (${thanPalace.palaceName}). `;
      h += `Cung Thân biểu thị hậu vận (nửa đời sau). `;
      if (thanPalace.palaceName === 'Mệnh') {
        h += `Thân cư Mệnh — tiền vận và hậu vận hòa hợp, cuộc đời nhất quán.</p>`;
      } else {
        h += `Thân cư ${thanPalace.palaceName} — hậu vận chịu ảnh hưởng mạnh từ lĩnh vực ${thanPalace.palaceName.toLowerCase()}.</p>`;
        const thanMajors = getMajorStars(thanPalace);
        if (thanMajors.length) {
          h += `<p>Thân có chính tinh: ${starNames(thanMajors)} — hậu vận có chỗ dựa, không phải lo lắng nhiều.</p>`;
        }
      }
    }

    // 2d. Tứ Sinh / Tứ Mộ / Tứ Chính
    h += `<h3>8. Đặc Tính Tứ Sinh – Tứ Mộ – Tứ Chính Của Mệnh</h3>`;
    h += `<p>Cung Mệnh tại <strong>${data.menhCung}</strong> thuộc nhóm <strong>${data.menhPalaceType}</strong>.</p>`;
    if (data.menhPalaceType === 'Tứ Chính') {
      h += `<p><strong>Tứ Chính</strong> (Tý, Ngọ, Mão, Dậu): Đây là bốn cung chính vị, người sinh tại đây thường có tính cách rõ ràng, mạnh mẽ, quyết đoán. Vận mệnh thể hiện sớm, có nhiều cơ hội nhưng cũng nhiều thử thách.</p>`;
    } else if (data.menhPalaceType === 'Tứ Sinh') {
      h += `<p><strong>Tứ Sinh</strong> (Dần, Thân, Tỵ, Hợi): Đây là bốn cung sinh, người sinh tại đây thường năng động, linh hoạt, giỏi thích nghi. Cuộc đời nhiều biến đổi nhưng cũng nhiều cơ hội phát triển.</p>`;
    } else {
      h += `<p><strong>Tứ Mộ</strong> (Thìn, Tuất, Sửu, Mùi): Đây là bốn cung mộ khố, người sinh tại đây thường trầm tĩnh, sâu sắc, biết tích lũy. Cuộc đời phát triển chậm nhưng vững chắc, hậu vận thường tốt.</p>`;
    }

    // 2e. Luận cung Phúc
    h += `<h3>9. Luận Cung Phúc Đức</h3>`;
    const phuc = getPalace(data, 'Phúc Đức');
    if (phuc) {
      const phucMajors = getMajorStars(phuc);
      h += `<p>Cung Phúc Đức tại <strong>${phuc.branch}</strong> — phản ánh phúc phần gia tộc, đời sống tinh thần, và khả năng hưởng thụ.</p>`;
      if (phucMajors.length) {
        h += `<p>Chính tinh: <strong>${starNames(phucMajors)}</strong>. `;
        phucMajors.forEach(s => {
          if (s.name === 'Thiên Đồng') h += `Thiên Đồng tại Phúc — phúc đức tốt, đời sống an nhàn. `;
          if (s.name === 'Thiên Lương') h += `Thiên Lương tại Phúc — phúc thọ, có duyên tu hành. `;
          if (s.name === 'Thất Sát' || s.name === 'Phá Quân') h += `${s.name} tại Phúc — phúc đức tổ tiên bị hao tán, cần tự tạo phúc. `;
        });
        h += `</p>`;
      }
      if (hasStarInPalace(phuc, 'Địa Không') || hasStarInPalace(phuc, 'Địa Kiếp')) {
        h += `<p>Có Không Kiếp tại Phúc Đức — phúc đức bị hao tán, cần tu tâm tích đức.</p>`;
      }
    }

    h += `<h3>10. Thân - Tâm - Tính cách - Cảm xúc</h3>`;
    const menhMajors2 = getMajorStars(getPalace(data, 'Mệnh'));
    h += `<p>Khí chất tổng thể dựa trên Mệnh ${data.menhCung}, ${data.amDuong} và hành Cục. `;
    if (menhMajors2.length) {
      h += `Chính tinh thủ Mệnh (${starNames(menhMajors2)}) cho thấy mô thức phản ứng cảm xúc và phong cách hành xử nổi trội. `;
    }
    h += `Khi gặp giai đoạn áp lực, cần ưu tiên cân bằng cảm xúc, ngủ nghỉ điều độ và giữ nhịp sinh hoạt ổn định để giảm xung đột nội tâm.</p>`;

    return h;
  }

  // ==========================================
  // SECTION 3: LUẬN SAO (Star Analysis)
  // ==========================================
  function generateStarAnalysis(data) {
    let h = '';

    // 3a. Vòng Thái Tuế
    h += `<h3>10. Luận Vòng Sao Thái Tuế</h3>`;
    h += `<p>Vòng Thái Tuế gồm 12 sao an theo Địa Chi năm sinh, phản ánh các ảnh hưởng về thời vận và sự kiện trong đời.</p>`;
    const thaiTueInMenh = data.palaces.find(p => p.palaceName === 'Mệnh' && p.stars.some(s => s.name === 'Thái Tuế'));
    if (thaiTueInMenh) h += `<p><strong>Thái Tuế tại Mệnh</strong> — năm sinh trùng cung Mệnh, cẩn thận năm Thái Tuế, dễ gặp thị phi.</p>`;
    data.palaces.forEach(p => {
      if (hasStarInPalace(p, 'Tang Môn') && p.palaceName === 'Mệnh') h += `<p>Tang Môn tại Mệnh — cẩn thận chuyện tang tóc, buồn phiền.</p>`;
      if (hasStarInPalace(p, 'Bạch Hổ') && p.palaceName === 'Mệnh') h += `<p>Bạch Hổ tại Mệnh — tính cách mạnh, có thể gặp tai nạn nhỏ, kiện tụng.</p>`;
      if (hasStarInPalace(p, 'Long Đức') && p.palaceName === 'Mệnh') h += `<p>Long Đức tại Mệnh — quý nhân phù trợ, gặp may mắn.</p>`;
    });

    // 3b. Vòng Lộc Tồn
    h += `<h3>11. Luận Vòng Sao Lộc Tồn</h3>`;
    const locTonPalace = data.palaces.find(p => p.stars.some(s => s.name === 'Lộc Tồn'));
    if (locTonPalace) {
      h += `<p><strong>Lộc Tồn</strong> tại cung <strong>${locTonPalace.branch}</strong> (${locTonPalace.palaceName}). Lộc Tồn là tài tinh quan trọng, chủ tài lộc bền vững.</p>`;
      if (locTonPalace.palaceName === 'Mệnh') h += `<p>Lộc Tồn thủ Mệnh — người có phúc về tiền tài, cả đời không thiếu tiền, nhưng cẩn thận keo kiệt.</p>`;
      if (locTonPalace.palaceName === 'Tài Bạch') h += `<p>Lộc Tồn tại Tài Bạch — tài chính rất vững, biết kiếm tiền và giữ tiền.</p>`;
    }
    const kinhDuongPalace = data.palaces.find(p => p.stars.some(s => s.name === 'Kình Dương') && p.palaceName === 'Mệnh');
    if (kinhDuongPalace) h += `<p>Kình Dương tại Mệnh — tính cách cương cường, quyết liệt, nhiều thử thách nhưng cũng nhiều thành tựu.</p>`;

    // 3c. Vòng Trường Sinh
    h += `<h3>12. Luận Vòng Sao Trường Sinh</h3>`;
    const menh = getPalace(data, 'Mệnh');
    if (menh) {
      h += `<p>Cung Mệnh ở trạng thái <strong>${menh.truongSinh || 'chưa xác định'}</strong> trong vòng Trường Sinh.</p>`;
      const tsPhase = menh.truongSinh;
      const tsDesc = {
        'Trường Sinh': 'Khởi đầu thuận lợi, sinh lực mạnh, cuộc đời có nền tảng tốt.',
        'Mộc Dục': 'Nhiều đào hoa, cảm xúc phong phú, cần chú ý tình cảm.',
        'Quan Đái': 'Đang phát triển, có tiềm năng lớn, cần kiên nhẫn.',
        'Lâm Quan': 'Vận thịnh, sự nghiệp phát triển mạnh, gặp nhiều thuận lợi.',
        'Đế Vượng': 'Vận cực thịnh, quyền lực, nhưng thịnh rồi suy, cần cẩn trọng.',
        'Suy': 'Bắt đầu suy giảm, cần tiết kiệm và chuẩn bị cho giai đoạn khó khăn.',
        'Bệnh': 'Nhiều trở ngại, sức khỏe cần chú ý, tránh mạo hiểm.',
        'Tử': 'Giai đoạn khó khăn nhất, nhưng Tử có thể hồi sinh nếu gặp sao tốt.',
        'Mộ': 'Tích lũy, ẩn giấu. Tiềm năng lớn nhưng chưa bộc lộ, hậu vận khá.',
        'Tuyệt': 'Cô độc, tự lập. Cuộc đời phải tự mình tạo dựng, ít được hỗ trợ.',
        'Thai': 'Đang hình thành, tiềm năng mới, cuộc đời có nhiều khởi đầu mới.',
        'Dưỡng': 'Được nuôi dưỡng, bảo bọc. Tuổi trẻ được gia đình hỗ trợ tốt.'
      };
      if (tsPhase && tsDesc[tsPhase]) h += `<p>${tsDesc[tsPhase]}</p>`;
    }

    // 3d. Lục Cát Tinh
    h += `<h3>13. Luận Lục Cát Tinh</h3>`;
    h += `<p>Sáu sao cát tinh quan trọng nhất: Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt.</p>`;
    const catStars = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt'];
    catStars.forEach(sName => {
      const p = data.palaces.find(p => p.stars.some(s => s.name === sName));
      if (p) h += `<p><strong>${sName}</strong> tại ${p.palaceName} (${p.branch}). `;
      if (sName === 'Tả Phù' || sName === 'Hữu Bật') h += `Trợ tinh — được quý nhân phù trợ, có người giúp đỡ.`;
      if (sName === 'Văn Xương' || sName === 'Văn Khúc') h += `Văn tinh — thông minh, học giỏi, tài hoa.`;
      if (sName === 'Thiên Khôi' || sName === 'Thiên Việt') h += `Quý tinh — gặp quý nhân, tai qua nạn khỏi.`;
      h += `</p>`;
    });

    // 3e. Lục Sát Tinh
    h += `<h3>14. Luận Lục Sát Tinh</h3>`;
    h += `<p>Sáu sao sát tinh: Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh.</p>`;
    const satStars = ['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh'];
    satStars.forEach(sName => {
      const p = data.palaces.find(p => p.stars.some(s => s.name === sName));
      if (p) {
        h += `<p><strong>${sName}</strong> tại ${p.palaceName} (${p.branch}). `;
        if (sName === 'Kình Dương') h += `Hung tinh chủ cương, tại Mệnh cho tính mạnh mẽ nhưng đời nhiều sóng gió.`;
        if (sName === 'Đà La') h += `Hung tinh chủ nhu, chủ trì hoãn, vướng mắc, kéo dài.`;
        if (sName === 'Địa Không') h += `Không vong tinh, phá tán tài lộc, nhưng giúp thoát tục, có duyên tâm linh.`;
        if (sName === 'Địa Kiếp') h += `Kiếp tinh, chủ bất ngờ, mất mát đột ngột, tai nạn.`;
        if (sName === 'Hỏa Tinh') h += `Hung tinh chủ nóng nảy, sự việc bùng nổ bất ngờ.`;
        if (sName === 'Linh Tinh') h += `Hung tinh chủ kinh hãi, âm ỉ kéo dài rồi bùng phát.`;
        h += `</p>`;
      }
    });

    // 3f. Lục Quý Tinh
    h += `<h3>15. Luận Lục Quý Tinh</h3>`;
    const quyStars = ['Ân Quang', 'Thiên Quý', 'Thiên Quan', 'Thiên Phúc', 'Tam Thai', 'Bát Tọa'];
    quyStars.forEach(sName => {
      const p = data.palaces.find(p => p.stars.some(s => s.name === sName));
      if (p) h += `<p><strong>${sName}</strong> tại ${p.palaceName}. `;
      if (sName === 'Ân Quang') h += `Quý tinh chủ ân đức, được người quý mến.`;
      if (sName === 'Thiên Quý') h += `Quý tinh chủ cao quý, phong thái đĩnh đạc.`;
      if (sName === 'Thiên Quan') h += `Quý tinh chủ quan chức, dễ thăng tiến.`;
      if (sName === 'Thiên Phúc') h += `Quý tinh chủ phúc lộc, được trời ban phúc.`;
      if (sName === 'Tam Thai') h += `Quý tinh chủ văn chương, học vấn cao.`;
      if (sName === 'Bát Tọa') h += `Quý tinh chủ quyền quý, vị thế vững chắc.`;
      h += `</p>`;
    });

    // 3g. Tứ Đức Tinh
    h += `<h3>16. Luận Nhóm Sao Tứ Đức</h3>`;
    const ducStars = ['Thiên Đức', 'Phúc Đức', 'Nguyệt Đức', 'Long Đức'];
    ducStars.forEach(sName => {
      const p = data.palaces.find(p => p.stars.some(s => s.name === sName));
      if (p) h += `<p><strong>${sName}</strong> tại ${p.palaceName} — sao hộ mệnh, giải trừ hung họa, mang đến may mắn và bình an.</p>`;
    });

    // 3h. Tuần Triệt
    h += `<h3>17. Luận Tuần Triệt</h3>`;
    const tuanPalaces = data.palaces.filter(p => p.isTuan);
    const trietPalaces = data.palaces.filter(p => p.isTriet);
    h += `<p><strong>Tuần Không</strong> rơi vào: ${tuanPalaces.map(p => `${p.palaceName} (${p.branch})`).join(', ')}.</p>`;
    h += `<p>Tuần Không làm giảm lực của sao tốt lẫn sao xấu tại cung đó. Nếu Tuần rơi vào cung có sao xấu, đó là điều tốt (giảm hung). Nếu rơi vào cung có sao tốt, cần xem xét kỹ.</p>`;
    h += `<p><strong>Triệt Không</strong> rơi vào: ${trietPalaces.map(p => `${p.palaceName} (${p.branch})`).join(', ')}.</p>`;
    h += `<p>Triệt có tính "cắt đứt" — triệt tiêu lực của các sao. Triệt tại cung Mệnh, Quan Lộc, Tài Bạch cần đặc biệt chú ý. Tuy nhiên, Triệt cũng có thể "triệt hung" nếu rơi vào cung nhiều sao xấu.</p>`;
    if (tuanPalaces.some(p => p.palaceName === 'Mệnh')) h += `<p>⚠️ <strong>Tuần tại Mệnh</strong> — mệnh bị giảm lực, cuộc đời hay gặp hụt hẫng, nhưng cũng giảm bớt tai họa.</p>`;
    if (trietPalaces.some(p => p.palaceName === 'Mệnh')) h += `<p>⚠️ <strong>Triệt tại Mệnh</strong> — mệnh bị triệt, giai đoạn đầu đời nhiều khó khăn, nhưng sau khi vượt qua sẽ thành công lớn.</p>`;

    // 3i. Nhóm Không Vong
    h += `<h3>18. Luận Nhóm Sao Không Vong</h3>`;
    h += `<p>Nhóm sao Không Vong bao gồm: Tuần, Triệt, Đại Hao, Tuyệt, Thiên Hư — đều mang tính hao tán, trống rỗng.</p>`;
    const khongVong = ['Địa Không', 'Địa Kiếp', 'Thiên Không', 'Đại Hao', 'Thiên Hư'];
    const menhKV = menh ? menh.stars.filter(s => khongVong.includes(s.name)) : [];
    if (menhKV.length > 0) {
      h += `<p>Cung Mệnh có: <strong>${starNames(menhKV)}</strong> — mệnh chịu ảnh hưởng của Không Vong, cuộc đời nhiều lần từ có thành không, nhưng cũng dễ có duyên với tâm linh, triết học, nghệ thuật.</p>`;
    } else {
      h += `<p>Cung Mệnh không có sao Không Vong trực tiếp tọa thủ — ít chịu ảnh hưởng hao tán.</p>`;
    }

    return h;
  }

  // ==========================================
  // SECTION 4: SỰ NGHIỆP & TÀI CHÍNH
  // ==========================================
  function generateCareerAnalysis(data) {
    let h = '';
    const quanLoc = getPalace(data, 'Quan Lộc');
    const taiBach = getPalace(data, 'Tài Bạch');
    const menh = getPalace(data, 'Mệnh');

    h += `<h3>19. Luận Công Việc & Sự Nghiệp</h3>`;
    if (quanLoc) {
      const majors = getMajorStars(quanLoc);
      h += `<p><strong>Cung Quan Lộc</strong> tại ${quanLoc.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        majors.forEach(s => {
          const info = STAR_MEANINGS[s.name];
          if (info) h += `${s.name} (${info.nature}): ${info.pos}. `;
        });
      } else {
        h += `Vô chính diệu — sự nghiệp phụ thuộc nhiều vào sao tam hợp và nỗ lực cá nhân. `;
      }
      h += `</p>`;

      const goods = getStarsByType(quanLoc, 'good');
      const bads = getStarsByType(quanLoc, 'bad');
      if (goods.length > 0) h += `<p>Cát tinh hỗ trợ: ${starNames(goods)} — sự nghiệp được quý nhân, may mắn trợ giúp.</p>`;
      if (bads.length > 0) h += `<p>Hung tinh: ${starNames(bads)} — cẩn thận thị phi, cạnh tranh trong công việc.</p>`;

      if (hasStarInPalace(quanLoc, 'Hóa Lộc')) h += `<p>Hóa Lộc tại Quan Lộc — sự nghiệp phát tài, dễ kiếm tiền từ nghề nghiệp.</p>`;
      if (hasStarInPalace(quanLoc, 'Hóa Quyền')) h += `<p>Hóa Quyền tại Quan Lộc — có quyền lực trong nghề, nắm giữ vị trí cao.</p>`;
      if (hasStarInPalace(quanLoc, 'Hóa Kỵ')) h += `<p>Hóa Kỵ tại Quan Lộc — sự nghiệp vất vả, nhiều áp lực, nhưng chăm chỉ sẽ thành.</p>`;
    }

    h += `<h3>20. Luận Tiền Tài & Nghèo Hèn</h3>`;
    if (taiBach) {
      const majors = getMajorStars(taiBach);
      h += `<p><strong>Cung Tài Bạch</strong> tại ${taiBach.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        majors.forEach(s => {
          if (s.name === 'Vũ Khúc') h += `Vũ Khúc là tài tinh số 1 — rất giỏi kiếm tiền, đầu tư. `;
          if (s.name === 'Thiên Phủ') h += `Thiên Phủ chủ kho tàng — biết giữ tiền, tài sản ổn định. `;
          if (s.name === 'Tham Lang') h += `Tham Lang tại Tài — kiếm tiền từ giao tiếp, nghệ thuật, nhưng hay tiêu xài. `;
          if (s.name === 'Phá Quân') h += `Phá Quân tại Tài — tài chính bất ổn, lúc giàu lúc nghèo. `;
        });
      } else {
        h += `Vô chính diệu — khả năng tài chính phụ thuộc phụ tinh. `;
      }
      h += `</p>`;

      if (hasStarInPalace(taiBach, 'Lộc Tồn')) h += `<p>Lộc Tồn tại Tài Bạch — tài lộc dồi dào, cả đời không thiếu tiền.</p>`;
      if (hasStarInPalace(taiBach, 'Địa Không') || hasStarInPalace(taiBach, 'Địa Kiếp')) {
        h += `<p>Không Kiếp tại Tài Bạch — tài chính hay bị hao tán bất ngờ, đầu tư cẩn thận.</p>`;
      }
    }

    return h;
  }

  // ==========================================
  // SECTION 5: TÌNH DUYÊN & GIA ĐÌNH
  // ==========================================
  function generateLoveAnalysis(data) {
    let h = '';
    const phuThe = getPalace(data, 'Phu Thê');
    const tuTuc = getPalace(data, 'Tử Tức');

    h += `<h3>21. Luận Tình Duyên & Hôn Nhân</h3>`;
    if (phuThe) {
      const majors = getMajorStars(phuThe);
      h += `<p><strong>Cung Phu Thê</strong> tại ${phuThe.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        majors.forEach(s => {
          const info = STAR_MEANINGS[s.name];
          if (info) {
            h += `${s.name}: ${info.pos}. `;
            if (info.neg) h += `Cẩn thận: ${info.neg}. `;
          }
        });
      } else {
        h += `Vô chính diệu — tình duyên phụ thuộc nhiều vào tam hợp và phụ tinh. `;
      }
      h += `</p>`;

      if (hasStarInPalace(phuThe, 'Hồng Loan') || hasStarInPalace(phuThe, 'Thiên Hỉ')) {
        h += `<p>Hồng Loan / Thiên Hỉ tại Phu Thê — duyên tốt, dễ gặp người phù hợp, hôn nhân hạnh phúc.</p>`;
      }
      if (hasStarInPalace(phuThe, 'Đào Hoa')) {
        h += `<p>Đào Hoa tại Phu Thê — nhiều người theo đuổi nhưng cũng dễ gặp phiền phức tình cảm.</p>`;
      }
      if (hasStarInPalace(phuThe, 'Cô Thần') || hasStarInPalace(phuThe, 'Quả Tú')) {
        h += `<p>Cô Thần / Quả Tú tại Phu Thê — có xu hướng cô đơn, kết hôn muộn hoặc xa cách vợ/chồng.</p>`;
      }
      if (hasStarInPalace(phuThe, 'Hóa Kỵ')) {
        h += `<p>Hóa Kỵ tại Phu Thê — hôn nhân nhiều mâu thuẫn, cần kiên nhẫn và thấu hiểu.</p>`;
      }
    }

    h += `<h3>22. Luận Con Cái</h3>`;
    if (tuTuc) {
      const majors = getMajorStars(tuTuc);
      h += `<p><strong>Cung Tử Tức</strong> tại ${tuTuc.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        majors.forEach(s => {
          if (s.name === 'Thiên Đồng') h += `Nhiều con, con hiếu thảo. `;
          if (s.name === 'Thất Sát' || s.name === 'Phá Quân') h += `Con cái bướng bỉnh, tự lập sớm. `;
          if (s.name === 'Tử Vi') h += `Con cái quý hiển, thành đạt. `;
        });
      }
      h += `</p>`;
      if (hasStarInPalace(tuTuc, 'Địa Không') || hasStarInPalace(tuTuc, 'Địa Kiếp')) {
        h += `<p>Không Kiếp tại Tử Tức — khó khăn trong chuyện con cái, hoặc con cái ở xa.</p>`;
      }
    }

    h += `<h3>23. Các quan hệ gia tộc - xã hội mở rộng</h3>`;
    const huynhDe = getPalace(data, 'Huynh Đệ');
    const phuMau = getPalace(data, 'Phụ Mẫu');
    const phucDuc = getPalace(data, 'Phúc Đức');
    const noBoc = getPalace(data, 'Nô Bộc');
    if (phuMau) h += `<p><strong>Cha mẹ / người dạy dỗ (Phụ Mẫu):</strong> phản ánh nền tảng giáo dưỡng, mối quan hệ với bề trên và người nâng đỡ trong đời.</p>`;
    if (huynhDe) h += `<p><strong>Anh em / cộng sự thân cận (Huynh Đệ):</strong> cho thấy cách phối hợp, chia sẻ nguồn lực và độ bền của liên kết thân hữu.</p>`;
    if (phucDuc) h += `<p><strong>Dòng họ - duyên nghiệp (Phúc Đức):</strong> biểu thị phúc phần, bài học nghiệp duyên và mức độ nâng đỡ vô hình.</p>`;
    if (noBoc) h += `<p><strong>Đệ tử / học trò / thú nuôi / nhân sự hỗ trợ (Nô Bộc):</strong> thể hiện duyên với người theo mình, người được mình dìu dắt hoặc chăm sóc, và chất lượng mạng lưới hỗ trợ hằng ngày.</p>`;

    h += `<p>Các mối liên hệ trên nên được nhìn như những bài học song hành: trách nhiệm, ranh giới, lòng biết ơn và khả năng buông chấp đúng lúc để giảm xung đột và tăng trưởng bền vững.</p>`;

    return h;
  }

  // ==========================================
  // SECTION 6: SỨC KHỎE & ĐỜI SỐNG
  // ==========================================
  function generateHealthAnalysis(data) {
    let h = '';
    const tatAch = getPalace(data, 'Tật Ách');
    const thienDi = getPalace(data, 'Thiên Di');
    const noBoc = getPalace(data, 'Nô Bộc');

    h += `<h3>24. Luận Bệnh Tật & Nghiệp Quả</h3>`;
    if (tatAch) {
      const majors = getMajorStars(tatAch);
      h += `<p><strong>Cung Tật Ách</strong> tại ${tatAch.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        const healthNotes = {
          'Thái Dương': 'Cần chú ý mắt, đầu, huyết áp, tim mạch.',
          'Thái Âm': 'Lưu ý hệ tiêu hóa, thận, mắt, bệnh về nước.',
          'Liêm Trinh': 'Cẩn thận tai nạn, phẫu thuật, bệnh máu.',
          'Tham Lang': 'Chú ý gan, thận, bệnh liên quan ẩm thực, rượu bia.',
          'Thiên Đồng': 'Sức khỏe khá tốt, lưu ý tinh thần, stress.',
          'Cự Môn': 'Cần chú ý đường hô hấp, miệng, dạ dày.',
          'Thất Sát': 'Cẩn thận tai nạn, chấn thương, phẫu thuật.',
          'Phá Quân': 'Dễ gặp phẫu thuật, tai nạn nhỏ, bệnh tái phát.',
          'Vũ Khúc': 'Chú ý phổi, đường hô hấp, xương khớp.',
          'Thiên Cơ': 'Thần kinh, gan, tứ chi.',
          'Tử Vi': 'Bệnh tiềm ẩn, khó phát hiện.',
          'Thiên Phủ': 'Dạ dày, tiêu hóa, béo phì.',
          'Thiên Tướng': 'Da, dị ứng.',
          'Thiên Lương': 'Sức khỏe khá, cẩn thận tuổi già.'
        };
        majors.forEach(s => {
          if (healthNotes[s.name]) h += healthNotes[s.name] + ' ';
        });
      }
      h += `</p>`;

      if (hasStarInPalace(tatAch, 'Thiên Y')) h += `<p>Thiên Y tại Tật Ách — có duyên với y học, bệnh dễ chữa.</p>`;
      const bads = getStarsByType(tatAch, 'bad');
      if (bads.length > 2) h += `<p>Nhiều hung tinh tại Tật Ách (${starNames(bads.slice(0, 3))}...) — sức khỏe cần được quan tâm đặc biệt.</p>`;
    }

    h += `<h3>25. Luận Xa Quê Lập Nghiệp</h3>`;
    if (thienDi) {
      const majors = getMajorStars(thienDi);
      h += `<p><strong>Cung Thiên Di</strong> tại ${thienDi.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} tọa thủ. `;
        majors.forEach(s => {
          if (s.name === 'Thiên Mã' || hasStarInPalace(thienDi, 'Thiên Mã')) h += `Có Thiên Mã — hay đi xa, di chuyển, nước ngoài. `;
          if (s.name === 'Tử Vi' || s.name === 'Thiên Phủ') h += `${s.name} tại Di — đi xa gặp quý nhân, phát triển. `;
        });
      }
      h += `</p>`;
      if (hasStarInPalace(thienDi, 'Thiên Mã')) {
        h += `<p>Thiên Mã tại Thiên Di — rất phù hợp xa quê lập nghiệp, đi xa gặp may.</p>`;
      }
      const goods = getStarsByType(thienDi, 'good');
      if (goods.length > 2) h += `<p>Thiên Di nhiều cát tinh — đi ra ngoài thuận lợi, giao tiếp tốt, được người quý mến.</p>`;
    }

    h += `<h3>26. Luận Quan Hệ Xã Hội (Thiên Di & Nô Bộc)</h3>`;
    if (noBoc) {
      const majors = getMajorStars(noBoc);
      h += `<p><strong>Cung Nô Bộc</strong> tại ${noBoc.branch}: `;
      if (majors.length) {
        h += `${starNames(majors)} — `;
        if (majors.some(s => ['Tử Vi', 'Thiên Phủ', 'Thiên Tướng'].includes(s.name))) h += `bạn bè, cấp dưới trung thành, được nhiều người giúp đỡ.`;
        else if (majors.some(s => ['Thất Sát', 'Phá Quân', 'Liêm Trinh'].includes(s.name))) h += `quan hệ xã hội phức tạp, cần chọn lọc bạn bè.`;
        else h += `quan hệ xã hội ở mức trung bình.`;
      }
      h += `</p>`;
    }

    return h;
  }

  // ==========================================
  // SECTION 7: VẬN HẠN
  // ==========================================
  function generateFortuneAnalysis(data) {
    let h = '';

    // 7a. Đại Vận
    h += `<h3>27. Đại Vận 10 Năm Hiện Tại</h3>`;
    if (data.daiVanInfo) {
      const dv = data.daiVanInfo;
      const dvPalace = data.palaces[dv.position];
      h += `<p>Tuổi hiện tại: <strong>${data.currentAge}</strong> (năm ${data.currentYear}).</p>`;
      h += `<p>Đại Vận hiện tại: <strong>${dv.fromAge} - ${dv.toAge} tuổi</strong>, tại cung <strong>${dvPalace ? dvPalace.palaceName : dv.branch}</strong> (${dv.branch}).</p>`;
      if (dvPalace) {
        const majors = getMajorStars(dvPalace);
        if (majors.length) {
          h += `<p>Chính tinh trong Đại Vận: <strong>${starNames(majors)}</strong>. `;
          majors.forEach(s => {
            const info = STAR_MEANINGS[s.name];
            if (info) h += `${s.name}: ${info.pos}. `;
          });
          h += `</p>`;
        }
        const goods = getStarsByType(dvPalace, 'good');
        const bads = getStarsByType(dvPalace, 'bad');
        if (goods.length > bads.length) {
          h += `<p>Giai đoạn này <strong>nhiều cát tinh</strong> hơn hung tinh — 10 năm thuận lợi, phát triển tốt.</p>`;
        } else if (bads.length > goods.length) {
          h += `<p>Giai đoạn này <strong>nhiều hung tinh</strong> — 10 năm cần cẩn trọng, kiên nhẫn vượt qua khó khăn.</p>`;
        } else {
          h += `<p>Giai đoạn này cát hung lẫn lộn — cần tỉnh táo nắm bắt cơ hội, tránh rủi ro.</p>`;
        }
      }
    }

    // 7b. Tiểu Hạn
    h += `<h3>28. Tiểu Hạn Năm ${data.currentYear}</h3>`;
    if (data.tieuHanInfo) {
      const th = data.tieuHanInfo;
      const thPalace = data.palaces[th.position];
      h += `<p>Tiểu Hạn năm ${data.currentYear} tại cung <strong>${thPalace ? thPalace.palaceName : th.branch}</strong> (${th.branch}).</p>`;
      if (thPalace) {
        const majors = getMajorStars(thPalace);
        if (majors.length) h += `<p>Chính tinh: ${starNames(majors)} — năm nay chịu ảnh hưởng chính từ các sao này.</p>`;
        const goods = getStarsByType(thPalace, 'good');
        const bads = getStarsByType(thPalace, 'bad');
        if (goods.length > 2) h += `<p>Nhiều sao tốt trong Tiểu Hạn — năm nay nhiều thuận lợi.</p>`;
        if (bads.length > 2) h += `<p>Nhiều sao xấu trong Tiểu Hạn — năm nay cần cẩn trọng, phòng tránh tai họa.</p>`;
      }
    }

    // 7c. Tam Tai
    h += `<h3>29. Năm Xung & Hạn Tam Tai</h3>`;
    h += `<p>Các năm Tam Tai của tuổi ${data.diaChi}: <strong>${data.tamTai.join(', ')}</strong>.</p>`;
    if (data.isTamTaiYear) {
      h += `<p>⚠️ <strong>Năm ${data.currentYear} (${data.currentYearBranch}) là năm Tam Tai!</strong> Cần đặc biệt cẩn thận, tránh mạo hiểm, giữ gìn sức khỏe và tài chính.</p>`;
    } else {
      h += `<p>Năm ${data.currentYear} (${data.currentYearBranch}) <strong>không phải</strong> năm Tam Tai — bình an.</p>`;
    }

    // Năm xung
    const xungBranch = TuViEngine.DIA_CHI[(TuViEngine.BRANCH_INDEX[data.diaChi] + 6) % 12];
    h += `<p>Năm xung Thái Tuế (trực xung) của tuổi ${data.diaChi} là năm <strong>${xungBranch}</strong>. `;
    if (data.currentYearBranch === xungBranch) {
      h += `⚠️ <strong>Năm nay chính là năm xung!</strong> Cần cẩn thận đặc biệt.</p>`;
    } else {
      h += `Năm nay không phải năm xung.</p>`;
    }

    // 7d. Sao lưu niên
    h += `<h3>30. Các Sao Trong Tiểu Vận ${data.currentYear}</h3>`;
    const currentYearBranchIdx = TuViEngine.BRANCH_INDEX[data.currentYearBranch];
    if (currentYearBranchIdx !== undefined) {
      const luuNienStars = [];
      luuNienStars.push(`Thái Tuế lưu niên tại ${data.currentYearBranch}`);
      const luuThaiTue = TuViEngine.DIA_CHI[currentYearBranchIdx];
      const luuTangMon = TuViEngine.DIA_CHI[(currentYearBranchIdx + 2) % 12];
      const luuBachHo = TuViEngine.DIA_CHI[(currentYearBranchIdx + 8) % 12];
      h += `<p>Năm ${data.currentYear} (${data.currentYearBranch}):</p>`;
      h += `<ul>`;
      h += `<li>Thái Tuế lưu niên tại <strong>${luuThaiTue}</strong></li>`;
      h += `<li>Tang Môn lưu niên tại <strong>${luuTangMon}</strong> — cẩn thận chuyện buồn</li>`;
      h += `<li>Bạch Hổ lưu niên tại <strong>${luuBachHo}</strong> — cẩn thận tai nạn</li>`;
      h += `</ul>`;

      // Check if lưu niên Thái Tuế falls on Mệnh
      if (luuThaiTue === data.menhCung) {
        h += `<p>⚠️ Thái Tuế lưu niên trùng cung Mệnh — năm nay nhiều biến động, cần cẩn trọng.</p>`;
      }
    }

    h += `<h3>31. Lời khuyên và hướng dẫn thực hành</h3>`;
    h += `<ul>`;
    h += `<li><strong>Cân bằng tâm lý:</strong> duy trì nhật ký cảm xúc, ngủ đủ giấc, hạn chế quyết định lớn khi tinh thần bất ổn.</li>`;
    h += `<li><strong>Phát triển trí tuệ:</strong> học đều theo chu kỳ 90 ngày, nâng kỹ năng cốt lõi gắn với cung Quan Lộc/Tài Bạch.</li>`;
    h += `<li><strong>Giữ gìn sức khỏe:</strong> ưu tiên vận động nhẹ hằng ngày, kiểm tra sức khỏe định kỳ đúng nhóm nguy cơ của cung Tật Ách.</li>`;
    h += `<li><strong>Giảm mâu thuẫn nội tâm:</strong> đặt ranh giới trong quan hệ, thực hành giao tiếp không công kích, giảm phản ứng cực đoan.</li>`;
    h += `<li><strong>Thúc đẩy vận mệnh tốt:</strong> làm việc thiện, giữ uy tín tài chính, chọn môi trường tích cực, hành động bền bỉ hơn là nóng vội.</li>`;
    h += `</ul>`;

    return h;
  }

  // Legacy compatibility
  function generatePalaceDetail(data, palaceName) {
    const palace = data.palaces.find(p => p.palaceName === palaceName);
    if (!palace) return '<p>Không tìm thấy thông tin.</p>';
    const interp = {
      'Mệnh': 'Bản chất, tính cách, vận mệnh tổng quan.',
      'Huynh Đệ': 'Quan hệ anh chị em, bạn bè thân.',
      'Phu Thê': 'Hôn nhân, tình duyên, đối tác.',
      'Tử Tức': 'Con cái, hậu duệ, sáng tạo.',
      'Tài Bạch': 'Tài chính, thu nhập, đầu tư.',
      'Tật Ách': 'Sức khỏe, bệnh tật.',
      'Thiên Di': 'Đi xa, xã hội, vận may bên ngoài.',
      'Nô Bộc': 'Cấp dưới, nhân viên, bạn bè.',
      'Quan Lộc': 'Sự nghiệp, công danh, thăng tiến.',
      'Điền Trạch': 'Nhà cửa, đất đai, tài sản.',
      'Phúc Đức': 'Phúc đức gia tộc, tâm linh.',
      'Phụ Mẫu': 'Cha mẹ, cấp trên, giáo dục.'
    };
    return `<p>${interp[palaceName] || ''}</p>`;
  }

  return {
    generateOverview,
    generateMenhAnalysis,
    generateStarAnalysis,
    generateCareerAnalysis,
    generateLoveAnalysis,
    generateHealthAnalysis,
    generateFortuneAnalysis,
    generatePalaceDetail,
    STAR_MEANINGS
  };
})();

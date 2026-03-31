// Run with: jsc -f js/vendor/lunar-javascript.js -f js/tuvi-engine.js -f scripts/jsc-run-tuvi.js
// (cwd = project root)

function summarize(data) {
  function majors(p) {
    return p.stars.filter(function (s) { return s.type === 'major'; }).map(function (s) { return s.name; });
  }
  var tuViBranch = '';
  for (var i = 0; i < data.palaces.length; i++) {
    if (majors(data.palaces[i]).indexOf('Tử Vi') >= 0) {
      tuViBranch = data.palaces[i].branch;
      break;
    }
  }
  return {
    lunarDate: data.lunarDate,
    lunarSource: data.lunarSource,
    solarDate: data.solarDate,
    yearName: data.yearName,
    napAm: data.napAm,
    hourBranch: data.hourBranch,
    mingMenhCanChi: data.mingMenhCanChi,
    cucName: data.cucName,
    menhCung: data.menhCung,
    thanCung: data.thanCung,
    menhPos: data.menhPos,
    thanPos: data.thanPos,
    tuViPos: data.tuViPos,
    tuViBranch: tuViBranch,
    palaces: data.palaces.map(function (p) {
      return { branch: p.branch, palace: p.palaceName, daiHan: p.daiHan, majors: majors(p) };
    })
  };
}

var cases = [
  {
    label: 'Case A: solar 1990-05-15 12:30 male (tuvi.vn reference)',
    input: {
      name: 'TestUser', year: 1990, month: 5, day: 15, hour: 12, minute: 30, timezone: 7,
      gender: 'male', isLunar: false, viewYear: 2026, viewMonth: 2
    }
  },
  {
    label: 'Case B: explicit lunar 21/4/1990 Canh Ngọ year, giờ Ngọ',
    input: {
      name: 'LunarRef', year: 1990, month: 4, day: 21, hour: 12, minute: 30, timezone: 7,
      gender: 'male', isLunar: true, viewYear: 2026, viewMonth: 2
    }
  },
  {
    label: 'Case C: solar 2004-08-07 female (tuvi.vn sample URL)',
    input: {
      name: 'F', year: 2004, month: 8, day: 7, hour: 14, minute: 0, timezone: 7,
      gender: 'female', isLunar: false, viewYear: 2026, viewMonth: 3
    }
  }
];

for (var c = 0; c < cases.length; c++) {
  var item = cases[c];
  var data = TuViEngine.calculate(item.input);
  print('\n=== ' + item.label + ' ===');
  print(JSON.stringify(summarize(data), null, 2));
}

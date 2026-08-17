// محرّك الفحص — حسابي بالكامل، بلا ذكاء اصطناعي وبلا تخمين.
// كل قاعدة ترجع: true (مستوفاة) / false (غير مستوفاة) / null (معلومة ناقصة).

function parseAnswers(service, body) {
  const a = {};
  for (const f of service.fields) {
    const raw = body[f.k];
    if (raw === undefined || raw === '') { a[f.k] = null; continue; }
    if (f.type === 'number') {
      const n = Number(String(raw).replace(/[^\d.-]/g, ''));
      a[f.k] = Number.isFinite(n) ? n : null;
    } else if (f.type === 'bool') {
      a[f.k] = raw === 'yes' ? true : raw === 'no' ? false : null;
    } else {
      a[f.k] = String(raw);
    }
  }
  return a;
}

function evaluate(service, a) {
  const checks = service.rules.map((r) => {
    let ok = null;
    try { ok = r.test(a); } catch (e) { ok = null; }
    if (ok !== true && ok !== false) ok = null;
    return { id: r.id, label: r.label, status: ok === true ? 'pass' : ok === false ? 'fail' : 'unknown', fail: r.fail };
  });
  const notes = [];
  for (const w of service.warns || []) {
    let on = false;
    try { on = !!w.test(a); } catch (e) { on = false; }
    if (!on) continue;
    let msg = w.msg;
    if (w.msgFn) { try { msg = w.msgFn(a); } catch (e) { msg = w.msg; } }
    if (msg) notes.push({ label: w.label, msg });
  }
  const fails = checks.filter((c) => c.status === 'fail');
  const unknown = checks.filter((c) => c.status === 'unknown');
  const passed = checks.filter((c) => c.status === 'pass').length;
  const score = Math.round((passed / checks.length) * 100);
  const verdict = fails.length ? 'reject' : unknown.length ? 'incomplete' : 'ready';
  return { checks, notes, fails, unknown, passed, score, verdict, total: checks.length };
}

const VERDICTS = {
  ready: { title: 'ملفك مستوفٍ للشروط', sub: 'كل الشروط الرسمية التي نعرفها مستوفاة. جهّز الوثائق وأودِع الملف عبر القناة الرسمية.', color: '#0f8a4d', icon: '✓' },
  incomplete: { title: 'ينقص التحقّق', sub: 'لا يوجد شرط مانع، لكن بعض المعلومات ناقصة. أكملها لتحصل على نتيجة نهائية.', color: '#c47f0a', icon: '!' },
  reject: { title: 'شرط مانع — الملف سيُرفض هكذا', sub: 'هناك شرط رسمي غير مستوفٍ. صحّحه قبل الإيداع أو توجّه إلى الصيغة المناسبة لوضعك.', color: '#c0392b', icon: '×' },
};

module.exports = { parseAnswers, evaluate, VERDICTS };

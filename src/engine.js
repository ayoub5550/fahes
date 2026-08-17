// محرّك الفحص — مبني على Publicodes (مفتوح المصدر، رخصة MIT).
// القواعد مكتوبة بصيغة YAML في src/rules، ولا يوجد أي ذكاء اصطناعي:
// كل شرط تعبير حسابي قابل للتدقيق، والنتيجة نفسها دائماً لنفس المعطيات.
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const Publicodes = require('publicodes');

const Engine = Publicodes.default || Publicodes;
const RULES_DIR = path.join(__dirname, 'rules');

const UNIT_AR = { an: 'سنة', DA: 'دج', '%': '%', pers: 'شخص', mois: 'شهر', jour: 'يوم', niveau: 'طابق', point: 'نقطة', m2: 'م²', ha: 'هكتار', offre: 'عرض' };

/** يحمّل ملف قواعد ويستخرج الأسئلة والشروط بترتيب كتابتها. */
function loadRuleSet(id) {
  const raw = fs.readFileSync(path.join(RULES_DIR, id + '.yaml'), 'utf8');
  const parsed = YAML.parse(raw);
  const engine = new Engine(parsed);

  const fields = [];
  const conditions = [];
  const amounts = [];

  for (const [name, node] of Object.entries(parsed)) {
    if (!node || typeof node !== 'object') continue;
    if (node.question) {
      const opts = node['une possibilité'];
      fields.push({
        k: name,
        label: node.question,
        hint: node.description || '',
        type: opts ? 'select' : node['unité'] ? 'number' : 'bool',
        unit: node['unité'] ? UNIT_AR[node['unité']] || node['unité'] : '',
        rawUnit: node['unité'] || '',
        opts: opts ? opts.map((o) => ({ key: o, label: (parsed[`${name} . ${o}`] || {}).titre || o })) : null,
      });
    } else if (name.startsWith('cond . ')) {
      conditions.push({ k: name, label: node.titre || name, why: node.description || '' });
    } else if (name.startsWith('montant . ') && node.titre) {
      amounts.push({ k: name, label: node.titre });
    }
  }
  return { id, parsed, engine, fields, conditions, amounts };
}

const CACHE = {};
function ruleSet(id) {
  if (!CACHE[id]) CACHE[id] = loadRuleSet(id);
  return CACHE[id];
}

/** يحوّل إجابات الاستمارة إلى «situation» بصيغة Publicodes. */
function toSituation(rs, body) {
  const situation = {};
  for (const f of rs.fields) {
    const raw = body[f.k];
    if (raw === undefined || raw === null || raw === '') continue;
    if (f.type === 'number') {
      const n = Number(String(raw).replace(/[^\d.-]/g, ''));
      if (!Number.isFinite(n)) continue;
      situation[f.k] = f.rawUnit ? `${n} ${f.rawUnit}` : n;
    } else if (f.type === 'bool') {
      if (raw === 'yes') situation[f.k] = 'oui';
      else if (raw === 'no') situation[f.k] = 'non';
    } else {
      if (f.opts.some((o) => o.key === raw)) situation[f.k] = `'${raw}'`;
    }
  }
  return situation;
}

/** يقيّم كل شرط على حدة: pass / fail / unknown. */
function evaluate(id, body) {
  const rs = ruleSet(id);
  const situation = toSituation(rs, body);
  const engine = new Engine(rs.parsed).setSituation(situation);

  const checks = rs.conditions.map((c) => {
    const node = engine.evaluate(c.k);
    const v = node.nodeValue;
    const status = v === true ? 'pass' : v === false ? 'fail' : 'unknown';
    return { id: c.k, label: c.label, why: c.why, status, missing: Object.keys(node.missingVariables || {}) };
  });

  const amounts = rs.amounts.map((m) => {
    const node = engine.evaluate(m.k);
    let unit = '';
    try {
      const u = node.unit ? Publicodes.serializeUnit(node.unit) : '';
      unit = UNIT_AR[u] || u || '';
    } catch (e) { unit = ''; }
    return { label: m.label, value: node.nodeValue, unit };
  }).filter((m) => m.value !== undefined && m.value !== null && m.value !== false);

  const fails = checks.filter((c) => c.status === 'fail');
  const unknown = checks.filter((c) => c.status === 'unknown');
  const passed = checks.filter((c) => c.status === 'pass').length;
  const score = checks.length ? Math.round((passed / checks.length) * 100) : 0;
  const verdict = fails.length ? 'reject' : unknown.length ? 'incomplete' : 'ready';
  return { checks, amounts, fails, unknown, passed, total: checks.length, score, verdict, situation };
}

const VERDICTS = {
  ready: { title: 'ملفك مستوفٍ للشروط', sub: 'كل الشروط الرسمية مستوفاة حسب ما أدخلته. جهّز الوثائق وأودِع الملف في القناة الرسمية.', icon: '✓',
    grad: 'linear-gradient(135deg,#0b6b3c,#12a45c)' },
  incomplete: { title: 'ينقص التحقّق', sub: 'لا يوجد شرط مانع، لكن بعض المعلومات ناقصة. أكملها لتحصل على نتيجة نهائية.', icon: '!',
    grad: 'linear-gradient(135deg,#8a5a06,#d9930d)' },
  reject: { title: 'شرط مانع — الملف سيُرفض هكذا', sub: 'شرط رسمي واحد على الأقل غير مستوفٍ. صحّحه قبل الإيداع، أو توجّه إلى الصيغة المناسبة لوضعك.', icon: '×',
    grad: 'linear-gradient(135deg,#6d1220,#b81d2e)' },
};

module.exports = { ruleSet, evaluate, VERDICTS, RULES_DIR };

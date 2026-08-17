const express = require('express');
const { layout, esc } = require('./views');
const { CATEGORIES, SERVICES, BY_ID, EXTERNAL } = require('./data');
const { parseAnswers, evaluate, VERDICTS } = require('./engine');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/health', (_, res) => res.json({ ok: true, services: SERVICES.length }));

/* ─────────── الصفحة الرئيسية ─────────── */
app.get('/', (req, res) => {
  const hero = `<div class="hero"><div class="wrap">
    <div class="pill">🇩🇿 بلا ذكاء اصطناعي — قواعد رسمية وحساب دقيق</div>
    <h1>اعرف إن كان ملفك <em>سيُقبل</em><br>قبل أن تودعه.</h1>
    <p>عدل 3، السكن الاجتماعي، الترقوي المدعم، الريفي، منحة البطالة، ANADE، CNAC، ANGEM، المنح الاجتماعية والدراسية…
       أجب على أسئلة قصيرة، ويقول لك فاحص أي شرط رسمي ينقصك، وأين تودع الملف رسمياً.</p>
    <a class="btn light" href="#services">ابدأ الفحص ←</a>
    <div class="stats">
      <div><b>${SERVICES.length}</b><span>خدمة قابلة للفحص</span></div>
      <div><b>${SERVICES.reduce((n, s) => n + s.rules.length, 0)}</b><span>شرط رسمي مبرمَج</span></div>
      <div><b>0 دج</b><span>مجاني بالكامل</span></div>
    </div>
  </div></div>`;

  const cats = CATEGORIES.map((c) => `
    <section id="${c.id}">
      <h2 class="sec">${c.icon} ${esc(c.name)}</h2>
      <p class="sub">${esc(c.desc)}</p>
      <div class="grid">${c.items.map((s) => `
        <a class="card" href="/s/${s.id}">
          <span class="ic">${s.icon}</span>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.summary)}</p>
          <div class="agency">${esc(s.agency)}</div>
        </a>`).join('')}</div>
    </section>`).join('');

  const ext = `<section><h2 class="sec">✈️ السفر</h2><p class="sub">فاحص مستقل خاص بملف التأشيرة.</p>
    <div class="grid">${EXTERNAL.map((e) => `<a class="card" href="${esc(e.url)}" target="_blank" rel="noopener">
      <span class="ic">${e.icon}</span><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p>
      <div class="agency">مشروع «ملفّي» ↗</div></a>`).join('')}</div></section>`;

  res.send(layout('افحص أهليتك قبل الإيداع', `<div id="services"></div>${cats}${ext}`, { hero }));
});

/* ─────────── استمارة خدمة ─────────── */
function fieldHtml(f, v) {
  const val = v == null ? '' : v;
  if (f.type === 'bool') {
    return `<div class="yesno">
      <label><input type="radio" name="${f.k}" value="yes" ${val === 'yes' ? 'checked' : ''}><span>نعم</span></label>
      <label><input type="radio" name="${f.k}" value="no" ${val === 'no' ? 'checked' : ''}><span>لا</span></label>
    </div>`;
  }
  if (f.type === 'select') {
    return `<select name="${f.k}"><option value="">— اختر —</option>${f.opts
      .map((o) => `<option ${String(val) === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  }
  return `<input type="number" name="${f.k}" inputmode="numeric" value="${esc(val)}" placeholder="0">
    <span class="unit">${esc(f.unit || '')}</span>`;
}

function formPage(s, body = {}) {
  return `<div class="form-card">
    <div class="form-head">
      <div class="tag" style="background:rgba(255,255,255,.16);color:#fff;border-color:rgba(255,255,255,.3)">${esc(s.catName)}</div>
      <h1>${s.icon} ${esc(s.name)}</h1>
      <p>${esc(s.summary)}</p>
    </div>
    <form class="form-body" method="post" action="/s/${s.id}">
      ${s.money ? `<div class="money">💰 ${esc(s.money)}</div>` : ''}
      ${s.fields.map((f) => `<div class="field"><label class="q">${esc(f.label)}</label>${fieldHtml(f, body[f.k])}</div>`).join('')}
      <div style="margin-top:22px"><button class="btn" type="submit">افحص ملفي ←</button></div>
    </form>
    <div class="form-foot">
      <b>الجهة الرسمية:</b> ${esc(s.agency)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)} ↗</a>
      <div class="src">المصادر: ${s.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(' · ')}</div>
    </div>
  </div>`;
}

app.get('/s/:id', (req, res) => {
  const s = BY_ID[req.params.id];
  if (!s) return res.status(404).send(layout('غير موجود', '<div class="card"><h3>الخدمة غير موجودة</h3><p><a href="/">عد إلى الخدمات</a></p></div>'));
  res.send(layout(s.name, formPage(s)));
});

app.post('/s/:id', (req, res) => {
  const s = BY_ID[req.params.id];
  if (!s) return res.redirect('/');
  const a = parseAnswers(s, req.body);
  const r = evaluate(s, a);
  const v = VERDICTS[r.verdict];

  const grad = r.verdict === 'ready'
    ? 'linear-gradient(135deg,#0b6b3c,#12a45c)'
    : r.verdict === 'incomplete'
      ? 'linear-gradient(135deg,#8a5a06,#d9930d)'
      : 'linear-gradient(135deg,var(--red-800),var(--red-600))';

  const checks = r.checks.map((c) => `<div class="chk ${c.status}">
      <div class="m">${c.status === 'pass' ? '✓' : c.status === 'fail' ? '×' : '?'}</div>
      <div><b>${esc(c.label)}</b>
        ${c.status === 'fail' ? `<div class="why">${esc(c.fail)}</div>` : ''}
        ${c.status === 'unknown' ? '<div class="why">لم تُدخل هذه المعلومة — لا يمكن الحكم عليها.</div>' : ''}
      </div></div>`).join('');

  const body = `
  <div class="verdict" style="background:${grad}">
    <div class="ring">${v.icon}</div>
    <div><h1>${esc(v.title)}</h1><p>${esc(v.sub)}</p>
      <p style="margin-top:8px;font-weight:700">${r.passed} من ${r.total} شرطاً مستوفى · ${r.score}%</p></div>
  </div>

  <div class="card" style="margin-bottom:22px">
    <h2 class="sec" style="font-size:21px">تفصيل الشروط — ${esc(s.name)}</h2>
    ${checks}
  </div>

  ${r.notes.length ? `<div class="card" style="margin-bottom:22px">
    <h2 class="sec" style="font-size:21px">ملاحظات تخصّ حالتك</h2>
    ${r.notes.map((n) => `<div class="note"><b>${esc(n.label)}:</b> ${esc(n.msg)}</div>`).join('')}
  </div>` : ''}

  <div class="card" style="margin-bottom:22px">
    <h2 class="sec" style="font-size:21px">📋 وثائق الملف</h2>
    <ul class="docs">${s.docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    ${s.money ? `<div class="money" style="margin-top:16px">💰 ${esc(s.money)}</div>` : ''}
  </div>

  <div class="card" style="text-align:center">
    <h2 class="sec" style="font-size:21px">أودِع ملفك في المكان الرسمي</h2>
    <p class="sub">${esc(s.agency)}</p>
    <a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">فتح الموقع الرسمي ↗</a>
    <div style="margin-top:16px"><a href="/s/${s.id}">↺ أعد الفحص بمعطيات أخرى</a> · <a href="/">كل الخدمات</a></div>
    <div class="src">المصادر: ${s.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(' · ')}
      · الشروط تتغيّر بالمراسيم: الموقع الرسمي هو المرجع النهائي.</div>
  </div>`;

  res.send(layout('نتيجة الفحص · ' + s.name, body));
});

/* ─────────── صفحات ثابتة ─────────── */
app.get('/how', (req, res) => {
  res.send(layout('كيف يعمل فاحص', `
  <section><h2 class="sec">كيف يعمل فاحص</h2>
  <p class="sub">لا تخمين ولا ذكاء اصطناعي: شروط مكتوبة في المراسيم والمواقع الرسمية، محوَّلة إلى قواعد حسابية.</p>
  <div class="grid">
    <div class="card"><span class="ic">1️⃣</span><h3>تختار الخدمة</h3><p>سكن، منحة، قرض، تقاعد… ${SERVICES.length} خدمة جزائرية.</p></div>
    <div class="card"><span class="ic">2️⃣</span><h3>تجيب على أسئلة قصيرة</h3><p>سنّك، دخلك، وضعك المهني، ملكيتك… لا اسم ولا هاتف ولا وثيقة.</p></div>
    <div class="card"><span class="ic">3️⃣</span><h3>يحسب فاحص كل شرط</h3><p>كل شرط رسمي يُقيَّم منفرداً: ✓ مستوفى، × مانع، ؟ معلومة ناقصة.</p></div>
    <div class="card"><span class="ic">4️⃣</span><h3>يوجّهك للمكان الرسمي</h3><p>قائمة الوثائق ورابط الإيداع الرسمي — بلا وسيط وبلا رسوم.</p></div>
  </div></section>
  <section><h2 class="sec">لماذا هذا مهم</h2>
  <p>أغلب الملفات لا تُرفض لأن صاحبها غير مستحق، بل لشرط شكلي كان يمكن تصحيحه قبل الإيداع:
  حساب بريدي باسم الأب بدل الطالب، شهادة إقامة لا تطابق العنوان، أقدمية إقامة غير كافية، دخل الزوج،
  أو ملكية قديمة لأرض. فاحص يُظهر لك هذه النقاط قبل أن تضيّع موسماً كاملاً في الانتظار.</p></section>`));
});

app.get('/about', (req, res) => {
  res.send(layout('عن فاحص', `
  <section><h2 class="sec">عن فاحص</h2>
  <p>فاحص أداة مجانية تجمع الشروط الرسمية للخدمات العمومية الجزائرية في مكان واحد، وتحوّلها إلى فحص أهلية دقيق.</p>
  <div class="card" style="margin:20px 0"><h3>ما لا نفعله — بوضوح</h3>
    <ul class="docs">
      <li>لا نقبل ملفات ولا نودعها نيابة عنك.</li>
      <li>لا نبيع مواعيد ولا نعد بقبول أي ملف.</li>
      <li>لا نطلب اسمك ولا هاتفك ولا وثائقك، ولا نحتفظ بأي بيانات.</li>
      <li>لسنا جهة حكومية ولا ممثلاً لأي وكالة.</li>
    </ul></div>
  <h2 class="sec" style="font-size:21px">المصادر</h2>
  <p class="sub">كل خدمة تحمل روابط مصادرها أسفل صفحتها: الجريدة الرسمية، مواقع الوزارات والوكالات، والبنوك العمومية.
  الشروط تتغيّر بالمراسيم — إذا تغيّر نصّ رسمي، الموقع الرسمي هو المرجع، لا فاحص.</p>
  <div class="money">📌 مرجع محيّن: الأجر الوطني الأدنى المضمون (SNMG) = 24.000 دج منذ 01 جانفي 2026 (مرسوم رئاسي 26-01)،
   وهو أساس حساب سقوف الدخل في صيغ السكن والمنح.</div>
  </section>`));
});

const PORT = process.env.PORT || 3070;
app.listen(PORT, () => console.log('fahes on ' + PORT));

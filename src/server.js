const express = require('express');
const { icon } = require('./icons');
const { layout, esc, num, CSS, CSS_HASH } = require('./views');
const { CATEGORIES, SERVICES, BY_ID, byCat } = require('./services');
const { ruleSet, evaluate, VERDICTS } = require('./engine');
const visaRouter = require('./routes/visa');
const accountRouter = require('./routes/account');
const auth = require('./auth');

const app = express();
app.use(express.urlencoded({ extended: false, limit: '64kb' }));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
  res.setHeader('x-frame-options', 'SAMEORIGIN');
  res.setHeader('permissions-policy', 'geolocation=(), camera=(), microphone=()');
  next();
});

/* ═══════════ أداء: ضغط gzip + ملف تنسيق مخزَّن أبدياً ═══════════ */
const zlib = require('zlib');
app.use((req, res, next) => {
  if (!/\bgzip\b/.test(req.headers['accept-encoding'] || '')) return next();
  const send = res.send.bind(res);
  res.send = (body) => {
    if (typeof body !== 'string' || body.length < 1024 || res.getHeader('content-encoding')) return send(body);
    const gz = zlib.gzipSync(Buffer.from(body), { level: 6 });
    res.setHeader('content-encoding', 'gzip');
    res.setHeader('vary', 'accept-encoding');
    res.setHeader('content-length', gz.length);
    if (!res.getHeader('content-type')) res.type('html');
    return res.end(gz);
  };
  next();
});

app.get('/a/app.:hash.css', (req, res) => {
  res.type('css');
  res.setHeader('cache-control', req.params.hash === CSS_HASH
    ? 'public, max-age=31536000, immutable' : 'public, max-age=60');
  res.send(CSS);
});
app.use(auth.attachUser);

const TOTAL_CONDITIONS = SERVICES.reduce((n, s) => n + ruleSet(s.id).conditions.length, 0);

app.get('/health', (_, res) => res.json({ ok: true, services: SERVICES.length, conditions: TOTAL_CONDITIONS }));

/* ═══════════ الصفحة الرئيسية ═══════════ */
app.get('/', (req, res) => {
  const hero = `<div class="hero"><div class="wrap">
    <div class="pill">🇩🇿 قواعد رسمية وحساب دقيق — بلا ذكاء اصطناعي</div>
    <h1>اعرف إن كان ملفك <em>سيُقبل</em><br>قبل أن تودعه.</h1>
    <p>سكن، منح، قروض، مشاريع، تأشيرات… أجب على أسئلة قصيرة، ويقول لك فاحص أي شرط رسمي ينقصك،
       وما هي وثائقك، وأين تودع الملف رسمياً.</p>
    <a class="btn light" href="#services">ابدأ الفحص ←</a>
    <a class="btn ghost" style="margin-inline-start:8px" href="/app">${icon('phone',18)} حمّل التطبيق</a>
    <div class="stats">
      <div><b>${SERVICES.length + 1}</b><span>خدمة قابلة للفحص</span></div>
      <div><b>${TOTAL_CONDITIONS}</b><span>شرط رسمي مبرمَج</span></div>
      <div><b>0 دج</b><span>مجاني بالكامل</span></div>
    </div>
  </div></div>`;

  const card = (s) => `<a class="card svc" href="/s/${s.id}" data-n="${esc(s.name + ' ' + s.agency + ' ' + s.summary)}" data-c="${s.cat}">
      <span class="ic">${icon(s.cat, 24)}</span>
      <span><h3>${esc(s.name)}</h3><p>${esc(s.summary)}</p><span class="agency">${esc(s.agency)}</span></span>
    </a>`;

  const sections = CATEGORIES.map((c) => `
    <section class="catsec" data-c="${c.id}">
      <h2 class="sec">${icon(c.id, 21)} ${esc(c.name)}</h2>
      <p class="sub">${esc(c.desc)}</p>
      <div class="grid">${byCat(c.id).map(card).join('')}</div>
    </section>`).join('');

  const visaCard = `<section class="catsec" data-c="visa">
      <h2 class="sec">${icon('visa', 21)} السفر والتأشيرات</h2>
      <p class="sub">فحص ملف التأشيرة، المبالغ المرجعية الرسمية، وشروط الدخول لكل دول العالم.</p>
      <div class="grid">
        <a class="card svc" href="/visa" data-n="تأشيرة شنغن فيزا سفر" data-c="visa"><span class="ic">${icon('passport', 24)}</span>
          <span><h3>فاحص ملف التأشيرة</h3><p>قاعدة 90/180، المبلغ المرجعي المطلوب لكل دولة شنغن، صلاحية الجواز، التأمين، والوثائق حسب وضعك.</p>
          <span class="agency">مبالغ رسمية من المفوضية الأوروبية</span></span></a>
        <a class="card svc" href="/visa/countries" data-n="دول العالم تأشيرة" data-c="visa"><span class="ic">${icon('world', 24)}</span>
          <span><h3>كل دول العالم (193 دولة)</h3><p>هل تحتاج تأشيرة مسبقة أم إلكترونية أم لا تحتاج شيئاً بجواز سفر جزائري.</p>
          <span class="agency">مع بحث وتصفية</span></span></a>
      </div>
    </section>`;

  const chips = [['all', 'الكل']].concat(CATEGORIES.map((c) => [c.id, icon(c.id, 16) + ' ' + esc(c.name)])).concat([['visa', icon('visa', 16) + ' التأشيرات']])
    .map(([k, l], i) => `<button type="button" class="chip${i === 0 ? ' on' : ''}" data-f="${k}">${l}</button>`).join('');

  const body = `<div id="services"></div>
  <div class="search"><input type="search" id="q" placeholder="ابحث عن خدمة… (سكن، منحة، قرض، تأشيرة)"></div>
  <div class="chips">${chips}</div>
  ${sections}${visaCard}
  <div id="none" class="card" style="display:none;text-align:center">لا توجد خدمة بهذا الاسم. جرّب كلمة أخرى.</div>
  <script>
  (function(){
    function norm(v){return (v||'').toString().toLowerCase()
      .replace(/[\u064B-\u0652\u0640]/g,'')
      .replace(/[\u0623\u0625\u0622\u0671]/g,'\u0627')
      .replace(/\u0629/g,'\u0647').replace(/[\u0649]/g,'\u064A')
      .replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
    var q=document.getElementById('q'), cards=[].slice.call(document.querySelectorAll('.svc')),
        secs=[].slice.call(document.querySelectorAll('.catsec')), chips=[].slice.call(document.querySelectorAll('.chip')), f='all';
    function apply(){
      var t=norm(q.value), n=0;
      cards.forEach(function(c){
        var ok=(f==='all'||c.dataset.c===f)&&(!t||t.split(' ').every(function(w){return c._n.indexOf(w)>-1}));
        c.style.display=ok?'':'none'; if(ok)n++;
      });
      secs.forEach(function(s){
        var vis=[].slice.call(s.querySelectorAll('.svc')).some(function(c){return c.style.display!=='none'});
        s.style.display=vis?'':'none';
      });
      document.getElementById('none').style.display=n?'none':'block';
    }
    cards.forEach(function(c){c._n=norm(c.dataset.n)});
    var qs=new URLSearchParams(location.search).get('q'); if(qs){q.value=qs;}
    var tm; q.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(apply,80)});
    apply();
    chips.forEach(function(c){c.addEventListener('click',function(){
      chips.forEach(function(x){x.classList.remove('on')}); c.classList.add('on'); f=c.dataset.f; apply();
      window.scrollTo({top:document.getElementById('services').offsetTop-70,behavior:'smooth'});
    })});
  })();
  </script>`;

  res.send(layout('افحص أهليتك قبل الإيداع', body, { hero, user: req.user, active: 'home' }));
});

/* ═══════════ استمارة خدمة ونتيجتها ═══════════ */
function fieldHtml(f, v) {
  const val = v == null ? '' : v;
  if (f.type === 'bool') {
    return `<div class="yesno">
      <label><input type="radio" name="${esc(f.k)}" value="yes" ${val === 'yes' ? 'checked' : ''}><span>نعم</span></label>
      <label><input type="radio" name="${esc(f.k)}" value="no" ${val === 'no' ? 'checked' : ''}><span>لا</span></label>
    </div>`;
  }
  if (f.type === 'select') {
    return `<select name="${esc(f.k)}"><option value="">— اختر —</option>${f.opts
      .map((o) => `<option value="${esc(o.key)}" ${val === o.key ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
  }
  return `<div class="inline"><input type="number" name="${esc(f.k)}" inputmode="numeric" value="${esc(val)}" placeholder="0">
    <span class="unit">${esc(f.unit || '')}</span></div>`;
}

function formPage(s, body = {}) {
  const rs = ruleSet(s.id);
  const cat = CATEGORIES.find((c) => c.id === s.cat);
  return `<div class="fhead">
      <span class="tag" style="background:rgba(255,255,255,.16);color:#fff;border-color:rgba(255,255,255,.3)">${icon(s.cat,14)} ${esc(cat ? cat.name : '')}</span>
      <h1>${esc(s.name)}</h1>
      <p>${esc(s.summary)}</p>
    </div>
    <form class="fbody" method="post" action="/s/${s.id}">
      ${s.money && !/^لا يوجد/.test(s.money) ? `<div class="money" style="margin-top:14px">${icon('money',17)} ${esc(s.money)}</div>` : ''}
      ${rs.fields.map((f) => `<div class="field"><label class="q">${esc(f.label)}</label>${fieldHtml(f, body[f.k])}</div>`).join('')}
      <div class="sticky-cta"><button class="btn block" type="submit">افحص ملفي ←</button></div>
    </form>
    <div class="card" style="margin-top:14px">
      <b>الجهة الرسمية:</b> ${esc(s.agency)}<br>
      <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)} ↗</a>
      <div class="src">المصادر: ${s.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(' · ')}</div>
    </div>`;
}

app.get('/s/:id', (req, res) => {
  const s = BY_ID[req.params.id];
  if (!s) return res.status(404).send(layout('غير موجود', '<div class="card"><h3>الخدمة غير موجودة</h3><p><a href="/">عد إلى قائمة الخدمات</a></p></div>'));
  res.send(layout(s.name, formPage(s), { user: req.user, active: 'services' }));
});

app.post('/s/:id', (req, res) => {
  const s = BY_ID[req.params.id];
  if (!s) return res.redirect('/');
  const r = evaluate(s.id, req.body);
  const v = VERDICTS[r.verdict];

  const checks = r.checks.map((c) => `<div class="chk ${c.status}">
      <div class="m">${c.status === 'pass' ? '✓' : c.status === 'fail' ? '×' : '?'}</div>
      <div><b>${esc(c.label)}</b>
        ${c.status === 'fail' && c.why ? `<div class="why">${esc(c.why)}</div>` : ''}
        ${c.status === 'unknown' ? '<div class="why">معلومة ناقصة — لا يمكن الحكم على هذا الشرط.</div>' : ''}
      </div></div>`).join('');

  const amounts = r.amounts.length ? `<div class="card" style="margin-bottom:14px">
      <h2 class="sec" style="font-size:19px">أرقام حالتك</h2>
      <div class="rows">${r.amounts.map((a) => `<div class="row"><span>${esc(a.label)}</span><b>${num(a.value)} ${esc(a.unit)}</b></div>`).join('')}</div>
      <div class="src">أرقام تقديرية محسوبة من الشروط الرسمية ومن معطياتك، والجهة الرسمية هي من يحدد المبلغ النهائي.</div>
    </div>` : '';

  const tips = (s.tips || []).length ? `<div class="card" style="margin-bottom:14px">
      <h2 class="sec" style="font-size:19px">ملاحظات مفيدة</h2>
      ${s.tips.map((t) => `<div class="note">${esc(t)}</div>`).join('')}</div>` : '';

  const body = `
  <div class="verdict" style="background:${v.grad}">
    <div class="top"><div class="ring">${v.icon}</div>
      <div><h1>${esc(v.title)}</h1></div></div>
    <p>${esc(v.sub)}</p>
    <div class="bar"><i style="width:${r.score}%"></i></div>
    <p style="font-weight:700;margin-top:8px">${r.passed} من ${r.total} شرطاً مستوفى · ${r.score}%</p>
  </div>

  <div class="card" style="margin-bottom:14px">
    <h2 class="sec" style="font-size:19px">تفصيل الشروط</h2>
    ${checks}
  </div>
  ${amounts}${tips}

  <div class="card" style="margin-bottom:14px">
    <h2 class="sec" style="font-size:19px">${icon('papers',20)} وثائق الملف</h2>
    <ul class="docs">${s.docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    ${s.money && !/^لا يوجد/.test(s.money) ? `<div class="money" style="margin-top:14px">${icon('money',17)} ${esc(s.money)}</div>` : ''}
  </div>

  ${req.user ? `<form method="post" action="/me/save" class="card" style="text-align:center;margin-bottom:14px">
      <input type="hidden" name="service" value="${s.id}">
      <input type="hidden" name="payload" value="${esc(JSON.stringify({ verdict: r.verdict, passed: r.passed, total: r.total,
        missing: r.checks.filter((c) => c.status !== 'pass').map((c) => c.label) }))}">
      <b>احفظ هذا الفحص في «ملفاتي»</b>
      <p class="sub" style="margin:4px 0 12px">لتتابع الشروط الناقصة ووثائق الملف لاحقاً.</p>
      <button class="btn block" type="submit">${icon('folder',18)} احفظ في ملفاتي</button>
    </form>`
    : `<div class="card" style="text-align:center;margin-bottom:14px">
      <b>أنشئ حساباً مجانياً لحفظ نتيجتك</b>
      <p class="sub" style="margin:4px 0 12px">تتابع وثائقك وشروطك الناقصة في أي وقت، من الهاتف أو الحاسوب.</p>
      <a class="btn block" href="/signup">إنشاء حساب مجاني</a>
      <div style="margin-top:10px"><a href="/login">لدي حساب — دخول</a></div>
    </div>`}

  <div class="card" style="text-align:center">
    <h2 class="sec" style="font-size:19px">أودِع ملفك في المكان الرسمي</h2>
    <p class="sub">${esc(s.agency)}</p>
    <a class="btn block" href="${esc(s.url)}" target="_blank" rel="noopener">فتح الموقع الرسمي ↗</a>
    <div style="margin-top:14px"><a href="/s/${s.id}">↺ أعد الفحص</a> · <a href="/">كل الخدمات</a></div>
    <div class="src">المصادر: ${s.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join(' · ')}
      · الشروط تتغيّر بالمراسيم، والموقع الرسمي هو المرجع النهائي.</div>
  </div>`;

  res.send(layout('نتيجة الفحص · ' + s.name, body, { user: req.user, active: 'services' }));
});

/* ═══════════ تحميل التطبيق ═══════════ */
const path = require('path');
const fs = require('fs');
const APK_PATH = process.env.FAHES_APK || path.join(__dirname, '..', 'public', 'fahes.apk');
const APK_VERSION = '1.3';

app.get('/app', (req, res) => {
  const exists = fs.existsSync(APK_PATH);
  const size = exists ? (fs.statSync(APK_PATH).size / 1048576).toFixed(1) : null;
  res.send(layout('تطبيق فاحص للأندرويد', `
  <section style="text-align:center">
    <h2 class="sec">${icon('phone',22)} حمّل تطبيق فاحص</h2>
    <p class="sub">نفس الخدمات الـ${SERVICES.length} داخل تطبيق أندرويد خفيف، مع حسابك وملفاتك المحفوظة.</p>
    <div class="card" style="max-width:430px;margin:0 auto;text-align:center">
      <div style="color:var(--r600);display:flex;justify-content:center">${icon('shield',44)}</div>
      <b style="font-size:19px">فاحص ${APK_VERSION}</b>
      <p class="sub" style="margin:4px 0 14px">${exists ? size + ' ميغا · أندرويد 7.0 فأحدث' : 'الملف غير متوفر حالياً'}</p>
      ${exists ? `<a class="btn block" href="/app/download">${icon('phone',18)} تحميل APK</a>` : ''}
      <div class="src" style="text-align:start">عند التثبيت سيطلب منك الهاتف السماح بتثبيت التطبيقات من مصدر خارجي —
        هذا طبيعي لأي تطبيق يُحمَّل خارج المتجر. النسخة نفسها مُعدّة أيضاً بصيغة AAB للنشر على Google Play.</div>
    </div>
  </section>`, { user: req.user }));
});

app.get('/app/download', (req, res) => {
  if (!fs.existsSync(APK_PATH)) return res.redirect('/app');
  res.download(APK_PATH, `fahes-${APK_VERSION}.apk`);
});

/* ═══════════ حفظ نتيجة الفحص ═══════════ */
app.post('/me/save', auth.requireUser, (req, res) => {
  let payload = {};
  try { payload = JSON.parse(req.body.payload || '{}'); } catch { payload = {}; }
  if (BY_ID[req.body.service]) {
    auth.saveFile(req.user.id, {
      service: req.body.service,
      verdict: payload.verdict || 'incomplete',
      passed: Number(payload.passed) || 0,
      total: Number(payload.total) || 0,
      missing: Array.isArray(payload.missing) ? payload.missing.slice(0, 12) : [],
    });
  }
  res.redirect('/me');
});

/* ═══════════ الحساب ═══════════ */
app.use('/', accountRouter);

/* ═══════════ وحدة التأشيرات ═══════════ */
app.use('/visa', visaRouter);

/* ═══════════ صفحات ثابتة ═══════════ */
app.get('/how', (req, res) => {
  res.send(layout('كيف يعمل فاحص', `
  <section><h2 class="sec">كيف يعمل فاحص</h2>
  <p class="sub">لا تخمين ولا ذكاء اصطناعي: شروط مكتوبة في المراسيم والمواقع الرسمية، محوَّلة إلى قواعد حسابية.</p>
  <div class="grid">
    <div class="card"><span class="ic num">1</span><span><h3>تختار الخدمة</h3><p>سكن، منحة، قرض، مشروع، تأشيرة… ${SERVICES.length + 1} خدمة.</p></span></div>
    <div class="card"><span class="ic num">2</span><span><h3>تجيب على أسئلة قصيرة</h3><p>سنّك، دخلك، وضعك المهني… بلا اسم ولا هاتف ولا وثيقة.</p></span></div>
    <div class="card"><span class="ic num">3</span><span><h3>يحسب فاحص كل شرط</h3><p>كل شرط يُقيَّم منفرداً: ✓ مستوفى، × مانع، ؟ معلومة ناقصة.</p></span></div>
    <div class="card"><span class="ic num">4</span><span><h3>يوجّهك للمكان الرسمي</h3><p>قائمة الوثائق ورابط الإيداع الرسمي، بلا وسيط وبلا رسوم.</p></span></div>
  </div></section>
  <section><h2 class="sec">لماذا هذا مهم</h2>
  <p>أغلب الملفات لا تُرفض لأن صاحبها غير مستحق، بل بسبب شرط شكلي كان يمكن تصحيحه قبل الإيداع:
  حساب بريدي باسم الأب بدل الطالب، شهادة إقامة لا تطابق العنوان، أقدمية إقامة غير كافية، دخل الزوج،
  أو ملكية قديمة لأرض. فاحص يُظهر لك هذه النقاط قبل أن تضيّع موسماً كاملاً في الانتظار.</p></section>
  <section><h2 class="sec">المحرّك</h2>
  <p>قواعد فاحص مكتوبة بلغة <a href="https://publi.codes/" target="_blank" rel="noopener">Publicodes</a> مفتوحة المصدر،
  وهي نفس التقنية التي تستعملها الإدارة الفرنسية لحساب أهلية المساعدات الاجتماعية.
  كل شرط ملف نصّي مقروء يمكن مراجعته وتصحيحه فور صدور مرسوم جديد.</p></section>`, { user: req.user }));
});

app.get('/about', (req, res) => {
  res.send(layout('عن فاحص', `
  <section><h2 class="sec">عن فاحص</h2>
  <p>فاحص أداة مجانية تجمع الشروط الرسمية للخدمات العمومية الجزائرية في مكان واحد، وتحوّلها إلى فحص أهلية دقيق.</p>
  <div class="card" style="margin:16px 0"><h3>ما لا نفعله — بوضوح</h3>
    <ul class="docs">
      <li>لا نقبل ملفات ولا نودعها نيابة عنك.</li>
      <li>لا نبيع مواعيد ولا نعد بقبول أي ملف.</li>
      <li>لا نطلب وثائقك ولا نحتفظ بشيء إن استعملت فاحص بلا حساب.</li>
      <li>الحساب اختياري: يخدم فقط حفظ نتائج فحوصك ومتابعة وثائقك، ويمكنك حذف أي ملف متى شئت.</li>
      <li>لسنا جهة حكومية ولا ممثلاً لأي وكالة.</li>
    </ul></div>
  <h2 class="sec" style="font-size:19px">المصادر</h2>
  <p class="sub">كل خدمة تحمل روابط مصادرها أسفل صفحتها: الجريدة الرسمية، مواقع الوزارات والوكالات، والبنوك العمومية.
  إذا تغيّر نصّ رسمي، الموقع الرسمي هو المرجع، لا فاحص.</p>
  <div class="money">${icon('check',17)} مرجع محيّن: الأجر الوطني الأدنى المضمون (SNMG) = 24.000 دج منذ 01 جانفي 2026 (مرسوم رئاسي 26-01)،
   وهو أساس حساب سقوف الدخل في صيغ السكن والمنح.</div>
  </section>`, { user: req.user }));
});

app.get('/robots.txt', (_, res) => res.type('text/plain').send('User-agent: *\nAllow: /\n'));

app.use((req, res) => res.status(404).send(layout('غير موجود',
  '<div class="card" style="text-align:center"><h3>الصفحة غير موجودة</h3><p><a href="/">عد إلى الصفحة الرئيسية</a></p></div>')));

const PORT = process.env.PORT || 3070;
app.listen(PORT, () => console.log('fahes on ' + PORT));

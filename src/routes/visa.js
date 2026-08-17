// وحدة التأشيرات داخل فاحص — فحص ملف شنغن + جدول كل دول العالم.
const express = require('express');
const { layout, esc, icon } = require('../views');
const visa = require('../visa');
const { COUNTRIES, SOURCE, REFUSAL_REASONS } = require('../data/schengen');
const { OTHERS } = require('../data/others');
const { WORLD, WORLD_STATUS, WORLD_SOURCE } = require('../data/world');

const router = express.Router();

const tabs = (active) => `<div class="tabs">
  <a href="/visa" class="${active === 'check' ? 'on' : ''}">فحص الملف</a>
  <a href="/visa/countries" class="${active === 'countries' ? 'on' : ''}">كل دول العالم</a>
  <a href="/visa/refusals" class="${active === 'refusals' ? 'on' : ''}">أسباب الرفض الرسمية</a>
</div>`;

/* ── استمارة فحص ملف التأشيرة ── */
function form(v = {}) {
  const val = (k, d = '') => esc(v[k] != null ? v[k] : d);
  const sel = (k, x) => (v[k] === x ? ' selected' : '');
  const opts = (obj, k) => Object.entries(obj).map(([key, label]) => `<option value="${key}"${sel(k, key)}>${esc(label)}</option>`).join('');
  return `
  <div class="fhead">
    <span class="tag" style="background:rgba(255,255,255,.16);color:#fff;border-color:rgba(255,255,255,.3)">السفر</span>
    <h1>${icon('passport',26)} فاحص ملف التأشيرة</h1>
    <p>قبل أن تدفع 90 يورو غير قابلة للاسترجاع، تأكّد أن ملفك يحترم الشروط الرسمية المنشورة.</p>
  </div>
  <form class="fbody" method="post" action="/visa">
    <div class="field"><label class="q">الدولة (فضاء شنغن)</label>
      <select name="country">${COUNTRIES.map((c) => `<option value="${c.code}"${sel('country', c.code)}>${esc(c.ar)}</option>`).join('')}</select></div>
    <div class="field"><label class="q">الغرض من السفر</label>
      <select name="purpose">${opts(visa.PURPOSE_LABEL, 'purpose')}</select></div>
    <div class="field"><label class="q">وضعيتك المهنية</label>
      <select name="profile">${opts(visa.PROFILE_LABEL, 'profile')}</select></div>
    <div class="field"><label class="q">عدد المسافرين</label>
      <div class="inline"><input type="number" name="travellers" min="1" value="${val('travellers', '1')}"><span class="unit">شخص</span></div></div>
    <div class="field"><label class="q">تاريخ الذهاب</label><input type="date" name="departure" value="${val('departure')}"></div>
    <div class="field"><label class="q">تاريخ العودة</label><input type="date" name="return_" value="${val('return_')}"></div>
    <div class="field"><label class="q">أيام مستهلكة في شنغن خلال آخر 180 يوماً</label>
      <div class="inline"><input type="number" name="daysUsed180" min="0" value="${val('daysUsed180', '0')}"><span class="unit">يوم</span></div></div>
    <div class="field"><label class="q">تاريخ إصدار الجواز</label><input type="date" name="passportIssue" value="${val('passportIssue')}"></div>
    <div class="field"><label class="q">تاريخ انتهاء الجواز</label><input type="date" name="passportExpiry" value="${val('passportExpiry')}"></div>
    <div class="field"><label class="q">رصيد الحساب</label>
      <div class="inline"><input type="number" name="balance" min="0" value="${val('balance')}">
      <select name="balanceCur" style="max-width:120px">${['EUR', 'DZD', 'PLN', 'CZK', 'SEK', 'NOK', 'DKK', 'CHF', 'ISK']
        .map((c) => `<option${sel('balanceCur', c)}>${c}</option>`).join('')}</select></div></div>
    <div class="field"><label class="q">تغطية التأمين على السفر</label>
      <div class="inline"><input type="number" name="insuranceCover" min="0" value="${val('insuranceCover')}"><span class="unit">يورو</span></div></div>
    <div class="field"><label class="q">تاريخ آخر إيداع كبير في الحساب (اختياري)</label>
      <input type="date" name="bigDepositDate" value="${val('bigDepositDate')}"></div>
    <div class="field"><label class="q">هل لديك إثبات إقامة (حجز فندق أو شهادة استضافة)؟</label>
      <div class="yesno">
        <label><input type="radio" name="hasAccommodation" value="1" ${v.hasAccommodation === '1' ? 'checked' : ''}><span>نعم</span></label>
        <label><input type="radio" name="hasAccommodation" value="0" ${v.hasAccommodation === '0' ? 'checked' : ''}><span>لا</span></label>
      </div></div>
    <div class="field"><label class="q">هل لديك حجز طيران ذهاباً وإياباً؟</label>
      <div class="yesno">
        <label><input type="radio" name="hasReturnTicket" value="1" ${v.hasReturnTicket === '1' ? 'checked' : ''}><span>نعم</span></label>
        <label><input type="radio" name="hasReturnTicket" value="0" ${v.hasReturnTicket === '0' ? 'checked' : ''}><span>لا</span></label>
      </div></div>
    <div class="sticky-cta"><button class="btn block" type="submit">افحص ملفي ←</button></div>
  </form>`;
}

router.get('/', (req, res) => {
  const t = new Date();
  const d = (n) => new Date(t.getTime() + n * 86400000).toISOString().slice(0, 10);
  res.send(layout('فاحص ملف التأشيرة', tabs('check') + form({
    departure: d(45), return_: d(55), travellers: '1', daysUsed180: '0', balanceCur: 'EUR',
    hasAccommodation: '1', hasReturnTicket: '1',
  }), { user: req.user, active: 'visa' }));
});

router.post('/', (req, res) => {
  const b = req.body;
  const r = visa.check({
    country: b.country, departure: b.departure, return_: b.return_,
    passportIssue: b.passportIssue || null, passportExpiry: b.passportExpiry || null,
    hasAccommodation: b.hasAccommodation === '1', hasReturnTicket: b.hasReturnTicket === '1',
    insuranceCover: b.insuranceCover, balance: b.balance, balanceCur: b.balanceCur,
    daysUsed180: b.daysUsed180, travellers: b.travellers, bigDepositDate: b.bigDepositDate || null,
  });

  const grad = r.verdict === 'fail' ? 'linear-gradient(135deg,#66101d,#b31c2c)'
    : r.verdict === 'warn' ? 'linear-gradient(135deg,#8a5a06,#d9930d)' : 'linear-gradient(135deg,#0b6b3c,#12a45c)';
  const head = { fail: `ملفك فيه ${r.score.fail} نقطة قد تؤدي إلى الرفض`, warn: `${r.score.warn} نقطة تحتاج تقوية`, ok: 'كل النقاط القابلة للفحص سليمة' }[r.verdict];
  const icon = { fail: '×', warn: '!', ok: '✓' }[r.verdict];

  const items = r.items.map((i) => `<div class="chk ${i.level === 'ok' ? 'pass' : i.level === 'warn' ? 'unknown' : 'fail'}">
      <div class="m">${i.level === 'ok' ? '✓' : i.level === 'warn' ? '!' : '×'}</div>
      <div><b>${esc(i.title)}</b>
        ${i.detail ? `<div class="why" style="color:var(--ink2)">${esc(i.detail)}</div>` : ''}
        ${i.fix ? `<div class="why">الحل: ${esc(i.fix)}</div>` : ''}</div></div>`).join('');

  const docs = visa.docsFor(b.profile, b.purpose, r.country);
  const body = tabs('check') + `
  <div class="verdict" style="background:${grad}">
    <div class="top"><div class="ring">${icon}</div><div><h1>${esc(head)}</h1></div></div>
    <p>${esc(r.country ? r.country.ar : '')} · فحص حسابي بحت مقارنةً بالمبالغ والشروط الرسمية المنشورة.</p>
  </div>
  <div class="card" style="margin-bottom:14px"><h2 class="sec" style="font-size:19px">تفصيل الفحص</h2>${items}
    <div class="src">المصدر: ${esc(SOURCE.amounts.label)} (تحديث ${esc(SOURCE.amounts.updated)}).</div></div>
  <div class="card" style="margin-bottom:14px">
    <h2 class="sec" style="font-size:19px">${icon('papers',20)} وثائقك — ${esc(visa.PROFILE_LABEL[b.profile] || '')} / ${esc(visa.PURPOSE_LABEL[b.purpose] || '')}</h2>
    <ul class="docs">${docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    ${r.country && r.country.site ? `<a class="btn block" style="margin-top:14px" href="${esc(r.country.site)}" target="_blank" rel="noopener">الموقع الرسمي للإيداع ↗</a>` : ''}
  </div>
  <div class="card" style="text-align:center"><a href="/visa">↺ أعد الفحص</a> · <a href="/visa/countries">كل دول العالم</a></div>`;
  res.send(layout('نتيجة فحص التأشيرة', body, { user: req.user, active: 'visa' }));
});

/* ── كل دول العالم ── */
router.get('/countries', (req, res) => {
  const detailed = new Set(OTHERS.map((o) => o.ar).concat(COUNTRIES.map((c) => c.ar)));
  const counts = {};
  WORLD.forEach((w) => { counts[w.status] = (counts[w.status] || 0) + 1; });

  const rows = WORLD.map((w) => {
    const s = WORLD_STATUS[w.status];
    return `<tr class="wrow" data-s="${w.status}" data-n="${esc(w.ar + ' ' + w.en)}">
      <td><b>${esc(w.ar)}</b><div class="muted" style="font-size:12px">${esc(w.en)}</div></td>
      <td><span class="badge" style="background:${s.color}">${esc(s.ar)}</span></td>
      <td>${esc(w.stay || '—')}</td>
      <td class="muted">${esc(w.note || '')}${detailed.has(w.ar) ? (w.note ? ' ' : '') + '<b>تفاصيل في فحص الملف ↑</b>' : ''}</td>
    </tr>`;
  }).join('');

  const chips = Object.entries(WORLD_STATUS).sort((a, b) => a[1].rank - b[1].rank)
    .map(([k, s]) => `<button type="button" class="chip" data-f="${k}" style="border-color:${s.color};color:${s.color}">${esc(s.ar)} (${counts[k] || 0})</button>`).join('');

  res.send(layout('كل دول العالم', tabs('countries') + `
  <section>
    <h2 class="sec">${icon('world',21)} كل دول العالم — ${WORLD.length} دولة بجواز سفر جزائري</h2>
    <p class="sub">هل تحتاج تأشيرة مسبقة، أم تكفيك إلكترونية أو عند الوصول، أم تدخل بلا تأشيرة أصلاً.</p>
    <div class="search"><input type="search" id="q" placeholder="اكتب اسم الدولة… (عربي أو إنجليزي)"></div>
    <div class="chips"><button type="button" class="chip on" data-f="all">الكل (${WORLD.length})</button>${chips}</div>
    <div class="card" style="padding:6px 12px;overflow-x:auto">
      <table><tr><th>الدولة</th><th>الوضع</th><th>الإقامة</th><th>ملاحظات</th></tr>${rows}</table>
      <div id="none" class="muted" style="display:none;padding:14px">لا توجد نتيجة بهذا الاسم.</div>
    </div>
    <div class="src">${esc(WORLD_SOURCE.label)} — سُحبت في ${esc(WORLD_SOURCE.fetched)}. تجميع مرجعي وليس وثيقة رسمية:
      قبل حجز أي تذكرة تأكّد من الموقع الرسمي للدولة أو سفارتها.</div>
  </section>
  <script>
  (function(){
    var q=document.getElementById('q'), rows=[].slice.call(document.querySelectorAll('.wrow')),
        chips=[].slice.call(document.querySelectorAll('.chip')), f='all';
    function apply(){
      var t=(q.value||'').trim().toLowerCase(), n=0;
      rows.forEach(function(r){
        var ok=(f==='all'||r.dataset.s===f)&&(!t||r.dataset.n.toLowerCase().indexOf(t)>-1);
        r.style.display=ok?'':'none'; if(ok)n++;
      });
      document.getElementById('none').style.display=n?'none':'block';
    }
    q.addEventListener('input',apply);
    chips.forEach(function(c){c.addEventListener('click',function(){
      chips.forEach(function(x){x.classList.remove('on')}); c.classList.add('on'); f=c.dataset.f; apply();
    })});
  })();
  </script>`, { user: req.user, active: 'visa' }));
});

/* ── أسباب الرفض الرسمية ── */
router.get('/refusals', (req, res) => {
  res.send(layout('أسباب الرفض الرسمية', tabs('refusals') + `
  <section><h2 class="sec">أسباب الرفض في النموذج الموحّد</h2>
  <p class="sub">هذه هي الخانات التي تُؤشَّر في قرار الرفض الرسمي. معرفتها تساعدك على تحصين ملفك مسبقاً.</p>
  <div class="card"><ol style="padding-inline-start:20px;margin:0">
    ${REFUSAL_REASONS.map((r) => `<li style="padding:6px 0">${esc(typeof r === 'string' ? r : r.ar || r.text || '')}</li>`).join('')}
  </ol>
  <div class="src">المصدر: الملحق السادس من مدوّنة التأشيرات الأوروبية (نموذج تبليغ رفض التأشيرة).</div></div>
  </section>`, { user: req.user, active: 'visa' }));
});

module.exports = router;

// صفحات الحساب: تسجيل، دخول، ملفاتي.
const express = require('express');
const { layout, esc } = require('../views');
const { BY_ID } = require('../services');
const auth = require('../auth');

const router = express.Router();
const VERDICT_LABEL = { ready: 'مستوفٍ', incomplete: 'ناقص', reject: 'غير مؤهل' };

const authPage = ({ title, lead, error, notice, action, fields, submit, footer, user }) =>
  layout(title, `<div class="authcard">
    <h1>${esc(title)}</h1>
    <p class="lead">${esc(lead)}</p>
    ${error ? `<div class="alert">${esc(error)}</div>` : ''}
    ${notice ? `<div class="ok">${esc(notice)}</div>` : ''}
    <form method="post" action="${action}">${fields}
      <button class="btn block" type="submit">${esc(submit)}</button>
    </form>
    <p class="lead" style="margin:16px 0 0;text-align:center">${footer}</p>
  </div>`, { user, active: 'me' });

const input = (name, label, type = 'text', extra = '') =>
  `<div class="field"><label for="${name}">${esc(label)}</label>
     <input id="${name}" name="${name}" type="${type}" ${extra}></div>`;

/* ── إنشاء حساب ── */
router.get('/signup', (req, res) => {
  if (req.user) return res.redirect('/me');
  res.send(authPage({
    title: 'أنشئ حسابك',
    lead: 'الحساب يتيح لك حفظ نتائج فحوصك ومتابعة الوثائق الناقصة لكل ملف.',
    error: req.query.e,
    action: '/signup',
    user: null,
    fields: input('name', 'الاسم', 'text', 'autocomplete="name"')
      + input('email', 'البريد الإلكتروني', 'email', 'inputmode="email" autocomplete="email" required')
      + input('wilaya', 'الولاية (اختياري)')
      + input('password', 'كلمة السر (6 أحرف فأكثر)', 'password', 'autocomplete="new-password" required'),
    submit: 'إنشاء الحساب',
    footer: 'لديك حساب؟ <a href="/login">سجّل الدخول</a>',
  }));
});

router.post('/signup', (req, res) => {
  try {
    const user = auth.createUser(req.body);
    res.setHeader('Set-Cookie', auth.sessionCookie(user.id));
    res.redirect('/me');
  } catch (e) {
    res.redirect('/signup?e=' + encodeURIComponent(e.message));
  }
});

/* ── تسجيل الدخول ── */
router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/me');
  res.send(authPage({
    title: 'تسجيل الدخول',
    lead: 'ادخل إلى ملفاتك المحفوظة ومتابعة وثائقك.',
    error: req.query.e,
    notice: req.query.m,
    action: '/login?next=' + encodeURIComponent(req.query.next || '/me'),
    user: null,
    fields: input('email', 'البريد الإلكتروني', 'email', 'inputmode="email" autocomplete="email" required')
      + input('password', 'كلمة السر', 'password', 'autocomplete="current-password" required'),
    submit: 'دخول',
    footer: 'ليس لديك حساب؟ <a href="/signup">أنشئ واحداً مجاناً</a>',
  }));
});

router.post('/login', (req, res) => {
  const user = auth.authenticate(req.body.email, req.body.password);
  if (!user) return res.redirect('/login?e=' + encodeURIComponent('البريد أو كلمة السر غير صحيحة.'));
  res.setHeader('Set-Cookie', auth.sessionCookie(user.id));
  const next = String(req.query.next || '/me');
  res.redirect(next.startsWith('/') ? next : '/me');
});

router.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', auth.clearCookie());
  res.redirect('/');
});

/* ── ملفاتي ── */
router.get('/me', auth.requireUser, (req, res) => {
  const user = req.user;
  const files = user.files || [];
  const initial = esc((user.name || user.email)[0].toUpperCase());

  const fileCard = (f) => {
    const svc = BY_ID[f.service];
    const done = new Set(f.doneDocs || []);
    const docs = (svc ? svc.docs : []).map((d) => `<li class="${done.has(d) ? 'done' : ''}">
        <form method="post" action="/me/doc" style="display:inline">
          <input type="hidden" name="file" value="${f.id}"><input type="hidden" name="doc" value="${esc(d)}">
          <button type="submit" title="تبديل">${done.has(d) ? '✅' : '⬜'}</button>
        </form><span>${esc(d)}</span></li>`).join('');
    const missing = (f.missing || []).map((m) => `<li><span>❗ ${esc(m)}</span></li>`).join('');
    return `<div class="filecard">
      <div class="top">
        <b>${svc ? svc.icon + ' ' + esc(svc.name) : esc(f.service)}</b>
        <span class="badge ${f.verdict}">${esc(VERDICT_LABEL[f.verdict] || f.verdict)}</span>
      </div>
      <div class="muted" style="font-size:13px">${esc(new Date(f.saved).toLocaleDateString('fr-DZ'))} ·
        ${f.passed}/${f.total} شرط مستوفٍ</div>
      ${missing ? `<ul class="docs" style="margin-top:8px">${missing}</ul>` : ''}
      <details style="margin-top:8px"><summary style="cursor:pointer;font-weight:700;font-size:14.5px">وثائق الملف (${(svc ? svc.docs : []).length})</summary>
        <ul class="docs">${docs}</ul></details>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <a class="btn ghost" style="flex:1;min-width:140px" href="/s/${esc(f.service)}">أعد الفحص</a>
        ${svc ? `<a class="btn" style="flex:1;min-width:140px" href="${esc(svc.url)}" target="_blank" rel="noopener">الموقع الرسمي ↗</a>` : ''}
        <form method="post" action="/me/delete"><input type="hidden" name="file" value="${f.id}">
          <button class="btn ghost" type="submit">حذف</button></form>
      </div>
    </div>`;
  };

  const body = `
    <div class="userrow">
      <div class="avatar">${initial}</div>
      <div><b style="font-size:18px">${esc(user.name)}</b>
        <div class="muted" style="font-size:13.5px">${esc(user.email)}${user.wilaya ? ' · ' + esc(user.wilaya) : ''}</div></div>
      <form method="post" action="/logout" style="margin-inline-start:auto">
        <button class="btn ghost" type="submit">خروج</button></form>
    </div>
    <h2 class="sec">📁 ملفاتي (${files.length})</h2>
    ${files.length ? files.map(fileCard).join('')
      : `<div class="filecard"><b>لم تحفظ أي ملف بعد.</b>
          <p class="muted" style="margin:6px 0 12px">افحص أي خدمة، ثم اضغط «احفظ في ملفاتي» أسفل النتيجة لتتابع وثائقك وشروطك الناقصة.</p>
          <a class="btn" href="/">تصفّح الخدمات ←</a></div>`}
    <p class="muted" style="font-size:13px;margin-top:18px">بياناتك محفوظة على هذا الخادم وحده، ولا تُشارك مع أي جهة. احذف أي ملف متى شئت.</p>`;

  res.send(layout('ملفاتي', body, { user, active: 'me' }));
});

router.post('/me/doc', auth.requireUser, (req, res) => {
  auth.toggleDoc(req.user.id, req.body.file, req.body.doc);
  res.redirect('/me');
});

router.post('/me/delete', auth.requireUser, (req, res) => {
  auth.deleteFile(req.user.id, req.body.file);
  res.redirect('/me');
});

module.exports = router;

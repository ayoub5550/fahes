const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const num = (n) => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 0 });

// ── نظام التصميم — أحمر متدرّج، عربي RTL، مبني للهاتف أولاً ──────────────────
const CSS = `
:root{
  --r900:#3f0a10; --r800:#66101d; --r700:#8b1424; --r600:#b31c2c; --r500:#dd2438; --r400:#ff5563;
  --amber:#e08c00; --green:#0f8a4d;
  --ink:#181114; --ink2:#4d3f44; --muted:#8a777d; --line:#efe3e5; --bg:#faf7f7; --card:#fff;
  --sh:0 6px 22px -14px rgba(102,16,29,.5); --sh2:0 20px 48px -26px rgba(102,16,29,.55);
  --rad:18px;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,'Segoe UI','Noto Naskh Arabic','Noto Sans Arabic',Tahoma,sans-serif;
  font-size:16px;line-height:1.7;overflow-x:hidden}
img{max-width:100%}
a{color:var(--r600);text-decoration:none}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
.muted{color:var(--muted)}

/* الهيدر */
header.nav{position:sticky;top:0;z-index:60;background:rgba(63,10,16,.94);backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,.08)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:56px;gap:12px}
.brand{display:flex;align-items:center;gap:9px;color:#fff;font-weight:800;font-size:19px}
.brand .dot{width:29px;height:29px;border-radius:9px;background:linear-gradient(135deg,var(--r400),var(--r600));
  display:grid;place-items:center;font-size:15px}
.nav nav{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
.nav nav::-webkit-scrollbar{display:none}
.nav a.link{color:rgba(255,255,255,.85);font-weight:600;font-size:14px;padding:6px 10px;border-radius:9px;white-space:nowrap}
.nav a.link:active{background:rgba(255,255,255,.14)}

/* الهيرو */
.hero{position:relative;overflow:hidden;color:#fff;padding:38px 0 44px;background:
  radial-gradient(700px 380px at 88% -20%,rgba(255,85,99,.5),transparent 62%),
  radial-gradient(560px 340px at 0% 120%,rgba(224,140,0,.3),transparent 60%),
  linear-gradient(155deg,var(--r900),var(--r800) 48%,var(--r600))}
.hero:after{content:'';position:absolute;inset:0;opacity:.16;pointer-events:none;
  background-image:radial-gradient(rgba(255,255,255,.6) 1px,transparent 1px);background-size:20px 20px}
.hero .wrap{position:relative;z-index:2}
.hero h1{font-size:30px;line-height:1.25;margin:0 0 10px;font-weight:800;letter-spacing:-.5px}
.hero h1 em{font-style:normal;background:linear-gradient(90deg,#ffd9ac,#ff9aa4);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:16px;margin:0 0 18px;color:rgba(255,255,255,.9);max-width:620px}
.pill{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);
  padding:5px 13px;border-radius:999px;font-size:12.5px;font-weight:700;margin-bottom:14px}
.stats{display:flex;gap:26px;flex-wrap:wrap;margin-top:22px;padding-top:18px;border-top:1px solid rgba(255,255,255,.18)}
.stats b{display:block;font-size:24px;font-weight:800;line-height:1.25}
.stats span{font-size:12.5px;color:rgba(255,255,255,.8)}

/* الأزرار */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;font-family:inherit;
  font-weight:700;font-size:16px;padding:14px 26px;border-radius:14px;min-height:50px;
  background:linear-gradient(135deg,var(--r500),var(--r700));color:#fff;box-shadow:0 14px 28px -16px var(--r600)}
.btn:active{transform:translateY(1px)}
.btn.light{background:#fff;color:var(--r700);box-shadow:0 12px 26px -16px rgba(0,0,0,.5)}
.btn.block{width:100%}
.btn.ghost{background:#fff;color:var(--r700);border:1.5px solid var(--line);box-shadow:none}

/* البحث والتصفية */
.search{position:relative;margin:0 0 14px}
.search input{width:100%;padding:15px 46px 15px 16px;border:1.5px solid var(--line);border-radius:14px;
  font-family:inherit;font-size:16px;background:#fff;box-shadow:var(--sh)}
.search:before{content:'🔎';position:absolute;inset-inline-end:16px;top:14px;opacity:.5}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:18px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;background:#fff;border:1.5px solid var(--line);border-radius:999px;padding:8px 15px;
  font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;color:var(--ink2)}
.chip.on{background:linear-gradient(135deg,var(--r500),var(--r700));border-color:transparent;color:#fff}

/* شريط تقدّم علوي عند التنقل — إحساس فوري بالاستجابة */
#nprog{position:fixed;top:0;inset-inline-start:0;height:3px;width:0;z-index:99;
  background:linear-gradient(90deg,var(--r400),#ffd9ac);transition:width .25s ease;opacity:0}
#nprog.on{opacity:1}

/* أداء: لا يُرسم القسم خارج الشاشة إلا عند الوصول إليه */
.catsec{content-visibility:auto;contain-intrinsic-size:auto 520px}

/* البطاقات */
main{padding:26px 0 60px}
section{margin-bottom:34px}
h2.sec{font-size:21px;font-weight:800;margin:0 0 4px}
p.sub{color:var(--muted);margin:0 0 16px;font-size:14.5px}
.grid{display:grid;grid-template-columns:1fr;gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--rad);padding:18px;box-shadow:var(--sh)}
a.card{display:flex;gap:14px;align-items:flex-start;color:inherit}
a.card:active{border-color:#f0c6cb}
.card .ic{font-size:26px;line-height:1.2;flex:0 0 auto}
.card h3{margin:0 0 4px;font-size:17px;font-weight:800}
.card p{margin:0;color:var(--ink2);font-size:14px;line-height:1.65}
.card .agency{margin-top:8px;font-size:12px;color:var(--r700);font-weight:700}
.tag{display:inline-block;background:#fdf1f2;color:var(--r700);border:1px solid #f7dfe2;border-radius:999px;
  padding:3px 11px;font-size:12px;font-weight:700}

/* الاستمارة */
.fhead{background:linear-gradient(135deg,var(--r800),var(--r600));color:#fff;padding:22px 18px;border-radius:var(--rad) var(--rad) 0 0}
.fhead h1{margin:6px 0 6px;font-size:23px;font-weight:800;line-height:1.3}
.fhead p{margin:0;color:rgba(255,255,255,.9);font-size:14.5px}
.fbody{background:#fff;border:1px solid var(--line);border-top:0;border-radius:0 0 var(--rad) var(--rad);padding:6px 18px 4px;box-shadow:var(--sh);position:relative}
.field{padding:16px 0;border-bottom:1px dashed var(--line)}
.field:last-of-type{border-bottom:0}
.q{display:block;font-weight:700;font-size:15.5px;margin-bottom:10px;line-height:1.55}
input[type=number],input[type=text],input[type=date],select{width:100%;max-width:100%;padding:13px 14px;border:1.5px solid var(--line);
  border-radius:12px;font-family:inherit;font-size:16px;background:#fff;color:var(--ink)}
input:focus,select:focus{outline:0;border-color:var(--r500);box-shadow:0 0 0 4px rgba(221,36,56,.11)}
.inline{display:flex;align-items:center;gap:10px}
.unit{color:var(--muted);font-size:14px;white-space:nowrap}
.yesno{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:320px}
.yesno label{cursor:pointer}
.yesno input{position:absolute;opacity:0;width:0;height:0}
.yesno span{display:block;text-align:center;padding:13px 10px;border:1.5px solid var(--line);border-radius:12px;
  font-weight:700;font-size:15px;background:#fff}
.yesno input:checked + span{background:linear-gradient(135deg,var(--r500),var(--r700));border-color:transparent;color:#fff}
.sticky-cta{position:sticky;bottom:0;background:#fff;border-top:1px solid var(--line);padding:12px 0 14px;margin-top:10px;z-index:20}
.sticky-cta:before{content:'';position:absolute;inset-inline:-18px;top:0;bottom:0;background:#fff;z-index:-1}

/* النتيجة */
.verdict{padding:22px 18px;border-radius:var(--rad);color:#fff;margin-bottom:16px;box-shadow:var(--sh2)}
.verdict .top{display:flex;align-items:center;gap:14px}
.verdict .ring{width:56px;height:56px;flex:0 0 56px;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:800;
  background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.42)}
.verdict h1{margin:0;font-size:21px;font-weight:800;line-height:1.35}
.verdict p{margin:10px 0 0;color:rgba(255,255,255,.93);font-size:14.5px}
.bar{height:8px;border-radius:99px;background:rgba(255,255,255,.25);margin-top:14px;overflow:hidden}
.bar i{display:block;height:100%;background:#fff;border-radius:99px}
.chk{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--line)}
.chk:last-child{border-bottom:0}
.chk .m{flex:0 0 24px;height:24px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff}
.chk.pass .m{background:var(--green)} .chk.fail .m{background:var(--r600)} .chk.unknown .m{background:var(--amber)}
.chk b{font-weight:700;font-size:15px;display:block;line-height:1.55}
.chk .why{color:var(--r700);font-size:14px;margin-top:5px;line-height:1.6}
.chk.unknown .why{color:#8a6a12}
.money{background:linear-gradient(135deg,#fdf1f2,#fff8f0);border:1px solid #f7dfe2;border-radius:13px;padding:13px 15px;font-size:14.5px;font-weight:600}
.rows{display:grid;gap:8px;margin-top:6px}
.row{display:flex;justify-content:space-between;gap:12px;padding:11px 14px;background:#fbf7f7;border:1px solid var(--line);border-radius:12px;font-size:14.5px}
.row b{font-weight:800;white-space:nowrap}
ul.docs{margin:0;padding-inline-start:20px}
ul.docs li{padding:4px 0;font-size:15px}
.note{background:#fffaf0;border:1px solid #fbe6bd;border-inline-start:4px solid var(--amber);border-radius:12px;padding:12px 15px;margin:10px 0;font-size:14.5px}
.src{font-size:12.5px;color:var(--muted);margin-top:16px;padding-top:12px;border-top:1px solid var(--line);line-height:1.7}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:10px 8px;text-align:start;border-bottom:1px solid var(--line);vertical-align:top}
th{background:#fbf7f7;font-size:12.5px;color:var(--ink2)}
.badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;color:#fff;font-weight:700;white-space:nowrap}
footer{background:var(--r900);color:rgba(255,255,255,.75);padding:26px 0;font-size:13.5px;line-height:1.8}
footer a{color:#ffb3ba}
.tabs{display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;scrollbar-width:none}
.tabs a{flex:0 0 auto;padding:9px 16px;border-radius:999px;background:#fff;border:1.5px solid var(--line);font-weight:700;font-size:14px;color:var(--ink2)}
.tabs a.on{background:linear-gradient(135deg,var(--r500),var(--r700));border-color:transparent;color:#fff}

@media(min-width:720px){
  .wrap{padding:0 24px}
  .hero{padding:64px 0 76px}
  .hero h1{font-size:44px} .hero p{font-size:18px}
  main{padding:48px 0 80px}
  .grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
  h2.sec{font-size:26px}
  .fhead{padding:28px 30px} .fhead h1{font-size:28px}
  .fbody{padding:10px 30px 26px}
  .card{padding:22px}
  .verdict{padding:28px 30px} .verdict h1{font-size:25px}
  .verdict .ring{width:74px;height:74px;flex-basis:74px;font-size:34px}
}

/* ── الشريط السفلي (إحساس التطبيق) ── */
.tabbar{position:fixed;inset-inline:0;bottom:0;z-index:70;display:none;background:rgba(255,255,255,.96);
  backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:6px 4px calc(6px + env(safe-area-inset-bottom))}
.tabbar a{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;font-weight:700;
  color:var(--muted);padding:5px 2px;border-radius:12px}
.tabbar a i{font-style:normal;font-size:19px;line-height:1}
.tabbar a.on{color:var(--r600);background:#fdf0f1}
@media(max-width:820px){.tabbar{display:flex}body{padding-bottom:66px}.nav nav{display:none}.nav .wrap{justify-content:space-between}}

/* ── الحساب ── */
.authcard{max-width:430px;margin:26px auto;background:var(--card);border:1px solid var(--line);border-radius:var(--rad);
  padding:24px 20px;box-shadow:var(--sh2)}
.authcard h1{margin:0 0 4px;font-size:23px}
.authcard .lead{color:var(--muted);font-size:14px;margin:0 0 18px}
.field{margin-bottom:14px}
.field label{display:block;font-weight:700;font-size:14.5px;margin-bottom:6px}
.field input{width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:13px;font-family:inherit;font-size:16px;background:#fff}
.field input:focus{outline:0;border-color:var(--r500);box-shadow:0 0 0 4px rgba(221,36,56,.1)}
.alert{background:#fff3f3;border:1px solid #ffd4d8;color:#8b1424;padding:11px 13px;border-radius:12px;font-size:14px;margin-bottom:14px}
.ok{background:#eefaf3;border:1px solid #c4ecd6;color:#0f8a4d;padding:11px 13px;border-radius:12px;font-size:14px;margin-bottom:14px}
.avatar{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,var(--r400),var(--r700));color:#fff;
  display:grid;place-items:center;font-weight:800;font-size:17px}
.userrow{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.filecard{background:var(--card);border:1px solid var(--line);border-radius:var(--rad);padding:15px 16px;margin-bottom:12px;box-shadow:var(--sh)}
.filecard .top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
.badge{font-size:12px;font-weight:800;padding:4px 10px;border-radius:999px}
.badge.ready{background:#eefaf3;color:#0f8a4d}
.badge.incomplete{background:#fff6e6;color:#a56a00}
.badge.reject{background:#fdeced;color:#b31c2c}
.docs{list-style:none;padding:0;margin:8px 0 0}
.docs li{display:flex;align-items:flex-start;gap:9px;padding:5px 0;font-size:14.5px;border-bottom:1px dashed var(--line)}
.docs li:last-child{border-bottom:0}
.docs button{background:none;border:0;cursor:pointer;font-size:17px;padding:0;line-height:1.4}
.docs li.done span{color:var(--muted);text-decoration:line-through}
.navuser{display:flex;align-items:center;gap:6px;color:#fff;font-weight:700;font-size:13.5px;
  background:rgba(255,255,255,.16);padding:5px 11px;border-radius:999px;white-space:nowrap}
`;

const CSS_HASH = require('crypto').createHash('sha1').update(CSS).digest('hex').slice(0, 10);

function layout(title, body, opts = {}) {
  const user = opts.user || null;
  const active = opts.active || '';
  const nav = [
    ['/', 'الخدمات'],
    ['/visa', 'التأشيرات'],
    ['/how', 'كيف يعمل'],
    ['/about', 'عن فاحص'],
  ].map(([h, t]) => `<a class="link" href="${h}">${t}</a>`).join('');
  const account = user
    ? `<a class="navuser" href="/me">👤 ${esc((user.name || '').split(' ')[0] || 'حسابي')}</a>`
    : `<a class="navuser" href="/login">دخول</a>`;
  const tabs = [
    ['/', '🏠', 'الرئيسية', 'home'],
    ['/#services', '🗂️', 'الخدمات', 'services'],
    ['/visa', '✈️', 'التأشيرات', 'visa'],
    [user ? '/me' : '/login', '👤', user ? 'ملفاتي' : 'حسابي', 'me'],
  ].map(([h, i, t, k]) => `<a href="${h}" class="${active === k ? 'on' : ''}"><i>${i}</i>${t}</a>`).join('');
  return `<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#3f0a10">
<title>${esc(title)} · فاحص</title>
<meta name="description" content="فاحص — افحص أهليتك للسكن والمنح والقروض والتأشيرات في الجزائر قبل أن تودع الملف، بشروط رسمية وحساب دقيق.">
<link rel="stylesheet" href="/a/app.${CSS_HASH}.css"></head><body>
<header class="nav"><div class="wrap">
  <a class="brand" href="/"><span class="dot">✓</span> فاحص</a>
  <nav>${nav}</nav>
  ${account}
</div></header>
${opts.hero || ''}
<main><div class="wrap">${body}</div></main>
<footer><div class="wrap">
  <b style="color:#fff">فاحص</b> — أداة توجيه مبنية على النصوص والمواقع الرسمية الجزائرية.
  لسنا جهة حكومية ولا وسيطاً، ولا نقبل ملفات ولا نضمن نتيجة: كل خدمة تُودَع حصراً عبر موقعها الرسمي.
  <br>بلا حساب: لا نحتفظ بأي شيء، وكل ما تدخله يُحسب في اللحظة ثم يُنسى.
  بحساب: نحفظ فقط ما تختار حفظه في «ملفاتي»، ويمكنك حذفه في أي وقت.
  <br><span style="opacity:.7">محرّك القواعد: Publicodes مفتوح المصدر · بلا ذكاء اصطناعي</span>
</div></footer>
<div id="nprog"></div>
<div class="tabbar">${tabs}</div>
<script>(function(){var d={};function p(u){if(d[u]||!u)return;d[u]=1;var l=document.createElement('link');l.rel='prefetch';l.href=u;document.head.appendChild(l);}
document.addEventListener('touchstart',function(e){var a=e.target.closest&&e.target.closest('a[href^="/"]');if(a)p(a.getAttribute('href'));},{passive:true,capture:true});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="/"]');
 if(!a||a.hash||a.target)return;var b=document.getElementById('nprog');b.className='on';b.style.width='75%';},{capture:true});
document.addEventListener('mouseover',function(e){var a=e.target.closest&&e.target.closest('a[href^="/"]');if(a)p(a.getAttribute('href'));},{passive:true,capture:true});})();</script>
</body></html>`;
}

module.exports = { layout, esc, num, CSS, CSS_HASH };

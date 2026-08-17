const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
:root{
  --red-900:#4a0d12; --red-800:#6d1220; --red-700:#8e1526; --red-600:#b81d2e;
  --red-500:#e02435; --red-400:#ff4d5a; --amber:#f59e0b; --green:#0f8a4d;
  --ink:#1a1216; --muted:#7b6b70; --line:#efe4e6; --bg:#fbf7f7; --card:#fff;
  --shadow:0 10px 34px -18px rgba(109,18,32,.45);
  --shadow-lg:0 26px 60px -28px rgba(109,18,32,.55);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'Tajawal','Cairo',system-ui,-apple-system,'Segoe UI',sans-serif;
  font-size:16px;line-height:1.75;-webkit-font-smoothing:antialiased}
a{color:var(--red-600);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}

/* ── الهيدر ── */
header.nav{position:sticky;top:0;z-index:50;background:rgba(74,13,18,.88);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.09)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;height:64px}
.brand{display:flex;align-items:center;gap:10px;color:#fff;font-weight:800;font-size:21px;letter-spacing:-.3px}
.brand .dot{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--red-400),var(--red-600));
  display:grid;place-items:center;font-size:17px;box-shadow:0 6px 18px -6px var(--red-400)}
.nav a.link{color:rgba(255,255,255,.82);font-weight:600;font-size:14.5px;margin-inline-start:20px}
.nav a.link:hover{color:#fff;text-decoration:none}

/* ── الهيرو ── */
.hero{position:relative;overflow:hidden;background:
   radial-gradient(1000px 460px at 85% -10%,rgba(255,77,90,.45),transparent 60%),
   radial-gradient(760px 420px at 8% 110%,rgba(245,158,11,.28),transparent 62%),
   linear-gradient(150deg,var(--red-900) 0%,var(--red-800) 45%,var(--red-600) 100%);
  color:#fff;padding:70px 0 90px}
.hero:after{content:'';position:absolute;inset:0;opacity:.18;pointer-events:none;
  background-image:radial-gradient(rgba(255,255,255,.55) 1px,transparent 1px);background-size:22px 22px}
.hero .wrap{position:relative;z-index:2}
.hero h1{font-size:46px;line-height:1.2;margin:0 0 14px;font-weight:800;letter-spacing:-1px}
.hero h1 em{font-style:normal;background:linear-gradient(90deg,#ffd7a8,#ff9aa4);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:18.5px;max-width:640px;color:rgba(255,255,255,.9);margin:0 0 26px}
.pill{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);
  padding:6px 15px;border-radius:999px;font-size:13.5px;font-weight:600;margin-bottom:20px}
.stats{display:flex;flex-wrap:wrap;gap:34px;margin-top:34px;padding-top:26px;border-top:1px solid rgba(255,255,255,.18)}
.stats b{display:block;font-size:30px;font-weight:800;line-height:1.2}
.stats span{font-size:13.5px;color:rgba(255,255,255,.78)}

.btn{display:inline-flex;align-items:center;gap:9px;border:0;cursor:pointer;font-family:inherit;font-weight:700;font-size:16px;
  padding:14px 28px;border-radius:14px;background:linear-gradient(135deg,var(--red-500),var(--red-700));color:#fff;
  box-shadow:0 16px 34px -16px var(--red-600);transition:transform .16s ease,box-shadow .16s ease}
.btn:hover{transform:translateY(-2px);text-decoration:none;box-shadow:0 22px 42px -18px var(--red-600)}
.btn.ghost{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.3);box-shadow:none}
.btn.light{background:#fff;color:var(--red-700)}

/* ── البطاقات ── */
main{padding:56px 0 80px}
section{margin-bottom:56px}
h2.sec{font-size:27px;font-weight:800;margin:0 0 6px;letter-spacing:-.5px}
p.sub{color:var(--muted);margin:0 0 26px;font-size:15.5px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:var(--shadow);
  position:relative;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
a.card:hover{transform:translateY(-4px);border-color:#f3c9ce;box-shadow:var(--shadow-lg);text-decoration:none}
a.card{display:block;color:inherit}
.card:before{content:'';position:absolute;inset-inline-start:0;top:0;bottom:0;width:4px;
  background:linear-gradient(180deg,var(--red-500),var(--red-800));opacity:0;transition:opacity .18s}
a.card:hover:before{opacity:1}
.card .ic{font-size:30px;line-height:1;margin-bottom:12px;display:block}
.card h3{margin:0 0 7px;font-size:18.5px;font-weight:800}
.card p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.7}
.card .agency{margin-top:14px;font-size:12.5px;color:var(--red-700);font-weight:700}
.tag{display:inline-block;background:#fdf1f2;color:var(--red-700);border:1px solid #f7dfe2;border-radius:999px;
  padding:3px 12px;font-size:12.5px;font-weight:700;margin:0 0 10px}

/* ── النموذج ── */
.form-card{background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:var(--shadow-lg);overflow:hidden}
.form-head{background:linear-gradient(135deg,var(--red-800),var(--red-600));color:#fff;padding:30px 32px}
.form-head h1{margin:0 0 8px;font-size:29px;font-weight:800;letter-spacing:-.6px}
.form-head p{margin:0;color:rgba(255,255,255,.88);font-size:15.5px;max-width:640px}
.form-body{padding:30px 32px}
.field{padding:18px 0;border-bottom:1px dashed var(--line)}
.field:last-child{border:0}
.field label.q{display:block;font-weight:700;font-size:16px;margin-bottom:10px}
input[type=number],input[type=text],select{width:100%;max-width:340px;padding:12px 15px;border:1.5px solid var(--line);
  border-radius:12px;font-family:inherit;font-size:15.5px;background:#fff;color:var(--ink);transition:border-color .15s,box-shadow .15s}
input:focus,select:focus{outline:0;border-color:var(--red-500);box-shadow:0 0 0 4px rgba(224,36,53,.12)}
.unit{color:var(--muted);font-size:13.5px;margin-inline-start:8px}
.yesno{display:flex;gap:10px;flex-wrap:wrap}
.yesno label{cursor:pointer}
.yesno input{position:absolute;opacity:0;pointer-events:none}
.yesno span{display:inline-block;padding:9px 24px;border:1.5px solid var(--line);border-radius:12px;font-weight:700;font-size:14.5px;
  background:#fff;transition:all .15s}
.yesno input:checked + span{background:linear-gradient(135deg,var(--red-500),var(--red-700));border-color:transparent;color:#fff;
  box-shadow:0 10px 22px -12px var(--red-600)}
.form-foot{padding:24px 32px 32px;background:#fdf9f9;border-top:1px solid var(--line)}

/* ── النتيجة ── */
.verdict{display:flex;gap:22px;align-items:center;flex-wrap:wrap;padding:28px 32px;border-radius:22px;color:#fff;margin-bottom:26px;
  box-shadow:var(--shadow-lg)}
.verdict .ring{width:88px;height:88px;flex:0 0 88px;border-radius:50%;display:grid;place-items:center;font-size:38px;font-weight:800;
  background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.4)}
.verdict h1{margin:0 0 6px;font-size:26px;font-weight:800}
.verdict p{margin:0;color:rgba(255,255,255,.92);font-size:15.5px;max-width:640px}
.chk{display:flex;gap:14px;padding:15px 0;border-bottom:1px solid var(--line);align-items:flex-start}
.chk:last-child{border:0}
.chk .m{flex:0 0 26px;height:26px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:15px;color:#fff}
.chk.pass .m{background:var(--green)} .chk.fail .m{background:var(--red-600)} .chk.unknown .m{background:var(--amber)}
.chk b{font-weight:700;font-size:15.5px;display:block}
.chk .why{color:var(--red-700);font-size:14.5px;margin-top:4px}
.chk.unknown .why{color:#8a6a12}
.note{background:#fffaf0;border:1px solid #fbe6bd;border-inline-start:4px solid var(--amber);border-radius:12px;padding:14px 18px;margin:10px 0;font-size:15px}
ul.docs{margin:0;padding-inline-start:22px}
ul.docs li{padding:5px 0;font-size:15.5px}
.src{font-size:13px;color:var(--muted);margin-top:20px;padding-top:14px;border-top:1px solid var(--line)}
.money{background:linear-gradient(135deg,#fdf1f2,#fff8f0);border:1px solid #f7dfe2;border-radius:14px;padding:14px 18px;font-size:15px;font-weight:600}
footer{background:var(--red-900);color:rgba(255,255,255,.72);padding:34px 0;font-size:14px}
footer a{color:#ffb3ba}
@media(max-width:640px){
  .hero{padding:48px 0 62px} .hero h1{font-size:32px} .hero p{font-size:16.5px}
  .form-head,.form-body,.form-foot{padding-inline:20px} .stats{gap:22px}
}
`;

function layout(title, body, opts = {}) {
  return `<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · فاحص</title>
<meta name="description" content="فاحص — افحص أهليتك للسكن والمنح والقروض في الجزائر قبل أن تودع الملف، بشروط رسمية وحساب دقيق.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
<header class="nav"><div class="wrap">
  <a class="brand" href="/"><span class="dot">✓</span> فاحص</a>
  <nav>
    <a class="link" href="/">الخدمات</a>
    <a class="link" href="/how">كيف يعمل</a>
    <a class="link" href="/about">عن فاحص</a>
  </nav>
</div></header>
${opts.hero || ''}
<main><div class="wrap">${body}</div></main>
<footer><div class="wrap">
  <b style="color:#fff">فاحص</b> — أداة توجيه مبنية على النصوص والمواقع الرسمية الجزائرية.
  لسنا جهة حكومية ولا وسيطاً، ولا نقبل ملفات ولا نضمن نتيجة: كل خدمة تُودَع حصراً عبر موقعها الرسمي.
  <br>لا نحتفظ ببياناتك: كل ما تدخله يُحسب في اللحظة ثم يُنسى.
</div></footer></body></html>`;
}

module.exports = { layout, esc };

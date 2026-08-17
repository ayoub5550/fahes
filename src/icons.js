'use strict';
/**
 * مجموعة أيقونات SVG داخلية (بلا أي ملف خارجي وبلا إيموجي).
 * كل أيقونة عبارة عن مسارات stroke بلون currentColor، ما يجعلها:
 *  - حادّة في كل الشاشات (vector) عكس الإيموجي الذي يختلف شكله بين الأجهزة،
 *  - خفيفة جداً (لا طلب شبكة إضافي، لا خط أيقونات),
 *  - قابلة للتلوين والتحريك عبر CSS.
 */

// مسارات كل أيقونة (24×24، stroke)
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.6V20h13V9.6"/><path d="M9.6 20v-5.4h4.8V20"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2"/>',
  passport: '<rect x="4.2" y="2.6" width="15.6" height="18.8" rx="3"/><circle cx="12" cy="10" r="3.4"/><path d="M8.6 10h6.8M12 6.6c1.4 1.9 1.4 4.9 0 6.8-1.4-1.9-1.4-4.9 0-6.8"/><path d="M9 17.6h6"/>',
  folder: '<path d="M3 7.2a2.2 2.2 0 0 1 2.2-2.2h3.4l2 2.4h6.2A2.2 2.2 0 0 1 19 9.6"/><path d="M3 7.2v9.6A2.2 2.2 0 0 0 5.2 19h13.6a2.2 2.2 0 0 0 2.2-2.2V9.6H5.2A2.2 2.2 0 0 0 3 11.8"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.6-3.7 3.6-5.8 7.2-5.8s6.6 2.1 7.2 5.8"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.6 15.6 4 4"/>',
  // فئات الخدمات
  housing: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-4.4h4V20"/>',
  work: '<rect x="2.8" y="7" width="18.4" height="13" rx="2.6"/><path d="M8.6 7V5.4A2.4 2.4 0 0 1 11 3h2a2.4 2.4 0 0 1 2.4 2.4V7"/><path d="M2.8 12.4h18.4"/>',
  social: '<path d="M7.5 11.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M16.5 11.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M2.6 20c.4-3 2.4-4.8 4.9-4.8 1.3 0 2.4.5 3.3 1.3"/><path d="M13.2 16.5c.9-.8 2-1.3 3.3-1.3 2.5 0 4.5 1.8 4.9 4.8"/>',
  business: '<path d="M13.6 2.6 5 13.4h5.4L9.6 21.4 19 10.2h-5.6l.2-7.6Z"/>',
  papers: '<path d="M6 3h7.6L19 8.4V21H6Z"/><path d="M13.4 3v5.6H19"/><path d="M9 13h6M9 16.6h6"/>',
  life: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z"/>',
  study: '<path d="m2.8 8.6 9.2-4.4 9.2 4.4-9.2 4.4L2.8 8.6Z"/><path d="M6.6 10.6V16c0 1.5 2.4 2.8 5.4 2.8s5.4-1.3 5.4-2.8v-5.4"/><path d="M21.2 8.6v5.6"/>',
  migration: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9Z"/>',
  global: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19"/>',
  extra: '<path d="M12 2.8 4 6v6c0 4.6 3.2 7.7 8 9.2 4.8-1.5 8-4.6 8-9.2V6l-8-3.2Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  money: '<rect x="2.6" y="6" width="18.8" height="12" rx="2.6"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.4v5.2M18 9.4v5.2"/>',
  visa: '<path d="M2.6 13.4 21 5.2l-4 8.6 1.6 5.6-3.4-1.4-3.5 2.8-.8-4.6L2.6 13.4Z"/>',
  world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9Z"/>',
  check: '<path d="m4.5 12.6 5 5L19.5 6.8"/>',
  phone: '<rect x="6" y="2.4" width="12" height="19.2" rx="3"/><path d="M10.6 18.6h2.8"/>',
  shield: '<path d="M12 2.8 4 6v6c0 4.6 3.2 7.7 8 9.2 4.8-1.5 8-4.6 8-9.2V6l-8-3.2Z"/>',
};

/**
 * يبني وسم <svg> لأيقونة.
 * @param {string} name اسم الأيقونة من P
 * @param {number} size الحجم بالبكسل
 * @param {string} cls أصناف CSS إضافية
 */
function icon(name, size = 22, cls = '') {
  const d = P[name] || P.check;
  return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

module.exports = { icon, ICON_NAMES: Object.keys(P) };

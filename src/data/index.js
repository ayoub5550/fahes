const { HOUSING, SNMG } = require('./housing');
const { WORK } = require('./work');
const { SOCIAL } = require('./social');

const CATEGORIES = [
  { id: 'housing', name: 'السكن', icon: '🏠', desc: 'عدل 3، الاجتماعي، الترقوي المدعم، الريفي، القرض البنكي', items: HOUSING },
  { id: 'work', name: 'العمل والمقاولاتية', icon: '💼', desc: 'منحة البطالة، ANADE، CNAC، ANGEM، التقاعد', items: WORK },
  { id: 'social', name: 'المنح الاجتماعية والدراسية', icon: '🤝', desc: 'المنحة الجزافية، الإعاقة، المنحة المدرسية، المنحة الجامعية', items: SOCIAL },
];

const SERVICES = CATEGORIES.flatMap((c) => c.items.map((s) => ({ ...s, cat: c.id, catName: c.name })));
const BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

// خدمة خارجية: فاحص ملف التأشيرة (مشروع «ملفّي»)
const EXTERNAL = [
  { name: 'فاحص ملف التأشيرة (شنغن وكل دول العالم)', icon: '✈️', url: 'http://185.114.48.164:8110/',
    desc: 'المبالغ المرجعية الرسمية، قاعدة 90/180، وشروط الدخول لـ 193 دولة بجواز سفر جزائري.' },
];

module.exports = { CATEGORIES, SERVICES, BY_ID, EXTERNAL, SNMG };

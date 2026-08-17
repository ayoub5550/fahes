// الدول خارج فضاء شنغن — الشروط الأساسية لحاملي جواز السفر الجزائري.
// كل بطاقة تحمل رابط المصدر الرسمي. الرسوم تتغيّر: الرابط الرسمي هو المرجع النهائي.

const OTHERS = [
  {
    code: 'GB', ar: 'المملكة المتحدة', status: 'visa', fee: '£135 (6 أشهر)',
    site: 'https://www.gov.uk/standard-visitor',
    reqs: [
      'جواز سفر صالح طوال مدة الإقامة',
      'إثبات القدرة على تغطية نفقات الإقامة والعودة (لا يوجد مبلغ رسمي محدَّد)',
      'إثبات الروابط بالجزائر (عمل، عائلة، ملكية)',
      'البصمات في مركز VFS',
      'الطلب يُقدَّم إلكترونياً، وأبكر موعد للتقديم هو 3 أشهر قبل السفر',
    ],
    note: 'لا يوجد شرط تأمين إلزامي، لكن الرسوم غير قابلة للاسترجاع (£135 / £506 لسنتين / £903 لخمس سنوات).',
  },
  {
    code: 'IE', ar: 'أيرلندا', status: 'visa', fee: '€60 (دخول واحد)',
    site: 'https://www.irishimmigration.ie/',
    reqs: ['طلب إلكتروني AVATS', 'إثبات مالي وروابط بالجزائر', 'تأشيرة شنغن لا تصلح لأيرلندا'],
  },
  {
    code: 'US', ar: 'الولايات المتحدة', status: 'visa', fee: '$185 (B1/B2)',
    site: 'https://ma.usembassy.gov/visas/',
    reqs: [
      'استمارة DS-160 إلكترونية + صفحة التأكيد بالباركود',
      'مقابلة شخصية في السفارة بالجزائر العاصمة',
      'إثبات الروابط القوية بالجزائر (المادة 214(b) هي أول سبب للرفض)',
      'صورة بمقاس 5×5 سم بخلفية بيضاء',
    ],
    note: 'الرسوم غير قابلة للاسترجاع حتى عند الرفض، والقرار يصدر في المقابلة نفسها.',
  },
  {
    code: 'CA', ar: 'كندا', status: 'visa', fee: '100 $CAD + 85 $CAD بصمات',
    site: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
    reqs: [
      'طلب إلكتروني عبر حساب IRCC',
      'البصمات في مركز VFS بالجزائر',
      'إثبات مالي + رسالة دعوة إن وُجدت + فحص طبي في بعض الحالات',
      'إثبات نيّة المغادرة عند انتهاء الزيارة',
    ],
  },
  {
    code: 'AU', ar: 'أستراليا', status: 'visa', fee: 'حوالي 200 $AUD (Visitor 600)',
    site: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
    reqs: ['طلب إلكتروني ImmiAccount', 'إثبات مالي وروابط', 'قد يُطلب فحص طبي'],
  },
  {
    code: 'TR', ar: 'تركيا', status: 'visa', fee: 'حسب نوع التأشيرة',
    site: 'https://www.konsolosluk.gov.tr/',
    reqs: [
      'موعد إلكتروني لدى القنصلية التركية',
      'حجز طيران وفندق + كشف بنكي',
      'التأشيرة الإلكترونية متاحة لمن يحمل تأشيرة أو إقامة سارية من شنغن/بريطانيا/أمريكا/أيرلندا',
    ],
    note: 'شروط الـ e-Visa تتغيّر كثيراً — تحقّق قبل الدفع.',
  },
  {
    code: 'AE', ar: 'الإمارات', status: 'visa', fee: 'حسب المدة (14/30/60 يوماً)',
    site: 'https://www.icp.gov.ae/',
    reqs: [
      'جواز صالح 6 أشهر على الأقل',
      'التأشيرة تُطلب عبر شركة الطيران أو الفندق أو كفيل داخل الإمارات',
      'صورة شخصية + تأمين صحي دولي',
    ],
    note: 'المعالجة عادة بين 48 ساعة و7 أيام عمل.',
  },
  {
    code: 'SA', ar: 'السعودية', status: 'visa', fee: 'حسب نوع التأشيرة',
    site: 'https://visa.mofa.gov.sa/',
    reqs: ['تأشيرة قنصلية (سياحة/عمرة/حج/زيارة)', 'جواز صالح 6 أشهر', 'تأمين صحي مدرج ضمن الرسوم عادة'],
  },
  { code: 'QA', ar: 'قطر', status: 'visa', fee: 'رسوم Hayya', site: 'https://hayya.qa/',
    reqs: ['التسجيل في منصة Hayya', 'حجز إقامة مؤكَّد', 'جواز صالح 6 أشهر'] },
  { code: 'OM', ar: 'عُمان', status: 'evisa', fee: 'حسب المدة', site: 'https://evisa.rop.gov.om/',
    reqs: ['تأشيرة إلكترونية', 'جواز صالح 6 أشهر', 'قد يُطلب كفيل محلي'] },
  { code: 'KW', ar: 'الكويت', status: 'visa', site: 'https://www.moi.gov.kw/', reqs: ['تأشيرة قنصلية أو كفيل'] },
  { code: 'BH', ar: 'البحرين', status: 'evisa', site: 'https://www.evisa.gov.bh/', reqs: ['تأشيرة إلكترونية'] },
  { code: 'EG', ar: 'مصر', status: 'visa', site: 'https://visa2egypt.gov.eg/', reqs: ['تأشيرة مسبقة أو إلكترونية', 'جواز صالح 6 أشهر'] },
  { code: 'JO', ar: 'الأردن', status: 'visa', site: 'https://www.moi.gov.jo/', reqs: ['تأشيرة مسبقة'] },
  { code: 'MA', ar: 'المغرب', status: 'free', site: 'https://www.consulat.ma/', reqs: ['دخول بدون تأشيرة (تحقّق من وضع الحدود البرية قبل السفر)'] },
  { code: 'TN', ar: 'تونس', status: 'free', site: 'https://www.diplomatie.gov.tn/', reqs: ['دخول بدون تأشيرة إلى 90 يوماً'] },
  { code: 'MR', ar: 'موريتانيا', status: 'free', site: 'https://www.mauritania.mr/', reqs: ['دخول بدون تأشيرة'] },
  { code: 'TZ', ar: 'تنزانيا', status: 'evisa', site: 'https://visa.immigration.go.tz/', reqs: ['تأشيرة إلكترونية'] },
  { code: 'KE', ar: 'كينيا', status: 'eta', site: 'https://www.etakenya.go.ke/', reqs: ['تصريح سفر إلكتروني eTA'] },
  { code: 'ZA', ar: 'جنوب أفريقيا', status: 'visa', site: 'https://www.dha.gov.za/', reqs: ['تأشيرة مسبقة', 'إثبات مالي وحجز عودة'] },
  { code: 'MY', ar: 'ماليزيا', status: 'free', site: 'https://www.imi.gov.my/', reqs: ['دخول بدون تأشيرة إلى 90 يوماً', 'تسجيل بطاقة الوصول الرقمية MDAC قبل السفر'] },
  { code: 'ID', ar: 'إندونيسيا', status: 'voa', site: 'https://molina.imigrasi.go.id/', reqs: ['تأشيرة عند الوصول أو إلكترونية'] },
  { code: 'TH', ar: 'تايلاند', status: 'visa', site: 'https://www.thaievisa.go.th/', reqs: ['تأشيرة إلكترونية مسبقة', 'إثبات مالي وحجز عودة'] },
  { code: 'CN', ar: 'الصين', status: 'visa', site: 'https://bio.visaforchina.cn/', reqs: ['تأشيرة قنصلية + بصمات', 'دعوة أو حجز فندقي وبرنامج رحلة'] },
  { code: 'JP', ar: 'اليابان', status: 'visa', site: 'https://www.mofa.go.jp/j_info/visit/visa/', reqs: ['تأشيرة قنصلية', 'برنامج رحلة مفصّل يوماً بيوم', 'إثبات مالي'] },
  { code: 'KR', ar: 'كوريا الجنوبية', status: 'visa', site: 'https://www.visa.go.kr/', reqs: ['تأشيرة قنصلية', 'إثبات مالي وروابط'] },
  { code: 'IN', ar: 'الهند', status: 'evisa', site: 'https://indianvisaonline.gov.in/', reqs: ['تأشيرة إلكترونية'] },
  { code: 'RU', ar: 'روسيا', status: 'evisa', site: 'https://evisa.kdmid.ru/', reqs: ['تأشيرة إلكترونية موحّدة', 'تأمين طبي'] },
  { code: 'RS', ar: 'صربيا', status: 'free', site: 'https://www.mfa.gov.rs/', reqs: ['دخول بدون تأشيرة إلى 90 يوماً'] },
  { code: 'GE', ar: 'جورجيا', status: 'visa', site: 'https://www.evisa.gov.ge/', reqs: ['تأشيرة إلكترونية'] },
  { code: 'AZ', ar: 'أذربيجان', status: 'evisa', site: 'https://evisa.gov.az/', reqs: ['تأشيرة إلكترونية ASAN'] },
  { code: 'BR', ar: 'البرازيل', status: 'visa', site: 'https://www.gov.br/mre/', reqs: ['تأشيرة قنصلية', 'إثبات مالي وحجز عودة'] },
  { code: 'AR', ar: 'الأرجنتين', status: 'visa', site: 'https://www.argentina.gob.ar/interior/migraciones', reqs: ['تأشيرة قنصلية'] },
  { code: 'MX', ar: 'المكسيك', status: 'visa', site: 'https://www.gob.mx/sre', reqs: ['تأشيرة قنصلية (أو معفى لحاملي تأشيرة أمريكية سارية)'] },
  { code: 'SG', ar: 'سنغافورة', status: 'visa', site: 'https://www.ica.gov.sg/', reqs: ['تأشيرة مسبقة', 'بطاقة الوصول الإلكترونية SG Arrival Card'] },
];

const STATUS_LABEL = {
  visa: { ar: 'تأشيرة مسبقة', color: '#c0392b' },
  evisa: { ar: 'تأشيرة إلكترونية', color: '#d68910' },
  eta: { ar: 'تصريح سفر إلكتروني', color: '#d68910' },
  voa: { ar: 'تأشيرة عند الوصول', color: '#2e86c1' },
  free: { ar: 'بدون تأشيرة', color: '#1e8449' },
};

module.exports = { OTHERS, STATUS_LABEL };

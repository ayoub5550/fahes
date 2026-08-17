// المبالغ المرجعية الرسمية لعبور الحدود الخارجية — المفوضية الأوروبية، تحديث 08/06/2026
// المصدر: https://home-affairs.ec.europa.eu (Reference amounts table) + OJ C/2026/2444
// كل مبلغ هنا منقول حرفياً من الجدول الرسمي. لا تخمين.

const SOURCE = {
  amounts: {
    label: 'الجدول الرسمي للمبالغ المرجعية — المفوضية الأوروبية',
    url: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/border-crossing_en',
    updated: '2026-06-08',
  },
  visaCode: {
    label: 'قانون التأشيرات الأوروبي (EC) 810/2009',
    url: 'https://eur-lex.europa.eu/legal-content/AR/TXT/?uri=CELEX%3A32009R0810',
  },
};

// قواعد موحّدة على كل دول شنغن
const SCHENGEN_COMMON = {
  fee_eur: 90,             // رسوم التأشيرة القصيرة للبالغين
  fee_child_eur: 45,       // من 6 إلى 12 سنة
  fee_note: 'غير قابلة للاسترجاع حتى عند الرفض',
  insurance_min_eur: 30000,
  insurance_note: 'تأمين سفر طبي يغطي الإعادة الصحية والوفاة، صالح في كل دول شنغن وطوال مدة الإقامة',
  passport_valid_months_after_return: 3,
  passport_max_age_years: 10,
  passport_blank_pages: 2,
  max_days_per_180: 90,
  apply_max_days_before: 180,
  apply_min_days_before: 15,
};

// funds.type:
//   perDay          → المبلغ = perDay × الأيام (مع min إن وجد)
//   perDayHosted    → مبلغان حسب وجود إثبات إقامة (hosted / unhosted)
//   tieredDays      → مبلغ ثابت إذا كانت الأيام ≤ threshold، وإلا perDay × الأيام
//   entryPlusDay    → رسم دخول ثابت + مبلغ يومي
//   caseByCase      → تُقدّر حالة بحالة (لا مبلغ رسمي منشور)
const COUNTRIES = [
  { code: 'FR', ar: 'فرنسا', en: 'France', schengen: true, consulates: ['الجزائر العاصمة', 'وهران', 'عنابة'], operator: 'Capago',
    funds: { type: 'perDayHosted', hosted: 32.5, unhosted: 120, partial: 65, cur: 'EUR',
      note: '32.50€ يومياً لمن يملك إثبات إقامة، 120€ لمن لا يملك، و65€ لليوم المغطّى بحجز فندقي جزئي' },
    site: 'https://fr-dz.capago.eu/' },
  { code: 'ES', ar: 'إسبانيا', en: 'Spain', schengen: true, consulates: ['الجزائر العاصمة', 'وهران'], operator: 'BLS International',
    funds: { type: 'perDay', perDay: 122.10, min: 1098.90, cur: 'EUR',
      note: '10% من الأجر الوطني الأدنى يومياً، وبحد أدنى 1098.90€ مهما قصرت المدة' },
    site: 'https://algeria.blsspainvisa.com/' },
  { code: 'IT', ar: 'إيطاليا', en: 'Italy', schengen: true, consulates: ['الجزائر العاصمة'], operator: 'VFS Global',
    funds: { type: 'tieredDays', threshold: 5, fixed: 269.60, perDay: 53.92, cur: 'EUR',
      note: '269.60€ مبلغ إجمالي ثابت للإقامات من 1 إلى 5 أيام (المنشور رسمياً). لما فوق 5 أيام يُحسب هنا 53.92€ لليوم، وهو اشتقاق من المبلغ الرسمي لا رقم منشور' } },
  { code: 'DE', ar: 'ألمانيا', en: 'Germany', schengen: true, consulates: ['الجزائر العاصمة'], operator: 'VFS Global',
    funds: { type: 'perDay', perDay: 45, cur: 'EUR' } },
  { code: 'BE', ar: 'بلجيكا', en: 'Belgium', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'perDayHosted', hosted: 45, unhosted: 95, cur: 'EUR',
      note: '45€ عند الإقامة لدى شخص، 95€ عند الإقامة في فندق' } },
  { code: 'NL', ar: 'هولندا', en: 'Netherlands', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'perDay', perDay: 55, cur: 'EUR' } },
  { code: 'PT', ar: 'البرتغال', en: 'Portugal', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'entryPlusDay', entry: 75, perDay: 40, cur: 'EUR',
      note: '75€ عن كل دخول + 40€ عن كل يوم' } },
  { code: 'GR', ar: 'اليونان', en: 'Greece', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'perDay', perDay: 50, min: 300, minAppliesUpToDays: 5, cur: 'EUR',
      note: '50€ يومياً (25€ للقاصر)، وبحد أدنى 300€ للإقامات إلى 5 أيام' } },
  { code: 'AT', ar: 'النمسا', en: 'Austria', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'caseByCase', cur: 'EUR', note: 'تُقدّر حالة بحالة — احتفظ برصيد يغطي إقامتك بوضوح' } },
  { code: 'CH', ar: 'سويسرا', en: 'Switzerland', schengen: true, consulates: ['الجزائر العاصمة'],
    funds: { type: 'perDay', perDay: 100, cur: 'CHF', note: '100 فرنك يومياً (30 فرنك للطلبة بحوزتهم بطاقة طالب سارية)' } },
  { code: 'SE', ar: 'السويد', en: 'Sweden', schengen: true,
    funds: { type: 'perDay', perDay: 700, cur: 'SEK' } },
  { code: 'NO', ar: 'النرويج', en: 'Norway', schengen: true,
    funds: { type: 'perDayHosted', hosted: 300, unhosted: 1300, cur: 'NOK',
      note: '300 كرونة يومياً مع إقامة مدفوعة مسبقاً، 1300 كرونة بدونها' } },
  { code: 'DK', ar: 'الدنمارك', en: 'Denmark', schengen: true,
    funds: { type: 'perDay', perDay: 350, cur: 'DKK' } },
  { code: 'FI', ar: 'فنلندا', en: 'Finland', schengen: true,
    funds: { type: 'perDay', perDay: 50, cur: 'EUR' } },
  { code: 'IS', ar: 'آيسلندا', en: 'Iceland', schengen: true,
    funds: { type: 'perDay', perDay: 8000, min: 40000, cur: 'ISK', note: '8000 كرونة يومياً و40000 عن كل دخول' } },
  { code: 'PL', ar: 'بولندا', en: 'Poland', schengen: true,
    funds: { type: 'tieredDays', threshold: 4, fixed: 300, perDay: 75, cur: 'PLN',
      note: '300 زلوتي للإقامة إلى 4 أيام، و75 زلوتي يومياً لما فوقها' } },
  { code: 'CZ', ar: 'التشيك', en: 'Czech Republic', schengen: true,
    funds: { type: 'perDay', perDay: 1565, cur: 'CZK', note: 'للإقامات إلى 30 يوماً؛ ما فوقها 46,950 كرونة + 6,260 عن كل شهر' } },
  { code: 'HU', ar: 'المجر', en: 'Hungary', schengen: true,
    funds: { type: 'perDay', perDay: 40, cur: 'EUR' } },
  { code: 'SK', ar: 'سلوفاكيا', en: 'Slovakia', schengen: true,
    funds: { type: 'perDay', perDay: 56, cur: 'EUR' } },
  { code: 'SI', ar: 'سلوفينيا', en: 'Slovenia', schengen: true,
    funds: { type: 'perDay', perDay: 70, cur: 'EUR', note: '35€ للقاصرين المرافقين لوالديهم' } },
  { code: 'HR', ar: 'كرواتيا', en: 'Croatia', schengen: true,
    funds: { type: 'perDay', perDay: 70, hostedPerDay: 30, cur: 'EUR',
      note: '30€ يومياً لمن يملك رسالة ضمان موثّقة أو حجزاً سياحياً' } },
  { code: 'RO', ar: 'رومانيا', en: 'Romania', schengen: true,
    funds: { type: 'perDay', perDay: 50, min: 500, cur: 'EUR', note: '30€ يومياً في حالة إجراء الدعوة' } },
  { code: 'BG', ar: 'بلغاريا', en: 'Bulgaria', schengen: true,
    funds: { type: 'perDay', perDay: 50, min: 500, cur: 'EUR' } },
  { code: 'EE', ar: 'إستونيا', en: 'Estonia', schengen: true,
    funds: { type: 'perDay', perDay: 70, cur: 'EUR' } },
  { code: 'LV', ar: 'لاتفيا', en: 'Latvia', schengen: true,
    funds: { type: 'perDay', perDay: 14, cur: 'EUR', note: 'لا يقل عن الأجر الشهري الأدنى (700€) إذا تجاوزت الإقامة 30 يوماً' } },
  { code: 'LT', ar: 'ليتوانيا', en: 'Lithuania', schengen: true,
    funds: { type: 'perDay', perDay: 50, cur: 'EUR' } },
  { code: 'LU', ar: 'لوكسمبورغ', en: 'Luxembourg', schengen: true,
    funds: { type: 'perDay', perDay: 67, cur: 'EUR' } },
  { code: 'MT', ar: 'مالطا', en: 'Malta', schengen: true,
    funds: { type: 'perDay', perDay: 48, cur: 'EUR' } },
  { code: 'LI', ar: 'ليختنشتاين', en: 'Liechtenstein', schengen: true,
    funds: { type: 'perDay', perDay: 100, cur: 'CHF', note: 'نحو 100 فرنك يومياً (30 للطلبة)' } },
];

// أسباب الرفض الرسمية — النموذج الموحّد (الملحق السادس من قانون التأشيرات)
const REFUSAL_REASONS = [
  { n: 1, ar: 'تقديم وثيقة سفر مزوّرة أو مزيّفة' },
  { n: 2, ar: 'عدم تبرير الغرض من الإقامة وشروطها' },
  { n: 3, ar: 'عدم إثبات وسائل عيش كافية للإقامة أو للعودة' },
  { n: 4, ar: 'استنفاد 90 يوماً خلال الفترة الجارية' },
  { n: 5, ar: 'وجود إنذار في نظام شنغن للمعلومات (SIS)' },
  { n: 6, ar: 'اعتبارك تهديداً للنظام العام أو الأمن أو الصحة العمومية' },
  { n: 7, ar: 'عدم تقديم تأمين سفر طبي صالح وكافٍ' },
  { n: 8, ar: 'المعلومات المقدَّمة حول الغرض من الإقامة غير موثوقة' },
  { n: 9, ar: 'عدم التأكد من نيّتك مغادرة التراب قبل انتهاء التأشيرة' },
  { n: 10, ar: 'عدم إثبات تعذّر تقديم الطلب مسبقاً (طلب على الحدود)' },
  { n: 11, ar: 'إلغاء التأشيرة بطلب من صاحبها' },
  { n: 0, ar: 'سبب آخر / غير مذكور' },
];

module.exports = { SOURCE, SCHENGEN_COMMON, COUNTRIES, REFUSAL_REASONS };

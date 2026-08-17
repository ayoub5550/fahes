// محرك القواعد — حساب وشروط فقط. لا ذكاء اصطناعي، لا تخمين.
const { SCHENGEN_COMMON, COUNTRIES } = require('./data/schengen');

const DAY = 86400000;
const toDate = (s) => (s ? new Date(s + 'T00:00:00Z') : null);
const daysBetween = (a, b) => Math.round((b - a) / DAY);
const fmt = (n, cur) => `${Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${cur}`;

function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

// ── حساب المبلغ المرجعي المطلوب ─────────────────────────────────────────────
function requiredFunds(country, days, hasAccommodation) {
  const f = country.funds;
  const cur = f.cur || 'EUR';
  let amount = null;
  let how = '';

  switch (f.type) {
    case 'perDay': {
      const per = hasAccommodation && f.hostedPerDay ? f.hostedPerDay : f.perDay;
      amount = per * days;
      how = `${fmt(per, cur)} × ${days} يوم`;
      if (f.minAppliesUpToDays && days <= f.minAppliesUpToDays && f.min) {
        amount = Math.max(amount, f.min);
        how += ` (بحد أدنى ${fmt(f.min, cur)} للإقامات إلى ${f.minAppliesUpToDays} أيام)`;
      } else if (f.min && !f.minAppliesUpToDays) {
        amount = Math.max(amount, f.min);
        how += ` (بحد أدنى ${fmt(f.min, cur)})`;
      }
      break;
    }
    case 'perDayHosted': {
      const per = hasAccommodation ? f.hosted : f.unhosted;
      amount = per * days;
      how = `${fmt(per, cur)} × ${days} يوم — ${hasAccommodation ? 'مع إثبات إقامة' : 'بدون إثبات إقامة'}`;
      break;
    }
    case 'tieredDays': {
      if (days <= f.threshold) {
        amount = f.fixed;
        how = `مبلغ إجمالي ثابت للإقامات إلى ${f.threshold} أيام`;
      } else {
        amount = f.perDay * days;
        how = `${fmt(f.perDay, cur)} × ${days} يوم`;
      }
      break;
    }
    case 'entryPlusDay': {
      amount = f.entry + f.perDay * days;
      how = `${fmt(f.entry, cur)} عند الدخول + ${fmt(f.perDay, cur)} × ${days} يوم`;
      break;
    }
    case 'caseByCase':
    default:
      amount = null;
      how = 'لا يوجد مبلغ رسمي منشور — تُقدَّر الحالة فرديّاً';
  }
  return { amount, cur, how, note: f.note || null };
}

// ── الفحص الكامل ────────────────────────────────────────────────────────────
// input: {country, departure, return_, passportIssue, passportExpiry, hasAccommodation,
//         insuranceCover, balance, balanceCur, daysUsed180, travellers, purpose, hasReturnTicket,
//         bigDepositDate}
function check(input) {
  const c = getCountry(input.country);
  const out = { country: c, items: [], score: { ok: 0, warn: 0, fail: 0 } };
  const add = (level, title, detail, fix) => {
    out.items.push({ level, title, detail, fix });
    out.score[level]++;
  };

  const dep = toDate(input.departure);
  const ret = toDate(input.return_);
  const pExp = toDate(input.passportExpiry);
  const pIss = toDate(input.passportIssue);
  const today = new Date();

  // 1) مدة الإقامة
  let days = null;
  if (dep && ret) {
    days = daysBetween(dep, ret) + 1;
    if (days <= 0) {
      add('fail', 'تواريخ السفر غير منطقية', 'تاريخ العودة قبل تاريخ الذهاب.', 'صحّح التواريخ.');
      days = null;
    } else {
      add('ok', `مدة الإقامة: ${days} يوماً`, 'محسوبة من تاريخ الذهاب إلى تاريخ العودة.');
    }
  }

  // 2) قاعدة 90/180
  if (days) {
    const used = Number(input.daysUsed180 || 0);
    const total = used + days;
    if (total > SCHENGEN_COMMON.max_days_per_180) {
      add('fail', 'تجاوز قاعدة 90 يوماً في 180',
        `${used} يوماً مستهلكة + ${days} يوماً مطلوبة = ${total} يوماً (الحد 90).`,
        'قصّر مدة الرحلة أو أجّلها حتى تتحرّر أيام.');
    } else if (total > 80) {
      add('warn', 'قريب جداً من حد 90 يوماً', `المجموع ${total} يوماً من أصل 90.`, 'أي تأخير في العودة يضعك في مخالفة.');
    } else {
      add('ok', 'قاعدة 90/180 محترمة', `المجموع ${total} يوماً من أصل 90.`);
    }
  }

  // 3) صلاحية الجواز بعد العودة
  if (pExp && ret) {
    const marginDays = daysBetween(ret, pExp);
    const needed = SCHENGEN_COMMON.passport_valid_months_after_return * 30;
    if (marginDays < 0) {
      add('fail', 'الجواز ينتهي قبل عودتك', 'جوازك تنتهي صلاحيته قبل تاريخ العودة.', 'جدّد الجواز قبل الإيداع.');
    } else if (marginDays < needed) {
      add('fail', 'الجواز لا يغطي 3 أشهر بعد العودة',
        `يبقى ${marginDays} يوماً فقط بعد العودة، والمطلوب ${needed} يوماً على الأقل.`,
        'جدّد الجواز قبل إيداع الملف — هذا رفض شبه مؤكد.');
    } else {
      add('ok', 'صلاحية الجواز كافية', `${marginDays} يوماً متبقية بعد العودة (المطلوب ${needed}).`);
    }
  }

  // 4) عمر الجواز
  if (pIss) {
    const ageYears = daysBetween(pIss, today) / 365.25;
    if (ageYears > SCHENGEN_COMMON.passport_max_age_years) {
      add('fail', 'الجواز أقدم من 10 سنوات', `صادر منذ ${ageYears.toFixed(1)} سنة.`, 'يجب أن يكون الجواز صادراً خلال آخر 10 سنوات.');
    } else {
      add('ok', 'عمر الجواز مقبول', `صادر منذ ${ageYears.toFixed(1)} سنة (الحد 10 سنوات).`);
    }
  }

  // 5) التأمين
  const cover = Number(input.insuranceCover || 0);
  if (cover === 0) {
    add('fail', 'لا يوجد تأمين سفر', `المطلوب تغطية ${SCHENGEN_COMMON.insurance_min_eur.toLocaleString('fr-FR')}€ على الأقل.`,
      'اشترِ تأميناً يغطي كامل فترة الإقامة وكل دول شنغن.');
  } else if (cover < SCHENGEN_COMMON.insurance_min_eur) {
    add('fail', 'تغطية التأمين أقل من الحد الأدنى', `تغطيتك ${cover.toLocaleString('fr-FR')}€ والمطلوب ${SCHENGEN_COMMON.insurance_min_eur.toLocaleString('fr-FR')}€.`,
      'ارفع التغطية إلى 30,000€ فأكثر.');
  } else if (cover === SCHENGEN_COMMON.insurance_min_eur) {
    add('warn', 'التأمين على الحد الأدنى بالضبط', 'مقبول قانونياً لكنه لا يترك أي هامش.', 'يُنصح بتغطية أعلى قليلاً.');
  } else {
    add('ok', 'التأمين كافٍ', `${cover.toLocaleString('fr-FR')}€ (المطلوب 30,000€).`);
  }

  // 6) الرصيد البنكي مقابل المبلغ المرجعي الرسمي
  if (c && days) {
    const rf = requiredFunds(c, days, !!input.hasAccommodation);
    const travellers = Math.max(1, Number(input.travellers || 1));
    if (rf.amount != null) {
      const needTotal = rf.amount * travellers;
      const bal = Number(input.balance || 0);
      const sameCur = (input.balanceCur || 'EUR') === rf.cur;
      const detail = `المبلغ المرجعي الرسمي: ${rf.how}${travellers > 1 ? ` × ${travellers} مسافرين` : ''} = ${fmt(needTotal, rf.cur)}`;
      if (!sameCur) {
        add('warn', 'رصيدك بعملة مختلفة عن المبلغ المرجعي', `${detail}. رصيدك بـ ${input.balanceCur}.`,
          'حوّل رصيدك إلى نفس العملة للمقارنة، أو ارفق كشفاً بالعملة الصعبة.');
      } else if (bal <= 0) {
        add('warn', 'لم تُدخل الرصيد', detail, 'أدخل الرصيد لمقارنته آلياً.');
      } else if (bal < needTotal) {
        add('fail', 'الرصيد أقل من المبلغ المرجعي',
          `${detail} — رصيدك ${fmt(bal, rf.cur)} (نقص ${fmt(needTotal - bal, rf.cur)}).`,
          'هذا هو سبب الرفض رقم 3 في النموذج الرسمي. ارفع الرصيد أو قصّر المدة.');
      } else if (bal < needTotal * 1.2) {
        add('warn', 'الرصيد يكفي بالكاد', `${detail} — رصيدك ${fmt(bal, rf.cur)}.`,
          'يُنصح بهامش 20% فوق الحد الأدنى.');
      } else {
        add('ok', 'الرصيد يغطي المبلغ المرجعي', `${detail} — رصيدك ${fmt(bal, rf.cur)}.`);
      }
    } else {
      add('warn', 'لا يوجد مبلغ مرجعي منشور لهذه الدولة', rf.how, 'احتفظ برصيد يغطي إقامتك بوضوح مع إثبات مصدره.');
    }
    if (rf.note) add('ok', 'ملاحظة رسمية على المبلغ المرجعي', rf.note);
  }

  // 7) الإيداع المفاجئ في الحساب
  if (input.bigDepositDate && dep) {
    const d = toDate(input.bigDepositDate);
    const gap = daysBetween(d, today);
    if (gap < 30) {
      add('fail', 'إيداع كبير حديث في الحساب',
        `الإيداع منذ ${gap} يوماً فقط — القنصلية تعتبره رصيداً غير حقيقي (سبب الرفض 8: معلومات غير موثوقة).`,
        'انتظر حتى يمرّ 3 أشهر على الأقل على الإيداع، أو أرفق وثيقة تُثبت مصدره (بيع، إرث، منحة).');
    } else if (gap < 90) {
      add('warn', 'إيداع كبير خلال آخر 3 أشهر', `منذ ${gap} يوماً.`, 'أرفق ما يُثبت مصدر المبلغ.');
    } else {
      add('ok', 'حركة الحساب مستقرة', `آخر إيداع كبير منذ ${gap} يوماً.`);
    }
  }

  // 8) تذكرة العودة
  if (input.hasReturnTicket === false) {
    add('fail', 'لا يوجد حجز عودة', 'إثبات العودة شرط صريح في المبالغ المرجعية الرسمية.', 'أرفق حجز طيران ذهاب وإياب بتاريخ ثابت.');
  } else if (input.hasReturnTicket === true) {
    add('ok', 'حجز العودة موجود', 'مطابق للشرط الرسمي.');
  }

  // 9) إثبات الإقامة
  if (input.hasAccommodation === false) {
    add('warn', 'لا يوجد إثبات إقامة', 'غياب حجز الفندق أو شهادة الاستضافة يرفع المبلغ المطلوب ويضعف الملف.',
      'أرفق حجز فندق قابلاً للإلغاء أو شهادة استضافة موثّقة.');
  } else if (input.hasAccommodation === true) {
    add('ok', 'إثبات الإقامة موجود', 'يخفّض المبلغ المرجعي في عدة دول.');
  }

  // 10) موعد الإيداع
  if (dep) {
    const lead = daysBetween(today, dep);
    if (lead < 0) add('fail', 'تاريخ السفر في الماضي', '', 'صحّح التاريخ.');
    else if (lead < SCHENGEN_COMMON.apply_min_days_before)
      add('warn', 'الوقت ضيّق جداً', `${lead} يوماً على السفر — المهلة الموصى بها 15 يوماً على الأقل قبل السفر.`, 'قدّم الطلب فوراً أو أجّل السفر.');
    else if (lead > SCHENGEN_COMMON.apply_max_days_before)
      add('fail', 'التقديم مبكّر أكثر من اللازم', `${lead} يوماً — لا يُقبل الطلب قبل 6 أشهر من السفر.`, 'انتظر حتى تدخل نافذة 6 أشهر.');
    else add('ok', 'توقيت التقديم سليم', `${lead} يوماً قبل السفر (النافذة: من 15 يوماً إلى 6 أشهر).`);
  }

  out.verdict = out.score.fail > 0 ? 'fail' : out.score.warn > 0 ? 'warn' : 'ok';
  return out;
}

// ── قائمة الوثائق حسب الحالة ────────────────────────────────────────────────
const BASE_DOCS = [
  'استمارة الطلب ممضاة',
  'صورتان شمسيتان بمقاس 35×45 مم بخلفية فاتحة (أقل من 6 أشهر)',
  'جواز السفر + نسخة من الصفحات المؤشَّرة',
  'بطاقة التعريف الوطنية + نسخة',
  'شهادة ميلاد (S12)',
  'حجز طيران ذهاب وإياب',
  'إثبات الإقامة: حجز فندق أو شهادة استضافة',
  'تأمين سفر طبي بتغطية 30,000€ لكامل المدة',
  'كشف حساب بنكي لآخر 3 أشهر ممهور من البنك',
];

const PROFILE_DOCS = {
  employee: ['شهادة عمل حديثة', 'كشوف الأجور لآخر 3 أشهر', 'عطلة مؤشَّر عليها من رب العمل', 'شهادة انتساب CNAS'],
  civil: ['شهادة عمل من الإدارة', 'رخصة تغيّب أو عطلة مؤشَّر عليها', 'كشوف الأجور لآخر 3 أشهر'],
  business: ['مستخرج السجل التجاري', 'البطاقة الجبائية', 'شهادة الانتساب CASNOS', 'الميزانية أو كشف رقم الأعمال'],
  student: ['شهادة تمدرس للسنة الجارية', 'كشف النقاط', 'شهادة عمل ودخل الوالي/الكفيل', 'تكفّل مالي موثّق'],
  retired: ['شهادة تقاعد (CNR)', 'كشف المعاش لآخر 3 أشهر'],
  farmer: ['بطاقة الفلاح', 'شهادة نشاط من الغرفة الفلاحية'],
  unemployed: ['تكفّل مالي موثّق من قريب مع وثائق دخله', 'كل ما يُثبت الروابط بالجزائر (ملكية، عقد إيجار، عائلة)'],
};

const PURPOSE_DOCS = {
  tourism: ['برنامج رحلة مفصّل يوماً بيوم'],
  family: ['شهادة استضافة موثّقة من البلدية بالخارج', 'نسخة من وثيقة هوية/إقامة المستضيف', 'إثبات صلة القرابة'],
  business: ['دعوة من الشركة بالخارج', 'ما يُثبت العلاقة التجارية', 'تكفّل الشركة بالمصاريف'],
  study: ['قبول أو تسجيل من المؤسسة', 'إثبات دفع الرسوم', 'تكفّل مالي'],
  medical: ['موعد طبي مؤكَّد من المؤسسة الصحية', 'تقرير الطبيب المعالج بالجزائر', 'إثبات القدرة على دفع تكاليف العلاج'],
};

const PROFILE_LABEL = {
  employee: 'أجير في القطاع الخاص', civil: 'موظف عمومي', business: 'تاجر / صاحب سجل',
  student: 'طالب', retired: 'متقاعد', farmer: 'فلاح', unemployed: 'بدون دخل مصرّح',
};
const PURPOSE_LABEL = {
  tourism: 'سياحة', family: 'زيارة عائلية', business: 'عمل / أعمال', study: 'دراسة', medical: 'علاج',
};

function docsFor(profile, purpose, country) {
  const list = [...BASE_DOCS];
  (PROFILE_DOCS[profile] || []).forEach((d) => list.push(d));
  (PURPOSE_DOCS[purpose] || []).forEach((d) => list.push(d));
  if (country && country.schengen) list.push('وصل دفع رسوم التأشيرة (90€ للبالغ / 45€ للطفل 6–12 سنة)');
  return list;
}

module.exports = {
  check, requiredFunds, getCountry, docsFor,
  PROFILE_LABEL, PURPOSE_LABEL, COUNTRIES, SCHENGEN_COMMON,
};

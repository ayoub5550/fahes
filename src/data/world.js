// كل دول العالم — شروط الدخول لحامل جواز السفر الجزائري العادي.
// المصدر: تجميع ويكيبيديا 'Visa requirements for Algerian citizens' (سُحب في 2026-08-17)،
// وهو تجميع مرجعي لا وثيقة رسمية: الموقع الرسمي لكل دولة هو المرجع النهائي قبل السفر.
const WORLD_SOURCE = { label: 'تجميع مرجعي عن ويكيبيديا (شروط التأشيرة لحاملي الجواز الجزائري)', url: 'https://en.wikipedia.org/wiki/Visa_requirements_for_Algerian_citizens', fetched: '2026-08-17' };

const WORLD_STATUS = {
  free:      { ar: 'بدون تأشيرة',            color: '#0f8a4d', rank: 1 },
  voa:       { ar: 'تأشيرة عند الوصول',      color: '#1d7fd6', rank: 2 },
  evisa_voa: { ar: 'إلكترونية أو عند الوصول', color: '#1d7fd6', rank: 3 },
  evisa:     { ar: 'تأشيرة إلكترونية',        color: '#c47f0a', rank: 4 },
  eta:       { ar: 'تصريح سفر إلكتروني',      color: '#c47f0a', rank: 5 },
  visa:      { ar: 'تأشيرة مسبقة',            color: '#c0392b', rank: 6 },
};

const WORLD = [
 {
  "ar": "آيسلندا",
  "en": "Iceland",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "أذربيجان",
  "en": "Azerbaijan",
  "status": "evisa",
  "stay": "30 يوماً",
  "note": "تأشيرة سياحية عند الوصول 30 يوماً لحاملي إقامة من دول مجلس التعاون الخليجي، مع تقديم الإقامة أو التأشيرة مع الجواز."
 },
 {
  "ar": "أرمينيا",
  "en": "Armenia",
  "status": "evisa",
  "stay": "120 يوماً",
  "note": "تأشيرة عند الوصول لحاملي إقامة أو تأشيرة سارية من الاتحاد الأوروبي/شنغن، أمريكا، أستراليا، نيوزيلندا، كوريا الجنوبية، بريطانيا، كندا، روسيا، اليابان، أو إقامة من دول الخليج."
 },
 {
  "ar": "أستراليا",
  "en": "Australia",
  "status": "visa",
  "stay": "",
  "note": "الطلب إلكتروني عبر تأشيرة الزائر e600."
 },
 {
  "ar": "أفغانستان",
  "en": "Afghanistan",
  "status": "evisa",
  "stay": "",
  "note": "التأشيرة لا تُقبل إلا إذا صدرت عن بعثة دبلوماسية معتمدة، والوصول عبر مطار كابول الدولي فقط. معفى من وُلد في أفغانستان أو أحد والديه أفغاني."
 },
 {
  "ar": "ألبانيا",
  "en": "Albania",
  "status": "evisa",
  "stay": "",
  "note": "بدون تأشيرة لحاملي تأشيرة شنغن أو بريطانية أو أمريكية متعددة الدخول استُعملت مرة على الأقل، أو إقامة في شنغن/بريطانيا/أمريكا/الإمارات."
 },
 {
  "ar": "ألمانيا",
  "en": "Germany",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "أنتيغوا وباربودا",
  "en": "Antigua and Barbuda",
  "status": "evisa",
  "stay": "",
  "note": "من يملك تأشيرة أو إقامة كندية أو أمريكية أو بريطانية أو شنغن يحصل على تأشيرة عند الوصول بـ 100 دولار لمدة 30 يوماً."
 },
 {
  "ar": "أندورا",
  "en": "Andorra",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "أنغولا",
  "en": "Angola",
  "status": "free",
  "stay": "30 يوماً",
  "note": "حتى ثلاث دخلات معفاة من التأشيرة في السنة، كل واحدة 30 يوماً."
 },
 {
  "ar": "أوروغواي",
  "en": "Uruguay",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "أوزبكستان",
  "en": "Uzbekistan",
  "status": "evisa",
  "stay": "30 يوماً",
  "note": "عبور بدون تأشيرة 5 أيام في المطارات الدولية لحاملي تذكرة مؤكدة إلى بلد ثالث."
 },
 {
  "ar": "أوغندا",
  "en": "Uganda",
  "status": "evisa",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "أوكرانيا",
  "en": "Ukraine",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إثيوبيا",
  "en": "Ethiopia",
  "status": "evisa_voa",
  "stay": "حتى 90 يوماً",
  "note": "التأشيرة عند الوصول وحاملو التأشيرة الإلكترونية يدخلون حصراً عبر مطار أديس أبابا بولي الدولي. التأشيرة الإلكترونية لـ 30 أو 90 يوماً."
 },
 {
  "ar": "إرتريا",
  "en": "Eritrea",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إسبانيا",
  "en": "Spain",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إستونيا",
  "en": "Estonia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إسرائيل",
  "en": "Israel",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إسواتيني",
  "en": "Eswatini",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إندونيسيا",
  "en": "Indonesia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "إيران",
  "en": "Iran",
  "status": "evisa_voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "إيطاليا",
  "en": "Italy",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الأرجنتين",
  "en": "Argentina",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الأردن",
  "en": "Jordan",
  "status": "evisa_voa",
  "stay": "30 يوماً",
  "note": "مجانية."
 },
 {
  "ar": "الإكوادور",
  "en": "Ecuador",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "الإمارات العربية المتحدة",
  "en": "United Arab Emirates",
  "status": "visa",
  "stay": "",
  "note": "الطلب عبر الخدمة الذكية (Smart service)."
 },
 {
  "ar": "البحرين",
  "en": "Bahrain",
  "status": "evisa_voa",
  "stay": "14 يوماً",
  "note": ""
 },
 {
  "ar": "البرازيل",
  "en": "Brazil",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "البرتغال",
  "en": "Portugal",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "البوسنة والهرسك",
  "en": "Bosnia and Herzegovina",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الجبل الأسود",
  "en": "Montenegro",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الدنمارك",
  "en": "Denmark",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الرأس الأخضر",
  "en": "Cape Verde",
  "status": "voa",
  "stay": "30 يوماً",
  "note": "تأشيرة عند الوصول في مطارات سال وبوا فيشتا وسان فيسنتي وسانتياغو، مع تسجيل إلكتروني قبل 5 أيام من الوصول ودفع رسم أمن المطار 3400 إسكودو."
 },
 {
  "ar": "السعودية",
  "en": "Saudi Arabia",
  "status": "visa",
  "stay": "",
  "note": "تأشيرة سياحية عند الوصول لحاملي تأشيرة متعددة الدخول من أمريكا أو بريطانيا أو شنغن، بشرط استعمالها مرة على الأقل (ختم دخول وخروج)."
 },
 {
  "ar": "السلفادور",
  "en": "El Salvador",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "السنغال",
  "en": "Senegal",
  "status": "voa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "السودان",
  "en": "Sudan",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "السويد",
  "en": "Sweden",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الصومال",
  "en": "Somalia",
  "status": "evisa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "الصين",
  "en": "China",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "العراق",
  "en": "Iraq",
  "status": "evisa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "الغابون",
  "en": "Gabon",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": "حاملو التأشيرة الإلكترونية يدخلون عبر مطار ليبرفيل الدولي فقط."
 },
 {
  "ar": "الفاتيكان",
  "en": "Vatican City",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الفلبين",
  "en": "Philippines",
  "status": "visa",
  "stay": "",
  "note": "المقيمون في الإمارات يحصلون على تأشيرة إلكترونية عبر الموقع الرسمي مع إظهار الإقامة الإماراتية."
 },
 {
  "ar": "الكاميرون",
  "en": "Cameroon",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الكويت",
  "en": "Kuwait",
  "status": "visa",
  "stay": "",
  "note": "تأشيرة إلكترونية لحاملي إقامة خليجية: السن 18 فما فوق، الإقامة سارية 3 أشهر على الأقل، وبرفقة الكفيل إن كان فرداً. لا تشمل تأشيرة الطالب والعامل غير المؤهل."
 },
 {
  "ar": "المالديف",
  "en": "Maldives",
  "status": "voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "المجر",
  "en": "Hungary",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "المغرب",
  "en": "Morocco",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "المكسيك",
  "en": "Mexico",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة حتى 180 يوماً للسياحة أو الأعمال أو العبور لحاملي تأشيرة سارية من كندا أو اليابان أو أمريكا أو بريطانيا أو شنغن، وكذلك حاملي الإقامة الدائمة فيها. ركاب السفن السياحية معفون 21 يوماً."
 },
 {
  "ar": "المملكة المتحدة",
  "en": "United Kingdom and Crown dependencies",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "النرويج",
  "en": "Norway",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "النمسا",
  "en": "Austria",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "النيجر",
  "en": "Niger",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الهند",
  "en": "India",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "الولايات المتحدة",
  "en": "United States",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "اليابان",
  "en": "Japan",
  "status": "visa",
  "stay": "",
  "note": "تأشيرة إلكترونية للمقيمين في أستراليا، البرازيل، كمبوديا، كندا، الهند، السعودية، سنغافورة، جنوب أفريقيا، تايوان، الإمارات، بريطانيا، أمريكا."
 },
 {
  "ar": "اليمن",
  "en": "Yemen",
  "status": "voa",
  "stay": "1 شهر",
  "note": ""
 },
 {
  "ar": "اليونان",
  "en": "Greece",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بابوا غينيا الجديدة",
  "en": "Papua New Guinea",
  "status": "evisa",
  "stay": "60 يوماً",
  "note": "الطلب إلكتروني تحت فئة «سائح — برنامج خاص»."
 },
 {
  "ar": "باراغواي",
  "en": "Paraguay",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "باكستان",
  "en": "Pakistan",
  "status": "evisa",
  "stay": "30 يوماً أو 3 أشهر",
  "note": "الطلب إلكتروني، والمعالجة خلال 7 إلى 10 أيام عمل."
 },
 {
  "ar": "بالاو",
  "en": "Palau",
  "status": "voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "بربادوس",
  "en": "Barbados",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "بروناي",
  "en": "Brunei",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بلجيكا",
  "en": "Belgium",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بلغاريا",
  "en": "Bulgaria",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بليز",
  "en": "Belize",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بنغلاديش",
  "en": "Bangladesh",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بنما",
  "en": "Panama",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة لحاملي تأشيرة متعددة الدخول سارية 6 أشهر على الأقل أو إقامة دائمة من أستراليا أو كندا أو الاتحاد الأوروبي أو اليابان أو سنغافورة أو كوريا الجنوبية أو أمريكا أو بريطانيا."
 },
 {
  "ar": "بنين",
  "en": "Benin",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "بوتان",
  "en": "Bhutan",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": "الرسوم 40 دولاراً للشخص، المعالجة خلال 5 أيام عمل، والإقامة 90 يوماً. تُضاف رسوم التنمية المستدامة."
 },
 {
  "ar": "بوتسوانا",
  "en": "Botswana",
  "status": "evisa",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "بوركينا فاسو",
  "en": "Burkina Faso",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بوروندي",
  "en": "Burundi",
  "status": "voa",
  "stay": "1 شهر",
  "note": ""
 },
 {
  "ar": "بولندا",
  "en": "Poland",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بوليفيا",
  "en": "Bolivia",
  "status": "evisa_voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "بيرو",
  "en": "Peru",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "بيلاروس",
  "en": "Belarus",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تايلاند",
  "en": "Thailand",
  "status": "evisa",
  "stay": "60 يوماً",
  "note": ""
 },
 {
  "ar": "تركمانستان",
  "en": "Turkmenistan",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تركيا",
  "en": "Turkey",
  "status": "visa",
  "stay": "",
  "note": "حاملو جواز السفر العادي دون 15 سنة وفوق 50 سنة معفون 90 يوماً في كل 180 للسياحة. من 15 إلى 50 سنة تلزمهم تأشيرة؛ وأعمار 15–18 و35–50 بتأشيرة أو إقامة شنغن/أمريكا/بريطانيا/أيرلندا سارية يمكنهم الحصول على تأشيرة إلكترونية لشهر ودخول واحد عبر evisa.gov.tr."
 },
 {
  "ar": "ترينيداد وتوباغو",
  "en": "Trinidad and Tobago",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تشاد",
  "en": "Chad",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تشيلي",
  "en": "Chile",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تنزانيا",
  "en": "Tanzania",
  "status": "evisa_voa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "توغو",
  "en": "Togo",
  "status": "evisa",
  "stay": "15 يوماً",
  "note": ""
 },
 {
  "ar": "توفالو",
  "en": "Tuvalu",
  "status": "voa",
  "stay": "1 شهر",
  "note": ""
 },
 {
  "ar": "تونس",
  "en": "Tunisia",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "تونغا",
  "en": "Tonga",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "تيمور الشرقية",
  "en": "Timor-Leste",
  "status": "voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "جامايكا",
  "en": "Jamaica",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جزر البهاما",
  "en": "Bahamas",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جزر القمر",
  "en": "Comoros",
  "status": "voa",
  "stay": "45 يوماً",
  "note": ""
 },
 {
  "ar": "جزر سليمان",
  "en": "Solomon Islands",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جزر مارشال",
  "en": "Marshall Islands",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جمهورية أيرلندا",
  "en": "Ireland",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جمهورية إفريقيا الوسطى",
  "en": "Central African Republic",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جمهورية التشيك",
  "en": "Czech Republic",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جمهورية الدومينيكان",
  "en": "Dominican Republic",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة لمدة تصل إلى 180 يوماً لحاملي تأشيرة شنغن متعددة الدخول سارية."
 },
 {
  "ar": "جمهورية الكونغو",
  "en": "Republic of the Congo",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جمهورية الكونغو الديمقراطية",
  "en": "Democratic Republic of the Congo",
  "status": "evisa",
  "stay": "7 أيام",
  "note": ""
 },
 {
  "ar": "جنوب إفريقيا",
  "en": "South Africa",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "جنوب السودان",
  "en": "South Sudan",
  "status": "evisa",
  "stay": "",
  "note": "تُطلب إلكترونياً، ويجب تقديم إذن التأشيرة مطبوعاً عند السفر."
 },
 {
  "ar": "جورجيا",
  "en": "Georgia",
  "status": "evisa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "جيبوتي",
  "en": "Djibouti",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "دومينيكا",
  "en": "Dominica",
  "status": "free",
  "stay": "21 يوماً",
  "note": ""
 },
 {
  "ar": "رواندا",
  "en": "Rwanda",
  "status": "free",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "روسيا",
  "en": "Russia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "رومانيا",
  "en": "Romania",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "زامبيا",
  "en": "Zambia",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "زيمبابوي",
  "en": "Zimbabwe",
  "status": "evisa_voa",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "ساحل العاج",
  "en": "Côte d'Ivoire",
  "status": "evisa",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "ساموا",
  "en": "Samoa",
  "status": "free",
  "stay": "60 يوماً",
  "note": ""
 },
 {
  "ar": "سان مارينو",
  "en": "San Marino",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سانت فنسنت وجزر غرينادين",
  "en": "Saint Vincent and the Grenadines",
  "status": "free",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "سانت كيتس ونيفيس",
  "en": "Saint Kitts and Nevis",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سانت لوسيا",
  "en": "Saint Lucia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ساو تومي وبرينسيب",
  "en": "São Tomé and Príncipe",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سريلانكا",
  "en": "Sri Lanka",
  "status": "eta",
  "stay": "60 يوماً أو 30 يوماً",
  "note": "تصريح سفر إلكتروني (ETA) صالح 30 يوماً."
 },
 {
  "ar": "سلطنة عمان",
  "en": "Oman",
  "status": "visa",
  "stay": "",
  "note": "إعفاء من التأشيرة لحاملي إقامة أو تأشيرة سارية من أمريكا أو كندا أو أستراليا أو بريطانيا أو شنغن أو اليابان، أو للمقيمين في دول الخليج ضمن المهن المؤهلة."
 },
 {
  "ar": "سلوفاكيا",
  "en": "Slovakia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سلوفينيا",
  "en": "Slovenia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سنغافورة",
  "en": "Singapore",
  "status": "visa",
  "stay": "",
  "note": "الطلب إلكتروني عبر شريك معتمد أو جهة اتصال محلية في سنغافورة."
 },
 {
  "ar": "سوريا",
  "en": "Syria",
  "status": "free",
  "stay": "",
  "note": "بموجب القانون رقم 2 لسنة 2014، كل الزوار يحتاجون تأشيرة قبل الوصول."
 },
 {
  "ar": "سورينام",
  "en": "Suriname",
  "status": "free",
  "stay": "90 يوماً",
  "note": "رسم دخول 50 دولاراً أو 50 يورو يُدفع إلكترونياً قبل الوصول. تتوفر تأشيرة إلكترونية متعددة الدخول."
 },
 {
  "ar": "سويسرا",
  "en": "Switzerland",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "سيراليون",
  "en": "Sierra Leone",
  "status": "evisa",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "سيشل",
  "en": "Seychelles",
  "status": "eta",
  "stay": "3 أشهر",
  "note": "الطلب يُقدَّم حتى 30 يوماً قبل السفر مع رفع حجوزات الإقامة. شهادة تلقيح الحمى الصفراء مطلوبة عند القدوم من دول موبوءة. الرسم 10 يورو بالبطاقة، وصالحة لرحلة واحدة."
 },
 {
  "ar": "صربيا",
  "en": "Serbia",
  "status": "visa",
  "stay": "",
  "note": "90 يوماً لحاملي تأشيرة أو إقامة من الاتحاد الأوروبي أو أمريكا."
 },
 {
  "ar": "طاجيكستان",
  "en": "Tajikistan",
  "status": "evisa_voa",
  "stay": "60 يوماً",
  "note": "حاملو التأشيرة الإلكترونية يدخلون من كل المنافذ الحدودية."
 },
 {
  "ar": "غامبيا",
  "en": "Gambia",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "غانا",
  "en": "Ghana",
  "status": "voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "غرينادا",
  "en": "Grenada",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "غواتيمالا",
  "en": "Guatemala",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة حتى 90 يوماً لحاملي إقامة سارية من أستراليا أو كندا أو دول الخليج أو أمريكا أو بريطانيا أو شنغن."
 },
 {
  "ar": "غيانا",
  "en": "Guyana",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "غينيا",
  "en": "Guinea",
  "status": "free",
  "stay": "",
  "note": ""
 },
 {
  "ar": "غينيا الاستوائية",
  "en": "Equatorial Guinea",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "غينيا بيساو",
  "en": "Guinea-Bissau",
  "status": "voa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "فانواتو",
  "en": "Vanuatu",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "فرنسا",
  "en": "France",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "فنزويلا",
  "en": "Venezuela",
  "status": "evisa",
  "stay": "",
  "note": "نظام تأشيرة إلكترونية للسياحة والأعمال."
 },
 {
  "ar": "فنلندا",
  "en": "Finland",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "فيتنام",
  "en": "Vietnam",
  "status": "evisa",
  "stay": "",
  "note": "التأشيرة الإلكترونية صالحة 90 يوماً ومتعددة الدخول."
 },
 {
  "ar": "فيجي",
  "en": "Fiji",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "قبرص",
  "en": "Cyprus",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "قرغيزستان",
  "en": "Kyrgyzstan",
  "status": "evisa",
  "stay": "60 يوماً",
  "note": ""
 },
 {
  "ar": "قطر",
  "en": "Qatar",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كازاخستان",
  "en": "Kazakhstan",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كرواتيا",
  "en": "Croatia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كمبوديا",
  "en": "Cambodia",
  "status": "evisa_voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "كندا",
  "en": "Canada",
  "status": "visa",
  "stay": "",
  "note": "حاملو الإقامة الدائمة الأمريكية (Green Card) يدخلون بدون تأشيرة."
 },
 {
  "ar": "كوبا",
  "en": "Cuba",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": "قابلة للتمديد إلى 90 يوماً مقابل رسم."
 },
 {
  "ar": "كوريا الجنوبية",
  "en": "South Korea",
  "status": "visa",
  "stay": "",
  "note": "دخول بدون تأشيرة إلى جزيرة جيجو لمدة 30 يوماً. تأشيرة متعددة الدخول لمن دخل كوريا 4 مرات في آخر سنتين أو 10 مرات إجمالاً."
 },
 {
  "ar": "كوريا الشمالية",
  "en": "North Korea",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كوستاريكا",
  "en": "Costa Rica",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة لمدة 30 يوماً لحاملي تأشيرة متعددة الدخول سارية من شنغن أو كندا أو أمريكا."
 },
 {
  "ar": "كولومبيا",
  "en": "Colombia",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كيريباتي",
  "en": "Kiribati",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "كينيا",
  "en": "Kenya",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "لاتفيا",
  "en": "Latvia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "لاوس",
  "en": "Laos",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "لبنان",
  "en": "Lebanon",
  "status": "voa",
  "stay": "30 يوماً",
  "note": "تأشيرة عند الوصول في مطار بيروت أو أي منفذ، بشرط حجز فندق 3–5 نجوم أو عنوان إقامة برقم هاتف، و2000 دولار نقداً على الأقل، وتذكرة عودة غير قابلة للاسترجاع، وخلوّ الجواز من أي أختام إسرائيلية."
 },
 {
  "ar": "لوكسمبورغ",
  "en": "Luxembourg",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ليبيا",
  "en": "Libya",
  "status": "free",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ليبيريا",
  "en": "Liberia",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ليتوانيا",
  "en": "Lithuania",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ليختنشتاين",
  "en": "Liechtenstein",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ليسوتو",
  "en": "Lesotho",
  "status": "evisa",
  "stay": "14 يوماً",
  "note": ""
 },
 {
  "ar": "مالطا",
  "en": "Malta",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "مالي",
  "en": "Mali",
  "status": "free",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "ماليزيا",
  "en": "Malaysia",
  "status": "free",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "مدغشقر",
  "en": "Madagascar",
  "status": "evisa_voa",
  "stay": "60 يوماً",
  "note": ""
 },
 {
  "ar": "مصر",
  "en": "Egypt",
  "status": "visa",
  "stay": "",
  "note": "الأطفال الجزائريون دون 14 سنة معفون من التأشيرة."
 },
 {
  "ar": "مقدونيا الشمالية",
  "en": "North Macedonia",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة حتى 15 يوماً لحاملي تأشيرة متعددة الدخول من كندا أو أمريكا أو بريطانيا أو شنغن، أو إقامة شنغن."
 },
 {
  "ar": "ملاوي",
  "en": "Malawi",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "منغوليا",
  "en": "Mongolia",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "موريتانيا",
  "en": "Mauritania",
  "status": "free",
  "stay": "",
  "note": ""
 },
 {
  "ar": "موريشيوس",
  "en": "Mauritius",
  "status": "voa",
  "stay": "15 يوماً",
  "note": ""
 },
 {
  "ar": "موزمبيق",
  "en": "Mozambique",
  "status": "evisa_voa",
  "stay": "30 يوماً",
  "note": ""
 },
 {
  "ar": "مولدوفا",
  "en": "Moldova",
  "status": "evisa",
  "stay": "",
  "note": "بدون تأشيرة لحاملي تأشيرة أو إقامة سارية من الاتحاد الأوروبي أو شنغن أو كندا أو أيرلندا أو بريطانيا أو أمريكا."
 },
 {
  "ar": "موناكو",
  "en": "Monaco",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ميانمار",
  "en": "Myanmar",
  "status": "evisa",
  "stay": "28 يوماً",
  "note": ""
 },
 {
  "ar": "ناميبيا",
  "en": "Namibia",
  "status": "evisa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ناورو",
  "en": "Nauru",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "نيبال",
  "en": "Nepal",
  "status": "evisa_voa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "نيجيريا",
  "en": "Nigeria",
  "status": "evisa",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "نيكاراغوا",
  "en": "Nicaragua",
  "status": "free",
  "stay": "90 يوماً",
  "note": ""
 },
 {
  "ar": "نيوزيلندا",
  "en": "New Zealand",
  "status": "visa",
  "stay": "",
  "note": "حاملو الإقامة الدائمة الأسترالية قد يُمنحون إقامة نيوزيلندية عند الوصول، بشرط تصريح السفر الإلكتروني قبل المغادرة."
 },
 {
  "ar": "هايتي",
  "en": "Haiti",
  "status": "free",
  "stay": "3 أشهر",
  "note": ""
 },
 {
  "ar": "هندوراس",
  "en": "Honduras",
  "status": "visa",
  "stay": "",
  "note": "بدون تأشيرة لحاملي تأشيرة سارية 6 أشهر على الأقل عند الوصول، صادرة عن كندا أو أمريكا أو دولة شنغن."
 },
 {
  "ar": "هولندا",
  "en": "Netherlands",
  "status": "visa",
  "stay": "",
  "note": ""
 },
 {
  "ar": "ولايات ميكرونيسيا المتحدة",
  "en": "Micronesia",
  "status": "free",
  "stay": "30 يوماً",
  "note": ""
 }
];

module.exports = { WORLD, WORLD_STATUS, WORLD_SOURCE };

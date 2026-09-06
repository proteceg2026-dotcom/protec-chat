import { ProductItem, CalculatedProduct, DiscountRule } from '../types';

export const DISCOUNT_RULES_METADATA: DiscountRule[] = [
  {
    id: 'tesys_basic',
    family: 'PPCTR',
    categoryName: 'بادئات الحركة والكونتاكتورات الأساسية (TeSys D / K / TVS / LRD / GV2 / GV3)',
    nameAr: 'كونتاكتورات وقواطع محركات وأوفرلود TeSys',
    nameEn: 'TeSys D / TVS / LRD / GV2 / GV3 Motor Starters',
    arabicGroup: 'المنتجات الصناعية الأساسية (Industry Commodity)',
    discountRate: 0.48,
    description: 'كونتاكتورات LC1D, LC1E, LC1K, أوفرلود LRD, LRE, قواطع محركات GV2, GV3, GZ1',
    examples: 'LC1D, LC1E, LC1K, LRD, LRE, GV2ME, GV2P, GV3P, GZ1E, CAD, CA2, CA3'
  },
  {
    id: 'eocr',
    family: 'PPCTR',
    categoryName: 'الأوفرلود الإلكتروني EOCR',
    nameAr: 'أوفرلود إلكتروني وحماية محركات EOCR',
    nameEn: 'Electronic Overload Relays (EOCR)',
    arabicGroup: 'المنتجات الصناعية الأساسية (Industry Commodity)',
    discountRate: 0.48,
    description: 'حمايات المحركات الإلكترونية من طراز EOCR (3DM2, 3MZ2, EOCR-SE2, EOCR-SS)',
    examples: '3DM2, 3MZ2, EOCR-SE2, EOCR-SS, EOCR-DGT'
  },
  {
    id: 'tesys_giga',
    family: 'PPCTR',
    categoryName: 'كونتاكتورات TeSys Giga الحديثة',
    nameAr: 'كونتاكتورات وأوفرلود TeSys Giga',
    nameEn: 'TeSys Giga Contactors & Overload',
    arabicGroup: 'المنتجات الصناعية الأساسية (Industry Commodity)',
    discountRate: 0.45,
    description: 'كونتاكتورات وأوفرلودات طراز TeSys Giga (LC1G115 إلى LC1G800)',
    examples: 'LC1G115, LC1G150, LC1G185, LC1G225, LC1G265, LC1G330, LC1G400, LC1G500, LC1G630, LC1G800'
  },
  {
    id: 'pushbuttons_relays_timers',
    family: 'IDSIG',
    categoryName: 'أزرار وإشارات وريليهات وتايمرات صناعية',
    nameAr: 'أزرار إشارة وريليهات ومؤقتات (Harmony / Zelio)',
    nameEn: 'Harmony Pushbuttons & Relays (XB4, XB5, XA2, RXM, RE17, RE22)',
    arabicGroup: 'المنتجات الصناعية الأساسية (Industry Commodity)',
    discountRate: 0.45,
    description: 'أزرار إشارة ومفاتيح XB4, XB5, XB7, XA2, ريليهات RXM, RUM, RSB, RSL, تايمرات RE17, RE22, ريليهات حماية RM17, RM22, RM35',
    examples: 'XB4BA, XB4BD, XB4BS, XA2AA, XA2ED, RXM2, RXM4, RUMC, RSB1, RSL1, RE17, RE22, RM17, RM22, RM35'
  },
  {
    id: 'vfd_softstarters',
    family: 'IDVSD',
    categoryName: 'مغيرات السرعة والإنفرتر والبادئات الناعمة (Altivar & Soft Starters)',
    nameAr: 'إنفرترات ألتيفار وسوفت ستارتر Altivar & ATS',
    nameEn: 'Altivar Inverters & Soft Starters (ATV12, ATV310, ATV320, ATV610, ATS01, ATS22)',
    arabicGroup: 'المنتجات الصناعية والماكينات (Industry Configurable & Advanced)',
    discountRate: 0.45,
    description: 'إنفرترات ATV12, ATV310, ATV320, ATV610, ATV630 وبادئات الحركة ATS01, ATS22, ATS480',
    examples: 'ATV12H, ATV310H, ATV310HD, ATV320U, ATV320D, ATV610D, ATV630D, ATS01N, ATS22D, ATS22C, ATS480'
  },
  {
    id: 'plc_hmi_control',
    family: 'IDMST',
    categoryName: 'أجهزة التحكم المنطقي PLC وشاشات HMI ومصادر التغذية',
    nameAr: 'أنظمة التحكم الآلي Modicon PLC وشاشات HMI وباور سبلاي',
    nameEn: 'Modicon PLCs, Magelis/Pro-face HMI & Power Supplies',
    arabicGroup: 'ماكينات التحكم والأتمتة (Industry Configurable & Programmable)',
    discountRate: 0.45,
    description: 'Zelio SR2/SR3, Modicon TM100, TM200, TM221, TM241, موديلات TM3, شاشات HMI HMIGXU, HMIST, ومصادر تغذية ABL2, ABLS',
    examples: 'SR2B, SR3B, TM100C, TM200C, TM221C, TM221CE, TM241CE, TM3DI, TM3DQ, TM3DM, HMIGXU, HMIST, ABL2, ABLS'
  },
  {
    id: 'industrial_enclosures',
    family: 'PPUES',
    categoryName: 'اللوحات والكبائن والعلب الصناعية Spacial / Thalassa',
    nameAr: 'لوحات صاج وفايبر Spacial S3D/CRN ومراوح تبريد',
    nameEn: 'Spacial CRN/S3D Enclosures & Thermal Accessories',
    arabicGroup: 'اللوحات الصناعية (Industry Enclosures)',
    discountRate: 0.325,
    description: 'لوحات صاج Spacial NSYCRN, صاجات التثبيت NSYMM, مراوح التبريد NSYCVF, الثرموستات NSYCCO',
    examples: 'NSYCRN252150, NSYCRN325150, NSYCRN43200, NSYCRN54200, NSYCRN64200, NSYMM, NSYCVF, NSYCCO'
  },
  {
    id: 'easypact_mvs_nw_mtz_cvs',
    family: 'PPACB',
    categoryName: 'قواطع هوائية MVS / NW / MTZ وقواطع مقولبة EasyPact CVS',
    nameAr: 'قواطع هواء Masterpact NW/MVS وقواطع EasyPact CVS',
    nameEn: 'Masterpact NW/MTZ, EasyPact MVS ACB & EasyPact CVS MCCB',
    arabicGroup: 'منتجات الجهد المنخفض للأبنية (Building Low Voltage)',
    discountRate: 0.405,
    description: 'قواطع هوائية Masterpact NW, MTZ, EasyPact MVS وقواطع مقولبة CVS 100A إلى 630A',
    examples: 'NW08, NW10, NW12, NW16, NW20, NW25, NW32, NW40, MVS08, MVS10, MVS12, MVS16, MVS20, MVS25, MVS32, LV510, LV516, LV525, LV540, LV563'
  },
  {
    id: 'nsx_nsxm_ats_acti9',
    family: 'PPCCB',
    categoryName: 'قواطع مقولبة Compact NSX ومفاتيح INS وملحقات Acti9',
    nameAr: 'قواطع Compact NSX ومفاتيح عزل INS وبوادل ATS NSX',
    nameEn: 'ComPacT NSX, Interpact INS & Acti9 Accessories',
    arabicGroup: 'منتجات الجهد المنخفض للأبنية (Building Low Voltage)',
    discountRate: 0.36,
    description: 'قواطع Compact NSX 100 إلى 630 (TMD / Micrologic), مفاتيح عزل INS40 إلى INS1600, بوادل أوتوماتيكية ATS NSX, حمايات أرضي Vigirex, روزيتات Linergy NSYTRV',
    examples: 'C10B, C10F, C10H, C10N, C16F, C25F, C40F, C63F, 1ATSX, INS40, INS63, INS100, INS250, INS400, INS630, Vigirex 56130, NSYTRV'
  },
  {
    id: 'compact_ns_ic60_c120_pratika',
    family: 'PPFDN',
    categoryName: 'قواطع مصغرة Acti9 iC60 و C120 وقواطع Compact NS الكبيرة وفيش براتيكا',
    nameAr: 'قواطع مصغرة Acti9 iC60N/H و C120N وأفياش PratiKa',
    nameEn: 'Acti9 iC60N, C120N, Compact NS>630A & PratiKa Plugs',
    arabicGroup: 'منتجات الجهد المنخفض للأبنية (Building Low Voltage)',
    discountRate: 0.345,
    description: 'قواطع مصغرة Acti9 iC60N/H (1P, 2P, 3P, 4P), قواطع C120, أفياش وبرايز PratiKa الصناعية, قواطع NS630 إلى NS1600',
    examples: 'A9F741, A9F742, A9F743, A9F744, A9N183, PKE16, PKE32, PKF16, PKF32, C063N, C080N, C100N'
  },
  {
    id: 'distribution_enclosures',
    family: 'PPFDN',
    categoryName: 'لوحات التوزيع براجما Pragma وكيدرا Kaedra وديسبو Disbo وإيزي9',
    nameAr: 'لوحات توزيع Pragma, Kaedra, Disbo, Easy9',
    nameEn: 'Pragma, Kaedra, Disbo & Easy9 Distribution Enclosures',
    arabicGroup: 'منتجات التطبيقات المنزلية واللوحات النهائية',
    discountRate: 0.325,
    description: 'لوحات توزيع Pragma (13975..), Kaedra (13175..), علب قواطع (10205), لوحات Disbo (DBGROW), لوحات Easy9 (EZ9E)',
    examples: '13975, 13978, 13984, 13175, 13180, DBGROW516FD, EZ9E112S2F, EZ9EROW112, 10205'
  },
  {
    id: 'gopact',
    family: 'PPCCB',
    categoryName: 'قواطع جو باكت (GoPact MCCB & GoMTS)',
    nameAr: 'قواطع مقولبة وبوادل يدوية GoPact & GoMTS',
    nameEn: 'GoPact MCCB & GoMTS Changeover',
    arabicGroup: 'منتجات التطبيقات المنزلية واللوحات النهائية',
    discountRate: 0.325,
    description: 'قواطع مقولبة اقتصادية GoPact G12, G20, G25, G40, G80 وبوادل يدوية GoMTS',
    examples: 'G12E, G12F, G20B, G25B, G40F, G80H, GM10D, GM20D, GM32D, GM63D'
  },
  {
    id: 'ik60_standard',
    family: 'PPFDN',
    categoryName: 'قواطع Acti9 iK60 (ثنائي وثلاثي و50A/63A)',
    nameAr: 'قواطع IK60 (ثنائي وثلاثي و50A/63A)',
    nameEn: 'Acti9 iK60 (2P, 3P, 50A/63A)',
    arabicGroup: 'منتجات التطبيقات المنزلية واللوحات النهائية',
    discountRate: 0.30,
    description: 'قواطع iK60 2P, 3P و 50A/63A',
    examples: 'A9K24150, A9K24163, A9K242, A9K243'
  },
  {
    id: 'ik60_1p_net',
    family: 'PPFDN',
    categoryName: 'قواطع أحادية IK60 (10A إلى 40A) - سعر صافي محدد',
    nameAr: 'قواطع أحادية iK60 (10A - 40A) صافي',
    nameEn: 'Acti9 iK60 1P (10A to 40A) Net Price',
    arabicGroup: 'منتجات التطبيقات المنزلية واللوحات النهائية',
    discountRate: 0.0,
    description: 'قاطع أحادي iK60 من 10A إلى 40A بسعر صافي محدد 182.00 ج.م شامل الضريبة',
    examples: 'A9K24110, A9K24116, A9K24120, A9K24125, A9K24132, A9K24140'
  },
  {
    id: 'resi9_standard',
    family: 'PPEDN',
    categoryName: 'منتجات ريزي Resi9 و Easy9 (ثنائي وثلاثي وتسريب أرضي)',
    nameAr: 'قواطع ريزي Resi9 و Easy9',
    nameEn: 'Resi9 & Easy9 MCB / RCCB',
    arabicGroup: 'منتجات ريزي وتطبيقات المباني السكنية',
    discountRate: 0.39,
    description: 'قواطع Resi9 2P/3P, Resi9 RCCB (R9R), Resi9 1P 63A, Easy9 EZ9F',
    examples: 'R9F32163, R9F322, R9F323, R9R51, EZ9F341, EZ9F342, EZ9F343'
  },
  {
    id: 'resi9_1p_net',
    family: 'PPEDN',
    categoryName: 'قواطع ريزي أحادية Resi9 1P (10A إلى 40A) - سعر صافي محدد',
    nameAr: 'قواطع أحادية Resi9 (10A - 40A) صافي',
    nameEn: 'Resi9 1P (10A to 40A) Net Price',
    arabicGroup: 'منتجات ريزي وتطبيقات المباني السكنية',
    discountRate: 0.0,
    description: 'قاطع أحادي Resi9 من 10A إلى 40A بسعر صافي محدد 175.00 ج.م شامل الضريبة',
    examples: 'R9F32110, R9F32116, R9F32120, R9F32125, R9F32132, R9F32140'
  },
  {
    id: 'stair_timers',
    family: 'PPFDN',
    categoryName: 'تايمر 24 ساعة - تايمر سلم منزلي',
    nameAr: 'تايمر سلم 24 ساعة ومؤقتات إنارة',
    nameEn: 'Stairs Lighting Timers (MIN / CCT)',
    arabicGroup: 'منتجات التطبيقات المنزلية',
    discountRate: 0.375,
    description: 'مؤقتات إنارة الدرج وتايمر 24 ساعة 15363',
    examples: '15363, CCT15365, CCT16364'
  },
  {
    id: 'capacitor_contactors',
    family: 'PPCTR',
    categoryName: 'كونتاكتورات المكثفات لتحسين معامل القدرة (LC1DF.. - LC1DWK..)',
    nameAr: 'كونتاكتورات المكثفات لتحسين معامل القدرة',
    nameEn: 'Capacitor Duty Contactors (LC1D.K)',
    arabicGroup: 'منتجات توفير وقياس الطاقة (Power Monitoring)',
    discountRate: 0.27,
    description: 'كونتاكتورات خاصة بالمكثفات LC1DFKM, LC1DGKM, LC1DLKM, LC1DMKM, LC1DPKM, LC1DTKM, LC1DWK',
    examples: 'LC1DFKM7, LC1DGKM7, LC1DLKM7, LC1DMKM7, LC1DPKM7, LC1DTKM7, LC1DWK12M7'
  },
  {
    id: 'power_meters_capacitors',
    family: 'DPLVP',
    categoryName: 'المكثفات ومحولات التيار وعدادات الطاقة (PowerLogic PM & VarPlus)',
    nameAr: 'عدادات طاقة PowerLogic ومكثفات ومحولات تيار',
    nameEn: 'PowerLogic Meters, VarPlus Capacitors & CTs',
    arabicGroup: 'منتجات توفير وقياس الطاقة (Power Monitoring)',
    discountRate: 0.24,
    description: 'مكثفات VarPlus BLRCH, BLRCS, منظمات VPL, محولات تيار METSECT, عدادات طاقة METSEPM, METSEGLDM, A9MEM',
    examples: 'BLRCH, BLRCS, LVR, VPL06N, METSECT, METSEPM, METSEGLDM, METSEION, A9MEM'
  },
  {
    id: 'new_unica',
    family: 'HDSPE',
    categoryName: 'المفاتيح والبرايز والوشوش طراز New Unica',
    nameAr: 'مفاتيح وبرايز ووشوش New Unica',
    nameEn: 'New Unica Wiring Devices',
    arabicGroup: 'منتجات التطبيقات المنزلية والوشوش',
    discountRate: 0.20,
    description: 'الوشوش، المفاتيح، والبرايز طراز New Unica',
    examples: 'NU, ST94, PKS51B'
  }
];

export function calculateProductPrice(
  product: ProductItem,
  extraDiscountPercentOrRate: number = 0
): CalculatedProduct {
  const ref = (product.reference || '').toUpperCase().trim();
  const desc = (product.description || '').toUpperCase().trim();
  const fam = (product.family || '').toUpperCase().trim();

  // Normalize extra discount rate (e.g. 5 or 0.05 -> 0.05)
  const extraRate = extraDiscountPercentOrRate > 1 
    ? extraDiscountPercentOrRate / 100 
    : Math.max(0, extraDiscountPercentOrRate);

  let discountRate = 0.45;
  let discountCategory = 'المنتجات الصناعية العامة (45%)';
  let categoryAr = 'منتجات صناعية';
  let categoryEn = 'Industrial Products';
  let isNetPrice = false;
  let netPriceOverride: number | undefined;

  // 1. Check fixed net items first
  const ikNetRefs = ['A9K24110', 'A9K24116', 'A9K24120', 'A9K24125', 'A9K24132', 'A9K24140'];
  const resiNetRefs = ['R9F32110', 'R9F32116', 'R9F32120', 'R9F32125', 'R9F32132', 'R9F32140'];

  if (ikNetRefs.includes(ref)) {
    isNetPrice = true;
    netPriceOverride = 182.00;
    discountRate = 0;
    discountCategory = 'قاطع أحادي IK 10-40A (صافي 182 ج.م شامل الضريبة)';
    categoryAr = 'قواطع Acti9 iK60 (صافي)';
    categoryEn = 'Acti9 iK60 (Net Price)';
  } else if (resiNetRefs.includes(ref)) {
    isNetPrice = true;
    netPriceOverride = 175.00;
    discountRate = 0;
    discountCategory = 'قاطع أحادي Resi9 10-40A (صافي 175 ج.م شامل الضريبة)';
    categoryAr = 'قواطع Resi9 (صافي)';
    categoryEn = 'Resi9 (Net Price)';
  } else if (
    ref.startsWith('EZ9E') || ref.startsWith('EZ9EROW') || ref.startsWith('EZ9EVROW') ||
    (ref.startsWith('EZ9') && (desc.includes('PANIL') || desc.includes('DB') || desc.includes('ROW') || desc.includes('لوحة') || desc.includes('لوحه')))
  ) {
    discountRate = 0.325;
    discountCategory = 'لوحات التوزيع Easy9 (32.5%)';
    categoryAr = 'لوحات Easy9';
    categoryEn = 'Easy9 Enclosures';
  } else if (
    ref.startsWith('R9') || ref.startsWith('EZ9') || fam === 'PPEDN'
  ) {
    discountRate = 0.39;
    discountCategory = 'قواطع ريزي Resi9 و Easy9 (39%)';
    categoryAr = ref.startsWith('EZ9') ? 'قواطع Easy9' : 'قواطع Resi9';
    categoryEn = 'Resi9 / Easy9 MCB';
  } else if (
    ref === '15363' || desc.includes('STAIRS') || desc.includes('سلم') ||
    ref.startsWith('CCT15365') || ref.startsWith('CCT16364')
  ) {
    discountRate = 0.375;
    discountCategory = 'تايمر 24 ساعة - تايمر سلم (37.5%)';
    categoryAr = 'مؤقتات إنارة ودرج';
    categoryEn = 'Stairs Timers';
  } else if (
    ref.startsWith('A9K24150') || ref.startsWith('A9K24163') || ref.startsWith('A9K24102') || ref.startsWith('A9K24106') ||
    ref.startsWith('A9K242') || ref.startsWith('A9K243') || ref.startsWith('A9K244') ||
    (ref.startsWith('A9K') && !ikNetRefs.includes(ref))
  ) {
    discountRate = 0.30;
    discountCategory = 'قواطع IK60 ثنائي وثلاثي و50A/63A (30%)';
    categoryAr = 'قواطع Acti9 iK60';
    categoryEn = 'Acti9 iK60 MCB';
  } else if (
    ref.startsWith('131') || ref.startsWith('139') || ref.startsWith('1020') || ref.startsWith('PRA') || ref.startsWith('MIP') ||
    ref.startsWith('A9HD') || ref.startsWith('A9HV') || ref.startsWith('DBGROW') || ref.startsWith('DBGD') ||
    desc.includes('KAEDRA') || desc.includes('PRAGMA') || desc.includes('لوحة') || desc.includes('لوحه') || desc.includes('علبة قاطع') ||
    desc.includes('VERTICAL TPN') || desc.includes('DISBO')
  ) {
    discountRate = 0.325;
    discountCategory = 'لوحات التوزيع براجما وكيدرا وديسبو (32.5%)';
    categoryAr = 'لوحات Pragma & Kaedra & Disbo';
    categoryEn = 'Distribution Enclosures';
  } else if (
    ref.startsWith('G12') || ref.startsWith('G20') || ref.startsWith('G25') || ref.startsWith('G40') || ref.startsWith('G80') ||
    ref.startsWith('GM10') || ref.startsWith('GM20') || ref.startsWith('GM32') || ref.startsWith('GM63') ||
    desc.includes('GOMCCB') || desc.includes('GOMTS') || desc.includes('GOPACT')
  ) {
    discountRate = 0.325;
    discountCategory = 'قواطع جو باكت GoPact & GoMTS (32.5%)';
    categoryAr = 'قواطع GoPact & GoMTS';
    categoryEn = 'GoPact MCCB';
  } else if (
    ref.startsWith('LC1DF') || ref.startsWith('LC1DG') || ref.startsWith('LC1DL') ||
    ref.startsWith('LC1DM') || ref.startsWith('LC1DP') || ref.startsWith('LC1DTK') || ref.startsWith('LC1DWK')
  ) {
    discountRate = 0.27;
    discountCategory = 'كونتاكتورات المكثفات تحسين القدرة (27%)';
    categoryAr = 'كونتاكتورات مكثفات TeSys';
    categoryEn = 'Capacitor Contactors';
  } else if (
    ref.startsWith('BLRCH') || ref.startsWith('BLRCS') || ref.startsWith('LVR') || ref.startsWith('VPL') ||
    ref.startsWith('METSECT') || ref.startsWith('METSEPM') || ref.startsWith('METSEGLDM') || ref.startsWith('METSEGLEM') || ref.startsWith('METSEION') || ref.startsWith('A9MEM') ||
    fam === 'DPLVP' || fam === 'PPAIS' || fam === 'PPAPS'
  ) {
    discountRate = 0.24;
    discountCategory = 'منتجات توفير وقياس الطاقة والمكثفات والعدادات (24%)';
    categoryAr = 'عدادات ومكثفات PowerLogic';
    categoryEn = 'Power Monitoring & Capacitors';
  } else if (
    ref.startsWith('MVS') || ref.startsWith('NW') || ref.startsWith('LV8') || ref.startsWith('MTZ') ||
    ref.startsWith('CVS') || ref.startsWith('E080') || ref.startsWith('E100') || ref.startsWith('E125') || ref.startsWith('E160') ||
    ref.startsWith('LV510') || ref.startsWith('LV516') || ref.startsWith('LV525') || ref.startsWith('LV540') || ref.startsWith('LV563') ||
    (fam === 'PPCCB' && (desc.includes('CVS') || desc.includes('EASYPACT CVS'))) ||
    fam === 'PPACB'
  ) {
    discountRate = 0.405;
    discountCategory = 'قواطع هوائية MVS/NW/MTZ وقواطع مقولبة EasyPact CVS (40.5%)';
    categoryAr = ref.startsWith('LV5') || ref.startsWith('CVS') || desc.includes('CVS') ? 'قواطع EasyPact CVS' : 'قواطع هواء Masterpact / MVS';
    categoryEn = 'Masterpact / EasyPact MVS & CVS';
  } else if (
    ref.startsWith('C063') || ref.startsWith('C080') || ref.startsWith('C100') || ref.startsWith('C125') || ref.startsWith('C160') ||
    ref.startsWith('NS06') || ref.startsWith('NS08') || ref.startsWith('NS10') || ref.startsWith('NS12') || ref.startsWith('NS16') || ref.startsWith('NS20') ||
    ref.startsWith('A9F7') || ref.startsWith('A9F8') || ref.startsWith('A9F9') ||
    ref.startsWith('A9N615') || ref.startsWith('A9N183') || ref.startsWith('A9N184') || ref.startsWith('A9N185') ||
    ref.startsWith('8118') || ref.startsWith('8138') || ref.startsWith('8139') || ref.startsWith('8148') || ref.startsWith('8168') || ref.startsWith('8169') ||
    ref.startsWith('PKE') || ref.startsWith('PKF') || ref.startsWith('PKS') ||
    fam === 'HDCWD'
  ) {
    discountRate = 0.345;
    discountCategory = 'قواطع iC60 / C120 / NS>630A وأفياش براتيكا (34.5%)';
    categoryAr = ref.startsWith('A9F') ? 'قواطع Acti9 iC60' : (ref.startsWith('PK') ? 'أفياش PratiKa' : (ref.startsWith('A9N18') ? 'قواطع C120' : 'قواطع Compact NS'));
    categoryEn = 'Acti9 iC60 & PratiKa';
  } else if (
    ref.startsWith('EGX') || ref.startsWith('EBX') || ref.startsWith('A9A')
  ) {
    discountRate = 0.34;
    discountCategory = 'بوابات ذكية وإكسسوارات قواطع iC60 (34%)';
    categoryAr = 'بوابات وإكسسوارات Acti9';
    categoryEn = 'Gateways & Acti9 Accessories';
  } else if (
    ref.startsWith('C10B') || ref.startsWith('C10F') || ref.startsWith('C10H') || ref.startsWith('C10N') ||
    ref.startsWith('C16B') || ref.startsWith('C16F') || ref.startsWith('C16H') || ref.startsWith('C16N') ||
    ref.startsWith('C25B') || ref.startsWith('C25F') || ref.startsWith('C25H') || ref.startsWith('C25N') ||
    ref.startsWith('C40F') || ref.startsWith('C40H') || ref.startsWith('C40N') ||
    ref.startsWith('C63F') || ref.startsWith('C63H') || ref.startsWith('C63N') ||
    ref.startsWith('1ATSX') || fam === 'PPATS' ||
    ref.startsWith('A9R') || ref.startsWith('A9D') || ref.startsWith('A9C') || ref.startsWith('A9E') || ref.startsWith('A9L') || ref.startsWith('A9V') ||
    ref.startsWith('289') || ref.startsWith('311') || ref.startsWith('312') || ref.startsWith('313') || ref.startsWith('326') || ref.startsWith('336') || ref.startsWith('338') || ref.startsWith('339') || ref.startsWith('419') ||
    ref.startsWith('5043') || ref.startsWith('560') || ref.startsWith('561') ||
    ref.startsWith('NSYTRV') || ref.startsWith('PPLVS') ||
    ref.startsWith('LV42') || ref.startsWith('LV43') ||
    (fam === 'PPCCB' && !ref.startsWith('G12') && !ref.startsWith('G20') && !ref.startsWith('G25') && !ref.startsWith('G40') && !ref.startsWith('G80'))
  ) {
    discountRate = 0.36;
    discountCategory = 'قواطع Compact NSX ومفاتيح INS وملحقات Acti9 وVigirex (36%)';
    categoryAr = ref.startsWith('C10') || ref.startsWith('C16') || ref.startsWith('C25') || ref.startsWith('C40') || ref.startsWith('C63') ? 'قواطع Compact NSX' : (ref.startsWith('INS') || ref.startsWith('289') || ref.startsWith('311') ? 'مفاتيح Interpact INS' : 'ملحقات الجهد المنخفض');
    categoryEn = 'ComPacT NSX / INS';
  } else if (
    ref.startsWith('LC1G') || ref.startsWith('LR9G') || ref.startsWith('LA9G')
  ) {
    discountRate = 0.45;
    discountCategory = 'كونتاكتورات وأوفرلود TeSys Giga (45%)';
    categoryAr = 'كونتاكتورات TeSys Giga';
    categoryEn = 'TeSys Giga';
  } else if (
    ref.startsWith('LC1D') || ref.startsWith('LC1E') || ref.startsWith('LC1K') ||
    ref.startsWith('CAD') || ref.startsWith('CA2') || ref.startsWith('CA3') || ref.startsWith('CA4') || ref.startsWith('CAE') ||
    ref.startsWith('LRD') || ref.startsWith('LRE') || ref.startsWith('LR2K') || ref.startsWith('LR97') || ref.startsWith('LR9D') ||
    ref.startsWith('GV2') || ref.startsWith('GV3') || ref.startsWith('GV4') || ref.startsWith('GZ1') ||
    ref.startsWith('LP1K') || ref.startsWith('LP2K') || ref.startsWith('LC2K') ||
    ref.startsWith('3DM2') || ref.startsWith('3MZ2') || ref.startsWith('EOCR') || ref.startsWith('EUCR') ||
    fam === 'PPCTR'
  ) {
    discountRate = 0.48;
    discountCategory = 'بادئات حركة أساسية وكونتاكتورات TeSys D/K/TVS وأوفرلود EOCR (48%)';
    categoryAr = ref.startsWith('LC1D') ? 'كونتاكتورات TeSys D' : (ref.startsWith('LC1E') ? 'كونتاكتورات EasyPact TVS' : (ref.startsWith('GV') || ref.startsWith('GZ') ? 'قواطع محركات TeSys GV' : 'أوفرلود TeSys / EOCR'));
    categoryEn = 'TeSys D / TVS Contactors';
  } else if (
    ref.startsWith('ATS') || ref.startsWith('ATV') || fam === 'IDVSD'
  ) {
    discountRate = 0.45;
    discountCategory = 'مغيرات السرعة والإنفرتر وسوفت ستارتر Altivar & ATS (45%)';
    categoryAr = ref.startsWith('ATV') ? 'إنفرتر Altivar' : 'سوفت ستارتر Altivar ATS';
    categoryEn = 'Altivar Drives & Soft Starters';
  } else if (
    ref.startsWith('TM100') || ref.startsWith('TM200') || ref.startsWith('TM221') || ref.startsWith('TM241') || ref.startsWith('TM251') || ref.startsWith('TM262') ||
    ref.startsWith('TM3') || ref.startsWith('TM4') || ref.startsWith('TM5') || ref.startsWith('TMC') || ref.startsWith('TMCR') ||
    ref.startsWith('SR2') || ref.startsWith('SR3') || ref.startsWith('HMI') || ref.startsWith('ABL') || ref.startsWith('LXM') || ref.startsWith('BCH') || ref.startsWith('VW3') ||
    fam === 'IDMST' || fam === 'IDPAC' || fam === 'IDHMI' || fam === 'IDPLC' || fam === 'IDSER'
  ) {
    discountRate = 0.45;
    discountCategory = 'أنظمة التحكم الآلي PLC وسيرفو وشاشات HMI ومصادر التغذية (45%)';
    categoryAr = ref.startsWith('TM') || ref.startsWith('SR') ? 'أجهزة Modicon PLC' : (ref.startsWith('HMI') ? 'شاشات تحكم HMI' : (ref.startsWith('LXM') ? 'سيرفو Lexium' : 'مصادر تغذية ABL'));
    categoryEn = 'Modicon PLC & HMI';
  } else if (
    ref.startsWith('XB4') || ref.startsWith('XB5') || ref.startsWith('XB6') || ref.startsWith('XB7') || ref.startsWith('XA2') ||
    ref.startsWith('RXM') || ref.startsWith('RUM') || ref.startsWith('RSB') || ref.startsWith('RSL') || ref.startsWith('RXG') ||
    ref.startsWith('RE17') || ref.startsWith('RE22') || ref.startsWith('RE48') || ref.startsWith('RENF') || ref.startsWith('REXL') ||
    ref.startsWith('RM17') || ref.startsWith('RM22') || ref.startsWith('RM35') ||
    ref.startsWith('SSP') || ref.startsWith('SSD') || ref.startsWith('SSL') || ref.startsWith('SSM') ||
    ref.startsWith('XAC') || ref.startsWith('XAL') || ref.startsWith('XAP') || ref.startsWith('XAR') || ref.startsWith('XV') ||
    fam === 'IDSIG'
  ) {
    discountRate = 0.45;
    discountCategory = 'أزرار ومفاتيح إشارة وريليهات ومؤقتات صناعية (45%)';
    categoryAr = ref.startsWith('XB') || ref.startsWith('XA') ? 'أزرار وإشارات Harmony' : (ref.startsWith('RX') || ref.startsWith('RU') ? 'ريليهات Zelio Relays' : 'مؤقتات وحمايات Zelio');
    categoryEn = 'Harmony Buttons & Zelio Relays';
  } else if (
    ref.startsWith('NSY') || fam === 'PPUES' || fam === 'PENC' || fam === 'PPLVS'
  ) {
    discountRate = 0.325;
    discountCategory = 'اللوحات والكبائن والعلب الصناعية Spacial/Thalassa (32.5%)';
    categoryAr = 'لوحات صاج Spacial';
    categoryEn = 'Spacial Enclosures';
  } else if (ref.startsWith('ST94') || ref.startsWith('NU') || fam === 'HDSPE') {
    discountRate = 0.20;
    discountCategory = 'أفياش وشوكو وتطبيقات منزلية (20%)';
    categoryAr = 'أفياش New Unica';
    categoryEn = 'New Unica Wiring';
  }

  // Override if product explicitly had categoryAr
  if (product.categoryAr) categoryAr = product.categoryAr;
  if (product.categoryEn) categoryEn = product.categoryEn;

  const vatRate = 0.14;
  let discountAmount = 0;
  let priceBeforeVat = 0;
  let vatAmount = 0;
  let finalNetPrice = 0;
  let extraDiscountAmount = 0;
  let totalEffectiveDiscountRate = discountRate;

  if (isNetPrice && netPriceOverride) {
    let baseNet = netPriceOverride;
    if (extraRate > 0) {
      extraDiscountAmount = baseNet * extraRate;
      finalNetPrice = baseNet - extraDiscountAmount;
      priceBeforeVat = finalNetPrice / (1 + vatRate);
      vatAmount = finalNetPrice - priceBeforeVat;
      discountAmount = Math.max(0, product.price - priceBeforeVat);
      totalEffectiveDiscountRate = product.price > 0 ? (product.price - priceBeforeVat) / product.price : extraRate;
    } else {
      finalNetPrice = baseNet;
      priceBeforeVat = baseNet / (1 + vatRate);
      vatAmount = finalNetPrice - priceBeforeVat;
      discountAmount = Math.max(0, product.price - priceBeforeVat);
      discountRate = product.price > 0 ? discountAmount / product.price : 0;
      totalEffectiveDiscountRate = discountRate;
    }
  } else {
    // Standard cascade discount calculation:
    // 1. Base list discount
    const baseDiscountAmount = product.price * discountRate;
    const priceAfterBaseDiscount = product.price - baseDiscountAmount;

    // 2. Extra discount over the discounted price (فوق خصم الليستة)
    if (extraRate > 0) {
      extraDiscountAmount = priceAfterBaseDiscount * extraRate;
      priceBeforeVat = priceAfterBaseDiscount - extraDiscountAmount;
      discountAmount = baseDiscountAmount + extraDiscountAmount;
      totalEffectiveDiscountRate = product.price > 0 ? discountAmount / product.price : discountRate;
    } else {
      priceBeforeVat = priceAfterBaseDiscount;
      discountAmount = baseDiscountAmount;
      totalEffectiveDiscountRate = discountRate;
    }

    vatAmount = priceBeforeVat * vatRate;
    finalNetPrice = priceBeforeVat + vatAmount;
  }

  return {
    ...product,
    listPrice: product.price,
    discountRate,
    discountPercentage: Math.round(discountRate * 1000) / 10,
    discountAmount,
    priceBeforeVat,
    priceAfterDiscount: priceBeforeVat,
    vatRate,
    vatAmount,
    finalNetPrice,
    priceWithVat: finalNetPrice,
    discountCategory,
    categoryAr,
    categoryEn,
    isNetPrice,
    netPriceOverride,
    extraDiscountRate: extraRate,
    extraDiscountAmount,
    totalEffectiveDiscountRate,
  };
}

export function formatEGP(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ج.م';
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

import React, { useState } from 'react';
import { calculateProductPrice, DISCOUNT_RULES_METADATA } from '../data/discountCalculator';
import { CalculatedProduct } from '../types';
import { 
  Calculator, 
  Tag, 
  Percent, 
  Receipt, 
  ShieldCheck, 
  ShoppingCart,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface CustomCalculatorProps {
  onAddToCart: (product: CalculatedProduct) => void;
}

export const CustomCalculator: React.FC<CustomCalculatorProps> = ({ onAddToCart }) => {
  const [reference, setReference] = useState('');
  const [listPrice, setListPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [customDiscountOverride, setCustomDiscountOverride] = useState<string>('');
  const [extraDiscountInput, setExtraDiscountInput] = useState<string>('');
  const [useManualDiscount, setUseManualDiscount] = useState(false);
  const [result, setResult] = useState<CalculatedProduct | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyNameAndPrice = () => {
    if (!result) return;
    const textToCopy = `${result.description || result.reference} (${result.reference}) - السعر الصافي: ${formatEGP(result.finalNetPrice)} ج.م`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(listPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const extraRate = parseFloat(extraDiscountInput) > 0 ? parseFloat(extraDiscountInput) / 100 : 0;

    if (useManualDiscount && customDiscountOverride) {
      const baseDiscRate = parseFloat(customDiscountOverride) / 100;
      const baseDiscountAmount = priceNum * baseDiscRate;
      const priceAfterBase = priceNum - baseDiscountAmount;
      const extraDiscountAmount = extraRate > 0 ? priceAfterBase * extraRate : 0;
      const priceBeforeVat = priceAfterBase - extraDiscountAmount;
      const vatAmount = priceBeforeVat * 0.14;
      const finalNetPrice = priceBeforeVat + vatAmount;
      const totalDiscountAmount = baseDiscountAmount + extraDiscountAmount;

      setResult({
        reference: reference.trim() || 'CUSTOM-REF',
        description: description.trim() || 'منتج مخصص',
        family: selectedFamily || 'CUSTOM',
        categoryAr: 'حساب مخصص',
        categoryEn: 'Custom Calculation',
        listPrice: priceNum,
        discountRate: baseDiscRate,
        discountPercentage: Math.round(baseDiscRate * 1000) / 10,
        discountAmount: totalDiscountAmount,
        priceBeforeVat,
        priceAfterDiscount: priceBeforeVat,
        vatRate: 0.14,
        vatAmount,
        finalNetPrice,
        priceWithVat: finalNetPrice,
        discountCategory: `خصم يدوي (${(baseDiscRate * 100).toFixed(0)}%)`,
        isNetPrice: false,
        extraDiscountRate: extraRate,
        extraDiscountAmount,
        totalEffectiveDiscountRate: priceNum > 0 ? totalDiscountAmount / priceNum : baseDiscRate,
      });
    } else {
      const calculated = calculateProductPrice(
        {
          reference: reference.trim() || 'CUSTOM-REF',
          price: priceNum,
          description: description.trim() || 'منتج مخصص',
          family: selectedFamily || 'CUSTOM',
        },
        extraRate
      );
      setResult(calculated);
    }
  };

  const handleQuickExample = (ref: string, price: number, desc: string) => {
    setReference(ref);
    setListPrice(price.toString());
    setDescription(desc);
    setUseManualDiscount(false);
    const extraRate = parseFloat(extraDiscountInput) > 0 ? parseFloat(extraDiscountInput) / 100 : 0;
    const calculated = calculateProductPrice(
      {
        reference: ref,
        price: price,
        description: desc,
        family: 'CUSTOM',
      },
      extraRate
    );
    setResult(calculated);
  };

  const formatEGP = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2c3e50] flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#3dcd58]" />
            <span>حاسبة الأسعار والخصومات المخصصة</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            أدخل كود أي منتج والسعر الرسمي في القائمة لحساب الخصم المعتمد تلقائياً أو حدد نسبة خصم مخصصة
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-bold">أمثلة سريعة:</span>
          <button
            type="button"
            onClick={() => handleQuickExample('A9F74116', 746.70, 'iC60N 1P 16A C')}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#3dcd58] border border-gray-200 hover:border-[#3dcd58]/40 font-mono-code font-bold transition-colors"
          >
            Acti9 (A9F)
          </button>
          <button
            type="button"
            onClick={() => handleQuickExample('LC1D18M7', 3565.08, 'TeSys D 18A 220V')}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#3dcd58] border border-gray-200 hover:border-[#3dcd58]/40 font-mono-code font-bold transition-colors"
          >
            TeSys (LC1D)
          </button>
          <button
            type="button"
            onClick={() => handleQuickExample('ATV310HU15N4E', 20899.20, 'ATV310 1.5kW 380V')}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#3dcd58] border border-gray-200 hover:border-[#3dcd58]/40 font-mono-code font-bold transition-colors"
          >
            Altivar (ATV)
          </button>
        </div>
      </div>

      {/* Main Form & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2c3e50] mb-1.5">
                كود المنتج (Reference) <span className="text-gray-400 font-normal">(للتعرف التلقائي على الفئة)</span>
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="مثال: A9F74116 أو LC1D09M7 أو ATV310"
                className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#3dcd58] focus:bg-white rounded-xl px-4 py-2.5 text-[#2c3e50] font-mono-code text-sm outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2c3e50] mb-1.5">
                السعر الرسمي في القائمة (List Price) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#3dcd58] focus:bg-white rounded-xl pl-12 pr-4 py-2.5 text-[#2c3e50] font-mono-code text-base font-bold outline-none transition-all placeholder:text-gray-400"
                />
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">ج.م</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2c3e50] mb-1.5">
                الوصف الفني (اختياري)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: قاطع شنايدر 16A أحادي"
                className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#3dcd58] focus:bg-white rounded-xl px-4 py-2.5 text-[#2c3e50] text-xs outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Discount rule toggle */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">طريقة تحديد نسبة الخصم:</span>
                <button
                  type="button"
                  onClick={() => setUseManualDiscount(!useManualDiscount)}
                  className="text-xs text-[#3dcd58] hover:underline font-bold"
                >
                  {useManualDiscount ? 'الرجوع للتعرف التلقائي' : 'تحديد نسبة يدوية'}
                </button>
              </div>

              {useManualDiscount ? (
                <div>
                  <label className="block text-xs font-bold text-red-600 mb-1.5">
                    نسبة الخصم اليدوية (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={customDiscountOverride}
                    onChange={(e) => setCustomDiscountOverride(e.target.value)}
                    placeholder="مثال: 45"
                    className="w-full bg-gray-50 border border-red-200 focus:border-red-500 rounded-xl px-4 py-2 text-[#2c3e50] font-mono-code font-bold text-sm outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    أو اختر الفئة المباشرة:
                  </label>
                  <select
                    value={selectedFamily}
                    onChange={(e) => setSelectedFamily(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#2c3e50] outline-none font-medium"
                  >
                    <option value="">تعرف تلقائي من كود المنتج</option>
                    {DISCOUNT_RULES_METADATA.filter((rule, index, self) => index === self.findIndex((t) => t.family === rule.family)).map((rule) => (
                      <option key={rule.family} value={rule.family}>
                        {rule.nameAr} - خصم {(rule.discountRate * 100).toFixed((rule.discountRate * 100) % 1 === 0 ? 0 : 1)}%
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Extra Discount Field */}
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
                <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
                  <span>خصم إضافي فوق الليستة (% اختياري):</span>
                  {extraDiscountInput && (
                    <button
                      type="button"
                      onClick={() => setExtraDiscountInput('')}
                      className="text-[11px] text-amber-700 hover:underline"
                    >
                      إلغاء
                    </button>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="90"
                    value={extraDiscountInput}
                    onChange={(e) => setExtraDiscountInput(e.target.value)}
                    placeholder="0 (مثال: 5)"
                    className="w-full bg-white border border-amber-300 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs font-mono-code font-bold text-amber-950 outline-none"
                  />
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-amber-800">%</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#3dcd58] hover:bg-[#32b84a] text-white shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Calculator className="w-4 h-4" />
              <span>احسب السعر والخصم والضريبة</span>
            </button>
          </form>
        </div>

        {/* Result Card (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          {result ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-code font-bold text-base sm:text-lg text-[#3dcd58] bg-[#3dcd58]/10 border border-[#3dcd58]/30 px-3 py-0.5 rounded-lg">
                    {result.reference}
                  </span>
                  <p className="text-xs text-gray-700 mt-2 font-medium">
                    {result.description}
                  </p>
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg">
                  {result.categoryAr}
                </span>
              </div>

              {/* Math breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>السعر الرسمي (قائمة):</span>
                  <span className="font-mono-code font-bold text-[#2c3e50] text-sm">{formatEGP(result.listPrice)} ج.م</span>
                </div>

                <div className="flex justify-between text-xs text-red-600">
                  <span>نسبة الخصم المعتمدة:</span>
                  <span className="font-mono-code font-bold text-red-600 text-sm">{(result.discountRate * 100).toFixed((result.discountRate * 100) % 1 === 0 ? 0 : 1)}%</span>
                </div>

                {result.extraDiscountRate && result.extraDiscountRate > 0 ? (
                  <div className="flex justify-between text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <span className="font-semibold">خصم إضافي فوق الليستة:</span>
                    <span className="font-mono-code font-bold text-amber-800">
                      +{(result.extraDiscountRate * 100).toFixed((result.extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}% (-{formatEGP(result.extraDiscountAmount || 0)} ج.م)
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-xs text-red-600">
                  <span>إجمالي قيمة الخصم الموفر:</span>
                  <span className="font-mono-code font-bold text-red-600 text-sm">- {formatEGP(result.discountAmount)} ج.م</span>
                </div>

                <div className="flex justify-between text-xs text-gray-700 border-t border-gray-200 pt-2 font-medium">
                  <span>السعر بعد الخصم (قبل الضريبة):</span>
                  <span className="font-mono-code font-bold text-[#2fa946] text-sm">{formatEGP(result.priceBeforeVat)} ج.م</span>
                </div>

                <div className="flex justify-between text-xs text-teal-700">
                  <span>ضريبة القيمة المضافة (14% VAT):</span>
                  <span className="font-mono-code font-bold text-teal-700 text-sm">+ {formatEGP(result.vatAmount)} ج.م</span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-[#2c3e50] text-white rounded-xl shadow-xs mt-2">
                  <div>
                    <span className="text-xs font-bold text-white block">السعر النهائي الصافي</span>
                    <span className="text-[10px] text-gray-300">شامل الخصم وضريبة 14%</span>
                  </div>
                  <span className="font-mono-code font-black text-2xl text-[#3dcd58]">
                    {formatEGP(result.finalNetPrice)} <span className="text-xs font-normal text-white/80">ج.م</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyNameAndPrice}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                    copied
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : 'bg-white hover:bg-gray-50 border-gray-300 text-[#2c3e50] shadow-xs'
                  }`}
                  title="نسخ الاسم والكود والسعر الصافي"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#3dcd58]" />
                      <span>تم نسخ الاسم والسعر</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span>نسخ الاسم والسعر الصافي</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onAddToCart(result)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#3dcd58] hover:bg-[#32b84a] text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة للمقايسة</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <Calculator className="w-12 h-12 text-gray-300 mb-3" />
              <h4 className="text-sm font-bold text-[#2c3e50] mb-1">النتيجة ستظهر هنا</h4>
              <p className="text-xs text-gray-500 max-w-xs">
                أدخل الكود والسعر في النموذج على اليمين واضغط "احسب" لمشاهدة التفريغ المالي الدقيق
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

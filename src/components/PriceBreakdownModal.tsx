import React from 'react';
import { CalculatedProduct } from '../types';
import { X, Check, Copy, Percent, Receipt, ShieldCheck, Tag, Info, ShoppingCart } from 'lucide-react';

interface PriceBreakdownModalProps {
  product: CalculatedProduct | null;
  onClose: () => void;
  onAddToCart: (product: CalculatedProduct) => void;
}

export const PriceBreakdownModal: React.FC<PriceBreakdownModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [copiedFull, setCopiedFull] = React.useState(false);
  const [copiedNamePrice, setCopiedNamePrice] = React.useState(false);

  const formatEGP = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyFull = () => {
    navigator.clipboard.writeText(
      `كود المنتج: ${product.reference}\nالوصف: ${product.description}\nالسعر الرسمي: ${product.listPrice.toFixed(2)} ج.م\nنسبة الخصم: ${(product.discountRate * 100).toFixed(0)}%\nالسعر بعد الخصم: ${product.priceBeforeVat.toFixed(2)} ج.م\nضريبة القيمة المضافة (14%): ${product.vatAmount.toFixed(2)} ج.م\nالسعر النهائي الصافي: ${product.finalNetPrice.toFixed(2)} ج.م`
    );
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleCopyNameAndPrice = () => {
    navigator.clipboard.writeText(
      `${product.description} (${product.reference}) - السعر الصافي: ${formatEGP(product.finalNetPrice)} ج.م`
    );
    setCopiedNamePrice(true);
    setTimeout(() => setCopiedNamePrice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-gray-200 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative text-[#2c3e50]">
        {/* Header */}
        <div className="bg-gray-50/80 p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono-code font-bold text-lg sm:text-xl text-[#3dcd58] bg-[#3dcd58]/10 border border-[#3dcd58]/30 px-3 py-1 rounded-xl">
                {product.reference}
              </span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg">
                {product.categoryAr}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                ({product.family})
              </span>
            </div>
            <h2 className="text-base font-bold text-[#2c3e50] leading-snug">
              {product.description}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Detailed Math Breakdown */}
        <div className="p-6 space-y-6">
          {product.isNetPrice && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-2 text-amber-800 text-xs">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>هذا الصنف محدد بسعر صافي خاص مباشرة (Net Price Item).</span>
            </div>
          )}

          {/* Pricing Calculation Steps */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3.5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              خطوات الحساب المعتمدة وفقاً لقائمة الأسعار والخصومات
            </h4>

            {/* 1. List Price */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                1. السعر الرسمي في قائمة شنايدر (List Price)
              </span>
              <span className="font-mono-code font-bold text-[#2c3e50] text-base">
                {formatEGP(product.listPrice)} <span className="text-xs text-gray-500 font-normal">ج.م</span>
              </span>
            </div>

            {/* 2. Discount Rate */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Percent className="w-4 h-4 text-red-500" />
                2. نسبة الخصم المعتمدة (الليستة)
              </span>
              <span className="font-mono-code font-bold text-red-600 text-base bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                {(product.discountRate * 100).toFixed((product.discountRate * 100) % 1 === 0 ? 0 : 1)}%
              </span>
            </div>

            {/* Extra Discount (if present) */}
            {product.extraDiscountRate && product.extraDiscountRate > 0 ? (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-200 bg-amber-50/60 px-2.5 rounded-lg border border-amber-200">
                <span className="text-sm text-amber-800 flex items-center gap-2 font-semibold">
                  <Percent className="w-4 h-4 text-amber-600" />
                  خصم إضافي فوق الليستة
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-bold text-amber-700 text-base bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    +{(product.extraDiscountRate * 100).toFixed((product.extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}%
                  </span>
                  <span className="text-xs text-amber-700 font-mono-code">
                    (-{formatEGP(product.extraDiscountAmount || 0)} ج.م)
                  </span>
                </div>
              </div>
            ) : null}

            {/* 3. Discount Amount */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-500" />
                3. إجمالي قيمة الخصم الموفرة
              </span>
              <span className="font-mono-code font-semibold text-red-600 text-base">
                - {formatEGP(product.discountAmount)} <span className="text-xs text-gray-500 font-normal">ج.م</span>
              </span>
            </div>

            {/* 4. Price before VAT */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 bg-white px-2.5 rounded-lg">
              <span className="text-sm font-semibold text-[#2c3e50]">
                4. السعر بعد الخصم (صافي قبل ضريبة القيمة المضافة)
              </span>
              <span className="font-mono-code font-bold text-[#2fa946] text-base">
                {formatEGP(product.priceBeforeVat)} <span className="text-xs text-gray-500 font-normal">ج.م</span>
              </span>
            </div>

            {/* 5. VAT 14% */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                5. ضريبة القيمة المضافة (14% VAT)
              </span>
              <span className="font-mono-code font-semibold text-teal-700 text-base">
                + {formatEGP(product.vatAmount)} <span className="text-xs text-gray-500 font-normal">ج.م</span>
              </span>
            </div>

            {/* 6. Total Final Net Price */}
            <div className="flex items-center justify-between p-4 bg-[#2c3e50] text-white rounded-xl shadow-xs">
              <div>
                <span className="text-xs font-bold text-white block">
                  السعر النهائي الصافي
                </span>
                <span className="text-[11px] text-gray-300">شامل الخصم وضريبة 14%</span>
              </div>
              <span className="font-mono-code font-black text-2xl text-[#3dcd58]">
                {formatEGP(product.finalNetPrice)} <span className="text-sm font-normal text-white/80">ج.م</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Name and Net Price */}
            <button
              onClick={handleCopyNameAndPrice}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                copiedNamePrice
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : 'bg-white hover:bg-gray-100 text-[#2c3e50] border-gray-300 shadow-xs'
              }`}
              title="نسخ اسم المنتج والكود مع السعر الصافي النهائي فقط"
            >
              {copiedNamePrice ? (
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

            {/* Copy Full Breakdown */}
            <button
              onClick={handleCopyFull}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-all shadow-xs"
              title="نسخ تفاصيل الحسبة كاملة"
            >
              {copiedFull ? (
                <>
                  <Check className="w-4 h-4 text-[#3dcd58]" />
                  <span>تم نسخ التفريغ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>نسخ كل التفاصيل</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#3dcd58] hover:bg-[#32b84a] text-white shadow-xs transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>إضافة للمقايسة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

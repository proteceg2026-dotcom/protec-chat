import React, { useState } from 'react';
import { CalculatedProduct } from '../types';
import { 
  Check, 
  Copy, 
  Plus, 
  Tag, 
  Info,
  TrendingDown
} from 'lucide-react';

interface ProductCardProps {
  product: CalculatedProduct;
  onAddToCart: (product: CalculatedProduct) => void;
  onInspect: (product: CalculatedProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onInspect,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedNamePrice, setCopiedNamePrice] = useState(false);
  const [added, setAdded] = useState(false);

  const formatEGP = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.reference);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleCopyNameAndNetPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${product.description} (${product.reference}) - السعر الصافي: ${formatEGP(product.finalNetPrice)} ج.م`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNamePrice(true);
    setTimeout(() => setCopiedNamePrice(false), 1800);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => onInspect(product)}
      className="group relative bg-white hover:bg-emerald-50/20 border border-gray-200 hover:border-[#3dcd58] rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono-code font-bold text-sm sm:text-base text-[#3dcd58] bg-[#3dcd58]/10 border border-[#3dcd58]/30 px-2.5 py-0.5 rounded-lg">
              {product.reference}
            </span>
            <button
              onClick={handleCopyCode}
              title="نسخ الكود فقط"
              className="text-gray-400 hover:text-[#2c3e50] p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#3dcd58]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
              {product.categoryAr}
            </span>
            {product.discountRate > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                <TrendingDown className="w-3 h-3" />
                -{(product.discountRate * 100).toFixed((product.discountRate * 100) % 1 === 0 ? 0 : 1)}%
              </span>
            )}
            {product.extraDiscountRate && product.extraDiscountRate > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md animate-pulse">
                +{(product.extraDiscountRate * 100).toFixed((product.extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}% إضافي
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Description */}
        <h3 className="text-sm font-bold text-[#2c3e50] line-clamp-2 leading-relaxed mb-4" title={product.description}>
          {product.description}
        </h3>
      </div>

      {/* Pricing Matrix */}
      <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* List Price */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
            <span className="text-gray-500 block text-[11px] font-medium">السعر الرسمي (قائمة)</span>
            <span className="font-semibold text-gray-700 font-mono-code text-xs sm:text-sm">
              {formatEGP(product.listPrice)} <span className="text-[10px] text-gray-400 font-normal">ج.م</span>
            </span>
          </div>

          {/* After Discount (Before VAT) */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
            <span className="text-gray-500 block text-[11px] font-medium">بعد الخصم (صافي)</span>
            <span className="font-semibold text-[#2fa946] font-mono-code text-xs sm:text-sm">
              {formatEGP(product.priceBeforeVat)} <span className="text-[10px] text-gray-400 font-normal">ج.م</span>
            </span>
          </div>
        </div>

        {/* Final Price Highlight & Action Buttons */}
        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-[#3dcd58]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#2c3e50] block font-bold">الصافي النهائي (+14% ض.ق.م)</span>
            <div className="font-mono-code font-extrabold text-base sm:text-lg text-[#2c3e50]">
              {formatEGP(product.finalNetPrice)} <span className="text-xs font-bold text-[#3dcd58]">ج.م</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
            {/* Copy Name and Net Price Button */}
            <button
              onClick={handleCopyNameAndNetPrice}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold border transition-all ${
                copiedNamePrice
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-[#2c3e50] shadow-xs'
              }`}
              title="نسخ اسم المنتج والسعر الصافي النهائي للحافظة"
            >
              {copiedNamePrice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3dcd58]" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-600" />
                  <span>نسخ السعر</span>
                </>
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all shadow-xs ${
                added 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#3dcd58] hover:bg-[#32b84a] text-white'
              }`}
              title="إضافة إلى المقايسة"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>أُضيف</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

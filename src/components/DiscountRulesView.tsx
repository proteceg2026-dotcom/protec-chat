import React from 'react';
import { DISCOUNT_RULES_METADATA } from '../data/discountCalculator';
import { Percent, ShieldCheck } from 'lucide-react';

export const DiscountRulesView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2c3e50] flex items-center gap-2">
            <Percent className="w-6 h-6 text-[#3dcd58]" />
            <span>جدول نسب الخصم المعتمدة لمنتجات شنايدر إلكتريك</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            جدول الخصومات الرسمية المطبقة على قائمة الأسعار لعام 2026 لكل عائلة وفئة من المنتجات
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#3dcd58]/10 border border-[#3dcd58]/30 px-3 py-1.5 rounded-xl text-xs text-[#2fa946] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#3dcd58]" />
          <span>ضريبة القيمة المضافة: 14%</span>
        </div>
      </div>

      {/* Grid of Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISCOUNT_RULES_METADATA.map((rule) => (
          <div
            key={rule.id}
            className="bg-white border border-gray-200 hover:border-[#3dcd58]/50 hover:shadow-md rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono-code font-bold text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {rule.family}
                </span>
                <span className="font-mono-code font-extrabold text-sm text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                  {(rule.discountRate * 100).toFixed((rule.discountRate * 100) % 1 === 0 ? 0 : 1)}% خصم
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#2c3e50] mb-1">
                {rule.nameAr}
              </h3>
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {rule.nameEn}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1">أمثلة على الأكواد المشمولة:</span>
              <p className="text-xs font-mono-code text-[#2fa946] font-semibold leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                {rule.examples}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

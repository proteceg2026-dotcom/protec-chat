import React from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { QuotationItem } from '../types';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface QuotationCartProps {
  items: QuotationItem[];
  onUpdateQuantity: (reference: string, newQty: number) => void;
  onRemoveItem: (reference: string) => void;
  onClearCart: () => void;
  onBackToSearch: () => void;
}

export const QuotationCart: React.FC<QuotationCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToSearch,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [copiedItemRef, setCopiedItemRef] = React.useState<string | null>(null);

  // Totals calculations
  const totalListPrice = items.reduce((sum, item) => sum + item.product.listPrice * item.quantity, 0);
  const totalDiscountAmount = items.reduce((sum, item) => sum + item.product.discountAmount * item.quantity, 0);
  const totalPriceBeforeVat = items.reduce((sum, item) => sum + item.product.priceBeforeVat * item.quantity, 0);
  const totalVat = items.reduce((sum, item) => sum + item.product.vatAmount * item.quantity, 0);
  const finalTotal = items.reduce((sum, item) => sum + item.product.finalNetPrice * item.quantity, 0);

  const formatEGP = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyItem = (item: QuotationItem) => {
    const textToCopy = `${item.product.description} (${item.product.reference}) [عدد ${item.quantity}] - السعر الصافي: ${formatEGP(item.product.finalNetPrice * item.quantity)} ج.م`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedItemRef(item.product.reference);
    setTimeout(() => setCopiedItemRef(null), 1800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('quotation-print-area');
    if (!element) return;

    try {
      // Add a temporary class to hide buttons during export
      element.classList.add('exporting-pdf');
      
      const filter = (node: HTMLElement) => {
        return node.getAttribute?.('data-html2canvas-ignore') !== 'true';
      };

      const imgData = await toPng(element, { 
        pixelRatio: 2,
        filter: filter as any,
        skipFonts: true
      });
      element.classList.remove('exporting-pdf');

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Schneider_Quotation.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      element.classList.remove('exporting-pdf');
      alert('حدث خطأ أثناء تصدير ملف PDF');
    }
  };

  const handleCopySummary = () => {
    const text = items.map((item, index) => {
      const extraTxt = item.product.extraDiscountRate && item.product.extraDiscountRate > 0
        ? ` + خصم إضافي ${(item.product.extraDiscountRate * 100).toFixed((item.product.extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}%`
        : '';
      return `${index + 1}. كود: ${item.product.reference} | ${item.product.description}\n   الكمية: ${item.quantity} | السعر الرسمي: ${item.product.listPrice.toFixed(2)} | الخصم: ${(item.product.discountRate * 100).toFixed((item.product.discountRate * 100) % 1 === 0 ? 0 : 1)}%${extraTxt} | الصافي بعد الخصم: ${item.product.priceBeforeVat.toFixed(2)} | الإجمالي الصافي (شامل 14%): ${(item.product.finalNetPrice * item.quantity).toFixed(2)} ج.م`;
    }).join('\n\n');

    const fullSummary = `=== عرض أسعار منتجات شنايدر إلكتريك ===\n\n${text}\n\n------------------------------------\nإجمالي قائمة الأسعار: ${totalListPrice.toFixed(2)} ج.م\nإجمالي الخصم الموفر: -${totalDiscountAmount.toFixed(2)} ج.م\nالصافي قبل الضريبة: ${totalPriceBeforeVat.toFixed(2)} ج.م\nضريبة القيمة المضافة 14%: +${totalVat.toFixed(2)} ج.م\nالإجمالي النهائي الصافي: ${finalTotal.toFixed(2)} ج.م\n====================================`;

    navigator.clipboard.writeText(fullSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-[#2c3e50] mb-2">قائمة المقايسة فارغة</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
          لم تقم بإضافة أي منتجات حتى الآن. ابحث عن المنتجات واضغط على زر "إضافة" لإنشاء عرض سعر فوري وشامل لجميع البنود مع الخصومات.
        </p>
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#3dcd58] hover:bg-[#32b84a] text-white shadow-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>تصفح المنتجات والأسعار</span>
        </button>
      </div>
    );
  }

  return (
    <div id="quotation-print-area" className="max-w-6xl mx-auto space-y-8 bg-gray-50 p-2 sm:p-6 rounded-3xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#2c3e50] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#3dcd58]" />
            <span>عرض أسعار ومقايسة شنايدر إلكتريك</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            إجمالي الأصناف: {items.length} صنف | إجمالي القطع: {items.reduce((s, i) => s + i.quantity, 0)} قطعة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap" data-html2canvas-ignore="true">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-gray-100 text-[#2c3e50] border border-gray-300 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#3dcd58]" /> : <Copy className="w-4 h-4 text-gray-600" />}
            <span>نسخ المقايسة</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2c3e50] hover:bg-[#1a2530] text-white transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-white" />
            <span>تصدير PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-gray-100 text-[#2c3e50] border border-gray-300 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>طباعة</span>
          </button>

          <button
            onClick={onClearCart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>إفراغ</span>
          </button>
        </div>
      </div>

      {/* Table of Items */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">الكود والوصف</th>
                <th className="p-4">السعر الرسمي</th>
                <th className="p-4">الخصم</th>
                <th className="p-4">السعر بعد الخصم</th>
                <th className="p-4">الكمية</th>
                <th className="p-4">الإجمالي الصافي</th>
                <th className="p-4 text-center" data-html2canvas-ignore="true">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <tr key={item.product.reference} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono-code text-gray-400 text-xs">{idx + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code font-bold text-[#3dcd58] bg-[#3dcd58]/10 border border-[#3dcd58]/30 px-2 py-0.5 rounded text-xs">
                        {item.product.reference}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">
                        ({item.product.categoryAr})
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 font-medium mt-1 max-w-sm">
                      {item.product.description}
                    </div>
                  </td>
                  <td className="p-4 font-mono-code text-gray-600 text-xs whitespace-nowrap">
                    {formatEGP(item.product.listPrice)} <span className="text-[10px] text-gray-400">ج.م</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-mono-code font-bold text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {(item.product.discountRate * 100).toFixed((item.product.discountRate * 100) % 1 === 0 ? 0 : 1)}%
                      </span>
                      {item.product.extraDiscountRate && item.product.extraDiscountRate > 0 ? (
                        <span className="font-mono-code font-bold text-[10px] text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
                          +{(item.product.extraDiscountRate * 100).toFixed((item.product.extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}% إضافي
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4 font-mono-code text-[#2fa946] font-bold text-xs whitespace-nowrap">
                    {formatEGP(item.product.priceBeforeVat)} <span className="text-[10px] text-gray-400">ج.م</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 w-fit">
                      <button
                        onClick={() => onUpdateQuantity(item.product.reference, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-code font-bold text-xs px-2 text-[#2c3e50]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.reference, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-mono-code font-bold text-sm text-[#2c3e50] whitespace-nowrap">
                    {formatEGP(item.product.finalNetPrice * item.quantity)} <span className="text-[10px] text-[#3dcd58] font-bold">ج.م</span>
                  </td>
                  <td className="p-4 text-center whitespace-nowrap" data-html2canvas-ignore="true">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleCopyItem(item)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          copiedItemRef === item.product.reference
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'text-gray-500 hover:text-[#2c3e50] hover:bg-gray-100 border-transparent hover:border-gray-200'
                        }`}
                        title="نسخ اسم المنتج والكمية والسعر الصافي"
                      >
                        {copiedItemRef === item.product.reference ? (
                          <Check className="w-4 h-4 text-[#3dcd58]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveItem(item.product.reference)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف من المقايسة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">ملاحظات العرض الرسمية</h4>
          <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside leading-relaxed font-medium">
            <li>الأسعار مستخرجة مباشرة من قائمة أسعار شنايدر إلكتريك الرسمية لعام 2026.</li>
            <li>نسب الخصم مطبقة بدقة وفقاً للفئات المعتمدة (Acti9 36%, Easy9 44%, TeSys 36%, CVS 46%, etc.).</li>
            <li>الأسعار الإجمالية تتضمن ضريبة القيمة المضافة القانونية (14% VAT).</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>إجمالي السعر الرسمي (قائمة الأسعار):</span>
            <span className="font-mono-code font-bold text-[#2c3e50] text-sm">{formatEGP(totalListPrice)} ج.م</span>
          </div>

          <div className="flex justify-between items-center text-xs text-red-600">
            <span>إجمالي قيمة الخصم الموفر:</span>
            <span className="font-mono-code font-bold text-red-600 text-sm">- {formatEGP(totalDiscountAmount)} ج.م</span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-700 border-t border-gray-100 pt-2 font-medium">
            <span>الصافي بعد الخصم (قبل الضريبة):</span>
            <span className="font-mono-code font-bold text-[#2fa946] text-sm">{formatEGP(totalPriceBeforeVat)} ج.م</span>
          </div>

          <div className="flex justify-between items-center text-xs text-teal-700">
            <span>ضريبة القيمة المضافة (14% VAT):</span>
            <span className="font-mono-code font-bold text-teal-700 text-sm">+ {formatEGP(totalVat)} ج.م</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#2c3e50] text-white rounded-xl shadow-xs mt-3">
            <div>
              <span className="text-xs font-bold text-white block">الإجمالي النهائي الصافي</span>
              <span className="text-[10px] text-gray-300">شامل الخصومات وضريبة 14%</span>
            </div>
            <span className="font-mono-code font-black text-2xl text-[#3dcd58]">
              {formatEGP(finalTotal)} <span className="text-xs font-normal text-white/80">ج.م</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

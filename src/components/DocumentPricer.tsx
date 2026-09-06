import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Check, AlertCircle, ShoppingCart, Loader2, X } from 'lucide-react';
import { CalculatedProduct, DocumentExtractedItem } from '../types';

interface DocumentPricerProps {
  onAddMultipleToCart: (items: { product: CalculatedProduct; quantity: number }[]) => void;
}

export const DocumentPricer: React.FC<DocumentPricerProps> = ({ onAddMultipleToCart }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DocumentExtractedItem[] | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setResults(null);
      
      if (selected.type.startsWith('image/')) {
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setError(null);
      setResults(null);
      
      if (dropped.type.startsWith('image/')) {
        const url = URL.createObjectURL(dropped);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/price-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMsg = `خطأ في الخادم (${response.status})`;
        try {
          const text = await response.text();
          const json = JSON.parse(text);
          if (json.message) errMsg = json.message;
        } catch (e) {
          if (response.status === 413) errMsg = 'حجم الملف أو الطلب كبير جداً.';
          else if (response.status === 504) errMsg = 'انتهى وقت الاتصال بالخادم (Timeout).';
          else if (response.status === 502) errMsg = 'البوابة غير متوفرة (Bad Gateway).';
        }
        setError(errMsg);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setResults(data.items);
      } else {
        setError(data.message || 'حدث خطأ أثناء معالجة المستند.');
      }
    } catch (err: any) {
      setError(`لا يمكن الاتصال بالخادم: ${err?.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!results) return;
    const validItems = results
      .filter((item) => item.matchedProduct)
      .map((item) => ({
        product: item.matchedProduct!,
        quantity: item.quantity || 1,
      }));

    if (validItems.length > 0) {
      onAddMultipleToCart(validItems);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-black text-[#2c3e50] mb-2">تسعير المقايسات الذكي</h2>
        <p className="text-gray-500 text-sm mb-6">
          قم برفع صورة أو ملف PDF أو مستند نصي للمقايسة، وسيقوم المساعد الذكي باستخراج المنتجات وتسعيرها من الكتالوج الرسمي مباشرة.
        </p>

        {/* Upload Area */}
        {!file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-emerald-50 hover:border-[#3dcd58] transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.txt,.csv"
            />
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
              <UploadCloud className="w-8 h-8 text-[#3dcd58]" />
            </div>
            <h3 className="text-base font-bold text-[#2c3e50] mb-1">اسحب وأفلت الملف هنا</h3>
            <p className="text-xs text-gray-500">أو اضغط لاختيار ملف من جهازك (صور، PDF، نصوص)</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow-sm" />
              ) : (
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-[#2c3e50] line-clamp-1">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFile(null); setResults(null); setError(null); }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="px-4 py-2 bg-[#3dcd58] hover:bg-[#32b84a] text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحليل...</span>
                  </>
                ) : (
                  <span>تحليل وتسعير</span>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Results Area */}
      {results && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2c3e50] flex items-center gap-2">
              <Check className="w-5 h-5 text-[#3dcd58]" />
              نتائج التسعير
            </h3>
            
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-[#2c3e50] hover:bg-[#1a2530] text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              إضافة الكل للمقايسة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">المنتج في المستند</th>
                  <th className="px-6 py-4 font-semibold">الكمية</th>
                  <th className="px-6 py-4 font-semibold">المنتج المطابق بالكود</th>
                  <th className="px-6 py-4 font-semibold">السعر الرسمي</th>
                  <th className="px-6 py-4 font-semibold">الخصم</th>
                  <th className="px-6 py-4 font-semibold">السعر النهائي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {item.originalText}
                    </td>
                    <td className="px-6 py-4 text-[#2c3e50] font-bold">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">
                      {item.matchedProduct ? (
                        <div>
                          <div className="text-[#3dcd58] font-bold font-mono-code text-xs">{item.matchedProduct.reference}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5" title={item.matchedProduct.description}>
                            {item.matchedProduct.description}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          لم يتم التعرف عليه
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.matchedProduct ? (
                         <span className="font-semibold text-gray-700">{item.matchedProduct.listPrice.toLocaleString('ar-EG')} ج.م</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {item.matchedProduct ? (
                         <span className="font-semibold text-[#2fa946] bg-emerald-50 px-2 py-0.5 rounded text-xs">{(item.matchedProduct.discountRate * 100).toFixed(0)}%</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {item.matchedProduct ? (
                         <div className="font-black text-[#2c3e50]">{item.matchedProduct.finalNetPrice.toLocaleString('ar-EG')} ج.م</div>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

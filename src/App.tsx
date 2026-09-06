import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS, ALL_CALCULATED_PRODUCTS, searchProducts } from './data/productCatalog';
import { calculateProductPrice } from './data/discountCalculator';
import { CalculatedProduct, QuotationItem } from './types';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { PriceBreakdownModal } from './components/PriceBreakdownModal';
import { QuotationCart } from './components/QuotationCart';
import { CustomCalculator } from './components/CustomCalculator';
import { DiscountRulesView } from './components/DiscountRulesView';
import { AiAssistant } from './components/AiAssistant';
import { DocumentPricer } from './components/DocumentPricer';
import { 
  Search, 
  Filter, 
  Sparkles, 
  X, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown,
  Percent,
  TrendingDown,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'chat' | 'quotation' | 'custom' | 'rules' | 'document'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [extraDiscountInput, setExtraDiscountInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFamily, setSelectedFamily] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount_desc'>('relevance');
  const [selectedProductForModal, setSelectedProductForModal] = useState<CalculatedProduct | null>(null);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(36);

  // Parse extra discount numeric rate
  const extraDiscountRate = useMemo(() => {
    const parsed = parseFloat(extraDiscountInput);
    if (isNaN(parsed) || parsed <= 0) return 0;
    return parsed / 100;
  }, [extraDiscountInput]);

  // Filter Categories
  const CATEGORIES = [
    { id: 'ALL', label: 'جميع المنتجات' },
    { id: 'PPFDN', label: 'قواطع Acti9 (iC60 / iK60)' },
    { id: 'PPEDN', label: 'قواطع Easy9' },
    { id: 'PPCTR', label: 'كونتاكتورات TeSys D & TVS' },
    { id: 'IDVSD', label: 'إنفرتر Altivar وسوفت ستارتر' },
    { id: 'PPCCB', label: 'قواطع ComPact NSX & CVS' },
    { id: 'PPACB', label: 'قواطع هواء Masterpact & MVS' },
    { id: 'IDSIG', label: 'أزرار ومفاتيح وريليهات ومؤقتات' },
    { id: 'IDMST', label: 'أجهزة تحكم Modicon & باور سبلاي' },
    { id: 'PPUES', label: 'لوحات صاج Spacial ومراوح' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let list: CalculatedProduct[] = [];

    if (!searchQuery.trim()) {
      if (extraDiscountRate > 0) {
        list = ALL_PRODUCTS.map((p) => calculateProductPrice(p, extraDiscountRate));
      } else {
        list = [...ALL_CALCULATED_PRODUCTS];
      }
    } else {
      list = searchProducts(searchQuery, 400, extraDiscountRate);
    }

    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.family === selectedCategory);
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.finalNetPrice - b.finalNetPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.finalNetPrice - a.finalNetPrice);
    } else if (sortBy === 'discount_desc') {
      list.sort((a, b) => {
        const rateA = a.totalEffectiveDiscountRate ?? a.discountRate;
        const rateB = b.totalEffectiveDiscountRate ?? b.discountRate;
        return rateB - rateA;
      });
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy, extraDiscountRate]);

  // Cart Management
  const handleAddToCart = (product: CalculatedProduct) => {
    setQuotationItems((prev) => {
      const existing = prev.find((item) => item.product.reference === product.reference);
      if (existing) {
        return prev.map((item) =>
          item.product.reference === product.reference
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleAddMultipleToCart = (items: { product: CalculatedProduct; quantity: number }[]) => {
    setQuotationItems((prev) => {
      const newCart = [...prev];
      items.forEach((itemToAdd) => {
        const existingIdx = newCart.findIndex((i) => i.product.reference === itemToAdd.product.reference);
        if (existingIdx >= 0) {
          newCart[existingIdx] = {
            ...newCart[existingIdx],
            quantity: newCart[existingIdx].quantity + itemToAdd.quantity,
          };
        } else {
          newCart.push(itemToAdd);
        }
      });
      return newCart;
    });
    setActiveTab('quotation');
  };

  const handleUpdateQuantity = (reference: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(reference);
      return;
    }
    setQuotationItems((prev) =>
      prev.map((item) =>
        item.product.reference === reference ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (reference: string) => {
    setQuotationItems((prev) => prev.filter((item) => item.product.reference !== reference));
  };

  const handleClearCart = () => {
    setQuotationItems([]);
  };

  const totalCartCount = quotationItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#2c3e50] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        totalProductsCount={ALL_CALCULATED_PRODUCTS.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Product Search & Pricing Catalog */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Header Banner */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-[#3dcd58]/40 text-[#2fa946] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دليل الأسعار الرسمي وشجرة الخصومات المعتمدة لشنايدر إلكتريك</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2c3e50] tracking-tight">
                  استعلم عن أسعار منتجات <span className="text-[#3dcd58]">شنايدر إلكتريك</span> وحساب الخصم الفوري
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  اكتب كود المنتج (Reference) أو الوصف الفني للحصول على السعر الرسمي، نسبة الخصم المعتمدة، السعر الصافي قبل الضريبة، والسعر النهائي شامل 14% ضريبة القيمة المضافة.
                </p>
              </div>

              {/* Main Search & Extra Discount Controls */}
              <div className="mt-6 space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                  {/* Main Search Input (9 cols on lg) */}
                  <div className="lg:col-span-8 relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setDisplayCount(36);
                      }}
                      placeholder="ابحث بالكود (مثال: A9F74116، LC1D09M7، ATV310HU15N4E) أو بالاسم (مثال: قاطع 16 امبير، كونتاكتور 18A)..."
                      className="w-full bg-gray-50/80 border-2 border-gray-200 hover:border-[#3dcd58]/60 focus:border-[#3dcd58] focus:bg-white focus:ring-4 focus:ring-[#3dcd58]/15 rounded-xl pl-12 pr-12 py-3.5 text-[#2c3e50] text-sm sm:text-base outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <Search className="w-6 h-6 text-[#3dcd58] absolute right-4 pointer-events-none" />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute left-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                        title="مسح البحث"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Extra Discount Input (4 cols on lg) */}
                  <div className="lg:col-span-4 bg-amber-50/80 border-2 border-amber-300/80 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200/50 rounded-xl px-3 py-2 flex items-center gap-2 transition-all">
                    <div className="flex items-center gap-1.5 text-amber-900 flex-shrink-0">
                      <Percent className="w-4 h-4 text-amber-600" />
                      <span className="text-xs sm:text-sm font-bold whitespace-nowrap">خصم إضافي:</span>
                    </div>

                    <div className="relative flex-1 flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        step="0.5"
                        value={extraDiscountInput}
                        onChange={(e) => {
                          setExtraDiscountInput(e.target.value);
                          setDisplayCount(36);
                        }}
                        placeholder="0 (مثال: 5)"
                        className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-lg px-2.5 py-1.5 text-sm font-mono-code font-bold text-amber-950 outline-none text-center"
                      />
                      <span className="text-xs font-bold text-amber-800 mr-1.5">%</span>
                    </div>

                    {extraDiscountInput && (
                      <button
                        onClick={() => setExtraDiscountInput('')}
                        className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-200/50 transition-colors"
                        title="إلغاء الخصم الإضافي"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Extra Discount Quick Presets & Status Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  {/* Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                      <span>خصم إضافي سريع فوق الليستة:</span>
                    </span>
                    {[
                      { label: 'بدون إضافي', val: '' },
                      { label: '+2%', val: '2' },
                      { label: '+3%', val: '3' },
                      { label: '+5%', val: '5' },
                      { label: '+7.5%', val: '7.5' },
                      { label: '+10%', val: '10' },
                      { label: '+15%', val: '15' },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        onClick={() => {
                          setExtraDiscountInput(preset.val);
                          setDisplayCount(36);
                        }}
                        className={`px-2 py-0.5 rounded-md text-xs font-mono-code font-bold transition-all ${
                          extraDiscountInput === preset.val
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Notice */}
                  {extraDiscountRate > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 font-medium">
                      <Check className="w-3.5 h-3.5 text-amber-700" />
                      <span>
                        يتم تطبيق خصم إضافي <strong>{(extraDiscountRate * 100).toFixed((extraDiscountRate * 100) % 1 === 0 ? 0 : 1)}%</strong> فوق خصم الليستة المعتمد لجميع النتائج.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tags Bar */}
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-gray-500 whitespace-nowrap font-bold">أكواد شائعة:</span>
                {[
                  'A9F74116',
                  'A9F74363',
                  'EZ9F34110',
                  'LC1D09M7',
                  'LC1D18M7',
                  'LC1E0910M7',
                  'ATV310HU15N4E',
                  'ATV320U15N4C',
                  'C10F3TM100',
                  'LV510307',
                  'GV2ME14',
                  'LRD14',
                  'RXM2AB2BD',
                  'XB4BA31',
                  'TM221C16R',
                  'NSYCRN43200',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#3dcd58] px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#3dcd58]/40 font-mono-code font-bold whitespace-nowrap transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills & Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setDisplayCount(36);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#3dcd58] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-600 hover:text-[#2c3e50] hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort & Stats */}
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  عُثر على <span className="font-bold text-[#3dcd58] font-mono-code">{filteredProducts.length}</span> منتج
                </span>

                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-[#2c3e50] font-semibold outline-none cursor-pointer"
                  >
                    <option value="relevance">ترتيب افتراضي</option>
                    <option value="price_asc">السعر: من الأقل للأعلى</option>
                    <option value="price_desc">السعر: من الأعلى للأقل</option>
                    <option value="discount_desc">نسبة الخصم: الأعلى</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.slice(0, displayCount).map((product) => (
                    <ProductCard
                      key={product.reference}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onInspect={(p) => setSelectedProductForModal(p)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {displayCount < filteredProducts.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 36)}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-[#3dcd58] hover:text-[#32b84a] border border-gray-200 hover:border-[#3dcd58] text-xs font-bold transition-all shadow-xs"
                    >
                      عرض المزيد من المنتجات ({filteredProducts.length - displayCount} متبقي)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e50]">لم يتم العثور على نتائج لـ "{searchQuery}"</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  تأكد من كتابة الكود بشكل صحيح (مثال: A9F74116 أو LC1D18M7) أو يمكنك استخدام الحاسبة اليدوية لحساب أي منتج وسعر مخصص.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    إعادة ضبط البحث
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#3dcd58] text-white hover:bg-[#32b84a]"
                  >
                    فتح الحاسبة اليدوية
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI & Smart Assistant */}
        {activeTab === 'chat' && (
          <AiAssistant
            onAddToCart={handleAddToCart}
            onInspect={(p) => setSelectedProductForModal(p)}
          />
        )}

        {/* Tab: Document Pricer */}
        {activeTab === 'document' && (
          <DocumentPricer onAddMultipleToCart={handleAddMultipleToCart} />
        )}

        {/* Tab 3: Quotation / BOQ Cart */}
        {activeTab === 'quotation' && (
          <QuotationCart
            items={quotationItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onBackToSearch={() => setActiveTab('search')}
          />
        )}

        {/* Tab 4: Custom Manual Calculator */}
        {activeTab === 'custom' && (
          <CustomCalculator onAddToCart={handleAddToCart} />
        )}

        {/* Tab 5: Official Discount Rules Table */}
        {activeTab === 'rules' && <DiscountRulesView />}
      </main>

      {/* Product Detail / Price Breakdown Modal */}
      <PriceBreakdownModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-5 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © ٢٠٢٤ نظام تسعير المنتجات المعتمد - Schneider Electric Partners
          </span>
          <span className="text-gray-400">
            قائمة الأسعار المعتمدة الرسمية
          </span>
        </div>
      </footer>
    </div>
  );
};
export default App;

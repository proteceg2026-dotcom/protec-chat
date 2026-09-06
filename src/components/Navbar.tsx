import React from 'react';
import { 
  Zap, 
  Search, 
  FileSpreadsheet, 
  Percent, 
  Bot, 
  Calculator,
  ShoppingCart
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'chat' | 'quotation' | 'custom' | 'rules';
  setActiveTab: (tab: 'search' | 'chat' | 'quotation' | 'custom' | 'rules') => void;
  cartCount: number;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  totalProductsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#3dcd58] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <div className="w-6 h-6 bg-[#3dcd58] rounded-md flex items-center justify-center text-white">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-xl text-white tracking-tight">
                  شنايدر إلكتريك
                </span>
                <span className="hidden sm:inline-block text-white/75 font-normal">|</span>
                <span className="hidden sm:inline-block text-white/90 text-sm font-bold">
                  قائمة الأسعار الذكية والخصومات
                </span>
                <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-md font-semibold backdrop-blur-xs">
                  2024
                </span>
              </div>
              <p className="text-[11px] text-white/80 hidden md:block">
                حساب فوري للأسعار الرسمية والخصومات الصافية وضريبة القيمة المضافة ({totalProductsCount}+ منتج)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              id="tab-search"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-white text-[#2c3e50] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">بحث واستعلام</span>
            </button>

            <button
              id="tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-[#2c3e50] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden md:inline">المساعد الذكي</span>
            </button>

            <button
              id="tab-quotation"
              onClick={() => setActiveTab('quotation')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'quotation'
                  ? 'bg-white text-[#2c3e50] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden md:inline">المقايسة</span>
              {cartCount > 0 && (
                <span className="bg-[#2c3e50] text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="tab-custom"
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-white text-[#2c3e50] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">حاسبة يدوية</span>
            </button>

            <button
              id="tab-rules"
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'rules'
                  ? 'bg-white text-[#2c3e50] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span className="hidden md:inline">نسب الخصم</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

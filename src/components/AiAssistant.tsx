import React, { useState, useRef, useEffect } from 'react';
import { CalculatedProduct, ChatMessage } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  Trash2,
  HelpCircle,
  Zap,
  Tag
} from 'lucide-react';

interface AiAssistantProps {
  onAddToCart: (product: CalculatedProduct) => void;
  onInspect: (product: CalculatedProduct) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onAddToCart, onInspect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'مرحباً بك! أنا مستشارك الذكي لتسعير منتجات شنايدر إلكتريك (Schneider Electric). يمكنك سؤالي عن أي كود منتج أو وصف فني (مثل: "سعر قاطع 63 امبير"، "سعر LC1D18M7"، "مغير سرعة 15 كيلو وات"). سأقوم بالبحث الفوري وتوفير السعر الرسمي، نسبة الخصم المعتمدة، السعر بعد الخصم، والسعر النهائي شامل ضريبة 14%.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsgId = 'u_' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: 'a_' + Date.now(),
          sender: 'assistant',
          text: data.answer || 'تمت معالجة الطلب بنجاح.',
          matchedProducts: data.matchedProducts || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'e_' + Date.now(),
          sender: 'assistant',
          text: 'عذراً، حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'e_' + Date.now(),
        sender: 'assistant',
        text: 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل التطبيق.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: 'تمت إعادة تعيين المحادثة. كيف يمكنني مساعدتك اليوم في أسعار شنايدر؟',
        timestamp: new Date(),
      },
    ]);
  };

  const quickPrompts = [
    'سعر قاطع 16 أمبير Acti9 أحادي ومزدوج وثلاثي',
    'كم سعر كونتاكتور 18A بوبينة 220V كود LC1D18M7 بعد الخصم؟',
    'أسعار إنفرتر ألتيفار 15 كيلو وات ATV310HD15N4E مع نسبة الخصم',
    'ما هي نسبة الخصم المعتمدة على قواطع Easy9 و TeSys؟',
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[750px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="bg-white p-4 px-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3dcd58]/10 border border-[#3dcd58]/30 flex items-center justify-center text-[#3dcd58]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2c3e50] flex items-center gap-2">
              <span>مستشار شنايدر الذكي للأسعار</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3dcd58] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3dcd58]"></span>
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              حساب فوري للخصم الصافي والضريبة وقائمة الأسعار الرسمية
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors text-xs flex items-center gap-1.5 font-bold"
          title="مسح المحادثة"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">مسح</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f4f7f6]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-start' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' ? (
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#3dcd58] flex-shrink-0 mt-1">
                <Zap className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}

            <div className="flex-1 max-w-2xl space-y-3">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#3dcd58] text-white rounded-tr-none font-medium shadow-xs'
                    : 'bg-white border border-gray-200 text-[#2c3e50] rounded-tl-none whitespace-pre-line shadow-xs font-medium'
                }`}
              >
                {msg.text}
              </div>

              {/* Attached matched products if any */}
              {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#2c3e50] block">
                    بطاقات المنتجات المطابقة ({msg.matchedProducts.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.matchedProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.reference}
                        product={p}
                        onAddToCart={onAddToCart}
                        onInspect={onInspect}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-gray-500 text-xs font-semibold">
            <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#3dcd58]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>جاري البحث في قائمة الأسعار وحساب الخصومات والضريبة...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-white p-3 border-t border-gray-200 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 whitespace-nowrap flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            اقتراحات:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#3dcd58] px-3 py-1 rounded-full border border-gray-200 hover:border-[#3dcd58]/40 whitespace-nowrap transition-all text-xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اسأل عن أي كود أو منتج أو استفسار عن الأسعار والخصومات..."
            className="flex-1 bg-gray-50/80 border border-gray-200 focus:border-[#3dcd58] focus:bg-white rounded-xl px-5 py-3.5 text-[#2c3e50] text-sm outline-none transition-all placeholder:text-gray-400 font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3.5 rounded-xl bg-[#3dcd58] hover:bg-[#32b84a] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-all"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

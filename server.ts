import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ALL_CALCULATED_PRODUCTS, searchProducts, getProductByReference } from './src/data/productCatalog';
import { calculateProductPrice } from './src/data/discountCalculator';
import { DISCOUNT_RULES_METADATA } from './src/data/discountCalculator';

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', totalProducts: ALL_CALCULATED_PRODUCTS.length });
  });

  // API 2: Product Search
  app.get('/api/products/search', (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const results = searchProducts(query, limit);
      res.json({ success: true, count: results.length, data: results });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Search failed' });
    }
  });

  // API 3: Get single product by exact reference
  app.get('/api/products/ref/:ref', (req, res) => {
    try {
      const ref = req.params.ref;
      const product = getProductByReference(ref);
      if (product) {
        res.json({ success: true, data: product });
      } else {
        res.status(404).json({ success: false, message: 'Product not found' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Lookup failed' });
    }
  });

  // API 4: Custom Price Calculator (for any reference + price)
  app.post('/api/calculate', (req, res) => {
    try {
      const { reference, price, description, family } = req.body;
      if (!reference || price === undefined) {
        return res.status(400).json({ success: false, message: 'Reference and price are required' });
      }
      const calculated = calculateProductPrice({
        reference: String(reference),
        price: Number(price),
        description: description ? String(description) : 'منتج مخصص',
        family: family ? String(family) : undefined,
      });
      res.json({ success: true, data: calculated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Calculation failed' });
    }
  });

  // API 5: Discount Rules metadata
  app.get('/api/discount-rules', (req, res) => {
    res.json({ success: true, rules: DISCOUNT_RULES_METADATA });
  });

  // API 6: Intelligent Assistant Chat (Query parsing with catalog matching + AI explanations)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      // Step 1: Search database for candidates
      const searchResults = searchProducts(message, 15);

      // Step 2: If Gemini API is configured, use it with grounded context for rich natural responses
      const gemini = getGeminiClient();
      let aiResponseText = '';

      if (gemini) {
        const catalogContext = searchResults.slice(0, 10).map(p => 
          `- الكود (Reference): ${p.reference} | الوصف: ${p.description} | الفئة: ${p.categoryAr} (${p.family}) | السعر الرسمي: ${p.listPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} ج.م | نسبة الخصم: ${(p.discountRate * 100).toFixed((p.discountRate * 100) % 1 === 0 ? 0 : 1)}% | السعر بعد الخصم (قبل الضريبة): ${p.priceBeforeVat.toLocaleString('en-US', { minimumFractionDigits: 2 })} ج.م | السعر النهائي شامل ضريبة القيمة المضافة 14%: ${p.finalNetPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} ج.م`
        ).join('\n');

        const systemPrompt = `أنت مساعد خبير ومستشار تسعير معتمد لمنتجات شنايدر إلكتريك (Schneider Electric) في مصر.
مهمتك:
1. الإجابة بدقة باللغة العربية على استفسارات العملاء عن المنتجات والأسعار والخصومات.
2. لكل منتج يطلبه العميل، وضح بوضوح وبشكل منظم:
   - كود المنتج (Reference)
   - الوصف الكامل للمنتج
   - السعر الرسمي في القائمة (List Price)
   - نسبة الخصم المطبقة بالضبط
   - السعر بعد تطبيق الخصم (قبل ضريبة القيمة المضافة)
   - السعر النهائي شامل ضريبة 14% (Net Final Price with VAT)
3. إذا طلب العميل منتجاً غير محدد بدقة، اعرض أمامه الخيارات الأكثر مطابقة مع أسعارها وخصوماتها.
4. استخدم نبرة مهنية ومساعدة وواضحة.

بيانات المنتجات المطابقة من قاعدة بيانات الأسعار الحالية:
${catalogContext || 'لم يتم العثور على تطابق مباشر بالكلمات، قدم نصائح عن الأكواد الشائعة مثل Acti9 (A9F..), EasyPact (EZ9F..), TeSys (LC1D..), Altivar (ATV..)'}

قواعد نسب الخصم المعتمدة المحدثة:
- جميع اللوحات والكبائن (Spacial, Thalassa, Pragma, Kaedra, Disbo, Easy9 Enclosures, NSY): خصم 32.5%
- قواطع ومكونات Acti9 iC60 / C120 / Compact NS>630A وأفياش PratiKa: خصم 34.5%
- قواطع Compact NSX ومفاتيح عزل INS وبوادل ATS NSX: خصم 36%
- قواطع هوائية MVS/NW/MTZ وقواطع مقولبة EasyPact CVS: خصم 40.5%
- قواطع ومكونات Resi9 و Easy9 (ثنائي وثلاثي): خصم 39%
- قواطع أحادية iK60 (10A إلى 40A): صافي محدد 182 ج.م شامل الضريبة
- قواطع أحادية Resi9 (10A إلى 40A): صافي محدد 175 ج.م شامل الضريبة
- قواطع Acti9 iK60 (ثنائي وثلاثي و50A/63A): خصم 30%
- قواطع GoPact MCCB وبوادل GoMTS: خصم 32.5%
- كونتاكتورات وقواطع محركات وأوفرلود TeSys D / GV2 / GV3 / TVS وحمايات EOCR: خصم 48%
- كونتاكتورات TeSys Giga الحديثة: خصم 45%
- أزرار إشارة وريليهات ومؤقتات صناعية Harmony & Zelio: خصم 45%
- إنفرترات ومغيرات سرعة وسوفت ستارتر Altivar & ATS: خصم 45%
- أنظمة تحكم Modicon PLC وشاشات HMI وباور سبلاي: خصم 45%
- كونتاكتورات المكثفات لتحسين معامل القدرة: خصم 27%
- عدادات الطاقة ومكثفات PowerLogic: خصم 24%
- وشوش ومفاتيح وبرايز New Unica: خصم 20%
- ضريبة القيمة المضافة المطبقة في مصر: 14%`;

        try {
          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nسؤال العميل: ${message}` }]
              }
            ],
          });
          aiResponseText = response.text || '';
        } catch (apiErr: any) {
          console.error('Gemini API call failed, falling back to rule response:', apiErr?.message);
        }
      }

      // Fallback if no gemini key or gemini error: build rich rule-based Arabic response
      if (!aiResponseText) {
        if (searchResults.length > 0) {
          const top = searchResults[0];
          aiResponseText = `تم العثور على منتجات مطابقة لطلبك:\n\n**${top.description}**\n- **كود المنتج (Reference):** \`${top.reference}\`\n- **الفئة:** ${top.categoryAr} (${top.family})\n- **السعر الرسمي (قائمة الأسعار):** ${top.listPrice.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م\n- **نسبة الخصم:** ${(top.discountRate * 100).toFixed(0)}%\n- **السعر بعد الخصم (قبل الضريبة):** ${top.priceBeforeVat.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م\n- **السعر النهائي (شامل ضريبة 14%):** ${top.finalNetPrice.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`;
          if (searchResults.length > 1) {
            aiResponseText += `\n\nتوجد أيضاً ${searchResults.length - 1} نتائج أخرى مطابقة معروضة في قائمة المنتجات أدناه.`;
          }
        } else {
          aiResponseText = `لم يتم العثور على منتج مطابق بدقة لـ "${message}". يمكنك البحث برقم الكود (مثال: A9F74116 أو LC1D09M7 أو ATV310HU15N4E) أو بالوصف الفني (مثال: قاطع 16 امبير أو كونتاكتور 18A أو انفرتر 1.5 كيلو).`;
        }
      }

      res.json({
        success: true,
        answer: aiResponseText,
        matchedProducts: searchResults,
      });
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      res.status(500).json({ success: false, error: err?.message || 'Chat error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Schneider Electric Price & Discount Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

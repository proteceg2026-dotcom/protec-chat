import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
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

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

  // API: Document Pricing
  app.post('/api/price-document', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const gemini = getGeminiClient();
      if (!gemini) {
        return res.status(500).json({ success: false, message: 'Gemini API Key is not configured' });
      }

      const mimeType = req.file.mimetype;
      const base64Data = req.file.buffer.toString('base64');

      const miniCatalog = ALL_CALCULATED_PRODUCTS.map(p => `${p.reference}|${p.description}`).join('\n');
      const systemPrompt = `أنت مهندس تسعير ومستشار فني لمنتجات شنايدر إلكتريك.
مرفق لك مستند (صورة أو نص) يحتوي على مقايسة أو طلبية.
مهمتك:
1. استخراج المنتجات المطلوبة والكميات.
2. البحث في "الكتالوج المرفق" أدناه عن أقرب كود (Reference) يطابق المواصفات الفنية المكتوبة. استخدم خبرتك لربط المواصفات بالاكواد.
3. إذا لم تجد منتجاً مطابقاً، ضع reference: null.

النتيجة يجب أن تكون مصفوفة JSON فقط بالشكل التالي:
[
  { "originalText": "اسم المنتج كما ورد في المستند", "reference": "كود المنتج من الكتالوج أو null", "quantity": 1 }
]
يمنع كتابة أي نص إضافي أو شروحات. فقط الـ JSON Array.

الكتالوج (Reference|Description):
${miniCatalog}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { inlineData: { data: base64Data, mimeType } }
            ]
          }
        ]
      });

      let aiText = response.text || '';
      aiText = aiText.replace(/```json/gi, '').replace(/```/gi, '').trim();

      try {
        const extractedItems = JSON.parse(aiText);
        
        const results = extractedItems.map((item: any) => {
           let matchedProduct = null;
           
           if (item.reference) {
             matchedProduct = getProductByReference(item.reference);
           }
           
           // Fallback to strict search if AI couldn't find a reference
           if (!matchedProduct && item.originalText && typeof item.originalText === 'string') {
             const searchResults = searchProducts(item.originalText, 1);
             if (searchResults && searchResults.length > 0) {
               matchedProduct = searchResults[0];
             }
           }

           return {
             originalText: item.originalText,
             reference: matchedProduct?.reference || item.reference || null,
             quantity: item.quantity || 1,
             matchedProduct
           };
        });

        res.json({ success: true, items: results });
      } catch (parseErr) {
        console.error('JSON Parse error from Gemini:', aiText);
        res.status(500).json({ success: false, message: 'فشل في تحليل الرد من المساعد الذكي. الرجاء المحاولة مرة أخرى بصورة أوضح.' });
      }

    } catch (err: any) {
      console.error('Document pricing error:', err);
      res.status(500).json({ success: false, message: err?.message || 'Error processing document' });
    }
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

  // API 6: Intelligent Assistant Chat (Native Thinking with Full Catalog Context)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      const gemini = getGeminiClient();
      let aiResponseText = '';

      if (gemini) {
        // Build a highly compressed version of the ENTIRE catalog to feed into Gemini's context window
        // Format: REF | DESC | PRICE_EGP | DISCOUNT_RATE | FINAL_NET_EGP
        const fullCatalogContext = ALL_CALCULATED_PRODUCTS.map(p => 
          `${p.reference}|${p.description}|${p.family}|${p.listPrice}|${(p.discountRate*100).toFixed(1)}%|${p.finalNetPrice.toFixed(0)}`
        ).join('\n');

        const systemPrompt = `أنت مساعد خبير ومستشار تسعير معتمد لمنتجات شنايدر إلكتريك (Schneider Electric) في مصر.
أنت تتمتع بقدرة على التفكير والاستنتاج. العميل قد يستخدم مصطلحات عامية (مثل: مفتاح، فاز، امبير، كونتاكتور، انفرتر).
عليك استنتاج ما يقصده العميل، والبحث في قاعدة البيانات الكاملة المرفقة أدناه للعثور على أقرب المنتجات المطابقة.

قاعدة البيانات المرفقة تحتوي على جميع منتجاتنا بالصيغة التالية (مفصولة بعلامة |):
الكود | الوصف الفني | العائلة | السعر الرسمي | نسبة الخصم | السعر النهائي بعد الخصم والضريبة

بيانات الكتالوج بالكامل:
${fullCatalogContext}

مهمتك:
1. استنتج طلب العميل وابحث في الكتالوج المرفق في هذا النص عن أفضل وأقرب المنتجات (مثلاً "مفتاح 10 امبير" قد يعني قاطع iC60N أو iK60N أو Easy9 10A).
2. اعرض للعميل الخيارات المناسبة بشكل منظم جداً.
3. لكل منتج تقترحه، وضح بوضوح:
   - كود المنتج (Reference)
   - الوصف الكامل
   - السعر الرسمي (List Price)
   - السعر النهائي شامل الضريبة 14% (وهو الرقم الأخير في كل سطر في البيانات المرفقة).
4. إذا لم تجد منتجاً مطابقاً بنسبة 100%، اقترح أقرب المنتجات المتاحة واشرح للعميل استنتاجك.
5. تحدث بأسلوب مهني وواضح باللغة العربية.`;

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

      // Fallback if no gemini key or gemini error
      if (!aiResponseText) {
        // Fallback to basic search if Gemini fails
        const searchResults = searchProducts(message, 5);
        if (searchResults.length > 0) {
          const top = searchResults[0];
          aiResponseText = `تم العثور على منتجات مطابقة لطلبك:\n\n**${top.description}**\n- **كود المنتج (Reference):** \`${top.reference}\`\n- **السعر النهائي (شامل ضريبة 14%):** ${top.finalNetPrice.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`;
        } else {
          aiResponseText = `عذراً، لم أتمكن من العثور على طلبك بدقة ولا يمكنني الوصول لمحرك التفكير الذكي حالياً. يرجى البحث بالكود (Reference) تحديداً.`;
        }
      }

      res.json({
        success: true,
        answer: aiResponseText
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

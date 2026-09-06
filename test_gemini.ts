import { GoogleGenAI } from '@google/genai';
import { ALL_CALCULATED_PRODUCTS } from './src/data/productCatalog.js';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const fullCatalogContext = ALL_CALCULATED_PRODUCTS.map(p => 
    `${p.reference}|${p.description}|${p.listPrice}|${p.finalNetPrice.toFixed(0)}`
  ).join('\n');
  const systemPrompt = `أنت مساعد تسعير. إليك البيانات:\n${fullCatalogContext}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{role: 'user', parts: [{text: `${systemPrompt}\n\nابحث عن مفتاح 10 امبير`}]}] });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();

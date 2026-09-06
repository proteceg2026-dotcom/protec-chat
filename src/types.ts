export type ProductFamily =
  | 'DPLVP'
  | 'HDCFD'
  | 'HDCWD'
  | 'HDSPE'
  | 'IDHMI'
  | 'IDIBS'
  | 'IDMST'
  | 'IDPAC'
  | 'IDSIG'
  | 'IDVSD'
  | 'PPACB'
  | 'PPATS'
  | 'PPCCB'
  | 'PPCTR'
  | 'PPLVS'
  | 'PPUES'
  | 'PPFDN'
  | 'PPEDN'
  | 'CUSTOM';

export interface ProductItem {
  reference: string;
  description: string;
  family: ProductFamily | string;
  price: number; // Official list price in EGP (before discount)
  notes?: string;
  categoryAr?: string;
  categoryEn?: string;
}

export interface CalculatedProduct extends ProductItem {
  listPrice: number; // Official list price
  discountRate: number; // e.g. 0.48 for 48% (standard base discount)
  discountPercentage: number; // e.g. 48
  discountAmount: number; // price * discountRate
  priceBeforeVat: number; // price after discounts (before VAT)
  priceAfterDiscount: number; // Same as priceBeforeVat
  vatRate: number; // 0.14
  vatAmount: number; // priceBeforeVat * 0.14
  finalNetPrice: number; // priceBeforeVat + vatAmount
  priceWithVat: number; // Same as finalNetPrice
  discountCategory: string; // Arabic name of the discount category
  categoryAr: string; // Arabic category name
  categoryEn: string; // English category name
  isNetPrice?: boolean; // If item has fixed net price
  netPriceOverride?: number; // Fixed net price if specified
  extraDiscountRate?: number; // e.g. 0.05 for 5% extra discount
  extraDiscountAmount?: number; // amount deducted by extra discount
  totalEffectiveDiscountRate?: number; // combined effective discount rate
}

export interface QuotationItem {
  product: CalculatedProduct;
  quantity: number;
  customDiscountRate?: number;
  notes?: string;
}

export interface DiscountRule {
  id: string;
  family: string;
  categoryName: string;
  nameAr: string;
  nameEn: string;
  arabicGroup: string;
  discountRate: number;
  description: string;
  examples: string | string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string | Date;
  matchedProducts?: CalculatedProduct[];
  suggestedProducts?: CalculatedProduct[];
}

export interface DocumentExtractedItem {
  originalText: string;
  quantity: number;
  matchedProduct: CalculatedProduct | null;
}

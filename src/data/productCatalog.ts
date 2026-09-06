import { ProductItem, CalculatedProduct } from '../types';
import { PRODUCTS_PART_1 } from './productsPart1';
import { PRODUCTS_PART_2 } from './productsPart2';
import { PRODUCTS_PART_3 } from './productsPart3';
import { PRODUCTS_PART_4 } from './productsPart4';
import { PRODUCTS_PART_5 } from './productsPart5';
import { PRODUCTS_PART_6 } from './productsPart6';
import { PRODUCTS_PART_7 } from './productsPart7';
import { PRODUCTS_PART_8 } from './productsPart8';
import { PRODUCTS_PART_9 } from './productsPart9';
import { PRODUCTS_PART_10 } from './productsPart10';
import { PRODUCTS_PART_11 } from './productsPart11';
import { PRODUCTS_PART_12 } from './productsPart12';
import { PRODUCTS_PART_13 } from './productsPart13';
import { PRODUCTS_PART_14 } from './productsPart14';
import { calculateProductPrice } from './discountCalculator';

// Combine all parts
export const ALL_PRODUCTS: ProductItem[] = [
  ...PRODUCTS_PART_1,
  ...PRODUCTS_PART_2,
  ...PRODUCTS_PART_3,
  ...PRODUCTS_PART_4,
  ...PRODUCTS_PART_5,
  ...PRODUCTS_PART_6,
  ...PRODUCTS_PART_7,
  ...PRODUCTS_PART_8,
  ...PRODUCTS_PART_9,
  ...PRODUCTS_PART_10,
  ...PRODUCTS_PART_11,
  ...PRODUCTS_PART_12,
  ...PRODUCTS_PART_13,
  ...PRODUCTS_PART_14,
];

// Cache of calculated products for lightning-fast search
export const ALL_CALCULATED_PRODUCTS: CalculatedProduct[] = ALL_PRODUCTS.map((p) =>
  calculateProductPrice(p)
);

/**
 * Search products by Reference code or Description or Family, with optional extra discount rate
 */
export function searchProducts(query: string, limit = 50, extraDiscountRate = 0): CalculatedProduct[] {
  if (!query || query.trim() === '') {
    const rawList = ALL_PRODUCTS.slice(0, limit);
    return extraDiscountRate > 0
      ? rawList.map((p) => calculateProductPrice(p, extraDiscountRate))
      : ALL_CALCULATED_PRODUCTS.slice(0, limit);
  }

  const cleanQuery = query.trim().toLowerCase();
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  const matchedRaw = ALL_PRODUCTS.filter((item) => {
    const refMatch = item.reference.toLowerCase();
    const descMatch = item.description.toLowerCase();
    const catMatch = (item.categoryAr || '').toLowerCase() + ' ' + (item.categoryEn || '').toLowerCase();
    const famMatch = (item.family || '').toLowerCase();

    // Must match all query tokens
    return tokens.every(
      (token) =>
        refMatch.includes(token) ||
        descMatch.includes(token) ||
        catMatch.includes(token) ||
        famMatch.includes(token)
    );
  });

  // Prioritize exact reference match, then startsWith reference
  matchedRaw.sort((a, b) => {
    const aRef = a.reference.toLowerCase();
    const bRef = b.reference.toLowerCase();

    if (aRef === cleanQuery) return -1;
    if (bRef === cleanQuery) return 1;

    if (aRef.startsWith(cleanQuery) && !bRef.startsWith(cleanQuery)) return -1;
    if (bRef.startsWith(cleanQuery) && !aRef.startsWith(cleanQuery)) return 1;

    return 0;
  });

  const sliced = matchedRaw.slice(0, limit);
  return sliced.map((p) => calculateProductPrice(p, extraDiscountRate));
}

/**
 * Exact match by reference code or fallback to calculate on-the-fly
 */
export function getProductByReference(reference: string, extraDiscountRate = 0): CalculatedProduct | null {
  const cleanRef = reference.trim().toUpperCase();
  const found = ALL_PRODUCTS.find(
    (p) => p.reference.toUpperCase() === cleanRef
  );
  if (!found) return null;
  return calculateProductPrice(found, extraDiscountRate);
}

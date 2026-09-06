import { ALL_CALCULATED_PRODUCTS } from './src/data/productCatalog.js';
const str = ALL_CALCULATED_PRODUCTS.map(p => `${p.reference} | ${p.description} | ${p.family} | ${(p.discountRate*100).toFixed(1)}% | ${p.finalNetPrice.toFixed(0)} EGP`).join('\n');
console.log(str.length);

import { create } from 'zustand';
import { DEFAULT_PRICES } from '../utils/constants';

const loadPrices = () => {
  try {
    const saved = localStorage.getItem('electripro-prices');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return DEFAULT_PRICES.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
};

const savePrices = (prices) => {
  try {
    localStorage.setItem('electripro-prices', JSON.stringify(prices));
  } catch (e) { /* ignore */ }
};

export const usePriceStore = create((set, get) => ({
  prices: loadPrices(),

  updatePrice: (code, updates) => {
    const prices = get().prices.map((p) =>
      p.code === code ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    savePrices(prices);
    set({ prices });
  },

  addPrice: (item) => {
    const prices = [...get().prices, { ...item, updatedAt: new Date().toISOString() }];
    savePrices(prices);
    set({ prices });
  },

  deletePrice: (code) => {
    const prices = get().prices.filter((p) => p.code !== code);
    savePrices(prices);
    set({ prices });
  },

  getByCode: (code) => {
    return get().prices.find((p) => p.code === code);
  },

  getByCategory: (categoryId) => {
    return get().prices.filter((p) => p.category === categoryId);
  },

  resetToDefaults: () => {
    const prices = DEFAULT_PRICES.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
    savePrices(prices);
    set({ prices });
  },
}));

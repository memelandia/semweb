import { create } from 'zustand';
import { DEFAULT_PRICES } from '../utils/constants';
import { saveToCloud, loadFromCloud, upsertItemToCloud, deleteFromCloud } from '../lib/syncManager';

const TABLE = 'prices';
const LOCAL_KEY = 'electripro-prices';

const getLocalPrices = () => {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return DEFAULT_PRICES.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
};

export const usePriceStore = create((set, get) => ({
  prices: getLocalPrices(),
  loaded: false,

  loadPrices: async () => {
    const data = await loadFromCloud(TABLE, LOCAL_KEY);
    if (data && data.length > 0) {
      set({ prices: data, loaded: true });
    } else {
      const defaults = DEFAULT_PRICES.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
      await saveToCloud(TABLE, LOCAL_KEY, defaults);
      set({ prices: defaults, loaded: true });
    }
  },

  updatePrice: (code, updates) => {
    const prices = get().prices.map((p) =>
      p.code === code ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    set({ prices });
    const updated = prices.find((p) => p.code === code);
    if (updated) upsertItemToCloud(TABLE, LOCAL_KEY, updated, 'code');
  },

  addPrice: (item) => {
    const newItem = { ...item, updatedAt: new Date().toISOString() };
    const prices = [...get().prices, newItem];
    set({ prices });
    upsertItemToCloud(TABLE, LOCAL_KEY, newItem, 'code');
  },

  deletePrice: (code) => {
    const prices = get().prices.filter((p) => p.code !== code);
    set({ prices });
    deleteFromCloud(TABLE, LOCAL_KEY, code);
  },

  getByCode: (code) => get().prices.find((p) => p.code === code),
  getByCategory: (categoryId) => get().prices.filter((p) => p.category === categoryId),

  resetToDefaults: () => {
    const prices = DEFAULT_PRICES.map((p) => ({ ...p, updatedAt: new Date().toISOString() }));
    set({ prices });
    saveToCloud(TABLE, LOCAL_KEY, prices);
  },
}));

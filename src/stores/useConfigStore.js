import { create } from 'zustand';
import { DEFAULT_CONFIG } from '../utils/constants';

const STORAGE_KEY = 'electripro-config';

const loadConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch (e) { /* ignore */ }
  return { ...DEFAULT_CONFIG };
};

const saveConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) { /* ignore */ }
};

export const useConfigStore = create((set, get) => ({
  config: loadConfig(),

  updateConfig: (updates) => {
    const config = { ...get().config, ...updates };
    saveConfig(config);
    set({ config });
  },

  resetConfig: () => {
    saveConfig(DEFAULT_CONFIG);
    set({ config: { ...DEFAULT_CONFIG } });
  },

  exportData: () => {
    const data = {
      config: get().config,
      prices: JSON.parse(localStorage.getItem('electripro-prices') || '[]'),
      budgets: JSON.parse(localStorage.getItem('electripro-budgets') || '[]'),
      obras: JSON.parse(localStorage.getItem('electripro-obras') || '[]'),
      conteos: JSON.parse(localStorage.getItem('electripro-conteos') || '[]'),
      plans: JSON.parse(localStorage.getItem('electripro-plans') || '[]'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electripro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.config) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data.config)); }
      if (data.prices) { localStorage.setItem('electripro-prices', JSON.stringify(data.prices)); }
      if (data.budgets) { localStorage.setItem('electripro-budgets', JSON.stringify(data.budgets)); }
      if (data.obras) { localStorage.setItem('electripro-obras', JSON.stringify(data.obras)); }
      if (data.conteos) { localStorage.setItem('electripro-conteos', JSON.stringify(data.conteos)); }
      if (data.plans) { localStorage.setItem('electripro-plans', JSON.stringify(data.plans)); }
      window.location.reload();
      return true;
    } catch (e) {
      return false;
    }
  },
}));

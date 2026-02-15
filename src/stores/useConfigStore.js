import { create } from 'zustand';
import { loadConfigFromCloud, saveConfigToCloud } from '../lib/syncManager';

const LOCAL_KEY = 'electripro-config';

const defaultConfig = {
  businessName: 'ElectriPro',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  logo: null,
  currency: 'ARS',
  iva: 21,
  marginDefault: 30,
  theme: 'dark',
};

const getLocalConfig = () => {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...defaultConfig };
};

export const useConfigStore = create((set, get) => ({
  config: getLocalConfig(),
  loaded: false,

  loadConfig: async () => {
    const data = await loadConfigFromCloud(LOCAL_KEY);
    if (data) {
      set({ config: { ...defaultConfig, ...data }, loaded: true });
    } else {
      await saveConfigToCloud(LOCAL_KEY, get().config);
      set({ loaded: true });
    }
  },

  updateConfig: (updates) => {
    const config = { ...get().config, ...updates };
    set({ config });
    saveConfigToCloud(LOCAL_KEY, config);
  },

  resetConfig: () => {
    set({ config: { ...defaultConfig } });
    saveConfigToCloud(LOCAL_KEY, defaultConfig);
  },

  exportData: () => {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('electripro-')) {
          data[key] = JSON.parse(localStorage.getItem(key));
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `electripro-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  },

  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('electripro-')) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      window.location.reload();
      return true;
    } catch {
      return false;
    }
  },
}));

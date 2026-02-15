import { create } from 'zustand';
import { saveToCloud, loadFromCloud, upsertItemToCloud, deleteFromCloud } from '../lib/syncManager';
import { generateId, getNextNumber } from '../utils/formatters';

const TABLE = 'obras';
const LOCAL_KEY = 'electripro-obras';

const getLocalObras = () => {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
};

export const useObraStore = create((set, get) => ({
  obras: getLocalObras(),
  loaded: false,

  loadObras: async () => {
    const data = await loadFromCloud(TABLE, LOCAL_KEY);
    set({ obras: data || [], loaded: true });
  },

  createObra: (obraData) => {
    const obras = get().obras;
    const number = getNextNumber(obras, 'OBRA');
    const newObra = {
      id: generateId('obra'),
      number,
      ...obraData,
      status: obraData.status || 'pendiente',
      tasks: obraData.tasks || [],
      notes: obraData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...obras, newObra];
    set({ obras: updated });
    upsertItemToCloud(TABLE, LOCAL_KEY, newObra);
    return newObra;
  },

  updateObra: (id, updates) => {
    const obras = get().obras.map((o) =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    );
    set({ obras });
    const updated = obras.find((o) => o.id === id);
    if (updated) upsertItemToCloud(TABLE, LOCAL_KEY, updated);
  },

  deleteObra: (id) => {
    const obras = get().obras.filter((o) => o.id !== id);
    set({ obras });
    deleteFromCloud(TABLE, LOCAL_KEY, id);
  },

  getObraById: (id) => get().obras.find((o) => o.id === id),
}));

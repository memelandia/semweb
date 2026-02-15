import { create } from 'zustand';
import { generateId, getToday } from '../utils/formatters';

const STORAGE_KEY = 'electripro-obras';

const loadObras = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return [];
};

const saveObras = (obras) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obras));
  } catch (e) { /* ignore */ }
};

const getNextNumber = (obras) => {
  if (obras.length === 0) return 1;
  return Math.max(...obras.map((o) => o.number || 0)) + 1;
};

export const useObraStore = create((set, get) => ({
  obras: loadObras(),

  createObra: (data = {}) => {
    const obras = get().obras;
    const newObra = {
      id: generateId('obra'),
      number: getNextNumber(obras),
      client: '',
      address: '',
      startDate: getToday(),
      endDate: '',
      totalPoints: 0,
      budgetAmount: 0,
      collectedAmount: 0,
      status: 'presupuestada',
      presupuestoId: '',
      conteoId: '',
      planificacionId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    const updated = [...obras, newObra];
    saveObras(updated);
    set({ obras: updated });
    return newObra;
  },

  updateObra: (id, updates) => {
    const obras = get().obras.map((o) =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    );
    saveObras(obras);
    set({ obras });
  },

  deleteObra: (id) => {
    const obras = get().obras.filter((o) => o.id !== id);
    saveObras(obras);
    set({ obras });
  },

  getObraById: (id) => {
    return get().obras.find((o) => o.id === id);
  },
}));

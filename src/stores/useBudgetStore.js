import { create } from 'zustand';
import { generateId, getToday } from '../utils/formatters';

const STORAGE_KEY = 'electripro-budgets';

const loadBudgets = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return [];
};

const saveBudgets = (budgets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  } catch (e) { /* ignore */ }
};

const getNextNumber = (budgets) => {
  if (budgets.length === 0) return 1;
  return Math.max(...budgets.map((b) => b.number || 0)) + 1;
};

export const useBudgetStore = create((set, get) => ({
  budgets: loadBudgets(),

  createBudget: (data = {}) => {
    const budgets = get().budgets;
    const newBudget = {
      id: generateId('pres'),
      number: getNextNumber(budgets),
      date: getToday(),
      validity: '15 días',
      client: { name: '', address: '', phone: '', email: '' },
      items: [],
      iva: 21,
      status: 'borrador',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    const updated = [...budgets, newBudget];
    saveBudgets(updated);
    set({ budgets: updated });
    return newBudget;
  },

  updateBudget: (id, updates) => {
    const budgets = get().budgets.map((b) =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    saveBudgets(budgets);
    set({ budgets });
  },

  deleteBudget: (id) => {
    const budgets = get().budgets.filter((b) => b.id !== id);
    saveBudgets(budgets);
    set({ budgets });
  },

  duplicateBudget: (id) => {
    const original = get().budgets.find((b) => b.id === id);
    if (!original) return null;
    const budgets = get().budgets;
    const dup = {
      ...original,
      id: generateId('pres'),
      number: getNextNumber(budgets),
      date: getToday(),
      status: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...budgets, dup];
    saveBudgets(updated);
    set({ budgets: updated });
    return dup;
  },

  getBudgetById: (id) => {
    return get().budgets.find((b) => b.id === id);
  },
}));

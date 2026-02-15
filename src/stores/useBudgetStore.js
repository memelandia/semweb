import { create } from 'zustand';
import { saveToCloud, loadFromCloud, upsertItemToCloud, deleteFromCloud } from '../lib/syncManager';
import { generateId, getNextNumber } from '../utils/formatters';

const TABLE = 'budgets';
const LOCAL_KEY = 'electripro-budgets';

const getLocalBudgets = () => {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
};

export const useBudgetStore = create((set, get) => ({
  budgets: getLocalBudgets(),
  loaded: false,

  loadBudgets: async () => {
    const data = await loadFromCloud(TABLE, LOCAL_KEY);
    set({ budgets: data || [], loaded: true });
  },

  createBudget: (budgetData) => {
    const budgets = get().budgets;
    const number = getNextNumber(budgets, 'PRES');
    const newBudget = {
      id: generateId('pres'),
      number,
      ...budgetData,
      items: budgetData.items || [],
      status: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...budgets, newBudget];
    set({ budgets: updated });
    upsertItemToCloud(TABLE, LOCAL_KEY, newBudget);
    return newBudget;
  },

  updateBudget: (id, updates) => {
    const budgets = get().budgets.map((b) =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    set({ budgets });
    const updated = budgets.find((b) => b.id === id);
    if (updated) upsertItemToCloud(TABLE, LOCAL_KEY, updated);
  },

  deleteBudget: (id) => {
    const budgets = get().budgets.filter((b) => b.id !== id);
    set({ budgets });
    deleteFromCloud(TABLE, LOCAL_KEY, id);
  },

  duplicateBudget: (id) => {
    const original = get().budgets.find((b) => b.id === id);
    if (!original) return null;
    const budgets = get().budgets;
    const number = getNextNumber(budgets, 'PRES');
    const duplicate = {
      ...original,
      id: generateId('pres'),
      number,
      status: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: { ...original.client, name: `${original.client?.name || ''} (copia)` },
    };
    const updated = [...budgets, duplicate];
    set({ budgets: updated });
    upsertItemToCloud(TABLE, LOCAL_KEY, duplicate);
    return duplicate;
  },

  getBudgetById: (id) => get().budgets.find((b) => b.id === id),
}));

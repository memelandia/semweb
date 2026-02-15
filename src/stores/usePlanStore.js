import { create } from 'zustand';
import { saveToCloud, loadFromCloud, upsertItemToCloud, deleteFromCloud } from '../lib/syncManager';
import { generateId } from '../utils/formatters';

/* ───── Conteo Store ───── */
const CONTEO_TABLE = 'conteos';
const CONTEO_KEY = 'electripro-conteos';

const getLocalConteos = () => {
  try {
    const saved = localStorage.getItem(CONTEO_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
};

export const useConteoStore = create((set, get) => ({
  conteos: getLocalConteos(),
  loaded: false,

  loadConteos: async () => {
    const data = await loadFromCloud(CONTEO_TABLE, CONTEO_KEY);
    set({ conteos: data || [], loaded: true });
  },

  createConteo: (conteoData) => {
    const newConteo = {
      id: generateId('cont'),
      ...conteoData,
      rooms: conteoData.rooms || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...get().conteos, newConteo];
    set({ conteos: updated });
    upsertItemToCloud(CONTEO_TABLE, CONTEO_KEY, newConteo);
    return newConteo;
  },

  updateConteo: (id, updates) => {
    const conteos = get().conteos.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    set({ conteos });
    const updated = conteos.find((c) => c.id === id);
    if (updated) upsertItemToCloud(CONTEO_TABLE, CONTEO_KEY, updated);
  },

  updateRoom: (conteoId, roomIndex, roomData) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      const rooms = [...c.rooms];
      rooms[roomIndex] = { ...rooms[roomIndex], ...roomData };
      return { ...c, rooms, updatedAt: new Date().toISOString() };
    });
    set({ conteos });
    const updated = conteos.find((c) => c.id === conteoId);
    if (updated) upsertItemToCloud(CONTEO_TABLE, CONTEO_KEY, updated);
  },

  addRoom: (conteoId, room) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      return { ...c, rooms: [...c.rooms, room], updatedAt: new Date().toISOString() };
    });
    set({ conteos });
    const updated = conteos.find((c) => c.id === conteoId);
    if (updated) upsertItemToCloud(CONTEO_TABLE, CONTEO_KEY, updated);
  },

  removeRoom: (conteoId, roomIndex) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      const rooms = c.rooms.filter((_, i) => i !== roomIndex);
      return { ...c, rooms, updatedAt: new Date().toISOString() };
    });
    set({ conteos });
    const updated = conteos.find((c) => c.id === conteoId);
    if (updated) upsertItemToCloud(CONTEO_TABLE, CONTEO_KEY, updated);
  },

  deleteConteo: (id) => {
    const conteos = get().conteos.filter((c) => c.id !== id);
    set({ conteos });
    deleteFromCloud(CONTEO_TABLE, CONTEO_KEY, id);
  },
}));

/* ───── Plan Store ───── */
const PLAN_TABLE = 'plans';
const PLAN_KEY = 'electripro-plans';

const getLocalPlans = () => {
  try {
    const saved = localStorage.getItem(PLAN_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
};

export const usePlanStore = create((set, get) => ({
  plans: getLocalPlans(),
  loaded: false,

  loadPlans: async () => {
    const data = await loadFromCloud(PLAN_TABLE, PLAN_KEY);
    set({ plans: data || [], loaded: true });
  },

  createPlan: (planData) => {
    const newPlan = {
      id: generateId('plan'),
      ...planData,
      tasks: planData.tasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...get().plans, newPlan];
    set({ plans: updated });
    upsertItemToCloud(PLAN_TABLE, PLAN_KEY, newPlan);
    return newPlan;
  },

  updatePlan: (id, updates) => {
    const plans = get().plans.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    set({ plans });
    const updated = plans.find((p) => p.id === id);
    if (updated) upsertItemToCloud(PLAN_TABLE, PLAN_KEY, updated);
  },

  deletePlan: (id) => {
    const plans = get().plans.filter((p) => p.id !== id);
    set({ plans });
    deleteFromCloud(PLAN_TABLE, PLAN_KEY, id);
  },
}));

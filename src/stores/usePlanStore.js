import { create } from 'zustand';
import { generateId } from '../utils/formatters';
import { DEFAULT_PLANNING_PARAMS, DEFAULT_ROOMS } from '../utils/constants';

const CONTEO_KEY = 'electripro-conteos';
const PLAN_KEY = 'electripro-plans';

const loadData = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return [];
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) { /* ignore */ }
};

const createEmptyRoom = (name) => ({
  name,
  bocas: 0,
  tomasSimp: 0,
  tomasDob: 0,
  tomas20: 0,
  cajasPaso: 0,
  cano34: 0,
  cano1: 0,
  obs: '',
});

export const useConteoStore = create((set, get) => ({
  conteos: loadData(CONTEO_KEY),

  createConteo: (obraId = '') => {
    const conteos = get().conteos;
    const newConteo = {
      id: generateId('conteo'),
      obraId,
      rooms: DEFAULT_ROOMS.map(createEmptyRoom),
      createdAt: new Date().toISOString(),
    };
    const updated = [...conteos, newConteo];
    saveData(CONTEO_KEY, updated);
    set({ conteos: updated });
    return newConteo;
  },

  updateConteo: (id, updates) => {
    const conteos = get().conteos.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    saveData(CONTEO_KEY, conteos);
    set({ conteos });
  },

  updateRoom: (conteoId, roomIndex, updates) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      const rooms = [...c.rooms];
      rooms[roomIndex] = { ...rooms[roomIndex], ...updates };
      return { ...c, rooms };
    });
    saveData(CONTEO_KEY, conteos);
    set({ conteos });
  },

  addRoom: (conteoId, roomName) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      return { ...c, rooms: [...c.rooms, createEmptyRoom(roomName)] };
    });
    saveData(CONTEO_KEY, conteos);
    set({ conteos });
  },

  removeRoom: (conteoId, roomIndex) => {
    const conteos = get().conteos.map((c) => {
      if (c.id !== conteoId) return c;
      const rooms = c.rooms.filter((_, i) => i !== roomIndex);
      return { ...c, rooms };
    });
    saveData(CONTEO_KEY, conteos);
    set({ conteos });
  },

  deleteConteo: (id) => {
    const conteos = get().conteos.filter((c) => c.id !== id);
    saveData(CONTEO_KEY, conteos);
    set({ conteos });
  },

  getConteoById: (id) => {
    return get().conteos.find((c) => c.id === id);
  },
}));

export const usePlanStore = create((set, get) => ({
  plans: loadData(PLAN_KEY),

  createPlan: (obraId = '') => {
    const plans = get().plans;
    const newPlan = {
      id: generateId('plan'),
      obraId,
      params: { ...DEFAULT_PLANNING_PARAMS },
      employees: { caneria: 2, amurado: 2, cableado: 2, artefactos: 1 },
      artefactosCount: 10,
      createdAt: new Date().toISOString(),
    };
    const updated = [...plans, newPlan];
    saveData(PLAN_KEY, updated);
    set({ plans: updated });
    return newPlan;
  },

  updatePlan: (id, updates) => {
    const plans = get().plans.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveData(PLAN_KEY, plans);
    set({ plans });
  },

  deletePlan: (id) => {
    const plans = get().plans.filter((p) => p.id !== id);
    saveData(PLAN_KEY, plans);
    set({ plans });
  },

  getPlanById: (id) => {
    return get().plans.find((p) => p.id === id);
  },
}));

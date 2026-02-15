import { supabase, isSupabaseConfigured } from './supabase';

/**
 * SyncManager: Maneja la sincronización entre localStorage (cache offline) y Supabase (nube).
 * - Lee primero de Supabase si está disponible, si no de localStorage.
 * - Escribe siempre en localStorage (cache) Y en Supabase (persistencia).
 * - Si Supabase falla, los datos quedan en localStorage como fallback.
 */

// ─── localStorage helpers ───
const localGet = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const localSet = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
};

// ─── Supabase CRUD ───

/**
 * Load all rows from a Supabase table. Falls back to localStorage.
 */
export const loadFromCloud = async (tableName, localKey) => {
  // Always have localStorage as baseline
  const localData = localGet(localKey);

  if (!isSupabaseConfigured()) {
    return localData || [];
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn(`[Sync] Error loading ${tableName}:`, error.message);
      return localData || [];
    }

    // Data from cloud: update localStorage cache
    if (data && data.length > 0) {
      const mapped = data.map((row) => row.data || row);
      localSet(localKey, mapped);
      return mapped;
    }

    // Cloud is empty but localStorage has data → push local to cloud (first-time migration)
    if (localData && localData.length > 0) {
      await migrateToCloud(tableName, localKey, localData);
      return localData;
    }

    return [];
  } catch (err) {
    console.warn(`[Sync] Network error for ${tableName}:`, err);
    return localData || [];
  }
};

/**
 * Load a single-row config table (like settings). Returns the object or default.
 */
export const loadConfigFromCloud = async (tableName, localKey, defaultValue) => {
  const localData = localGet(localKey);

  if (!isSupabaseConfigured()) {
    return localData || defaultValue;
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', 'main')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn(`[Sync] Error loading config ${tableName}:`, error.message);
      return localData || defaultValue;
    }

    if (data?.data) {
      localSet(localKey, data.data);
      return data.data;
    }

    // Migrate local config to cloud
    if (localData) {
      await saveConfigToCloud(tableName, localKey, localData);
      return localData;
    }

    return defaultValue;
  } catch (err) {
    console.warn(`[Sync] Network error for config ${tableName}:`, err);
    return localData || defaultValue;
  }
};

/**
 * Save an array of items to cloud + localStorage.
 */
export const saveToCloud = async (tableName, localKey, items) => {
  // Always save locally first (instant, offline-safe)
  localSet(localKey, items);

  if (!isSupabaseConfigured()) return;

  try {
    // Clear existing rows and insert all (simple approach for small datasets)
    await supabase.from(tableName).delete().neq('id', '');

    if (items.length > 0) {
      const rows = items.map((item) => ({
        id: item.id || item.code || crypto.randomUUID(),
        data: item,
        created_at: item.createdAt || item.updatedAt || new Date().toISOString(),
      }));
      const { error } = await supabase.from(tableName).upsert(rows, { onConflict: 'id' });
      if (error) console.warn(`[Sync] Error saving ${tableName}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Sync] Network error saving ${tableName}:`, err);
  }
};

/**
 * Upsert a single item in cloud + update localStorage array.
 */
export const upsertItemToCloud = async (tableName, localKey, item, idField = 'id') => {
  // Update localStorage
  const items = localGet(localKey) || [];
  const itemId = item[idField];
  const index = items.findIndex((i) => i[idField] === itemId);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  localSet(localKey, items);

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.from(tableName).upsert({
      id: itemId,
      data: item,
      created_at: item.createdAt || item.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) console.warn(`[Sync] Error upserting to ${tableName}:`, error.message);
  } catch (err) {
    console.warn(`[Sync] Network error upserting ${tableName}:`, err);
  }
};

/**
 * Delete a single item from cloud + localStorage.
 */
export const deleteFromCloud = async (tableName, localKey, itemId) => {
  // Update localStorage
  const items = localGet(localKey) || [];
  const filtered = items.filter((i) => (i.id || i.code) !== itemId);
  localSet(localKey, filtered);

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.from(tableName).delete().eq('id', itemId);
    if (error) console.warn(`[Sync] Error deleting from ${tableName}:`, error.message);
  } catch (err) {
    console.warn(`[Sync] Network error deleting from ${tableName}:`, err);
  }
};

/**
 * Save single-row config to cloud + localStorage.
 */
export const saveConfigToCloud = async (tableName, localKey, config) => {
  localSet(localKey, config);

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.from(tableName).upsert({
      id: 'main',
      data: config,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) console.warn(`[Sync] Error saving config ${tableName}:`, error.message);
  } catch (err) {
    console.warn(`[Sync] Network error saving config ${tableName}:`, err);
  }
};

/**
 * Migrate existing localStorage data to cloud (first-time setup).
 */
const migrateToCloud = async (tableName, localKey, localData) => {
  if (!isSupabaseConfigured() || !localData?.length) return;

  console.log(`[Sync] Migrating ${localData.length} items from localStorage to ${tableName}...`);
  try {
    const rows = localData.map((item) => ({
      id: item.id || item.code || crypto.randomUUID(),
      data: item,
      created_at: item.createdAt || item.updatedAt || new Date().toISOString(),
    }));
    const { error } = await supabase.from(tableName).upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn(`[Sync] Migration error for ${tableName}:`, error.message);
    } else {
      console.log(`[Sync] Migration complete for ${tableName}`);
    }
  } catch (err) {
    console.warn(`[Sync] Migration network error for ${tableName}:`, err);
  }
};

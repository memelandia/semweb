-- ╔══════════════════════════════════════════════════════════════╗
-- ║  ElectriPro / SemWeb - Supabase Database Schema           ║
-- ║  Ejecutar en: Supabase Dashboard → SQL Editor → New Query ║
-- ╚══════════════════════════════════════════════════════════════╝

-- 1. PRECIOS (Lista de precios de materiales y mano de obra)
CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRESUPUESTOS
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OBRAS
CREATE TABLE IF NOT EXISTS obras (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTEOS DE PLANO
CREATE TABLE IF NOT EXISTS conteos (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PLANIFICACIONES
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONFIGURACIÓN (una sola fila con id='main')
CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Row Level Security: Habilitar acceso público (sin login) ═══
-- Dado que la app no tiene autenticación, permitimos acceso anon.

ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteos ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Policies: permitir todo para anon (usuario sin login)
CREATE POLICY "Allow all on prices" ON prices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on obras" ON obras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on conteos" ON conteos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on plans" ON plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on config" ON config FOR ALL USING (true) WITH CHECK (true);

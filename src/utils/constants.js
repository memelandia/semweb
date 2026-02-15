// Categories with colors and icons
export const CATEGORIES = [
  { id: 'bocas', name: 'Bocas de Luz', color: '#10B981', icon: '💡' },
  { id: 'tomas', name: 'Tomacorrientes', color: '#3B82F6', icon: '🔌' },
  { id: 'caneria', name: 'Cañería', color: '#F59E0B', icon: '🔧' },
  { id: 'cajas', name: 'Cajas', color: '#8B5CF6', icon: '📦' },
  { id: 'tableros', name: 'Tableros', color: '#EF4444', icon: '⚡' },
  { id: 'cableado', name: 'Cableado', color: '#06B6D4', icon: '🔗' },
  { id: 'artefactos', name: 'Artefactos', color: '#F97316', icon: '🔆' },
  { id: 'mano_obra', name: 'Mano de Obra', color: '#EC4899', icon: '👷' },
];

// Default price list items
export const DEFAULT_PRICES = [
  // Bocas de Luz
  { code: 'BL-001', category: 'bocas', name: 'Boca de luz simple (centro)', unit: 'u', cost: 8500, price: 22000 },
  { code: 'BL-002', category: 'bocas', name: 'Boca doble comando', unit: 'u', cost: 12000, price: 28000 },
  { code: 'BL-003', category: 'bocas', name: 'Boca con dimmer', unit: 'u', cost: 18000, price: 38000 },
  { code: 'BL-004', category: 'bocas', name: 'Boca exterior IP55', unit: 'u', cost: 14000, price: 32000 },
  { code: 'BL-005', category: 'bocas', name: 'Boca aplique pared', unit: 'u', cost: 10000, price: 25000 },
  { code: 'BL-006', category: 'bocas', name: 'Boca combinada (1 toma + 1 luz)', unit: 'u', cost: 13000, price: 30000 },

  // Tomacorrientes
  { code: 'TC-001', category: 'tomas', name: 'Tomacorriente simple 10A', unit: 'u', cost: 6500, price: 18000 },
  { code: 'TC-002', category: 'tomas', name: 'Tomacorriente doble 10A', unit: 'u', cost: 9000, price: 24000 },
  { code: 'TC-003', category: 'tomas', name: 'Tomacorriente 20A (aire acondicionado)', unit: 'u', cost: 14000, price: 35000 },
  { code: 'TC-004', category: 'tomas', name: 'Tomacorriente exterior IP55', unit: 'u', cost: 12000, price: 28000 },
  { code: 'TC-005', category: 'tomas', name: 'Tomacorriente USB doble', unit: 'u', cost: 16000, price: 38000 },
  { code: 'TC-006', category: 'tomas', name: 'Tomacorriente triple 10A', unit: 'u', cost: 11000, price: 28000 },

  // Cañería
  { code: 'CA-001', category: 'caneria', name: 'Caño rígido 3/4"', unit: 'ml', cost: 1200, price: 3500 },
  { code: 'CA-002', category: 'caneria', name: 'Caño rígido 1"', unit: 'ml', cost: 1800, price: 4800 },
  { code: 'CA-003', category: 'caneria', name: 'Canaleta 20x10mm', unit: 'ml', cost: 900, price: 2800 },
  { code: 'CA-004', category: 'caneria', name: 'Canaleta 40x25mm', unit: 'ml', cost: 1500, price: 4200 },
  { code: 'CA-005', category: 'caneria', name: 'Corrugado 3/4"', unit: 'ml', cost: 800, price: 2200 },
  { code: 'CA-006', category: 'caneria', name: 'Corrugado 1"', unit: 'ml', cost: 1100, price: 3000 },

  // Cajas
  { code: 'CJ-001', category: 'cajas', name: 'Caja rectangular chica', unit: 'u', cost: 1500, price: 4500 },
  { code: 'CJ-002', category: 'cajas', name: 'Caja rectangular grande', unit: 'u', cost: 2200, price: 6000 },
  { code: 'CJ-003', category: 'cajas', name: 'Caja octogonal', unit: 'u', cost: 1800, price: 5000 },
  { code: 'CJ-004', category: 'cajas', name: 'Caja de paso 10x10', unit: 'u', cost: 2500, price: 6500 },
  { code: 'CJ-005', category: 'cajas', name: 'Caja de paso 15x15', unit: 'u', cost: 3500, price: 8500 },
  { code: 'CJ-006', category: 'cajas', name: 'Caja de paso 20x20', unit: 'u', cost: 5000, price: 12000 },

  // Tableros
  { code: 'TB-001', category: 'tableros', name: 'Tablero 6 módulos', unit: 'u', cost: 25000, price: 55000 },
  { code: 'TB-002', category: 'tableros', name: 'Tablero 12 módulos', unit: 'u', cost: 38000, price: 78000 },
  { code: 'TB-003', category: 'tableros', name: 'Tablero 18 módulos', unit: 'u', cost: 52000, price: 105000 },
  { code: 'TB-004', category: 'tableros', name: 'Tablero 24 módulos', unit: 'u', cost: 68000, price: 135000 },
  { code: 'TB-005', category: 'tableros', name: 'Tablero 36 módulos', unit: 'u', cost: 95000, price: 185000 },

  // Cableado
  { code: 'CB-001', category: 'cableado', name: 'Cable 1.5mm² (iluminación)', unit: 'ml', cost: 650, price: 1800 },
  { code: 'CB-002', category: 'cableado', name: 'Cable 2.5mm² (tomas)', unit: 'ml', cost: 950, price: 2500 },
  { code: 'CB-003', category: 'cableado', name: 'Cable 4mm² (tomas especiales)', unit: 'ml', cost: 1400, price: 3500 },
  { code: 'CB-004', category: 'cableado', name: 'Cable 6mm² (alimentación)', unit: 'ml', cost: 2100, price: 5000 },
  { code: 'CB-005', category: 'cableado', name: 'Cable tierra 2.5mm² (verde/amarillo)', unit: 'ml', cost: 950, price: 2500 },
  { code: 'CB-006', category: 'cableado', name: 'Cable 10mm² (alimentación principal)', unit: 'ml', cost: 3500, price: 7800 },

  // Artefactos
  { code: 'AR-001', category: 'artefactos', name: 'Luminaria LED simple', unit: 'u', cost: 15000, price: 32000 },
  { code: 'AR-002', category: 'artefactos', name: 'Luminaria LED empotrada', unit: 'u', cost: 12000, price: 28000 },
  { code: 'AR-003', category: 'artefactos', name: 'Ventilador de techo', unit: 'u', cost: 85000, price: 145000 },
  { code: 'AR-004', category: 'artefactos', name: 'Extractor de aire', unit: 'u', cost: 35000, price: 65000 },
  { code: 'AR-005', category: 'artefactos', name: 'Timbre inalámbrico', unit: 'u', cost: 18000, price: 35000 },
  { code: 'AR-006', category: 'artefactos', name: 'Spot embutido dicroica', unit: 'u', cost: 8000, price: 18000 },

  // Mano de Obra
  { code: 'MO-001', category: 'mano_obra', name: 'Jornal oficial electricista', unit: 'día', cost: 0, price: 85000 },
  { code: 'MO-002', category: 'mano_obra', name: 'Jornal ayudante', unit: 'día', cost: 0, price: 55000 },
  { code: 'MO-003', category: 'mano_obra', name: 'Hora extra oficial', unit: 'hr', cost: 0, price: 15000 },
  { code: 'MO-004', category: 'mano_obra', name: 'Hora extra ayudante', unit: 'hr', cost: 0, price: 9500 },
];

// Default rooms for blueprint counting
export const DEFAULT_ROOMS = [
  'Cocina', 'Comedor', 'Living', 'Dormitorio 1', 'Dormitorio 2', 'Dormitorio 3',
  'Baño 1', 'Baño 2', 'Lavadero', 'Garage', 'Pasillo', 'Hall', 'Patio/Exterior', 'Escalera'
];

// Budget statuses
export const BUDGET_STATUSES = [
  { id: 'borrador', label: 'Borrador', color: '#94A3B8' },
  { id: 'enviado', label: 'Enviado', color: '#3B82F6' },
  { id: 'aceptado', label: 'Aceptado', color: '#10B981' },
  { id: 'rechazado', label: 'Rechazado', color: '#EF4444' },
];

// Obra statuses
export const OBRA_STATUSES = [
  { id: 'presupuestada', label: 'Presupuestada', color: '#94A3B8' },
  { id: 'en_curso', label: 'En curso', color: '#3B82F6' },
  { id: 'terminada', label: 'Terminada', color: '#10B981' },
  { id: 'cobrada', label: 'Cobrada', color: '#8B5CF6' },
  { id: 'cancelada', label: 'Cancelada', color: '#EF4444' },
];

// Default planning parameters
export const DEFAULT_PLANNING_PARAMS = {
  rendAmurado: 12,
  rendCano: 25,
  rendCableado: 10,
  rendArtefactos: 8,
  costoOficial: 85000,
  costoAyudante: 55000,
};

// Default config
export const DEFAULT_CONFIG = {
  companyName: 'ElectriPro',
  cuit: '',
  address: '',
  phone: '',
  email: '',
  logo: null,
  ivaDefault: 21,
  currency: 'ARS',
  rendimientos: { ...DEFAULT_PLANNING_PARAMS },
};

// Navigation items
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/precios', label: 'Lista de Precios', icon: 'DollarSign' },
  { path: '/conteo', label: 'Conteo de Plano', icon: 'Grid3X3' },
  { path: '/presupuesto', label: 'Presupuesto', icon: 'FileText' },
  { path: '/planificacion', label: 'Planificación', icon: 'CalendarDays' },
  { path: '/obras', label: 'Registro de Obras', icon: 'Building2' },
  { path: '/configuracion', label: 'Configuración', icon: 'Settings' },
];

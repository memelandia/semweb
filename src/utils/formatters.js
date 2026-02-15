// Format currency in ARS (Pesos Argentinos)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$ 0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousands separator
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('es-AR').format(num);
};

// Format percentage
export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Short date
export const formatShortDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

// Generate unique ID
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate next sequential number for budgets/obras
export const getNextNumber = (items, prefix = 'NUM') => {
  if (!items || items.length === 0) return `${prefix}-001`;
  const nums = items
    .map((i) => {
      const match = (i.number || '').match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

// Get today as ISO string
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

// Truncate text
export const truncate = (str, len = 30) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

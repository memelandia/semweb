import { useMemo } from 'react';
import { calcBudgetTotals, calcConteoTotals, calcPlanning } from '../utils/calculations';

export function useBudgetCalculations(items, ivaPercent = 21) {
  return useMemo(() => calcBudgetTotals(items, ivaPercent), [items, ivaPercent]);
}

export function useConteoCalculations(rooms) {
  return useMemo(() => calcConteoTotals(rooms || []), [rooms]);
}

export function usePlanningCalculations(data, params, employees) {
  return useMemo(() => calcPlanning(data, params, employees), [data, params, employees]);
}

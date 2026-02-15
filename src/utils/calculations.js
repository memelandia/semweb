// Calculate margin percentage
export const calcMargin = (cost, price) => {
  if (!price || price === 0) return 0;
  return ((price - cost) / price) * 100;
};

// Calculate subtotal for a budget item
export const calcItemSubtotal = (qty, unitPrice) => {
  return (qty || 0) * (unitPrice || 0);
};

// Calculate budget totals
export const calcBudgetTotals = (items, ivaPercent = 21) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + calcItemSubtotal(item.qty, item.unitPrice);
  }, 0);
  const iva = subtotal * (ivaPercent / 100);
  const total = subtotal + iva;

  const costTotal = items.reduce((sum, item) => {
    return sum + (item.qty || 0) * (item.cost || 0);
  }, 0);

  const marginBruto = subtotal > 0 ? ((subtotal - costTotal) / subtotal) * 100 : 0;

  return { subtotal, iva, total, costTotal, marginBruto };
};

// Calculate conteo totals from rooms
export const calcConteoTotals = (rooms) => {
  const totals = {
    bocas: 0,
    tomasSimp: 0,
    tomasDob: 0,
    tomas20: 0,
    cajasPaso: 0,
    cano34: 0,
    cano1: 0,
  };

  rooms.forEach((room) => {
    totals.bocas += room.bocas || 0;
    totals.tomasSimp += room.tomasSimp || 0;
    totals.tomasDob += room.tomasDob || 0;
    totals.tomas20 += room.tomas20 || 0;
    totals.cajasPaso += room.cajasPaso || 0;
    totals.cano34 += room.cano34 || 0;
    totals.cano1 += room.cano1 || 0;
  });

  totals.totalTomas = totals.tomasSimp + totals.tomasDob + totals.tomas20;
  totals.totalCano = totals.cano34 + totals.cano1;
  totals.totalPuntos = totals.bocas + totals.totalTomas;

  return totals;
};

// Map conteo totals to budget items
export const mapConteoToBudget = (totals, prices) => {
  const mapping = [
    { field: 'bocas', code: 'BL-001' },
    { field: 'tomasSimp', code: 'TC-001' },
    { field: 'tomasDob', code: 'TC-002' },
    { field: 'tomas20', code: 'TC-003' },
    { field: 'cajasPaso', code: 'CJ-004' },
    { field: 'cano34', code: 'CA-001' },
    { field: 'cano1', code: 'CA-002' },
  ];

  const items = [];
  mapping.forEach(({ field, code }) => {
    const qty = totals[field] || 0;
    if (qty > 0) {
      const priceItem = prices.find((p) => p.code === code);
      if (priceItem) {
        items.push({
          code: priceItem.code,
          name: priceItem.name,
          unit: priceItem.unit,
          qty,
          unitPrice: priceItem.price,
          cost: priceItem.cost,
          notes: '',
        });
      }
    }
  });

  return items;
};

// Planning calculations
export const calcPlanning = (data, params, employees) => {
  const stages = [
    {
      name: 'Canaletas y caños',
      workTotal: data.totalCano || 0,
      rendPerDay: params.rendCano,
      numEmployees: employees.caneria || 1,
    },
    {
      name: 'Amurado de cajas',
      workTotal: data.totalBocas || 0,
      rendPerDay: params.rendAmurado,
      numEmployees: employees.amurado || 1,
    },
    {
      name: 'Cableado y puntos',
      workTotal: data.totalPuntos || 0,
      rendPerDay: params.rendCableado,
      numEmployees: employees.cableado || 1,
    },
    {
      name: 'Colocación artefactos',
      workTotal: data.artefactosCount || 0,
      rendPerDay: params.rendArtefactos,
      numEmployees: employees.artefactos || 1,
    },
  ];

  let totalDays = 0;
  let totalCostMO = 0;

  const result = stages.map((stage) => {
    const daysOnePerson = stage.rendPerDay > 0 ? Math.ceil(stage.workTotal / stage.rendPerDay) : 0;
    const daysReal = stage.numEmployees > 0 ? Math.ceil(daysOnePerson / stage.numEmployees) : 0;
    const costMO = daysReal * stage.numEmployees * params.costoOficial;

    totalDays += daysReal;
    totalCostMO += costMO;

    return {
      ...stage,
      daysOnePerson,
      daysReal,
      costMO,
    };
  });

  return {
    stages: result,
    totalDays,
    totalCostMO,
    totalWeeks: Math.ceil(totalDays / 5),
  };
};

// Calculate obra profitability
export const calcProfitability = (budgetAmount, collectedAmount, costMO, costMaterials) => {
  const totalCost = costMO + costMaterials;
  const revenue = collectedAmount || budgetAmount || 0;
  if (revenue === 0) return { profit: 0, percent: 0, level: 'red' };

  const profit = revenue - totalCost;
  const percent = (profit / revenue) * 100;

  let level = 'red';
  if (percent > 20) level = 'green';
  else if (percent > 10) level = 'yellow';

  return { profit, percent, level };
};

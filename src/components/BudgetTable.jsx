import { useState } from 'react';
import { usePriceStore } from '../stores/usePriceStore';
import { useToastStore } from '../stores/useToastStore';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { calcItemSubtotal } from '../utils/calculations';
import { Plus, Trash2, GripVertical, Search } from 'lucide-react';

export default function BudgetTable({ items, onUpdateItems }) {
  const { prices } = usePriceStore();
  const { addToast } = useToastStore();
  const [searchOpen, setSearchOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addItem = () => {
    onUpdateItems([
      ...items,
      { code: '', name: '', unit: '', qty: 1, unitPrice: 0, cost: 0, notes: '' },
    ]);
  };

  const removeItem = (index) => {
    onUpdateItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, updates) => {
    const newItems = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onUpdateItems(newItems);
  };

  const selectPrice = (index, priceItem) => {
    updateItem(index, {
      code: priceItem.code,
      name: priceItem.name,
      unit: priceItem.unit,
      unitPrice: priceItem.price,
      cost: priceItem.cost,
    });
    setSearchOpen(null);
    setSearchTerm('');
  };

  const filteredPrices = prices.filter(
    (p) =>
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPrices = CATEGORIES.map((cat) => ({
    ...cat,
    items: filteredPrices.filter((p) => p.category === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
              <th className="w-8 px-2 py-3"></th>
              <th className="text-left px-3 py-3">Código</th>
              <th className="text-left px-3 py-3">Descripción</th>
              <th className="text-center px-3 py-3">Unidad</th>
              <th className="text-center px-3 py-3">Cant.</th>
              <th className="text-right px-3 py-3">P. Unitario</th>
              <th className="text-right px-3 py-3">Subtotal</th>
              <th className="text-left px-3 py-3">Notas</th>
              <th className="w-10 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-2 py-2 text-slate-600 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </td>
                <td className="px-3 py-2 relative">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => {
                        updateItem(index, { code: e.target.value });
                        const found = prices.find((p) => p.code === e.target.value);
                        if (found) selectPrice(index, found);
                      }}
                      placeholder="Código"
                      className="w-20 px-2 py-1 bg-slate-800/60 border border-slate-700 rounded text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setSearchOpen(searchOpen === index ? null : index)}
                      className="p-1 text-slate-500 hover:text-blue-400 rounded"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Dropdown selector */}
                  {searchOpen === index && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-slate-800 border-b border-slate-700">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar ítem..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                      {groupedPrices.map((group) => (
                        <div key={group.id}>
                          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: group.color }}>
                            {group.icon} {group.name}
                          </div>
                          {group.items.map((p) => (
                            <button
                              key={p.code}
                              onClick={() => selectPrice(index, p)}
                              className="w-full text-left px-3 py-2 hover:bg-slate-700/50 flex justify-between items-center text-sm"
                            >
                              <span>
                                <span className="text-blue-400 font-mono text-xs mr-2">{p.code}</span>
                                <span className="text-white">{p.name}</span>
                              </span>
                              <span className="text-slate-400 font-mono text-xs">{formatCurrency(p.price)}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, { name: e.target.value })}
                    className="w-full bg-transparent border-none text-white text-sm focus:outline-none"
                    placeholder="Descripción"
                  />
                </td>
                <td className="px-3 py-2 text-center text-slate-400">{item.unit || '-'}</td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    value={item.qty || ''}
                    onChange={(e) => updateItem(index, { qty: Number(e.target.value) })}
                    className="w-16 text-center bg-slate-800/60 border border-slate-700 rounded py-1 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(index, { unitPrice: Number(e.target.value) })}
                    className="w-24 text-right bg-slate-800/60 border border-slate-700 rounded py-1 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-3 py-2 text-right font-mono text-white font-medium">
                  {formatCurrency(calcItemSubtotal(item.qty, item.unitPrice))}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => updateItem(index, { notes: e.target.value })}
                    placeholder="..."
                    className="w-full bg-transparent border-none text-slate-400 text-xs focus:outline-none"
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No hay ítems. Agregá uno para comenzar.
          </div>
        )}
      </div>
      <button
        onClick={addItem}
        className="mt-3 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
      >
        <Plus className="w-4 h-4" /> Agregar ítem
      </button>
    </div>
  );
}

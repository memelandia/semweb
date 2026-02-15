import { useState } from 'react';
import { usePriceStore } from '../stores/usePriceStore';
import { useToastStore } from '../stores/useToastStore';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calcMargin } from '../utils/calculations';
import { Search, Plus, Edit3, Check, X, Trash2 } from 'lucide-react';

export default function PriceEditor() {
  const { prices, updatePrice, addPrice, deletePrice } = usePriceStore();
  const { addToast } = useToastStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingCode, setEditingCode] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    code: '', category: 'bocas', name: '', unit: 'u', cost: 0, price: 0,
  });

  const filtered = prices.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const startEdit = (item) => {
    setEditingCode(item.code);
    setEditValues({ cost: item.cost, price: item.price });
  };

  const saveEdit = (code) => {
    updatePrice(code, editValues);
    setEditingCode(null);
    addToast('Precio actualizado', 'success');
  };

  const handleAdd = () => {
    if (!newItem.code || !newItem.name) {
      addToast('Completá código y nombre', 'error');
      return;
    }
    addPrice(newItem);
    setNewItem({ code: '', category: 'bocas', name: '', unit: 'u', cost: 0, price: 0 });
    setShowAdd(false);
    addToast('Ítem agregado', 'success');
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar Ítem
        </button>
      </div>

      {/* Add new item form */}
      {showAdd && (
        <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-white">Nuevo Ítem</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <input
              placeholder="Código"
              value={newItem.code}
              onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              placeholder="Nombre"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <select
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="u">u</option>
              <option value="ml">ml</option>
              <option value="día">día</option>
              <option value="hr">hr</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Costo"
                value={newItem.cost || ''}
                onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <input
              type="number"
              placeholder="Precio"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 col-span-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">
                Guardar
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Código</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Descripción</th>
              <th className="text-center px-4 py-3">Unidad</th>
              <th className="text-right px-4 py-3">Costo</th>
              <th className="text-right px-4 py-3">Precio</th>
              <th className="text-right px-4 py-3">Margen</th>
              <th className="text-center px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const cat = CATEGORIES.find((c) => c.id === item.category);
              const isEditing = editingCode === item.code;
              const margin = calcMargin(item.cost, item.price);

              return (
                <tr key={item.code} className={`border-t border-slate-800/50 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'} hover:bg-slate-800/40 transition-colors`}>
                  <td className="px-4 py-2.5 font-mono text-xs text-blue-400">{item.code}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: cat?.color + '20', color: cat?.color }}
                    >
                      {cat?.icon} {cat?.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-white">{item.name}</td>
                  <td className="px-4 py-2.5 text-center text-slate-400">{item.unit}</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.cost}
                        onChange={(e) => setEditValues({ ...editValues, cost: Number(e.target.value) })}
                        className="w-24 px-2 py-1 bg-slate-700 border border-blue-500 rounded text-right text-white text-sm focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-slate-400">{formatCurrency(item.cost)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.price}
                        onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })}
                        className="w-24 px-2 py-1 bg-slate-700 border border-blue-500 rounded text-right text-white text-sm focus:outline-none"
                      />
                    ) : (
                      <span className="text-white font-medium">{formatCurrency(item.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono text-xs font-medium ${margin > 40 ? 'text-emerald-400' : margin > 20 ? 'text-amber-400' : 'text-red-400'}`}>
                      {formatPercent(margin)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => saveEdit(item.code)} className="p-1.5 text-emerald-400 hover:bg-emerald-400/20 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingCode(null)} className="p-1.5 text-slate-400 hover:bg-slate-400/20 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { deletePrice(item.code); addToast('Ítem eliminado', 'info'); }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No se encontraron ítems</div>
        )}
      </div>
    </div>
  );
}

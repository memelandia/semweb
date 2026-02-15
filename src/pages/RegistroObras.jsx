import { useState } from 'react';
import { motion } from 'framer-motion';
import { useObraStore } from '../stores/useObraStore';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useToastStore } from '../stores/useToastStore';
import { OBRA_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calcProfitability } from '../utils/calculations';
import { Building2, Plus, Trash2, Search, X, Edit3, Check, ChevronDown } from 'lucide-react';

export default function RegistroObras() {
  const { obras, createObra, updateObra, deleteObra } = useObraStore();
  const { budgets } = useBudgetStore();
  const { addToast } = useToastStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newObra, setNewObra] = useState({
    client: '', address: '', status: 'presupuestada', budgetAmount: 0, collectedAmount: 0,
  });
  const [expandedId, setExpandedId] = useState(null);

  const filtered = obras.filter((o) => {
    const matchSearch = !search ||
      o.client?.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.number).includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!newObra.client) {
      addToast('Ingresá el nombre del cliente', 'error');
      return;
    }
    createObra(newObra);
    setNewObra({ client: '', address: '', status: 'presupuestada', budgetAmount: 0, collectedAmount: 0 });
    setShowNew(false);
    addToast('Obra creada', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta obra?')) {
      deleteObra(id);
      addToast('Obra eliminada', 'info');
    }
  };

  const getProfitability = (obra) => {
    return calcProfitability(obra.budgetAmount, obra.collectedAmount, 0, 0);
  };

  const profitColors = { green: 'text-emerald-400', yellow: 'text-amber-400', red: 'text-red-400' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-purple-400" />
            Registro de Obras
          </h1>
          <p className="text-sm text-slate-400 mt-1">{obras.length} obras registradas</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva Obra
        </button>
      </div>

      {/* New obra form */}
      {showNew && (
        <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-white">Nueva Obra</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              placeholder="Cliente"
              value={newObra.client}
              onChange={(e) => setNewObra({ ...newObra, client: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="Dirección"
              value={newObra.address}
              onChange={(e) => setNewObra({ ...newObra, address: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Monto presupuesto"
              value={newObra.budgetAmount || ''}
              onChange={(e) => setNewObra({ ...newObra, budgetAmount: Number(e.target.value) })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">
                Crear
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, dirección o N°..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todos los estados</option>
          {OBRA_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Obras list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {[...filtered].reverse().map((obra) => {
            const statusInfo = OBRA_STATUSES.find((s) => s.id === obra.status);
            const profit = getProfitability(obra);
            const isExpanded = expandedId === obra.id;

            return (
              <div key={obra.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : obra.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 font-bold font-mono text-sm">
                      #{obra.number}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{obra.client || 'Sin cliente'}</p>
                      <p className="text-xs text-slate-500">{obra.address || 'Sin dirección'} • {formatDate(obra.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-white font-medium hidden md:block">
                      {formatCurrency(obra.budgetAmount)}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: (statusInfo?.color || '#94A3B8') + '20', color: statusInfo?.color }}
                    >
                      {statusInfo?.label || obra.status}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Cliente</label>
                        <input
                          value={obra.client || ''}
                          onChange={(e) => updateObra(obra.id, { client: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Dirección</label>
                        <input
                          value={obra.address || ''}
                          onChange={(e) => updateObra(obra.id, { address: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Presupuesto</label>
                        <input
                          type="number"
                          value={obra.budgetAmount || ''}
                          onChange={(e) => updateObra(obra.id, { budgetAmount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Cobrado</label>
                        <input
                          type="number"
                          value={obra.collectedAmount || ''}
                          onChange={(e) => updateObra(obra.id, { collectedAmount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Fecha inicio</label>
                        <input
                          type="date"
                          value={obra.startDate || ''}
                          onChange={(e) => updateObra(obra.id, { startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Fecha fin</label>
                        <input
                          type="date"
                          value={obra.endDate || ''}
                          onChange={(e) => updateObra(obra.id, { endDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Estado</label>
                        <select
                          value={obra.status}
                          onChange={(e) => updateObra(obra.id, { status: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          {OBRA_STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Rentabilidad</label>
                        <div className={`px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono font-medium ${profitColors[profit.level]}`}>
                          {profit.percent.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(obra.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar Obra
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No hay obras registradas</p>
          <button onClick={() => setShowNew(true)} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 inline mr-2" /> Registrar primera obra
          </button>
        </div>
      )}
    </motion.div>
  );
}

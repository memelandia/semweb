import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BudgetTable from '../components/BudgetTable';
import ExportPDF from '../components/ExportPDF';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useToastStore } from '../stores/useToastStore';
import { calcBudgetTotals } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BUDGET_STATUSES } from '../utils/constants';
import {
  FileText, Plus, Save, Copy, Trash2, ChevronLeft,
  Send, CheckCircle, XCircle, FileEdit
} from 'lucide-react';

export default function Presupuesto() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { budgets, createBudget, updateBudget, deleteBudget, duplicateBudget } = useBudgetStore();
  const { addToast } = useToastStore();

  const [selectedId, setSelectedId] = useState(searchParams.get('id') || null);
  const [showList, setShowList] = useState(!searchParams.get('id'));

  const budget = budgets.find((b) => b.id === selectedId);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setSelectedId(idParam);
      setShowList(false);
    }
  }, [searchParams]);

  const totals = useMemo(() => {
    if (!budget) return null;
    return calcBudgetTotals(budget.items || [], budget.iva || 21);
  }, [budget]);

  const handleNew = () => {
    const newBudget = createBudget();
    setSelectedId(newBudget.id);
    setShowList(false);
    addToast('Nuevo presupuesto creado', 'success');
  };

  const handleSave = () => {
    addToast('Presupuesto guardado', 'success');
  };

  const handleDuplicate = () => {
    if (!budget) return;
    const dup = duplicateBudget(budget.id);
    if (dup) {
      setSelectedId(dup.id);
      addToast('Presupuesto duplicado', 'success');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este presupuesto?')) {
      deleteBudget(id);
      if (selectedId === id) {
        setSelectedId(null);
        setShowList(true);
      }
      addToast('Presupuesto eliminado', 'info');
    }
  };

  const handleStatusChange = (status) => {
    updateBudget(selectedId, { status });
    addToast(`Estado cambiado a ${BUDGET_STATUSES.find((s) => s.id === status)?.label}`, 'success');
  };

  // LIST VIEW
  if (showList) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-400" />
              Presupuestos
            </h1>
            <p className="text-sm text-slate-400 mt-1">{budgets.length} presupuestos</p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Presupuesto
          </button>
        </div>

        {budgets.length > 0 ? (
          <div className="space-y-2">
            {[...budgets].reverse().map((b) => {
              const statusInfo = BUDGET_STATUSES.find((s) => s.id === b.status);
              const t = calcBudgetTotals(b.items || [], b.iva || 21);
              return (
                <div
                  key={b.id}
                  onClick={() => { setSelectedId(b.id); setShowList(false); }}
                  className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold font-mono text-sm">
                      #{String(b.number).padStart(3, '0')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{b.client?.name || 'Sin cliente'}</p>
                      <p className="text-xs text-slate-500">{formatDate(b.date)} • {b.items?.length || 0} ítems</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-white font-medium">{formatCurrency(t.total)}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: (statusInfo?.color || '#94A3B8') + '20', color: statusInfo?.color }}
                    >
                      {statusInfo?.label || b.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                      className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No hay presupuestos</p>
            <button onClick={handleNew} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4 inline mr-2" /> Crear primer presupuesto
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // DETAIL VIEW
  if (!budget) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>Presupuesto no encontrado</p>
        <button onClick={() => setShowList(true)} className="mt-4 text-blue-400 hover:underline">
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowList(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Presupuesto N° {String(budget.number).padStart(4, '0')}
            </h1>
            <p className="text-sm text-slate-400">{formatDate(budget.date)} • Validez: {budget.validity}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportPDF budget={budget} />
          <button onClick={handleDuplicate} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
            <Copy className="w-4 h-4" /> Duplicar
          </button>
          <button onClick={() => handleDelete(budget.id)} className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm transition-colors">
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {BUDGET_STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleStatusChange(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              budget.status === s.id
                ? 'ring-2'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: s.color + '20',
              color: s.color,
              ringColor: budget.status === s.id ? s.color : 'transparent',
            }}
          >
            {s.id === 'borrador' && <FileEdit className="w-3 h-3" />}
            {s.id === 'enviado' && <Send className="w-3 h-3" />}
            {s.id === 'aceptado' && <CheckCircle className="w-3 h-3" />}
            {s.id === 'rechazado' && <XCircle className="w-3 h-3" />}
            {s.label}
          </button>
        ))}
      </div>

      {/* Client data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Nombre del cliente</label>
          <input
            type="text"
            value={budget.client?.name || ''}
            onChange={(e) => updateBudget(budget.id, { client: { ...budget.client, name: e.target.value } })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Dirección de obra</label>
          <input
            type="text"
            value={budget.client?.address || ''}
            onChange={(e) => updateBudget(budget.id, { client: { ...budget.client, address: e.target.value } })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Av. Ejemplo 123"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Teléfono</label>
          <input
            type="text"
            value={budget.client?.phone || ''}
            onChange={(e) => updateBudget(budget.id, { client: { ...budget.client, phone: e.target.value } })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="+54 11 1234-5678"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Email</label>
          <input
            type="email"
            value={budget.client?.email || ''}
            onChange={(e) => updateBudget(budget.id, { client: { ...budget.client, email: e.target.value } })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="cliente@email.com"
          />
        </div>
      </div>

      {/* IVA selector */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-xs text-slate-500">IVA %:</label>
        <input
          type="number"
          value={budget.iva || 21}
          onChange={(e) => updateBudget(budget.id, { iva: Number(e.target.value) })}
          className="w-20 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Budget items table */}
      <BudgetTable
        items={budget.items || []}
        onUpdateItems={(items) => updateBudget(budget.id, { items })}
      />

      {/* Totals */}
      {totals && (
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-sm space-y-2 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white font-mono">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">IVA ({budget.iva || 21}%)</span>
              <span className="text-white font-mono">{formatCurrency(totals.iva)}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-blue-400 font-mono">{formatCurrency(totals.total)}</span>
            </div>
            <div className="border-t border-slate-700/50 pt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Costo materiales</span>
                <span className="text-slate-400 font-mono">{formatCurrency(totals.costTotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Margen bruto</span>
                <span className={`font-mono font-medium ${totals.marginBruto > 30 ? 'text-emerald-400' : totals.marginBruto > 15 ? 'text-amber-400' : 'text-red-400'}`}>
                  {totals.marginBruto.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-xs text-slate-500 mb-2">Notas / Condiciones generales</label>
        <textarea
          value={budget.notes || ''}
          onChange={(e) => updateBudget(budget.id, { notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Condiciones de pago, garantía, plazos, etc."
        />
      </div>
    </motion.div>
  );
}

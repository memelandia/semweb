import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import PlanningTimeline from '../components/PlanningTimeline';
import { usePlanStore, useConteoStore } from '../stores/usePlanStore';
import { useToastStore } from '../stores/useToastStore';
import { calcPlanning, calcConteoTotals } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { DEFAULT_PLANNING_PARAMS } from '../utils/constants';
import { CalendarDays, Plus, Trash2, Calculator } from 'lucide-react';

export default function Planificacion() {
  const { plans, createPlan, updatePlan, deletePlan } = usePlanStore();
  const { conteos } = useConteoStore();
  const { addToast } = useToastStore();
  const [activePlanId, setActivePlanId] = useState(plans.length > 0 ? plans[0].id : null);

  const plan = plans.find((p) => p.id === activePlanId);

  // Auto-load conteo data if available
  const conteoData = useMemo(() => {
    if (!conteos || conteos.length === 0) return null;
    const latest = conteos[conteos.length - 1];
    return calcConteoTotals(latest.rooms);
  }, [conteos]);

  const planData = useMemo(() => {
    if (!plan) return null;
    const data = {
      totalCano: conteoData?.totalCano || 0,
      totalBocas: conteoData?.bocas || 0,
      totalPuntos: conteoData?.totalPuntos || 0,
      artefactosCount: plan.artefactosCount || 0,
    };
    return calcPlanning(data, plan.params, plan.employees);
  }, [plan, conteoData]);

  const handleNew = () => {
    const newPlan = createPlan();
    setActivePlanId(newPlan.id);
    addToast('Nueva planificación creada', 'success');
  };

  const handleUpdateParam = (key, value) => {
    if (!plan) return;
    updatePlan(plan.id, { params: { ...plan.params, [key]: Number(value) || 0 } });
  };

  const handleUpdateEmployees = (key, value) => {
    if (!plan) return;
    updatePlan(plan.id, { employees: { ...plan.employees, [key]: Math.max(1, Number(value) || 1) } });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta planificación?')) {
      deletePlan(id);
      setActivePlanId(plans.length > 1 ? plans.find((p) => p.id !== id)?.id : null);
      addToast('Planificación eliminada', 'info');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-amber-400" />
            Planificación de Obra
          </h1>
          <p className="text-sm text-slate-400 mt-1">Calculá tiempos y costos de mano de obra</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nueva Planificación
        </button>
      </div>

      {/* Plan selector */}
      {plans.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {plans.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePlanId(p.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activePlanId === p.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Plan #{i + 1}
              <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="ml-1 text-slate-600 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      )}

      {plan ? (
        <div className="space-y-6">
          {/* Rendimientos */}
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              Panel de Rendimientos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'rendAmurado', label: 'Bocas/día/persona', icon: '💡' },
                { key: 'rendCano', label: 'Metros caño/día/persona', icon: '🔧' },
                { key: 'rendCableado', label: 'Puntos cableado/día/persona', icon: '🔗' },
                { key: 'rendArtefactos', label: 'Artefactos/día/persona', icon: '🔆' },
                { key: 'costoOficial', label: 'Jornal oficial ($/día)', icon: '👷' },
                { key: 'costoAyudante', label: 'Jornal ayudante ($/día)', icon: '👷' },
              ].map(({ key, label, icon }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-500 mb-1">{icon} {label}</label>
                  <input
                    type="number"
                    value={plan.params[key] || 0}
                    onChange={(e) => handleUpdateParam(key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Datos de la obra */}
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-4">Datos de la Obra {conteoData ? '(desde conteo)' : ''}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Total bocas</label>
                <input type="number" value={conteoData?.bocas || 0} readOnly className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Total metros caño</label>
                <input type="number" value={conteoData?.totalCano || 0} readOnly className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Total puntos eléctricos</label>
                <input type="number" value={conteoData?.totalPuntos || 0} readOnly className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Total artefactos (manual)</label>
                <input
                  type="number"
                  value={plan.artefactosCount || 0}
                  onChange={(e) => updatePlan(plan.id, { artefactosCount: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Calculation table */}
          {planData && (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Etapa</th>
                      <th className="text-center px-4 py-3">Trabajo Total</th>
                      <th className="text-center px-4 py-3">Rend./día</th>
                      <th className="text-center px-4 py-3">Días (1 persona)</th>
                      <th className="text-center px-4 py-3">Nº Empleados</th>
                      <th className="text-center px-4 py-3">Días Reales</th>
                      <th className="text-right px-4 py-3">Costo M.O.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planData.stages.map((stage, i) => {
                      const empKey = ['caneria', 'amurado', 'cableado', 'artefactos'][i];
                      return (
                        <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-white font-medium">{i + 1}. {stage.name}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-300">{stage.workTotal}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-300">{stage.rendPerDay}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-300">{stage.daysOnePerson}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={plan.employees[empKey] || 1}
                              onChange={(e) => handleUpdateEmployees(empKey, e.target.value)}
                              className="w-16 text-center bg-slate-800 border border-blue-500/50 rounded py-1 text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-white font-bold">{stage.daysReal}</td>
                          <td className="px-4 py-3 text-right font-mono text-amber-400">{formatCurrency(stage.costMO)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Días Totales"
                  value={`${planData.totalDays} días`}
                  subtitle={`≈ ${planData.totalWeeks} semanas`}
                  color="blue"
                  icon={<CalendarDays className="w-6 h-6" />}
                />
                <StatsCard
                  title="Costo Mano de Obra"
                  value={formatCurrency(planData.totalCostMO)}
                  color="amber"
                  icon="👷"
                />
                <StatsCard
                  title="Costo Total Proyecto"
                  value={formatCurrency(planData.totalCostMO)}
                  subtitle="Solo mano de obra (materiales aparte)"
                  color="green"
                  icon="💰"
                />
              </div>

              {/* Timeline */}
              <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <PlanningTimeline stages={planData.stages} />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No hay planificaciones</p>
          <button onClick={handleNew} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 inline mr-2" /> Crear primera planificación
          </button>
        </div>
      )}
    </motion.div>
  );
}

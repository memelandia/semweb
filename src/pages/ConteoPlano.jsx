import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoomCountGrid from '../components/RoomCountGrid';
import StatsCard from '../components/StatsCard';
import { useConteoStore } from '../stores/usePlanStore';
import { useBudgetStore } from '../stores/useBudgetStore';
import { usePriceStore } from '../stores/usePriceStore';
import { useToastStore } from '../stores/useToastStore';
import { calcConteoTotals, mapConteoToBudget } from '../utils/calculations';
import { formatNumber } from '../utils/formatters';
import { Grid3X3, Plus, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConteoPlano() {
  const navigate = useNavigate();
  const { conteos, createConteo, updateRoom, addRoom, removeRoom, deleteConteo } = useConteoStore();
  const { createBudget } = useBudgetStore();
  const { prices } = usePriceStore();
  const { addToast } = useToastStore();
  const [activeConteo, setActiveConteo] = useState(conteos.length > 0 ? conteos[0].id : null);
  const [expandedConteos, setExpandedConteos] = useState({});

  const currentConteo = conteos.find((c) => c.id === activeConteo);

  const totals = useMemo(() => {
    if (!currentConteo) return null;
    return calcConteoTotals(currentConteo.rooms);
  }, [currentConteo]);

  const handleNew = () => {
    const newConteo = createConteo();
    setActiveConteo(newConteo.id);
    addToast('Nuevo conteo creado', 'success');
  };

  const handleSendToBudget = () => {
    if (!totals || !currentConteo) return;
    const items = mapConteoToBudget(totals, prices);
    if (items.length === 0) {
      addToast('No hay datos para enviar al presupuesto', 'error');
      return;
    }
    const budget = createBudget({ items });
    addToast('Presupuesto creado desde conteo', 'success');
    navigate(`/presupuesto?id=${budget.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este conteo?')) {
      deleteConteo(id);
      if (activeConteo === id) {
        setActiveConteo(conteos.length > 1 ? conteos.find((c) => c.id !== id)?.id : null);
      }
      addToast('Conteo eliminado', 'info');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Grid3X3 className="w-7 h-7 text-blue-400" />
            Conteo de Plano
          </h1>
          <p className="text-sm text-slate-400 mt-1">Contá los elementos eléctricos por ambiente</p>
        </div>
        <div className="flex gap-2">
          {currentConteo && (
            <button
              onClick={handleSendToBudget}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" /> Enviar al Presupuesto
            </button>
          )}
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Conteo
          </button>
        </div>
      </div>

      {/* Conteo selector */}
      {conteos.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {conteos.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveConteo(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeConteo === c.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Conteo #{i + 1}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                className="ml-1 text-slate-600 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {currentConteo ? (
        <>
          <RoomCountGrid
            rooms={currentConteo.rooms}
            onUpdateRoom={(roomIndex, updates) => updateRoom(currentConteo.id, roomIndex, updates)}
            onAddRoom={(name) => addRoom(currentConteo.id, name)}
            onRemoveRoom={(index) => removeRoom(currentConteo.id, index)}
          />

          {/* Summary cards */}
          {totals && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              <StatsCard title="Total Bocas" value={formatNumber(totals.bocas)} color="green" icon="💡" />
              <StatsCard title="Total Tomas" value={formatNumber(totals.totalTomas)} color="blue" icon="🔌" />
              <StatsCard title="Total Cajas" value={formatNumber(totals.cajasPaso)} color="purple" icon="📦" />
              <StatsCard title="Metros Caño" value={`${formatNumber(totals.totalCano)} ml`} color="amber" icon="🔧" />
              <StatsCard title="Puntos Eléctricos" value={formatNumber(totals.totalPuntos)} color="cyan" icon="⚡" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Grid3X3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No hay conteos</p>
          <p className="text-sm mb-4">Creá un nuevo conteo para empezar a contar los elementos del plano.</p>
          <button
            onClick={handleNew}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" /> Crear primer conteo
          </button>
        </div>
      )}
    </motion.div>
  );
}

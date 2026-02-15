import { motion } from 'framer-motion';
import PriceEditor from '../components/PriceEditor';
import { usePriceStore } from '../stores/usePriceStore';
import { useToastStore } from '../stores/useToastStore';
import { CATEGORIES } from '../utils/constants';
import { DollarSign, RotateCcw } from 'lucide-react';

export default function ListaPrecios() {
  const { prices, resetToDefaults } = usePriceStore();
  const { addToast } = useToastStore();

  const handleReset = () => {
    if (window.confirm('¿Resetear todos los precios a los valores por defecto?')) {
      resetToDefaults();
      addToast('Precios reseteados a valores por defecto', 'info');
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
            <DollarSign className="w-7 h-7 text-emerald-400" />
            Lista de Precios
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {prices.length} ítems en {CATEGORIES.length} categorías
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors text-slate-300"
        >
          <RotateCcw className="w-4 h-4" /> Resetear Precios
        </button>
      </div>

      {/* Category summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {CATEGORIES.map((cat) => {
          const count = prices.filter((p) => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-800/50"
              style={{ backgroundColor: cat.color + '10', borderColor: cat.color + '30' }}
            >
              <span className="text-lg">{cat.icon}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: cat.color }}>{cat.name}</p>
                <p className="text-xs text-slate-500">{count} ítems</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Editor */}
      <PriceEditor />
    </motion.div>
  );
}

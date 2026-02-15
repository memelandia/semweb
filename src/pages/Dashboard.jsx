import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useObraStore } from '../stores/useObraStore';
import { usePriceStore } from '../stores/usePriceStore';
import { CATEGORIES, OBRA_STATUSES, BUDGET_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calcBudgetTotals } from '../utils/calculations';
import { Plus, FileText, Building2, TrendingUp, DollarSign, Zap } from 'lucide-react';

export default function Dashboard() {
  const { budgets } = useBudgetStore();
  const { obras } = useObraStore();
  const { prices } = usePriceStore();

  const stats = useMemo(() => {
    const obrasActivas = obras.filter((o) => o.status === 'en_curso').length;
    const presupPendientes = budgets.filter((b) => b.status === 'enviado').length;

    const now = new Date();
    const thisMonth = budgets.filter((b) => {
      if (b.status !== 'aceptado') return false;
      const d = new Date(b.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const facturacionMes = thisMonth.reduce((sum, b) => {
      const totals = calcBudgetTotals(b.items || [], b.iva || 21);
      return sum + totals.total;
    }, 0);

    const allAccepted = budgets.filter((b) => b.status === 'aceptado');
    const avgMargin = allAccepted.length > 0
      ? allAccepted.reduce((sum, b) => {
          const totals = calcBudgetTotals(b.items || [], b.iva || 21);
          return sum + totals.marginBruto;
        }, 0) / allAccepted.length
      : 0;

    return { obrasActivas, presupPendientes, facturacionMes, avgMargin };
  }, [budgets, obras]);

  // Chart data - last 6 months billing
  const barChartData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthBudgets = budgets.filter((b) => {
        if (b.status !== 'aceptado') return false;
        const bd = new Date(b.date);
        return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
      });
      const total = monthBudgets.reduce((sum, b) => {
        return sum + calcBudgetTotals(b.items || [], b.iva || 21).total;
      }, 0);
      months.push({
        name: d.toLocaleDateString('es-AR', { month: 'short' }),
        facturacion: total,
      });
    }
    return months;
  }, [budgets]);

  // Pie chart data - distribution by category
  const pieData = useMemo(() => {
    const catTotals = {};
    budgets.forEach((b) => {
      (b.items || []).forEach((item) => {
        const priceItem = prices.find((p) => p.code === item.code);
        if (priceItem) {
          const cat = CATEGORIES.find((c) => c.id === priceItem.category);
          if (cat) {
            catTotals[cat.name] = (catTotals[cat.name] || 0) + (item.qty || 0) * (item.unitPrice || 0);
          }
        }
      });
    });
    return Object.entries(catTotals).map(([name, value]) => ({ name, value }));
  }, [budgets, prices]);

  const pieColors = CATEGORIES.map((c) => c.color);

  // Last 5 obras
  const recentObras = useMemo(() => {
    return [...obras].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [obras]);

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' },
    labelStyle: { color: '#94a3b8' },
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
            <Zap className="w-7 h-7 text-amber-400" />
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Vista general del negocio</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/presupuesto"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Presupuesto
          </Link>
          <Link
            to="/obras"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            <Building2 className="w-4 h-4" /> Nueva Obra
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Obras Activas"
          value={stats.obrasActivas}
          icon={<Building2 className="w-6 h-6" />}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Presup. Pendientes"
          value={stats.presupPendientes}
          icon={<FileText className="w-6 h-6" />}
          color="amber"
          delay={0.1}
        />
        <StatsCard
          title="Facturación Mes"
          value={formatCurrency(stats.facturacionMes)}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          delay={0.2}
        />
        <StatsCard
          title="Margen Promedio"
          value={`${stats.avgMargin.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Facturación Últimos 6 Meses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(value), 'Facturación']}
              />
              <Bar dataKey="facturacion" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Distribución por Categoría</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value) => [formatCurrency(value), 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-slate-500 text-sm">
              Sin datos aún. Creá tu primer presupuesto.
            </div>
          )}
          {pieData.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Obras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Últimas Obras</h3>
        {recentObras.length > 0 ? (
          <div className="space-y-2">
            {recentObras.map((obra) => {
              const statusInfo = OBRA_STATUSES.find((s) => s.id === obra.status);
              return (
                <div key={obra.id} className="flex items-center justify-between py-2.5 px-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold font-mono">
                      #{obra.number}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{obra.client || 'Sin cliente'}</p>
                      <p className="text-xs text-slate-500">{obra.address || 'Sin dirección'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-slate-300">{formatCurrency(obra.budgetAmount)}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: (statusInfo?.color || '#94A3B8') + '20', color: statusInfo?.color || '#94A3B8' }}
                    >
                      {statusInfo?.label || obra.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            No hay obras registradas. <Link to="/obras" className="text-blue-400 hover:underline">Creá tu primera obra</Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon, color = 'blue', subtitle, delay = 0 }) {
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-500/30',
    green: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/30',
    amber: 'from-amber-600/20 to-amber-800/10 border-amber-500/30',
    red: 'from-red-600/20 to-red-800/10 border-red-500/30',
    purple: 'from-purple-600/20 to-purple-800/10 border-purple-500/30',
    cyan: 'from-cyan-600/20 to-cyan-800/10 border-cyan-500/30',
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 md:p-5`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-white mt-1 font-mono animate-count">
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`text-2xl ${iconColors[color]} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

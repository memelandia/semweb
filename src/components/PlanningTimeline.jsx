import { motion } from 'framer-motion';

export default function PlanningTimeline({ stages }) {
  if (!stages || stages.length === 0) return null;

  const maxDays = Math.max(...stages.map((s) => s.daysReal || 0), 1);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#F97316'];

  let dayOffset = 0;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Timeline de Obra</h4>
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const barWidth = maxDays > 0 ? (stage.daysReal / maxDays) * 100 : 0;
          const offset = dayOffset;
          dayOffset += stage.daysReal;

          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 text-xs text-slate-400 text-right flex-shrink-0">
                {stage.name}
              </div>
              <div className="flex-1 bg-slate-800 rounded-full h-7 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="h-full rounded-full flex items-center px-3"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  <span className="text-xs font-medium text-white whitespace-nowrap">
                    {stage.daysReal} días
                  </span>
                </motion.div>
              </div>
              <div className="w-16 text-xs text-slate-500 text-right flex-shrink-0">
                Día {offset + 1}-{offset + stage.daysReal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../utils/constants';
import {
  LayoutDashboard, DollarSign, Grid3X3, FileText,
  CalendarDays, Building2, Settings, Zap
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, DollarSign, Grid3X3, FileText,
  CalendarDays, Building2, Settings,
};

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
      isActive
        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop fixed left-0 top-0 bottom-0 w-64 bg-slate-950/80 backdrop-blur-sm border-r border-slate-800 z-40 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ElectriPro
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
                {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 text-center">v1.0.0 • SemWeb</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 z-50 px-2 py-1">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="text-[9px] mt-0.5">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
          <NavLink
            to="/configuracion"
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
              location.pathname === '/configuracion' ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Config</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}

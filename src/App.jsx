import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ListaPrecios from './pages/ListaPrecios';
import ConteoPlano from './pages/ConteoPlano';
import Presupuesto from './pages/Presupuesto';
import Planificacion from './pages/Planificacion';
import RegistroObras from './pages/RegistroObras';
import Configuracion from './pages/Configuracion';
import { usePriceStore } from './stores/usePriceStore';
import { useBudgetStore } from './stores/useBudgetStore';
import { useObraStore } from './stores/useObraStore';
import { useConteoStore, usePlanStore } from './stores/usePlanStore';
import { useConfigStore } from './stores/useConfigStore';

export default function App() {
  useEffect(() => {
    // Load all stores from Supabase on startup
    usePriceStore.getState().loadPrices();
    useBudgetStore.getState().loadBudgets();
    useObraStore.getState().loadObras();
    useConteoStore.getState().loadConteos();
    usePlanStore.getState().loadPlans();
    useConfigStore.getState().loadConfig();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/precios" element={<ListaPrecios />} />
          <Route path="/conteo" element={<ConteoPlano />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/planificacion" element={<Planificacion />} />
          <Route path="/obras" element={<RegistroObras />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

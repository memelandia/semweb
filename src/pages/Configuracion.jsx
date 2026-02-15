import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useConfigStore } from '../stores/useConfigStore';
import { useToastStore } from '../stores/useToastStore';
import { DEFAULT_PLANNING_PARAMS } from '../utils/constants';
import { Settings, Save, Download, Upload, RotateCcw, Building, Phone, Mail, MapPin, FileText } from 'lucide-react';

export default function Configuracion() {
  const { config, updateConfig, resetConfig, exportData, importData } = useConfigStore();
  const { addToast } = useToastStore();
  const fileInputRef = useRef(null);

  const handleSave = () => {
    addToast('Configuración guardada', 'success');
  };

  const handleExport = () => {
    exportData();
    addToast('Datos exportados correctamente', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importData(ev.target.result);
      if (success) {
        addToast('Datos importados correctamente. Recargando...', 'success');
      } else {
        addToast('Error al importar datos', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('¿Resetear toda la configuración a valores por defecto?')) {
      resetConfig();
      addToast('Configuración reseteada', 'info');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-slate-400" />
            Configuración
          </h1>
          <p className="text-sm text-slate-400 mt-1">Datos de empresa, rendimientos y backup</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>

      <div className="space-y-6">
        {/* Company data */}
        <div className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            Datos de la Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nombre de la empresa</label>
              <input
                type="text"
                value={config.companyName || ''}
                onChange={(e) => updateConfig({ companyName: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="ElectriPro"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">CUIT / NIF</label>
              <input
                type="text"
                value={config.cuit || ''}
                onChange={(e) => updateConfig({ cuit: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="20-12345678-9"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                <MapPin className="w-3 h-3" /> Dirección
              </label>
              <input
                type="text"
                value={config.address || ''}
                onChange={(e) => updateConfig({ address: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Av. Ejemplo 123, CABA"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                <Phone className="w-3 h-3" /> Teléfono
              </label>
              <input
                type="text"
                value={config.phone || ''}
                onChange={(e) => updateConfig({ phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={config.email || ''}
                onChange={(e) => updateConfig({ email: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="info@electripro.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">IVA por defecto (%)</label>
              <input
                type="number"
                value={config.ivaDefault || 21}
                onChange={(e) => updateConfig({ ivaDefault: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Rendimientos */}
        <div className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            ⚡ Rendimientos por Defecto
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bocas amurado/día/persona</label>
              <input
                type="number"
                value={config.rendimientos?.rendAmurado || DEFAULT_PLANNING_PARAMS.rendAmurado}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, rendAmurado: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Metros caño/día/persona</label>
              <input
                type="number"
                value={config.rendimientos?.rendCano || DEFAULT_PLANNING_PARAMS.rendCano}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, rendCano: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Puntos cableado/día/persona</label>
              <input
                type="number"
                value={config.rendimientos?.rendCableado || DEFAULT_PLANNING_PARAMS.rendCableado}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, rendCableado: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Artefactos/día/persona</label>
              <input
                type="number"
                value={config.rendimientos?.rendArtefactos || DEFAULT_PLANNING_PARAMS.rendArtefactos}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, rendArtefactos: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Jornal oficial ($/día)</label>
              <input
                type="number"
                value={config.rendimientos?.costoOficial || DEFAULT_PLANNING_PARAMS.costoOficial}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, costoOficial: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Jornal ayudante ($/día)</label>
              <input
                type="number"
                value={config.rendimientos?.costoAyudante || DEFAULT_PLANNING_PARAMS.costoAyudante}
                onChange={(e) => updateConfig({ rendimientos: { ...config.rendimientos, costoAyudante: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Exportar / Importar Datos
          </h3>
          <p className="text-xs text-slate-500">
            Exportá todos tus datos como backup JSON. Podés importar el archivo para restaurar.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> Exportar Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" /> Importar Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Resetear Todo
            </button>
          </div>
        </div>

        {/* Currency note */}
        <div className="p-4 bg-amber-900/20 border border-amber-500/20 rounded-xl">
          <p className="text-xs text-amber-400">
            💰 <strong>Moneda:</strong> Pesos Argentinos (ARS $). Toda la aplicación usa formato argentino para montos y precios.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

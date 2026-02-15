import { exportBudgetPDF } from '../utils/pdfExport';
import { useConfigStore } from '../stores/useConfigStore';
import { useToastStore } from '../stores/useToastStore';
import { FileDown } from 'lucide-react';

export default function ExportPDF({ budget }) {
  const { config } = useConfigStore();
  const { addToast } = useToastStore();

  const handleExport = () => {
    try {
      exportBudgetPDF(budget, config);
      addToast('PDF exportado correctamente', 'success');
    } catch (error) {
      addToast('Error al exportar PDF', 'error');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-medium transition-colors text-white"
    >
      <FileDown className="w-4 h-4" /> Exportar PDF
    </button>
  );
}

import { useState } from 'react';
import { Minus, Plus, Trash2, PlusCircle } from 'lucide-react';

export default function RoomCountGrid({ rooms, onUpdateRoom, onAddRoom, onRemoveRoom }) {
  const [newRoomName, setNewRoomName] = useState('');

  const columns = [
    { key: 'bocas', label: '💡 Bocas', color: 'text-emerald-400' },
    { key: 'tomasSimp', label: '🔌 Tomas S.', color: 'text-blue-400' },
    { key: 'tomasDob', label: '🔌 Tomas D.', color: 'text-blue-400' },
    { key: 'tomas20', label: '🔌 20A', color: 'text-blue-400' },
    { key: 'cajasPaso', label: '📦 Cajas', color: 'text-purple-400' },
    { key: 'cano34', label: '🔧 3/4" (ml)', color: 'text-amber-400' },
    { key: 'cano1', label: '🔧 1" (ml)', color: 'text-amber-400' },
  ];

  const totals = {};
  columns.forEach((col) => {
    totals[col.key] = (rooms || []).reduce((sum, room) => sum + (room[col.key] || 0), 0);
  });

  const handleIncrement = (index, key) => {
    const val = (rooms[index][key] || 0) + 1;
    onUpdateRoom(index, { [key]: val });
  };

  const handleDecrement = (index, key) => {
    const val = Math.max(0, (rooms[index][key] || 0) - 1);
    onUpdateRoom(index, { [key]: val });
  };

  const handleChange = (index, key, value) => {
    onUpdateRoom(index, { [key]: Math.max(0, Number(value) || 0) });
  };

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      onAddRoom(newRoomName.trim());
      setNewRoomName('');
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-xs uppercase tracking-wider">
              <th className="text-left px-3 py-3 text-slate-400 min-w-[120px]">Ambiente</th>
              {columns.map((col) => (
                <th key={col.key} className={`text-center px-2 py-3 ${col.color} min-w-[90px]`}>
                  {col.label}
                </th>
              ))}
              <th className="text-left px-3 py-3 text-slate-400 min-w-[100px]">Obs.</th>
              <th className="px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {(rooms || []).map((room, rowIndex) => (
              <tr key={rowIndex} className={`border-t border-slate-800/50 ${rowIndex % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'} hover:bg-slate-800/30`}>
                <td className="px-3 py-2 font-medium text-white text-sm">{room.name}</td>
                {columns.map((col) => (
                  <td key={col.key} className="px-1 py-1 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => handleDecrement(rowIndex, col.key)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={room[col.key] || 0}
                        onChange={(e) => handleChange(rowIndex, col.key, e.target.value)}
                        className="w-12 text-center bg-slate-800/60 border border-slate-700 rounded py-1 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleIncrement(rowIndex, col.key)}
                        className="p-1 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                ))}
                <td className="px-2 py-1">
                  <input
                    type="text"
                    value={room.obs || ''}
                    onChange={(e) => onUpdateRoom(rowIndex, { obs: e.target.value })}
                    placeholder="..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-1">
                  <button
                    onClick={() => onRemoveRoom(rowIndex)}
                    className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Totals row */}
            <tr className="bg-blue-600/10 border-t-2 border-blue-500/30 font-bold">
              <td className="px-3 py-3 text-blue-400 uppercase text-xs tracking-wider">Totales</td>
              {columns.map((col) => (
                <td key={col.key} className="text-center py-3 text-white font-mono text-lg">
                  {totals[col.key]}
                </td>
              ))}
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Room */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
          placeholder="Nombre del ambiente..."
          className="flex-1 max-w-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddRoom}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Agregar Ambiente
        </button>
      </div>
    </div>
  );
}

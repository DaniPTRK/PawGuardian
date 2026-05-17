import React from 'react';
import { PawPrint } from 'lucide-react';

interface PetSelectorProps {
  pets: { id?: number; name?: string }[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

// Used to select pets on map/health page
const PetSelector: React.FC<PetSelectorProps> = ({ pets, selectedId, onSelect }) => {
  if (pets.length <= 1) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {pets.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id!)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap
            ${selectedId === p.id
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
        >
          <PawPrint size={14} /> {p.name}
        </button>
      ))}
    </div>
  );
};

export default PetSelector;


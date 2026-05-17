import React from 'react';
import type { PetRequestDto, PetResponseDto, PetSpecies } from '../../../infrastructure/apis/client/models';

interface Props {
  editPet: PetResponseDto | null;
  form: PetRequestDto;
  speciesList: PetSpecies[];
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpeciesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

// used when a new pet is added
const PetFormModal: React.FC<Props> = ({
  editPet,
  form,
  speciesList,
  onFieldChange,
  onSpeciesChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editPet ? 'Edit Pet' : 'Add Pet'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3">
          {(['name', 'breed'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field] ?? ''}
                onChange={onFieldChange}
                required={field !== 'breed'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Species</label>
            <select
              name="species"
              value={form.species ?? ''}
              onChange={e => onSpeciesChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            >
              <option value="">Select a species...</option>
              {speciesList.map(species => (
                <option key={species.id} value={species.name ?? ''}>{species.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Age (years)</label>
            <input
              name="age"
              type="number"
              min={0}
              value={form.age}
              onChange={onFieldChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
            >
              {editPet ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetFormModal;


import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { PetResponseDto, UserResponseDto } from '../../../infrastructure/apis/client/models';

interface Props {
  pet: PetResponseDto;
  vets: UserResponseDto[];
  onAssign: (vetId: number, petId: number) => void;
  onRemove: (vetId: number, petId: number) => void;
  onClose: () => void;
  isAssigning: boolean;
  isRemoving: boolean;
}

// used to assign vet to pet
const AssignVetModal: React.FC<Props> = ({
  pet,
  vets,
  onAssign,
  onRemove,
  onClose,
  isAssigning,
  isRemoving,
}) => {
  const [selectedVetId, setSelectedVetId] = useState<number | ''>('');

  const assignedVets = vets.filter(v => pet.assignedVetIds?.has(v.id!));
  const availableVets = vets.filter(v => !pet.assignedVetIds?.has(v.id!));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Vets</h2>
        <p className="text-sm text-gray-500 mb-4">
          Veterinarians for <strong>{pet.name}</strong>
        </p>

        {assignedVets.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Currently assigned</p>
            <div className="space-y-2">
              {assignedVets.map(vet => (
                <div
                  key={vet.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-green-200 bg-green-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{vet.username}</p>
                    <p className="text-xs text-gray-400">{vet.email}</p>
                  </div>
                  <button
                    onClick={() => pet.id && vet.id && onRemove(vet.id, pet.id)}
                    disabled={isRemoving}
                    className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableVets.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Add a vet</p>
            <div className="space-y-2">
              {availableVets.map(vet => (
                <label
                  key={vet.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedVetId === vet.id
                      ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="vet"
                    value={vet.id}
                    checked={selectedVetId === vet.id}
                    onChange={() => setSelectedVetId(vet.id!)}
                    className="accent-green-500"/>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{vet.username}</p>
                    <p className="text-xs text-gray-400">{vet.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {vets.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No vets available</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {selectedVetId !== '' && (
            <button
              disabled={isAssigning}
              onClick={() => pet.id && selectedVetId && onAssign(Number(selectedVetId), pet.id)}
              className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50"
            >
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignVetModal;


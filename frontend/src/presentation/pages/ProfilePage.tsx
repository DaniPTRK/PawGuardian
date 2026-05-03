import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAppRouter } from '../../infrastructure/hooks/useAppRouter';
import toast from 'react-hot-toast';
import { User, Mail, Shield, Pencil, PawPrint, UserCheck, Trash2, X } from 'lucide-react';
import { userApi, petApi } from '../../infrastructure/apis/api-management';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { setUser, logout } from '../../application/state-slices/profile';
import { extractErrorMessage } from '../../application/models/ErrorResponse';
import type { PetResponseDto, PetRequestDto, UserResponseDto } from '../../infrastructure/apis/client/models';
import { useDebounce } from '../../infrastructure/hooks/useDebounce';
import { ConfirmModal, Pagination, PasswordRules, SearchInput } from '../components/ui';

const PETS_PER_PAGE = 5;
const emptyForm: PetRequestDto = { name: '', species: '', breed: '', age: 0 };


const ProfilePage: React.FC = () => {
  const { user } = useOwnUser();
  const dispatch = useDispatch();
  const { goToLogin } = useAppRouter();
  const qc = useQueryClient();

  // Profile editing
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', newPassword: '', confirmPassword: '' });

  const updateMutation = useMutation({
    mutationFn: (dto: { username?: string; newPassword?: string }) =>
      userApi.updateMyProfile({ updateUserDto: dto }),
    onSuccess: (updated) => {
      dispatch(setUser({ id: updated.id, username: updated.username, email: updated.email, roles: updated.roles ? Array.from(updated.roles) : [] }));
      toast.success('Profile updated!');
      setEditMode(false);
    },
    onError: async (err: unknown) => {
      const message = await extractErrorMessage(err, 'Failed to update profile');
      toast.error(message, { duration: 5000 });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const dto: { username?: string; newPassword?: string } = {};
    if (profileForm.username && profileForm.username !== user?.username) {
      dto.username = profileForm.username;
    }
    if (profileForm.newPassword) {
      dto.newPassword = profileForm.newPassword;
    }
    if (!dto.username && !dto.newPassword) {
      toast.error('No changes to save');
      return;
    }
    updateMutation.mutate(dto);
  };

  // Pet table - this table is used to manage the user's pets
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const [showPetModal, setShowPetModal] = useState(false);
  const [editPet, setEditPet] = useState<PetResponseDto | null>(null);
  const [petForm, setPetForm] = useState<PetRequestDto>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<PetResponseDto | null>(null);
  const [assignTarget, setAssignTarget] = useState<PetResponseDto | null>(null);
  const [selectedVetId, setSelectedVetId] = useState<number | ''>('');

  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });

  // Fetch vets for vet assignment
  const { data: vets = [] } = useQuery({
    queryKey: ['vets'],
    queryFn: () => userApi.getAllVets(),
  });

  // pagination & filtering
  const filtered = (pets as PetResponseDto[]).filter(p => {
    const q = debouncedSearch.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.species?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PETS_PER_PAGE));
  const paginated = filtered.slice(page * PETS_PER_PAGE, (page + 1) * PETS_PER_PAGE);

  // Mutations for db modifications regarding pets
  const addMutation = useMutation({
    mutationFn: (dto: PetRequestDto) => petApi.addPet({ petRequestDto: dto }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pets'] }); toast.success('Pet added!'); closePetModal(); },
    onError: () => toast.error('Failed to add pet'),
  });
  const editMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PetRequestDto }) => petApi.updatePet({ petId: id, petRequestDto: dto }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pets'] }); toast.success('Pet updated!'); closePetModal(); },
    onError: () => toast.error('Failed to update pet'),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => petApi.deletePet({ petId: id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pets'] }); toast.success('Pet deleted!'); setDeleteTarget(null); },
    onError: () => toast.error('Failed to delete pet'),
  });
  const assignMutation = useMutation({
    mutationFn: ({ vetId, petId }: { vetId: number; petId: number }) =>
      userApi.assignPetToVet({ vetId, petId }),
    onSuccess: async (_, { petId, vetId }) => {
      await qc.invalidateQueries({ queryKey: ['pets'] });
      const updatedPets = qc.getQueryData<PetResponseDto[]>(['pets']);
      const updated = updatedPets?.find(p => p.id === petId);
      if (updated) setAssignTarget(updated);
      else setAssignTarget(prev => prev ? { ...prev, assignedVetIds: [...(prev.assignedVetIds ?? []), vetId] } : prev);
      toast.success('Vet assigned!');
      setSelectedVetId('');
    },
    onError: () => toast.error('Failed to assign vet'),
  });
  const removeVetMutation = useMutation({
    mutationFn: ({ vetId, petId }: { vetId: number; petId: number }) =>
      userApi.removePetFromVet({ vetId, petId }),
    onSuccess: async (_, { petId, vetId }) => {
      await qc.invalidateQueries({ queryKey: ['pets'] });
      const updatedPets = qc.getQueryData<PetResponseDto[]>(['pets']);
      const updated = updatedPets?.find(p => p.id === petId);
      if (updated) setAssignTarget(updated);
      else setAssignTarget(prev => prev ? { ...prev, assignedVetIds: (prev.assignedVetIds ?? []).filter(id => id !== vetId) } : prev);
      toast.success('Vet removed!');
    },
    onError: () => toast.error('Failed to remove vet'),
  });

  const openAdd = () => { setEditPet(null); setPetForm(emptyForm); setShowPetModal(true); };
  const openEdit = (p: PetResponseDto) => {
    setEditPet(p);
    setPetForm({ name: p.name ?? '', species: p.species ?? '', breed: p.breed ?? '', age: p.age ?? 0 });
    setShowPetModal(true);
  };
  const closePetModal = () => { setShowPetModal(false); setEditPet(null); };
  const handlePetFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPetForm(f => ({ ...f, [name]: name === 'age' ? Number(value) : value }));
  };
  const handlePetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPet?.id) editMutation.mutate({ id: editPet.id, dto: petForm });
    else addMutation.mutate(petForm);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-green-500 px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <User size={30} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">{user?.username ?? '--'}</p>
            <p className="text-green-100 text-sm">{user?.email ?? '--'}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {Array.from(user?.roles ?? []).map(role => (
                <span key={role} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield size={10} />{role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setEditMode(v => !v); setProfileForm({ username: user?.username ?? '', newPassword: '', confirmPassword: '' }); }}
            className="ml-auto bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Pencil size={14} /> {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        { /* Check if edit mode is on */ }
        {!editMode ? (
          <div className="px-6 py-4 space-y-3">
            {[
              { icon: <User size={15} className="text-gray-400" />, label: 'Username', value: user?.username },
              { icon: <Mail size={15} className="text-gray-400" />, label: 'Email', value: user?.email },
              { icon: <Shield size={15} className="text-gray-400" />, label: 'User ID', value: String(user?.id ?? 'N/A') },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">{icon}{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value ?? 'N/A'}</span>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Username</label>
              <input
                value={profileForm.username}
                onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                placeholder={user?.username}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
              <input
                type="password"
                value={profileForm.newPassword}
                onChange={e => setProfileForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <PasswordRules password={profileForm.newPassword} />
            </div>
            {profileForm.newPassword && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={e => setProfileForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setEditMode(false)} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={updateMutation.isPending} className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-60">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        <div className="px-6 pb-5">
          <button
            onClick={() => { dispatch(logout()); goToLogin(); }}
            className="w-full py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Pets management table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><PawPrint size={18} className="text-green-500" />My Pets</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add, edit, delete or assign pets to a vet</p>
          </div>
          <button onClick={openAdd} className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Add Pet
          </button>
        </div>

        {/* Search */}
        <SearchInput
          value={search}
          onChange={v => { setSearch(v); setPage(0); }}
          placeholder="Search by name, species, breed..."
          className="mb-4"
        />

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Species</th>
                <th className="px-4 py-3 text-left">Breed</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No pets found</td></tr>
              ) : paginated.map(pet => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{pet.name}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.species}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.breed ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.age} yrs</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => openEdit(pet)} title="Edit" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      {vets.length > 0 && (
                        <button onClick={() => { setAssignTarget(pet); setSelectedVetId(''); }} title="Assign to vet" className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors">
                          <UserCheck size={14} />
                        </button>
                      )}
                      <button onClick={() => setDeleteTarget(pet)} title="Delete" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          itemLabel="pet"
          onPrev={() => setPage(p => Math.max(0, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))}
        />
      </div>

      {/* Add/Edit Pet Box */}
      {showPetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editPet ? 'Edit Pet' : 'Add Pet'}</h2>
            <form onSubmit={handlePetSubmit} className="space-y-3">
              {(['name', 'species', 'breed'] as const).map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field}</label>
                  <input name={field} value={petForm[field] ?? ''} onChange={handlePetFormChange} required={field !== 'breed'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Age (years)</label>
                <input name="age" type="number" min={0} value={petForm.age} onChange={handlePetFormChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closePetModal} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
                  {editPet ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Box */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Pet"
          message={<>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</>}
          onConfirm={() => deleteTarget.id && deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Delete"
          isPending={deleteMutation.isPending}
        />
      )}

      {/* Assign to Vet Modal */}
      {assignTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Vets</h2>
            <p className="text-sm text-gray-500 mb-4">Veterinarians for <strong>{assignTarget.name}</strong></p>

            {/* Currently assigned vets */}
            {vets.filter((v: UserResponseDto) => assignTarget.assignedVetIds?.includes(v.id!)).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Currently assigned</p>
                <div className="space-y-2">
                  {vets.filter((v: UserResponseDto) => assignTarget.assignedVetIds?.includes(v.id!)).map((vet: UserResponseDto) => (
                    <div key={vet.id} className="flex items-center justify-between p-3 rounded-xl border border-green-200 bg-green-50">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{vet.username}</p>
                        <p className="text-xs text-gray-400">{vet.email}</p>
                      </div>
                      <button
                        onClick={() => assignTarget.id && vet.id && removeVetMutation.mutate({ vetId: vet.id, petId: assignTarget.id! })}
                        disabled={removeVetMutation.isPending}
                        className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unassigned vets */}
            {vets.filter((v: UserResponseDto) => !assignTarget.assignedVetIds?.includes(v.id!)).length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Add a vet</p>
                <div className="space-y-2">
                  {vets.filter((v: UserResponseDto) => !assignTarget.assignedVetIds?.includes(v.id!)).map((vet: UserResponseDto) => (
                    <label key={vet.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedVetId === vet.id ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="vet" value={vet.id} checked={selectedVetId === vet.id}
                        onChange={() => setSelectedVetId(vet.id!)} className="accent-green-500" />
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
              <button onClick={() => { setAssignTarget(null); setSelectedVetId(''); }} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Close</button>
              {selectedVetId !== '' && (
                <button
                  disabled={assignMutation.isPending}
                  onClick={() => assignTarget.id && selectedVetId && assignMutation.mutate({ vetId: Number(selectedVetId), petId: assignTarget.id! })}
                  className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50"
                >
                  Assign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

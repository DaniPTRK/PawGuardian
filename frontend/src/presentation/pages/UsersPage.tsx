import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Trash2, ShieldPlus } from 'lucide-react';
import { userApi } from '../../infrastructure/apis/api-management';
import type { UserResponseDto } from '../../infrastructure/apis/client/models';
import { useDebounce } from '../../infrastructure/hooks/useDebounce';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { extractErrorMessage } from '../../application/models/ErrorResponse';
import { PageHeader, SearchInput, ConfirmModal, Pagination } from '../components/ui';
import EditUserModal from '../components/users/EditUserModal';
import ManageRolesModal from '../components/users/ManageRolesModal';

const PER_PAGE = 8;

const UsersPage: React.FC = () => {
  const { user: me } = useOwnUser();
  const isAdmin = me?.roles?.some(r => r.includes('ADMIN'));
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);

  const [editTarget, setEditTarget] = useState<UserResponseDto | null>(null);
  const [editForm, setEditForm] = useState({ username: '', newPassword: '' });
  const [deleteTarget, setDeleteTarget] = useState<UserResponseDto | null>(null);
  const [roleTarget, setRoleTarget] = useState<UserResponseDto | null>(null);

  const { data: users = [], isLoading } = useQuery<UserResponseDto[]>({
    queryKey: ['users'],
    queryFn: () => userApi.getAllUsers(),
    enabled: !!isAdmin,
  });

  const filtered = [...users]
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    .filter(u => {
      const q = debouncedSearch.toLowerCase();
      return !q || u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || String(u.id).includes(q);
    });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: { username?: string; newPassword?: string } }) =>
      userApi.updateUserById({ userId: id, updateUserDto: dto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
      setEditTarget(null);
    },
    onError: async (err: unknown) => {
      const message = await extractErrorMessage(err, 'Failed to update user');
      toast.error(message, { duration: 5000 });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userApi.deleteUserById({ userId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Could not delete user'),
  });

  const addRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      userApi.promoteToRole({ userId, role }),
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role added');
      setRoleTarget(prev => prev ? { ...prev, roles: new Set([...Array.from(prev.roles ?? []), role]) } : null);
    },
    onError: () => toast.error('Failed to add role'),
  });

  const removeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      userApi.removeRole({ userId, role }),
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role removed');
      setRoleTarget(prev => prev ? { ...prev, roles: new Set(Array.from(prev.roles ?? []).filter(r => r !== role)) } : null);
    },
    onError: () => toast.error('Something went wrong'),
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">You do not have admin privileges to view this page.</p>
      </div>
    );
  }

  const openEdit = (u: UserResponseDto) => {
    setEditTarget(u);
    setEditForm({ username: u.username ?? '', newPassword: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget?.id) return;
    const dto: { username?: string; newPassword?: string } = {};
    if (editForm.username && editForm.username !== editTarget.username) dto.username = editForm.username;
    if (editForm.newPassword) dto.newPassword = editForm.newPassword;
    if (!dto.username && !dto.newPassword) { toast.error('No changes'); return; }
    updateMutation.mutate({ id: editTarget.id, dto });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="View, edit, and manage all users. Admin only." />

      <SearchInput
        value={search}
        onChange={v => { setSearch(v); setPage(0); }}
        placeholder="Search by username, email, or ID..."
      />

      <div className="bg-white border border-gray-100 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No users found</td></tr>
              ) : paginated.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{u.username}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(u.roles ?? []).map(role => (
                        <span key={role} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => openEdit(u)} title="Edit user" className="text-xs text-blue-500 hover:bg-blue-50 px-2 py-1 rounded-lg">Edit</button>
                      <button onClick={() => setRoleTarget(u)} title="Manage roles" className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg"><ShieldPlus size={14} /></button>
                      <button onClick={() => setDeleteTarget(u)} title="Delete user" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-50">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            itemLabel="user"
            onPrev={() => setPage(p => Math.max(0, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          />
        </div>
      </div>

      {editTarget && (
        <EditUserModal
          target={editTarget}
          form={editForm}
          onChange={(field, value) => setEditForm(f => ({ ...f, [field]: value }))}
          onSubmit={handleEditSubmit}
          onClose={() => setEditTarget(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={<>Delete <strong>{deleteTarget.username}</strong> ({deleteTarget.email})? This cannot be undone.</>}
          onConfirm={() => deleteTarget.id && deleteUser.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Delete"
          isPending={deleteUser.isPending}
        />
      )}

      {roleTarget && (
        <ManageRolesModal
          target={roleTarget}
          onAdd={role => roleTarget.id && addRole.mutate({ userId: roleTarget.id, role })}
          onRemove={role => roleTarget.id && removeRole.mutate({ userId: roleTarget.id, role })}
          onClose={() => setRoleTarget(null)}
        />
      )}
    </div>
  );
};

export default UsersPage;

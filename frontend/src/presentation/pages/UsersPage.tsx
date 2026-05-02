import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, Pencil, Trash2, ShieldPlus, ShieldMinus, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { userApi } from '../../infrastructure/apis/api-management';
import type { UserResponseDto } from '../../infrastructure/apis/client/models';
import { useDebounce } from '../../infrastructure/hooks/useDebounce';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';

const PER_PAGE = 8;
const AVAILABLE_ROLES = ['OWNER', 'VET', 'ADMIN'];

const pwRules = (pw: string) => ({
  minLength: pw.length >= 8,
  hasUpper: /[A-Z]/.test(pw),
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

const UsersPage: React.FC = () => {
  const { user: me } = useOwnUser();
  const isAdmin = me?.roles?.some(r => r.includes('ADMIN'));
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);

  // Edit modal
  const [editTarget, setEditTarget] = useState<UserResponseDto | null>(null);
  const [editForm, setEditForm] = useState({ username: '', newPassword: '' });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<UserResponseDto | null>(null);

  // Role modal
  const [roleTarget, setRoleTarget] = useState<UserResponseDto | null>(null);

  const { data: users = [], isLoading } = useQuery<UserResponseDto[]>({
    queryKey: ['users'],
    queryFn: () => userApi.getAllUsers(),
    enabled: !!isAdmin,
  });

  const filtered = [...users].sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).filter(u => {
    const q = debouncedSearch.toLowerCase();
    return !q || u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || String(u.id).includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: { username?: string; newPassword?: string } }) =>
      userApi.updateUserById({ userId: id, updateUserDto: dto }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User updated'); setEditTarget(null); },
    onError: async (err: unknown) => {
      let message = 'Failed to update user';
      try {
        const res = err as { json?: () => Promise<{ message?: string }> };
        if (res.json) {
          const body = await res.json();
          if (body?.message) message = body.message;
        }
      } catch { /* ignore */ }
      toast.error(message, { duration: 5000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userApi.deleteUserById({ userId: id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted'); setDeleteTarget(null); },
    onError: () => toast.error('Failed to delete user'),
  });

  const promoteMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => userApi.promoteToRole({ userId, role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Role added'); },
    onError: () => toast.error('Failed to add role'),
  });

  const removeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => userApi.removeRole({ userId, role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Role removed'); },
    onError: () => toast.error('Failed to remove role'),
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-400 mt-1">View, edit, and manage all users. Admin only.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by username, email, or ID..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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
                      <button onClick={() => openEdit(u)} title="Edit user" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setRoleTarget(u)} title="Manage roles" className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg"><ShieldPlus size={14} /></button>
                      <button onClick={() => setDeleteTarget(u)} title="Delete user" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
          <span className="text-xs text-gray-500">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronLeft size={14} /></button>
            <span className="text-xs text-gray-600 px-1">Page {page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Edit User — {editTarget.username}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
                <input value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New Password <span className="text-gray-400 font-normal">(blank = keep)</span></label>
                <input type="password" value={editForm.newPassword} onChange={e => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                {editForm.newPassword && (() => {
                  const rules = pwRules(editForm.newPassword);
                  return (
                    <ul className="mt-2 space-y-0.5 text-xs">
                      {[
                        { ok: rules.minLength, label: 'At least 8 characters' },
                        { ok: rules.hasUpper, label: 'At least one uppercase letter' },
                        { ok: rules.hasDigit, label: 'At least one digit' },
                        { ok: rules.hasSpecial, label: 'At least one special character (!@#$...)' },
                      ].map(r => (
                        <li key={r.label} className={`flex items-center gap-1.5 ${r.ok ? 'text-green-500' : 'text-gray-400'}`}>
                          {r.ok ? <Check size={12} /> : <X size={12} />} {r.label}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditTarget(null)} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete User</h2>
            <p className="text-sm text-gray-500 mb-6">
              Delete <strong>{deleteTarget.username}</strong> ({deleteTarget.email})? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteTarget.id && deleteMutation.mutate(deleteTarget.id)}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {roleTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Roles</h2>
            <p className="text-sm text-gray-500 mb-4">{roleTarget.username} ({roleTarget.email})</p>
            <div className="space-y-2 mb-5">
              {AVAILABLE_ROLES.map(role => {
                const has = Array.from(roleTarget.roles ?? []).includes(role);
                return (
                  <div key={role} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{role}</span>
                    {has ? (
                      <button
                        onClick={() => roleTarget.id && removeRoleMutation.mutate({ userId: roleTarget.id, role },
                          { onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setRoleTarget(prev => prev ? { ...prev, roles: new Set([...Array.from(prev.roles ?? []).filter(r => r !== role)]) } : null); } })}
                        className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg"
                      >
                        <ShieldMinus size={12} /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => roleTarget.id && promoteMutation.mutate({ userId: roleTarget.id, role },
                          { onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setRoleTarget(prev => prev ? { ...prev, roles: new Set([...Array.from(prev.roles ?? []), role]) } : null); } })}
                        className="flex items-center gap-1 text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg"
                      >
                        <ShieldPlus size={12} /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setRoleTarget(null)} className="w-full py-2 text-sm border rounded-lg hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

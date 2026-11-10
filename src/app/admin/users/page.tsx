'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Eye, 
  Mail, 
  Calendar, 
  Flame, 
  Target
} from 'lucide-react';
import { MOCK_ADMIN_USERS } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, RoleBadge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/Input';
import { Drawer } from '@/components/ui/Drawer';
import { ConfirmationModal } from '@/components/ui/Modal';
import { Profile, UserRole } from '@/types/database';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>(MOCK_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Drawer & Action states
  const [detailUser, setDetailUser] = useState<Profile | null>(null);
  const [suspendModalUser, setSuspendModalUser] = useState<Profile | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleSuspend = (user: Profile) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    if (detailUser && detailUser.id === user.id) {
      setDetailUser({ ...detailUser, status: newStatus });
    }
    setSuspendModalUser(null);
    setStatusToast(`"${user.fullName}" foydalanuvchisi holati o'zgartirildi: ${newStatus}`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (detailUser && detailUser.id === userId) {
      setDetailUser({ ...detailUser, role: newRole });
    }
    setStatusToast(`Foydalanuvchi roli yangilandi: ${newRole}`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {statusToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          {statusToast}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Access Control & Learner Directory
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          User Management
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Barcha ro'yxatdan o'tgan o'rganuvchilar va administratorlar hisoblarini boshqarish, rollarni belgilash va xavfsizlik choralarini qo'llash.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-ivory-200/90 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-card">
        <div className="w-full md:w-80">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search by name or email..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <span className="font-mono text-[11px] text-ink-400 uppercase">Role:</span>
          {['all', 'learner', 'super_admin', 'content_manager', 'support_agent', 'analyst'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-2.5 py-1 rounded-md font-mono transition ${
                selectedRole === r
                  ? 'bg-forest-700 text-white font-bold'
                  : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
              }`}
            >
              {r.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/80 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-2 font-semibold">Role</th>
              <th className="py-3 px-2 font-semibold">Status</th>
              <th className="py-3 px-2 font-semibold">Target</th>
              <th className="py-3 px-2 font-semibold">Registered</th>
              <th className="py-3 px-2 font-semibold">Last Active</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-ivory-50/60 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                      {user.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-ink-950 font-serif text-sm">
                        {user.fullName}
                      </div>
                      <div className="text-[11px] text-ink-500 font-mono">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <RoleBadge role={user.role} />
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      user.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : user.status === 'suspended'
                        ? 'bg-terracotta-100 text-terracotta-700'
                        : 'bg-ivory-200 text-ink-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-2 font-mono">
                  Band {user.targetBand}
                </td>
                <td className="py-3 px-2 font-mono text-ink-500">
                  {user.createdAt.split('T')[0]}
                </td>
                <td className="py-3 px-2 font-mono text-ink-500">
                  {user.lastActiveAt ? user.lastActiveAt.split('T')[0] : 'Never'}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => setDetailUser(user)}
                    className="p-1.5 text-forest-700 hover:text-forest-900 font-semibold"
                    title="View Details"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => setSuspendModalUser(user)}
                    className={`p-1.5 text-xs font-semibold ${
                      user.status === 'suspended'
                        ? 'text-emerald-700 hover:text-emerald-900'
                        : 'text-terracotta-600 hover:text-terracotta-800'
                    }`}
                  >
                    {user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Slide-over Drawer */}
      <Drawer
        isOpen={!!detailUser}
        onClose={() => setDetailUser(null)}
        title={detailUser?.fullName || 'User Profile'}
        subtitle={`ID: ${detailUser?.id}`}
      >
        {detailUser && (
          <div className="space-y-6 text-xs">
            {/* Header Mini */}
            <div className="flex items-center space-x-3 bg-ivory-50 p-4 rounded-xl border border-ivory-200">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 font-bold text-base flex items-center justify-center">
                {detailUser.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-ink-950 leading-tight">
                  {detailUser.fullName}
                </h4>
                <div className="font-mono text-ink-500">{detailUser.email}</div>
                <div className="mt-1 flex items-center space-x-2">
                  <RoleBadge role={detailUser.role} />
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-700">
                    {detailUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Activity Summary */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase text-ink-400 font-bold block">
                Ta'lim Ko'rsatkichlari (Learning Metrics)
              </span>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-white border border-ivory-200 p-3 rounded-lg">
                  <div className="text-ink-400 text-[10px]">Target IELTS Band</div>
                  <div className="text-base font-bold text-forest-800">{detailUser.targetBand}</div>
                </div>
                <div className="bg-white border border-ivory-200 p-3 rounded-lg">
                  <div className="text-ink-400 text-[10px]">Saved Words</div>
                  <div className="text-base font-bold text-forest-800">{detailUser.wordsLearnedCount}</div>
                </div>
                <div className="bg-white border border-ivory-200 p-3 rounded-lg">
                  <div className="text-ink-400 text-[10px]">Study Streak</div>
                  <div className="text-base font-bold text-amber-700">{detailUser.streakDays} days</div>
                </div>
                <div className="bg-white border border-ivory-200 p-3 rounded-lg">
                  <div className="text-ink-400 text-[10px]">Study Minutes</div>
                  <div className="text-base font-bold text-ink-900">{detailUser.totalStudyMinutes} mins</div>
                </div>
              </div>
            </div>

            {/* Role Assignment Control */}
            <div className="space-y-2 pt-3 border-t border-ivory-200">
              <span className="font-mono text-[10px] uppercase text-ink-400 font-bold block">
                Rolni Boshqarish (RBAC Assignment)
              </span>
              <select
                value={detailUser.role}
                onChange={(e) => handleRoleChange(detailUser.id, e.target.value as UserRole)}
                className="w-full bg-white border border-ivory-300 rounded-lg p-2 font-mono text-xs focus:ring-1 focus:ring-forest-700"
              >
                <option value="learner">Learner (Oddiy o'rganuvchi)</option>
                <option value="content_manager">Content Manager (CMS & Lexicon)</option>
                <option value="support_agent">Support Agent (Tickets & Users)</option>
                <option value="analyst">Analyst (Read-only)</option>
                <option value="super_admin">Super Admin (To'liq huquq)</option>
              </select>
            </div>

            {/* Security Actions */}
            <div className="space-y-3 pt-3 border-t border-ivory-200">
              <span className="font-mono text-[10px] uppercase text-ink-400 font-bold block">
                Xavfsizlik Amallari
              </span>

              <Button
                variant={detailUser.status === 'suspended' ? 'primary' : 'destructive'}
                size="sm"
                className="w-full"
                onClick={() => setSuspendModalUser(detailUser)}
              >
                {detailUser.status === 'suspended' ? 'Hisobni Faollashtirish' : 'Hisobni Bloklash (Suspend)'}
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Account Suspend / Reactivate Confirmation Modal */}
      {suspendModalUser && (
        <ConfirmationModal
          isOpen={!!suspendModalUser}
          onClose={() => setSuspendModalUser(null)}
          onConfirm={() => handleToggleSuspend(suspendModalUser)}
          title={
            suspendModalUser.status === 'suspended'
              ? 'Hisobni qayta faollashtirish'
              : 'Hisobni bloklash (Suspend)'
          }
          message={`"${suspendModalUser.fullName}" hisobini ${
            suspendModalUser.status === 'suspended' ? 'qayta faollashtirishni' : 'bloklashni'
          } tasdiqlaysizmi? Bloklangan o'quvchi tizimga kira olmaydi.`}
          confirmLabel={suspendModalUser.status === 'suspended' ? 'Faollashtirish' : 'Bloklash'}
          isDestructive={suspendModalUser.status !== 'suspended'}
        />
      )}

    </div>
  );
}

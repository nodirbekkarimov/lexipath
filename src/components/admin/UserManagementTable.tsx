'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Shield, ShieldAlert, CheckCircle, Ban, Search } from 'lucide-react';
import { Profile, UserRole } from '@/types/database';

interface UserManagementTableProps {
  users: Profile[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
}

export function UserManagementTable({ users, onUpdateRole }: UserManagementTableProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'moderator':
        return 'primary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-ivory-200 shadow-subtle overflow-hidden space-y-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Filter users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-ivory-300 px-3 py-2 bg-ivory-50 focus:outline-none focus:ring-1 focus:ring-forest-600"
          />
        </div>
        <span className="text-xs font-mono text-ink-500">
          Showing {filteredUsers.length} users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-ivory-100 border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-3 font-semibold">Role</th>
              <th className="py-3 px-3 font-semibold">Target Band</th>
              <th className="py-3 px-3 font-semibold">Study Streak</th>
              <th className="py-3 px-3 font-semibold">Minutes Studied</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-ivory-50/70 transition">
                <td className="py-3 px-4">
                  <div className="font-semibold text-ink-950">{u.fullName}</div>
                  <div className="text-[11px] font-mono text-ink-400">{u.email}</div>
                </td>
                <td className="py-3 px-3">
                  <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                    {u.role.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-forest-800">
                  Band {u.targetBand}
                </td>
                <td className="py-3 px-3 font-mono text-ink-600">
                  {u.streakDays} days
                </td>
                <td className="py-3 px-3 font-mono text-ink-600">
                  {u.totalStudyMinutes} mins
                </td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                    className="text-xs bg-ivory-100 border border-ivory-300 rounded px-2 py-1 text-ink-800 focus:outline-none"
                  >
                    <option value="learner">Learner</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

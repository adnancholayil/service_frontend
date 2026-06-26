'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Sparkles, Users, UserCheck } from 'lucide-react';
import { ADMIN_USERS_QUERY } from '../../../graphql/queries/admin';
import Card, { CardBody } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

export default function AdminUsers() {
  const { data, loading, error } = useQuery(ADMIN_USERS_QUERY);

  const users = data?.adminUsers || [];

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-danger">Error: {error.message}</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Users</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Review accounts for customers, providers, and admin assistants.</p>
        </div>
      </div>

      {/* Directory listing table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">User Details</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Email</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Role</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      {usr.avatar ? <Avatar src={usr.avatar} alt={usr.name} size="sm" /> : usr.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{usr.name}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{usr.email}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 capitalize">
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium text-right">
                    {new Date(usr.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Users className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-500">No users found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

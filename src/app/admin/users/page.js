'use client';

import React from 'react';
const MOCK_USERS = [];
import { Sparkles, Users, UserCheck } from 'lucide-react';
import Card, { CardBody } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

export default function AdminUsers() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Platform Users Directory <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review accounts databases for customers, providers, and admin assistants.</p>
      </div>

      {/* Directory listing table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs divide-y divide-border">
            <thead className="bg-muted/40 font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Designated Role</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MOCK_USERS.map((usr) => (
                <tr key={usr.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar src={usr.avatar} alt={usr.name} size="sm" />
                    <span className="font-bold text-foreground">{usr.name}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{usr.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 font-semibold text-brand capitalize">
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <UserCheck className="h-3.5 w-3.5" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

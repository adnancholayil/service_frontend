'use client';

import React, { useState } from 'react';
import { FolderTree, Sparkles, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Category CRUD Manager <FolderTree className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Configure service groups, toggle listings availability, and manage descriptive meta info.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> Create Category
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Empty State */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <FolderTree className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No categories defined</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Create your first category to start organizing the platform's service offerings.</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CATEGORIES } from '../../../graphql/queries/categories';
import { CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION } from '../../../graphql/mutations/admin';
import * as LucideIcons from 'lucide-react';
import { FolderTree, Plus, Trash2, Edit2, Loader2, Sparkles, AlertCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// Filter out non-icon exports and duplicate aliases
const allIconNames = Object.keys(LucideIcons).filter(name => 
  /^[A-Z][a-zA-Z]+$/.test(name) && 
  name !== 'Icon' && 
  name !== 'Default' &&
  !name.endsWith('Icon') && 
  !name.startsWith('Lucide')
);

// High priority icons for home services and related categories
const PRIORITY_ICONS = [
  'Wrench', 'Hammer', 'Brush', 'Paintbrush', 'Fan', 'Snowflake', 'Droplet', 'Zap', 
  'Cpu', 'Monitor', 'Smartphone', 'Scissors', 'WashingMachine', 'MonitorSpeaker', 
  'Home', 'Sparkles', 'Car', 'Camera', 'Briefcase', 'Leaf', 'Wind', 'Plug', 
  'Thermometer', 'Lightbulb', 'Sofa', 'ShieldCheck', 'Settings', 'PenTool', 'Key', 
  'Lock', 'Construction', 'Tool', 'Cable', 'Drill', 'Refrigerator', 'Tv'
].filter(name => allIconNames.includes(name));

const suggestIcon = (name) => {
  if (!name) return '';
  const lower = name.toLowerCase();
  
  // Custom mappings for common service categories
  if (lower.includes('wash') || lower.includes('laundry')) return 'WashingMachine';
  if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('water')) return 'Droplet';
  if (lower.includes('electric') || lower.includes('wire') || lower.includes('light')) return 'Zap';
  if (lower.includes('ac ') || lower.includes('air') || lower.includes('cool') || lower.includes('hvac')) return 'Snowflake';
  if (lower.includes('clean') || lower.includes('sweep') || lower.includes('maid')) return 'Brush';
  if (lower.includes('paint') || lower.includes('color')) return 'Paintbrush';
  if (lower.includes('car ') || lower.includes('auto') || lower.includes('mechanic')) return 'Car';
  if (lower.includes('carpenter') || lower.includes('wood') || lower.includes('furniture')) return 'Hammer';
  if (lower.includes('mobile') || lower.includes('phone') || lower.includes('repair')) return 'Smartphone';
  if (lower.includes('electronic') || lower.includes('tv') || lower.includes('computer') || lower.includes('appliance')) return 'Tv';
  if (lower.includes('salon') || lower.includes('hair') || lower.includes('beauty') || lower.includes('makeup')) return 'Scissors';
  if (lower.includes('photo') || lower.includes('camera')) return 'Camera';
  if (lower.includes('garden') || lower.includes('plant') || lower.includes('tree') || lower.includes('lawn')) return 'Leaf';
  if (lower.includes('room') || lower.includes('home')) return 'Home';
  
  // Try to find a partial match in priority icons first
  const priorityMatch = PRIORITY_ICONS.find(icon => lower.includes(icon.toLowerCase()));
  if (priorityMatch) return priorityMatch;

  // Try to find a partial match in all icons
  const partialMatch = allIconNames.find(icon => lower.includes(icon.toLowerCase()));
  if (partialMatch) return partialMatch;

  return ''; // Return empty string to fallback to Sparkles
};

const renderIcon = (iconName, className = "h-6 w-6") => {
  if (!iconName) return <Sparkles className={className} />;
  const Icon = LucideIcons[iconName];
  if (Icon) return <Icon className={className} />;
  // Fallback to emoji if not a valid Lucide icon
  return <span className="text-xl">{iconName}</span>;
};

const IconPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      const others = allIconNames.filter(name => !PRIORITY_ICONS.includes(name));
      return [...PRIORITY_ICONS, ...others].slice(0, 150);
    }
    const lowerSearch = search.toLowerCase();
    return allIconNames.filter(name => name.toLowerCase().includes(lowerSearch)).slice(0, 150);
  }, [search]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select an Icon">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-[50vh] overflow-y-auto p-1 no-scrollbar">
          {filteredIcons.map(name => {
            const Icon = LucideIcons[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => { onSelect(name); onClose(); setSearch(''); }}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 bg-card hover:border-brand hover:bg-brand/5 hover:text-brand hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
                title={name}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            );
          })}
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No icons found for "{search}"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default function AdminCategories() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY_MUTATION);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY_MUTATION);
  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY_MUTATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [hasManuallySelectedIcon, setHasManuallySelectedIcon] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '', isActive: true });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const categories = data?.categories || [];

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, icon: category.icon || '', isActive: category.isActive });
      setHasManuallySelectedIcon(true);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', icon: '', isActive: true });
      setHasManuallySelectedIcon(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');

    try {
      if (editingCategory) {
        await updateCategory({
          variables: {
            id: editingCategory.id,
            name: formData.name,
            icon: formData.icon,
            isActive: formData.isActive
          }
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory({
          variables: {
            name: formData.name,
            icon: formData.icon
          }
        });
        toast.success('Category created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const handleDelete = (id, name) => {
    setCategoryToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory({ variables: { id: categoryToDelete.id } });
      toast.success('Category deleted');
      setCategoryToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );

  if (error) return (
    <div className="flex h-64 flex-col items-center justify-center text-destructive">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p>Error loading categories</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Category CRUD Manager <FolderTree className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Configure service groups, toggle listings availability, and manage descriptive meta info.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-md">
          <Plus className="h-4 w-4" /> Create Category
        </Button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="md:col-span-full bg-card border border-border rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderTree className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">No categories defined</h2>
            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md">Create your first category to start organizing the platform's service offerings.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-2xl overflow-hidden shrink-0">
                    {renderIcon(category.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{category.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md inline-block mt-1">/{category.slug}</p>
                  </div>
                </div>
                
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Added {new Date(Number(category.createdAt)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(category)} className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(category.id, category.name)} disabled={deleting} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="cat-name"
            label="Category Name"
            placeholder="e.g. Plumbing, Electrical..."
            value={formData.name}
            onChange={(e) => {
              const newName = e.target.value;
              const newFormData = { ...formData, name: newName };
              
              // Auto-suggest icon if we haven't manually picked one yet
              if (!editingCategory && !hasManuallySelectedIcon) {
                const suggested = suggestIcon(newName);
                if (suggested) {
                  newFormData.icon = suggested;
                }
              }
              
              setFormData(newFormData);
            }}
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Icon</label>
            <div 
              onClick={() => setIsIconPickerOpen(true)}
              className="flex items-center gap-3 h-12 w-full px-4 rounded-xl border border-border bg-background cursor-pointer hover:border-brand/50 transition-colors"
            >
              <div className="text-brand shrink-0">
                {renderIcon(formData.icon, "h-5 w-5")}
              </div>
              <span className={`text-sm flex-1 ${formData.icon ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {formData.icon || 'Select an icon...'}
              </span>
              <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs -mr-2 text-brand">Change</Button>
            </div>
          </div>
          
          {editingCategory && (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card mt-2">
              <div>
                <p className="font-semibold text-sm">Status</p>
                <p className="text-xs text-muted-foreground">Control if this category is visible</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creating || updating}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <IconPickerModal 
        isOpen={isIconPickerOpen} 
        onClose={() => setIsIconPickerOpen(false)} 
        onSelect={(iconName) => {
          setFormData({ ...formData, icon: iconName });
          setHasManuallySelectedIcon(true);
        }}
      />

      <ConfirmModal 
        isOpen={!!categoryToDelete} 
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This will affect services under this category.`}
        confirmText="Delete"
      />
    </div>
  );
}

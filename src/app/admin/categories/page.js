'use client';

import React, { useState } from 'react';
const CATEGORIES = [];
import { Sparkles, Plus, Trash2, FolderTree } from 'lucide-react';
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!name || !description) return;

    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newCat = {
      id,
      name,
      description,
      icon: 'Sparkles'
    };

    setCategories(prev => [...prev, newCat]);
    setName('');
    setDescription('');
    setIsAddModalOpen(false);
    toast.success('Category added successfully!');
  };

  const handleDelete = (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== catId));
      toast.success('Category deleted');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Service Category CRUD Manager <Sparkles className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configure service groups, toggle listings availability, and manage descriptive meta info.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 rounded-xl text-xs py-2">
          <Plus className="h-4 w-4" /> Create Category
        </Button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="bg-card">
            <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-brand" /> {cat.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{cat.description}</p>
              </div>
              <div className="pt-3 border-t border-border/60 flex justify-end">
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Category">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Electrician, Interior Designer"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              placeholder="Provide a summary of what services are catalogued under this folder..."
              required
              className="w-full p-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

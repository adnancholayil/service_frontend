'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ArrowLeft, MapPin, Trash2, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { addAddress, removeAddress } from '../../../store/slices/userSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

export default function AddressesPage() {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.user.addresses);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [addressDetails, setAddressDetails] = useState('');

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressName || !addressDetails) {
      toast.error('Please enter tag name and address');
      return;
    }

    dispatch(addAddress({
      name: addressName.trim(),
      address: addressDetails.trim()
    }));

    setAddressName('');
    setAddressDetails('');
    setIsAddModalOpen(false);
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Delete this address?')) {
      dispatch(removeAddress(id));
      toast.success('Address deleted');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      <div>
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            My Addresses <Sparkles className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configure and manage address tags for booking visits.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 rounded-xl text-xs py-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
            <MapPin className="h-10 w-10 text-muted-foreground opacity-40" />
            <h3 className="font-bold text-lg text-muted-foreground">No addresses configured</h3>
            <p className="text-xs text-muted-foreground">Add an address tag (e.g. Home, Office) to make scheduling bookings easier.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 border border-border bg-card rounded-xl flex items-start justify-between gap-4"
            >
              <div className="flex gap-3 items-start">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-lg shrink-0 mt-0.5"><MapPin className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{addr.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{addr.address}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Address Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Address Tag">
        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
          <Input
            label="Tag Name (e.g. Home, Office, Beach House)"
            placeholder="Home"
            required
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address Details</label>
            <textarea
              rows={3}
              placeholder="Flat 402, Sunset Heights, Main Street, NY"
              required
              className="w-full p-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-sm"
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

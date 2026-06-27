'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Settings, MapPin, Heart, Star, Sparkles, 
  LogOut, Plus, Trash2, ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { logout, updateProfile } from '../../store/slices/authSlice';
import { addAddress, removeAddress, removeFavorite } from '../../store/slices/userSlice';
import Avatar from '../../components/ui/Avatar';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ImageUpload from '../../components/ui/ImageUpload';
import { openLogoutModal } from '../../store/slices/appSlice';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Data from state
  const favorites = useSelector((state) => state.user.favorites);
  const addresses = useSelector((state) => state.user.addresses);
  const bookings = useSelector((state) => state.booking.bookings);
  const providers = useSelector((state) => state.provider.providers);
  const reviews = useSelector((state) => state.user.reviews);

  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    dispatch(openLogoutModal());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'edit', label: 'Edit Profile', icon: Settings },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          My Account <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage profile, addresses, and view your bookings statistics.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        
        {/* Left Side: Profile Summary Card & Sidebar Navigation */}
        <div className="md:w-80 shrink-0 space-y-6">
          <Card className="bg-card shadow-sm border-border">
            <CardBody className="p-6 text-center space-y-4">
              <Avatar src={user?.avatar} alt={user?.name || 'Customer'} size="xl" className="mx-auto rounded-full ring-4 ring-muted" />
              <div>
                <h3 className="text-lg font-bold text-foreground">{user?.name}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-around text-center text-xs">
                <div>
                  <p className="font-extrabold text-foreground">{bookings.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Bookings</p>
                </div>
                <div className="border-l border-border h-8" />
                <div>
                  <p className="font-extrabold text-foreground">{favorites.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Favorites</p>
                </div>
                <div className="border-l border-border h-8" />
                <div>
                  <p className="font-extrabold text-foreground">{addresses.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Addresses</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Vertical Tabs */}
          <div className="bg-card rounded-2xl border border-border p-2 hidden md:block shadow-sm">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                      isActive 
                        ? 'bg-brand text-white shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                Logout
              </button>
            </nav>
          </div>

          {/* Mobile Horizontal Tabs */}
          <div className="md:hidden overflow-x-auto pb-2 scrollbar-hide flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                    isActive 
                      ? 'bg-brand text-white shadow-sm' 
                      : 'bg-muted text-muted-foreground hover:text-foreground cursor-pointer'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Content */}
        <div className="flex-1 bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'edit' && <EditProfileTab user={user} dispatch={dispatch} />}
            {activeTab === 'addresses' && <AddressesTab addresses={addresses} dispatch={dispatch} />}
            {activeTab === 'favorites' && <FavoritesTab favoriteIds={favorites} providers={providers} dispatch={dispatch} />}
            {activeTab === 'reviews' && <ReviewsTab reviews={reviews} />}
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Tab Components
// ---------------------------------------------------------

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">Welcome to your Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Select a tab on the left to manage your account details, addresses, and favorites.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border border-border bg-muted/30 rounded-2xl">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl inline-block mb-3"><Settings className="h-5 w-5" /></div>
          <h4 className="font-bold text-sm text-foreground">Complete your profile</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Ensure your contact info and avatar are up to date for a better experience.</p>
        </div>
        <div className="p-5 border border-border bg-muted/30 rounded-2xl">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl inline-block mb-3"><MapPin className="h-5 w-5" /></div>
          <h4 className="font-bold text-sm text-foreground">Add service addresses</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Pre-fill addresses to make booking home services faster and easier.</p>
        </div>
      </div>
    </div>
  );
}

function EditProfileTab({ user, dispatch }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      dispatch(updateProfile({ name, email, avatar }));
      setIsSubmitting(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          Edit Profile Details <Sparkles className="h-5 w-5 text-brand" />
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Modify your credentials and profile avatar links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="pt-2">
            <ImageUpload 
              label="Avatar Profile Photo" 
              initialImage={avatar} 
              onUpload={(url) => setAvatar(url)} 
            />
          </div>
        </div>
        <div className="pt-6 border-t border-border flex justify-end">
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto min-w-[150px]">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

function AddressesTab({ addresses, dispatch }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressName || !addressDetails) {
      toast.error('Please enter tag name and address');
      return;
    }
    dispatch(addAddress({ name: addressName.trim(), address: addressDetails.trim() }));
    setAddressName('');
    setAddressDetails('');
    setIsAddModalOpen(false);
    toast.success('Address added successfully!');
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(removeAddress(addressToDelete));
      toast.success('Address deleted');
      setAddressToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Addresses</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage locations for your bookings.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 rounded-xl text-xs py-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-muted/30 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
            <MapPin className="h-10 w-10 text-muted-foreground opacity-40 mb-4" />
            <h3 className="font-bold text-base text-foreground mb-1">No addresses configured</h3>
            <p className="text-xs text-muted-foreground max-w-sm">Add your home, office, or other locations to make booking services faster.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="p-5 border border-border hover:border-brand/40 transition-colors bg-card rounded-2xl flex flex-col justify-between gap-4 h-full relative group shadow-sm">
              <div className="flex gap-4 items-start">
                <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl shrink-0"><MapPin className="h-5 w-5" /></span>
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="font-bold text-sm text-foreground mb-1 truncate">{addr.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{addr.address}</p>
                </div>
              </div>
              <button 
                onClick={() => setAddressToDelete(addr.id)} 
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                title="Delete Address"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Address Tag">
        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
          <Input label="Tag Name (e.g. Home, Office)" placeholder="Home" required value={addressName} onChange={(e) => setAddressName(e.target.value)} />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address Details</label>
            <textarea rows={3} required className="w-full p-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-sm" value={addressDetails} onChange={(e) => setAddressDetails(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={!!addressToDelete} 
        onClose={() => setAddressToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? You won't be able to select it for future bookings."
        confirmText="Delete"
      />
    </div>
  );
}

function FavoritesTab({ favoriteIds, providers, dispatch }) {
  const [favoriteToRemove, setFavoriteToRemove] = useState(null);
  const favoriteProviders = providers.filter(p => favoriteIds.includes(p.id));

  const confirmRemove = () => {
    if (favoriteToRemove) {
      dispatch(removeFavorite(favoriteToRemove));
      toast.success('Removed from favorites');
      setFavoriteToRemove(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">Favorite Partners</h2>
        <p className="text-sm text-muted-foreground mt-1">Re-hire your handpicked service experts.</p>
      </div>

      {favoriteProviders.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
          <Heart className="h-10 w-10 text-muted-foreground opacity-40 mb-4" />
          <h3 className="font-bold text-base text-foreground mb-1">No favorite partners</h3>
          <p className="text-xs text-muted-foreground">Save your favorite service providers for easy access later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteProviders.map((p) => (
            <div key={p.id} className="p-5 border border-border hover:border-brand/40 transition-colors bg-card rounded-2xl flex gap-4 items-start shadow-sm">
              <Avatar src={p.avatar} alt={p.name} size="md" className="rounded-xl shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">{p.name}</h4>
                <p className="text-[10px] font-semibold text-brand truncate">{p.title}</p>
                <div className="pt-3 flex gap-2">
                  <Link href={`/providers/${p.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full text-xs py-1.5 h-8">View</Button>
                  </Link>
                  <Button size="sm" variant="danger" className="text-xs py-1.5 h-8 px-3 shrink-0" onClick={() => setFavoriteToRemove(p.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!favoriteToRemove} 
        onClose={() => setFavoriteToRemove(null)}
        onConfirm={confirmRemove}
        title="Remove Favorite"
        message="Are you sure you want to remove this provider from your favorites?"
        confirmText="Remove"
      />
    </div>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">My Reviews & Ratings</h2>
        <p className="text-sm text-muted-foreground mt-1">History of your feedback for completed bookings.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
          <Star className="h-10 w-10 text-muted-foreground opacity-40 mb-4" />
          <h3 className="font-bold text-base text-foreground mb-1">No reviews submitted yet</h3>
          <p className="text-xs text-muted-foreground">You can review service providers after a booking is completed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((rev, i) => (
            <div key={i} className="p-5 border border-border bg-card rounded-2xl space-y-3 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-start gap-4 mb-1">
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">{rev.providerName}</h4>
                  <p className="text-xs font-medium text-brand mt-1">{rev.serviceTitle}</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-1 rounded-full whitespace-nowrap">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className={`h-4 w-4 ${idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed mt-2 flex-grow">&ldquo;{rev.comment}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

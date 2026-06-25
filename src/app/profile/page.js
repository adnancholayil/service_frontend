'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, MapPin, Heart, Star, Sparkles, ShoppingBag, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import { logout } from '../../store/slices/authSlice';
import Avatar from '../../components/ui/Avatar';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.user.favorites);
  const addresses = useSelector((state) => state.user.addresses);
  const bookings = useSelector((state) => state.booking.bookings);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          My Account <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage profile, addresses, and view your bookings statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card">
            <CardBody className="p-6 text-center space-y-4">
              <Avatar src={user?.avatar} alt={user?.name || 'Customer'} size="xl" className="mx-auto rounded-full" />
              <div>
                <h3 className="text-lg font-bold text-foreground">{user?.name}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-brand uppercase tracking-wider">
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

              <div className="pt-4 border-t border-border">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl font-bold cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Quick Links Navigation Options */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link href="/profile/edit" className="block">
              <div className="p-5 border border-border bg-card hover:border-brand/40 hover:shadow-md transition-all rounded-2xl flex items-start gap-4 cursor-pointer h-full">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl shrink-0"><Settings className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Edit Profile</h4>
                  <p className="text-xs text-muted-foreground mt-1">Change name, email, avatar, or password details.</p>
                </div>
              </div>
            </Link>

            <Link href="/profile/addresses" className="block">
              <div className="p-5 border border-border bg-card hover:border-brand/40 hover:shadow-md transition-all rounded-2xl flex items-start gap-4 cursor-pointer h-full">
                <span className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl shrink-0"><MapPin className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Manage Addresses</h4>
                  <p className="text-xs text-muted-foreground mt-1">Update, delete, or configure new visit locations.</p>
                </div>
              </div>
            </Link>

            <Link href="/profile/favorites" className="block">
              <div className="p-5 border border-border bg-card hover:border-brand/40 hover:shadow-md transition-all rounded-2xl flex items-start gap-4 cursor-pointer h-full">
                <span className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl shrink-0"><Heart className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Favorite Providers</h4>
                  <p className="text-xs text-muted-foreground mt-1">Re-hire and monitor your handpicked service experts.</p>
                </div>
              </div>
            </Link>

            <Link href="/profile/reviews" className="block">
              <div className="p-5 border border-border bg-card hover:border-brand/40 hover:shadow-md transition-all rounded-2xl flex items-start gap-4 cursor-pointer h-full">
                <span className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-xl shrink-0"><Star className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">My Reviews</h4>
                  <p className="text-xs text-muted-foreground mt-1">Check reviews logs and rating history of bookings.</p>
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

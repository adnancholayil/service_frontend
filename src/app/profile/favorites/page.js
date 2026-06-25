'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ArrowLeft, Heart, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { removeFavorite } from '../../../store/slices/userSlice';
import Avatar from '../../../components/ui/Avatar';
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.user.favorites);
  const providers = useSelector((state) => state.provider.providers);

  const favoriteProviders = providers.filter(p => favoriteIds.includes(p.id));

  const handleUnfavorite = (id) => {
    dispatch(removeFavorite(id));
    toast.success('Removed from favorites');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      <div>
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Favorite Partners <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Re-hire and monitor your handpicked service experts.</p>
      </div>

      {favoriteProviders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Heart className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No favorite partners</h3>
          <p className="text-xs text-muted-foreground">Click the heart button on service provider profile sheets to add them here.</p>
          <Link href="/providers">
            <Button size="sm">Browse Partners</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteProviders.map((p) => (
            <Card key={p.id} className="bg-card">
              <CardBody className="p-6 flex gap-4 items-start relative">
                <Avatar src={p.avatar} alt={p.name} size="lg" className="rounded-xl shrink-0" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-foreground">{p.name}</h4>
                  <p className="text-xs font-semibold text-brand">{p.title}</p>
                  <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold pt-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {p.rating}
                  </span>
                  
                  <div className="pt-4 flex gap-2">
                    <Link href={`/providers/${p.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs">View Profile</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      className="text-xs shrink-0"
                      onClick={() => handleUnfavorite(p.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

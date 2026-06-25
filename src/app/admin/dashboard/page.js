'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

import Card, { CardBody } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';

export default function AdminDashboard() {
  const providers = useSelector((state) => state.provider.providers);
  const bookings = useSelector((state) => state.booking.bookings);
  
  const pendingVerificationProviders = providers.filter(p => p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Admin Console Dashboard <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview metrics, pending verifications, and user registrations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">1,240</p>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" /> +8% new registrations
              </span>
            </div>
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl"><Users className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Partners Online</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{providers.length}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">Active service providers</span>
            </div>
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl"><Briefcase className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-semibold">Monthly Escrow</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">$18,420</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">Platform-wide transaction volumes</span>
            </div>
            <span className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl"><DollarSign className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disputes</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">2</p>
              <span className="text-[10px] text-rose-500 font-semibold mt-1 block">Awaiting platform intervention</span>
            </div>
            <span className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl"><AlertTriangle className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>
      </div>

      {/* Verification and Log queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue */}
        <div className="space-y-4">
          <h3 className="font-bold text-foreground flex items-center justify-between">
            <span>Pending Partner Verifications</span>
            <Link href="/admin/providers" className="text-xs font-semibold text-brand hover:underline flex items-center">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </h3>

          <div className="space-y-3">
            {pendingVerificationProviders.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-6 border border-border bg-card rounded-2xl text-center">No providers awaiting verification</p>
            ) : (
              pendingVerificationProviders.map((p) => (
                <div key={p.id} className="p-4 border border-border bg-card rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={p.avatar} alt={p.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-xs">{p.title}</p>
                    </div>
                  </div>
                  <Link href="/admin/providers">
                    <Button size="sm" variant="outline" className="text-xs py-1 border-border">
                      Review Docs
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Recent Bookings Logs */}
        <div className="space-y-4">
          <h3 className="font-bold text-foreground flex items-center justify-between">
            <span>Recent Platform Transactions</span>
            <Link href="/admin/bookings" className="text-xs font-semibold text-brand hover:underline flex items-center">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </h3>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="p-4 border border-border bg-card rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold">{b.service.title}</p>
                  <p className="text-muted-foreground leading-normal mt-0.5">Customer: {b.customerName} • Partner: {b.providerName}</p>
                </div>
                <span className="font-bold text-foreground">${b.service.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

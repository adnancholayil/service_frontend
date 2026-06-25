'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Check,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

import { MOCK_PROVIDERS, MOCK_SERVICES } from '../../../constants/mockData';
import { startBookingFlow, updateBookingStep, resetBookingFlow, createBooking } from '../../../store/slices/bookingSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Avatar from '../../../components/ui/Avatar';
import Modal from '../../../components/ui/Modal';

export default function ProviderDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userAddresses = useSelector((state) => state.user.addresses);
  const bookingFlow = useSelector((state) => state.booking.currentBookingFlow);

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking Flow Steps Local State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [paymentCardName, setPaymentCardName] = useState('');
  const [paymentCardNum, setPaymentCardNum] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  // Initial step tracker (1 to 8)
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    const prov = MOCK_PROVIDERS.find(p => p.id === id);
    if (prov) {
      setProvider(prov);
      // Filter services offered by this provider
      const provServices = MOCK_SERVICES.filter(s => prov.services.includes(s.id));
      setServices(provServices);

      // Pre-select service from URL query parameter if available
      const preselectedServiceId = searchParams.get('service');
      if (preselectedServiceId) {
        const foundSrv = provServices.find(s => s.id === preselectedServiceId);
        if (foundSrv) setSelectedService(foundSrv);
      }
    }
  }, [id, searchParams]);

  // Open booking modal triggers
  useEffect(() => {
    if (searchParams.get('book') === 'true' && provider) {
      handleStartBooking();
    }
  }, [searchParams, provider]);

  const handleStartBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book services');
      router.push(`/login?redirect=/providers/${id}`);
      return;
    }
    
    // Reset wizard
    setBookingStep(1);
    // If no service was preselected, pick the first service offered
    if (!selectedService && services.length > 0) {
      setSelectedService(services[0]);
    }
    // Pre-select first address if available
    if (userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0]);
    }

    setIsBookingModalOpen(true);
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && !selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (bookingStep === 2 && !selectedAddress) {
      toast.error('Please select an address');
      return;
    }
    if (bookingStep === 3 && !bookingDate) {
      toast.error('Please select a booking date');
      return;
    }
    if (bookingStep === 4 && !bookingTime) {
      toast.error('Please select a booking time slot');
      return;
    }
    if (bookingStep === 7) {
      if (!paymentCardNum || !paymentCardName) {
        toast.error('Please enter mock payment details');
        return;
      }
      handleCompleteBooking();
      return;
    }
    setBookingStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(prev => prev - 1);
    }
  };

  const handleCompleteBooking = () => {
    setIsSubmitting(true);
    toast.loading('Processing payment...');

    setTimeout(() => {
      toast.dismiss();
      const newBookingId = `bk-${Math.floor(100 + Math.random() * 900)}`;
      
      const newBooking = {
        id: newBookingId,
        customerId: user?.id || 'cust-1',
        customerName: user?.name || 'John Doe',
        providerId: provider.id,
        providerName: provider.name,
        service: {
          id: selectedService.id,
          title: selectedService.title,
          price: selectedService.price,
        },
        address: selectedAddress.address,
        date: bookingDate,
        time: bookingTime,
        notes: bookingNotes,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      };

      dispatch(createBooking(newBooking));
      setConfirmedBookingId(newBookingId);
      setIsSubmitting(false);
      setBookingStep(8); // success step
      toast.success('Booking created successfully!');
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    // Remove query params
    const params = new URLSearchParams(window.location.search);
    params.delete('book');
    router.replace(`/providers/${id}`);
  };

  if (!provider) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* 1. Cover Image Header */}
      <div className="h-64 sm:h-80 w-full relative bg-zinc-200 dark:bg-zinc-800">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back navigation inside cover */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/providers">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-xl border border-border shadow-sm transition-all cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> Back to Providers
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content container overlapping the banner */}
      <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-4 -mt-24 pb-20 relative z-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
            <Avatar src={provider.avatar} alt={provider.name} size="xl" className="h-32 w-32 rounded-2xl border-4 border-card shadow-md shrink-0" />
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-50" /> Verified Partner
              </span>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{provider.name}</h1>
              <p className="text-sm font-semibold text-brand">{provider.title}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" /> {provider.rating}
                </span>
                <span>•</span>
                <span>{provider.reviewsCount} reviews</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium"><MapPin className="h-4 w-4" /> NY Metropolitan Area</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold text-sm shadow-md cursor-pointer" onClick={handleStartBooking}>
              Book Now
            </Button>
          </div>
        </div>

        {/* Content Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-foreground">About {provider.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{provider.about}</p>
            </div>

            {/* Services catalog offered */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-foreground">Services Offered</h2>
              <div className="divide-y divide-border">
                {services.map((srv) => (
                  <div key={srv.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-sm">{srv.title}</h3>
                      <p className="text-xs text-muted-foreground">{srv.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold pt-1">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {srv.duration}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-foreground">${srv.price}</p>
                      <button
                        onClick={() => {
                          setSelectedService(srv);
                          handleStartBooking();
                        }}
                        className="text-xs font-semibold text-brand hover:underline mt-1 block cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-foreground">Work Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {provider.portfolio.map((imgUrl, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted border border-border hover:shadow-md transition-shadow">
                    <img src={imgUrl} alt={`Portfolio work ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-foreground">Customer Reviews ({provider.reviewsCount})</h2>
              <div className="space-y-4 divide-y divide-border">
                {provider.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">{rev.user}</h4>
                      <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(rev.rating) ? 'fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Availability */}
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-brand" /> Work Availability
              </h3>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="font-semibold text-muted-foreground">Operating Days</span>
                  <span className="text-foreground text-right">{provider.availability.days.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Working Hours</span>
                  <span className="text-foreground">{provider.availability.hours[0]}</span>
                </div>
              </div>

              <Button variant="primary" className="w-full font-bold shadow-xs mt-4" onClick={handleStartBooking}>
                Check Availability & Book
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. MULTI-STEP BOOKING WIZARD MODAL (8 steps) */}
      <Modal isOpen={isBookingModalOpen} onClose={handleCloseModal} title={`Book ${provider.name}`}>
        <div className="space-y-6">
          
          {/* Progress Indicator Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span className="uppercase tracking-wider">Step {bookingStep} of 8</span>
              <span>{Math.floor((bookingStep / 8) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand h-full transition-all duration-300"
                style={{ width: `${(bookingStep / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Contents */}
          <div className="py-2">
            
            {/* Step 1: Select Service */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Select Service</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Which service do you need {provider.name} to perform?</p>
                </div>
                <div className="space-y-2">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        selectedService?.id === srv.id
                          ? 'border-brand bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{srv.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Duration: {srv.duration}</p>
                      </div>
                      <span className="font-bold text-foreground">${srv.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Address */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Choose Service Address</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Where should the provider visit?</p>
                </div>
                <div className="space-y-2">
                  {userAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                        selectedAddress?.id === addr.id
                          ? 'border-brand bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold">{addr.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{addr.address}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/profile/addresses" className="inline-block text-xs font-semibold text-brand hover:underline mt-2">
                    + Add New Address in Settings
                  </Link>
                </div>
              </div>
            )}

            {/* Step 3: Choose Date */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Choose Date</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Pick a suitable date for the service</p>
                </div>
                <div className="max-w-xs">
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Choose Time */}
            {bookingStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Choose Time Slot</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Select a preferred hours slot</p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-w-sm">
                  {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBookingTime(t)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        bookingTime === t
                          ? 'border-brand bg-brand text-white shadow-sm'
                          : 'bg-card text-muted-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Notes */}
            {bookingStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Add Booking Notes</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Optional instructions or descriptions for the service partner</p>
                </div>
                <textarea
                  placeholder="e.g. Please bring extra wire, or knock on back door..."
                  rows={4}
                  className="w-full p-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm transition-all"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
            )}

            {/* Step 6: Summary */}
            {bookingStep === 6 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground">Booking Summary</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Please review your booking details before making payment</p>
                </div>

                <div className="border border-border rounded-xl divide-y divide-border bg-zinc-50/40 dark:bg-zinc-900/20 overflow-hidden text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-muted-foreground">Provider</span>
                    <span className="font-bold text-foreground">{provider.name}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-muted-foreground">Service Item</span>
                    <span className="font-bold text-foreground">{selectedService?.title}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-semibold text-muted-foreground">Scheduled Time</span>
                    <span className="font-bold text-foreground">{bookingDate} @ {bookingTime}</span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-6">
                    <span className="font-semibold text-muted-foreground shrink-0">Address</span>
                    <span className="font-bold text-foreground text-right leading-tight">{selectedAddress?.address}</span>
                  </div>
                  <div className="p-3 flex justify-between font-bold text-sm bg-muted/40">
                    <span className="text-foreground">Total Price</span>
                    <span className="text-brand">${selectedService?.price}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Payment */}
            {bookingStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">Payment Details</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Secure payment via simulated Stripe Integration</p>
                  </div>
                  <span className="text-lg font-extrabold text-brand">${selectedService?.price}</span>
                </div>

                <div className="p-4 border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Payment is held in escrow. Payout is released to the provider only when you mark the booking as completed.
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Cardholder Name"
                    required
                    placeholder="John Doe"
                    value={paymentCardName}
                    onChange={(e) => setPaymentCardName(e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      label="Card Number"
                      required
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={paymentCardNum}
                      onChange={(e) => setPaymentCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    />
                    <CreditCard className="h-5 w-5 text-muted-foreground absolute right-3 bottom-2.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Success */}
            {bookingStep === 8 && (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-foreground">Booking Confirmed!</h4>
                  <p className="text-xs text-muted-foreground">Your appointment ID is <span className="font-bold text-foreground">{confirmedBookingId}</span></p>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Alex Mercer has been notified and will arrive on <span className="font-semibold text-foreground">{bookingDate}</span> at <span className="font-semibold text-foreground">{bookingTime}</span>.
                </p>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Link href="/bookings" className="flex-1">
                    <Button variant="primary" className="w-full rounded-xl">
                      View Bookings
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Wizard Actions Footer */}
          {bookingStep < 8 && (
            <div className="flex gap-3 pt-4 border-t border-border">
              {bookingStep > 1 && (
                <Button
                  variant="outline"
                  className="rounded-xl flex-1 justify-center border-border"
                  onClick={handlePrevStep}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                isLoading={isSubmitting}
                className="rounded-xl flex-1 justify-center"
                onClick={handleNextStep}
              >
                {bookingStep === 7 ? 'Pay & Confirm' : 'Continue'}
              </Button>
            </div>
          )}

        </div>
      </Modal>

    </div>
  );
}

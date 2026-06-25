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

import { useQuery } from '@apollo/client/react';
import { GET_PROVIDER_DETAILS } from '../../../graphql/queries/provider';
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

  const { data, loading, error } = useQuery(GET_PROVIDER_DETAILS, {
    variables: { id: id },
    skip: !id
  });

  useEffect(() => {
    if (data?.providerDetails) {
      setProvider(data.providerDetails);
      setServices(data.providerDetails.services || []);

      const preselectedServiceId = searchParams.get('service');
      if (preselectedServiceId) {
        const foundSrv = data.providerDetails.services?.find(s => s.id === preselectedServiceId);
        if (foundSrv) setSelectedService(foundSrv);
      }
    }
  }, [data, searchParams]);

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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6 sm:p-10 min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-background">
      {/* 1. Cover Image Header */}
      <div className="h-40 sm:h-64 w-full relative bg-muted">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        
        {/* Back navigation inside cover */}
        <div className="absolute top-4 sm:top-6 left-3 sm:left-8 z-10">
          <Link href="/providers">
            <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-background/80 hover:bg-background backdrop-blur-md text-foreground text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-border shadow-sm transition-all cursor-pointer">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Back
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content container overlapping the banner */}
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 -mt-16 sm:-mt-20 relative z-10 pb-20 space-y-4 sm:space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row gap-4 sm:gap-6 md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center sm:items-start text-center sm:text-left">
            <Avatar src={provider.user?.avatar} alt={provider.businessName} size="xl" className="h-20 w-20 sm:h-28 sm:w-28 rounded-full border-4 border-background shadow-lg shrink-0 -mt-12 sm:mt-0" />
            <div className="space-y-1 sm:space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                {provider.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-brand/10 text-brand text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Verified Pro
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-500 text-amber-500" /> {provider.rating} ({provider.reviewsCount})
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">{provider.businessName}</h1>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">{provider.category?.name}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-muted-foreground pt-0.5 sm:pt-1">
                <span className="flex items-center gap-1 sm:gap-1.5"><MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand" /> NY Metropolitan Area</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-1.5 sm:gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Button variant="primary" className="w-full md:w-40 font-bold shadow-lg shadow-brand/25 text-xs sm:text-sm py-3 sm:py-5 rounded-xl sm:rounded-2xl cursor-pointer" onClick={handleStartBooking}>
              Book Now
            </Button>
            <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground font-semibold uppercase tracking-wider">Responds quickly</p>
          </div>
        </div>

        {/* Content Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pt-1 sm:pt-2">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* About */}
            <div className="p-4 sm:p-6 bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm space-y-2 sm:space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 sm:w-2 h-full bg-brand" />
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-1.5 sm:gap-2">
                About {provider.businessName}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{provider.about}</p>
            </div>

            {/* Services catalog offered */}
            <div className="p-4 sm:p-6 bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-black text-foreground">Services Offered</h2>
              <div className="space-y-2 sm:space-y-3">
                {services.map((srv) => (
                  <div key={srv.id} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 sm:gap-4 group">
                    <div className="space-y-1 sm:space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 leading-snug">{srv.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{srv.description}</p>
                      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-muted-foreground font-semibold pt-0.5 sm:pt-1">
                        <span className="flex items-center gap-1 bg-background px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-border/50"><Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand" /> {srv.duration}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5 sm:gap-2">
                      <p className="font-black text-base sm:text-lg text-foreground">${srv.price}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] sm:text-xs rounded-lg sm:rounded-xl px-3 sm:px-4 py-1 sm:py-1.5 border-border shadow-sm hover:border-brand hover:text-brand"
                        onClick={() => {
                          setSelectedService(srv);
                          handleStartBooking();
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="p-4 sm:p-6 bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-black text-foreground">Work Portfolio</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {provider.portfolio.map((imgUrl, i) => (
                  <div key={i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-muted border border-border hover:shadow-md transition-shadow group relative cursor-pointer">
                    <img src={imgUrl} alt={`Portfolio work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="p-4 sm:p-6 bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-black text-foreground">Customer Reviews</h2>
              <div className="space-y-3 sm:space-y-4 divide-y divide-border/50">
                {provider.reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 sm:pt-4 first:pt-0 space-y-2 sm:space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar src={`https://ui-avatars.com/api/?name=${rev.user}&background=random`} alt={rev.user} size="sm" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">{rev.user}</h4>
                          <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                                  i < Math.floor(rev.rating) ? 'fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">{rev.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-8 sm:pl-11">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Availability */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-5 sticky top-20 sm:top-24">
              <div className="bg-brand/5 border border-brand/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 text-brand">
                <div className="p-1.5 sm:p-2 bg-brand/10 rounded-lg sm:rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">Booking Availability</h3>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold opacity-80">Currently Accepting Jobs</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2 text-xs sm:text-sm">
                <div className="space-y-1 sm:space-y-1.5">
                  <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Operating Days</span>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <span key={day} className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border font-semibold ${provider.availability.days.includes(day) ? 'bg-background text-foreground border-border' : 'bg-muted/30 text-muted-foreground/30 border-transparent line-through'}`}>
                        {day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 border-t border-border/50">
                  <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Working Hours</span>
                  <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-foreground text-xs sm:text-sm bg-muted/40 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-border/50">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                    {provider.availability.hours[0]}
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-border/50">
                <Button variant="primary" className="w-full font-bold shadow-md shadow-brand/20 py-3 sm:py-5 text-xs sm:text-sm rounded-xl sm:rounded-2xl" onClick={handleStartBooking}>
                  Book Appointment
                </Button>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-[9px] sm:text-[10px] text-muted-foreground font-semibold">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Payments protected by Escrow
                </div>
              </div>
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
                        <p className="text-sm text-muted-foreground leading-relaxed">{provider.bio || 'No biography available.'}</p>
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

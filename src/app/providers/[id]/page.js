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
  FileText,
  MessageCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PROVIDER_DETAILS } from '../../../graphql/queries/provider';
import { CREATE_BOOKING_MUTATION } from '../../../graphql/mutations/bookings';
import { GET_MY_BOOKINGS } from '../../../graphql/queries/bookings';
import { ADD_REVIEW_MUTATION } from '../../../graphql/mutations/reviews';
import { GET_OR_CREATE_CONVERSATION } from '../../../graphql/queries/chat';
import { startBookingFlow, updateBookingStep, resetBookingFlow } from '../../../store/slices/bookingSlice';
import { openAuthModal } from '../../../store/slices/appSlice';
import { addAddress } from '../../../store/slices/userSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Avatar from '../../../components/ui/Avatar';
import Modal from '../../../components/ui/Modal';
import ReviewModal from '../../../components/modals/ReviewModal';

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [eligibleBookingId, setEligibleBookingId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Booking Flow Steps Local State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [paymentTiming, setPaymentTiming] = useState('after');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentCardName, setPaymentCardName] = useState('');
  const [paymentCardNum, setPaymentCardNum] = useState('');
  const [paymentUpiId, setPaymentUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [bookingPhone, setBookingPhone] = useState(user?.phone || '');
  
  // Inline Add Address State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [newAddressName, setNewAddressName] = useState('');
  const [newAddressDetails, setNewAddressDetails] = useState('');

  // Initial step tracker (1 to 8)
  const [bookingStep, setBookingStep] = useState(1);

  const { data, loading, error, refetch: refetchProvider } = useQuery(GET_PROVIDER_DETAILS, {
    variables: { id: id },
    skip: !id
  });

  const { data: bookingsData } = useQuery(GET_MY_BOOKINGS, {
    skip: !isAuthenticated,
    fetchPolicy: 'cache-and-network'
  });

  const [addReviewMutation, { loading: isSubmittingReview }] = useMutation(ADD_REVIEW_MUTATION);
  const [getOrCreateConversation] = useMutation(GET_OR_CREATE_CONVERSATION);

  const handleMessageProvider = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to message this provider');
      dispatch(openAuthModal('login'));
      return;
    }
    
    try {
      const { data } = await getOrCreateConversation({
        variables: { userId: provider.user.id }
      });
      if (data?.getOrCreateConversation?.id) {
        router.push(`/messages?conversationId=${data.getOrCreateConversation.id}`);
      }
    } catch (err) {
      console.error('Failed to open chat:', err);
      toast.error('Could not start conversation. Please try again.');
    }
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to write a review');
      dispatch(openAuthModal('login'));
      return;
    }

    if (!bookingsData || !bookingsData.bookings) {
      toast.error('Unable to fetch your booking history.');
      return;
    }

    // Check if the user has a COMPLETED booking with this provider
    const completedBookings = bookingsData.bookings.filter(b => 
      b.provider?.id === provider.id && b.status === 'COMPLETED'
    );

    if (completedBookings.length === 0) {
      toast.error('You must have a completed booking with this provider to leave a review.');
      return;
    }

    // Set the eligible booking ID (just use the most recent one)
    // Sort descending by date just in case
    const sorted = [...completedBookings].sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    setEligibleBookingId(sorted[0].id);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (rating, comment) => {
    try {
      await addReviewMutation({
        variables: {
          bookingId: eligibleBookingId,
          rating: rating,
          comment: comment
        }
      });
      toast.success('Thank you! Your review has been submitted.');
      setIsReviewModalOpen(false);
      refetchProvider(); // Refresh provider data to show new review
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to submit review');
    }
  };

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
      dispatch(openAuthModal('login'));
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
    // Pre-select date
    setBookingDate(new Date().toISOString().split('T')[0]);

    setIsBookingModalOpen(true);

    // Clean up URL parameters so the modal doesn't reopen on component re-renders
    const params = new URLSearchParams(window.location.search);
    if (params.has('book') || params.has('service')) {
      params.delete('book');
      params.delete('service');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  };

  const handleConfirmBookingClick = () => {
    if (!selectedService) return toast.error('Please select a service');
    if (!bookingDate) return toast.error('Please select a date');
    if (!bookingTime) return toast.error('Please select a time slot');
    if (!selectedAddress) return toast.error('Please select an address');
    if (!bookingPhone) return toast.error('Please provide a mobile number');
    
    handleCompleteBooking();
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddressName || !newAddressDetails) {
      toast.error('Please enter a name and address details');
      return;
    }
    dispatch(addAddress({ name: newAddressName.trim(), address: newAddressDetails.trim() }));
    toast.success('Address added successfully!');
    setNewAddressName('');
    setNewAddressDetails('');
    setIsAddAddressModalOpen(false);
  };

  const [createBookingMut] = useMutation(CREATE_BOOKING_MUTATION);

  const handleCompleteBooking = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Processing payment...');

    try {
      const { data: bookData } = await createBookingMut({
        variables: {
          serviceId: selectedService.id,
          bookingDate: `${bookingDate}T${bookingTime === '09:00 AM' ? '09:00' : bookingTime === '11:00 AM' ? '11:00' : bookingTime === '02:00 PM' ? '14:00' : '16:00'}:00.000Z`,
          address: selectedAddress?.address || 'Address not provided',
          coordinates: [0, 0],
          notes: bookingNotes
        },
        refetchQueries: [{ query: GET_MY_BOOKINGS }]
      });
      toast.dismiss(loadingToast);
      setConfirmedBookingId(bookData?.createBooking?.id || 'N/A');
      setIsSubmitting(false);
      setBookingStep(5);
      toast.success('Booking created successfully!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Booking failed. Please try again.');
      setIsSubmitting(false);
    }
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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="p-6 max-w-md bg-card border border-red-200 rounded-xl text-center">
          <h2 className="text-lg font-bold text-red-600 mb-2">Error Loading Provider</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Link href="/providers" className="mt-4 inline-block text-brand text-sm font-semibold hover:underline">
            Go back to Providers
          </Link>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="p-6 max-w-md bg-card border border-border rounded-xl text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Provider Not Found</h2>
          <p className="text-sm text-muted-foreground">The provider you are looking for does not exist.</p>
          <Link href="/providers" className="mt-4 inline-block text-brand text-sm font-semibold hover:underline">
            Go back to Providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-background">
      {/* 1. Flat Header Section */}
      <div className="w-full border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-4 py-4 sm:py-8 relative">
          {/* Back Navigation */}
          <Link href="/providers" className="inline-block mb-6">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> Back to Providers
            </button>
          </Link>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              <Avatar src={provider.user?.avatar} alt={provider.businessName} size="xl" className="h-24 w-24 rounded-full border border-border shrink-0" />
              <div className="space-y-2 mt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{provider.businessName}</h1>
                  {provider.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold uppercase tracking-wide">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Pro
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-medium text-muted-foreground">
                  <span className="text-brand">{provider.category?.name}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {provider.address || 'Location unavailable'}</span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {provider.rating} ({provider.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2 w-full md:w-48 mt-4 md:mt-0">
              <Button variant="primary" className="w-full font-semibold rounded-lg hidden md:block" onClick={handleStartBooking}>
                Book Now
              </Button>
              <Button variant="outline" className="w-full font-semibold rounded-lg flex items-center justify-center gap-2" onClick={handleMessageProvider}>
                <MessageCircle className="w-4 h-4" /> Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Content Centered */}
        <div className="space-y-8">
          
          {/* Details */}
          <div className="space-y-8 pb-20 md:pb-0">
            
            {/* About */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">About {provider.businessName}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{provider.description || 'No biography available.'}</p>
            </div>

            <hr className="border-border" />

            {/* Services catalog offered */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Services Offered</h2>
              <div className="space-y-3">
                {services.map((srv) => (
                  <div 
                    key={srv.id} 
                    className="p-4 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-transparent hover:from-brand/10 hover:to-brand/5 transition-all flex items-start justify-between gap-4 group cursor-pointer hover:shadow-md"
                    onClick={() => {
                      setSelectedService(srv);
                      handleStartBooking();
                    }}
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground">{srv.name}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">{srv.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pt-1">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {srv.duration} mins</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <p className="font-bold text-lg text-foreground">₹{srv.price}</p>
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs rounded-lg px-4 shadow-sm"
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            <hr className="border-border" />

            {/* Portfolio Gallery */}
            {provider.portfolio && provider.portfolio.length > 0 && (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground">Portfolio Gallery</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {provider.portfolio.map((imgUrl, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-3xl overflow-hidden border border-border bg-muted shadow-sm group cursor-pointer"
                        onClick={() => setLightboxImage(imgUrl)}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${provider.businessName} portfolio work ${i + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="border-border" />
              </>
            )}

            {/* Reviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Customer Reviews</h2>
                <Button variant="outline" size="sm" className="rounded-full font-bold shadow-sm" onClick={handleWriteReviewClick}>
                  Write a Review
                </Button>
              </div>
              {provider.reviewsCount > 0 ? (
                <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-6 w-6 fill-amber-500" />
                    <span className="text-2xl font-bold text-foreground">{provider.rating}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{provider.reviewsCount} Reviews</p>
                    <p className="text-xs text-muted-foreground">Based on verified bookings</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No reviews yet. Be the first to book!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Booking Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border p-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <Button variant="primary" className="w-full font-bold shadow-lg py-3 rounded-xl" onClick={handleStartBooking}>
          Book Now
        </Button>
      </div>

      {/* 3. MULTI-STEP BOOKING WIZARD MODAL (3 steps) */}
      <Modal isOpen={isBookingModalOpen} onClose={handleCloseModal} title={`Book ${provider.businessName}`} size="lg">
        <div className="space-y-6">
          


          {/* Step Contents */}
          <div className="py-2">
            
            {/* Service */}
            {bookingStep < 5 && (
              <div className="space-y-6">
                <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-brand"/> Select Service</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv);
                      }}
                      className={`p-3 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                        selectedService?.id === srv.id
                          ? 'border-brand bg-brand text-primary-foreground shadow-md scale-[1.02] ring-2 ring-brand ring-offset-1 ring-offset-background'
                          : 'border-border hover:border-brand/50 hover:bg-muted text-foreground'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${selectedService?.id === srv.id ? 'text-primary-foreground' : 'text-foreground'}`}>{srv.name}</p>
                      <span className={`font-bold text-sm mt-2 ${selectedService?.id === srv.id ? 'text-primary-foreground' : 'text-brand'}`}>₹{srv.price}</span>
                    </div>
                  ))}
                </div>
              </div>
                <hr className="border-border" />
                
                {/* Date & Time */}
                <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand"/> Date & Time</h4>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">1. Pick a Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar items-stretch">
                      {(() => {
                        const dateStrings = Array.from({ length: 14 }).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i);
                          return date.toISOString().split('T')[0];
                        });

                        // If user picked a date outside the 14 days, append it to the list
                        if (bookingDate && !dateStrings.includes(bookingDate)) {
                          dateStrings.push(bookingDate);
                        }

                        return (
                          <>
                            {dateStrings.map((dateString) => {
                              const [y, m, d] = dateString.split('-');
                              const localDate = new Date(y, m - 1, d);
                              const isSelected = bookingDate === dateString;
                              const dayName = localDate.toLocaleDateString('en-US', { weekday: 'short' });
                              const dayNum = localDate.getDate();
                              const month = localDate.toLocaleDateString('en-US', { month: 'short' });
                              
                              return (
                                <button
                                  key={dateString}
                                  type="button"
                                  onClick={() => setBookingDate(dateString)}
                                  className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-xl border transition-all shrink-0 cursor-pointer ${
                                    isSelected 
                                      ? 'border-brand bg-brand text-white shadow-md' 
                                      : 'border-border bg-card text-foreground hover:border-brand/50 hover:bg-brand/5'
                                  }`}
                                >
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>{dayName}</span>
                                  <span className="text-xl font-extrabold my-0.5">{dayNum}</span>
                                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>{month}</span>
                                </button>
                              );
                            })}
                            
                            {/* "More Dates" Native Picker Button */}
                            <div className="relative flex flex-col items-center justify-center min-w-[70px] py-3 rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground hover:border-brand/50 hover:bg-brand/10 shrink-0 cursor-pointer overflow-hidden transition-all group">
                              <Calendar className="w-5 h-5 mb-1 group-hover:text-brand transition-colors pointer-events-none" />
                              <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-brand transition-colors pointer-events-none">More</span>
                              <input 
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                onClick={(e) => {
                                  try {
                                    if (e.target.showPicker) e.target.showPicker();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">2. Select a Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            if (!bookingDate) {
                              toast.error('Please pick a date first!');
                              return;
                            }
                            setBookingTime(t);
                          }}
                          className={`py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                            bookingTime === t
                              ? 'border-brand bg-brand text-white shadow-sm ring-2 ring-brand/20'
                              : 'bg-card text-muted-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                <hr className="border-border" />

                {/* Mobile Number & Address */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-brand"/> Mobile Number</h4>
                    <Input
                      id="booking-phone"
                      name="bookingPhone"
                      type="tel"
                      placeholder="e.g. +1 234 567 8900"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand"/> Service Address</h4>
                    <div className="space-y-2">
                      {userAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr)}
                        className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                          selectedAddress?.id === addr.id
                            ? 'border-brand bg-brand/5 ring-1 ring-brand'
                            : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold">{addr.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{addr.address}</p>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="inline-block text-xs font-semibold text-brand hover:underline mt-2"
                    >
                      + Add New Address
                    </button>
                  </div>
                </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><FileText className="h-4 w-4 text-brand"/> Notes (Optional)</h4>
                  <textarea
                    placeholder="e.g. Please bring extra wire, or knock on back door..."
                    rows={3}
                    className="w-full p-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm transition-all resize-none"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                  />
                </div>

                <hr className="border-border" />

                {/* Payment & Review */}
                <div className="space-y-3">
                  {/* Summary */}
                  <div className="border border-brand/20 rounded-xl overflow-hidden text-sm bg-brand/5">
                    <div className="p-4 bg-brand/10 border-b border-brand/20 flex justify-between items-center">
                      <span className="font-bold">Booking Summary</span>
                      <span className="font-extrabold text-brand text-lg">₹{selectedService?.price}</span>
                    </div>
                    <div className="p-4 space-y-3 text-foreground/80">
                      <div className="flex justify-between"><span className="font-medium">Service</span> <span className="font-bold text-foreground">{selectedService?.name}</span></div>
                      <div className="flex justify-between"><span className="font-medium">Date & Time</span> <span className="font-bold text-foreground">{bookingDate} @ {bookingTime}</span></div>
                      <div className="flex justify-between gap-4"><span className="font-medium shrink-0">Address</span> <span className="font-bold text-foreground text-right">{selectedAddress?.address}</span></div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-brand"/> Payment Options</h4>

                    <div className="p-3 border border-brand/20 bg-brand/5 rounded-xl flex items-start gap-3 mt-4">
                      <ShieldCheck className="h-5 w-5 text-brand shrink-0" />
                      <p className="text-[11px] text-foreground/80 leading-normal">
                        You will pay {provider.businessName} directly after the service is completed. Cash and direct transfers are accepted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {bookingStep === 5 && (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-md mx-auto">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-foreground">Booking Confirmed!</h4>
                  <p className="text-xs text-muted-foreground">Your appointment ID is <span className="font-bold text-foreground">{confirmedBookingId}</span></p>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {provider.businessName} has been notified and will arrive on <span className="font-semibold text-foreground">{bookingDate}</span> at <span className="font-semibold text-foreground">{bookingTime}</span>.
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
          {bookingStep < 5 && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="primary"
                isLoading={isSubmitting}
                className="rounded-xl flex-1 justify-center py-6 text-lg font-bold"
                onClick={handleConfirmBookingClick}
              >
                Confirm Booking
              </Button>
            </div>
          )}

        </div>
      </Modal>

      {/* Inline Add Address Modal */}
      <Modal 
        isOpen={isAddAddressModalOpen} 
        onClose={() => setIsAddAddressModalOpen(false)} 
        title="Add Address" 
        size="md"
      >
        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
          <Input 
            label="Address Tag (e.g. Home, Office)" 
            placeholder="Home" 
            required 
            value={newAddressName} 
            onChange={(e) => setNewAddressName(e.target.value)} 
          />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address Details</label>
            <textarea 
              rows={3} 
              required 
              placeholder="Full address here..."
              className="w-full p-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-sm resize-none" 
              value={newAddressDetails} 
              onChange={(e) => setNewAddressDetails(e.target.value)} 
            />
          </div>
          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddAddressModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Save Address</Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmittingReview}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] p-2.5 bg-zinc-800/80 hover:bg-zinc-800 text-white border border-zinc-700 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img 
              src={lightboxImage} 
              alt="Portfolio full view" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl ring-1 ring-border/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

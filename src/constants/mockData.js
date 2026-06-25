export const CATEGORIES = [
  { id: 'electrician', name: 'Electrician', icon: 'Zap', description: 'Fault repairs, wiring, and installations' },
  { id: 'plumber', name: 'Plumber', icon: 'Droplet', description: 'Leak detection, pipe repairs, and tap fittings' },
  { id: 'carpenter', name: 'Carpenter', icon: 'Hammer', description: 'Furniture making, repairs, and wood works' },
  { id: 'painter', name: 'Painter', icon: 'Paintbrush', description: 'Wall painting, textures, and wallpapers' },
  { id: 'cleaner', name: 'Cleaner', icon: 'Sparkles', description: 'Home deep cleaning, dusting, and disinfection' },
  { id: 'tutor', name: 'Tutor', icon: 'BookOpen', description: 'Academic coaching, programming, and languages' },
  { id: 'beautician', name: 'Beautician', icon: 'Heart', description: 'Saloon at home, makeup, and skin care' },
  { id: 'driver', name: 'Driver', icon: 'Car', description: 'Outstation trips, city drivers, and monthly hires' },
  { id: 'ac-technician', name: 'AC Technician', icon: 'Wind', description: 'AC servicing, gas charging, and repair' },
  { id: 'gardener', name: 'Gardener', icon: 'Leaf', description: 'Lawn trimming, planting, and garden design' }
];

export const MOCK_SERVICES = [
  { id: 'srv-1', title: 'AC General Servicing', category: 'ac-technician', price: 49, duration: '1 hr', rating: 4.8, description: 'Complete cleaning and performance check of AC unit.' },
  { id: 'srv-2', title: 'AC Repair & Gas Charging', category: 'ac-technician', price: 99, duration: '2 hrs', rating: 4.7, description: 'Fixing cooling issues and refilling AC refrigerant.' },
  { id: 'srv-3', title: 'Ceiling Fan Installation', category: 'electrician', price: 29, duration: '30 mins', rating: 4.9, description: 'Safe mounting and connection of ceiling fans.' },
  { id: 'srv-4', title: 'Complete House Rewiring', category: 'electrician', price: 899, duration: '8 hrs', rating: 4.6, description: 'Standard safety rewiring for small to mid-sized homes.' },
  { id: 'srv-5', title: 'Leaking Tap & Pipe Repair', category: 'plumber', price: 39, duration: '45 mins', rating: 4.7, description: 'Fixing dripping taps, valves, and clogged drains.' },
  { id: 'srv-6', title: 'Bathroom Deep Cleaning', category: 'cleaner', price: 79, duration: '3 hrs', rating: 4.8, description: 'Intense scrubbing and sanitization of bathroom tiles, sinks, and tubs.' },
  { id: 'srv-7', title: 'Full Home Deep Cleaning', category: 'cleaner', price: 199, duration: '6 hrs', rating: 4.9, description: 'End-to-end cleaning including rooms, kitchen, balconies, and windows.' },
  { id: 'srv-8', title: 'Sofa Assembly / Repair', category: 'carpenter', price: 59, duration: '1.5 hrs', rating: 4.5, description: 'Quick assembly of wooden/modular sofas and fixing hinges.' },
  { id: 'srv-9', title: 'Door Lock Installation', category: 'carpenter', price: 35, duration: '45 mins', rating: 4.8, description: 'Fitting high-security door locks or replacement.' },
  { id: 'srv-10', title: 'Single Bedroom Painting', category: 'painter', price: 299, duration: '5 hrs', rating: 4.7, description: 'Wall scraping, priming, double-coat premium painting.' }
];

export const MOCK_PROVIDERS = [
  {
    id: 'prov-1',
    name: 'Alex Mercer',
    email: 'alex@servicehub.com',
    role: 'provider',
    status: 'verified',
    rating: 4.9,
    reviewsCount: 124,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
    title: 'Certified Master Electrician & AC Specialist',
    about: 'I have over 10 years of experience troubleshooting and repairing residential and commercial HVAC and electrical systems. Certified electrician with focus on safety, speed, and clean work environments.',
    categories: ['electrician', 'ac-technician'],
    services: ['srv-1', 'srv-2', 'srv-3', 'srv-4'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: ['09:00 AM - 06:00 PM']
    },
    portfolio: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300'
    ],
    reviews: [
      { id: 'rev-1', user: 'Sarah Jenkins', rating: 5, date: '2026-06-20', comment: 'Alex fixed my AC cooling issues in 30 minutes! Very professional and polite.' },
      { id: 'rev-2', user: 'Michael Scott', rating: 4.8, date: '2026-06-18', comment: 'Replaced all light fixtures in the office. Great work, will hire again.' }
    ],
    earnings: {
      total: 5420,
      pending: 480,
      completedBookings: 89
    }
  },
  {
    id: 'prov-2',
    name: 'Jessica Chen',
    email: 'jessica@servicehub.com',
    role: 'provider',
    status: 'verified',
    rating: 4.8,
    reviewsCount: 96,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    title: 'Eco-Friendly Home Cleaning Professional',
    about: 'Dedicated cleaning service specializing in eco-friendly and pet-safe products. Offering standard, deep, and move-out cleaning services across the metropolitan area with attention to the smallest details.',
    categories: ['cleaner'],
    services: ['srv-6', 'srv-7'],
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: ['08:00 AM - 08:00 PM']
    },
    portfolio: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300'
    ],
    reviews: [
      { id: 'rev-3', user: 'Dwight Schrute', rating: 5, date: '2026-06-22', comment: 'Cleaned the barns and house perfectly. Exceptional performance.' },
      { id: 'rev-4', user: 'Pam Beesly', rating: 4.5, date: '2026-06-15', comment: 'Very meticulous, they cleaned behind the stove which is always missed.' }
    ],
    earnings: {
      total: 3890,
      pending: 120,
      completedBookings: 54
    }
  },
  {
    id: 'prov-3',
    name: 'David Miller',
    email: 'david@servicehub.com',
    role: 'provider',
    status: 'pending',
    rating: 4.7,
    reviewsCount: 38,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800',
    title: 'Experienced Carpenter & Joiner',
    about: 'Craftsman carpenter with 8+ years building custom shelving, fixing door locks, assembling IKEA and designer furniture, and doing wood polishing.',
    categories: ['carpenter'],
    services: ['srv-8', 'srv-9'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: ['09:00 AM - 05:00 PM']
    },
    portfolio: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300'
    ],
    reviews: [
      { id: 'rev-5', user: 'Jim Halpert', rating: 5, date: '2026-06-11', comment: 'Assembled my desk in no time. Great service and reasonable rates.' }
    ],
    earnings: {
      total: 1250,
      pending: 0,
      completedBookings: 18
    }
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 'bk-101',
    customerId: 'cust-1',
    customerName: 'John Doe',
    providerId: 'prov-1',
    providerName: 'Alex Mercer',
    service: {
      id: 'srv-1',
      title: 'AC General Servicing',
      price: 49
    },
    address: 'Flat 402, Sunset Heights, Main Street, NY',
    date: '2026-06-28',
    time: '10:00 AM',
    notes: 'Please call when outside.',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-06-25T10:00:00Z'
  },
  {
    id: 'bk-102',
    customerId: 'cust-1',
    customerName: 'John Doe',
    providerId: 'prov-2',
    providerName: 'Jessica Chen',
    service: {
      id: 'srv-7',
      title: 'Full Home Deep Cleaning',
      price: 199
    },
    address: 'Flat 402, Sunset Heights, Main Street, NY',
    date: '2026-06-24',
    time: '09:00 AM',
    notes: 'Pet friendly products are necessary.',
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2026-06-22T08:30:00Z'
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    user: {
      id: 'prov-1',
      name: 'Alex Mercer',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      role: 'provider'
    },
    lastMessage: 'Sure, I will arrive by 10 AM on Monday.',
    timestamp: '2026-06-25T12:00:00Z',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'cust-1', text: 'Hi Alex, is the AC servicing including gas checks?', timestamp: '2026-06-25T11:45:00Z' },
      { id: 'm2', senderId: 'prov-1', text: 'Yes, I check the refrigerant pressure and clean the filters.', timestamp: '2026-06-25T11:50:00Z' },
      { id: 'm3', senderId: 'cust-1', text: 'Perfect. See you on Monday.', timestamp: '2026-06-25T11:55:00Z' },
      { id: 'm4', senderId: 'prov-1', text: 'Sure, I will arrive by 10 AM on Monday.', timestamp: '2026-06-25T12:00:00Z' }
    ]
  },
  {
    id: 'conv-2',
    user: {
      id: 'prov-2',
      name: 'Jessica Chen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'provider'
    },
    lastMessage: 'The house is beautifully clean now!',
    timestamp: '2026-06-24T15:00:00Z',
    unread: 1,
    messages: [
      { id: 'm5', senderId: 'prov-2', text: 'I am starting with the bathrooms now.', timestamp: '2026-06-24T10:00:00Z' },
      { id: 'm6', senderId: 'prov-2', text: 'All done. The house is beautifully clean now!', timestamp: '2026-06-24T15:00:00Z' }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Booking Confirmed', message: 'Your booking for AC Servicing is confirmed by Alex Mercer.', read: false, createdAt: '2026-06-25T10:05:00Z', type: 'booking' },
  { id: 'n2', title: 'New Message', message: 'You have a new message from Jessica Chen.', read: true, createdAt: '2026-06-24T15:01:00Z', type: 'message' },
  { id: 'n3', title: 'Offer Available', message: 'Get 20% off on your next cleaning service with code CLEAN20.', read: true, createdAt: '2026-06-23T09:00:00Z', type: 'promo' }
];

export const MOCK_USERS = [
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', role: 'customer', balance: 500, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  { id: 'prov-1', name: 'Alex Mercer', email: 'alex@servicehub.com', role: 'provider', balance: 1200, avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150' },
  { id: 'admin-1', name: 'Admin Hub', email: 'admin@servicehub.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
];

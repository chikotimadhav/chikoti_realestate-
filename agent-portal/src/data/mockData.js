// ============================================================
// ESTATEHUB AGENT PORTAL — REALISTIC MOCK DATA ENGINE
// Seeded with authentic Hyderabad & Indian real-estate listings
// ============================================================

export const INITIAL_AGENTS = [
  {
    id: 'agt_rajesh_01',
    name: 'Rajesh Sharma',
    email: 'rajesh.agent@estatehub.in',
    phone: '+91 98765 43210',
    city: 'Hyderabad',
    agencyName: 'Apex Prime Realty',
    reraNumber: 'TS-RERA-A51800034921',
    experienceYears: 8,
    status: 'Approved', // Pending, Under Review, Approved, Rejected
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80',
    areasServed: ['Jubilee Hills', 'Banjara Hills', 'Kokapet', 'Financial District', 'Madhapur'],
    propertyTypes: ['Villas', 'Apartments', 'Commercial', 'Plots'],
    rating: 4.9,
    reviewsCount: 94,
    propertiesHandled: 36,
    successfulSales: 28,
    verification: {
      identity: true,
      rera: true,
      phone: true,
      email: true,
      documentUrl: 'aadhaar_pan_verified.pdf',
    },
    bankDetails: {
      accountHolder: 'Rajesh Sharma',
      bankName: 'HDFC Bank',
      accountNumber: '•••• •••• 8841',
      ifsc: 'HDFC0000240'
    }
  },
  {
    id: 'agt_priya_02',
    name: 'Priya Patel',
    email: 'priya.agent@estatehub.in',
    phone: '+91 98450 11223',
    city: 'Hyderabad',
    agencyName: 'Elite Spaces Consultancy',
    reraNumber: 'TS-RERA-A51800088192',
    experienceYears: 5,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    areasServed: ['Gachibowli', 'Nanakramguda', 'Tellapur', 'Mokila'],
    propertyTypes: ['Apartments', 'Gated Communities', 'Villas'],
    rating: 4.8,
    reviewsCount: 42,
    propertiesHandled: 19,
    successfulSales: 15,
    verification: {
      identity: true,
      rera: true,
      phone: true,
      email: true,
      documentUrl: 'priya_rera_cert.pdf',
    },
    bankDetails: {
      accountHolder: 'Priya Patel',
      bankName: 'ICICI Bank',
      accountNumber: '•••• •••• 4419',
      ifsc: 'ICIC0001048'
    }
  },
  {
    id: 'agt_vikram_03',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@gmail.com',
    phone: '+91 99001 88772',
    city: 'Hyderabad',
    agencyName: 'Reddy Realtors',
    reraNumber: 'TS-RERA-A51800099411',
    experienceYears: 3,
    status: 'Under Review',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    areasServed: ['Shamshabad', 'Kothur', 'Maheshwaram'],
    propertyTypes: ['Plots', 'Farm Lands', 'Agriculture'],
    rating: 4.6,
    reviewsCount: 12,
    propertiesHandled: 6,
    successfulSales: 3,
    verification: {
      identity: true,
      rera: false,
      phone: true,
      email: true,
      documentUrl: 'vikram_application_docs.pdf',
    }
  }
];

export const INITIAL_PROPERTIES = [
  {
    id: 'EH-PROP-101',
    title: 'The Royal Crest Luxury Villa',
    slug: 'the-royal-crest-luxury-villa',
    type: 'Villas',
    category: 'Residential',
    price: 72000000,
    priceFormatted: '₹7.20 Cr',
    area: '4,850 sq.ft',
    bedrooms: 5,
    bathrooms: 6,
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    lat: 17.4319,
    lng: 78.4073,
    status: 'Available',
    commissionPct: 2.0,
    expectedCommission: 1440000,
    commissionFormatted: '₹14,40,000',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-exclusive 5 BHK signature villa nestled in prime Jubilee Hills. Features double-height living foyer, private temperature-controlled infinity pool, home automation, landscaped zen garden, Italian marble flooring, and 4 dedicated car parking bays.',
    amenities: ['Private Infinity Pool', 'Home Theatre Room', 'Smart Home Automation', 'Solar Powered', 'Italian Marble', 'Private Elevator', '24x7 Security', 'Servant Quarters'],
    seller: {
      name: 'Dr. K. S. Rao',
      type: 'Individual Owner',
      verified: true,
      phone: '+91 98490 XXXXX'
    },
    reraReg: 'P02400004921',
    featured: true,
    views: 1420
  },
  {
    id: 'EH-PROP-102',
    title: 'Aura Skies Highrise Penthouse',
    slug: 'aura-skies-highrise-penthouse',
    type: 'Apartments',
    category: 'Residential',
    price: 38500000,
    priceFormatted: '₹3.85 Cr',
    area: '3,450 sq.ft',
    bedrooms: 4,
    bathrooms: 4,
    location: 'Kokapet Golden Mile, Hyderabad',
    lat: 17.3879,
    lng: 78.3248,
    status: 'Available',
    commissionPct: 2.5,
    expectedCommission: 962500,
    commissionFormatted: '₹9,62,500',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'Sky penthouse on the 42nd floor with panoramic 360-degree views of the Kokapet Lake and Financial District skyline. High ceilings, expansive viewing deck, modular German kitchen, and club access.',
    amenities: ['Sky Deck', 'Clubhouse 50,000 sq.ft', 'Tennis Court', 'Squash Court', 'EV Charging', 'Gym & Spa'],
    seller: {
      name: 'Aura Heights Developers LLP',
      type: 'Grade-A Developer',
      verified: true,
      phone: '+91 90000 XXXXX'
    },
    reraReg: 'P02400003189',
    featured: true,
    views: 980
  },
  {
    id: 'EH-PROP-103',
    title: 'Cyber Towers Tech Park Commercial Floor',
    slug: 'cyber-towers-tech-park-commercial-floor',
    type: 'Commercial',
    category: 'Commercial',
    price: 54000000,
    priceFormatted: '₹5.40 Cr',
    area: '6,200 sq.ft',
    bedrooms: null,
    bathrooms: 4,
    location: 'Financial District, Gachibowli, Hyderabad',
    lat: 17.4156,
    lng: 78.3429,
    status: 'Available',
    commissionPct: 2.0,
    expectedCommission: 1080000,
    commissionFormatted: '₹10,80,000',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'Pre-leased Grade-A office floor with 8.4% rental yield. Occupied by Fortune 500 tech firm with 9-year lock-in agreement. Excellent asset for high-net-worth commercial investors.',
    amenities: ['100% Power Backup', 'High Speed Elevators', 'Central HVAC', 'Basement Parking for 12 cars', 'LEED Gold Certified'],
    seller: {
      name: 'Matrix Realty Assets Corp',
      type: 'Institutional Developer',
      verified: true,
      phone: '+91 91234 XXXXX'
    },
    reraReg: 'P02400008890',
    featured: false,
    views: 640
  },
  {
    id: 'EH-PROP-104',
    title: 'Green Valley Organic Farm Estate',
    slug: 'green-valley-organic-farm-estate',
    type: 'Farm Lands',
    category: 'Land',
    price: 18500000,
    priceFormatted: '₹1.85 Cr',
    area: '2.5 Acres',
    bedrooms: 2,
    bathrooms: 2,
    location: 'Shankarpally - Vikarabad Road, Hyderabad',
    lat: 17.4521,
    lng: 78.1250,
    status: 'Available',
    commissionPct: 3.0,
    expectedCommission: 555000,
    commissionFormatted: '₹5,55,000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1080&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'Fully fenced 2.5 Acre fertile farmland featuring mature mango & teak plantation, drip irrigation system, deep borewell with sweet water, electricity connection, and a modern 2 BHK weekend farm cottage.',
    amenities: ['Borewell & Drip Irrigation', 'Fenced Boundary', 'Weekend Cottage', 'Mango Orchard', 'Solar Lighting', 'Caretaker Room'],
    seller: {
      name: 'Venkatesh Naidu',
      type: 'Individual Landowner',
      verified: true,
      phone: '+91 97000 XXXXX'
    },
    reraReg: 'Passbook / Dharani Verified',
    featured: false,
    views: 480
  },
  {
    id: 'EH-PROP-105',
    title: 'Boulevard Gated Villa Plot',
    slug: 'boulevard-gated-villa-plot',
    type: 'Plots',
    category: 'Land',
    price: 12500000,
    priceFormatted: '₹1.25 Cr',
    area: '450 sq.yds',
    bedrooms: null,
    bathrooms: null,
    location: 'Mokila Near ORR Exit 8, Hyderabad',
    lat: 17.4124,
    lng: 78.2015,
    status: 'Available',
    commissionPct: 3.0,
    expectedCommission: 375000,
    commissionFormatted: '₹3,75,000',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'HMDA & RERA approved premium East-facing plot in a 40-acre gated luxury community. 60ft wide BT roads, underground electricity, clubhouse, parks, and immediate construction ready.',
    amenities: ['HMDA Approved', 'Underground Cabling', 'Avenue Plantation', 'Clubhouse Access', 'Water Pipeline'],
    seller: {
      name: 'Boulevard Infrastructures',
      type: 'Developer',
      verified: true,
      phone: '+91 98888 XXXXX'
    },
    reraReg: 'P02400001923',
    featured: false,
    views: 350
  },
  {
    id: 'EH-PROP-106',
    title: 'The Monarch Luxury Suites',
    slug: 'the-monarch-luxury-suites',
    type: 'Apartments',
    category: 'Residential',
    price: 24500000,
    priceFormatted: '₹2.45 Cr',
    area: '2,250 sq.ft',
    bedrooms: 3,
    bathrooms: 3,
    location: 'Nanakramguda IT Corridor, Hyderabad',
    lat: 17.4190,
    lng: 78.3490,
    status: 'Reserved',
    commissionPct: 2.5,
    expectedCommission: 612500,
    commissionFormatted: '₹6,12,500',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1080&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1080&auto=format&fit=crop&q=80'
    ],
    description: 'Ready-to-move-in luxury 3 BHK overlooking golf course. High-end wood flooring, smart locks, clubhouse with infinity rooftop pool.',
    amenities: ['Golf View', 'Infinity Pool', 'Gymnasium', 'Concierge Desk'],
    seller: {
      name: 'Monarch Projects',
      type: 'Developer',
      verified: true,
      phone: '+91 94444 XXXXX'
    },
    reraReg: 'P02400006712',
    featured: false,
    views: 890
  }
];

export const INITIAL_LEADS = [
  {
    id: 'LEAD-801',
    customerName: 'Vikramaditya Varma',
    phone: '+91 98490 55112',
    email: 'vikram.varma@techventures.io',
    interestedPropertyId: 'EH-PROP-101',
    interestedPropertyTitle: 'The Royal Crest Luxury Villa',
    budget: '₹7 Cr - ₹8 Cr',
    location: 'Jubilee Hills',
    source: 'Website Enquiry',
    status: 'NEGOTIATION', // NEW, CONTACTED, QUALIFIED, SITE VISIT, NEGOTIATION, BOOKED, CLOSED, LOST
    lastContact: 'Today, 10:15 AM',
    nextFollowUp: 'Tomorrow, 03:00 PM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Buyer is a tech founder relocating from Bengaluru. Loves the private pool and security. Offered ₹7.05 Cr; seller counter-offered ₹7.15 Cr. Final closing meeting set.',
    createdAt: '2026-09-08'
  },
  {
    id: 'LEAD-802',
    customerName: 'Ananya Deshmukh',
    phone: '+91 97011 44321',
    email: 'ananya.deshmukh@gmail.com',
    interestedPropertyId: 'EH-PROP-102',
    interestedPropertyTitle: 'Aura Skies Highrise Penthouse',
    budget: '₹3.5 Cr - ₹4 Cr',
    location: 'Kokapet',
    source: 'MagicBricks',
    status: 'SITE VISIT',
    lastContact: 'Yesterday, 04:30 PM',
    nextFollowUp: 'Today, 02:00 PM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Requested a sunset site visit to check the lake view. Husband is joining via Zoom from Singapore.',
    createdAt: '2026-09-10'
  },
  {
    id: 'LEAD-803',
    customerName: 'Sanjay Chawla',
    phone: '+91 98200 77610',
    email: 'sanjay.chawla@capitalinvest.com',
    interestedPropertyId: 'EH-PROP-103',
    interestedPropertyTitle: 'Cyber Towers Tech Park Commercial Floor',
    budget: '₹5 Cr - ₹6 Cr',
    location: 'Financial District',
    source: 'Direct Referral',
    status: 'QUALIFIED',
    lastContact: 'Sep 12, 11:00 AM',
    nextFollowUp: 'Sep 15, 11:30 AM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'HNI investor looking for pure commercial rental yield. Provided tenant lease docs and NOC.',
    createdAt: '2026-09-05'
  },
  {
    id: 'LEAD-804',
    customerName: 'Dr. Meera Srinivas',
    phone: '+91 99899 33201',
    email: 'meera.srinivas@apollohosp.org',
    interestedPropertyId: 'EH-PROP-104',
    interestedPropertyTitle: 'Green Valley Organic Farm Estate',
    budget: '₹1.5 Cr - ₹2 Cr',
    location: 'Shankarpally',
    source: 'Instagram Ads',
    status: 'CONTACTED',
    lastContact: 'Sep 13, 05:45 PM',
    nextFollowUp: 'Sep 16, 10:00 AM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Interested in a weekend agricultural getaway for family. Verified borewell and road access details.',
    createdAt: '2026-09-12'
  },
  {
    id: 'LEAD-805',
    customerName: 'Arjun Singhania',
    phone: '+91 98110 88229',
    email: 'arjun.singhania@indusgroup.in',
    interestedPropertyId: 'EH-PROP-106',
    interestedPropertyTitle: 'The Monarch Luxury Suites',
    budget: '₹2.4 Cr',
    location: 'Nanakramguda',
    source: 'Walk-in',
    status: 'BOOKED',
    lastContact: 'Sep 11, 02:00 PM',
    nextFollowUp: 'Sep 18, 04:00 PM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Token advance of ₹10 Lakhs paid. Agreement of Sale signing scheduled for Thursday. Commission processing.',
    createdAt: '2026-08-28'
  },
  {
    id: 'LEAD-806',
    customerName: 'Kavita Sundaram',
    phone: '+91 94480 12390',
    email: 'kavita.s@wipro.com',
    interestedPropertyId: 'EH-PROP-105',
    interestedPropertyTitle: 'Boulevard Gated Villa Plot',
    budget: '₹1 Cr - ₹1.3 Cr',
    location: 'Mokila',
    source: 'Google Search',
    status: 'NEW',
    lastContact: 'Today, 08:30 AM',
    nextFollowUp: 'Today, 04:00 PM',
    assignedAgent: 'Rajesh Sharma',
    notes: 'New enquiry received 3 hours ago. Looking for West or East facing 400+ sq.yd plot with immediate registration.',
    createdAt: '2026-09-14'
  },
  {
    id: 'LEAD-807',
    customerName: 'Naveen Kumar Goud',
    phone: '+91 99499 87654',
    email: 'naveen.goud@telangana.gov.in',
    interestedPropertyId: 'EH-PROP-101',
    interestedPropertyTitle: 'The Royal Crest Luxury Villa',
    budget: '₹6.5 Cr',
    location: 'Jubilee Hills',
    source: 'Direct Referral',
    status: 'LOST',
    lastContact: 'Sep 06, 03:00 PM',
    nextFollowUp: 'None',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Budget ceiling was ₹6.5 Cr; seller was not willing to discount beyond ₹7.10 Cr. Lead marked lost for this property, looking for alternatives in Manikonda.',
    createdAt: '2026-08-15'
  },
  {
    id: 'LEAD-808',
    customerName: 'Rohan Mehra',
    phone: '+91 98211 55677',
    email: 'rohan.mehra@mehraexports.com',
    interestedPropertyId: 'EH-PROP-102',
    interestedPropertyTitle: 'Aura Skies Highrise Penthouse',
    budget: '₹3.8 Cr',
    location: 'Kokapet',
    source: 'Website Enquiry',
    status: 'CLOSED',
    lastContact: 'Aug 29, 06:00 PM',
    nextFollowUp: 'Completed',
    assignedAgent: 'Rajesh Sharma',
    notes: 'Deal successfully closed and registered at Gandipet SRO. Full commission of ₹9,62,500 approved and paid.',
    createdAt: '2026-07-20'
  }
];

export const INITIAL_CLIENTS = [
  {
    id: 'CLI-501',
    name: 'Vikramaditya Varma',
    phone: '+91 98490 55112',
    email: 'vikram.varma@techventures.io',
    budget: '₹7 Cr - ₹8 Cr',
    preferredLocation: 'Jubilee Hills, Banjara Hills',
    propertyType: 'Luxury Villas',
    requirements: 'Minimum 4 BHK with private pool, servant room, modern architecture, 4+ car parking.',
    assignedProperties: ['EH-PROP-101'],
    notes: 'Very prompt in communication. Active buyer with immediate liquid funds.',
    lastContact: 'Today, 10:15 AM',
    nextFollowUp: 'Tomorrow, 03:00 PM',
    status: 'High Priority'
  },
  {
    id: 'CLI-502',
    name: 'Ananya Deshmukh',
    phone: '+91 97011 44321',
    email: 'ananya.deshmukh@gmail.com',
    budget: '₹3.5 Cr - ₹4 Cr',
    preferredLocation: 'Kokapet, Financial District',
    propertyType: 'Apartments / Penthouses',
    requirements: 'Higher floors (30+), lake facing, ultra-luxury clubhouse, 3 or 4 BHK.',
    assignedProperties: ['EH-PROP-102'],
    notes: 'NRI family moving back to India. Priority on kids schooling nearby.',
    lastContact: 'Yesterday, 04:30 PM',
    nextFollowUp: 'Today, 02:00 PM',
    status: 'Active'
  },
  {
    id: 'CLI-503',
    name: 'Sanjay Chawla',
    phone: '+91 98200 77610',
    email: 'sanjay.chawla@capitalinvest.com',
    budget: '₹5 Cr - ₹10 Cr',
    preferredLocation: 'Gachibowli, Madhapur, Hitec City',
    propertyType: 'Commercial Pre-leased',
    requirements: 'Grade-A building with long term tenant and 8%+ cap rate.',
    assignedProperties: ['EH-PROP-103'],
    notes: 'Repeat institutional buyer. Fast decisions if documentation is clear.',
    lastContact: 'Sep 12, 11:00 AM',
    nextFollowUp: 'Sep 15, 11:30 AM',
    status: 'Active'
  },
  {
    id: 'CLI-504',
    name: 'Dr. Meera Srinivas',
    phone: '+91 99899 33201',
    email: 'meera.srinivas@apollohosp.org',
    budget: '₹1.5 Cr - ₹2 Cr',
    preferredLocation: 'Shankarpally, Chevella, Moinabad',
    propertyType: 'Farm Lands',
    requirements: '2 to 3 acres with clean title, clear road access, good groundwater.',
    assignedProperties: ['EH-PROP-104'],
    notes: 'Seeking peaceful farm plot for weekend farming and plantation.',
    lastContact: 'Sep 13, 05:45 PM',
    nextFollowUp: 'Sep 16, 10:00 AM',
    status: 'Active'
  },
  {
    id: 'CLI-505',
    name: 'Arjun Singhania',
    phone: '+91 98110 88229',
    email: 'arjun.singhania@indusgroup.in',
    budget: '₹2.4 Cr',
    preferredLocation: 'Nanakramguda, Tellapur',
    propertyType: 'Apartments',
    requirements: 'Ready to move 3 BHK with golf view.',
    assignedProperties: ['EH-PROP-106'],
    notes: 'Deal booked, currently in registration processing.',
    lastContact: 'Sep 11, 02:00 PM',
    nextFollowUp: 'Sep 18, 04:00 PM',
    status: 'In Closing'
  }
];

export const INITIAL_VISITS = [
  {
    id: 'VIS-901',
    clientId: 'CLI-502',
    clientName: 'Ananya Deshmukh',
    clientPhone: '+91 97011 44321',
    propertyId: 'EH-PROP-102',
    propertyTitle: 'Aura Skies Highrise Penthouse',
    location: 'Kokapet Golden Mile, Hyderabad',
    date: '2026-09-14',
    time: '02:00 PM',
    agentName: 'Rajesh Sharma',
    status: 'Confirmed', // Scheduled, Confirmed, Completed, Rescheduled, Cancelled
    notes: 'Client requested entry pass for driver and husband on video call.'
  },
  {
    id: 'VIS-902',
    clientId: 'CLI-501',
    clientName: 'Vikramaditya Varma',
    clientPhone: '+91 98490 55112',
    propertyId: 'EH-PROP-101',
    propertyTitle: 'The Royal Crest Luxury Villa',
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    date: '2026-09-15',
    time: '03:00 PM',
    agentName: 'Rajesh Sharma',
    status: 'Scheduled',
    notes: 'Final walkthrough before token agreement.'
  },
  {
    id: 'VIS-903',
    clientId: 'CLI-504',
    clientName: 'Dr. Meera Srinivas',
    clientPhone: '+91 99899 33201',
    propertyId: 'EH-PROP-104',
    propertyTitle: 'Green Valley Organic Farm Estate',
    location: 'Shankarpally Road, Hyderabad',
    date: '2026-09-16',
    time: '10:00 AM',
    agentName: 'Rajesh Sharma',
    status: 'Scheduled',
    notes: 'Site visit with local revenue surveyor to inspect boundary stones.'
  },
  {
    id: 'VIS-904',
    clientId: 'CLI-503',
    clientName: 'Sanjay Chawla',
    clientPhone: '+91 98200 77610',
    propertyId: 'EH-PROP-103',
    propertyTitle: 'Cyber Towers Tech Park Commercial Floor',
    location: 'Financial District, Hyderabad',
    date: '2026-09-12',
    time: '11:00 AM',
    agentName: 'Rajesh Sharma',
    status: 'Completed',
    notes: 'Inspected floor plates, BMS room, and power backup diesel gensets.'
  },
  {
    id: 'VIS-905',
    clientId: 'CLI-505',
    clientName: 'Arjun Singhania',
    clientPhone: '+91 98110 88229',
    propertyId: 'EH-PROP-106',
    propertyTitle: 'The Monarch Luxury Suites',
    location: 'Nanakramguda, Hyderabad',
    date: '2026-09-10',
    time: '04:00 PM',
    agentName: 'Rajesh Sharma',
    status: 'Completed',
    notes: 'Client satisfied with construction finish; proceeded to token advance.'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-2024-401',
    clientName: 'Arjun Singhania',
    clientPhone: '+91 98110 88229',
    propertyId: 'EH-PROP-106',
    propertyTitle: 'The Monarch Luxury Suites',
    bookingDate: '2026-09-11',
    propertyValue: 24500000,
    propertyValueFormatted: '₹2.45 Cr',
    bookingTokenAmount: 1000000,
    bookingTokenFormatted: '₹10,00,000',
    agentCommission: 612500,
    agentCommissionFormatted: '₹6,12,500',
    status: 'Confirmed' // Pending, Confirmed, Cancelled, Completed
  },
  {
    id: 'BK-2024-399',
    clientName: 'Rohan Mehra',
    clientPhone: '+91 98211 55677',
    propertyId: 'EH-PROP-102',
    propertyTitle: 'Aura Skies Highrise Penthouse',
    bookingDate: '2026-08-20',
    propertyValue: 38500000,
    propertyValueFormatted: '₹3.85 Cr',
    bookingTokenAmount: 2000000,
    bookingTokenFormatted: '₹20,00,000',
    agentCommission: 962500,
    agentCommissionFormatted: '₹9,62,500',
    status: 'Completed'
  },
  {
    id: 'BK-2024-385',
    clientName: 'K. V. Subbarao',
    clientPhone: '+91 98480 33901',
    propertyId: 'EH-PROP-105',
    propertyTitle: 'Boulevard Gated Villa Plot',
    bookingDate: '2026-08-04',
    propertyValue: 12500000,
    propertyValueFormatted: '₹1.25 Cr',
    bookingTokenAmount: 500000,
    bookingTokenFormatted: '₹5,00,000',
    agentCommission: 375000,
    agentCommissionFormatted: '₹3,75,000',
    status: 'Completed'
  },
  {
    id: 'BK-2024-402',
    clientName: 'Vikramaditya Varma',
    clientPhone: '+91 98490 55112',
    propertyId: 'EH-PROP-101',
    propertyTitle: 'The Royal Crest Luxury Villa',
    bookingDate: '2026-09-14',
    propertyValue: 72000000,
    propertyValueFormatted: '₹7.20 Cr',
    bookingTokenAmount: 2500000,
    bookingTokenFormatted: '₹25,00,000',
    agentCommission: 1440000,
    agentCommissionFormatted: '₹14,40,000',
    status: 'Pending'
  }
];

export const INITIAL_COMMISSIONS = [
  {
    id: 'COMM-1008',
    propertyTitle: 'The Monarch Luxury Suites (Flat 1802)',
    clientName: 'Arjun Singhania',
    saleDate: '2026-09-11',
    propertyValue: '₹2.45 Cr',
    commissionPct: 2.5,
    commissionAmount: 612500,
    commissionFormatted: '₹6,12,500',
    status: 'Processing', // Pending, Approved, Processing, Paid
    paymentDate: 'Est. 2026-09-22',
    referenceId: 'TXN-PRC-88120'
  },
  {
    id: 'COMM-1007',
    propertyTitle: 'Aura Skies Highrise Penthouse (Unit 42A)',
    clientName: 'Rohan Mehra',
    saleDate: '2026-08-28',
    propertyValue: '₹3.85 Cr',
    commissionPct: 2.5,
    commissionAmount: 962500,
    commissionFormatted: '₹9,62,500',
    status: 'Paid',
    paymentDate: '2026-09-05',
    referenceId: 'HDFC-NEFT-99410'
  },
  {
    id: 'COMM-1006',
    propertyTitle: 'Boulevard Gated Villa Plot (Plot 44)',
    clientName: 'K. V. Subbarao',
    saleDate: '2026-08-12',
    propertyValue: '₹1.25 Cr',
    commissionPct: 3.0,
    commissionAmount: 375000,
    commissionFormatted: '₹3,75,000',
    status: 'Paid',
    paymentDate: '2026-08-18',
    referenceId: 'HDFC-IMPS-77219'
  },
  {
    id: 'COMM-1005',
    propertyTitle: 'Oakwood Heights Luxury Duplex',
    clientName: 'Deepak Agarwal',
    saleDate: '2026-07-19',
    propertyValue: '₹2.10 Cr',
    commissionPct: 2.0,
    commissionAmount: 420000,
    commissionFormatted: '₹4,20,000',
    status: 'Paid',
    paymentDate: '2026-07-26',
    referenceId: 'ICIC-RTGS-33100'
  },
  {
    id: 'COMM-1009',
    propertyTitle: 'Silver Pines Commercial Unit 4B',
    clientName: 'Gaurav Sethi',
    saleDate: '2026-09-02',
    propertyValue: '₹1.70 Cr',
    commissionPct: 2.0,
    commissionAmount: 85000, // Milestone 1 token
    commissionFormatted: '₹85,000',
    status: 'Pending',
    paymentDate: 'Under Approval',
    referenceId: 'TXN-REQ-55109'
  }
];

export const MONTHLY_EARNINGS_SERIES = [
  { month: 'Apr', amount: 180000, deals: 2 },
  { month: 'May', amount: 260000, deals: 3 },
  { month: 'Jun', amount: 320000, deals: 4 },
  { month: 'Jul', amount: 420000, deals: 5 },
  { month: 'Aug', amount: 1337500, deals: 7 },
  { month: 'Sep (Current)', amount: 697500, deals: 3 }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    type: 'lead',
    title: 'New Hot Lead Assigned',
    message: 'Kavita Sundaram enquired about Boulevard Gated Villa Plot (Budget: ₹1.25 Cr).',
    timestamp: '15 minutes ago',
    read: false,
    badge: 'NEW LEAD'
  },
  {
    id: 'NOTIF-2',
    type: 'visit',
    title: 'Site Visit Reminder in 2 Hours',
    message: 'Site visit with Ananya Deshmukh at Aura Skies Highrise Penthouse (02:00 PM).',
    timestamp: '45 minutes ago',
    read: false,
    badge: 'VISIT TODAY'
  },
  {
    id: 'NOTIF-3',
    type: 'commission',
    title: 'Commission Approved by Admin',
    message: 'Commission payout of ₹6,12,500 for The Monarch Luxury Suites is now in processing.',
    timestamp: '3 hours ago',
    read: false,
    badge: 'PAYOUT'
  },
  {
    id: 'NOTIF-4',
    type: 'property',
    title: 'Price Update Alert',
    message: 'Seller revised price for The Royal Crest Luxury Villa from ₹7.50 Cr to ₹7.20 Cr.',
    timestamp: 'Yesterday',
    read: true,
    badge: 'UPDATE'
  },
  {
    id: 'NOTIF-5',
    type: 'announcement',
    title: 'EstateHub Fest 2026 Bonus Incentive',
    message: 'Earn an additional 0.5% bonus commission on all luxury villa bookings closed this month.',
    timestamp: '2 days ago',
    read: true,
    badge: 'OFFER'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TCK-881',
    subject: 'Commission payment status for Deal #BK-2024-399',
    category: 'Commission & Payments',
    priority: 'High',
    status: 'Resolved', // Open, In Progress, Resolved
    createdAt: '2026-09-02',
    description: 'Requested confirmation of UTR number for NEFT credit. Support confirmed payment transaction ID.'
  },
  {
    id: 'TCK-882',
    subject: 'Update high-res floor plans for Aura Skies Penthouse',
    category: 'Property Information',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-09-12',
    description: 'Client requested architectural CAD/PDF showing balcony dimensions.'
  }
];

export const FAQS = [
  {
    q: 'How are agent commissions calculated and disbursed?',
    a: 'Commissions range from 2.0% to 3.5% based on property category. Payouts are triggered within 7 banking days following Agreement of Sale execution and seller clearance.'
  },
  {
    q: 'What is the EstateHub Lead Assignment SLA?',
    a: 'Agents are expected to make initial contact with newly assigned leads within 2 business hours for optimal conversion rates.'
  },
  {
    q: 'How do I generate client-branded property share links?',
    a: 'Open any property in "My Properties", click "Share Property", and copy the agent-branded link. Inquiries from this link are automatically assigned to your agent account.'
  },
  {
    q: 'What documents are mandatory for RERA compliance?',
    a: 'Valid State RERA Agent Registration Certificate, PAN Card, and verified Aadhar ID.'
  }
];

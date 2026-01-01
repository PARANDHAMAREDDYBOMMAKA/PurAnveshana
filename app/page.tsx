"use client";
import Link from 'next/link'
import { Camera, MapPin, Award, Users, Shield, ChevronRight, Menu, X, Check, ChevronDown, Mail, Phone, Search, FileText, Coins, BadgeIndianRupee, TrendingUp, Globe, Eye } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AppDemo from '@/components/AppDemo';

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
      
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            setCount(Math.floor(end * percentage));

            if (percentage < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasStarted]);

  return <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">{count.toLocaleString()}{suffix}</div>;
}

// Client-only Video Player
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading video...</div>
      </div>
    );
  }

  return (
    <video
      controls
      className="absolute top-0 left-0 w-full h-full object-cover"
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

// India Map Animation Component
function IndiaMapAnimation() {
  const [activePoint, setActivePoint] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Historical locations in India with actual lat/lng coordinates and Unsplash images
  const historicalSites = [
    {
      name: "Taj Mahal",
      lat: 27.1751,
      lng: 78.0421,
      state: "Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&h=200&fit=crop"
    },
    {
      name: "Red Fort",
      lat: 28.6562,
      lng: 77.2410,
      state: "Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&h=200&fit=crop"
    },
    {
      name: "Qutub Minar",
      lat: 28.5244,
      lng: 77.1855,
      state: "Delhi",
      image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=200&h=200&fit=crop"
    },
    {
      name: "Ajanta Caves",
      lat: 20.5519,
      lng: 75.7033,
      state: "Maharashtra",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=200&h=200&fit=crop"
    },
    {
      name: "Hampi",
      lat: 15.3350,
      lng: 76.4600,
      state: "Karnataka",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&h=200&fit=crop"
    },
    {
      name: "Konark Temple",
      lat: 19.8876,
      lng: 86.0945,
      state: "Odisha",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&h=200&fit=crop"
    },
    {
      name: "Khajuraho",
      lat: 24.8318,
      lng: 79.9199,
      state: "Madhya Pradesh",
      image: "https://images.unsplash.com/photo-1605649487212-47f7da67ad3f?w=200&h=200&fit=crop"
    },
    {
      name: "Mysore Palace",
      lat: 12.3051,
      lng: 76.6551,
      state: "Karnataka",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=200&fit=crop"
    },
    {
      name: "Gateway of India",
      lat: 18.9220,
      lng: 72.8347,
      state: "Maharashtra",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=200&h=200&fit=crop"
    },
    {
      name: "Hawa Mahal",
      lat: 26.9239,
      lng: 75.8267,
      state: "Rajasthan",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200&h=200&fit=crop"
    },
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % historicalSites.length);
    }, 5000); // Changed to 5 seconds

    return () => clearInterval(interval);
  }, []);


  if (!mounted) {
    return (
      <div className="relative order-1 lg:order-2">
        <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-500 rounded-2xl sm:rounded-3xl transform rotate-3 opacity-20"></div>
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8">
          <div className="relative w-full aspect-3/4 max-h-[500px] flex items-center justify-center">
            <div className="text-slate-400">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative order-1 lg:order-2">
      <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-500 rounded-2xl sm:rounded-3xl transform rotate-3 opacity-20"></div>
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8">
        <div className="relative w-full aspect-3/4 max-h-[500px] overflow-hidden rounded-xl">
          <SimpleIndiaMap sites={historicalSites} activePoint={activePoint} />

          {/* Location info box */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 rounded-b-xl z-1000">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm sm:text-base font-bold">{historicalSites[activePoint].name}</h3>
              </div>
              <p className="text-xs sm:text-sm text-orange-200">{historicalSites[activePoint].state}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleIndiaMap({ sites, activePoint }: { sites: any[], activePoint: number }) {
  const activeSite = sites[activePoint];

  const latLngToPercent = (lat: number, lng: number) => ({
    left: `${((lng - 68) / 29) * 100}%`,
    top: `${((37 - lat) / 29) * 100}%`
  });

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <iframe
        src="https://maps.google.com/maps?ll=20.5937,78.9629&z=5&t=m&output=embed"
        className="w-full h-full pointer-events-none"
        style={{ border: 0 }}
      />

      <div className="absolute -translate-x-1/2 -translate-y-full" style={latLngToPercent(activeSite.lat, activeSite.lng)}>
        <div className="relative w-14 h-16 drop-shadow-xl">
          <div className="absolute inset-0 w-12 h-12 bg-white rounded-full border-3 border-red-500 overflow-hidden rotate-45">
            <img src={activeSite.image} className="-rotate-45 scale-150 w-full h-full object-cover" alt="" />
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [showStories, setShowStories] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Camera,
      title: "Document Heritage",
      description: "Capture ancient sites with photos and stories from your local area"
    },
    // {
    //   icon: Shield,
    //   title: "EXIF Verification",
    //   description: "Automated authenticity checks using image metadata and GPS data"
    // },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Get recognized and rewarded for your contributions to cultural preservation"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands preserving our heritage together"
    }
  ];

  const howItWorks = [
    { icon: Search, title: "Discover", desc: "Find ancient or historical sites in your area" },
    { icon: Camera, title: "Document", desc: "Capture photos and write descriptions" },
    // { step: "3", title: "Verify", desc: "Our system validates using EXIF data" },
    { icon: Coins, title: "Earn", desc: "Get rewards for verified contributions" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                  Puranveshana
                </span>
                <span className="text-[10px] sm:text-xs text-orange-600 font-semibold -mt-1 notranslate" translate="no">
                  पुरातन अन्वेषण
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-slate-700 hover:text-orange-600 transition">How It Works</a>
              <a href="#rewards" className="text-slate-700 hover:text-orange-600 transition flex items-center gap-1">
                <Award className="w-4 h-4" />
                Rewards
              </a>
              <a href="#why-join" className="text-slate-700 hover:text-orange-600 transition">Why Join Puranveshana</a>
              <Link href="/signup">
                <button className="px-6 py-2 bg-linear-to-r cursor-pointer from-orange-500 to-amber-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Join Now
                </button>
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="text-black" /> : <Menu className="text-black" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#how-it-works" className="block text-slate-700 hover:text-orange-600">How It Works</a>
              <a href="#rewards" className="flex items-center gap-2 text-slate-700 hover:text-orange-600">
                <Award className="w-4 h-4" />
                Rewards
              </a>
              <a href="#why-join" className="block text-slate-700 hover:text-orange-600">Why Join Puranveshana</a>
              <Link href="/signup">
                <button className="w-full px-6 py-2 cursor-pointer bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full">
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Enhanced Background with Gradient Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50 to-white"></div>
          {/* Animated gradient orbs */}
          <div className="absolute top-10 sm:top-20 left-0 sm:left-10 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-20 sm:top-40 right-0 sm:right-10 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjJoLTJ2LTJoMnptLTIgMmgtMnYtMmgycHYyem0wIDBoLTJ2Mmgydi0yem0yIDB2Mmgydi0yaC0yem0wIDBodjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            {/* Left Content - Enhanced */}
            <div className="space-y-5 sm:space-y-7 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-linear-to-r from-orange-100 via-amber-100 to-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-bold shadow-md border border-orange-200 hover:shadow-lg transition-shadow duration-300">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="notranslate" translate="no">पुरान्वेषी भव</span>
                <span className="hidden sm:inline">—</span>
                <span>Be a PurAnveshi</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Rediscover India's{' '}
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Hidden Heritage
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C60 3 140 3 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {' '}and{' '}
                <strong className="text-orange-600 relative">
                  Get Rewarded!
                </strong>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed max-w-2xl">
                Every forgotten temple, ruin, or inscription you uncover could earn you a{' '}
                <span className="font-bold text-green-600">cash reward</span> — because real explorers like you are helping us protect Bharat's lost heritage.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link href="/signup" className="w-full sm:w-auto group">
                  <button className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-linear-to-r from-orange-500 via-orange-600 to-amber-600 text-white rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl text-sm sm:text-base md:text-lg relative overflow-hidden">
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="relative">Upload a Hidden Place</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 relative group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto group">
                  <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 border-2 border-orange-500 text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg relative overflow-hidden group-hover:border-orange-600">
                    <span className="relative">Login</span>
                  </button>
                </Link>
              </div>
            </div>

            <IndiaMapAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Why Puranveshana?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">Empowering communities to preserve cultural heritage</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Earn by Exploring Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            {/* <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              पुरान्वेषी भव — Be a PurAnveshi
            </div> */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2 flex items-center justify-center gap-2">
             <div><BadgeIndianRupee className='text-yellow-600 h-14 w-14'/></div> Reward Highlights
            </h2>
            <div className="bg-linear-to-r from-orange-100 via-amber-100 to-orange-100 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto mb-2 sm:mb-4 border-2 border-orange-200">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
               How Much Can You Earn?
              </h1>
              <p className="text-sm sm:text-base lg:text-lg font-semibold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Your discovery = Your reward. The rarer your find, the higher your payout.
              </p>
            </div>
          </div>

          {/* Reward System Table */}
          <div id="rewards" className="mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center px-2">Reward System</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
                  <thead className="bg-linear-to-r from-orange-500 to-amber-600 text-white">
                    <tr>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold">Type of Upload</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold">Reward</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold hidden md:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-orange-50 transition-colors">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Unique + Verified</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-green-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹500-₹2000</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        Your original photo/video with GPS location — temples, statues, ruins, inscriptions. Every genuine discovery counts!
                      </td>
                    </tr>
                    {/* <tr className="hover:bg-orange-50 transition-colors">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Duplicate / Copied</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-500 font-bold text-xs sm:text-sm lg:text-base">₹0</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        Already exists on the web or submitted by others.
                      </td>
                    </tr> */}
                    <tr className="hover:bg-orange-50 transition-colors">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Fake / Fraud</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-red-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹0</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        AI-generated, manipulated, or misleading content will result in account suspension. Authenticity is key.
                      </td>
                    </tr>
                    <tr className="hover:bg-orange-50 transition-colors bg-amber-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Rare Find 🏆</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-amber-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹5000-₹5,0000</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        Extraordinary finds — hidden temples, ancient inscriptions, rare idols, or undocumented archaeological sites. Make history!
                      </td>
                    </tr>
                    <tr className="hover:bg-orange-50 transition-colors bg-linear-to-r from-orange-50 to-amber-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Monthly Heritage Award</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-orange-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">5x Bonus</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        Top monthly contributor gets 5x their total earnings! Be the best explorer and multiply your rewards.
                      </td>
                    </tr>
                    {/* <tr className="hover:bg-orange-50 transition-colors bg-linear-to-r from-orange-50 to-amber-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Yearly Grand Award</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-orange-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹25,000+</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                        For outstanding contribution to India's heritage discovery.
                      </td>
                    </tr> */}
                  </tbody>
                </table>

                <div className='p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3 lg:pb-4'>
                  <div className='bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 border-l-4 border-amber-500 shadow-sm'>
                    <p className='flex items-center gap-2 text-sm sm:text-base lg:text-lg font-semibold text-amber-700'>
                      <span className='text-xl sm:text-2xl'>✓</span>
                      All uploads are verified. Only genuine, unique discoveries are rewarded.
                    </p>
                  </div>

                  {/* Upload Status Descriptions - Mobile Only */}
                  <div className="mt-4 bg-white rounded-xl p-5 shadow-md border border-orange-100 md:hidden">
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-semibold text-green-600">Unique + Verified:</span>
                        <span className="text-slate-600"> Your original photo/video with GPS location — temples, statues, ruins, inscriptions. Every genuine discovery counts!</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-slate-500">Duplicate:</span>
                        <span className="text-slate-600"> Already exists on web</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-red-500">Fake/Fraud:</span>
                        <span className="text-slate-600"> AI-generated, manipulated, or misleading content will result in account suspension. Authenticity is key.</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-amber-600">Rare Find:</span>
                        <span className="text-slate-600"> Extraordinary finds — hidden temples, ancient inscriptions, rare idols, or undocumented archaeological sites. Make history!</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-orange-600">Monthly Heritage Award:</span>
                        <span className="text-slate-600"> Top monthly contributor gets 5x their total earnings! Be the best explorer and multiply your rewards.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-amber-50 via-orange-50/30 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Start your journey as a PurAnveshi in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 hover:border-orange-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-3 lg:-right-4 items-center justify-center">
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* <div>
            <p className='flex items-start justify-start text-red-500'>"No risk, no complexity — upload → verify → earn."</p>
          </div> */}

          {/* Mobile descriptions - Shown on mobile after How It Works */}
          {/* <div className="md:hidden bg-white py-6 px-4 mb-6">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-3">
                <div className="text-xs text-slate-600">
                  <strong className="text-green-600">Unique + Verified:</strong> Original photo/video with location data
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-500">Duplicate:</strong> Already exists on web
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-red-600">Fake/Fraud:</strong> May result in suspension
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-amber-600">Rare Find:</strong> Exceptional discoveries (₹500–₹5,000+)
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-orange-600">Monthly/Yearly Awards:</strong> ₹10,000+ and ₹25,000+ for top PurAnveshis
                </div>
              </div>
            </div>
          </div> */}

          {/* Additional Info */}
          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white text-center shadow-xl">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Start Your Heritage Journey Today</h3>
            <p className="text-xs sm:text-sm lg:text-base text-orange-100 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Join a community of passionate explorers documenting India's forgotten heritage. Every upload helps preserve our cultural legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-orange-600 rounded-full font-bold text-sm hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-md">
                  Join as PurAnveshi
                </button>
              </Link>
              <Link href="#faq" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Demo Section */}
      <section id="see-it-in-action" className="py-12 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              See It In Action
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Watch how easy it is to document heritage sites and earn rewards
            </p>
          </div>

          <AppDemo />

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/signup">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Start Uploading Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join PurAnveshana */}
      <section id="why-join" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white via-slate-50 to-amber-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-linear-to-br from-orange-300 to-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-linear-to-br from-amber-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Why Join PurAnveshana
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Be part of a movement preserving India's forgotten heritage while earning rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Earn Real Money */}
            <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-green-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BadgeIndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Earn Real Money</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                  Simple, transparent, direct-to-UPI payments for every verified contribution you make.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full">Instant Payouts</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full">No Hidden Fees</span>
                </div>
              </div>
            </div>

            {/* Preserve Heritage */}
            <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-amber-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-100 to-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Preserve Heritage</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                  Your discoveries help us build the comprehensive map of forgotten India's cultural treasures.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold rounded-full">Cultural Impact</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold rounded-full">Legacy Builder</span>
                </div>
              </div>
            </div>

            {/* Get Recognized */}
            <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-purple-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-violet-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Get Recognized</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                  Be featured on our "Hall of Heritage" page and showcase your contributions to the nation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold rounded-full">Public Recognition</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold rounded-full">Top Contributor</span>
                </div>
              </div>
            </div>

            {/* Join the Movement */}
            <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-blue-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-cyan-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Join the Movement</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                  Become one of India's first citizen-archaeologists and shape the future of heritage preservation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">Community First</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">Pioneer Status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
            <div className="bg-linear-to-r from-orange-500 via-amber-600 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Make an Impact?
              </h3>
              <p className="text-base sm:text-lg text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of PurAnveshis across India who are documenting our shared heritage and earning rewards for their contributions.
              </p>
              <Link href="/signup">
                <button className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-white text-orange-600 rounded-full font-bold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3">
                  Start Your Journey Today
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Verified Means */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center px-2">What "Verified" Means</h3>
            <p className="text-center text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              We verify every upload for authenticity, location, and uniqueness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Authentic Content */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 shrink-0" />
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">1. Authentic Content</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">सत्य / वास्तविक</p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">•</span>
                    <span>You must click the photo or record the video yourself.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">•</span>
                    <span>Uploads from Google, social media, or AI tools are rejected.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">•</span>
                    <span>Only real places and heritage objects are rewarded.</span>
                  </li>
                </ul>
              </div>

              {/* Geotagged Location */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">2. Geotagged Location</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">भौगोलिकाङ्कित</p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Keep your phone's location (GPS) ON while capturing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>This confirms that the image was taken on-site.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                    <span>Verified locations appear on our "India's Hidden Heritage Map."</span>
                  </li>
                </ul>
              </div>

              {/* Unique Discovery */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 shrink-0" />
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">3. Unique Discovery</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">पुरातन स्थान अन्वेषण</p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                    <span>Our system checks if the same image exists online.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                    <span>If it's new and not listed anywhere — you earn the reward.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                    <span>Truly rare finds may get a PurAnveshi Bonus (₹500+).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Example Story */}
          <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Example</h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  <span className="font-semibold">Ramesh from Chhattisgarh</span> found an old stone carving near his village.
                  He uploaded clear photos with GPS on, added a short note about the site.
                  The system verified it — and he earned <span className="font-bold text-green-600">₹150</span> as an authentic, geotagged discovery.
                  His find now appears on the national PurAnveshana map.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-2">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
              <span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Explore, record, and preserve the stories of India's forgotten past.
              Every discovery you make brings ancient India closer to life again.
            </p>
            <Link href="/signup" className="inline-block">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
                Become a PurAnveshi
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white via-orange-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              See Puranveshana in Action
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Watch how our platform helps preserve India's heritage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Heritage Discovery & Rewards</h3>
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-100" style={{ paddingBottom: '56.25%' }}>
                  <VideoPlayer
                    src="/PurAnveshana_Heritage_Discovery_Rewards.mp4"
                    title="Heritage Discovery & Rewards"
                  />
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-3 sm:mt-4">
                  Learn how Puranveshana rewards explorers for documenting ancient heritage sites across India.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Platform Overview</h3>
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-100" style={{ paddingBottom: '56.25%' }}>
                  <VideoPlayer
                    src="/Video_Generation_With_Minimum_Duration.mp4"
                    title="Platform Overview"
                  />
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-3 sm:mt-4">
                  A comprehensive guide to using Puranveshana for heritage documentation and preservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}


      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">What we would like you to know ?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">Everything you need to know about becoming a PurAnveshi</p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 text-left">
                  What is the criteria to get paid?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                    openFaq === 1 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === 1 && (
                <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                  <p>To receive payment, your upload must meet these requirements:</p>
                  <ul className="space-y-2">
                    <li className="pl-4"><strong>Original Content:</strong> Photo/video taken by you, not downloaded from internet</li>
                    <li className="pl-4"><strong>GPS Enabled:</strong> Location data embedded in the image (keep GPS ON)</li>
                    <li className="pl-4"><strong>Unique Discovery:</strong> Not already documented in our system or online</li>
                    <li className="pl-4"><strong>Clear Documentation:</strong> Good quality images with accurate description</li>
                    <li className="pl-4"><strong>Verified:</strong> Passes our authenticity verification process</li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 text-left">
                  When and how will I receive payment?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                    openFaq === 2 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === 2 && (
                <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                  <p>Payment process:</p>
                  <ul className="space-y-2">
                    <li className="pl-4"><strong>Verification Time:</strong> 3-7 working days after submission</li>
                    <li className="pl-4"><strong>Notification:</strong> You will receive an in-app notification when verified</li>
                    <li className="pl-4"><strong>Payment Method:</strong> Direct bank transfer or UPI</li>
                    <li className="pl-4"><strong>Processing:</strong> Payments processed within 15 days of verification</li>
                    <li className="pl-4"><strong>Tracking:</strong> View payment status anytime in your dashboard</li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 text-left">
                  What kind of images get paid higher?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                    openFaq === 3 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === 3 && (
                <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                  <p>Higher rewards are given for:</p>
                  <ul className="space-y-2">
                    <li className="pl-4"><strong>Rare Discoveries:</strong> Undocumented sites, ancient inscriptions, rare idols (up to 500 rupees and above)</li>
                    <li className="pl-4"><strong>Multiple Angles:</strong> Comprehensive documentation with 5 or more clear photos</li>
                    <li className="pl-4"><strong>Historical Context:</strong> Detailed descriptions with local history or legends</li>
                    <li className="pl-4"><strong>Remote Locations:</strong> Lesser-known sites from rural or tribal areas</li>
                    <li className="pl-4"><strong>Quality Documentation:</strong> High-resolution images with proper lighting</li>
                    <li className="pl-4"><strong>Complete EXIF Data:</strong> Full GPS coordinates and camera metadata</li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 text-left">
                  What happens if I upload fake or copied images?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                    openFaq === 4 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === 4 && (
                <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                  <p>We take authenticity seriously:</p>
                  <ul className="space-y-2">
                    <li className="pl-4"><strong>First Offense:</strong> Upload rejected, no reward</li>
                    <li className="pl-4"><strong>Repeated Violations:</strong> Account suspension (temporary or permanent)</li>
                    <li className="pl-4"><strong>Fraudulent Activity:</strong> Legal action may be taken for deliberate fraud</li>
                    <li className="pl-4"><strong>Our Promise:</strong> Genuine contributors are always protected and rewarded</li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 text-left">
                  What happens to the images I upload?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                    openFaq === 5 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === 5 && (
                <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                  <p>Right now, all images you upload are stored privately for review and research. They will not be shared publicly until verified and properly documented.</p>
                  <p>Later, selected discoveries may appear on the PurAnveshana Heritage Map, with credit to the explorer — but without revealing exact coordinates or sensitive site details. This ensures both privacy and protection for the ancient sites.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Heritage Section */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Hall of Heritage</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">Celebrating India's Explorers</p>
          </div>

          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                <Award className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Monthly Winner</h3>
              <p className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3">₹10,000</p>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-orange-100">+ Certificate of Recognition</p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                <p className="text-sm sm:text-base font-semibold mb-2 text-orange-100">Featured Discovery</p>
                <p className="text-lg sm:text-2xl font-bold">9th-century temple ruins near Bellary, Karnataka</p>
              </div>

              <p className="mt-6 sm:mt-8 text-sm sm:text-base text-orange-100">
                Each month, we honor the top PurAnveshis who bring ancient India to light
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-r from-orange-500 to-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Preserve History?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8">
            Join thousands of heritage enthusiasts documenting India's ancient treasures
          </p>
          <Link href="/signup" className="inline-block">
            <button className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-orange-600 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-b from-gray-900 to-black text-white py-6 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-10">
            {/* Brand Section */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold">Puranveshana</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3 leading-relaxed">
                Discover, document, and preserve India's hidden ancient heritage.
              </p>
              <p className="text-xs text-slate-400 italic mb-3 sm:mb-4">
                <span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi
              </p>
              {/* Social Links */}
              <div className="flex gap-2 sm:gap-3">
                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-xs sm:text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-xs sm:text-sm">t</span>
                </a>
                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-xs sm:text-sm">in</span>
                </a>
                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-xs sm:text-sm">ig</span>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Platform</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
                <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
                <li><a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Resources</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
                <li><button onClick={() => setShowGuidelines(true)} className="hover:text-orange-400 transition-colors">Guidelines</button></li>
                <li><button onClick={() => setShowContributors(true)} className="hover:text-orange-400 transition-colors">Contributors</button></li>
                <li><button onClick={() => setShowStories(true)} className="hover:text-orange-400 transition-colors">Stories</button></li>
                <li><button onClick={() => setShowMap(true)} className="hover:text-orange-400 transition-colors">Map</button></li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-orange-400 transition-colors">Privacy</button></li>
                <li><button onClick={() => setShowTerms(true)} className="hover:text-orange-400 transition-colors">Terms</button></li>
                <li><button onClick={() => setShowContact(true)} className="hover:text-orange-400 transition-colors">Contact</button></li>
                <li><button onClick={() => setShowHelp(true)} className="hover:text-orange-400 transition-colors">Help</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                &copy; 2025 Puranveshana. All rights reserved.
              </p>
              <div className="flex gap-3 sm:gap-5 text-xs text-slate-400">
                <button onClick={() => setShowSitemap(true)} className="hover:text-orange-400 transition-colors">Sitemap</button>
                <button onClick={() => setShowAccessibility(true)} className="hover:text-orange-400 transition-colors">Accessibility</button>
                <button onClick={() => setShowCookies(true)} className="hover:text-orange-400 transition-colors">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Components */}
      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPrivacy(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
              <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">1. Information We Collect</h3>
              <p>We collect information you provide directly to us when you create an account, upload heritage site information, or communicate with us. This includes your email address, mobile number, uploaded images with GPS data, and site descriptions.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">2. How We Use Your Information</h3>
              <p>We use the information we collect to operate and improve our platform, verify authenticity of uploads, process payments, and communicate with you about your contributions.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">3. Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">4. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information. Contact us at privacy@puranveshana.com for any privacy-related requests.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">5. Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@puranveshana.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTerms(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
              <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">1. Acceptance of Terms</h3>
              <p>By accessing and using PurAnveshana, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">2. User Responsibilities</h3>
              <p>You agree to provide authentic, original content with accurate location data. You must not upload copyrighted material, AI-generated images, or false information.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">3. Content Ownership</h3>
              <p>You retain ownership of your uploaded content but grant us a license to use, display, and distribute it for the purpose of preserving and showcasing India's heritage.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">4. Payment Terms</h3>
              <p>Payments are made for verified, unique contributions. We reserve the right to reject submissions that don't meet our quality or authenticity standards. Once payment processing begins, uploaded content cannot be edited or deleted.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">5. Account Termination</h3>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, including those submitting fraudulent or copied content.</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowContact(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Contact Us</h2>
              <button onClick={() => setShowContact(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <a href="mailto:support@puranveshana.com" className="text-orange-600 hover:text-orange-700">support@puranveshana.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                  <a href="tel:+911234567890" className="text-orange-600 hover:text-orange-700">+91 123 456 7890</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Address</h3>
                  <p className="text-slate-600 text-sm">Heritage Preservation Society<br />New Delhi, India</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-6">
                <p className="text-sm text-slate-700">
                  <strong className="text-orange-700">Support Hours:</strong><br />
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                  Response time: Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGuidelines(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Contribution Guidelines</h2>
              <button onClick={() => setShowGuidelines(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">What to Upload</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ancient temples, ruins, and historical structures</li>
                <li>Rock art, cave paintings, and inscriptions</li>
                <li>Forgotten monuments and archaeological sites</li>
                <li>Traditional architecture and heritage buildings</li>
                <li>Historical landmarks not widely documented</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Photography Guidelines</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep GPS location ON while capturing photos</li>
                <li>Take multiple angles of the site (5+ photos recommended)</li>
                <li>Ensure good lighting and clear visibility</li>
                <li>Include context shots showing surroundings</li>
                <li>Use high resolution (minimum 1920x1080)</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Description Best Practices</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide exact location details</li>
                <li>Include historical context if known</li>
                <li>Mention local legends or stories</li>
                <li>Describe the current condition</li>
                <li>Note any unique architectural features</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">What NOT to Upload</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Images downloaded from internet</li>
                <li>AI-generated or manipulated photos</li>
                <li>Copyrighted content</li>
                <li>Modern buildings or recent constructions</li>
                <li>Sites already well-documented online</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Help Center</h2>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
                <h3 className="font-bold text-slate-900 mb-2">Quick Start</h3>
                <p className="text-sm text-slate-700">New to PurAnveshana? Check out our <a href="#how-it-works" onClick={() => setShowHelp(false)} className="text-orange-600 font-semibold">How It Works</a> section to get started!</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Common Questions</h3>
                <div className="space-y-3">
                  <details className="group bg-slate-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer text-slate-900">How do I upload a site?</summary>
                    <p className="mt-2 text-sm text-slate-700">Sign up, go to your dashboard, click "Upload New Site", add photos with GPS enabled, write a description, and submit for verification.</p>
                  </details>

                  <details className="group bg-slate-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer text-slate-900">When will I get paid?</summary>
                    <p className="mt-2 text-sm text-slate-700">Payments are processed within 15 days after your upload is verified. You'll receive a notification once verification is complete.</p>
                  </details>

                  <details className="group bg-slate-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer text-slate-900">Why was my upload rejected?</summary>
                    <p className="mt-2 text-sm text-slate-700">Common reasons include: missing GPS data, duplicate content, poor image quality, or downloaded images. Check your email for specific feedback.</p>
                  </details>

                  <details className="group bg-slate-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer text-slate-900">How do I become a Platinum member?</summary>
                    <p className="mt-2 text-sm text-slate-700">Membership tiers are based on verified uploads: Silver (5+), Gold (20+), Platinum (50+). Keep contributing authentic discoveries!</p>
                  </details>
                </div>
              </div>

              <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white">
                <h3 className="font-bold mb-2">Still need help?</h3>
                <p className="text-sm mb-3">Contact our support team for personalized assistance.</p>
                <button onClick={() => { setShowHelp(false); setShowContact(true); }} className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Modal */}
      {showSitemap && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSitemap(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Sitemap</h2>
              <button onClick={() => setShowSitemap(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Main Pages</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
                  <li><a href="#features" onClick={() => setShowSitemap(false)} className="hover:text-orange-600 transition-colors">Features</a></li>
                  <li><a href="#how-it-works" onClick={() => setShowSitemap(false)} className="hover:text-orange-600 transition-colors">How It Works</a></li>
                  <li><a href="#faq" onClick={() => setShowSitemap(false)} className="hover:text-orange-600 transition-colors">FAQ</a></li>
                  <li><Link href="/dashboard" className="hover:text-orange-600 transition-colors">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Account</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li><Link href="/signup" className="hover:text-orange-600 transition-colors">Sign Up</Link></li>
                  <li><Link href="/login" className="hover:text-orange-600 transition-colors">Login</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li><button onClick={() => { setShowSitemap(false); setShowGuidelines(true); }} className="hover:text-orange-600 transition-colors">Contribution Guidelines</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowContributors(true); }} className="hover:text-orange-600 transition-colors">Contributors</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowStories(true); }} className="hover:text-orange-600 transition-colors">Success Stories</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowMap(true); }} className="hover:text-orange-600 transition-colors">Heritage Map</button></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Legal & Support</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li><button onClick={() => { setShowSitemap(false); setShowPrivacy(true); }} className="hover:text-orange-600 transition-colors">Privacy Policy</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowTerms(true); }} className="hover:text-orange-600 transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowCookies(true); }} className="hover:text-orange-600 transition-colors">Cookie Policy</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowContact(true); }} className="hover:text-orange-600 transition-colors">Contact Us</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowHelp(true); }} className="hover:text-orange-600 transition-colors">Help Center</button></li>
                  <li><button onClick={() => { setShowSitemap(false); setShowAccessibility(true); }} className="hover:text-orange-600 transition-colors">Accessibility</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Modal */}
      {showAccessibility && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAccessibility(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Accessibility Statement</h2>
              <button onClick={() => setShowAccessibility(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
              <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Our Commitment</h3>
              <p>PurAnveshana is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Conformance Status</h3>
              <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Accessibility Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatible</li>
                <li>Clear and consistent navigation</li>
                <li>Alternative text for images</li>
                <li>Responsive design for various devices</li>
                <li>High contrast color scheme options</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Feedback</h3>
              <p>We welcome your feedback on the accessibility of PurAnveshana. Please contact us if you encounter accessibility barriers:</p>
              <p>Email: <a href="mailto:accessibility@puranveshana.com" className="text-orange-600">accessibility@puranveshana.com</a></p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Technical Specifications</h3>
              <p>PurAnveshana relies on the following technologies to work with web browsers and assistive technologies:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
                <li>WAI-ARIA</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {showCookies && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCookies(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Cookie Policy</h2>
              <button onClick={() => setShowCookies(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
              <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">What Are Cookies</h3>
              <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">How We Use Cookies</h3>
              <p>We use cookies for the following purposes:</p>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-slate-200 rounded-lg mt-4">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">Essential</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Required for authentication and basic site functionality</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">Functional</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Remember your preferences and settings</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">Analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Help us understand how you use the platform</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">Performance</td>
                      <td className="px-4 py-3 text-sm text-slate-700">Improve site speed and user experience</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Managing Cookies</h3>
              <p>You can control and manage cookies in your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Third-Party Cookies</h3>
              <p>We may use third-party services that also set cookies on your device. These include analytics providers and authentication services. These third parties have their own privacy policies.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">Contact Us</h3>
              <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@puranveshana.com" className="text-orange-600">privacy@puranveshana.com</a></p>
            </div>
          </div>
        </div>
      )}

      {/* Heritage Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMap(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">India's Hidden Heritage Map</h2>
              <button onClick={() => setShowMap(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon!</h3>
                    <p className="text-slate-700">We are building an interactive map to showcase all the heritage sites discovered by PurAnveshis across India.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Planned Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Interactive Map View</h4>
                      <p className="text-sm text-slate-700">Explore heritage sites on an interactive map of India with zoom and filter options</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">GPS-Tagged Locations</h4>
                      <p className="text-sm text-slate-700">Every verified site will appear with exact GPS coordinates and detailed information</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Filter by Category</h4>
                      <p className="text-sm text-slate-700">Search for temples, ruins, inscriptions, rock art, and more</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Contributor Credits</h4>
                      <p className="text-sm text-slate-700">See which PurAnveshi discovered each site and read their stories</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Virtual Tours</h4>
                      <p className="text-sm text-slate-700">View photo galleries and 360-degree images of documented sites</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
                <h3 className="font-bold mb-2">Help Build the Map</h3>
                <p className="text-sm mb-4">Every verified upload you make will appear on our heritage map. Start discovering today!</p>
                <Link href="/signup">
                  <button onClick={() => setShowMap(false)} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                    Become a PurAnveshi
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contributors Modal */}
      {showContributors && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowContributors(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Contributors</h2>
              <button onClick={() => setShowContributors(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Join the PurAnveshi Community</h3>
                <p className="text-slate-700">Thousands of passionate explorers are documenting India's forgotten heritage. Become part of this movement to preserve our cultural legacy.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Membership Tiers</h3>
                <div className="space-y-3">
                  <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-slate-900">Silver PurAnveshi</h4>
                      <span className="px-3 py-1 bg-slate-400 text-white rounded-full text-xs font-bold">5+ Uploads</span>
                    </div>
                    <p className="text-sm text-slate-700">Entry-level contributors documenting local heritage sites</p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-slate-900">Gold PurAnveshi</h4>
                      <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">20+ Uploads</span>
                    </div>
                    <p className="text-sm text-slate-700">Active contributors with verified discoveries across multiple locations</p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-slate-900">Platinum PurAnveshi</h4>
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">50+ Uploads</span>
                    </div>
                    <p className="text-sm text-slate-700">Elite contributors dedicated to heritage preservation with exceptional discoveries</p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Benefits of Higher Tiers</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Priority verification for new uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Higher reward potential for rare discoveries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Featured on our contributors leaderboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Special recognition badges on your profile</span>
                  </li>
                </ul>
              </div>

              <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
                <h3 className="font-bold mb-2"><span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi</h3>
                <p className="text-sm mb-4">Start your journey today and join our growing community of heritage preservers</p>
                <Link href="/signup">
                  <button onClick={() => setShowContributors(false)} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                    Join Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Stories Modal */}
      {showStories && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowStories(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Success Stories</h2>
              <button onClick={() => setShowStories(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <p className="text-slate-700">Inspiring stories from PurAnveshis who are making a difference in heritage preservation.</p>

              <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-l-4 border-orange-500">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Ramesh's Ancient Temple Discovery</h3>
                    <p className="text-sm text-orange-600 font-semibold">Chhattisgarh</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">Ramesh, a school teacher from rural Chhattisgarh, discovered a 10th-century stone temple hidden in the forest near his village. His detailed documentation with GPS data earned him recognition and a reward of 150 rupees. The site is now being studied by archaeologists.</p>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-semibold">Verified Discovery</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">150 rupees earned</span>
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shrink-0">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Priya's Rock Art Documentation</h3>
                    <p className="text-sm text-blue-600 font-semibold">Madhya Pradesh</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">Priya, a college student and photography enthusiast, documented prehistoric rock paintings in a remote cave system. Her comprehensive photo series helped researchers date the art to over 8,000 years old. She received a rare find bonus of 600 rupees and achieved Gold PurAnveshi status.</p>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-600 font-semibold">Rare Discovery</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">600 rupees earned</span>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Vikram's Heritage Village Project</h3>
                    <p className="text-sm text-green-600 font-semibold">Rajasthan</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">Vikram systematically documented 35 forgotten step-wells and water structures in his district over 6 months. His dedication earned him Platinum PurAnveshi status and his work is now featured in a heritage conservation report by the state government.</p>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 font-semibold">Platinum PurAnveshi</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">35+ sites documented</span>
                </div>
              </div>

              <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
                <h3 className="font-bold mb-2">Your Story Could Be Next</h3>
                <p className="text-sm mb-4">Every heritage site you discover adds to India's cultural map and helps preserve our history for future generations</p>
                <Link href="/signup">
                  <button onClick={() => setShowStories(false)} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                    Start Your Journey
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

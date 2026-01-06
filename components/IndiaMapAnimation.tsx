"use client";
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SimpleIndiaMap } from './SimpleIndiaMap';

export function IndiaMapAnimation() {
  const [activePoint, setActivePoint] = useState(0);
  const [mounted, setMounted] = useState(false);

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
    }, 5000);

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

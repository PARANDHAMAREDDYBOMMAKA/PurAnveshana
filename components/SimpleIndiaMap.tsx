"use client";
import Image from 'next/image';

export function SimpleIndiaMap({ sites, activePoint }: { sites: any[], activePoint: number }) {
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
            <div className="relative w-full h-full -rotate-45 scale-150">
              <Image
                src={activeSite.image}
                fill
                className="object-cover"
                alt={activeSite.name}
                sizes="48px"
              />
            </div>
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

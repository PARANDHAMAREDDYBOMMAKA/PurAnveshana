"use client";

import Image from 'next/image';
import { Camera } from 'lucide-react';

const images = [
  { src: '/heritage/temple-gateway.jpeg', alt: 'Ancient temple gateway', caption: 'Temple Gateway' },
  { src: '/heritage/yali-sculpture.jpeg', alt: 'Yali sculpture on temple pillar', caption: 'Yali Sculpture' },
  { src: '/heritage/stone-ruins.jpeg', alt: 'Stone ruins against blue sky', caption: 'Stone Ruins' },
  { src: '/heritage/temple-doorway.jpeg', alt: 'Stone temple doorway', caption: 'Temple Doorway' },
  { src: '/heritage/nandi-statue.jpeg', alt: 'Nandi statue at sunset', caption: 'Nandi Statue' },
  { src: '/heritage/ancient-stepwell.jpeg', alt: 'Ancient stepwell with boulders', caption: 'Ancient Stepwell' },
];

export function HeritageGallery() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-linear-to-b from-white via-amber-50/20 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 sm:w-12 h-px bg-amber-600/40"></span>
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700/60" />
            <span className="w-8 sm:w-12 h-px bg-amber-600/40"></span>
          </div>
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            From the Field
          </h2>
          <p className="text-amber-700/60 text-xs sm:text-sm tracking-wider uppercase">
            Heritage captured by explorers
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden -mx-3">
          <div className="flex gap-3 overflow-x-auto px-3 pb-4 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {images.map((img, i) => (
              <div key={i} className="shrink-0 w-[70vw] snap-center">
                <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-amber-200/60"
                  style={{ boxShadow: '0 4px 20px rgba(139, 90, 43, 0.12)' }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="70vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-amber-950/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-amber-100 text-xs font-medium" style={{ fontFamily: 'Georgia, serif' }}>{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: masonry-like grid */}
        <div className="hidden sm:grid grid-cols-3 gap-3 lg:gap-4">
          {/* Row 1: tall - short - tall */}
          <div className="relative aspect-3/4 rounded-2xl overflow-hidden group border border-amber-200/40"
            style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
            <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[0].caption}</p>
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden group border border-amber-200/40"
              style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
              <Image src={images[1].src} alt={images[1].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
              <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[1].caption}</p>
              </div>
            </div>
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden group border border-amber-200/40"
              style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
              <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
              <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[2].caption}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-3/4 rounded-2xl overflow-hidden group border border-amber-200/40"
            style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
            <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
            <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[3].caption}</p>
            </div>
          </div>
        </div>

        {/* Bottom row on desktop: 2 wider images */}
        <div className="hidden sm:grid grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden group border border-amber-200/40"
            style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
            <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
            <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[4].caption}</p>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden group border border-amber-200/40"
            style={{ boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
            <Image src={images[5].src} alt={images[5].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
            <div className="absolute inset-0 bg-linear-to-t from-amber-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-amber-100 text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>{images[5].caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

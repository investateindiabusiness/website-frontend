"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GalleryPage() {
  const awardImages = Array.from({ length: 8 }, (_, i) => `/images/deepak${i + 1}.png`);
  const generalImages = Array.from({ length: 12 }, (_, i) => `/images/g${i + 1}.png`);
  const allImages = [...awardImages, ...generalImages];

  return (
    <div className="w-full bg-[var(--color-light-bg,#FAFAF9)] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">

        {/* Full Gallery Section */}
        <section className="py-16 md:py-24 bg-white" id="gallery">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-wide uppercase mb-4">
                Our Gallery
              </h2>
              <div className="w-24 h-1 bg-[var(--color-accent,#D48035)] mx-auto mb-6 rounded-full" />
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A glimpse into our events, achievements, and the vibrant community that drives us forward.
              </p>
            </div>
            
            {/* Featured Videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-16">
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100 relative group">
                <iframe 
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/tqyvZQSsWks?rel=0" 
                  title="Featured Video 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100 relative group">
                <iframe 
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/deHjzUy3Odc?rel=0" 
                  title="Featured Video 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Uniform Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {allImages.map((src, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-sm aspect-[4/3]"
                >
                  <img
                    src={src}
                    alt={`Gallery Event ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

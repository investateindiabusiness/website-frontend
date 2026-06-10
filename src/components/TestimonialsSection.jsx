"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { id: 1, quote: "Transparency and honest communication are the first things I look for before investing in any real estate opportunity.", author: "Prospective Investor" },
  { id: 2, quote: "A company that provides clear documentation and timely updates earns my trust and confidence.", author: "Market Survey Participant" },
  { id: 3, quote: "I prefer investment opportunities that focus on long-term value creation rather than short-term gains.", author: "Early User Feedback" },
  { id: 4, quote: "Professional guidance throughout the investment journey is very important when exploring a new platform.", author: "Prospective Customer" },
  { id: 5, quote: "Regular project updates and a responsive team make it easier to make informed investment decisions.", author: "Pre-Launch Survey Response" },
  { id: 6, quote: "I value a real estate platform that prioritizes integrity, transparency, and lasting relationships with investors.", author: "Customer Research Participant" },
  { id: 7, quote: "A strong vision, experienced leadership, and a commitment to quality are the factors that encourage me to consider a new investment partner.", author: "Potential Investor" }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate max index to prevent scrolling past the last item
  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  useEffect(() => {
    // Ensure activeIndex is valid if screen resizes
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [maxIndex, activeIndex]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000); // Time limit auto-play
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const handlePrev = () => setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <section className="py-24 bg-[var(--color-light-bg,#FAFAF9)] relative overflow-hidden" id="testimonials">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[var(--color-accent,#D48035)] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[var(--color-primary,#61a534)] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-wide uppercase mb-4">
            Voices of Trust
          </h2>
          <div className="w-24 h-1 bg-[var(--color-accent,#D48035)] mx-auto mb-6 rounded-full" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See what our community and prospective investors have to say about our commitment to excellence.
          </p>
        </div>

        <div 
          className="flex flex-col items-center justify-center relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Sliding Track Carousel */}
          <div className="relative w-full overflow-hidden py-4 px-2 -mx-3">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * (100 / testimonials.length)}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ width: `${(testimonials.length / cardsToShow) * 100}%` }}
            >
              {testimonials.map((item, idx) => (
                <div 
                  key={idx}
                  className="w-full flex-shrink-0 flex justify-center px-3"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <div className="w-full max-w-[380px] aspect-square flex-shrink-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col justify-between relative group hover:-translate-y-2 hover:border-[var(--color-accent,#D48035)] transition-all duration-300">
                    <Quote className="absolute top-6 left-6 w-10 h-10 text-[var(--color-accent,#D48035)] opacity-10 transform -scale-x-100 group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10 flex-1 flex items-center mt-4">
                      <p className="text-base md:text-lg font-light text-gray-700 leading-relaxed italic text-center w-full">
                        "{item.quote}"
                      </p>
                    </div>
                    <div className="relative z-10 mt-6 pt-6 border-t border-gray-100 flex flex-col items-center">
                      <h4 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-widest text-center">
                        {item.author}
                      </h4>
                      <div className="w-8 h-1 bg-[var(--color-accent,#D48035)] mt-3 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12 z-20">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-3">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`transition-all duration-300 rounded-full h-2.5 ${activeIndex === idx ? 'w-10 bg-[var(--color-accent,#D48035)]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] hover:shadow-lg transition-all duration-300 transform hover:translate-x-1"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

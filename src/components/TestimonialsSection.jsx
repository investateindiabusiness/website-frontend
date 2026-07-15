"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "After exploring several platforms, Investate India stood out for its clear approach, transparency, and focus on verified opportunities. It gave me greater confidence before making investment decisions.",
    author: "NRI Investor • United States",
  },
  {
    id: 2,
    quote:
      "The platform brings investors, builders, and professional experts together in one place. Having access to legal and compliance support adds significant value.",
    author: "Real Estate Investor • Dubai",
  },
  {
    id: 3,
    quote:
      "What impressed me most was the structured presentation of projects and the emphasis on trust rather than aggressive sales. That builds long-term confidence.",
    author: "Investor • USA",
  },
  {
    id: 4,
    quote:
      "As a builder, we look for platforms that connect us with genuine investors instead of generating unnecessary enquiries. Investate India's ecosystem is designed with that objective.",
    author: "Builder Partner • Hyderabad",
  },
  {
    id: 5,
    quote:
      "Having access to legal, taxation, and professional advisory services through one ecosystem simplifies the entire investment journey, especially for overseas investors.",
    author: "NRI Investor • Dubai",
  },
  {
    id: 6,
    quote:
      "The platform's vision of combining real estate, capital sourcing, and professional services creates a comprehensive ecosystem that goes beyond traditional property portals.",
    author: "Business Owner • Bengaluru",
  },
  {
    id: 7,
    quote:
      "Transparency, verified opportunities, and long-term relationships are exactly what international investors expect. Investate India is moving in the right direction.",
    author: "Investor • USA",
  },
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
    <section className="py-24 bg-[#FEFEFE] dark:bg-[#111] relative overflow-hidden" id="testimonials">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[var(--color-accent,#D48035)] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[var(--color-primary,#61a534)] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-wide uppercase mb-4">
            What Our Community Says
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Feedback and perspectives from investors, builders, business leaders, and professionals who believe in a transparent and trusted investment ecosystem.
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow — beside cards */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow — beside cards */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] hover:shadow-lg transition-all duration-300 transform hover:translate-x-1 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Sliding Track Carousel */}
          <div className="relative w-full overflow-hidden py-4 px-8 md:px-16">
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

          {/* Mobile arrows + Dots — bottom center */}
          <div className="flex justify-center items-center gap-4 mt-8 z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] transition-all duration-300 md:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
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
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[var(--color-accent,#D48035)] hover:border-[var(--color-accent,#D48035)] transition-all duration-300 md:hidden"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

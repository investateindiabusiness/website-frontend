"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const awardsData = [
  {
    id: 1,
    title: <>Shri Narendra Modi<br />Prime Minister of India</>,
    image: "/images/deepak1.png"
  },
  {
    id: 2,
    title: <>Shri Nitin Gadkari<br />Minister of Road Transport and Highways of India</>,
    image: "/images/deepak2.png"
  },
  // {
  //   id: 3,
  //   title: "Real Estate Leader of the Year by Business Mint",
  //   image: "/images/deepak3.png"
  // },
  {
    id: 4,
    title: <>Shri Bhajan Lal Sharma<br />Chief Minister of Rajasthan</>,
    image: "/images/deepak4.png"
  },
  {
    id: 5,
    title: <>Princess Diya Kumari<br />Minister of Finance of Rajasthan</>,
    image: "/images/deepak5.png"
  },
  {
    id: 6,
    title: <>Manish Awasthi<br />Journalist/News Anchor</>,
    image: "/images/deepak6.png"
  },
  {
    id: 7,
    title: <>Deepak Chaurasia<br />Journalist/News Anchor</>,
    image: "/images/deepak7.png"
  },
  {
    id: 8,
    title: <>Save India from Dengue</>,
    image: "/images/deepak8.png"
  }
];

export default function AwardsSection() {
  const [activeIndex, setActiveIndex] = useState(awardsData.length);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Update visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Re-enable transition after a zero-duration jump/reset
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  // Auto-slide mechanism
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 2000); // Auto-slide every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    if (!transitionEnabled) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!transitionEnabled) return;
    setActiveIndex((prev) => prev + 1);
  };

  const handleAnimationComplete = () => {
    if (activeIndex >= awardsData.length * 2) {
      setTransitionEnabled(false);
      setActiveIndex(activeIndex - awardsData.length);
    } else if (activeIndex < awardsData.length) {
      setTransitionEnabled(false);
      setActiveIndex(activeIndex + awardsData.length);
    }
  };

  const extendedAwardsData = [...awardsData, ...awardsData, ...awardsData];

  return (
    <section
      className="py-16 md:py-24 bg-[var(--color-light-bg,#FAFAF9)] overflow-hidden"
      id="awards"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Area */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide uppercase">
            Moments of Pride
          </h2>

          {/* Circular Navigation Buttons */}
          <div className="flex gap-3 mb-1">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 transition-all hover:border-[var(--color-accent,#D48035)] hover:text-[var(--color-accent,#D48035)] hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 transition-all hover:border-[var(--color-accent,#D48035)] hover:text-[var(--color-accent,#D48035)] hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom SVG Curved Divider */}
        <div className="w-full mb-12">
          <svg
            viewBox="0 0 1200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8"
            preserveAspectRatio="none"
          >
            {/* Green curve on the left */}
            <path
              d="M 0 22 H 95 C 110 22, 115 28, 115 38"
              stroke="var(--color-primary, #61a534)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Orange curve and horizontal line to the right */}
            <path
              d="M 115 38 C 118 24, 126 10, 145 10 H 1200"
              stroke="var(--color-accent, #e56e20)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Carousel Slider */}
        <div className="relative overflow-visible">
          <div className="overflow-hidden">
            <motion.div
              className="flex -mx-4"
              animate={{ x: `-${activeIndex * (100 / visibleCards)}%` }}
              transition={transitionEnabled ? { type: "spring", stiffness: 260, damping: 28 } : { duration: 0 }}
              onAnimationComplete={handleAnimationComplete}
            >
              {extendedAwardsData.map((award, index) => (
                <div
                  key={`${award.id}-${index}`}
                  className={`px-4 flex-shrink-0`}
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <div className="group h-full flex flex-col">
                    {/* Award Image with zoom hover effect */}
                    <div className="overflow-hidden rounded-lg shadow-sm border border-gray-100 aspect-[4/3] bg-gray-50">
                      <img
                        src={award.image}
                        alt={typeof award.title === 'string' ? award.title : "Moments of Pride"}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Award Description */}
                    <p className="text-gray-600 text-[1.05rem] leading-relaxed font-normal mt-6">
                      {award.title}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dot Progress Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {awardsData.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!transitionEnabled) return;
                setActiveIndex(awardsData.length + i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: (activeIndex % awardsData.length) === i ? '1.5rem' : '0.5rem',
                height: '0.5rem',
                background: (activeIndex % awardsData.length) === i ? 'var(--color-accent, #D48035)' : '#D1D5DB',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

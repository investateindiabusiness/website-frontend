"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PlayPauseButton({
  isPaused,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "bottom-8",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave();
  };

  // SVG paths for morphing
  // Play state: Left path (trapezoid) and Right path (triangle) join perfectly at x=12
  const playD1 = "M 8 5 L 12 7.55 L 12 16.45 L 8 19 Z";
  const playD2 = "M 12 7.55 L 19 12 L 19 12 L 12 16.45 Z";

  // Pause state: Left bar and Right bar
  const pauseD1 = "M 6 5 L 10 5 L 10 19 L 6 19 Z";
  const pauseD2 = "M 14 5 L 18 5 L 18 19 L 14 19 Z";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            aria-label={isPaused ? "Play Auto-rotation" : "Pause Auto-rotation"}
            className={`absolute left-1/2 -translate-x-1/2 z-[30] flex items-center justify-center w-12 h-12 border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md cursor-pointer transition-all duration-200 focus:outline-none hover:bg-white/25 ${className}`}
            animate={{
              borderRadius: isHovered
                ? ["50% 50% 50% 50%", "40% 60% 45% 55%", "55% 45% 60% 40%", "50% 50% 50% 50%"]
                : ["50% 50% 50% 50%", "48% 52% 47% 53%", "52% 48% 53% 47%", "50% 50% 50% 50%"],
              scale: isHovered ? 1.12 : 1,
            }}
            transition={{
              borderRadius: {
                duration: isHovered ? 2.5 : 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                type: "spring",
                stiffness: 400,
                damping: 20,
              }
            }}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-white stroke-none"
              >
                <motion.path
                  animate={{ d: isPaused ? playD1 : pauseD1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                />
                <motion.path
                  animate={{ d: isPaused ? playD2 : pauseD2 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                />
              </svg>
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="z-50 bg-slate-950/90 border border-white/20 text-white font-medium text-xs rounded-lg shadow-lg px-3 py-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {isPaused ? "Play auto-rotation" : "Pause auto-rotation"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { Badge } from './badge';

export default function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  emptyMessage = "No options found."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (option) => {
    let updated;
    if (selected.includes(option)) {
      updated = selected.filter(item => item !== option);
    } else {
      updated = [...selected, option];
    }
    onChange(updated);
  };

  const handleRemoveOption = (e, option) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full text-left font-sans">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex items-center justify-between gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all bg-white"
      >
        <div className="flex flex-wrap gap-1.5 flex-grow">
          {selected.length === 0 ? (
            <span className="text-gray-400 text-sm font-semibold select-none">{placeholder}</span>
          ) : (
            selected.map(val => (
              <Badge
                key={val}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] py-0.5 px-2 rounded-lg flex items-center gap-1 select-none"
              >
                {val}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(e, val)}
                  className="hover:bg-orange-700/50 rounded-full p-0.5 text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 space-y-2 max-h-72 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box */}
          <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-200 px-3 flex-shrink-0">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2 px-2.5 text-sm text-gray-700 font-semibold"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto flex-grow space-y-1 pr-1">
            {filteredOptions.length === 0 ? (
              <p className="text-xs text-gray-400 font-bold text-center py-4 select-none">{emptyMessage}</p>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => handleToggleOption(opt)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

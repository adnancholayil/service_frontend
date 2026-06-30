import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function SelectSearch({ options = [], value, onChange, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 py-1 placeholder:text-slate-400"
              placeholder="Search category..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-sm text-slate-500">No categories found</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    value === opt.value 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <Check className="h-4 w-4 text-emerald-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

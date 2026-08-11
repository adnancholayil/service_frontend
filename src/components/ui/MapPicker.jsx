'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

// Fix for default leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setAddress }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      fetchAddress(lat, lng);
    },
  });

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`Near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (err) {
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  // Keep map centered when position updates from outside
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function MapPicker({ onConfirm, onCancel, initialPosition = null }) {
  const defaultPos = [10.8505, 76.2711]; // Default to Kerala center
  const [position, setPosition] = useState(initialPosition || defaultPos);
  const [address, setAddress] = useState('Fetching address...');
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (initialPosition) {
      fetchAddress(initialPosition[0], initialPosition[1]);
    } else {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          fetchAddress(newPos[0], newPos[1]);
          setIsLocating(false);
        },
        () => {
          fetchAddress(defaultPos[0], defaultPos[1]);
          setIsLocating(false);
        }
      );
    }
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2 && showSuggestions) {
        setIsSearching(true);
        try {
          // Limit to India with countrycodes=in for better local results
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=in`);
          const data = await res.json();
          setSuggestions(data || []);
        } catch (error) {
          console.error('Error fetching suggestions', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showSuggestions]);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`Near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (err) {
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const newPos = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setPosition(newPos);
    setAddress(suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full rounded-xl overflow-hidden bg-background">
      <div className="p-3 bg-card border-b border-border z-[1100] relative">
        <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
          <input
            type="text"
            placeholder="Search for a location (e.g., Calicut, Kerala)"
            className="flex-1 px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-brand shadow-sm transition-colors"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
          />
          <Button type="submit" variant="primary" disabled={isSearching} className="px-4 py-3 shrink-0 flex items-center justify-center">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-[1200]">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.place_id || index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-3 text-sm text-foreground hover:bg-brand/5 hover:text-brand cursor-pointer border-b border-border last:border-b-0 flex items-center gap-3 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{suggestion.display_name}</span>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      <div className="relative flex-1">
        {isLocating && (
          <div className="absolute inset-0 z-[1000] bg-background/50 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        )}
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
        </MapContainer>
      </div>
      <div className="p-4 border-t border-border bg-card shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[1000] relative">
        <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand" />
          Selected Address
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
          {address}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={() => onConfirm({ address, coordinates: position })}>
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GpsIcon, SearchIcon, MapPinIcon, RefreshCwIcon } from './Icons';
import { UserLocation } from '@/lib/types';
import { INDONESIA_PRESET_LOCATIONS } from '@/lib/hotspots-data';

interface LocationInputProps {
  currentLocation: UserLocation;
  scanRadiusKm: number;
  onSelectLocation: (loc: UserLocation) => void;
  onChangeRadius: (radius: number) => void;
  isLoading?: boolean;
}

export default function LocationInput({
  currentLocation,
  scanRadiusKm,
  onSelectLocation,
  onChangeRadius,
  isLoading = false
}: LocationInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchTerm.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Geocode search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GPS Location Handler
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung geolokasi');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let placeName = `Lokasi GPS Saya (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        // Reverse geocode via Nominatim to get Kecamatan/City name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: { 'User-Agent': 'DeteksiKebakaran-App/1.0' }
            }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const sub = addr.suburb || addr.village || addr.town || addr.city_district || '';
            const city = addr.city || addr.county || addr.state_district || '';
            if (sub && city) {
              placeName = `${sub}, ${city} (GPS)`;
            } else if (city) {
              placeName = `${city} (GPS)`;
            }
          }
        } catch {
          // Keep default coordinate name
        }

        onSelectLocation({
          name: placeName,
          lat: latitude,
          lon: longitude,
          isGps: true
        });
        setIsGpsLoading(false);
        setSearchTerm('');
        setShowDropdown(false);
      },
      (err) => {
        setIsGpsLoading(false);
        let msg = 'Gagal mendeteksi lokasi GPS.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Izin akses lokasi GPS ditolak oleh browser.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Informasi lokasi GPS tidak tersedia.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Waktu permintaan lokasi GPS habis.';
        }
        setGpsError(msg);
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (preset: (typeof INDONESIA_PRESET_LOCATIONS)[0]) => {
    onSelectLocation({
      name: `${preset.district}, ${preset.name}, ${preset.province}`,
      lat: preset.lat,
      lon: preset.lon
    });
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/80">
        <div>
          <span className="text-[11px] font-mono tracking-wider text-orange-400 font-semibold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            TITIK PANTAU PENGGUNA
          </span>
          <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2 mt-0.5">
            <MapPinIcon className="w-5 h-5 text-orange-500 shrink-0" />
            <span className="truncate">{currentLocation.name}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800 shrink-0">
          <span>LAT: {currentLocation.lat.toFixed(4)}°</span>
          <span>LON: {currentLocation.lon.toFixed(4)}°</span>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search by Kecamatan/Kota input */}
        <div className="relative md:col-span-8" ref={dropdownRef}>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder="Cari nama Kecamatan, Kota, atau Kabupaten..."
              className="w-full bg-zinc-950/90 border border-zinc-700/80 text-zinc-100 pl-10 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-zinc-500"
            />
            {isSearching && (
              <RefreshCwIcon className="absolute right-3.5 w-4 h-4 text-orange-400 animate-spin" />
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-zinc-800">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectLocation({
                      name: item.name,
                      lat: item.lat,
                      lon: item.lon
                    });
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-orange-500/10 hover:text-orange-300 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-orange-400 truncate">
                      {item.shortName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{item.name}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 group-hover:bg-orange-950 group-hover:text-orange-300 px-2 py-0.5 rounded shrink-0">
                    PILIH
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Button */}
        <div className="md:col-span-4">
          <button
            type="button"
            onClick={handleGetGps}
            disabled={isGpsLoading}
            className="w-full h-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition shadow-lg shadow-orange-950/40"
          >
            {isGpsLoading ? (
              <>
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
                <span>Mendeteksi GPS...</span>
              </>
            ) : (
              <>
                <GpsIcon className="w-4 h-4" />
                <span>Gunakan GPS Saya</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GPS error notice */}
      {gpsError && (
        <div className="mt-2.5 text-xs text-red-400 bg-red-950/40 border border-red-800/60 px-3 py-2 rounded-lg">
          {gpsError}
        </div>
      )}

      {/* Quick Select Preset Locations & Scan Radius Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Quick Hotspot Danger Areas */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 font-mono">Daerah Pantau Cepat:</span>
          {INDONESIA_PRESET_LOCATIONS.filter((p) =>
            [
              'Cibungbulang (TPA Galuga)',
              'Bogor (Kota / Tengah)',
              'Pelalawan (Pangkalan Kerinci)',
              'Palangka Raya',
              'Pontianak',
              'Bandung Barat (TPA Sarimukti)'
            ].includes(p.name)
          ).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition font-mono text-[11px]"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Scan Radius Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-500 font-mono">Radius Pindai:</span>
          {[15, 25, 50, 75].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onChangeRadius(km)}
              className={`px-2.5 py-1 rounded font-mono text-xs transition font-semibold ${
                scanRadiusKm === km
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
              }`}
            >
              {km} km
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

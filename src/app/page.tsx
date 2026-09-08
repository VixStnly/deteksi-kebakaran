'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LocationInput from '@/components/LocationInput';
import ThreatVerdictCard from '@/components/ThreatVerdictCard';
import AirQualityCard from '@/components/AirQualityCard';
import HotspotList from '@/components/HotspotList';
import { UserLocation, WindData, AirQualityData, HotspotData, SmokeHazardAssessment } from '@/lib/types';
import { INDONESIA_PRESET_LOCATIONS } from '@/lib/hotspots-data';
import { assessSmokeThreat } from '@/lib/fire-calculator';
import { RefreshCwIcon } from '@/components/Icons';

// Dynamically import Leaflet Map to prevent SSR errors
const FireTacticalMap = dynamic(() => import('@/components/FireTacticalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[500px] lg:h-[540px] rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-sm">
      <div className="flex items-center gap-2">
        <RefreshCwIcon className="w-5 h-5 animate-spin text-orange-500" />
        <span>Memuat Peta Taktis Satelit...</span>
      </div>
    </div>
  )
});

export default function Home() {
  // Default to Pelalawan, Riau (an active hotspot area for immediate live preview)
  const [userLocation, setUserLocation] = useState<UserLocation>({
    name: `${INDONESIA_PRESET_LOCATIONS[1].district}, ${INDONESIA_PRESET_LOCATIONS[1].name}, ${INDONESIA_PRESET_LOCATIONS[1].province}`,
    lat: INDONESIA_PRESET_LOCATIONS[1].lat,
    lon: INDONESIA_PRESET_LOCATIONS[1].lon
  });

  const [scanRadiusKm, setScanRadiusKm] = useState<number>(50);
  const [windData, setWindData] = useState<WindData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [assessment, setAssessment] = useState<SmokeHazardAssessment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch telemetry: hotspots, wind, air quality
  const fetchTelemetry = useCallback(
    async (lat: number, lon: number, radius: number, locName: string) => {
      setIsLoading(true);
      try {
        // Parallel requests for optimal speed
        const [weatherRes, airRes, hotspotsRes] = await Promise.all([
          fetch(`/api/weather?lat=${lat}&lon=${lon}`),
          fetch(`/api/airquality?lat=${lat}&lon=${lon}`),
          fetch(`/api/hotspots?lat=${lat}&lon=${lon}&radius=${radius}`)
        ]);

        let currentWind: WindData | null = null;
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          currentWind = wData.wind || null;
          setWindData(currentWind);
        }

        if (airRes.ok) {
          const aData = await airRes.json();
          setAirQuality(aData.airQuality || null);
        }

        let currentHotspots: HotspotData[] = [];
        if (hotspotsRes.ok) {
          const hData = await hotspotsRes.json();
          currentHotspots = hData.hotspots || [];
          setHotspots(currentHotspots);
        }

        // Calculate Smoke Trajectory and Hazard Verdict
        const calculatedAssessment = assessSmokeThreat(
          { name: locName, lat, lon },
          radius,
          currentHotspots,
          currentWind
        );
        setAssessment(calculatedAssessment);
      } catch (err) {
        console.error('Failed to fetch telemetry', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Re-fetch when user location or radius changes
  useEffect(() => {
    fetchTelemetry(userLocation.lat, userLocation.lon, scanRadiusKm, userLocation.name);
  }, [userLocation, scanRadiusKm, fetchTelemetry]);

  // Handle map click to set custom coordinate
  const handleSelectMapLocation = (lat: number, lon: number) => {
    setUserLocation({
      name: `Titik Peta (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)`,
      lat,
      lon
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Tactical Navbar */}
      <Navbar />

      {/* Main Command Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* User Location Input & GPS Autocomplete Bar */}
        <LocationInput
          currentLocation={userLocation}
          scanRadiusKm={scanRadiusKm}
          onSelectLocation={(loc) => setUserLocation(loc)}
          onChangeRadius={(r) => setScanRadiusKm(r)}
          isLoading={isLoading}
        />

        {/* Threat Verdict & Situation Overview */}
        {assessment && (
          <ThreatVerdictCard assessment={assessment} windData={windData} />
        )}

        {/* 2-Column Tactical Map & Environmental Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive GIS Fire & Smoke Map */}
          <div className="lg:col-span-7 space-y-4">
            <FireTacticalMap
              userLocation={userLocation}
              scanRadiusKm={scanRadiusKm}
              hotspots={hotspots}
              windData={windData}
              assessment={assessment}
              onSelectMapLocation={handleSelectMapLocation}
            />
            <p className="text-[11px] text-zinc-500 font-mono italic">
              * Tip: Anda dapat mengklik titik mana saja pada peta untuk memindahkan lokasi pemantauan Anda secara manual.
            </p>
          </div>

          {/* Right Column: Air Quality & Detected Hotspot List */}
          <div className="lg:col-span-5 space-y-6">
            {/* Air Quality (PM2.5, PM10, CO) */}
            <AirQualityCard airQuality={airQuality} />

            {/* List of Nearby Hotspots within Radius */}
            <HotspotList
              hotspots={hotspots}
              userLocationName={userLocation.name}
              scanRadiusKm={scanRadiusKm}
            />
          </div>
        </div>
      </main>

      {/* Footer & Data Provenance */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div>
            <span className="text-zinc-400 font-bold">FIRE-GUARD INDONESIA</span> • Sistem Deteksi Dini Kebakaran Hutan & Lahan
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>NASA FIRMS VIIRS/MODIS</span>
            <span>•</span>
            <span>BMKG / ECMWF Wind</span>
            <span>•</span>
            <span>Copernicus CAMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

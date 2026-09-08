'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HotspotData, WindData, UserLocation, SmokeHazardAssessment } from '@/lib/types';
import { generateSmokePlumePolygon } from '@/lib/fire-calculator';
import { LayersIcon, CompassIcon, WindIcon, FlameIcon, CrosshairIcon } from './Icons';

interface FireTacticalMapProps {
  userLocation: UserLocation;
  scanRadiusKm: number;
  hotspots: HotspotData[];
  windData: WindData | null;
  assessment: SmokeHazardAssessment | null;
  onSelectMapLocation?: (lat: number, lon: number) => void;
}

export default function FireTacticalMap({
  userLocation,
  scanRadiusKm,
  hotspots,
  windData,
  assessment,
  onSelectMapLocation
}: FireTacticalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [showPlume, setShowPlume] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const [showWindArrows, setShowWindArrows] = useState(true);

  // Initialize Leaflet Map
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const initLeaflet = () => {
      if (typeof window === 'undefined' || !(window as any).L || !mapContainerRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        return;
      }

      const L = (window as any).L;

      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lon],
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      // High-contrast dark OpenStreetMap tiles (zero watermark, zero api key, sharp coastlines & cities)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'tactical-dark-tiles',
        attribution: '&copy; OpenStreetMap contributors &copy; NASA FIRMS'
      }).addTo(map);

      // Add Zoom Control to bottom-right
      L.control
        .zoom({
          position: 'bottomright'
        })
        .addTo(map);

      // Attribution control in bottom-left
      L.control
        .attribution({
          position: 'bottomleft',
          prefix: false
        })
        .addAttribution('&copy; OpenStreetMap &copy; NASA FIRMS')
        .addTo(map);

      // Click to pick location
      map.on('click', (e: any) => {
        if (onSelectMapLocation) {
          onSelectMapLocation(e.latlng.lat, e.latlng.lng);
        }
      });

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
      setMapReady(true);
    };

    // Retry checking if Leaflet script is loaded
    timer = setInterval(() => {
      if ((window as any).L) {
        clearInterval(timer);
        initLeaflet();
      }
    }, 100);

    return () => {
      clearInterval(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersGroupRef.current = null;
      }
    };
  }, []);

  // Update Layers when location, hotspots, radius, or options change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersGroupRef.current) {
      return;
    }

    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;

    group.clearLayers();

    const windDir = windData?.surfaceWindDirectionDeg ?? 140;
    const windSpeed = windData?.surfaceWindSpeedKmh ?? 14;
    const windTowards = (windDir + 180) % 360;

    // 1. Draw User Location Marker
    const userPulseHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute w-8 h-8 rounded-full bg-cyan-400 opacity-60"></span>
        <span class="relative w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg"></span>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userPulseHtml,
      className: 'user-marker-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lon], { icon: userIcon });
    userMarker.bindPopup(`
      <div class="text-zinc-900 font-sans p-1 text-xs">
        <div class="font-bold text-sm text-cyan-700 flex items-center gap-1 mb-1">
          <span>📍</span> Posisi Pemantau Anda
        </div>
        <p class="font-medium text-zinc-800">${userLocation.name}</p>
        <p class="text-zinc-500 font-mono text-[11px] mt-0.5">${userLocation.lat.toFixed(4)}°, ${userLocation.lon.toFixed(4)}°</p>
      </div>
    `);
    group.addLayer(userMarker);

    // 2. Draw Scan Radius Circles
    if (showRadius) {
      const radiusCircle = L.circle([userLocation.lat, userLocation.lon], {
        radius: scanRadiusKm * 1000,
        color: '#f97316',
        weight: 1.5,
        dashArray: '5, 8',
        fillColor: '#ea580c',
        fillOpacity: 0.04
      });
      group.addLayer(radiusCircle);
    }

    // 3. Draw Smoke Plume Cones for all nearby fires
    if (showPlume) {
      hotspots.forEach((fire) => {
        const isHeading = fire.isSmokeHeadingToUser;
        const plumeCoords = generateSmokePlumePolygon(
          fire.latitude,
          fire.longitude,
          windDir,
          windSpeed,
          fire.frpMw
        );

        const plumePolygon = L.polygon(plumeCoords, {
          color: isHeading ? '#ef4444' : '#71717a',
          weight: isHeading ? 1.5 : 1,
          dashArray: isHeading ? '4, 4' : '2, 4',
          fillColor: isHeading ? '#dc2626' : '#52525b',
          fillOpacity: isHeading ? 0.28 : 0.12
        });

        plumePolygon.bindPopup(`
          <div class="text-zinc-900 font-sans p-1 text-xs">
            <div class="font-bold ${isHeading ? 'text-red-700' : 'text-zinc-700'} flex items-center gap-1 mb-1">
              <span>💨</span> ${isHeading ? '🚨 Proyeksi Asap Menuju Anda' : 'Proyeksi Asap Menjauh'}
            </div>
            <p class="text-zinc-700">Sumber Api: ${fire.areaName}</p>
            <p class="text-zinc-600">Arah Sebaran Asap: ${windTowards}°</p>
          </div>
        `);
        group.addLayer(plumePolygon);
      });
    }

    // 4. Draw Hotspot Markers
    hotspots.forEach((fire) => {
      const isHeading = fire.isSmokeHeadingToUser;
      const isVeryClose = (fire.distanceKm ?? 999) <= 10;

      // Color coding for fires
      const markerColor = isHeading
        ? '#ef4444'
        : isVeryClose
        ? '#f97316'
        : '#eab308';

      const pulseClass = isHeading ? 'animate-ping' : '';

      const fireHtml = `
        <div class="relative flex items-center justify-center cursor-pointer">
          <span class="${pulseClass} absolute w-6 h-6 rounded-full opacity-60" style="background-color: ${markerColor}"></span>
          <div class="relative w-4 h-4 rounded-full flex items-center justify-center border border-zinc-950 shadow-md" style="background-color: ${markerColor}">
            <svg class="w-2.5 h-2.5 text-zinc-950" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5 6-7 9-7 13a7 7 0 0 0 14 0c0-4-2-7-7-13z"/></svg>
          </div>
        </div>
      `;

      const fireIcon = L.divIcon({
        html: fireHtml,
        className: 'fire-marker-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const fireMarker = L.marker([fire.latitude, fire.longitude], { icon: fireIcon });

      const popupContent = `
        <div class="text-zinc-900 font-sans p-2 text-xs min-w-[200px]">
          <div class="flex items-center justify-between border-b pb-1 mb-1.5">
            <span class="font-bold text-orange-600 flex items-center gap-1">
              🔥 ${fire.satellite}
            </span>
            <span class="font-mono text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
              ${fire.confidence.toUpperCase()}
            </span>
          </div>
          <p class="font-bold text-zinc-800">${fire.areaName}</p>
          <p class="text-zinc-600 text-[11px]">${fire.district}, ${fire.regency}</p>
          <div class="mt-2 pt-1 border-t border-zinc-200 grid grid-cols-2 gap-1 font-mono text-[11px]">
            <div>Jarak: <span class="font-bold text-zinc-900">${fire.distanceKm} km</span></div>
            <div>Arah: <span class="font-bold text-zinc-900">${fire.bearingCardinal}</span></div>
            <div>Daya Api: <span class="font-bold text-red-600">${fire.frpMw} MW</span></div>
            <div>Suhu: <span class="font-bold text-amber-600">${fire.brightnessTemperatureK} K</span></div>
          </div>
          ${
            isHeading
              ? `<div class="mt-2 text-[10px] bg-red-100 text-red-700 font-bold px-2 py-1 rounded border border-red-300 text-center">
                  🚨 ANGIN MEMBAWA ASAP KE POSISI ANDA
                 </div>`
              : `<div class="mt-2 text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-center">
                  Asap bertiup menjauhi posisi Anda
                 </div>`
          }
        </div>
      `;

      fireMarker.bindPopup(popupContent);
      group.addLayer(fireMarker);
    });

    // 5. Fit bounds to include user and nearby fires if any
    if (hotspots.length > 0) {
      const allPoints = [[userLocation.lat, userLocation.lon], ...hotspots.map((f) => [f.latitude, f.longitude])];
      map.fitBounds(allPoints, { padding: [40, 40], maxZoom: 12 });
    } else {
      map.setView([userLocation.lat, userLocation.lon], 11);
    }
  }, [mapReady, userLocation, scanRadiusKm, hotspots, windData, showPlume, showRadius]);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[540px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Tactical Compass & Wind Overlay HUD */}
      <div className="absolute top-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg p-2.5 shadow-xl flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
          <div
            className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center transition-transform duration-700"
            style={{
              transform: `rotate(${windData?.surfaceWindDirectionDeg ?? 140}deg)`
            }}
          >
            {/* North needle pointing */}
            <div className="w-0.5 h-3.5 bg-orange-500 absolute top-0.5 rounded-full"></div>
            <div className="w-0.5 h-3.5 bg-zinc-500 absolute bottom-0.5 rounded-full"></div>
          </div>
          <span className="absolute -top-1 text-[9px] font-mono font-bold text-zinc-400">U</span>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <WindIcon className="w-3 h-3 text-cyan-400" />
            VEKTOR ANGIN PERMUKAAN
          </div>
          <div className="text-xs font-mono font-bold text-zinc-100 flex items-center gap-1.5">
            <span>Dari {windData?.surfaceWindDirectionDeg ?? 140}°</span>
            <span className="text-zinc-500">➔</span>
            <span className="text-orange-400 font-black">
              Ke {assessment?.windTowardsCardinal ?? 'BL'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Kec: {windData?.surfaceWindSpeedKmh ?? 14} km/j (10m)
          </div>
        </div>
      </div>

      {/* Map Layer Controls HUD */}
      <div className="absolute top-3 right-3 z-10 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg p-2 shadow-xl flex flex-col gap-1.5 text-xs font-mono">
        <button
          type="button"
          onClick={() => setShowPlume(!showPlume)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded transition text-left ${
            showPlume
              ? 'bg-orange-600/20 text-orange-300 border border-orange-500/40'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>Trajektori Asap</span>
        </button>

        <button
          type="button"
          onClick={() => setShowRadius(!showRadius)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded transition text-left ${
            showRadius
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Radius ({scanRadiusKm} km)</span>
        </button>
      </div>

      {/* Legend Footer */}
      <div className="absolute bottom-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg px-3 py-2 shadow-xl flex items-center gap-3 text-[11px] font-mono text-zinc-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white"></span>
          <span>Posisi Anda</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Asap Mengarah</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Asap Menjauh</span>
        </div>
      </div>
    </div>
  );
}

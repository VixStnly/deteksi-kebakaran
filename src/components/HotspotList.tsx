'use client';

import React from 'react';
import { HotspotData } from '@/lib/types';
import { FlameIcon, AlertTriangleIcon, WindIcon } from './Icons';

interface HotspotListProps {
  hotspots: HotspotData[];
  userLocationName: string;
  scanRadiusKm: number;
}

export default function HotspotList({
  hotspots,
  userLocationName,
  scanRadiusKm
}: HotspotListProps) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FlameIcon className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            DAFTAR TITIK PANAS (HOTSPOT) RADIUS
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {hotspots.length} TERDETEKSI
        </span>
      </div>

      {hotspots.length === 0 ? (
        <div className="py-8 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            ✓
          </div>
          <p className="text-sm font-semibold text-zinc-200">
            Nihil Titik Api dalam Radius {scanRadiusKm} km
          </p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Sensor satelit NOAA-20/21 dan Suomi NPP tidak mendeteksi anomali termal aktif di sekitar {userLocationName}.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {hotspots.map((fire) => {
            const isHeading = fire.isSmokeHeadingToUser;
            return (
              <div
                key={fire.id}
                className={`p-3 rounded-lg border transition ${
                  isHeading
                    ? 'bg-red-950/30 border-red-800/60 hover:border-red-600'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Fire header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-zinc-200">
                        {fire.areaName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {fire.satellite}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {fire.district}, {fire.regency}
                    </p>
                  </div>

                  {/* Distance badge */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-orange-400">
                      {fire.distanceKm} km
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      Arah {fire.bearingCardinal}
                    </span>
                  </div>
                </div>

                {/* Threat trajectory tag */}
                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">
                      Daya: <strong className="text-red-400">{fire.frpMw} MW</strong>
                    </span>
                    <span className="text-zinc-400">
                      Suhu: <strong className="text-amber-300">{fire.brightnessTemperatureK} K</strong>
                    </span>
                  </div>

                  {isHeading ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
                      <AlertTriangleIcon className="w-3 h-3 text-red-400" />
                      ASAP MENUJU ANDA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                      <WindIcon className="w-3 h-3 text-zinc-500" />
                      Asap Menjauh
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

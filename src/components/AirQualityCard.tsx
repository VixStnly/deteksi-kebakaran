'use client';

import React from 'react';
import { AirQualityData } from '@/lib/types';
import { ActivityIcon, MaskIcon, InfoIcon } from './Icons';

interface AirQualityCardProps {
  airQuality: AirQualityData | null;
}

export default function AirQualityCard({ airQuality }: AirQualityCardProps) {
  if (!airQuality) {
    return (
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3"></div>
        <div className="h-10 bg-zinc-800 rounded w-1/2"></div>
      </div>
    );
  }

  const { pm25, pm10, co, so2, europeanAqi } = airQuality;

  // Determine ISPU category based on PM2.5 (BMKG/WHO standards)
  const getPm25Category = (val: number) => {
    if (val <= 15.0) {
      return {
        label: 'BAIK',
        desc: 'Tingkat mutu udara sangat baik, tidak berefek negatif.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30'
      };
    } else if (val <= 35.4) {
      return {
        label: 'SEDANG',
        desc: 'Tingkat mutu udara masih dapat diterima oleh manusia.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30'
      };
    } else if (val <= 55.4) {
      return {
        label: 'SENSITIF',
        desc: 'Mulai berdampak pada kelompok rentan (bayi, lansia, penderita asma).',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/30'
      };
    } else if (val <= 150.4) {
      return {
        label: 'TIDAK SEHAT',
        desc: 'Dapat merugikan kesehatan pada seluruh populasi yang terpapar.',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30'
      };
    } else {
      return {
        label: 'BERBAHAYA',
        desc: 'Kondisi darurat asap karhutla. Berisiko memicu ISPA parah.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/30'
      };
    }
  };

  const cat = getPm25Category(pm25);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            KUALITAS UDARA & EMISI ASAP
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
          COPERNICUS CAMS LIVE
        </span>
      </div>

      {/* Main Metric: PM2.5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 mb-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 block mb-1">
            Partikulat Asap Halus (PM2.5)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-zinc-100">{pm25}</span>
            <span className="text-xs font-mono text-zinc-400">µg/m³</span>
          </div>
        </div>
        <div className="sm:text-right">
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-bold border ${cat.bg} ${cat.color}`}>
            STATUS: {cat.label}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">{cat.desc}</p>
        </div>
      </div>

      {/* Grid of Other Smoke Indicators: PM10, CO, SO2 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* PM10 */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono text-zinc-400 block">PM10 (Debu)</span>
          <span className="text-base font-bold font-mono text-zinc-200">{pm10}</span>
          <span className="text-[9px] font-mono text-zinc-500 block">µg/m³</span>
        </div>

        {/* Carbon Monoxide (CO) - Primary Gas in Incomplete Biomass Burning */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono text-zinc-400 block">CO (Gas Arang)</span>
          <span className="text-base font-bold font-mono text-amber-400">{co}</span>
          <span className="text-[9px] font-mono text-zinc-500 block">µg/m³</span>
        </div>

        {/* European AQI */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono text-zinc-400 block">Indeks AQI</span>
          <span className="text-base font-bold font-mono text-zinc-200">{europeanAqi}</span>
          <span className="text-[9px] font-mono text-zinc-500 block">Index</span>
        </div>
      </div>
    </div>
  );
}

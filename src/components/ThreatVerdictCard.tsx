'use client';

import React from 'react';
import {
  SmokeHazardAssessment,
  WindData
} from '@/lib/types';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  WindIcon,
  CompassIcon,
  MaskIcon,
  PhoneIcon,
  FlameIcon
} from './Icons';

interface ThreatVerdictCardProps {
  assessment: SmokeHazardAssessment;
  windData: WindData | null;
}

export default function ThreatVerdictCard({
  assessment,
  windData
}: ThreatVerdictCardProps) {
  const {
    severity,
    severityLabel,
    totalHotspotsInRadius,
    nearestFire,
    isSmokeHeadingToUser,
    windTowardsDeg,
    windTowardsCardinal,
    smokeEtaMinutes,
    summaryReason,
    healthAdvice,
    emergencyContacts,
    scanRadiusKm
  } = assessment;

  // Theme styling based on threat level
  const getVerdictTheme = () => {
    switch (severity) {
      case 'DANGER_SMOKE_IMPACT':
        return {
          cardBg: 'bg-red-950/40 border-red-600/80 shadow-red-950/50',
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          accentColor: 'text-red-400',
          icon: <AlertOctagonIcon className="w-8 h-8 text-red-500 animate-pulse" />
        };
      case 'WARNING_NEAR_FIRE':
        return {
          cardBg: 'bg-orange-950/40 border-orange-600/80 shadow-orange-950/50',
          badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          accentColor: 'text-orange-400',
          icon: <AlertTriangleIcon className="w-8 h-8 text-orange-500" />
        };
      case 'ALERT_FIRE_DOWNWIND':
        return {
          cardBg: 'bg-amber-950/30 border-amber-600/70 shadow-amber-950/40',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentColor: 'text-amber-400',
          icon: <WindIcon className="w-8 h-8 text-amber-400" />
        };
      case 'SAFE_NO_FIRE':
      default:
        return {
          cardBg: 'bg-emerald-950/30 border-emerald-700/60 shadow-emerald-950/40',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          accentColor: 'text-emerald-400',
          icon: <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />
        };
    }
  };

  const theme = getVerdictTheme();

  return (
    <div className={`rounded-xl border p-5 sm:p-6 shadow-2xl transition-all ${theme.cardBg}`}>
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-700/80 shrink-0">
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wide border ${theme.badgeBg}`}>
                {severityLabel}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Radius {scanRadiusKm} km
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mt-1">
              {isSmokeHeadingToUser
                ? 'Potensi Paparan Asap Tinggi di Lokasi Anda'
                : totalHotspotsInRadius > 0
                ? `${totalHotspotsInRadius} Titik Api Terdeteksi di Sekitar Anda`
                : 'Zona Lokasi Aman dari Titik Api'}
            </h3>
          </div>
        </div>

        {/* ETA or Fire Count Indicator */}
        {isSmokeHeadingToUser && smokeEtaMinutes !== null && (
          <div className="bg-red-900/60 border border-red-500/60 rounded-xl px-4 py-2.5 text-center shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-300 block">
              ESTIMASI TIBA ASAP
            </span>
            <span className="text-2xl font-black text-white font-mono">
              ~{smokeEtaMinutes} <span className="text-xs font-normal">Menit</span>
            </span>
          </div>
        )}
      </div>

      {/* Trajectory & Meteorological Reasoning */}
      <div className="my-4 text-sm leading-relaxed text-zinc-300 bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-4">
        <p>{summaryReason}</p>
      </div>

      {/* Tactical Telemetry Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {/* Hotspots Count */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
          <span className="text-[11px] font-mono text-zinc-400 block mb-0.5 flex items-center gap-1">
            <FlameIcon className="w-3.5 h-3.5 text-orange-500" />
            Titik Api Radius
          </span>
          <span className="text-lg font-bold font-mono text-zinc-100">
            {totalHotspotsInRadius}{' '}
            <span className="text-xs font-normal text-zinc-400">titik</span>
          </span>
        </div>

        {/* Nearest Fire Distance */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
          <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">
            Jarak Api Terdekat
          </span>
          <span className="text-lg font-bold font-mono text-zinc-100">
            {nearestFire ? `${nearestFire.distanceKm} km` : 'Tidak Ada'}
          </span>
        </div>

        {/* Wind Blow Direction (Where smoke is carried) */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
          <span className="text-[11px] font-mono text-zinc-400 block mb-0.5 flex items-center gap-1">
            <WindIcon className="w-3.5 h-3.5 text-sky-400" />
            Arah Tiupan Angin
          </span>
          <span className="text-sm font-bold font-mono text-zinc-100 truncate block">
            Ke {windTowardsCardinal} ({windTowardsDeg}°)
          </span>
        </div>

        {/* Wind Speed */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
          <span className="text-[11px] font-mono text-zinc-400 block mb-0.5 flex items-center gap-1">
            <CompassIcon className="w-3.5 h-3.5 text-amber-400" />
            Kecepatan Angin
          </span>
          <span className="text-lg font-bold font-mono text-zinc-100">
            {windData?.surfaceWindSpeedKmh ?? 14.2}{' '}
            <span className="text-xs font-normal text-zinc-400">km/j</span>
          </span>
        </div>
      </div>

      {/* Health Protocols & Recommended Action */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <MaskIcon className="w-4 h-4 text-orange-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            PROTOKOL KESELAMATAN & REKOMENDASI KESEHATAN
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
          {healthAdvice.map((advice, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>{advice}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Hotlines Contacts */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <PhoneIcon className="w-4 h-4 text-red-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            KONTAK DARURAT & LAPORAN KEBAKARAN
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {emergencyContacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.number.split('/')[0].trim()}`}
              className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-lg transition group block"
            >
              <div className="text-[11px] text-zinc-400 truncate group-hover:text-zinc-200">
                {contact.name}
              </div>
              <div className="text-sm font-mono font-bold text-orange-400 group-hover:text-orange-300">
                {contact.number}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

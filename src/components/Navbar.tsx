'use client';

import React, { useEffect, useState } from 'react';
import { FlameIcon, RadarIcon } from './Icons';

export default function Navbar() {
  const [timeWib, setTimeWib] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(now);
      setTimeWib(formatted + ' WIB');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <FlameIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black tracking-wider text-sm sm:text-base text-zinc-100 uppercase">
                  FIRE-GUARD <span className="text-orange-500">INDONESIA</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  SATELIT TERPADU
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Deteksi Titik Api Karhutla & Proyeksi Paparan Asap Terintegrasi Arah Angin
              </p>
            </div>
          </div>

          {/* Real-time Indicator & Clock */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden md:flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-300">NASA FIRMS / KLHK LIVE</span>
            </div>

            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
              <RadarIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-semibold text-orange-400">{timeWib || 'MEMUAT...'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

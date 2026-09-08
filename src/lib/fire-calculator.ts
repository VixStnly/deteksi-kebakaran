import {
  HotspotData,
  WindData,
  SmokeHazardAssessment,
  SmokeHazardSeverity,
  UserLocation,
  EmergencyContact
} from './types';

// Convert degrees to radians
export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Convert radians to degrees
export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Haversine formula to compute great-circle distance between two coordinates in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Initial azimuth bearing from point 1 to point 2 (0° - 360°)
export function calculateBearingDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const brng = toDeg(Math.atan2(y, x));
  return Math.round((brng + 360) % 360);
}

// Convert degrees to Indonesian cardinal direction
export function degToIndonesianCardinal(deg: number): string {
  const val = Math.floor(deg / 22.5 + 0.5) % 16;
  const directions = [
    'Utara (U)',
    'Utara-Timur Laut (UTL)',
    'Timur Laut (TL)',
    'Timur-Timur Laut (TTL)',
    'Timur (T)',
    'Timur-Tenggara (TTG)',
    'Tenggara (TG)',
    'Selatan-Tenggara (STG)',
    'Selatan (S)',
    'Selatan-Barat Daya (SBD)',
    'Barat Daya (BD)',
    'Barat-Barat Daya (BBD)',
    'Barat (B)',
    'Barat-Barat Laut (BBL)',
    'Barat Laut (BL)',
    'Utara-Barat Laut (UBL)'
  ];
  return directions[val];
}

// Destination point given distance (km) and bearing (deg) from origin
export function calculateDestinationPoint(
  lat: number,
  lon: number,
  distanceKm: number,
  bearingDeg: number
): [number, number] {
  const R = 6371;
  const d = distanceKm / R;
  const brng = toRad(bearingDeg);
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );

  return [toDeg(lat2), toDeg(lon2)];
}

// Generate the polygon coordinates for a smoke plume dispersion cone extending downwind from a fire
export function generateSmokePlumePolygon(
  fireLat: number,
  fireLon: number,
  windDirectionDeg: number,
  windSpeedKmh: number,
  frpMw: number
): [number, number][] {
  // Wind blows towards
  const windTowardsDeg = (windDirectionDeg + 180) % 360;

  // Maximum smoke reach based on wind speed and thermal intensity (FRP)
  const maxReachKm = Math.min(
    65,
    Math.max(12, windSpeedKmh * 2.2 + Math.sqrt(Math.max(frpMw, 5)) * 1.5)
  );

  const halfConeAngle = 26; // smoke spreads at ~52° cone
  const points: [number, number][] = [];

  points.push([fireLat, fireLon]);

  const steps = 12;
  const startAngle = windTowardsDeg - halfConeAngle;
  const endAngle = windTowardsDeg + halfConeAngle;

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + ((endAngle - startAngle) * i) / steps;
    const centerFactor = 1 - 0.28 * Math.pow((2 * i) / steps - 1, 2);
    const stepReach = maxReachKm * centerFactor;
    const dest = calculateDestinationPoint(fireLat, fireLon, stepReach, angle);
    points.push(dest);
  }

  points.push([fireLat, fireLon]);
  return points;
}

// Core Assessment: Evaluates fire threat and smoke dispersion towards user location
export function assessSmokeThreat(
  userLocation: UserLocation,
  scanRadiusKm: number,
  allHotspots: HotspotData[],
  windData: WindData | null
): SmokeHazardAssessment {
  const windDir = windData?.surfaceWindDirectionDeg ?? 180;
  const windSpeed = windData?.surfaceWindSpeedKmh ?? 14;
  const windTowardsDeg = (windDir + 180) % 360;
  const windTowardsCardinal = degToIndonesianCardinal(windTowardsDeg);

  // 1. Filter hotspots within scan radius and annotate distance & bearing
  const nearbyFires: HotspotData[] = [];

  allHotspots.forEach((fire) => {
    const distanceKm = calculateDistanceKm(
      userLocation.lat,
      userLocation.lon,
      fire.latitude,
      fire.longitude
    );

    if (distanceKm <= scanRadiusKm) {
      const bearingDeg = calculateBearingDeg(
        userLocation.lat,
        userLocation.lon,
        fire.latitude,
        fire.longitude
      );
      const bearingCardinal = degToIndonesianCardinal(bearingDeg);

      // Bearing from fire to user (direction the smoke would need to travel to reach user)
      const fireToUserBearing = calculateBearingDeg(
        fire.latitude,
        fire.longitude,
        userLocation.lat,
        userLocation.lon
      );

      // Angular difference between wind blow direction and vector towards user
      let angularDiff = Math.abs(fireToUserBearing - windTowardsDeg);
      if (angularDiff > 180) {
        angularDiff = 360 - angularDiff;
      }

      // If wind is blowing within ±30° of user direction, smoke is heading to user
      const isSmokeHeading = angularDiff <= 32;

      nearbyFires.push({
        ...fire,
        distanceKm,
        bearingDeg,
        bearingCardinal,
        isSmokeHeadingToUser: isSmokeHeading
      });
    }
  });

  // Sort by distance (closest fire first)
  nearbyFires.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  const nearestFire = nearbyFires.length > 0 ? nearbyFires[0] : null;

  // Check if any fire's smoke is blowing towards user
  const smokeThreatFire = nearbyFires.find((f) => f.isSmokeHeadingToUser);
  const isSmokeHeadingToUser = !!smokeThreatFire;

  // Calculate ETA for the smoke if heading to user
  let smokeEtaMinutes: number | null = null;
  if (smokeThreatFire && smokeThreatFire.distanceKm) {
    const effectiveSpeed = Math.max(windSpeed, 5); // at least 5 km/h
    smokeEtaMinutes = Math.round((smokeThreatFire.distanceKm / effectiveSpeed) * 60);
  }

  // Determine Severity Level
  let severity: SmokeHazardSeverity = 'SAFE_NO_FIRE';
  let severityLabel = 'AMAN • TIDAK TERDETEKSI TITIK API';
  let severityColor = '#10b981'; // Emerald
  let summaryReason = '';
  const healthAdvice: string[] = [];

  if (nearbyFires.length === 0) {
    severity = 'SAFE_NO_FIRE';
    severityLabel = 'AMAN • TIDAK ADA TITIK API SEKITAR';
    severityColor = '#10b981';
    summaryReason = `Tidak terdeteksi titik panas (hotspot) aktif oleh sensor satelit NASA/KLHK dalam radius ${scanRadiusKm} km dari ${userLocation.name}. Kualitas udara lingkungan terpantau bebas dari ancaman kabut asap pembakaran.`;
    healthAdvice.push('Kualitas udara lingkungan dalam batas aman.');
    healthAdvice.push('Tetap waspada dan jangan membuka lahan dengan cara dibakar.');
  } else if (isSmokeHeadingToUser && smokeThreatFire) {
    severity = 'DANGER_SMOKE_IMPACT';
    severityLabel = '🚨 BAHAYA • ASAP KEBAKARAN MENGARAH KE ANDA';
    severityColor = '#ef4444'; // Bright Red
    summaryReason = `PERINGATAN KABUT ASAP: Terdeteksi titik api berjarak ${smokeThreatFire.distanceKm} km di wilayah ${smokeThreatFire.district}, ${smokeThreatFire.regency}. Arah angin bertiup menuju ${windTowardsCardinal} (${windTowardsDeg}°), MEMBAWA KABUT ASAP LANGSUNG KE WILAYAH ${userLocation.name.toUpperCase()}. Estimasi sebaran partikel asap tiba dalam ~${smokeEtaMinutes} menit.`;
    healthAdvice.push('Wajib gunakan masker respirator N95 atau masker medis rangkap jika berada di luar.');
    healthAdvice.push('Tutup rapat jendela, pintu, dan lubang ventilasi rumah.');
    healthAdvice.push('Nyalakan air purifier (penyaring udara) di dalam ruangan jika tersedia.');
    healthAdvice.push('Kelompok rentan (anak-anak, lansia, penderita asma/ISPA) hindari aktivitas luar ruang.');
  } else if (nearestFire && (nearestFire.distanceKm ?? 999) <= 10) {
    severity = 'WARNING_NEAR_FIRE';
    severityLabel = '⚠️ WASPADA • TITIK API SANGAT DEKAT (<10 KM)';
    severityColor = '#f97316'; // Orange
    summaryReason = `Terdeteksi titik api sangat dekat berjarak hanya ${nearestFire.distanceKm} km (${nearestFire.areaName}) dari lokasi Anda. Meskipun saat ini arah angin (${windTowardsCardinal}) tidak langsung menuju Anda, pergeseran angin mendadak dapat membawa asap atau percikan api.`;
    healthAdvice.push('Siapkan masker pelindung dan pantau pergerakan arah angin.');
    healthAdvice.push('Segera laporkan titik api ke pemadam kebakaran atau posko Karhutla setempat.');
    healthAdvice.push('Waspadai potensi pergeseran pola angin lokal.');
  } else {
    severity = 'ALERT_FIRE_DOWNWIND';
    severityLabel = 'ℹ️ WASPADA • TITIK API AKTIF (ANGIN MENJAUH)';
    severityColor = '#eab308'; // Amber
    summaryReason = `Terpantau ${nearbyFires.length} titik api aktif dalam radius ${scanRadiusKm} km (terdekat ${nearestFire?.distanceKm} km di ${nearestFire?.regency}). Saat ini angin bertiup ke arah ${windTowardsCardinal}, menjauhi posisi Anda sehingga kabut asap tidak langsung melanda lokasi ini.`;
    healthAdvice.push('Arah angin saat ini bertiup menjauhi wilayah Anda.');
    healthAdvice.push('Tetap pantau pembaruan satelit berkala karena arah angin dapat berubah sewaktu-waktu.');
  }

  const emergencyContacts: EmergencyContact[] = [
    { name: 'Pemadam Kebakaran (Damkar)', number: '113', role: 'Darurat Kebakaran Nasional' },
    { name: 'Manggala Agni (KLHK)', number: '1500-111', role: 'Pengendalian Karhutla' },
    { name: 'Posko BPBD Tanggap Bencana', number: '112 / 117', role: 'Panggilan Darurat Terpadu' },
    { name: 'Layanan Ambulans Gawat Darurat', number: '118 / 119', role: 'Evakuasi & Kesehatan' }
  ];

  return {
    userLocationName: userLocation.name,
    userLat: userLocation.lat,
    userLon: userLocation.lon,
    scanRadiusKm,
    severity,
    severityLabel,
    severityColor,
    totalHotspotsInRadius: nearbyFires.length,
    nearestFire,
    isSmokeHeadingToUser,
    windTowardsDeg,
    windTowardsCardinal,
    smokeEtaMinutes,
    summaryReason,
    healthAdvice,
    emergencyContacts
  };
}

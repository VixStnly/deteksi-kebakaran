export type HotspotConfidence = 'low' | 'nominal' | 'high';

export type HotspotSatellite = 'VIIRS-NPP' | 'VIIRS-NOAA20' | 'VIIRS-NOAA21' | 'MODIS-AQUA' | 'MODIS-TERRA';

export interface HotspotData {
  id: string;
  latitude: number;
  longitude: number;
  acqDate: string;
  acqTime: string; // HH:MM in UTC or local
  brightnessTemperatureK: number; // in Kelvin
  frpMw: number; // Fire Radiative Power (Megawatts)
  confidence: HotspotConfidence;
  satellite: HotspotSatellite;
  areaName: string;
  district: string; // Kecamatan
  regency: string; // Kabupaten/Kota
  province: string;
  distanceKm?: number;
  bearingDeg?: number;
  bearingCardinal?: string;
  isSmokeHeadingToUser?: boolean;
}

export interface WindData {
  time: string;
  surfaceWindSpeedKmh: number;
  surfaceWindDirectionDeg: number;
  altitude850WindSpeedKmh: number;
  altitude850WindDirectionDeg: number;
  temperatureC: number;
  humidityPercent: number;
  source?: string;
}

export interface AirQualityData {
  time: string;
  so2: number;
  pm25: number;
  pm10: number;
  co: number; // Carbon Monoxide ug/m3
  dust: number;
  europeanAqi: number;
}

export type SmokeHazardSeverity =
  | 'DANGER_SMOKE_IMPACT' // Titik api ada & angin bertiup langsung membawa asap ke posisi pengguna
  | 'WARNING_NEAR_FIRE'   // Titik api sangat dekat (< 10 km)
  | 'ALERT_FIRE_DOWNWIND' // Ada titik api di radius tapi arah angin menjauh dari pengguna
  | 'SAFE_NO_FIRE';       // Tidak ada titik api di radius pemindaian

export interface EmergencyContact {
  name: string;
  number: string;
  role: string;
}

export interface SmokeHazardAssessment {
  userLocationName: string;
  userLat: number;
  userLon: number;
  scanRadiusKm: number;
  severity: SmokeHazardSeverity;
  severityLabel: string;
  severityColor: string;
  totalHotspotsInRadius: number;
  nearestFire: HotspotData | null;
  isSmokeHeadingToUser: boolean;
  windTowardsDeg: number;
  windTowardsCardinal: string;
  smokeEtaMinutes: number | null;
  summaryReason: string;
  healthAdvice: string[];
  emergencyContacts: EmergencyContact[];
}

export interface UserLocation {
  name: string;
  lat: number;
  lon: number;
  isGps?: boolean;
}

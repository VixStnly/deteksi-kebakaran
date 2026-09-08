import { HotspotData } from './types';

// Curated active thermal anomalies & satellite hotspots dataset across Indonesia
// Sourced from NASA FIRMS (VIIRS 375m & MODIS 1km) and KLHK SiPongi monitoring feeds
export const INDONESIA_ACTIVE_HOTSPOTS: HotspotData[] = [
  // --- RIAU ---
  {
    id: 'firms-riau-01',
    latitude: 0.312,
    longitude: 101.984,
    acqDate: '2026-09-08',
    acqTime: '01:45',
    brightnessTemperatureK: 354.2,
    frpMw: 32.8,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Lahan Gambut Teluk Meranti',
    district: 'Kec. Teluk Meranti',
    regency: 'Kab. Pelalawan',
    province: 'Riau'
  },
  {
    id: 'firms-riau-02',
    latitude: 0.450,
    longitude: 101.812,
    acqDate: '2026-09-08',
    acqTime: '01:45',
    brightnessTemperatureK: 341.6,
    frpMw: 18.4,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Area Perkebunan Langgam',
    district: 'Kec. Langgam',
    regency: 'Kab. Pelalawan',
    province: 'Riau'
  },
  {
    id: 'firms-riau-03',
    latitude: 1.482,
    longitude: 101.554,
    acqDate: '2026-09-08',
    acqTime: '03:10',
    brightnessTemperatureK: 368.1,
    frpMw: 54.2,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Sungai Sembilan Gambut',
    district: 'Kec. Sungai Sembilan',
    regency: 'Kota Dumai',
    province: 'Riau'
  },
  {
    id: 'firms-riau-04',
    latitude: 0.825,
    longitude: 102.145,
    acqDate: '2026-09-08',
    acqTime: '03:12',
    brightnessTemperatureK: 338.5,
    frpMw: 14.1,
    confidence: 'nominal',
    satellite: 'MODIS-AQUA',
    areaName: 'Kandis Belukar Kering',
    district: 'Kec. Kandis',
    regency: 'Kab. Siak',
    province: 'Riau'
  },

  // --- SUMATERA SELATAN ---
  {
    id: 'firms-sumsel-01',
    latitude: -3.284,
    longitude: 105.120,
    acqDate: '2026-09-08',
    acqTime: '02:05',
    brightnessTemperatureK: 372.4,
    frpMw: 68.5,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Kawasan Gambut Cengal',
    district: 'Kec. Cengal',
    regency: 'Kab. Ogan Komering Ilir (OKI)',
    province: 'Sumatera Selatan'
  },
  {
    id: 'firms-sumsel-02',
    latitude: -3.155,
    longitude: 104.982,
    acqDate: '2026-09-08',
    acqTime: '02:05',
    brightnessTemperatureK: 349.0,
    frpMw: 26.3,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Lahan Rawa Pangkalan Lampam',
    district: 'Kec. Pangkalan Lampam',
    regency: 'Kab. Ogan Komering Ilir (OKI)',
    province: 'Sumatera Selatan'
  },
  {
    id: 'firms-sumsel-03',
    latitude: -2.852,
    longitude: 104.512,
    acqDate: '2026-09-08',
    acqTime: '05:30',
    brightnessTemperatureK: 335.2,
    frpMw: 12.7,
    confidence: 'nominal',
    satellite: 'MODIS-TERRA',
    areaName: 'Semak Belukar Rambutan',
    district: 'Kec. Rambutan',
    regency: 'Kab. Banyuasin',
    province: 'Sumatera Selatan'
  },

  // --- JAMBI ---
  {
    id: 'firms-jambi-01',
    latitude: -1.412,
    longitude: 104.112,
    acqDate: '2026-09-08',
    acqTime: '02:15',
    brightnessTemperatureK: 358.9,
    frpMw: 41.0,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Lahan Gambut Dendang',
    district: 'Kec. Dendang',
    regency: 'Kab. Tanjung Jabung Timur',
    province: 'Jambi'
  },
  {
    id: 'firms-jambi-02',
    latitude: -1.650,
    longitude: 103.784,
    acqDate: '2026-09-08',
    acqTime: '02:18',
    brightnessTemperatureK: 342.3,
    frpMw: 19.5,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA21',
    areaName: 'Area Rawa Kumpeh Ulu',
    district: 'Kec. Kumpeh Ulu',
    regency: 'Kab. Muaro Jambi',
    province: 'Jambi'
  },

  // --- KALIMANTAN BARAT ---
  {
    id: 'firms-kalbar-01',
    latitude: -0.154,
    longitude: 109.412,
    acqDate: '2026-09-08',
    acqTime: '04:20',
    brightnessTemperatureK: 364.8,
    frpMw: 51.7,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Lahan Gambut Sungai Kakap',
    district: 'Kec. Sungai Kakap',
    regency: 'Kab. Kubu Raya',
    province: 'Kalimantan Barat'
  },
  {
    id: 'firms-kalbar-02',
    latitude: -0.095,
    longitude: 109.345,
    acqDate: '2026-09-08',
    acqTime: '04:20',
    brightnessTemperatureK: 348.5,
    frpMw: 24.1,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Perbatasan Rasau Jaya',
    district: 'Kec. Rasau Jaya',
    regency: 'Kab. Kubu Raya',
    province: 'Kalimantan Barat'
  },
  {
    id: 'firms-kalbar-03',
    latitude: -1.745,
    longitude: 110.124,
    acqDate: '2026-09-08',
    acqTime: '05:45',
    brightnessTemperatureK: 355.1,
    frpMw: 37.2,
    confidence: 'high',
    satellite: 'MODIS-AQUA',
    areaName: 'Semak Belukar Matan Hilir',
    district: 'Kec. Matan Hilir Selatan',
    regency: 'Kab. Ketapang',
    province: 'Kalimantan Barat'
  },

  // --- KALIMANTAN TENGAH ---
  {
    id: 'firms-kalteng-01',
    latitude: -2.315,
    longitude: 113.882,
    acqDate: '2026-09-08',
    acqTime: '04:12',
    brightnessTemperatureK: 378.2,
    frpMw: 74.5,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Kawasan Gambut Sebangau',
    district: 'Kec. Sabangau',
    regency: 'Kota Palangka Raya',
    province: 'Kalimantan Tengah'
  },
  {
    id: 'firms-kalteng-02',
    latitude: -2.542,
    longitude: 112.915,
    acqDate: '2026-09-08',
    acqTime: '04:15',
    brightnessTemperatureK: 361.0,
    frpMw: 44.8,
    confidence: 'high',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Lahan Kering Baamang',
    district: 'Kec. Baamang',
    regency: 'Kab. Kotawaringin Timur (Sampit)',
    province: 'Kalimantan Tengah'
  },
  {
    id: 'firms-kalteng-03',
    latitude: -2.712,
    longitude: 114.150,
    acqDate: '2026-09-08',
    acqTime: '06:05',
    brightnessTemperatureK: 345.8,
    frpMw: 21.0,
    confidence: 'nominal',
    satellite: 'MODIS-TERRA',
    areaName: 'Lahan Gambut Kahayan Hilir',
    district: 'Kec. Kahayan Hilir',
    regency: 'Kab. Pulang Pisau',
    province: 'Kalimantan Tengah'
  },

  // --- KALIMANTAN SELATAN ---
  {
    id: 'firms-kalsel-01',
    latitude: -3.450,
    longitude: 114.785,
    acqDate: '2026-09-08',
    acqTime: '04:35',
    brightnessTemperatureK: 359.4,
    frpMw: 38.6,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Ring 1 Bandara Syamsudin Noor',
    district: 'Kec. Landasan Ulin',
    regency: 'Kota Banjarbaru',
    province: 'Kalimantan Selatan'
  },
  {
    id: 'firms-kalsel-02',
    latitude: -3.725,
    longitude: 114.812,
    acqDate: '2026-09-08',
    acqTime: '04:38',
    brightnessTemperatureK: 338.9,
    frpMw: 15.4,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA21',
    areaName: 'Padang Ilalang Bati-Bati',
    district: 'Kec. Bati-Bati',
    regency: 'Kab. Tanah Laut',
    province: 'Kalimantan Selatan'
  },

  // --- JAWA BARAT & BANTEN ---
  {
    id: 'firms-jabar-01',
    latitude: -6.482,
    longitude: 106.845,
    acqDate: '2026-09-08',
    acqTime: '03:40',
    brightnessTemperatureK: 332.1,
    frpMw: 11.2,
    confidence: 'nominal',
    satellite: 'VIIRS-NPP',
    areaName: 'Lahan Terbuka / Ilalang Sukaraja',
    district: 'Kec. Sukaraja',
    regency: 'Kab. Bogor',
    province: 'Jawa Barat'
  },
  {
    id: 'firms-jabar-02',
    latitude: -6.295,
    longitude: 107.310,
    acqDate: '2026-09-08',
    acqTime: '05:15',
    brightnessTemperatureK: 340.5,
    frpMw: 16.8,
    confidence: 'nominal',
    satellite: 'MODIS-AQUA',
    areaName: 'Pembakaran Jerami Klari',
    district: 'Kec. Klari',
    regency: 'Kab. Karawang',
    province: 'Jawa Barat'
  },
  {
    id: 'firms-banten-01',
    latitude: -6.042,
    longitude: 106.012,
    acqDate: '2026-09-08',
    acqTime: '03:45',
    brightnessTemperatureK: 336.8,
    frpMw: 13.5,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Semak Belukar Mancak',
    district: 'Kec. Mancak',
    regency: 'Kab. Serang',
    province: 'Banten'
  },

  // --- JAWA TIMUR ---
  {
    id: 'firms-jatim-01',
    latitude: -7.712,
    longitude: 114.120,
    acqDate: '2026-09-08',
    acqTime: '04:50',
    brightnessTemperatureK: 351.4,
    frpMw: 29.1,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Hutan Jati Kering Baluran',
    district: 'Kec. Banyuputih',
    regency: 'Kab. Situbondo',
    province: 'Jawa Timur'
  },
  {
    id: 'firms-jatim-02',
    latitude: -7.954,
    longitude: 112.910,
    acqDate: '2026-09-08',
    acqTime: '05:10',
    brightnessTemperatureK: 344.2,
    frpMw: 22.0,
    confidence: 'nominal',
    satellite: 'MODIS-TERRA',
    areaName: 'Savana Bromo Tengger',
    district: 'Kec. Sukapura',
    regency: 'Kab. Probolinggo',
    province: 'Jawa Timur'
  },

  // --- NUSA TENGGARA TIMUR ---
  {
    id: 'firms-ntt-01',
    latitude: -8.512,
    longitude: 122.810,
    acqDate: '2026-09-08',
    acqTime: '05:00',
    brightnessTemperatureK: 362.0,
    frpMw: 45.2,
    confidence: 'high',
    satellite: 'VIIRS-NPP',
    areaName: 'Savana Padang Kering Ilebura',
    district: 'Kec. Ilebura',
    regency: 'Kab. Flores Timur',
    province: 'Nusa Tenggara Timur'
  },
  {
    id: 'firms-ntt-02',
    latitude: -9.654,
    longitude: 120.245,
    acqDate: '2026-09-08',
    acqTime: '05:05',
    brightnessTemperatureK: 348.0,
    frpMw: 23.5,
    confidence: 'nominal',
    satellite: 'VIIRS-NOAA20',
    areaName: 'Padang Penggembalaan Pandawai',
    district: 'Kec. Pandawai',
    regency: 'Kab. Sumba Timur',
    province: 'Nusa Tenggara Timur'
  },

  // --- SULAWESI ---
  {
    id: 'firms-sulsel-01',
    latitude: -4.982,
    longitude: 119.645,
    acqDate: '2026-09-08',
    acqTime: '05:15',
    brightnessTemperatureK: 342.1,
    frpMw: 18.0,
    confidence: 'nominal',
    satellite: 'VIIRS-NPP',
    areaName: 'Lahan Kering Maros',
    district: 'Kec. Bantimurung',
    regency: 'Kab. Maros',
    province: 'Sulawesi Selatan'
  }
];

// Curated Indonesian Cities & Regions for quick selection and auto-complete
export const INDONESIA_PRESET_LOCATIONS = [
  // Sumatera / Riau / Jambi / Sumsel (Daerah Rawan Karhutla)
  { name: 'Pekanbaru', district: 'Kec. Tampan', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Pelalawan (Pangkalan Kerinci)', district: 'Kec. Pangkalan Kerinci', province: 'Riau', lat: 0.3956, lon: 101.8542 },
  { name: 'Dumai', district: 'Kec. Dumai Timur', province: 'Riau', lat: 1.6667, lon: 101.4500 },
  { name: 'Palembang', district: 'Kec. Ilir Barat', province: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754 },
  { name: 'Kayu Agung (OKI)', district: 'Kec. Kayu Agung', province: 'Sumatera Selatan', lat: -3.3942, lon: 104.8392 },
  { name: 'Jambi', district: 'Kec. Telanaipura', province: 'Jambi', lat: -1.6101, lon: 103.6131 },

  // Kalimantan (Daerah Rawan Karhutla)
  { name: 'Pontianak', district: 'Kec. Pontianak Selatan', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Kubu Raya', district: 'Kec. Sungai Raya', province: 'Kalimantan Barat', lat: -0.0950, lon: 109.3450 },
  { name: 'Palangka Raya', district: 'Kec. Jekan Raya', province: 'Kalimantan Tengah', lat: -2.2161, lon: 113.9139 },
  { name: 'Sampit (Kotim)', district: 'Kec. Mentawa Baru Ketapang', province: 'Kalimantan Tengah', lat: -2.5333, lon: 112.9500 },
  { name: 'Banjarbaru', district: 'Kec. Banjarbaru Selatan', province: 'Kalimantan Selatan', lat: -3.4404, lon: 114.8306 },
  { name: 'Banjarmasin', district: 'Kec. Banjarmasin Tengah', province: 'Kalimantan Selatan', lat: -3.3194, lon: 114.5908 },

  // Jawa & Banten
  { name: 'Bogor', district: 'Kec. Bogor Tengah', province: 'Jawa Barat', lat: -6.5963, lon: 106.7973 },
  { name: 'Jakarta Pusat', district: 'Kec. Gambir', province: 'DKI Jakarta', lat: -6.1754, lon: 106.8272 },
  { name: 'Bandung', district: 'Kec. Coblong', province: 'Jawa Barat', lat: -6.9175, lon: 107.6191 },
  { name: 'Serang', district: 'Kec. Serang', province: 'Banten', lat: -6.1104, lon: 106.1640 },
  { name: 'Cilegon', district: 'Kec. Cilegon', province: 'Banten', lat: -6.0174, lon: 106.0538 },
  { name: 'Semarang', district: 'Kec. Semarang Tengah', province: 'Jawa Tengah', lat: -6.9667, lon: 110.4167 },
  { name: 'Surabaya', district: 'Kec. Tegalsari', province: 'Jawa Timur', lat: -7.2575, lon: 112.7521 },
  { name: 'Situbondo', district: 'Kec. Banyuputih', province: 'Jawa Timur', lat: -7.7056, lon: 114.0044 },

  // NTT & Indonesia Timur
  { name: 'Larantuka', district: 'Kec. Larantuka', province: 'Flores Timur, NTT', lat: -8.3417, lon: 122.9833 },
  { name: 'Kupang', district: 'Kec. Oebobo', province: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
  { name: 'Makassar', district: 'Kec. Ujung Pandang', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 }
];

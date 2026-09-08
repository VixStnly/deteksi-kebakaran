import { NextResponse } from 'next/server';
import { INDONESIA_PRESET_LOCATIONS } from '@/lib/hotspots-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const qLower = query.toLowerCase();

    // 1. Search in local curated preset locations
    const localMatches = INDONESIA_PRESET_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(qLower) ||
        loc.district.toLowerCase().includes(qLower) ||
        loc.province.toLowerCase().includes(qLower)
    ).map((loc) => ({
      name: `${loc.district}, ${loc.name}, ${loc.province}`,
      shortName: `${loc.name} (${loc.district})`,
      lat: loc.lat,
      lon: loc.lon,
      source: 'preset'
    }));

    // 2. Also query OpenStreetMap Nominatim for Indonesia
    let nominatimMatches: any[] = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&countrycodes=id&format=json&addressdetails=1&limit=6`;

      const res = await fetch(nominatimUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'DeteksiKebakaran-App/1.0 (contact@emergency-id.local)'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        nominatimMatches = data.map((item: any) => {
          const addr = item.address || {};
          const district = addr.suburb || addr.village || addr.town || addr.city_district || '';
          const city = addr.city || addr.county || addr.state_district || '';
          const state = addr.state || '';

          const displayParts = [district, city, state].filter(Boolean);
          const shortName = displayParts.length > 0 ? displayParts.join(', ') : item.name;

          return {
            name: item.display_name,
            shortName: shortName || item.name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            source: 'nominatim'
          };
        });
      }
    } catch {
      // Nominatim timed out or failed; local matches will serve as fallback
    }

    // Combine and deduplicate
    const combined = [...localMatches, ...nominatimMatches];
    const unique = combined.filter(
      (val, idx, arr) =>
        arr.findIndex(
          (t) =>
            Math.abs(t.lat - val.lat) < 0.05 &&
            Math.abs(t.lon - val.lon) < 0.05
        ) === idx
    );

    return NextResponse.json({ results: unique.slice(0, 8) });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Gagal mencari lokasi' },
      { status: 500 }
    );
  }
}

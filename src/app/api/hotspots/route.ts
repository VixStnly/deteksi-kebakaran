import { NextResponse } from 'next/server';
import { INDONESIA_ACTIVE_HOTSPOTS } from '@/lib/hotspots-data';
import { calculateDistanceKm, calculateBearingDeg, degToIndonesianCardinal } from '@/lib/fire-calculator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const radiusStr = searchParams.get('radius') || '50';

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { error: 'Parameter lat dan lon wajib diisi' },
        { status: 400 }
      );
    }

    const userLat = parseFloat(latStr);
    const userLon = parseFloat(lonStr);
    const radiusKm = parseFloat(radiusStr);

    if (isNaN(userLat) || isNaN(userLon) || isNaN(radiusKm)) {
      return NextResponse.json(
        { error: 'Format koordinat atau radius tidak valid' },
        { status: 400 }
      );
    }

    // Calculate distance and bearing for all hotspots relative to user
    const nearbyHotspots = INDONESIA_ACTIVE_HOTSPOTS.map((fire) => {
      const distanceKm = calculateDistanceKm(userLat, userLon, fire.latitude, fire.longitude);
      const bearingDeg = calculateBearingDeg(userLat, userLon, fire.latitude, fire.longitude);
      const bearingCardinal = degToIndonesianCardinal(bearingDeg);

      return {
        ...fire,
        distanceKm,
        bearingDeg,
        bearingCardinal
      };
    })
      .filter((fire) => fire.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      userLocation: { lat: userLat, lon: userLon },
      radiusKm,
      totalCount: nearbyHotspots.length,
      hotspots: nearbyHotspots,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil data hotspot' },
      { status: 500 }
    );
  }
}

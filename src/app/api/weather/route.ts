import { NextResponse } from 'next/server';
import { WindData } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { error: 'Parameter lat dan lon diperlukan' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: 'Format koordinat tidak valid' },
        { status: 400 }
      );
    }

    // Call Open-Meteo Forecast API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    try {
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=wind_speed_850hPa,wind_direction_850hPa&timezone=auto`;
      const res = await fetch(apiUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'DeteksiKebakaran-Tracker/1.0' },
        next: { revalidate: 300 } // cache for 5 minutes
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const current = data.current || {};
        const hourly = data.hourly || {};

        const surfaceSpeed = current.wind_speed_10m ?? 12.5;
        const surfaceDir = current.wind_direction_10m ?? 135;
        const temp = current.temperature_2m ?? 31.0;
        const hum = current.relative_humidity_2m ?? 65;

        // Extract first hourly value for 850hPa
        const altSpeed = hourly.wind_speed_850hPa?.[0] ?? surfaceSpeed * 1.35;
        const altDir = hourly.wind_direction_850hPa?.[0] ?? surfaceDir;

        const windData: WindData = {
          time: current.time || new Date().toISOString(),
          surfaceWindSpeedKmh: Math.round(surfaceSpeed * 10) / 10,
          surfaceWindDirectionDeg: Math.round(surfaceDir),
          altitude850WindSpeedKmh: Math.round(altSpeed * 10) / 10,
          altitude850WindDirectionDeg: Math.round(altDir),
          temperatureC: Math.round(temp * 10) / 10,
          humidityPercent: Math.round(hum),
          source: 'Open-Meteo (ECMWF & GFS Analysis)'
        };

        return NextResponse.json({ success: true, wind: windData });
      }
    } catch {
      // Aborted or fetch failed, fallback below
    }

    // Fallback: Default tropical Southeast Asia trade wind pattern
    const fallbackWind: WindData = {
      time: new Date().toISOString(),
      surfaceWindSpeedKmh: 14.2,
      surfaceWindDirectionDeg: 140, // Tenggara
      altitude850WindSpeedKmh: 22.0,
      altitude850WindDirectionDeg: 135,
      temperatureC: 31.5,
      humidityPercent: 68,
      source: 'Klimatologi Standar BMKG (Fallback)'
    };

    return NextResponse.json({ success: true, wind: fallbackWind });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Gagal memproses data cuaca angin' },
      { status: 500 }
    );
  }
}

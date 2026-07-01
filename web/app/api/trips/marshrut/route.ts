import { NextRequest, NextResponse } from "next/server";

interface DestinationItem {
  name: string;
  latitude: number | null;
  longitude: number | null;
  order?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { destinations }: { destinations: DestinationItem[] } = await request.json();
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Mapbox token тохируулагдаагүй байна." },
        { status: 500 }
      );
    }

    if (!destinations || !Array.isArray(destinations) || destinations.length < 2) {
      return NextResponse.json(
        { error: "Маршрут үүсгэхийн тулд хамгийн багадаа 2 очих газар шаардлагатай." },
        { status: 400 }
      );
    }

   
    const sortedDestinations = [...destinations].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    const coordinatePairs: string[] = [];

    for (const place of sortedDestinations) {
      if (place.longitude !== null && place.latitude !== null) {

        const lng = Number(place.longitude);
        const lat = Number(place.latitude);
        
        coordinatePairs.push(`${lng},${lat}`);
      }
    }

    if (coordinatePairs.length < 2) {
      return NextResponse.json(
        { error: "Маршрут үүсгэхийн тулд хамгийн багадаа 2 зөв координаттай цэг шаардлагатай." },
        { status: 400 }
      );
    }

    const coordsString = coordinatePairs.join(";");
    console.log("Mapbox руу илгээж буй координатууд:", coordsString);

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${token}`;

    const directionsRes = await fetch(directionsUrl);
    const directionsData = await directionsRes.json();

    if (!directionsRes.ok || directionsData.code !== "Ok") {
      console.error("Mapbox API Алдаа буцаалаа:", directionsData);
      return NextResponse.json(
        { error: `Mapbox алдаа: ${directionsData.message || "Зам олдсонгүй"}` },
        { status: 400 }
      );
    }

    const routeCoordinates = directionsData.routes[0].geometry.coordinates;

    return NextResponse.json({
      success: true,
      coordinates: routeCoordinates,
    });

  } catch (error) {
    console.error("Marshrut Generate Error:", error);
    return NextResponse.json(
      { error: "Маршрут үүсгэхэд сервер дээр алдаа гарлаа" },
      { status: 500 }
    );
  }
}
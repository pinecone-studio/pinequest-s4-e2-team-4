// import { NextRequest, NextResponse } from "next/server";

// // Газрын нэрийг координат (Longitude, Latitude) руу хөрвүүлэх туслах функц
// async function getCoordinates(placeName: string, accessToken: string) {
//   try {
//     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//       placeName
//     )}.json?access_token=${accessToken}&limit=1`;

//     const res = await fetch(url);
//     const data = await res.json();

//     if (data.features && data.features.length > 0) {
//       const [lng, lat] = data.features[0].center;
//       return `${lng},${lat}`;
//     }
//     return null;
//   } catch (error) {
//     console.error(`Geocoding error for ${placeName}:`, error);
//     return null;
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // 1.front oos avah gazar
//     const { destinations } = await request.json();

//     if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
//       return NextResponse.json(
//         { error: "Маршрут үүсгэх очих газрууд олдсонгүй." },
//         { status: 400 }
//       );
//     }

//     const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
//     if (!accessToken) {
//       return NextResponse.json(
//         { error: "Mapbox token тохируулагдаагүй байна." },
//         { status: 500 }
//       );
//     }

//     // 2. mapbox ruu horvuuleh
//     const coordinatePairs: string[] = [];
//     for (const place of destinations) {
//       const coords = await getCoordinates(place, accessToken);
//       if (coords) {
//         coordinatePairs.push(coords);
//       }
//     }

//     if (coordinatePairs.length < 2) {
//       return NextResponse.json(
//         { error: "Маршрут үүсгэхийн тулд хамгийн багадаа 2 зөв цэг шаардлагатай." },
//         { status: 400 }
//       );
//     }

//     // 3. show the way
    
//     const mapboxRouteUrl = `https://www.mapbox.com/direction-builder/?locs=${coordinatePairs
//       .map((coord) => `[${coord}]`)
//       .join(",")}`;

//     // 4. Link
//     return NextResponse.json({
//       success: true,
//       mapUrl: mapboxRouteUrl,
//     });

//   } catch (error) {
//     console.error("Marshrut Generate Error:", error);
//     return NextResponse.json(
//       { error: "Маршрут үүсгэхэд сервер дээр алдаа гарлаа" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

// get chat api
interface DestinationItem {
  name: string;
  latitude: number | null;
  longitude: number | null;
  order?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { destinations }: { destinations: DestinationItem[] } = await request.json();

    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json(
        { error: "Маршрут үүсгэх очих газрууд олдсонгүй." },
        { status: 400 }
      );
    }

    // order
    const sortedDestinations = [...destinations].sort((a, b) => (a.order || 0) - (b.order || 0));

    const coordinatePairs: string[] = [];

    for (const place of sortedDestinations) {
      // Turn into mapbox
      if (place.longitude !== null && place.latitude !== null) {
        coordinatePairs.push(`${place.longitude},${place.latitude}`);
      }
    }

    // Atleast 2 spot
    if (coordinatePairs.length < 2) {
      return NextResponse.json(
        { error: "Маршрут үүсгэхийн тулд хамгийн багадаа 2 зөв координаттай цэг шаардлагатай." },
        { status: 400 }
      );
    }

    // Link
    const origin = coordinatePairs[0];
    const destination = coordinatePairs[coordinatePairs.length - 1];
    
    // (Waypoints)
    const waypoints = coordinatePairs.slice(1, -1).join(";");
    
    const mapboxRouteUrl = waypoints 
      ? `https://apps.mapbox.com/directions/?o=${origin}&d=${destination}&w=${waypoints}&profile=driving`
      : `https://apps.mapbox.com/directions/?o=${origin}&d=${destination}&profile=driving`;

    return NextResponse.json({
      success: true,
      mapUrl: mapboxRouteUrl,
    });

  } catch (error) {
    console.error("Marshrut Generate Error:", error);
    return NextResponse.json(
      { error: "Маршрут үүсгэхэд сервер дээр алдаа гарлаа" },
      { status: 500 }
    );
  }
}
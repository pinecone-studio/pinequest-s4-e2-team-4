import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

async function getCoordinates(placeName: string) {
  try {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) return null;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      placeName,
    )}.json?access_token=${accessToken}&limit=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lng, lat };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for ${placeName}:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { tripId } = await params;

    const destinations = await prisma.destination.findMany({
      where: {
        tripId: tripId,
        trip: { userId: userId },
      },
      orderBy: { order: "asc" },
    });

    if (!destinations || destinations.length === 0) {
      return NextResponse.json(
        { error: "Энэ аялалд одоогоор очих газар бүртгэгдээгүй байна." },
        { status: 404 },
      );
    }

    const marshrutWithCoordinates = await Promise.all(
      destinations.map(async (dest) => {
        const coords = await getCoordinates(dest.name);
        return {
          id: dest.id,
          name: dest.name,
          description: dest.description,
          order: dest.order,
          coordinates: coords,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      tripId,
      marshrut: marshrutWithCoordinates,
    });
  } catch (error) {
    console.error("Get Marshrut API Error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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
      id: string;
    };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }

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

    const formattedDestinations = destinations.map((d) => ({
      id: d.id,
      name: d.name,
      latitude: d.latitude,
      longitude: d.longitude,
      order: d.order,
    }));

    return NextResponse.json({
      success: true,
      tripId,
      destinations: formattedDestinations,
    });
  } catch (error) {
    console.error("Get Trips API Error:", error);
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
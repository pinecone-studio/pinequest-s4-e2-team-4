import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Токен олдсонгүй" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decoded.id;

    const { searchParams } = new URL(request.url);
    let tripId = searchParams.get("tripId");

    if (!tripId || tripId === "undefined") {
      const latestTrip = await prisma.trip.findFirst({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
      });
      tripId = latestTrip?.id || null;
    }

    if (!tripId) {
      return NextResponse.json([]);
    }

    const checklistItems = await prisma.checklist.findMany({
      where: { tripId: tripId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(checklistItems);
  } catch (error) {
    console.error("Checklist GET Error:", error);
    return NextResponse.json({ error: "Сервер алдаа гарлаа" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Токен олдсонгүй" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decoded.id;

    const { title, category, tripId: providedTripId } = await request.json();
    let targetTripId = providedTripId;

    if (!targetTripId) {
      const latestTrip = await prisma.trip.findFirst({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
      });
      targetTripId = latestTrip?.id;
    }

    if (!targetTripId) {
      return NextResponse.json(
        { error: "Идэвхтэй аялал олдсонгүй" },
        { status: 400 },
      );
    }

    const newItem = await prisma.checklist.create({
      data: {
        title,
        category,
        isCompleted: false,
        tripId: targetTripId,
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Checklist POST Error:", error);
    return NextResponse.json({ error: "Сервер алдаа гарлаа" }, { status: 500 });
  }
}

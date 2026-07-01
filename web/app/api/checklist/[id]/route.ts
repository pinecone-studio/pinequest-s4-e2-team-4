import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      userId = decoded.id;
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Хүчингүй эсвэл хугацаа нь дууссан токен байна" },
        { status: 401 },
      );
    }

    const { id: itemId } = await params;
    const { isCompleted, title } = await request.json();

    const existingItem = await prisma.checklist.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });

    if (!existingItem || existingItem.trip.userId !== userId) {
      return NextResponse.json(
        { error: "Checklist олдсонгүй эсвэл засах эрхгүй байна" },
        { status: 403 },
      );
    }

    const updatedItem = await prisma.checklist.update({
      where: { id: itemId },
      data: {
        ...(isCompleted !== undefined && { isCompleted }),
        ...(title && { title }),
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("Checklist PATCH Error:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      userId = decoded.id;
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Хүчингүй эсвэл хугацаа нь дууссан токен байна" },
        { status: 401 },
      );
    }

    const { id: itemId } = await params;

    // Тухайн checklist item нь энэ хэрэглэгчийн trip-д хамаарах эсэхийг шалгах
    const existingItem = await prisma.checklist.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });

    if (!existingItem || existingItem.trip.userId !== userId) {
      return NextResponse.json(
        { error: "Checklist олдсонгүй эсвэл устгах эрхгүй байна" },
        { status: 403 },
      );
    }

    await prisma.checklist.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Амжилттай устгагдлаа",
    });
  } catch (error) {
    console.error("Checklist DELETE Error:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}

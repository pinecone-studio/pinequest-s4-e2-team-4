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

    jwt.verify(token, process.env.JWT_SECRET!);

    const { id: itemId } = await params;

    const { isCompleted, title } = await request.json();

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

    jwt.verify(token, process.env.JWT_SECRET!);

    const { id: itemId } = await params;

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

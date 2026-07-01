import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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

    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "Устгах чатны ID (chatId) олдсонгүй" },
        { status: 400 },
      );
    }

    const session = await prisma.chatSession.findFirst({
      where: { id: chatId, userId: userId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Чат олдсонгүй эсвэл устгах эрхгүй байна" },
        { status: 403 },
      );
    }

    await prisma.message.deleteMany({
      where: { sessionId: chatId },
    });

    await prisma.chatSession.delete({
      where: { id: chatId },
    });

    return NextResponse.json({
      success: true,
      message: "Чатны түүх амжилттай устгагдлаа",
    });
  } catch (error) {
    console.error("Delete Chat History Error:", error);
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

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId: userId },
      });

      if (!session) {
        return NextResponse.json(
          { error: "Чатны сешн олдсонгүй эсвэл хандах эрхгүй" },
          { status: 403 },
        );
      }

      const messages = await prisma.message.findMany({
        where: { sessionId: sessionId },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({ success: true, messages });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Chat History API Error:", error);
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

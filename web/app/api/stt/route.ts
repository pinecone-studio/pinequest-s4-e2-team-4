import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Аудио файл олдсонгүй. 'file' түлхүүр үгээр илгээнэ үү." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await fetch("https://api.chimege.com/v1.2/transcribe", {
      method: "POST",
      headers: {
        Token: process.env.CHIMEGE_STT || "",
        "Content-Type": "application/octet-stream",
        Punctuate: "true",
      },
      body: buffer,
    });

    const textResult = await response.text();

    return NextResponse.json({
      success: true,
      text: textResult,
    });
  } catch (error) {
    console.error("Chimege STT Бэкэнд Алдаа:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "STT сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}

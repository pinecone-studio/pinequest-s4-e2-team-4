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

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Хөрвүүлэх текст хоосон байна." },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.chimege.com/v1.2/synthesize", {
      method: "POST",
      headers: {
        Token: process.env.CHIMEGE_TTS || "",
        "Content-Type": "plain/text",
      },
      body: text,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chimege TTS Error Response:", errorText);
      return NextResponse.json(
        { error: "Chimege API-аас аудио үүсгэж чадсангүй." },
        { status: 500 },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (error) {
    console.error("Chimege TTS Бэкэнд Алдаа:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "TTS сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}

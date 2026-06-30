import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Имэйл хаяг заавал шаардлагатай" },
        { status: 400 },
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Энэ имэйл хаяг системд бүртгэлгүй байна" },
        { status: 400 },
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.deleteMany({
      where: {
        userId: user.id,
        type: "RESET_PASSWORD",
      },
    });

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    await resend.emails.send({
      from: "TravelApp <onboarding@resend.dev>",
      to: cleanEmail,
      subject: "🔒 Нууц үг сэргээх код",
      html: `
        <div style="font-family: sans-serif; max-width: 450px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; text-align: center;">
          <h2 style="color: #333;">Нууц үг сэргээх</h2>
          <p style="color: #555;">Таны нууц үг сэргээх 6 оронтой баталгаажуулах код:</p>
          <div style="background-color: #f4f4f5; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0070f3; border-radius: 5px; display: inline-block; margin: 15px 0;">
            ${otpCode}
          </div>
          <p style="color: #999; font-size: 12px;">Энэхүү код нь 10 минутын дараа хүчингүй болно.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Нууц үг сэргээх код таны имэйл хаяг руу амжилттай илгээгдлээ",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Имэйл, код болон шинэ нууц үг заавал шаардлагатай" },
        { status: 400 },
      );
    }

    const validCode = await prisma.verificationCode.findFirst({
      where: {
        code,
        type: "RESET_PASSWORD",
        expiresAt: { gte: new Date() },
        user: {
          email: email,
        },
      },
    });

    if (!validCode) {
      return NextResponse.json(
        { error: "Баталгаажуулах код буруу эсвэл хугацаа нь дууссан байна" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationCode.delete({
      where: { id: validCode.id },
    });

    return NextResponse.json({
      message:
        "Нууц үг амжилттай шинэчлэгдлээ. Та шинэ нууц үгээрээ нэвтэрнэ үү.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

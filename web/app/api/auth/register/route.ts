import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Имэйл, нэвтрэх нэр болон нууц үг шаардлагатай" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ имэйл эсвэл нэвтрэх нэр аль хэдийн бүртгэгдсэн байна" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Хэрэглэгч амжилттай бүртгэгдлээ", userId: newUser.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрээгүй байна. Токен олдсонгүй." },
        { status: 401 },
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Хүчингүй эсвэл хугацаа нь дууссан токен." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй." },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 },
    );
  }
}

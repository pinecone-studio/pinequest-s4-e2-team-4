import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { phone, name } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 404 },
      );
    }

    const updateData: Record<string, any> = {};

    if (name !== undefined && name !== currentUser.name) {
      updateData.name = name;
    }
    if (phone !== undefined && phone !== currentUser.phone) {
      updateData.phone = phone;
    }

    // Юу ч өөрчлөгдөөгүй бол шууд амжилттай буцаана
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        message: "Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ",
        user: {
          id: currentUser.id,
          email: currentUser.email,
          username: currentUser.username,
          name: currentUser.name,
          phone: currentUser.phone,
          profileImage: currentUser.profileImage,
        },
      });
    }

    if (updateData.phone) {
      const existingUserWithPhone = await prisma.user.findUnique({
        where: { phone: updateData.phone },
      });

      if (existingUserWithPhone) {
        return NextResponse.json(
          {
            error: "Энэ утасны дугаар аль хэдийн өөр бүртгэлд холбогдсон байна",
          },
          { status: 400 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 },
    );
  }
}

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

    const { phone, name, profileImage } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 404 },
      );
    }

    const isNameSame = !name || name === currentUser.name;
    const isPhoneSame = !phone || phone === currentUser.phone;
    const isProfileImageSame =
      !profileImage || profileImage === currentUser.profileImage;

    if (isNameSame && isPhoneSame && isProfileImageSame) {
      return NextResponse.json(
        { error: "Өөрчлөгдсөн мэдээлэл олдсонгүй (Ижил мэдээлэл байна)" },
        { status: 400 },
      );
    }

    if (phone && phone !== currentUser.phone) {
      const existingUserWithPhone = await prisma.user.findUnique({
        where: { phone },
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
      data: {
        ...(phone && { phone }),
        ...(name && { name }),
        ...(profileImage && { profileImage }),
      },
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

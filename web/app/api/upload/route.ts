import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: "public" });

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: blob.url },
      });
    }

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

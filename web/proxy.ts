import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/user")) {
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен шаардлагатай (Хамгаалалт)" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/user/:path*"],
};

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

  const protectedRoutes = ["/chat", "/profile", "/settings"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  const authRoutes = ["/signin", "/signup"];
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/chat/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};

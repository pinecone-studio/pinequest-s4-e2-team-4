import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  const { pathname } = request.nextUrl;
  const pathWithSearch = `${pathname}${request.nextUrl.search}`;

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
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("next", pathWithSearch);

      return NextResponse.redirect(signInUrl);
    }
  }

  const authRoutes = ["/signin", "/signup", "/login", "/register"];
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const next = request.nextUrl.searchParams.get("next");
      const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/home";

      return NextResponse.redirect(new URL(safeNext, request.url));
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
    "/signin/:path*",
    "/signup/:path*",
    "/login",
    "/register",
  ],
};

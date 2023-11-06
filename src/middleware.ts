import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session: any = await getToken({ req: request });
  const PUBLIC_FILE = /\.(.*)$/;
  const authRegex = /^\/api\/auth\//;
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  if (authRegex.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (session) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session._id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // matcher: ["/((?!/api/auth|!_next).*)"],
  matcher: ["/((?!_next/image|favicon.ico).*)"],
};

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = await getToken({
    req: request,
    secret: process.env.SECRET,
  });
  const PUBLIC_FILE = /\.(.*)$/;
  const { pathname } = request.nextUrl;

  console.log(session, pathname);
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

  if (session) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session._id);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    const originalUrl =
      request.nextUrl.protocol +
      request.headers.get("host") +
      request.nextUrl.pathname;

    console.log("in", request.url);
    if (!request.headers.get("x-middleware-rewrite")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|_ipx|assets|favicon.ico|under-development.svg|public).*)",
  ],
  // matcher: ["/((?!register|login|api/auth).{1,})"],
};

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://classzone.vercel.app"]
    : ["http://localhost:3000"];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const session: any = await getToken({ req: request });
  const authRegex = /^\/api\/auth\//;
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
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
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!/api/auth|!static|!_next).*)"],
};

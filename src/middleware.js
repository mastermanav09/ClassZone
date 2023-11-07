import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { pathToRegexp } from "path-to-regexp";

export async function middleware(request) {
  const session = await getToken({ req: request });
  const PUBLIC_FILE = /\.(.*)$/;
  const authRegex = /^\/api\/auth\//;
  const { pathname } = request.nextUrl;
  console.log("token", session);
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
    // if (pathname !== "/login") {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
  }
}

const matcher = pathToRegexp("/((?!register|api/auth).{1,})");
export const config = {
  matcher,
  // matcher: ["/((?!register|api|login|$).*)"],
  // matcher: ["/", "/unauthorized", "/classes/:path*", "/((?!/api/auth).*)"],
};

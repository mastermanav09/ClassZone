// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import { pathToRegexp } from "path-to-regexp";
// import * as jsonwebtoken from "jsonwebtoken";

// export async function middleware(request) {
//   // const session = await getToken({ req: request, raw: true });

//   try {
//     const jwtEncodedToken = request?.cookies?.get(
//       "next-auth.session-token"
//     ).value;
//     const session = jsonwebtoken.verify(
//       jwtEncodedToken ?? "",
//       process.env.NEXTAUTH_SECRET
//     );
//     const PUBLIC_FILE = /\.(.*)$/;
//     const authRegex = /^\/api\/auth\//;
//     const { pathname } = request.nextUrl;
//     console.log("token", session);
//     if (
//       pathname.startsWith("/_next") ||
//       pathname.startsWith("/static") ||
//       PUBLIC_FILE.test(pathname)
//     ) {
//       return NextResponse.next();
//     }

//     if (pathname === "/login" || pathname === "/register") {
//       return NextResponse.next();
//     }

//     if (authRegex.test(request.nextUrl.pathname)) {
//       return NextResponse.next();
//     }

//     if (session) {
//       const requestHeaders = new Headers(request.headers);
//       requestHeaders.set("x-user-id", session._id);

//       return NextResponse.next({
//         request: {
//           headers: requestHeaders,
//         },
//       });
//     } else {
//       // if (pathname !== "/login") {
//       // return NextResponse.redirect(new URL("/login", request.url));
//       // }
//     }
//   } catch (error) {
//     console.log("error", error);
//     // return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// // const matcher = pathToRegexp();
// export const config = {
//   // matcher: [
//   //   "/((?!register|api/auth|login|unauthorized|_next/image|auth).{1,})",
//   // ],
//   // matcher: ["/((?!register|api|login|$).*)"],
//   matcher: ["/((?!api/auth|login|register|_next).*)"],
//   // matcher: ["/", "/unauthorized", "/classes/:path*", "/api/class", "/api/user"],
// };

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = await getToken({
    req: request,
    secret: process.env.SECRET,
  });
  const PUBLIC_FILE = /\.(.*)$/;
  const authRegex = /^\/api\/auth\//;
  const { pathname } = request.nextUrl;
  console.log("session", session);
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
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!register|api/auth|login|unauthorized|_next/image|auth).{1,})",
  ],
  // matcher: ["/((?!/api/auth|!_next).*)"],
  // matcher: ["/", "/unauthorized", "/classes/:path*", "/api/class", "/api/user"],
  // matcher: ["/((?!_next).*)"],
};

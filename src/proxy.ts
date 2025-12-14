import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/",
  "/about",
  "/products",
  "/gallery",
  "/blog",
  "/signin",
  "/signup",
  "/forgot-password",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has("session");

  // If user is logged in and tries to access auth pages
  if (hasSessionCookie && (pathname === "/signin" || pathname === "/signup")) {
    try {
      // Verify session
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();

      if (data.authenticated) {
        // If authenticated, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      // If there's an error, clear the session and redirect to signin
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // If user is not logged in and tries to access protected routes
  if (
    !hasSessionCookie &&
    !publicPaths.includes(pathname) &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/products/") &&
    !pathname.startsWith("/blog/")
  ) {
    // Store the original URL to redirect back after login
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.set("redirectAfterLogin", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

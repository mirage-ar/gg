import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const privyToken = cookieStore.get("privy-token");

  const authUrl = "/api/auth/login";

  if (request.nextUrl.pathname === authUrl && privyToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  // Exclude paths for static assets and API calls from the auth check
  const shouldBypassAuth =
    request.nextUrl.pathname.startsWith("/_next/static/") || // Next.js static files
    request.nextUrl.pathname.startsWith("/static/") || // Custom static directory (if any)
    request.nextUrl.pathname.startsWith("/api/") || // API requests
    request.nextUrl.pathname.endsWith(".jpg") || // Image assets
    request.nextUrl.pathname.endsWith(".png") || // Image assets
    request.nextUrl.pathname.endsWith(".css") || // CSS files
    request.nextUrl.pathname.endsWith(".js"); // JavaScript files

  if (!privyToken && !shouldBypassAuth && request.nextUrl.pathname !== authUrl) {
    // User is not authenticated and request is not for a static asset or API call
    const url = request.nextUrl.clone();
    url.pathname = authUrl;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

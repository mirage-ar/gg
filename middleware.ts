import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const privyToken = cookieStore.get("privy-token");
  const pathname = request.nextUrl.pathname;
  const authUrl = "/api/auth/login";

  // Define base conditions for bypassing auth in arrays for easy management
  const bypassPaths = ["/_next/static/", "/static/", "/api/"];
  const bypassExtensions = [".jpg", ".png", ".css", ".js", ".webmanifest"];

  // Check if the request should bypass authentication
  const shouldBypassAuth =
    bypassPaths.some((path) => pathname.startsWith(path)) || bypassExtensions.some((ext) => pathname.endsWith(ext));

  // Redirect unauthenticated requests to the auth URL, unless they should bypass auth
  if (!privyToken && !shouldBypassAuth && pathname !== authUrl) {
    const url = request.nextUrl.clone();
    url.pathname = authUrl;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

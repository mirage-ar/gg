import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request: any) {
  const privyToken = request.cookies.get("privy-token");
  const userId = request.cookies.get("user-id");

  const authUrl = "/auth/login";
  const indexPath = "/";

  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check if the requested URL is not the index page, and the user is not authenticated
  if (request.nextUrl.pathname !== indexPath && !userId && request.nextUrl.pathname !== authUrl) {
    const url = request.nextUrl.clone();
    url.pathname = authUrl;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

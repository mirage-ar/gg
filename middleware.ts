import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request: any) {
  const privyToken = request.cookies.get("privy-token");

  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  const twitterAuthUrl = "/api/auth/signin/twitter";
  const twitterCallbackUrl = "/api/auth/callback/twitter";
  const privyAuthUrl = "/api/auth/wallet";

  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (
    !privyToken &&
    request.nextUrl.pathname !== twitterAuthUrl &&
    request.nextUrl.pathname !== twitterCallbackUrl &&
    request.nextUrl.pathname !== privyAuthUrl
  ) {
    const url = request.nextUrl.clone();
    url.pathname = privyAuthUrl;
    return NextResponse.redirect(url);
  }

  if (
    !nextAuthToken &&
    request.nextUrl.pathname !== twitterAuthUrl &&
    request.nextUrl.pathname !== twitterCallbackUrl
  ) {
    const url = request.nextUrl.clone();
    url.pathname = twitterAuthUrl;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

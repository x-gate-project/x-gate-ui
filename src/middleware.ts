import { NextResponse, NextRequest, MiddlewareConfig } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import { defaultLocale, locales } from "@/dicts";
import Negotiator from "negotiator";

const SWAP_APP_URL = process.env.NEXT_PUBLIC_SWAP_APP_URL || '';

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  try {
    const languages = new Negotiator({ headers: request.headers as any }).languages();

    return match(languages, locales, defaultLocale);
  } catch (error) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SWAP_APP_URL) {
    if (pathname === "/swap" || pathname.startsWith("/swap/")) {
      const targetPath = pathname.replace(/^\/swap/, "") || "/";
      const url = new URL(targetPath, SWAP_APP_URL);
      url.search = request.nextUrl.search;
      return NextResponse.rewrite(url);
    }

    // Proxy x-swap API calls
    if (pathname === "/api/uniswap" || pathname.startsWith("/api/uniswap/")) {
      return NextResponse.rewrite(new URL(pathname + request.nextUrl.search, SWAP_APP_URL));
    }

    // Proxy x-swap static assets (no prefix needed since basename removed)
    if (
      pathname.startsWith("/static/") ||
      pathname.startsWith("/fonts/") ||
      pathname.startsWith("/images/")
    ) {
      return NextResponse.rewrite(new URL(pathname, SWAP_APP_URL));
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);

  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config: MiddlewareConfig = {
  matcher: [
    // Skip Next.js internals and static assets, but allow /api/uniswap/* for proxying
    "/((?!api/(?!uniswap)|_next/static|_next/image|favicon.ico|icons).*)",
  ],
};

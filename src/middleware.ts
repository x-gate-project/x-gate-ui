import { NextResponse, NextRequest, MiddlewareConfig } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import { defaultLocale, locales } from "@/dicts";
import Negotiator from "negotiator";

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
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
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
    // Skip all internal paths (_next)
    // "/((?!_next).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};

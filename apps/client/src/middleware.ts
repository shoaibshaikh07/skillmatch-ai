import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./lib/utils";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") || "";

  const response = await api.get("/auth/get-session", {
    headers: {
      Cookie: cookie,
    },
  });

  if (!response.data) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Check onboarding status once
  const checkOnboardingStatus = await api.get("/user/onboarding", {
    headers: {
      Cookie: cookie,
    },
  });

  const isOnboardingCompleted =
    checkOnboardingStatus.data.success && checkOnboardingStatus.data.completed;

  // Handle auth path
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/jobs", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Handle onboarding path
  if (request.nextUrl.pathname.startsWith("/onboarding")) {
    if (isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/jobs", request.url));
    }
    return NextResponse.next();
  }

  // Handle jobs path
  if (request.nextUrl.pathname.startsWith("/jobs")) {
    if (!isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/auth/:path*", "/onboarding/:path*", "/jobs/:path*"],
};

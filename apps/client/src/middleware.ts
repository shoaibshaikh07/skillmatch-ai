import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./lib/utils";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const cookie = request.headers.get("cookie") || "";
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

  const response = await api.get("/auth/get-session", {
    headers: {
      Cookie: cookie,
    },
  });

  // Only check onboarding status if user is authenticated
  let isOnboardingCompleted = false;
  if (response.data) {
    try {
      const checkOnboardingStatus = await fetch(`${API_URL}/user/onboarding`, {
        headers: {
          Cookie: cookie,
        },
      });
      const checkOnboardingStatusData = await checkOnboardingStatus.json();
      isOnboardingCompleted =
        checkOnboardingStatusData.success &&
        checkOnboardingStatusData.completed;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // If there's an error checking onboarding status, assume it's not completed
      isOnboardingCompleted = false;
    }
  }

  // Handle auth path
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (response.data) {
      // Only redirect if user is authenticated
      if (isOnboardingCompleted) {
        return NextResponse.redirect(new URL("/jobs", request.url));
      }
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // If not authenticated, allow access to auth pages
    return NextResponse.next();
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

export const config = {
  matcher: ["/auth/:path*", "/onboarding/:path*", "/jobs/:path*"],
};

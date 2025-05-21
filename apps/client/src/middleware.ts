import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./lib/utils";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") || "";
  console.log("Middleware - Cookie header:", cookie); // Debug log

  try {
    const response = await api.get("/auth/get-session", {
      headers: {
        Cookie: cookie,
      },
    });
    console.log("Middleware - Session response:", response.data); // Debug log

    if (!response.data) {
      console.log("Middleware - No session data, redirecting to auth"); // Debug log
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Check onboarding status once
    const checkOnboardingStatus = await api.get("/user/onboarding", {
      headers: {
        Cookie: cookie,
      },
    });

    const isOnboardingCompleted =
      checkOnboardingStatus.data.success &&
      checkOnboardingStatus.data.completed;

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
  } catch (error) {
    console.error("Middleware - Error:", error);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/auth/:path*", "/onboarding/:path*", "/jobs/:path*"],
};

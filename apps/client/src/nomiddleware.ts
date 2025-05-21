import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const cookie = request.headers.get("cookie") || "";
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

  // Check authentication status
  const response = await fetch(`${API_URL}/auth/get-session`, {
    headers: {
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    console.log("Session check failed:", response.status);
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const responseData = await response.json();
  console.log("Session data:", {
    hasData: !!responseData,
    status: response.status,
    path: request.nextUrl.pathname,
  });

  // For auth pages, allow access if not authenticated
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (!responseData?.user) {
      return NextResponse.next();
    }
    // If authenticated, check onboarding status
    try {
      const checkOnboardingStatus = await fetch(`${API_URL}/user/onboarding`, {
        headers: {
          Cookie: cookie,
        },
      });
      if (!checkOnboardingStatus.ok) {
        console.log("Onboarding check failed:", checkOnboardingStatus.status);
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      const { completed } = await checkOnboardingStatus.json();
      return completed
        ? NextResponse.redirect(new URL("/jobs", request.url))
        : NextResponse.redirect(new URL("/onboarding", request.url));
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // For onboarding and jobs pages, require authentication
  if (!responseData?.user) {
    console.log("No user in session, redirecting to auth");
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Check onboarding status for authenticated users
  try {
    const checkOnboardingStatus = await fetch(`${API_URL}/user/onboarding`, {
      headers: {
        Cookie: cookie,
      },
    });

    if (!checkOnboardingStatus.ok) {
      console.log("Onboarding check failed:", checkOnboardingStatus.status);
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const { completed } = await checkOnboardingStatus.json();
    console.log("Onboarding status:", {
      completed,
      path: request.nextUrl.pathname,
    });

    // Handle onboarding path
    if (request.nextUrl.pathname.startsWith("/onboarding")) {
      return completed
        ? NextResponse.redirect(new URL("/jobs", request.url))
        : NextResponse.next();
    }

    // Handle jobs path
    if (request.nextUrl.pathname.startsWith("/jobs")) {
      return completed
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/onboarding", request.url));
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/onboarding/:path*", "/jobs/:path*"],
  runtime: "nodejs",
};

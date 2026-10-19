import { NextResponse } from "next/server";
import {
  backendAuthHeaders,
  getBackendUrl,
  USER_TOKEN_COOKIE,
  userAuthCookieOptions,
} from "@/lib/backend";
import { attachWelcomeCookie } from "@/lib/welcomeSignup";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBackendUrl()}/auth/user/register`, {
      method: "POST",
      headers: backendAuthHeaders(request),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: res.status },
      );
    }

    const response = NextResponse.json({
      user: data.user,
      isNewUser: true,
      message: "Welcome to Lestow",
    });
    response.cookies.set(
      USER_TOKEN_COOKIE,
      data.accessToken,
      userAuthCookieOptions(),
    );
    attachWelcomeCookie(response, true);
    return response;
  } catch {
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}

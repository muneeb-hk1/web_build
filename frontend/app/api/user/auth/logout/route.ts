import { NextResponse } from "next/server";
import { USER_TOKEN_COOKIE, userAuthCookieOptions } from "@/lib/backend";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(USER_TOKEN_COOKIE, "", {
    ...userAuthCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

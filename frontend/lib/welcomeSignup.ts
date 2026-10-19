import { NextResponse } from "next/server";
import { userAuthCookieOptions } from "@/lib/backend";

export const WELCOME_COOKIE = "lestow-welcome";

export function attachWelcomeCookie(response: NextResponse, isNewUser?: boolean) {
  if (!isNewUser) return response;
  const base = userAuthCookieOptions(60 * 5);
  response.cookies.set(WELCOME_COOKIE, "1", {
    ...base,
    httpOnly: false,
  });
  return response;
}

export function consumeWelcomePending() {
  if (typeof document === "undefined") return false;
  const match = document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${WELCOME_COOKIE}=`));
  if (!match) return false;
  document.cookie = `${WELCOME_COOKIE}=; Max-Age=0; path=/`;
  return true;
}

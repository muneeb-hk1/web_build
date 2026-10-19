import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) {
    // 200 (not 401) so guest session checks don't log console errors in Lighthouse.
    return NextResponse.json(null, { status: 200 });
  }

  try {
    const res = await fetch(`${getBackendUrl()}/auth/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(null, { status: 200 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}

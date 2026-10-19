import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Admin login required" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${getBackendUrl()}/sites/admin-preview/${encodeURIComponent(siteId)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to load draft preview" },
      { status: 500 },
    );
  }
}

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl, USER_TOKEN_COOKIE } from "@/lib/backend";
import { saveUpload } from "@/lib/objectStorage";

const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
const VIDEO_MAX_BYTES = 40 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const meResponse = await fetch(`${getBackendUrl()}/auth/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const me = (await meResponse.json().catch(() => ({}))) as { id?: string };
    if (!meResponse.ok || !me.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Media file is required" },
        { status: 400 },
      );
    }

    const extension = EXTENSIONS[file.type];
    if (!extension) {
      return NextResponse.json(
        { message: "Use JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV" },
        { status: 400 },
      );
    }

    const isVideo = file.type.startsWith("video/");
    const maxBytes = isVideo ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES;
    if (file.size === 0) {
      return NextResponse.json(
        { message: "The selected file is empty" },
        { status: 400 },
      );
    }
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          message: isVideo
            ? "Video must be 40MB or smaller"
            : "Image must be 8MB or smaller",
        },
        { status: 400 },
      );
    }

    const now = new Date();
    const folder = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1,
    ).padStart(2, "0")}`;
    const safeUserId = me.id.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${randomUUID()}.${extension}`;
    const key = `content/${safeUserId}/${folder}/${filename}`;
    const saved = await saveUpload({
      key,
      buffer: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    });

    return NextResponse.json({
      url: saved.url,
      fileName: file.name,
      mediaType: isVideo ? "video" : "image",
      storage: saved.storage,
    });
  } catch (error) {
    console.error("Editor media upload failed", error);
    return NextResponse.json(
      { message: "Unable to upload this media file" },
      { status: 500 },
    );
  }
}

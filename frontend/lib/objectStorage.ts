import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type SaveUploadInput = {
  /** Object key without leading slash, e.g. content/userId/2026-09/uuid.jpg */
  key: string;
  buffer: Buffer;
  contentType?: string;
};

export type SaveUploadResult = {
  /** Public URL (S3/CloudFront) or site-relative /uploads/... path */
  url: string;
  storage: "s3" | "local";
};

function env(name: string) {
  return (process.env[name] || "").trim();
}

export function isS3UploadEnabled() {
  return Boolean(env("S3_BUCKET") && env("AWS_REGION"));
}

function publicBaseUrl() {
  const explicit = env("S3_PUBLIC_BASE_URL").replace(/\/$/, "");
  if (explicit) return explicit;
  const bucket = env("S3_BUCKET");
  const region = env("AWS_REGION");
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}

let cachedClient: S3Client | null = null;

function getS3Client() {
  if (cachedClient) return cachedClient;
  const region = env("AWS_REGION");
  const accessKeyId = env("AWS_ACCESS_KEY_ID");
  const secretAccessKey = env("AWS_SECRET_ACCESS_KEY");
  cachedClient = new S3Client({
    region,
    ...(accessKeyId && secretAccessKey
      ? {
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        }
      : {}),
  });
  return cachedClient;
}

function guessContentType(key: string, fallback?: string) {
  if (fallback) return fallback;
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

/** Persist upload to S3 when configured, otherwise local public/uploads. */
export async function saveUpload(
  input: SaveUploadInput,
): Promise<SaveUploadResult> {
  const key = input.key.replace(/^\/+/, "");
  const contentType = guessContentType(key, input.contentType);

  if (isS3UploadEnabled()) {
    const bucket = env("S3_BUCKET");
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: input.buffer,
        ContentType: contentType,
        // Public-read if bucket policy allows; ACL optional (many buckets block ACLs).
        ...(env("S3_OBJECT_ACL") === "public-read"
          ? { ACL: "public-read" as const }
          : {}),
      }),
    );
    return {
      url: `${publicBaseUrl()}/${key}`,
      storage: "s3",
    };
  }

  const absolute = path.join(process.cwd(), "public", "uploads", key);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, input.buffer);
  return {
    url: `/uploads/${key}`,
    storage: "local",
  };
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  buildCategoryThemeComposeUrl,
  refreshCategoryContentFromApi,
} from "@/app/editor/layout/src/data/templateFlow";
import EditorLoadingScreen from "@/app/editor/components/EditorLoadingScreen";

function withComposePage(src: string, pageSlug: string) {
  const slug = pageSlug.trim().replace(/^\/+|\/+$/g, "");
  if (!slug || slug.toLowerCase() === "home") return src;
  const url = new URL(src, "https://lestow.local");
  url.searchParams.set("page", slug);
  return `${url.pathname}?${url.searchParams.toString()}`;
}

function themePreviewPath(category: string, templateId: string, pageId: string) {
  const base = `/preview/${encodeURIComponent(category)}/theme/${encodeURIComponent(templateId)}`;
  const slug = pageId.trim().replace(/^\/+|\/+$/g, "");
  if (!slug || slug.toLowerCase() === "home") return base;
  return `${base}/${encodeURIComponent(slug)}`;
}

function ThemePreview() {
  const params = useParams<{
    category: string;
    templateId: string;
    page?: string | string[];
  }>();
  const category = decodeURIComponent(params.category || "");
  const templateId = decodeURIComponent(params.templateId || "");
  const pageSlug = decodeURIComponent(
    (Array.isArray(params.page) ? params.page[0] : params.page) || "",
  );
  const initialSlugRef = useRef(pageSlug);
  const [src, setSrc] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await refreshCategoryContentFromApi(undefined, true);
      const next = buildCategoryThemeComposeUrl(templateId, category);
      if (cancelled) return;
      if (!next) {
        setMissing(true);
        return;
      }
      setSrc((current) => current || withComposePage(next, initialSlugRef.current));
    })();
    return () => {
      cancelled = true;
    };
  }, [category, templateId]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { source?: string; pageId?: string } | null;
      if (!data || data.source !== "lestow-theme-preview") return;
      if (typeof data.pageId !== "string") return;
      const next = themePreviewPath(category, templateId, data.pageId);
      if (window.location.pathname !== next) {
        window.history.replaceState(window.history.state, "", next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [category, templateId]);

  if (missing) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white p-8 text-center">
        <p className="text-sm text-slate-500">Theme not found.</p>
      </main>
    );
  }

  if (!src) {
    return <EditorLoadingScreen message="Loading preview…" />;
  }

  return (
    <iframe title={templateId} src={src} className="h-dvh w-full border-0" />
  );
}

export default function CategoryThemePreviewPage() {
  return (
    <Suspense fallback={<EditorLoadingScreen message="Loading preview…" />}>
      <ThemePreview />
    </Suspense>
  );
}

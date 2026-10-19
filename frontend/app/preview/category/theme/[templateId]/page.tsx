"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getTemplateIdsForCategory,
  getCategoryNamesWithContent,
  refreshCategoryContentFromApi,
} from "@/app/editor/layout/src/data/templateFlow";
import EditorLoadingScreen from "@/app/editor/components/EditorLoadingScreen";

function LegacyThemeRedirect() {
  const params = useParams<{ templateId: string }>();
  const templateId = decodeURIComponent(params.templateId || "");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await refreshCategoryContentFromApi();
      const category = getCategoryNamesWithContent().find((name) =>
        getTemplateIdsForCategory(name).includes(templateId),
      );
      if (cancelled) return;
      if (!category) return;
      router.replace(
        `/preview/${encodeURIComponent(category)}/theme/${encodeURIComponent(templateId)}`,
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [router, templateId]);

  return <EditorLoadingScreen message="Loading preview…" />;
}

export default function LegacyCategoryThemePreviewPage() {
  return (
    <Suspense fallback={<EditorLoadingScreen message="Loading preview…" />}>
      <LegacyThemeRedirect />
    </Suspense>
  );
}

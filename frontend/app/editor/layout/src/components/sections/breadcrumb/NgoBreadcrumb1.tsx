"use client";

import type { SectionProps } from "../../../types/section";
import NgoInnerBanner1 from "../banner/NgoInnerBanner1";

const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

/**
 * Standalone NGO page banner / breadcrumb section.
 * Editable separately from Blog / Events / Projects listing bodies.
 */
const NGO_DEFAULT_BANNER =
  "/categories/ngo/template1/group-friends-playing-together-wooden-tower-game.jpg";

export const ngoBreadcrumb11EditorFields = [
  "title",
  "homeLabel",
  "breadcrumbCurrent",
  "backgroundImage",
] as const;

const pickNgoBannerImage = (...candidates: unknown[]) => {
  for (const candidate of candidates) {
    const value = text(candidate);
    if (!value) continue;
    // Reject common/generic placeholders that hide the real NGO photo.
    if (value === "/bg1.jpg" || value === "/bg2.jpg") continue;
    return value;
  }
  return NGO_DEFAULT_BANNER;
};

function NgoBreadcrumb1({ data = {} }: SectionProps) {
  const title = text(data.title, text(data.breadcrumbCurrent, "Page"));
  const homeLabel = text(data.homeLabel, text(data.breadcrumbHome, "Home"));
  const breadcrumbCurrent = text(data.breadcrumbCurrent, title);
  const nestedBanner =
    data.banner && typeof data.banner === "object"
      ? (data.banner as Record<string, unknown>)
      : null;
  const image = pickNgoBannerImage(
    data.backgroundImage,
    data.bgImageUrl,
    nestedBanner?.bgImageUrl,
    nestedBanner?.backgroundImage,
    data.sideImage,
  );

  return (
    <main
      className="bg-white"
      data-editor-section-label="Breadcrumb"
      data-editor-fields={ngoBreadcrumb11EditorFields.join(" ")}
      data-editor-no-inline="true"
    >
      <NgoInnerBanner1
        appearance={data.innerBannerAppearance as any}
        title={title}
        breadcrumbHome={homeLabel}
        breadcrumbCurrent={breadcrumbCurrent}
        image={image}
        imageAlt={text(data.backgroundImageTitle, title)}
      />
    </main>
  );
}

(
  NgoBreadcrumb1 as typeof NgoBreadcrumb1 & {
    editorFields: readonly string[];
  }
).editorFields = ngoBreadcrumb11EditorFields;

export default NgoBreadcrumb1;

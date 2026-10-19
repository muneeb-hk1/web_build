"use client";

import type { SectionProps } from "../../../types/section";
import PageBanner from "../layout-src/pagebanner/page";

const DEFAULT_IMAGE = "/categories/cleaning/template1/banner/herobanner.png";

export default function CleaningBreadcrumb1({ data = {} }: SectionProps) {
  const withBackgroundImage = data.withBackgroundImage !== false;
  const title = String(data.bannerTitle || "Pricing");
  const breadcrumb = String(data.breadcrumb || title);

  return (
    <div data-editor-fields="bannerTitle breadcrumb backgroundImage backgroundColor">
      <PageBanner
        title={title}
        breadcrumb={breadcrumb}
        backgroundImage={String(data.backgroundImage || DEFAULT_IMAGE)}
        backgroundColor={String(data.backgroundColor || "#0B4C34")}
        withBackgroundImage={withBackgroundImage}
      />
    </div>
  );
}

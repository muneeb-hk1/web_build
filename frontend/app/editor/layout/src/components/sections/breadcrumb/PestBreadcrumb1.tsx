"use client";

import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import PageBanner from "./PestPageBanner";

export default function PestBreadcrumb1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const fromPage = preview?.currentPage?.trim();
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title
      : fromPage && fromPage.toLowerCase() !== "home"
        ? fromPage
        : "Page";
  const homeLabel =
    typeof data.homeLabel === "string" && data.homeLabel.trim()
      ? data.homeLabel
      : "Home";
  const current =
    typeof data.currentLabel === "string" && data.currentLabel.trim()
      ? data.currentLabel
      : title;
  const backgroundType =
    data.breadcrumbBackgroundType === "image" ||
    data.breadcrumbBackgroundType === "gradient" ||
    data.breadcrumbBackgroundType === "solid"
      ? data.breadcrumbBackgroundType
      : "solid";
  return (
    <PageBanner
      title={title}
      breadcrumbs={[{ label: homeLabel, href: "/" }, { label: current }]}
      backgroundType={backgroundType}
      backgroundImage={
        typeof data.backgroundImage === "string" ? data.backgroundImage : ""
      }
      backgroundColor={
        typeof data.breadcrumbBackgroundColor === "string"
          ? data.breadcrumbBackgroundColor
          : "#00482B"
      }
      gradientColor={
        typeof data.breadcrumbGradientColor === "string"
          ? data.breadcrumbGradientColor
          : "#1B8A3E"
      }
    />
  );
}

(
  PestBreadcrumb1 as typeof PestBreadcrumb1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "title",
  "homeLabel",
  "breadcrumbBackgroundType",
  "backgroundImage",
  "breadcrumbBackgroundColor",
  "breadcrumbGradientColor",
];

"use client";

import { useEffect, useMemo, useState } from "react";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  buildNgoProjectDetailFields,
  buildReadableNgoProjectBody,
  findNgoProject,
  NGO_PROJECT_DETAIL_SLUG_EVENT,
  readNgoProjectDetailSlug,
  resolveNgoProjectSlug,
} from "../../../lib/ngoProjectDetails";
import {
  DEFAULT_PORTFOLIO_DETAIL_LAYOUT,
  normalizePortfolioDetailLayout,
} from "../../../lib/portfolioLayouts";
import NgoPortfolioDetailArticle from "../portfolio/NgoPortfolioDetailArticle";

type ProjectListItem = Record<string, unknown>;

export default function NgoProjectsDetail1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const sectionData = (customData || {}) as Record<string, unknown>;

  const listingProjects = useMemo(() => {
    const fromDetail = Array.isArray(sectionData.projects)
      ? (sectionData.projects as ProjectListItem[])
      : Array.isArray(sectionData.productItems)
        ? (sectionData.productItems as ProjectListItem[])
        : [];
    const fromSite = Array.isArray(site.projectsPage?.projects)
      ? (site.projectsPage.projects as ProjectListItem[])
      : Array.isArray(site.portfolioPage?.projects)
        ? (site.portfolioPage.projects as ProjectListItem[])
        : [];
    return fromDetail.length ? fromDetail : fromSite;
  }, [sectionData.projects, sectionData.productItems]);

  const [selectedSlug, setSelectedSlug] = useState("");

  useEffect(() => {
    const syncSlug = () => setSelectedSlug(readNgoProjectDetailSlug());
    syncSlug();
    window.addEventListener(NGO_PROJECT_DETAIL_SLUG_EVENT, syncSlug);
    return () =>
      window.removeEventListener(NGO_PROJECT_DETAIL_SLUG_EVENT, syncSlug);
  }, [preview?.currentPage]);

  const selectedProject = useMemo(() => {
    const matched = findNgoProject(listingProjects, selectedSlug);
    if (matched) return matched;
    return listingProjects[0] || null;
  }, [listingProjects, selectedSlug]);

  const fallbackLayout = normalizePortfolioDetailLayout(
    (typeof sectionData.layout === "string" && sectionData.layout) ||
      (typeof sectionData.detailLayout === "string" &&
        sectionData.detailLayout) ||
      DEFAULT_PORTFOLIO_DETAIL_LAYOUT,
  );

  // Classic pack sections (about / goals / activities) seed the Content field.
  const packFallback = useMemo(() => {
    const hasPack =
      sectionData.aboutSection ||
      sectionData.goalsSection ||
      sectionData.keyActivitiesSection ||
      sectionData.sidebar;
    if (!hasPack) return null;
    return {
      aboutSection: sectionData.aboutSection,
      goalsSection: sectionData.goalsSection,
      keyActivitiesSection: sectionData.keyActivitiesSection,
      sidebar: sectionData.sidebar,
      title: sectionData.title,
    } as Record<string, unknown>;
  }, [
    sectionData.aboutSection,
    sectionData.goalsSection,
    sectionData.keyActivitiesSection,
    sectionData.sidebar,
    sectionData.title,
  ]);

  const built = buildNgoProjectDetailFields(
    selectedProject,
    fallbackLayout,
    packFallback,
  );

  const sectionMatchesSelected =
    typeof sectionData.title === "string" &&
    sectionData.title.trim().length > 0 &&
    (typeof sectionData.activeSlug !== "string" ||
      !sectionData.activeSlug ||
      !selectedSlug ||
      resolveNgoProjectSlug({ slug: String(sectionData.activeSlug) }) ===
        built.activeSlug);

  const fields = sectionMatchesSelected
    ? {
        title: String(sectionData.title || built.title),
        category:
          typeof sectionData.category === "string"
            ? sectionData.category
            : built.category,
        excerpt:
          typeof sectionData.excerpt === "string"
            ? sectionData.excerpt
            : built.excerpt,
        content: (() => {
          const sectionContent =
            typeof sectionData.content === "string"
              ? sectionData.content.trim()
              : "";
          const sectionExcerpt =
            typeof sectionData.excerpt === "string"
              ? sectionData.excerpt.trim()
              : built.excerpt;
          if (!sectionContent || sectionContent === sectionExcerpt) {
            return built.content;
          }
          return buildReadableNgoProjectBody(
            {
              title: String(sectionData.title || built.title),
              excerpt: sectionExcerpt,
              description: sectionExcerpt,
              content: sectionContent,
              longDescription: sectionContent,
            },
            packFallback,
          );
        })(),
        image:
          typeof sectionData.image === "string" && sectionData.image.trim()
            ? sectionData.image
            : built.image,
        layout: normalizePortfolioDetailLayout(
          (typeof sectionData.layout === "string" && sectionData.layout) ||
            (typeof sectionData.detailLayout === "string" &&
              sectionData.detailLayout) ||
            built.layout,
        ),
      }
    : built;

    return (
    <main
      className="bg-white"
      data-editor-section-label="Project Details"
      data-editor-fields="title,category,excerpt,content,image,layout"
    >
      <NgoPortfolioDetailArticle
        key={`${fields.title}-${fields.layout}-${selectedSlug || "project"}`}
        portfolioItem={{
          title: fields.title,
          category: fields.category,
          excerpt: fields.excerpt,
          content: fields.content,
          image: fields.image,
          layout: fields.layout,
        }}
      />
        </main>
    );
}

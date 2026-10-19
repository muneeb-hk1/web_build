"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { SectionProps } from "../../../types/section";
import { site, type NGOProjectsPageData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaHandshake,
} from "react-icons/fa";
import {
  getNgoProjectDetailHref,
  resolveNgoProjectSlug,
  writeNgoProjectDetailSlug,
} from "../../../lib/ngoProjectDetails";

type NGOProjectItem = NGOProjectsPageData["projects"][number];

type NGOProjectCategory = NGOProjectsPageData["categories"][number];

const FALLBACK_IMAGE =
  "/categories/ngo/template1/children-speaking-holding-book.jpg";

const flattenPreviewLinks = (
  links: Array<{ label?: string; href?: string; children?: unknown[] }> = [],
): Array<{ label?: string; href?: string }> =>
  links.flatMap((link) => [
    { label: link.label, href: link.href },
    ...flattenPreviewLinks(
      (link.children as Array<{
        label?: string;
        href?: string;
        children?: unknown[];
      }>) || [],
    ),
  ]);

const hrefSlug = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/^#page-/, "")
    .replace(/^\/+/, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ALL_PROJECTS_FILTER: NGOProjectCategory = {
  id: "all",
  label: "All Projects",
  icon: "project",
};

/** Filter-only / legacy entries — not real assignable project categories. */
const isPseudoProjectCategory = (cat: {
  id?: string;
  label?: string;
} | null) => {
  const id = String(cat?.id || "")
    .trim()
    .toLowerCase();
  const label = String(cat?.label || "")
    .trim()
    .toLowerCase();
  return (
    id === "all" ||
    label === "all projects" ||
    label === "all categories" ||
    id === "portfolio" ||
    label === "portfolio"
  );
};

const categoryMatches = (projectCategory: string, cat: NGOProjectCategory) => {
  const value = (projectCategory || "").trim().toLowerCase();
  return (
    value === (cat.id || "").toLowerCase() ||
    value === (cat.label || "").toLowerCase()
  );
};

const getCategoryIcon = (
  categories: NGOProjectCategory[],
  key: string,
  className = "text-xl",
) => {
  const cat = categories.find((item) => categoryMatches(key, item));
  return (
    <EditableNgoIcon name={cat?.icon || cat?.id || key} className={className} />
  );
};

export default function NgoProjects1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const candidate = customData as unknown as Partial<NGOProjectsPageData> | undefined;
  const fallback = site.projectsPage ?? site.portfolioPage ?? {};
  const data = {
    ...fallback,
    ...(candidate ?? {}),
    banner: {
      ...(fallback.banner ?? {}),
      ...(candidate?.banner ?? {}),
    },
    categories:
      Array.isArray(candidate?.categories) && candidate.categories.length
        ? candidate.categories
        : fallback.categories ?? [],
    projects:
      Array.isArray(candidate?.projects) && candidate.projects.length
        ? candidate.projects
        : fallback.projects ?? [],
    ctaSection: {
      ...(fallback.ctaSection ?? {}),
      ...(candidate?.ctaSection ?? {}),
    },
  };

  const { categories = [], ctaSection, projects = [] } = data;

  // Real categories only (editable). "All Projects" is always a synthetic filter.
  const realCategories = useMemo(
    () => (categories || []).filter((cat) => !isPseudoProjectCategory(cat)),
    [categories],
  );
  const filterCategories = useMemo(
    () => [ALL_PROJECTS_FILTER, ...realCategories],
    [realCategories],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const filteredProjects = useMemo(() => {
    const activeProjects = (projects || []).filter(
      (proj) => (proj as { active?: boolean }).active !== false,
    );
    if (selectedCategory === "all") return activeProjects;
    const activeCategory = realCategories.find(
      (cat) =>
        (cat.id || "").toLowerCase() === selectedCategory.toLowerCase() ||
        (cat.label || "").toLowerCase() === selectedCategory.toLowerCase(),
    );
    return activeProjects.filter((proj) =>
      activeCategory
        ? categoryMatches(proj.category, activeCategory)
        : (proj.category || "").toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [projects, selectedCategory, realCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const currentProjects = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, safePage]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditorPage = (href: string, fallbackLabel: string) => {
    if (!preview) return;
    const slug = hrefSlug(href);
    const match = flattenPreviewLinks(preview.pageLinks).find((link) => {
      const linkSlug = hrefSlug(link.href) || hrefSlug(link.label);
      return Boolean(slug) && (linkSlug === slug || hrefSlug(link.label) === slug);
    });
    preview.setCurrentPage(match?.label || fallbackLabel);
  };

  const openProjectDetail = (
    event: ReactMouseEvent,
    project: NGOProjectItem,
  ) => {
    if (!preview) return;
    event.preventDefault();
    event.stopPropagation();
    writeNgoProjectDetailSlug(resolveNgoProjectSlug(project));
    openEditorPage("/project-details", "Project Details");
  };

  return (
    <main className="bg-white">
      <section data-editor-section-label="ProjectCard" data-editor-fields="categories projects ctaSection" className="bg-[#f8f9fa] py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-12">
          {filterCategories.length > 0 && (
            <div className="w-full">
              <div className="flex sm:hidden justify-center">
                <div className="relative w-full max-w-xs">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    data-editor-keep-click="true"
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30 focus:border-[#ff5722] transition-colors"
                  >
                    {filterCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <FaChevronDown className="text-sm" />
                  </div>
                </div>
              </div>

              <div
                className="hidden sm:block lg:hidden overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="inline-flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mx-auto w-max min-w-full justify-center">
                  {filterCategories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-editor-keep-click="true"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex shrink-0 whitespace-nowrap items-center cursor-pointer gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/30 scale-[1.02]"
                            : "bg-transparent text-gray-600 hover:text-[#ff5722] hover:bg-orange-50 border border-transparent"
                        }`}
                      >
                        <span>
                          {getCategoryIcon(
                            filterCategories,
                            cat.icon || cat.id,
                            "text-base",
                          )}
                        </span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:flex flex-wrap items-center justify-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                {filterCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      data-editor-keep-click="true"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex items-center cursor-pointer gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/30 scale-[1.02]"
                          : "bg-transparent text-gray-600 hover:text-[#ff5722] hover:bg-orange-50 border border-transparent"
                      }`}
                    >
                      <span>
                        {getCategoryIcon(
                          filterCategories,
                          cat.icon || cat.id,
                          "text-base",
                        )}
                      </span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.length > 0 ? (
              currentProjects.map((project: NGOProjectItem) => {
                const detailHref = getNgoProjectDetailHref(project);
                return (
                <div
                  key={project.id}
                  data-editor-item-type="ProjectCard"
                  data-editor-item-label="ProjectCard"
                  data-editor-keep-click="true"
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={(event) => openProjectDetail(event, project)}
                >
                  <div className="relative h-[235px] w-full">
                    <Image
                      src={project.image || FALLBACK_IMAGE}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={project.image || FALLBACK_IMAGE}
                    />
                    <div className="absolute left-5 bottom-0 z-20 translate-y-1/2 w-[62px] h-[62px] rounded-full bg-white border border-[#ff5722]/10 shadow-[0_3px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#ff5722]">
                      {getCategoryIcon(
                        realCategories,
                        project.category,
                        "text-2xl",
                      )}
                    </div>
                  </div>
                  <div className="px-5 sm:px-6 pt-12 pb-5 flex-1 flex flex-col">
                    <h3 className="text-[19px] sm:text-xl min-h-[60px] font-bold text-[#172033] leading-[1.3] group-hover:text-[#ff5722] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-[15px] text-gray-500 mt-4 leading-[1.9] line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-6">
                      <Link
                        href={detailHref}
                        onClick={(event) => {
                          if (!preview) return;
                          event.preventDefault();
                        }}
                        className="inline-flex items-center gap-5 text-[#ff5722] font-bold text-[15px] hover:gap-6 transition-all duration-300"
                      >
                        <span>Read More</span>
                        <span
                          data-editor-no-inline
                          title="Open project details"
                          className="inline-flex"
                          onClick={(event) => openProjectDetail(event, project)}
                        >
                          <FaArrowRight className="text-[15px]" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No projects found for this category.
              </div>
            )}
          </div>

          {ctaSection && (
            <div className="bg-[#fff7f4] border border-[#ffebd0] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-[#ff5722] text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  <FaHandshake />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {ctaSection.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {ctaSection.description}
                  </p>
                </div>
              </div>
              <Link
                href={ctaSection.buttonLink || "/contact"}
                className="bg-[#ff5722] hover:bg-[#e04818] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 shrink-0 shadow-md shadow-[#ff5722]/20"
              >
                {ctaSection.buttonText}
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                data-editor-keep-click="true"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="w-10 h-10 cursor-pointer rounded-xl border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = safePage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    data-editor-keep-click="true"
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-xl cursor-pointer font-semibold text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/20"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                data-editor-keep-click="true"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

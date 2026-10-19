"use client";

import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiChevronRight,
  FiArrowRight,
  FiSend,
} from "react-icons/fi";
import { site } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";

type PositionItem = {
  id?: string | number;
  title?: string;
  type?: string;
  location?: string;
  experience?: string;
  applyLink?: string;
  icon?: string;
};

type CustomApplication = {
  title?: string;
  text?: string;
  email?: string;
};

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

const JOB_ICON_FALLBACKS = ["users", "megaphone", "project", "file"];

const renderJobIcon = (
  iconName: string | undefined,
  index: number,
  className: string,
) => (
  <EditableNgoIcon
    name={iconName || JOB_ICON_FALLBACKS[index % JOB_ICON_FALLBACKS.length]}
    className={className}
  />
);

export default function NgoCareerOpenPositions1({
  data: customData,
}: SectionProps) {
  const preview = useOptionalPreview();
  const custom = (customData || {}) as {
    title?: string;
    positions?: PositionItem[];
    customApplication?: CustomApplication;
    openPositions?: {
      title?: string;
      positions?: PositionItem[];
      customApplication?: CustomApplication;
    };
  };
  const fallback = site.career?.openPositions;
  const title =
    custom.title ||
    custom.openPositions?.title ||
    fallback?.title ||
    "Open Positions";
  const positions =
    (Array.isArray(custom.positions) && custom.positions.length
      ? custom.positions
      : Array.isArray(custom.openPositions?.positions) &&
          custom.openPositions.positions.length
        ? custom.openPositions.positions
        : fallback?.positions) || [];
  const customApplication =
    custom.customApplication ||
    custom.openPositions?.customApplication ||
    fallback?.customApplication;

  const keepEditorOnCanvas = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!preview) return;
    event.preventDefault();
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

  return (
    <section
      data-editor-section-label="Open Positions"
      data-editor-fields="title positions customApplication"
      className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      <h2 className="text-2xl font-extrabold text-[#1a0c2e] mb-6">{title}</h2>

      <div className="space-y-4">
        {positions.map((job, index) => {
          const isOrange = index % 2 !== 0;
          return (
            <div
              key={job.id || index}
              data-editor-item-type="CareerPosition"
              data-editor-item-label={job.title || "Open position"}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2ba048] hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isOrange
                      ? "bg-[#ff5a36] text-white"
                      : "bg-[#03513a] text-white"
                  }`}
                >
                  {renderJobIcon(job.icon, index, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a0c2e] mb-1.5">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <FiBriefcase className="text-gray-400" />
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiMapPin className="text-gray-400" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {job.experience}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={job.applyLink || "/job-details"}
                onClick={keepEditorOnCanvas}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-[#1a0c2e] hover:bg-[#03513a] hover:text-white hover:border-[#03513a] transition-all self-start sm:self-center shrink-0"
              >
                <span>View Details</span>
                <span
                  data-editor-no-inline
                  title="Open job details"
                  className="inline-flex"
                  onClick={(event) => {
                    if (!preview) return;
                    event.preventDefault();
                    event.stopPropagation();
                    openEditorPage(
                      job.applyLink || "/job-details",
                      "Job Details",
                    );
                  }}
                >
                  <FiArrowRight className="text-base" />
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {customApplication && (
        <div className="mt-6 bg-[#eaf5eb] border border-[#2ba048]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#03513a] text-white flex items-center justify-center shrink-0">
              <FiSend className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1a0c2e]">
                {customApplication.title}
              </h4>
              <p className="text-sm text-gray-600">{customApplication.text}</p>
            </div>
          </div>
          <a
            href={`mailto:${customApplication.email || ""}`}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1a0c2e] hover:bg-[#03513a] hover:text-white transition-all shrink-0"
          >
            <FiChevronRight className="w-5 h-5" />
          </a>
        </div>
      )}
    </section>
  );
}

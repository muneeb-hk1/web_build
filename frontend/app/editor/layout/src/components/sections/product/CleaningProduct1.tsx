"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";
import {
  handleManagerCardClick,
  slugFromListingHref,
} from "../../../lib/editorManagerCards";
import CleaningSlider from "../shared/CleaningSlider";
import CalculateCTA from "../layout-src/calculatecta/page";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultProjects = [
  {
    title: "Office Cleaning",
    category: "Office",
    image: `${ASSET}/services/service-1.png`,
  },
  {
    title: "Sanitizing Home",
    category: "Home",
    image: `${ASSET}/services/service-2.png`,
  },
  {
    title: "Office Cleaning",
    category: "Office",
    image: `${ASSET}/services/service-3.png`,
  },
  {
    title: "Kitchen Cleaning",
    category: "Kitchen",
    image: `${ASSET}/services/service-4.png`,
  },
];

export default function CleaningProduct1({
  data = {},
  editorMode,
}: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "Recent Projects");
  const title = String(data.title || "Let's See Our Recent Project Case");
  const projects = (
    Array.isArray(data.projectItems) && data.projectItems.length
      ? data.projectItems
      : Array.isArray(data.productItems) && data.productItems.length
        ? data.productItems
        : defaultProjects
  ) as Array<Record<string, any>>;
  const detailHref = String(data.detailBasePath || "/projects/detail");
  const layout = String(data.layout || "slider");

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  const heading = (
    <div>
      <h4 className="mb-3 text-[16px] font-semibold text-white md:text-[17px]">
        {pretitle}
      </h4>
      <h2 className="max-w-2xl text-[38px] leading-[1.15] font-semibold tracking-tight text-white md:text-[46px] lg:text-[48px]">
        {title}
      </h2>
    </div>
  );

  const projectCards = projects.map((project, index) => {
    const projectTitle = String(project.title || "Project");
    const category = String(project.category || "");
    const image = String(project.image || `${ASSET}/services/service-1.png`);
    const href = String(project.href || detailHref);
    const slug =
      String(project.slug || "").trim() ||
      slugFromListingHref(href, "projects") ||
      projectTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return (
      <Link
        key={`${projectTitle}-${index}`}
        href={href}
        onClick={(event) => {
          handleManagerCardClick(event, editorMode, "Portfolio", {
            slug,
            href,
            title: projectTitle,
          });
          if (!editorMode) {
            handleNavigate(event, href, projectTitle);
          }
        }}
        className="group block h-full"
        data-editor-no-inline
      >
        <div className="flex h-full flex-col bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-2">
          <div className="relative h-[280px] w-full overflow-hidden md:h-[320px]">
            <img
              src={image}
              alt={projectTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative flex grow flex-col justify-center p-6">
            <div className="absolute -top-5 right-6 flex h-10 w-10 items-center justify-center rounded-[4px] bg-[var(--accent)] shadow-md transition-transform duration-300 group-hover:scale-110">
              <ArrowRight size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <h3 className="mb-1.5 text-[20px] font-extrabold text-[#0D2235]">
              {projectTitle}
            </h3>
            {category ? (
              <p className="text-[14px] font-bold text-[#0D2235]">{category}</p>
            ) : null}
          </div>
        </div>
      </Link>
    );
  });

  return (
    <>
      <section
        className="bg-[#138A56] py-16 md:py-20"
        style={getAccentStyle(accent)}
        data-editor-fields="accentColor pretitle title projectItems"
      >
        <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
          {layout === "grid" ? (
            <>
              <div className="mb-10">{heading}</div>
              <div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
                data-editor-no-inline
              >
                {projectCards}
              </div>
            </>
          ) : (
            <CleaningSlider
              showArrows
              arrowTone="light"
              itemClassName="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              header={heading}
            >
              {projectCards}
            </CleaningSlider>
          )}
        </div>
      </section>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

(
  CleaningProduct1 as typeof CleaningProduct1 & {
    editorFields: readonly string[];
  }
).editorFields = ["accentColor", "pretitle", "title", "projectItems"];

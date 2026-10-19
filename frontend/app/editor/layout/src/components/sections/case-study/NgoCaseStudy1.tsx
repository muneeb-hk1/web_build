"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";
import { site, type NGOCaseStudyPageData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

const FALLBACK_IMAGE =
  "/categories/ngo/template1/happy-diverse-kinds-park.jpg";

/** Matches the 3-column card grid on desktop. */
const ITEMS_PER_PAGE = 3;

const renderIcon = (iconName: string, className = "w-10 h-10") => {
  const color =
    iconName?.toLowerCase() === "water"
      ? "text-[#2563eb]"
      : iconName?.toLowerCase() === "food" ||
          iconName?.toLowerCase() === "nutrition"
        ? "text-[#16a34a]"
        : iconName?.toLowerCase() === "treatment" ||
            iconName?.toLowerCase() === "medical" ||
            iconName?.toLowerCase() === "health"
          ? "text-[#f97316]"
          : "text-[#ff5a36]";
  return <EditableNgoIcon name={iconName} className={`${className} ${color}`} />;
};

const getIconBg = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "water":
      return "bg-blue-50 border-blue-100";
    case "treatment":
    case "medical":
    case "health":
      return "bg-orange-50 border-orange-100";
    case "food":
    case "nutrition":
      return "bg-emerald-50 border-emerald-100";
    default:
      return "bg-orange-50 border-orange-100";
  }
};

const getBtnStyle = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "water":
      return "border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]";
    case "treatment":
    case "medical":
    case "health":
      return "border-[#ff5a36] text-[#ff5a36] hover:bg-[#ff5a36]";
    case "food":
    case "nutrition":
      return "border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a]";
    default:
      return "border-[#ff5a36] text-[#ff5a36] hover:bg-[#ff5a36]";
  }
};

const OLD_CASE_STUDY_SEED_TITLES = [
  "Water for All Children",
  "Help for Treatment",
  "Provide Healthy Food",
];

const resolveCaseStudyItems = (customItems: unknown, seedItems: unknown[]) => {
  const seed = Array.isArray(seedItems) ? seedItems : [];
  if (!Array.isArray(customItems)) return seed;
  const looksLikeOldSeed =
    customItems.length === OLD_CASE_STUDY_SEED_TITLES.length &&
    seed.length > OLD_CASE_STUDY_SEED_TITLES.length &&
    customItems.every(
      (item, index) =>
        String((item as { title?: string } | undefined)?.title || "").trim() ===
        OLD_CASE_STUDY_SEED_TITLES[index],
    );
  return looksLikeOldSeed ? seed : customItems;
};

export default function NgoCaseStudy1({ data: customData }: SectionProps) {
  const custom = customData as unknown as Partial<NGOCaseStudyPageData> | undefined;
  const seedItems = site.caseStudyPage?.causes?.items ?? [];
  const items = resolveCaseStudyItems(custom?.causes?.items, seedItems);
  const data = {
    ...site.caseStudyPage,
    ...custom,
    banner: { ...site.caseStudyPage.banner, ...custom?.banner },
    causes: {
      ...site.caseStudyPage.causes,
      ...custom?.causes,
      items,
      footerBanner: {
        ...site.caseStudyPage.causes.footerBanner,
        ...custom?.causes?.footerBanner,
      },
    },
  };

  const { causes } = data;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const currentItems = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [items, safePage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="w-full bg-white font-sans antialiased">
      {causes && (
        <section
          data-editor-section-label="Case Studies"
          data-editor-fields="causes"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
        >
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
              <EditableNgoIcon
                name={(causes as { icon?: string } | undefined)?.icon || "hand-heart"}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{causes.pretitle}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight max-w-2xl mx-auto mb-3">
              {causes.title}
            </h2>
            <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto" />
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed pt-2">
              {causes.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
            {currentItems.map((item: {
              id?: string | number;
              title?: string;
              description?: string;
              imageUrl?: string;
              label?: string;
              href?: string;
              iconName?: string;
              icon?: string;
            }, index: number) => {
              const causeIcon = item.iconName || item.icon || "water";
              const bgTheme = getIconBg(causeIcon);
              const btnTheme = getBtnStyle(causeIcon);
              const itemKey = item.id ?? `${safePage}-${index}-${item.title || "cause"}`;

              return (
                <div
                  key={itemKey}
                  data-editor-item-type="CaseStudyCause"
                  data-editor-item-label={item.title || "Cause"}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center justify-between group"
                >
                  <div className="w-full flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-full border-2 ${bgTheme} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105`}
                    >
                      {renderIcon(causeIcon)}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold hover:text-orange-500 text-[#1a0c2e] mb-3">
                      <Link
                        href={item.href || "/donate"}
                        data-editor-keep-click="true"
                        data-editor-nav="true"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-8 shadow-xs">
                      <Image
                        src={item.imageUrl || FALLBACK_IMAGE}
                        alt={item.title || "Case study"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-editor-media
                        data-editor-media-type="image"
                        data-editor-media-src={item.imageUrl || FALLBACK_IMAGE}
                      />
                    </div>
                  </div>

                  <Link
                    href={item.href || "/donate"}
                    data-editor-keep-click="true"
                    data-editor-nav="true"
                    className={`inline-flex items-center justify-center gap-2 border-2 px-8 py-3 rounded-full font-extrabold text-sm tracking-wider uppercase transition-all duration-300 hover:text-white hover:shadow-md ${btnTheme}`}
                  >
                    <span>{item.label}</span>
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ff5500] hover:text-[#ff5500] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    safePage === page
                      ? "bg-[#ff5500] text-white shadow-md scale-105"
                      : "border border-gray-200 cursor-pointer text-gray-700 hover:border-[#ff5500] hover:text-[#ff5500]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ff5500] hover:text-[#ff5500] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {causes.footerBanner && (
            <div className="mt-16 py-4 w-full min-h-[92px] sm:min-h-[104px] bg-[#f4f9f6] border border-[#e5eee9] rounded-[14px] px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-0">
              <div className="flex items-center justify-center shrink-0 sm:w-[80px] lg:w-[95px]">
                <svg width="58" height="52" viewBox="0 0 58 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29 23.5L27.9 22.4C22.5 17.1 17.8 13.1 17.8 8.8C17.8 5.2 20.7 2.2 24.3 2.2C26.4 2.2 28.3 3.2 29 4.8C29.7 3.2 31.6 2.2 33.7 2.2C37.3 2.2 40.2 5.2 40.2 8.8C40.2 13.1 35.5 17.1 30.1 22.4L29 23.5Z" stroke="#159447" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 28.5C12 28.5 16.5 28.5 20.2 32.7C23.3 36.2 26.7 39 29 39C31.3 39 34.7 36.2 37.8 32.7C41.5 28.5 46 28.5 46 28.5" stroke="#159447" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 34C18.5 38.5 22.8 42.5 29 42.5C35.2 42.5 39.5 38.5 42 34" stroke="#159447" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M25 36H33" stroke="#159447" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="hidden sm:block w-px h-[50px] bg-[#aeb8b3] shrink-0" />

              <div className="flex-1 min-w-0 px-0 sm:px-5 lg:px-8 text-center sm:text-left">
                <p className="text-[16px] sm:text-[17px] lg:text-[19px] leading-[1.35] font-bold text-[#171b22] max-w-[430px]">
                  {causes.footerBanner.text}
                </p>
              </div>

              <div className="flex-1 sm:flex-none sm:w-[36%] lg:w-[35%] flex flex-col items-center justify-center text-center px-2 sm:px-3 lg:px-5 min-w-0">
                <p
                  className="text-[#159447] text-[21px] sm:text-[22px] lg:text-[30px] font-semibold italic leading-tight break-words max-w-full"
                  style={{ fontFamily: "cursive" }}
                >
                  {causes.footerBanner.tagline}
                </p>
                <div className="mt-2 w-[70px] sm:w-[80px] lg:w-[90px] h-[2px] bg-[#159447] rounded-full" />
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

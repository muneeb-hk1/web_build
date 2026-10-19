"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";
import { handleManagerCardClick } from "../../../lib/editorManagerCards";

type ProjectCard = {
  category?: string;
  title?: string;
  description?: string;
  image?: { src?: string; alt?: string } | string;
  button?: { label?: string; href?: string };
  icon?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getProjectIcon = (icon?: string) =>
  renderNgoIcon(icon || "heart", "text-xl text-white");

const HandDrawnHeart = ({
  className = "w-24 h-24",
  color = "#FFD5CE",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 33 78 C 50 63 85 49 85 38 C 85 27 70 23 60 32 C 55 36 53 41 53 41 C 53 41 50 33 46 29 C 40 23 27 25 27 38 C 27 52 50 72 75 85"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SupportHeartIcon = () => (
  <svg
    className="h-16 w-16 text-[#E52E04] md:h-28 md:w-28"
    viewBox="0 0 64 64"
    fill="currentColor"
    aria-hidden
  >
    <path d="M32 26.8 C27.5 20.8, 17 21.8, 17 29.5 C17 35.8, 26 41.8, 32 46.5 C38 41.8, 47 35.8, 47 29.5 C47 21.8, 36.5 20.8, 32 26.8 Z" />
    <path d="M20 48.5 C20 46.5, 22 45, 24.5 45 L38 45 C41.5 45, 45 42.5, 48 40 C49.2 39, 51 40.5, 50 42 C46.5 47, 41 51, 35 51 L24.5 51 C22 51, 20 49.8, 20 48.5 Z" />
    <path d="M19 46.5 L14 43.5 C12.8 42.8, 12 43.8, 13 45 C15.5 48.5, 18 51, 22 51 L20 48.5 Z" />
  </svg>
);

const VineDecorLeft = () => (
  <div className="pointer-events-none absolute bottom-0 left-0 top-0 h-full w-24 text-orange-200/50 sm:w-32">
    <svg
      className="h-full w-full"
      viewBox="0 0 100 160"
      fill="currentColor"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M 10 160 Q 30 90 20 0"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path d="M 12 140 C -10 135 -10 115 15 122 C 20 128 15 138 12 140 Z" />
      <path d="M 17 125 C 45 110 40 135 20 138 C 17 132 17 127 17 125 Z" />
      <path d="M 18 100 C -5 90 -2 72 22 84 C 23 92 20 98 18 100 Z" />
      <path d="M 22 85 C 50 68 48 95 25 98 C 22 92 22 87 22 85 Z" />
      <path d="M 21 60 C 0 48 5 32 24 45 C 24 52 22 58 21 60 Z" />
      <path d="M 23 48 C 48 32 45 55 25 58 C 23 53 23 50 23 48 Z" />
      <path d="M 21 25 C 8 12 12 0 22 10 C 22 18 21 22 21 25 Z" />
      <path d="M 20 10 C 32 0 28 18 18 22 C 18 16 19 12 20 10 Z" />
    </svg>
  </div>
);

const VineDecorRight = () => (
  <div className="pointer-events-none absolute bottom-0 right-0 top-0 h-full w-24 text-orange-200/50 sm:w-32">
    <svg
      className="h-full w-full"
      viewBox="0 0 100 160"
      fill="currentColor"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M 90 160 Q 70 90 80 0"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path d="M 88 140 C 110 135 110 115 85 122 C 80 128 85 138 88 140 Z" />
      <path d="M 83 125 C 55 110 60 135 80 138 C 83 132 83 127 83 125 Z" />
      <path d="M 82 100 C 105 90 102 72 78 84 C 77 92 80 98 82 100 Z" />
      <path d="M 78 85 C 50 68 52 95 75 98 C 78 92 78 87 78 85 Z" />
      <path d="M 79 60 C 100 48 95 32 76 45 C 76 52 78 58 79 60 Z" />
      <path d="M 77 48 C 52 32 55 55 75 58 C 77 53 77 50 77 48 Z" />
      <path d="M 79 25 C 92 12 88 0 78 10 C 78 18 79 22 79 25 Z" />
      <path d="M 80 10 C 68 0 72 18 82 22 C 82 16 81 12 80 10 Z" />
    </svg>
  </div>
);

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  if (typeof value.title === "string") return value.title;
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOProjects2({
  data = {},
  editorMode,
}: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Our Projects");
  const title = toTitleText(data.title) || toTitleText(data.heading);
  const description =
    typeof data.desc === "string"
      ? data.desc
      : typeof data.description === "string"
        ? data.description
        : undefined;
  const items = (Array.isArray(data.items) ? data.items : []) as ProjectCard[];
  const exploreButton = isRecord(data.exploreButton)
    ? (data.exploreButton as { label?: string; href?: string })
    : undefined;
  const cta = isRecord(data.cta)
    ? (data.cta as {
        icon?: string;
        title?: string;
        description?: string;
        button?: { label?: string; href?: string };
      })
    : undefined;
  const hideExploreEditor = data.hideExploreControls === true;
  // Live theme: 4 project cards + separate support banner (no explore strip).
  const showExplore =
    !hideExploreEditor &&
    !cta &&
    data.showExploreButton !== false;
  const boxesPerRow =
    collectionBoxesPerRow(data, "items") ?? sectionWrapperBoxesPerRow(data);
  const visibleItems =
    cta || boxesPerRow || !showExplore ? items : items.slice(0, 3);
  const useFourCol = visibleItems.length >= 4;
  // Support CTA is a sibling block (own editor plate) — not part of Projects fields.
  const editorFields = hideExploreEditor
    ? "pretitle title desc items"
    : "pretitle title desc items exploreButton showExploreButton";

  return (
    <>
    <section
      data-editor-section-label="Projects"
      data-editor-fields={editorFields}
      data-editor-card-fields="image icon category title description button"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : useFourCol
            ? 4
            : undefined
      }
      className="relative overflow-hidden bg-[#fafafa] px-0 pt-8 font-sans md:pt-12"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-orange-100/40 blur-[120px]" />
      <div className="pointer-events-none absolute -left-15 -top-15 rounded-full bg-orange-200 sm:h-32 sm:w-32" />
      <div className="pointer-events-none absolute left-0 top-5 grid grid-cols-6 gap-1.5 opacity-20 md:left-6 md:top-28">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-5 grid grid-cols-6 gap-1.5 opacity-20 md:right-6 md:top-28">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>
      <div className="absolute right-5 top-10 rotate-6 md:right-60 md:top-40">
        <HandDrawnHeart />
      </div>

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 pt-1 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          {title ? (
            <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div
          data-editor-no-inline="true"
          data-box-layout-grid="grid"
          className={`mt-4 grid grid-cols-1 gap-6 md:mt-12 sm:grid-cols-2 ${
            useFourCol ? "xl:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {visibleItems.map((item, index) => {
            const isPurple = index === 1 || index === 3;
            const primaryTextColor = isPurple
              ? "text-[#5B3CC4]"
              : "text-[#FF4500]";
            const circleBgColor = isPurple ? "bg-[#5B3CC4]" : "bg-[#FF4500]";
            const imgSrc =
              typeof item.image === "string"
                ? item.image
                : item.image?.src ?? "";
            const imgAlt =
              typeof item.image === "string"
                ? item.title ?? "Project"
                : item.image?.alt ?? item.title ?? "Project";

            return (
              <div
                key={`${item.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized={isUnoptimizedImageSrc(imgSrc)}
                    />
                  ) : null}
                  <div
                    className={`absolute bottom-0 left-0 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${circleBgColor}`}
                  >
                    {getProjectIcon(item.icon)}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${primaryTextColor}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="mt-0 text-base font-bold text-slate-900 transition-colors group-hover:text-[#FF4500]">
                      <Link
                        href={item.button?.href || "/project-detail"}
                        onClick={(event) =>
                          handleManagerCardClick(event, editorMode, "Portfolio", {
                            title: item.title,
                            href: item.button?.href || "/project-detail",
                          })
                        }
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-800">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-0 pt-2">
                    <Link
                      href={item.button?.href || "/project-detail"}
                      onClick={(event) =>
                        handleManagerCardClick(event, editorMode, "Portfolio", {
                          title: item.title,
                          href: item.button?.href || "/project-detail",
                        })
                      }
                      className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5 ${primaryTextColor}`}
                    >
                      <span>{item.button?.label || "Learn More"}</span>
                      <FiArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showExplore && exploreButton?.label ? (
          <div className="mb-12 mt-4 flex justify-center">
            <Link
              href={exploreButton.href || "#"}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <span>{exploreButton.label}</span>
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className={cta?.title ? "pb-4 md:pb-6" : "pb-10 md:pb-14"} />
        )}
      </div>
    </section>

    {cta?.title ? (
      <section
        data-editor-section-label="Support CTA"
        data-editor-fields="cta"
        className="relative bg-[#fafafa] px-4 pb-10 pt-2 font-sans sm:px-6 md:pb-14 md:pt-4 lg:px-8"
      >
        <div className="relative mx-auto overflow-hidden rounded-2xl bg-[#fdf4f0] px-0 py-2 shadow-sm md:px-6 md:py-8 sm:px-10 lg:px-20">
          <VineDecorLeft />
          <VineDecorRight />
          <div className="relative z-10 flex flex-col items-center justify-between gap-2 md:gap-6 sm:flex-row">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-100/70 p-2 ring-8 ring-orange-100/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-50/30 p-1.5 shadow-sm md:h-28 md:w-28">
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-white shadow-inner">
                    <SupportHeartIcon />
                  </div>
                </div>
              </div>
              <div className="md:ml-5">
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  {cta.title}
                </h3>
                {cta.description ? (
                  <p className="mt-1 max-w-md text-sm text-slate-600">
                    {cta.description}
                  </p>
                ) : null}
              </div>
            </div>
            <Link
              href={cta.button?.href || "/donate"}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF4500] px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#e03d00] hover:shadow-lg"
            >
              <span>{cta.button?.label || "Donate Now"}</span>
              <FiArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>
    ) : null}
    </>
  );
}

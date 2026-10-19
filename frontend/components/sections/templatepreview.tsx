"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, CheckCircle2, ChevronDown, Eye, Search, X } from "lucide-react";
import EditorPreviewModal from "@/app/editor/components/EditorPreviewModal";
import EditorLoadingScreen from "@/app/editor/components/EditorLoadingScreen";
import {
  buildTemplateCardPreviewUrl,
  buildTemplateComposePreviewUrl,
  getTemplatePages,
  getTemplatesForCategory,
  hasCategoryContent,
  type BuilderTemplate,
} from "@/app/editor/layout/src/data/templateFlow";

function getTemplatePageCount(template: BuilderTemplate) {
  if (template.type !== "Multiple Pages Website") return 1;
  const variants = template.sectionVariants || {};
  const innerPages = getTemplatePages(template).filter(
    (page) => variants[page.sectionType],
  );
  const listed = 1 + innerPages.length;
  const prebuilt = Number(template.prebuilt_pages) || 0;
  return Math.max(listed, prebuilt, 1);
}

type PlanRange = "1-25" | "1-50" | "1-100" | "1-125";

const PLAN_MAX_PAGES: Record<PlanRange, number> = {
  "1-25": 25,
  "1-50": 50,
  "1-100": 100,
  "1-125": 125,
};

/**
 * Show a plan only when a category theme falls in that tier's page band.
 * Starter 1–25 · Professional 26–50 · Business 51–100 · Enterprise 101–125
 */
function planHasFittingTheme(range: PlanRange, multiPageCounts: number[]) {
  if (range === "1-25") {
    return multiPageCounts.some((count) => count <= 25);
  }
  if (range === "1-50") {
    return multiPageCounts.some((count) => count > 25 && count <= 50);
  }
  if (range === "1-100") {
    return multiPageCounts.some((count) => count > 50 && count <= 100);
  }
  return multiPageCounts.some((count) => count > 100 && count <= 125);
}

/** Normalize saved pageRange (legacy `1-8` → Starter `1-25`). */
function normalizePlanRange(range?: string | null): PlanRange | "" {
  if (!range) return "";
  if (range === "1-8") return "1-25";
  if (
    range === "1-25" ||
    range === "1-50" ||
    range === "1-100" ||
    range === "1-125"
  ) {
    return range;
  }
  return "";
}

const ALL_PLANS = [
  { name: "Starter", price: "$8", range: "1-25" as const, pages: "1 – 25 pages", note: "Paid plan · themes up to 25 pages", pagesBadge: "bg-[#f3f8ff] text-[#3b6fd8]", nameBadge: "bg-[#e7f0ff] text-[#2451c7]" },
  { name: "Professional", price: "$18", range: "1-50" as const, pages: "1 – 50 pages", note: "Paid plan · themes up to 50 pages", pagesBadge: "bg-[#f4fbff] text-[#3d7ea6]", nameBadge: "bg-[#e8f6fd] text-[#1d6f97]" },
  { name: "Business", price: "$48", range: "1-100" as const, pages: "1 – 100 pages", note: "Paid plan · themes up to 100 pages", pagesBadge: "bg-[#f7f5ff] text-[#6d5bd0]", nameBadge: "bg-[#efeaff] text-[#5b45b8]" },
  { name: "Enterprise", price: "$98", range: "1-125" as const, pages: "1 – 125 pages", note: "Paid plan · themes up to 125 pages", pagesBadge: "bg-[#f4f6ff] text-[#4f5fbe]", nameBadge: "bg-[#ecefff] text-[#4454b0]" },
];

type TemplatePreviewProps = {
  selectedCategory: string;
  selectedTemplateId: string | null;
  onTemplateSelect: (templateId: string | null) => void;
  showMonitor: boolean;
  onShowMonitorChange: (open: boolean) => void;
  businessName?: string;
  /** single-page | multi-page — filters themes by template type */
  pageType?: "" | "multi-page" | "single-page";
  pageRange?: "" | PlanRange | "1-8";
  onPageRangeChange?: (range: PlanRange) => void;
  websiteRelated?: string;
  /** Opens editor with the viewed theme (from View preview CTA). */
  onOpenEditorWithTheme?: (templateId: string) => void;
  openingEditor?: boolean;
};

function matchesPageType(
  template: BuilderTemplate,
  pageType?: "" | "multi-page" | "single-page",
) {
  if (!pageType) return true;
  if (pageType === "single-page") {
    return template.type === "Single Page Website";
  }
  if (pageType === "multi-page") {
    return template.type === "Multiple Pages Website";
  }
  return true;
}

function TemplateCardIframePreview({
  previewUrl,
  fallbackImage,
  title,
}: {
  previewUrl: string | null;
  fallbackImage: string;
  title: string;
}) {
  const [previewReady, setPreviewReady] = useState(!previewUrl);

  useEffect(() => {
    if (!previewUrl) {
      setPreviewReady(true);
      return;
    }

    setPreviewReady(false);

    const expectedSrc = (() => {
      try {
        const url = new URL(previewUrl, window.location.origin);
        return `${url.pathname}${url.search}`;
      } catch {
        return previewUrl;
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "ai-builder-compose-preview-ready") return;
      if (event.data?.src !== expectedSrc) return;
      setPreviewReady(true);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [previewUrl]);

  return (
    <div className="relative overflow-hidden rounded-[14px] bg-slate-100 ring-1 ring-black/5">
      <div className="flex h-7 items-center gap-1.5 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50 px-3">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 h-3.5 flex-1 rounded-full bg-slate-100/90" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {previewUrl ? (
          <>
            {!previewReady ? <EditorLoadingScreen variant="card" /> : null}
            <iframe
              key={previewUrl}
              src={previewUrl}
              title={`${title} live preview`}
              loading="lazy"
              tabIndex={-1}
              onLoad={() => setPreviewReady(true)}
              className={`pointer-events-none absolute left-0 top-0 border-0 bg-white transition-opacity duration-300 ${
                previewReady ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: "400%",
                height: "400%",
                transform: "scale(0.25)",
                transformOrigin: "top left",
              }}
            />
          </>
        ) : (
          <Image
            src={fallbackImage}
            alt={title}
            width={480}
            height={260}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

export default function Templatepreview({
  selectedCategory,
  selectedTemplateId,
  onTemplateSelect,
  onShowMonitorChange,
  pageType,
  pageRange,
  onPageRangeChange,
  websiteRelated = "",
  onOpenEditorWithTheme,
  openingEditor = false,
}: TemplatePreviewProps) {
  const [search, setSearch] = useState("");
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [viewTemplateId, setViewTemplateId] = useState<string | null>(null);
  const [previewReloadKey, setPreviewReloadKey] = useState(0);

  const activeRange = normalizePlanRange(pageRange);

  const multiPageCounts = useMemo(() => {
    return getTemplatesForCategory(selectedCategory, websiteRelated)
      .filter((t) => t.type === "Multiple Pages Website")
      .map((t) => getTemplatePageCount(t));
  }, [selectedCategory, websiteRelated]);

  const plans = useMemo(() => {
    // No multi-page themes → keep Starter only (single-page flow).
    if (!multiPageCounts.length) {
      return ALL_PLANS.filter((plan) => plan.range === "1-25");
    }
    return ALL_PLANS.filter((plan) =>
      planHasFittingTheme(plan.range, multiPageCounts),
    );
  }, [multiPageCounts]);

  const activePlan =
    plans.find((plan) => plan.range === activeRange) || plans[0];

  const planPageCap = activePlan
    ? PLAN_MAX_PAGES[activePlan.range]
    : PLAN_MAX_PAGES["1-25"];

  const availableTemplates = useMemo(() => {
    if (!selectedCategory) return [];
    return getTemplatesForCategory(selectedCategory, websiteRelated).filter(
      (template) => {
        if (!matchesPageType(template, pageType)) return false;
        // Single-page themes always fit every plan.
        if (template.type === "Single Page Website") return true;
        // Multi-page: only themes within selected plan's page cap.
        return getTemplatePageCount(template) <= planPageCap;
      },
    );
  }, [pageType, selectedCategory, websiteRelated, planPageCap]);

  // Clamp selected plan when category themes don't support it.
  useEffect(() => {
    if (!plans.length || !onPageRangeChange) return;
    if (activeRange && plans.some((p) => p.range === activeRange)) return;
    onPageRangeChange(plans[0]?.range || "1-25");
  }, [plans, activeRange, onPageRangeChange]);

  useEffect(() => {
    if (!selectedTemplateId) return;
    const stillValid = availableTemplates.some(
      (template) => template.id === selectedTemplateId,
    );
    if (!stillValid) {
      onTemplateSelect(null);
      onShowMonitorChange(false);
    }
  }, [
    availableTemplates,
    onShowMonitorChange,
    onTemplateSelect,
    selectedTemplateId,
  ]);

  const viewTemplate = useMemo(
    () =>
      viewTemplateId
        ? (availableTemplates.find((item) => item.id === viewTemplateId) ??
          null)
        : null,
    [availableTemplates, viewTemplateId],
  );

  const viewPreviewUrl = useMemo(() => {
    if (!viewTemplate) return null;
    return buildTemplateComposePreviewUrl(viewTemplate, selectedCategory);
  }, [viewTemplate, selectedCategory, previewReloadKey]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = viewTemplateId ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [viewTemplateId]);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return availableTemplates.filter((item) => {
      const matchesSearch =
        !query ||
        `${selectedCategory} ${item.title}`.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        selectedCategory.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [availableTemplates, search, selectedCategory]);

  const pageTypeLabel =
    pageType === "multi-page"
      ? "multi-page"
      : pageType === "single-page"
        ? "single-page"
        : "";

  const clearSearch = () => {
    setSearch("");
  };

  const openViewPreview = (template: BuilderTemplate) => {
    setViewTemplateId(template.id);
  };

  const closeViewPreview = () => {
    setViewTemplateId(null);
  };

  const handleUseTemplate = (template: BuilderTemplate) => {
    if (onOpenEditorWithTheme) {
      onOpenEditorWithTheme(template.id);
      return;
    }
    onTemplateSelect(template.id);
    onShowMonitorChange(true);
  };

  return (
    <div className="w-full">
      <section className="onboarding-responsive-scroll relative mx-auto max-h-[calc(100dvh-156px)] w-full overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(23,38,76,.08)] lg:max-h-none lg:overflow-visible">
        <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6 2xl:px-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[28px] font-bold tracking-[-.03em] text-[#12142b]">
                Choose a theme
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pick a design for your {selectedCategory || "website"} website. You can change it anytime.
              </p>
            </div>
            <div className="flex w-full items-center gap-2 xl:w-[280px]">
              <div className="relative shrink-0 xl:hidden">
                <button
                  type="button"
                  onClick={() => setPlanMenuOpen((open) => !open)}
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#12142b]"
                >
                  {activePlan.name}
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {planMenuOpen ? (
                  <ul className="absolute left-0 top-[calc(100%+6px)] z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    {plans.map((plan) => {
                      const selected = plan.range === activePlan.range;
                      return (
                        <li key={plan.range}>
                          <button
                            type="button"
                            onClick={() => {
                              onPageRangeChange?.(plan.range);
                              setPlanMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-medium ${
                              selected ? "bg-[#f4f6ff] text-[#3a46b5]" : "text-[#12142b] hover:bg-slate-50"
                            }`}
                          >
                            {plan.name}
                            {selected ? <Check size={14} strokeWidth={2.5} /> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} strokeWidth={2.2} />
              </span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                type="text"
                placeholder="Search theme by name and category"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-[#08132f] outline-none transition placeholder:text-slate-400 focus:border-[#315ff4] focus:ring-4 focus:ring-blue-100/70"
              />
              {search ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#315ff4]"
                  aria-label="Clear search"
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              ) : null}
            </div>
            </div>
          </div>

          <div
            className={`mt-4 grid gap-3 overflow-visible px-3 pt-3 ${
              plans.length >= 4
                ? "xl:grid-cols-4"
                : plans.length === 3
                  ? "xl:grid-cols-3"
                  : plans.length === 2
                    ? "xl:grid-cols-2"
                    : "xl:grid-cols-1"
            }`}
          >
            {plans.map((plan) => {
              const active = activeRange
                ? plan.range === activeRange
                : plan.range === (plans[0]?.range || "1-25");
              return (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => onPageRangeChange?.(plan.range)}
                  className={`relative overflow-visible rounded-2xl border px-4 py-4 text-left ${
                    active ? "" : "hidden xl:block"
                  } ${
                    active
                      ? "border-[#315ff4] bg-[#eef3ff] shadow-[0_8px_22px_rgba(49,95,244,0.18)] ring-2 ring-[#315ff4]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {active ? (
                    <span className="absolute -right-2 -top-2 z-10 grid size-6 place-items-center rounded-full bg-[#315ff4] text-white shadow-md ring-2 ring-white">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : null}
                  <span className="absolute right-3 top-2.5 inline-flex items-center gap-1.5">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold leading-none ${plan.pagesBadge}`}>
                      {plan.pages}
                    </span>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold leading-none ${plan.nameBadge}`}>
                      {plan.name}
                    </span>
                  </span>
                  <p className="pr-[11.5rem] text-[22px] font-bold leading-none text-[#12142b]">
                    {plan.price}
                    <span className="text-[13px] font-medium text-slate-400">/ month</span>
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">{plan.note}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex-1 px-0.5">
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {filteredTemplates.map((item) => {
                const isActive = selectedTemplateId === item.id;
                const cardPreviewUrl = buildTemplateCardPreviewUrl(
                  item,
                  selectedCategory,
                  3,
                );
                const sectionCount = Object.keys(
                  item.sectionVariants || {},
                ).length;
                const pageCount = getTemplatePageCount(item);

                return (
                  <article
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${
                      isActive
                        ? "border-[#315ff4] shadow-[0_14px_36px_rgba(49,95,244,0.18)] ring-2 ring-[#315ff4]/25"
                        : "border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <div className="relative p-2.5 pb-0">
                      <div className="relative">
                      <TemplateCardIframePreview
                        previewUrl={cardPreviewUrl}
                        fallbackImage={
                          item.previewimage || item.image || "/haelli.png"
                        }
                        title={item.title}
                      />
                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-[14px]">
                        <div className="absolute inset-0 bg-[#08132f]/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="pointer-events-auto relative flex translate-y-2 items-center gap-1.5 rounded-2xl border border-white/50 bg-white/25 p-1.5 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openViewPreview(item);
                            }}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[12px] font-semibold text-[#08132f]"
                          >
                            <Eye size={15} />
                            View
                          </button>
                          <button
                            type="button"
                            disabled={openingEditor}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleUseTemplate(item);
                            }}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#315ff4] px-4 text-[12px] font-semibold text-white disabled:opacity-70"
                          >
                            <CheckCircle2 size={15} />
                            Use theme
                          </button>
                        </div>
                      </div>
                      </div>

                      {isActive ? (
                        <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-[#315ff4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                          <Check size={11} strokeWidth={3} />
                          Selected
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-2 px-4 pb-3 pt-2.5">
                      <div>
                        <h3 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#08132f]">
                          {item.title}
                        </h3>
                        <p className="mt-1 truncate text-[11px] font-medium text-slate-500">
                          {item.type}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200/80">
                          {sectionCount} sections
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200/80">
                          {pageCount} {pageCount === 1 ? "page" : "pages"}
                        </span>
                      </div>

                      <div className="pt-1">
                        <span className="inline-flex items-center rounded-md bg-[#08132f] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                          {selectedCategory}
                        </span>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200/80">
                  <Search size={24} strokeWidth={1.8} />
                </span>
                <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#08132f]">
                  {search.trim()
                    ? "No themes match your search"
                    : "No Theme Available"}
                </p>
                <p className="mt-1.5 max-w-md text-sm text-slate-500">
                  {search.trim()
                    ? `Nothing matched “${search.trim()}”. Try another name or clear the search.`
                    : selectedCategory && !hasCategoryContent(selectedCategory)
                      ? "No themes found for this category."
                      : activePlan
                        ? `No themes for ${selectedCategory || "this category"} under ${activePlan.name} (${activePlan.pages}). Try another plan or category.`
                        : pageType
                          ? `No ${pageTypeLabel} themes for ${selectedCategory}. Go back and try another site type or category.`
                          : "Try a different plan or category."}
                </p>
                {search.trim() ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#08132f] px-4 text-sm font-semibold text-white transition hover:bg-[#315ff4]"
                  >
                    <X size={15} />
                    Clear search
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      <EditorPreviewModal
        open={Boolean(viewTemplateId)}
        src={viewPreviewUrl || ""}
        loading={false}
        error={
          viewTemplateId && !viewPreviewUrl ? "Preview unavailable" : ""
        }
        onClose={closeViewPreview}
        onRetry={() => setPreviewReloadKey((key) => key + 1)}
        onUseTheme={
          viewTemplate && onOpenEditorWithTheme
            ? () => onOpenEditorWithTheme(viewTemplate.id)
            : undefined
        }
        useThemeLoading={openingEditor}
      />
    </div>
  );
}

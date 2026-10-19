"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Ban,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flower2,
  GraduationCap,
  Heart,
  Home,
  Image as ImageIcon,
  ImagePlus,
  Images,
  LayoutGrid,
  Loader2,
  Search,
  Smartphone,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { ONBOARDING_MIN_DESCRIPTION_LENGTH, isValidOnboardingEmail, isValidOnboardingPhone, type OnboardingWebsiteRelated } from "@/lib/onboardingDraft";
import { compressLogoFile } from "@/lib/applyOnboardingLogo";
import {
  getCategoriesForOnboarding,
  getTemplatePages,
  getTemplatesForCategory,
} from "@/app/editor/layout/src/data/templateFlow";

const PAGE_RANGE_OPTIONS = [
  { id: "1-25" as const, label: "1 – 25 pages", hint: "Starter ($8) — paid plan, themes up to 25 pages", max: 25 },
  { id: "1-50" as const, label: "1 – 50 pages", hint: "Professional — themes up to 50 pages", max: 50 },
  { id: "1-100" as const, label: "1 – 100 pages", hint: "Business — themes up to 100 pages", max: 100 },
  { id: "1-125" as const, label: "1 – 125 pages", hint: "Enterprise — themes up to 125 pages", max: 125 },
];

/** Page counts for multi-page themes in a category. */
function multiPageCountsForCategory(category: string): number[] {
  if (!category?.trim()) return [];
  return getTemplatesForCategory(category)
    .filter((t) => t.type === "Multiple Pages Website")
    .map((t) => {
      const listed = getTemplatePages(t).length;
      const prebuilt = Number(t.prebuilt_pages) || 0;
      return Math.max(listed, prebuilt, 1);
    });
}

/**
 * Show a plan band only when a theme falls in that range.
 * Starter 1–25 · Professional 26–50 · Business 51–100 · Enterprise 101–125
 */
function pageRangesForThemeCounts(counts: number[]) {
  if (!counts.length) return [];
  return PAGE_RANGE_OPTIONS.filter((opt) => {
    if (opt.id === "1-25") return counts.some((c) => c <= 25);
    if (opt.id === "1-50") return counts.some((c) => c > 25 && c <= 50);
    if (opt.id === "1-100") return counts.some((c) => c > 50 && c <= 100);
    return counts.some((c) => c > 100 && c <= 125);
  });
}

function categoryThemeAvailability(category: string) {
  const templates = category?.trim()
    ? getTemplatesForCategory(category)
    : [];
  const hasMulti = templates.some((t) => t.type === "Multiple Pages Website");
  const hasSingle = templates.some((t) => t.type === "Single Page Website");
  return {
    hasMulti,
    hasSingle,
    hasAny: hasMulti || hasSingle,
  };
}

type Category = "clients" | "myself" | "company";

type BusinessInfo = {
  audience: "" | Category;
  name: string;
  description: string;
  descriptionGenerated?: boolean;
  websiteRelated: OnboardingWebsiteRelated;
  pageType: "" | "multi-page" | "single-page";
  pageRange?: "" | "1-25" | "1-50" | "1-100" | "1-125" | "1-8";
  email: string;
  mobile: string;
  address: string;
  includeDetails: boolean;
  hasLogo: "" | "yes" | "no";
  logoName: string;
  logoImage?: string;
};

type CategoryStepProps = {
  value: BusinessInfo;
  showErrors: boolean;
  onChange: (value: BusinessInfo) => void;
  /** Which create path the user picked before this form. */
  createPath?: "create-ai" | "create-custom" | "";
  /** Lets the page add scroll room only while a menu is open. */
  onMenuOpen?: (open: boolean) => void;
};

export const MIN_DESCRIPTION_LENGTH = ONBOARDING_MIN_DESCRIPTION_LENGTH;

const categories = [
  {
    id: "company",
    title: "My Company",
    subtitle: "Business",
    icon: Briefcase,
    labels: {
      name: "Business Name",
      desc: "Business Description",
      namePlaceholder: "Enter your business name",
      descPlaceholder: "Tell us what your business does...",
    },
    image: "/onboarding-company.png",
  },
  {
    id: "clients",
    title: "Clients",
    subtitle: "Agency",
    icon: Users,
    labels: {
      name: "Website Name",
      desc: "Description",
      namePlaceholder: "Enter client name",
      descPlaceholder: "Tell us about agency...",
    },
    image: "/onboarding-clients.png",
  },
  {
    id: "myself",
    title: "Myself",
    subtitle: "Individual",
    icon: User,
    labels: {
      name: "Website Name",
      desc: "Description",
      namePlaceholder: "Enter your website name",
      descPlaceholder: "Tell us about your brand...",
    },
    image: "/onboarding-myself.png",
  },
] as const;

const defaultLabels = {
  name: "Name",
  desc: "Description",
  namePlaceholder: "Enter name",
  descPlaceholder: "Tell us about your project...",
};

function iconForCategory(name: string) {
  const label = name.toLowerCase();
  if (label.includes("restaurant") || label.includes("food")) return UtensilsCrossed;
  if (label.includes("real")) return Home;
  if (label.includes("educat") || label.includes("school")) return GraduationCap;
  if (label.includes("health") || label.includes("hospital")) return Heart;
  if (label.includes("beauty") || label.includes("spa")) return Flower2;
  if (label.includes("portfolio")) return Images;
  if (label.includes("blog")) return FileText;
  if (label.includes("ngo") || label.includes("charity")) return Users;
  if (label.includes("home")) return Home;
  return Briefcase;
}

const fallbackWebsiteOptions = [
  { value: "Business", label: "Business", icon: Briefcase },
  { value: "Restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { value: "Real Estate", label: "Real Estate", icon: Home },
  { value: "Education", label: "Education", icon: GraduationCap },
  { value: "Healthcare", label: "Healthcare", icon: Heart },
  { value: "Beauty & Spa", label: "Beauty & Spa", icon: Flower2 },
  { value: "Portfolio", label: "Portfolio", icon: Images },
  { value: "Blog", label: "Blog", icon: FileText },
  { value: "NGO", label: "NGO", icon: Users },
  { value: "Home Services", label: "Home Services", icon: Home },
];

const pageOptions = [
  {
    value: "multi-page",
    label: "Multi-page Site",
    hint: "Home, About, Services...",
    icon: LayoutGrid,
  },
  {
    value: "single-page",
    label: "Single-page Site",
    hint: "All content on one page",
    icon: Smartphone,
  },
] as const;

export default function CategoryStep({
  value,
  showErrors,
  onChange,
  createPath = "",
  onMenuOpen,
}: CategoryStepProps) {
  const [selected, setSelected] = useState<"" | Category>(value.audience);
  const [logoPreview, setLogoPreview] = useState(value.logoImage || "");
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [descriptionAiError, setDescriptionAiError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [pageRangeOpen, setPageRangeOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [pageRange, setPageRange] = useState(value.pageRange || "");
  const [unavailableNotice, setUnavailableNotice] = useState("");
  const unavailableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showUnavailableNotice = (message = "No Theme Available") => {
    if (unavailableTimerRef.current) clearTimeout(unavailableTimerRef.current);
    setUnavailableNotice(message);
    unavailableTimerRef.current = setTimeout(() => {
      setUnavailableNotice("");
      unavailableTimerRef.current = null;
    }, 2200);
  };
  useEffect(() => {
    return () => {
      if (unavailableTimerRef.current) clearTimeout(unavailableTimerRef.current);
    };
  }, []);
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const slideCategoryRail = (direction: 1 | -1) => {
    const rail = categoryRailRef.current;
    if (!rail) return;
    const cards = [...rail.querySelectorAll("button")];
    const edge = rail.getBoundingClientRect().left + 40;
    if (direction > 0) {
      const next = cards.find((card) => card.getBoundingClientRect().left > edge + 6);
      if (!next) return;
      rail.scrollBy({
        left: next.getBoundingClientRect().left - edge,
        behavior: "smooth",
      });
      return;
    }
    const prev = [...cards].reverse().find((card) => card.getBoundingClientRect().left < edge - 6);
    rail.scrollBy({
      left: prev ? prev.getBoundingClientRect().left - edge : -rail.scrollLeft,
      behavior: "smooth",
    });
  };
  const pageRangeRef = useRef<HTMLDivElement>(null);
  const isAiPath = createPath === "create-ai";
  const pathLabel = isAiPath ? "With AI" : "Premium Theme";
  const pathHint = isAiPath
    ? "You chose Create with AI — share a few details and we will generate your site."
    : "You chose a Premium Ready-Made Theme — share a few details, then pick a template.";

  useEffect(() => {
    setLogoPreview(value.logoImage || "");
  }, [value.logoImage]);

  useEffect(() => {
    if (!pageRangeOpen) return;
    const close = (event: MouseEvent) => {
      if (!pageRangeRef.current?.contains(event.target as Node)) {
        onMenuOpen?.(false);
        setPageRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [pageRangeOpen, onMenuOpen]);

  // Create with AI: fewer questions — soft-default site type + logo.
  useEffect(() => {
    if (!isAiPath) return;
    const next: Partial<BusinessInfo> = {};
    if (!value.websiteRelated) next.websiteRelated = "service-provider";
    if (!value.hasLogo) next.hasLogo = "no";
    if (!value.pageType) next.pageType = "single-page";
    if (Object.keys(next).length) onChange({ ...value, ...next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiPath]);

  useEffect(() => {
    if (
      value.websiteRelated === "campaign-page" &&
      value.pageType === "multi-page"
    ) {
      onChange({ ...value, pageType: "single-page" });
    }
    // Only correct invalid campaign + multi-page combos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.websiteRelated, value.pageType]);

  const websiteOptions = useMemo(() => {
    const categories = getCategoriesForOnboarding();
    if (!categories.length) return fallbackWebsiteOptions;
    return categories.map((category) => {
      const avail = categoryThemeAvailability(category.name);
      return {
        value: category.name,
        label: category.name,
        icon: iconForCategory(category.name),
        disabled: !avail.hasAny,
        hasMulti: avail.hasMulti,
        hasSingle: avail.hasSingle,
      };
    });
  }, []);
  const filteredWebsiteOptions = websiteOptions.filter((option) =>
    option.label.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );
  const isCampaignPage = value.websiteRelated === "campaign-page";
  const selectedCategoryAvail = useMemo(
    () => categoryThemeAvailability(value.websiteRelated || ""),
    [value.websiteRelated],
  );
  const pageTypeOptions = pageOptions.map((option) => ({
    ...option,
    disabled:
      (isCampaignPage && option.value === "multi-page") ||
      (option.value === "multi-page" &&
        Boolean(value.websiteRelated) &&
        !selectedCategoryAvail.hasMulti) ||
      (option.value === "single-page" &&
        Boolean(value.websiteRelated) &&
        !selectedCategoryAvail.hasSingle),
  }));

  const availablePageRanges = useMemo(
    () =>
      pageRangesForThemeCounts(
        multiPageCountsForCategory(value.websiteRelated || ""),
      ),
    [value.websiteRelated],
  );

  // If category has no themes for the selected site type, switch / clear.
  useEffect(() => {
    if (!value.websiteRelated) return;
    const { hasMulti, hasSingle, hasAny } = selectedCategoryAvail;
    if (!hasAny) {
      if (value.pageType || value.pageRange) {
        setPageRange("");
        onChange({ ...value, pageType: "", pageRange: "" });
      }
      return;
    }
    if (value.pageType === "multi-page" && !hasMulti && hasSingle) {
      setPageRange("");
      onChange({ ...value, pageType: "single-page", pageRange: "" });
      return;
    }
    if (value.pageType === "single-page" && !hasSingle && hasMulti) {
      onChange({ ...value, pageType: "multi-page" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.websiteRelated, selectedCategoryAvail.hasMulti, selectedCategoryAvail.hasSingle]);

  // If category themes don't support the selected range, clear it.
  useEffect(() => {
    if (!value.pageRange) return;
    const normalized =
      value.pageRange === "1-8" ? "1-25" : value.pageRange;
    const stillOk = availablePageRanges.some((r) => r.id === normalized);
    if (stillOk) {
      if (value.pageRange === "1-8") {
        setPageRange("1-25");
        onChange({ ...value, pageRange: "1-25" });
      }
      return;
    }
    setPageRange("");
    onChange({ ...value, pageRange: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.websiteRelated, availablePageRanges]);

  const active = categories.find((item) => item.id === selected);
  const labels = active?.labels ?? defaultLabels;
  const hasAudienceError = showErrors && !value.audience;
  const hasNameError = showErrors && !value.name.trim();
  const descriptionLength = value.description.trim().length;
  const hasDescriptionError =
    showErrors && descriptionLength < MIN_DESCRIPTION_LENGTH;
  const hasWebsiteError =
    showErrors && !isAiPath && !value.websiteRelated;
  const hasPageTypeError = showErrors && !value.pageType;
  const hasEmailError =
    showErrors &&
    value.includeDetails &&
    !isValidOnboardingEmail(value.email);
  const hasMobileError =
    showErrors &&
    value.includeDetails &&
    !isValidOnboardingPhone(value.mobile);
  const emailErrorMessage = !value.email.trim()
    ? "Email is required."
    : "Enter a valid email address.";
  const mobileErrorMessage = !value.mobile.trim()
    ? "Mobile number is required."
    : "Enter a valid mobile number (7–15 digits).";
  const hasAddressError =
    showErrors && value.includeDetails && !value.address.trim();
  const hasLogoError = showErrors && !isAiPath && !value.hasLogo;
  const hasLogoUploadError =
    showErrors &&
    value.hasLogo === "yes" &&
    (!value.logoName || !value.logoImage);

  const updateBusinessInfo = (nextValue: Partial<BusinessInfo>) => {
    onChange({ ...value, ...nextValue });
  };

  const handleGenerateDescription = async () => {
    if (generatingDescription) return;
    setDescriptionAiError("");

    if (!value.name.trim()) {
      setDescriptionAiError("Enter a website name first, then generate.");
      return;
    }

    setGeneratingDescription(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value.name,
          audience: value.audience,
          websiteRelated: value.websiteRelated,
          pageType: value.pageType,
          existingDescription: value.description,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        description?: string;
        message?: string;
        fallback?: boolean;
      };
      if (!res.ok || !data.description?.trim()) {
        setDescriptionAiError(
          data.message || "Unable to generate description. Try again.",
        );
        return;
      }
      updateBusinessInfo({
        description: data.description.trim().slice(0, 300),
        descriptionGenerated: true,
      });
      if (data.fallback && data.message) {
        setDescriptionAiError(data.message);
      }
    } catch {
      setDescriptionAiError("Unable to generate description. Try again.");
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    void (async () => {
      try {
        const compressed = await compressLogoFile(file);
        setLogoPreview(compressed.dataUrl);
        updateBusinessInfo({
          hasLogo: "yes",
          logoName: compressed.fileName,
          logoImage: compressed.dataUrl,
        });
      } catch {
        updateBusinessInfo({ logoName: "", logoImage: "" });
        setLogoPreview("");
      } finally {
        setLogoUploading(false);
        event.target.value = "";
      }
    })();
  };

  return (
    <section
      className={`relative mx-auto w-full origin-center max-h-[calc(100dvh-11rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-[0_18px_60px_rgba(23,38,76,.08)] ${pageRangeOpen ? "pb-[5px]" : ""} ${
        isAiPath
          ? "bg-white"
          : "overflow-x-hidden bg-[linear-gradient(180deg,#f7f8ff_0%,#ffffff_28%)] [&_.text-slate-400]:!text-[#5c6778] [&_.text-slate-500]:!text-[#5c6778] [&_.text-slate-600]:!text-[#4a5568] [&_input]:placeholder:!text-[#5c6778] [&_textarea]:placeholder:!text-[#5c6778]"
      }`}
    >
      <div
        className={
          isAiPath
            ? "px-4 py-4 sm:px-6 lg:px-7 lg:py-5 2xl:px-9"
            : "px-4 py-4 sm:px-6 lg:px-8 lg:py-5 2xl:px-10"
        }
      >
        <div>
          <div
            className={
              isAiPath
                ? "flex shrink-0 justify-center items-center gap-3 border-slate-200 pb-6 sm:pb-7"
                : "flex shrink-0 justify-start items-center gap-3 pb-4"
            }
          >
            {isAiPath ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-[-.035em] text-[#08132f] sm:text-2xl">
                {"Let's"} start with your business{" "}
                <span className="bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                  {pathLabel}
                </span>
              </h2>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                {pathHint}
              </p>
            </div>
            ) : (
            <div className="text-left">
              <h2 className="text-[26px] font-bold leading-tight tracking-[-.03em] text-[#12142b] sm:text-[30px]">
                {"Let's"} create your website
              </h2>
              <p className="mt-0.5 bg-gradient-to-r from-[#7c5cff] to-[#5b4dff] bg-clip-text text-[20px] font-semibold leading-tight text-transparent sm:text-[22px]">
                Tell us about your business
              </p>
            </div>
            )}
          </div>

          <div className="min-w-0">
            {!isAiPath ? (
              <div className="mb-3 flex items-stretch gap-2 xl:hidden">
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setTypeMenuOpen((open) => !open)}
                    className="inline-flex h-full min-h-[56px] items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#12142b]"
                  >
                    Type
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>
                  {typeMenuOpen ? (
                    <ul className="absolute left-0 top-[calc(100%+6px)] z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      {categories.map((item) => {
                        const picked = (selected || "company") === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(item.id);
                                updateBusinessInfo({ audience: item.id });
                                setTypeMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-medium ${
                                picked ? "bg-[#f4f6ff] text-[#3a46b5]" : "text-[#12142b] hover:bg-slate-50"
                              }`}
                            >
                              {item.title}
                              {picked ? <Check size={14} strokeWidth={2.5} /> : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
                {categories
                  .filter((item) => item.id === (selected || "company"))
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#5b6cff] bg-[#f4f6ff] px-3.5 text-[#10182d] ring-1 ring-[#5b6cff]"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#ecebff] text-[#5b4dff]">
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate text-[16px] font-semibold">{item.title}</strong>
                          <small className="text-[11px] text-slate-400">{item.subtitle}</small>
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : null}
            <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${isAiPath ? "sm:gap-2.5 2xl:gap-3" : "hidden sm:gap-3 xl:grid"}`}>
              {categories.map((item) => {
                const Icon = item.icon;
                const isActive = selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelected(item.id);
                      updateBusinessInfo({ audience: item.id });
                    }}
                    className={`group relative flex items-center justify-start gap-3 overflow-hidden text-left transition-all duration-500 ease-out active:scale-[.985] ${isAiPath ? "rounded-lg border px-3 pr-14 sm:px-4 sm:pr-[74px] min-h-[58px] md:min-h-[64px] 2xl:min-h-[70px] 2xl:px-5 2xl:pr-20" : "min-h-[56px] rounded-2xl border px-3.5"} ${isActive
                      ? "border-[#5b6cff] bg-[#f4f6ff] text-[#10182d] shadow-[0_8px_24px_rgba(91,108,255,.12)] ring-1 ring-[#5b6cff]"
                      : hasAudienceError
                        ? "border-blue-400 bg-white text-[#08132f]"
                        : "border-slate-200 bg-white text-[#08132f] hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
                  >
                    <span
                      className={`grid shrink-0 place-items-center rounded-xl transition-all duration-500 ${isAiPath ? "hidden md:grid size-8 2xl:size-11 rounded-lg" : "size-8"} ${isActive ? "bg-[#ecebff] text-[#5b4dff] shadow-sm" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <strong className={`block truncate font-semibold ${isAiPath ? "text-sm sm:text-[12px] 2xl:text-[18px]" : "text-[16px]"}`}>
                        {item.title}
                      </strong>
                      <small className={`text-slate-400 sm:block ${isAiPath ? "text-[12px] 2xl:text-xs" : "text-[11px]"}`}>
                        {item.subtitle}
                      </small>
                    </span>
                    <span
                      className={`${isAiPath ? "hidden md:block" : "hidden"} pointer-events-none absolute -bottom-1 right-1 h-[54px] w-[72px] transition-all duration-500 ease-out sm:right-2 2xl:h-[68px] 2xl:w-[90px] ${isActive
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-1 scale-90 opacity-55 grayscale-[25%]"
                        }`}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="scale-150 object-contain"
                      />
                    </span>
                    {isActive && (
                      <span className={`absolute z-10 grid place-items-center rounded-full bg-[#5b6cff] text-white transition-all duration-300 ${isAiPath ? "right-2 top-2 size-4" : "right-3 top-3 size-5"}`}>
                        <Check size={isAiPath ? 11 : 12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {hasAudienceError && (
              <ErrorLine message="Please choose who this website is for." />
            )}

            <form
              className={
                isAiPath
                  ? "mt-4 grid items-start gap-y-3 2xl:mt-6 2xl:gap-y-4"
                  : "mt-5 grid items-start"
              }
              onSubmit={(event) => event.preventDefault()}
            >
              {isAiPath ? (
                <>
                  <div className="grid min-w-0 grid-cols-1 content-start items-stretch gap-3 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                    <FieldLabel
                      label={labels.name}
                      compact
                      className="h-full"
                      error={
                        hasNameError ? "This field is required." : undefined
                      }
                    >
                      <input
                        value={value.name}
                        onChange={(event) =>
                          updateBusinessInfo({ name: event.target.value })
                        }
                        type="text"
                        placeholder={labels.namePlaceholder}
                        className={`${fieldClass(hasNameError, true)} !h-9`}
                      />
                    </FieldLabel>
                    <RadioGroup
                      legend="What kind of site do you need?"
                      name="page-type"
                      value={value.pageType}
                      options={pageTypeOptions}
                      hasError={hasPageTypeError}
                      onChange={(pageType) => updateBusinessInfo({ pageType })}
                      compact
                      equalHeight
                    />
                  </div>

                  <div className="grid min-w-0 content-start gap-1.5">
                    <p className="text-[14px] font-medium text-[#08132f] 2xl:text-[15px]">
                      Logo{" "}
                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>
                    </p>
                    <LogoUpload
                      fileName={value.logoName}
                      preview={logoPreview}
                      hasError={hasLogoUploadError}
                      uploading={logoUploading}
                      onChange={handleLogoChange}
                      compact
                    />
                  </div>

                  <DescriptionField
                    label={`${labels.desc} *`}
                    value={value.description}
                    placeholder={labels.descPlaceholder}
                    hasError={hasDescriptionError}
                    errorMessage={`Please enter at least ${MIN_DESCRIPTION_LENGTH} characters (${MIN_DESCRIPTION_LENGTH - descriptionLength} more needed).`}
                    aiError={descriptionAiError}
                    generating={generatingDescription}
                    onGenerate={() => void handleGenerateDescription()}
                    canGenerate={Boolean(value.name.trim())}
                    compact
                    onChange={(description) => {
                      setDescriptionAiError("");
                      updateBusinessInfo({ description });
                    }}
                  />

                  {!value.includeDetails ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateBusinessInfo({ includeDetails: true })
                      }
                      className="inline-flex h-8 w-fit max-w-full items-center gap-1.5 justify-self-start rounded-md px-1 text-[13px] font-medium text-[#315ff4] transition hover:text-blue-800"
                    >
                      <span className="text-md leading-none">+</span>
                      Add more details
                      <span className="hidden font-normal text-slate-400 sm:inline">
                        — these will be used on your website
                      </span>
                    </button>
                  ) : (
                    <div className="relative grid animate-onboarding-swap gap-2 pt-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1.2fr]">
                      <button
                        type="button"
                        aria-label="Close additional details"
                        title="Close additional details"
                        onClick={() =>
                          updateBusinessInfo({ includeDetails: false })
                        }
                        className="absolute right-0 top-0 z-10 grid size-6 place-items-center rounded-full bg-[#315ff4] text-base font-medium leading-none text-white shadow-[0_6px_16px_rgba(49,95,244,.3)] transition-all duration-200 hover:rotate-90 hover:bg-[#244bd5]"
                      >
                        ×
                      </button>
                      <FieldLabel
                        label="Email ID"
                        compact
                        error={
                          hasEmailError ? emailErrorMessage : undefined
                        }
                      >
                        <input
                          type="email"
                          value={value.email}
                          onChange={(event) =>
                            updateBusinessInfo({ email: event.target.value })
                          }
                          placeholder="you@example.com"
                          className={fieldClass(hasEmailError, true)}
                        />
                      </FieldLabel>
                      <FieldLabel
                        label="Mobile number"
                        compact
                        error={
                          hasMobileError ? mobileErrorMessage : undefined
                        }
                      >
                        <input
                          type="tel"
                          value={value.mobile}
                          inputMode="numeric"
                          onChange={(event) =>
                            updateBusinessInfo({
                              mobile: event.target.value.replace(/\D/g, "").slice(0, 15),
                            })
                          }
                          placeholder="Your number"
                          className={fieldClass(hasMobileError, true)}
                        />
                      </FieldLabel>
                      <FieldLabel
                        label="Business address"
                        compact
                        error={
                          hasAddressError ? "Address is required." : undefined
                        }
                      >
                        <input
                          type="text"
                          value={value.address}
                          onChange={(event) =>
                            updateBusinessInfo({ address: event.target.value })
                          }
                          placeholder="Street, city, country"
                          className={fieldClass(hasAddressError, true)}
                        />
                      </FieldLabel>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid gap-5">
                  <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2">
                    <FieldLabel
                      label={`${labels.name} *`}
                      error={hasNameError ? "This field is required." : undefined}
                      className="[&>span]:flex [&>span]:min-h-8 [&>span]:items-center"
                    >
                      <div className="relative">
                        <Building2
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          value={value.name}
                          onChange={(event) =>
                            updateBusinessInfo({ name: event.target.value })
                          }
                          type="text"
                          placeholder={labels.namePlaceholder}
                          className={`${fieldClass(hasNameError)} !h-12 !pl-10`}
                        />
                      </div>
                    </FieldLabel>

                    <div className="grid min-w-0 content-start gap-2 text-[15px] font-medium text-[#08132f]">
                      <div className="flex items-center justify-between gap-3">
                        <span>{labels.desc} *</span>
                        <button
                          type="button"
                          onClick={() => void handleGenerateDescription()}
                          disabled={generatingDescription}
                          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#6d5efc] px-3 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#5b4de8] disabled:opacity-70"
                        >
                          {generatingDescription ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Sparkles size={13} />
                          )}
                          Generate with AI
                        </button>
                      </div>
                      <div className="relative min-w-0">
                        <textarea
                          value={value.description}
                          onChange={(event) => {
                            setDescriptionAiError("");
                            updateBusinessInfo({ description: event.target.value });
                          }}
                          required
                          rows={3}
                          minLength={MIN_DESCRIPTION_LENGTH}
                          maxLength={500}
                          placeholder="Tell us what your business does, your goals, and what makes it unique..."
                          className={`${fieldClass(hasDescriptionError)} !h-auto min-h-[88px] resize-none py-2.5 pr-14 !text-[15px]`}
                        />
                        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] font-medium text-slate-400">
                          {value.description.length}/500
                        </span>
                      </div>
                      {descriptionAiError ? (
                        <p className="text-[12px] font-medium text-amber-700">{descriptionAiError}</p>
                      ) : null}
                      {hasDescriptionError ? (
                        <ErrorLine
                          message={`Please enter at least ${MIN_DESCRIPTION_LENGTH} characters (${MIN_DESCRIPTION_LENGTH - descriptionLength} more needed).`}
                        />
                      ) : null}
                    </div>
                  </div>

                  <fieldset className="grid gap-3">
                    <legend className="mb-1 text-[15px] font-semibold text-[#12142b]">
                      What is your website related to?<span className="text-[11px] leading-none"> *</span>
                    </legend>
                    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                      <label className="relative block">
                        <Search
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          value={categoryQuery}
                          onChange={(event) => setCategoryQuery(event.target.value)}
                          placeholder="Search or choose a category (e.g., Restaurant, Real Estate, Education...)"
                          className={`${fieldClass(false)} !h-11 !pl-10`}
                        />
                      </label>
                      <div className="relative">
                        <select
                          value={
                            websiteOptions.some((option) => option.value === value.websiteRelated)
                              ? value.websiteRelated
                              : ""
                          }
                          onChange={(event) => {
                            const next = event.target.value as OnboardingWebsiteRelated;
                            if (!next) return;
                            const opt = websiteOptions.find((o) => o.value === next);
                            if (opt?.disabled) return;
                            setCategoryQuery("");
                            updateBusinessInfo({ websiteRelated: next });
                          }}
                          className={`${fieldClass(false)} !h-11 appearance-none pr-9 !text-[14px]`}
                          aria-label="Category list"
                        >
                          <option value="">Category</option>
                          {websiteOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={option.disabled}
                              style={{ fontSize: 14 }}
                            >
                              {option.disabled
                                ? `${option.label} (No Theme Available)`
                                : option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                    <div className="relative min-w-0">
                      <button
                        type="button"
                        aria-label="Show previous category"
                        onClick={() => slideCategoryRail(-1)}
                        className="absolute left-0 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#c9d0ff] hover:text-[#5b6cff]"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div
                        ref={categoryRailRef}
                        className="flex min-w-0 flex-nowrap items-stretch gap-3 overflow-x-auto scroll-smooth px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {filteredWebsiteOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = value.websiteRelated === option.value;
                          const isDisabled = Boolean(option.disabled);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-disabled={isDisabled}
                              title={
                                isDisabled
                                  ? "No Theme Available"
                                  : option.label
                              }
                              onClick={() => {
                                if (isDisabled) {
                                  showUnavailableNotice("No Theme Available");
                                  return;
                                }
                                updateBusinessInfo({
                                  websiteRelated: option.value as OnboardingWebsiteRelated,
                                });
                              }}
                              className={`flex h-[62px] min-w-[108px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border px-3 text-center text-[12px] font-medium transition xl:h-[72px] xl:min-w-[124px] xl:gap-1.5 xl:px-4 xl:text-[13px] ${
                                isDisabled
                                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                                  : isSelected
                                    ? "border-[#5b6cff] bg-[#f3f5ff] text-[#3d4ed8]"
                                    : hasWebsiteError
                                      ? "border-red-300 bg-white text-[#3d4654]"
                                      : "border-slate-200 bg-white text-[#3d4654] hover:border-[#c9d0ff]"
                              }`}
                            >
                              <Icon size={16} className={`xl:hidden ${isSelected && !isDisabled ? "text-[#5b6cff]" : "text-slate-500"}`} />
                              <Icon size={18} className={`hidden xl:block ${isSelected && !isDisabled ? "text-[#5b6cff]" : "text-slate-500"}`} />
                              <span className="whitespace-nowrap">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        aria-label="Show next category"
                        onClick={() => slideCategoryRail(1)}
                        className="absolute right-0 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#c9d0ff] hover:text-[#5b6cff]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    {filteredWebsiteOptions.length === 0 && (
                      <p className="text-[13px] text-slate-400">No categories match that search.</p>
                    )}
                    {hasWebsiteError && <ErrorLine message="Please select an option." />}
                  </fieldset>

                  <div className="grid items-start gap-x-10 gap-y-5 lg:grid-cols-2">
                    <fieldset className="grid gap-3">
                      <legend className="mb-2 text-[15px] font-semibold text-[#12142b]">
                        What kind of site do you need?<span className="text-[11px] leading-none"> *</span>
                      </legend>
                      <div ref={pageRangeRef} className="grid gap-2">
                      <div className="flex gap-2 xl:flex-wrap xl:gap-3">
                        {pageTypeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = value.pageType === option.value;
                          const isDisabled = Boolean(option.disabled);
                          const showRange = option.value === "multi-page";
                          return (
                            <div
                              key={option.value}
                              className="min-w-0 flex-1 xl:w-[304px] xl:flex-none"
                            >
                              <button
                                type="button"
                                aria-disabled={isDisabled}
                                title={isDisabled ? "No Theme Available" : option.label}
                                onClick={() => {
                                  if (isDisabled) {
                                    showUnavailableNotice("No Theme Available");
                                    return;
                                  }
                                  if (showRange) {
                                    updateBusinessInfo({ pageType: "multi-page" });
                                    const nextOpen = !pageRangeOpen;
                                    onMenuOpen?.(nextOpen);
                                    setPageRangeOpen(nextOpen);
                                  } else {
                                    // Single-page: clear multi-page range so Multi card fully resets
                                    setPageRange("");
                                    onMenuOpen?.(false);
                                    setPageRangeOpen(false);
                                    updateBusinessInfo({
                                      pageType: "single-page",
                                      pageRange: "",
                                    });
                                  }
                                }}
                                className={`relative flex min-h-[58px] w-full items-center gap-1.5 rounded-2xl border px-2 text-left transition xl:min-h-[72px] xl:w-[304px] xl:gap-2.5 xl:px-3 ${
                                  isDisabled
                                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                    : isSelected
                                      ? "border-[#5b6cff] bg-[#f4f6ff] ring-1 ring-[#5b6cff]"
                                      : hasPageTypeError
                                        ? "border-red-300 bg-white"
                                        : "border-slate-200 bg-white hover:border-[#c9d0ff]"
                                }`}
                              >
                                <span className={`grid size-7 shrink-0 place-items-center rounded-lg xl:size-9 xl:rounded-xl ${isDisabled ? "bg-slate-100 text-slate-400" : isSelected ? "bg-white text-[#5b6cff]" : "bg-slate-100 text-slate-500"}`}>
                                  {isDisabled ? (
                                    <>
                                      <Ban size={14} className="xl:hidden" />
                                      <Ban size={16} className="hidden xl:block" />
                                    </>
                                  ) : (
                                    <>
                                      <Icon size={14} className="xl:hidden" />
                                      <Icon size={16} className="hidden xl:block" />
                                    </>
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className={`block truncate text-[12px] font-semibold xl:text-[14px] ${isDisabled ? "text-slate-400" : "text-[#12142b]"}`}>{option.label}</span>
                                  <span className="block truncate text-[10px] text-slate-400 xl:text-[12px]">
                                    {isDisabled ? "No Theme Available" : option.hint}
                                  </span>
                                </span>
                                {showRange && isSelected && pageRange ? (
                                  <span className="absolute -right-2 -top-2 z-10 rounded-md bg-[#dbeafe] px-1.5 py-1 text-[10px] font-semibold leading-none text-[#1d4ed8] shadow-sm ring-2 ring-white xl:px-2 xl:text-[11px]">
                                    {pageRange === "1-8" || pageRange === "1-25"
                                      ? "1 – 25 pages"
                                      : pageRange === "1-50"
                                        ? "1 – 50 pages"
                                        : pageRange === "1-100"
                                          ? "1 – 100 pages"
                                          : "1 – 125 pages"}
                                  </span>
                                ) : null}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      {pageRangeOpen && value.pageType === "multi-page" && (
                        <ul
                          data-page-range-menu
                          className="w-[320px] max-w-full rounded-xl border border-slate-200 bg-[#f8f9ff] p-2"
                        >
                          {availablePageRanges.map((item) => {
                            const selectedRange = pageRange === item.id;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPageRange(item.id);
                                    onMenuOpen?.(false);
                                    setPageRangeOpen(false);
                                    updateBusinessInfo({
                                      pageType: "multi-page",
                                      pageRange: item.id,
                                    });
                                  }}
                                  className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left ${
                                    selectedRange ? "bg-[#f4f6ff]" : "hover:bg-slate-50"
                                  }`}
                                >
                                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${selectedRange ? "bg-[#ecebff] text-[#5b6cff]" : "bg-slate-100 text-slate-500"}`}>
                                    <FileText size={15} />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block whitespace-nowrap text-[13px] font-semibold text-[#12142b]">{item.label}</span>
                                    <span className="block whitespace-nowrap text-[11px] text-slate-400">{item.hint}</span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                          {availablePageRanges.length === 0 ? (
                            <li className="px-2 py-2 text-[12px] text-slate-400">
                              No multi-page themes in this category.
                            </li>
                          ) : null}
                        </ul>
                      )}
                      </div>
                      {isCampaignPage && (
                        <p className="text-[11px] text-slate-400">
                          Campaign pages use a single-page site only.
                        </p>
                      )}
                      {unavailableNotice ? (
                        <p
                          role="status"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] font-semibold text-slate-600"
                        >
                          <Ban size={14} className="shrink-0 text-slate-500" />
                          {unavailableNotice}
                        </p>
                      ) : null}
                      {hasPageTypeError && <ErrorLine message="Please select an option." />}
                    </fieldset>

                    <fieldset className="grid gap-3">
                      <legend className="mb-2 text-[15px] font-semibold text-[#12142b]">
                        Do you already have a logo?<span className="text-[11px] leading-none"> *</span>
                      </legend>
                      <div className="flex gap-2 xl:flex-wrap xl:gap-3">
                        {(
                          [
                            { value: "yes" as const, label: "Yes, I have.", hint: "Upload your logo", icon: ImageIcon },
                            { value: "no" as const, label: "Not yet", hint: "I'll create one with AI", icon: Sparkles },
                          ]
                        ).map((option) => {
                          const Icon = option.icon;
                          const isSelected = value.hasLogo === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateBusinessInfo({
                                  hasLogo: option.value,
                                  ...(option.value !== "yes"
                                    ? { logoName: "", logoImage: "" }
                                    : {}),
                                })
                              }
                              className={`flex min-h-[58px] min-w-0 flex-1 items-center gap-1.5 rounded-2xl border px-2 text-left transition xl:min-h-[72px] xl:w-[304px] xl:flex-none xl:gap-2.5 xl:px-3 ${
                                isSelected
                                  ? "border-[#5b6cff] bg-[#f4f6ff] ring-1 ring-[#5b6cff]"
                                  : hasLogoError
                                    ? "border-red-300 bg-white"
                                    : "border-slate-200 bg-white hover:border-[#c9d0ff]"
                              }`}
                            >
                              <span className={`grid size-7 shrink-0 place-items-center rounded-lg xl:size-9 xl:rounded-xl ${isSelected ? "bg-[#ecebff] text-[#6d5efc]" : "bg-slate-100 text-slate-500"}`}>
                                <Icon size={14} className="xl:hidden" />
                                <Icon size={16} className="hidden xl:block" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-[12px] font-semibold text-[#12142b] xl:whitespace-nowrap xl:text-[14px]">{option.label}</span>
                                <span className="block truncate text-[10px] text-slate-400 xl:whitespace-nowrap xl:text-[12px]">{option.hint}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {value.hasLogo === "yes" && (
                        <div className="animate-onboarding-swap">
                          <LogoUpload
                            fileName={value.logoName}
                            preview={logoPreview}
                            hasError={hasLogoUploadError}
                            uploading={logoUploading}
                            onChange={handleLogoChange}
                          />
                        </div>
                      )}
                      {hasLogoError && <ErrorLine message="Please select an option." />}
                    </fieldset>
                  </div>

                  {value.includeDetails ? (
                    <div className="relative grid animate-onboarding-swap gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr]">
                      <button
                        type="button"
                        aria-label="Close additional details"
                        onClick={() => updateBusinessInfo({ includeDetails: false })}
                        className="absolute right-0 top-0 z-10 grid size-6 place-items-center rounded-full bg-[#5b6cff] text-base font-medium leading-none text-white"
                      >
                        ×
                      </button>
                      <FieldLabel label="Email ID" compact error={hasEmailError ? emailErrorMessage : undefined}>
                        <input
                          type="email"
                          value={value.email}
                          onChange={(event) => updateBusinessInfo({ email: event.target.value })}
                          placeholder="you@example.com"
                          className={fieldClass(hasEmailError, true)}
                        />
                      </FieldLabel>
                      <FieldLabel label="Mobile number" compact error={hasMobileError ? mobileErrorMessage : undefined}>
                        <input
                          type="tel"
                          value={value.mobile}
                          inputMode="numeric"
                          onChange={(event) =>
                            updateBusinessInfo({
                              mobile: event.target.value.replace(/\D/g, "").slice(0, 15),
                            })
                          }
                          placeholder="Your number"
                          className={fieldClass(hasMobileError, true)}
                        />
                      </FieldLabel>
                      <FieldLabel
                        label="Business address"
                        compact
                        error={hasAddressError ? "Address is required." : undefined}
                      >
                        <input
                          type="text"
                          value={value.address}
                          onChange={(event) => updateBusinessInfo({ address: event.target.value })}
                          placeholder="Street, city, country"
                          className={fieldClass(hasAddressError, true)}
                        />
                      </FieldLabel>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateBusinessInfo({ includeDetails: true })}
                      className="inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-[#5b6cff]"
                    >
                      + Add more details
                      <span className="font-normal text-slate-400">(Optional)</span>
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
const fieldClass = (hasError: boolean, compact = false) =>
  `${compact ? "h-10 2xl:h-11" : "h-11 2xl:h-14"} min-w-0 w-full rounded-lg border bg-white px-3 text-[14px] leading-5 text-[#08132f] outline-none transition placeholder:text-[13px] placeholder:text-slate-400 focus:border-[#315ff4] focus:ring-3 focus:ring-blue-100/70 2xl:px-4 2xl:text-base 2xl:placeholder:text-[15px] ${hasError ? "border-red-400" : "border-slate-200"}`;

function DescriptionField({
  label,
  value,
  placeholder,
  hasError,
  errorMessage,
  aiError,
  generating,
  canGenerate,
  onGenerate,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  hasError: boolean;
  errorMessage: string;
  aiError: string;
  generating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid min-w-0 w-full content-start font-medium text-[#08132f] ${compact ? "gap-1.5 text-[14px] 2xl:text-[15px]" : "gap-2 text-[15px] 2xl:text-[17px]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="block leading-normal">{label}</span>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          title={
            canGenerate
              ? "Generate description with AI"
              : "Enter website name first"
          }
          aria-label="Generate description with AI"
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 px-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-70"
        >
          {generating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Sparkles size={13} />
          )}
          Generate
        </button>
      </div>
      <div className="relative min-w-0">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          rows={compact ? 2 : 3}
          minLength={MIN_DESCRIPTION_LENGTH}
          maxLength={300}
          placeholder={placeholder}
          className={`${fieldClass(hasError)} !h-auto ${compact ? "min-h-[52px] py-2 pb-6" : "min-h-[88px] py-2.5 pb-7"} resize-none`}
        />
        <span className="pointer-events-none absolute bottom-1.5 right-2.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          {value.length}/300
        </span>
      </div>
      {hasError ? (
        <ErrorLine message={errorMessage} />
      ) : aiError ? (
        <p className="text-[11px] font-medium text-amber-700">{aiError}</p>
      ) : compact ? null : (
        <p className="text-[11px] font-normal text-slate-400">
          Required. Add a name, then tap Generate to draft your description.
        </p>
      )}
    </div>
  );
}

function FieldLabel({
  label,
  children,
  compact = false,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <label
      className={`grid min-w-0 content-start ${compact ? "gap-1.5" : "gap-2"} text-[15px] font-medium text-[#08132f] 2xl:text-[17px] ${className}`}
    >
      <span className="block leading-normal">
        {label.endsWith(" *") ? (
          <>
            {label.slice(0, -2)}
            <span className="text-[11px] leading-none"> *</span>
          </>
        ) : (
          label
        )}
      </span>
      <div className="min-w-0">{children}</div>
      {error && <ErrorLine message={error} />}
    </label>
  );
}

function LogoUpload({
  fileName,
  preview,
  hasError,
  uploading = false,
  onChange,
  compact = false,
}: {
  fileName: string;
  preview: string;
  hasError: boolean;
  uploading?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-lg border bg-white text-[#08132f] transition-all duration-300 ease-out hover:border-blue-300 focus-within:border-[#315ff4] focus-within:ring-2 focus-within:ring-blue-100 ${compact ? "p-1.5" : "p-2"} ${hasError ? "border-red-400" : "border-slate-200"
        }`}
    >
      <div className="flex items-center gap-2">
        {preview ? (
          <div
            className={`relative overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${compact ? "size-9" : "size-11"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-contain" />
          </div>
        ) : (
          <span
            className={`grid place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400 ${compact ? "size-9" : "size-11"}`}
          >
            {uploading ? (
              <Loader2 size={compact ? 14 : 16} className="animate-spin" />
            ) : (
              <ImagePlus size={compact ? 14 : 16} />
            )}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#08132f]">
            {uploading
              ? "Uploading logo..."
              : fileName || "Upload your logo"}
          </p>
          {!compact && (
            <p className="text-[11px] text-slate-400">
              Used in header &amp; footer for every theme
            </p>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onChange}
        disabled={uploading}
      />
      {hasError && <ErrorLine message="Please choose your logo image." />}
    </label>
  );
}

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  hasError,
  onChange,
  compact = false,
  equalHeight = false,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: readonly { value: T; label: string; disabled?: boolean }[];
  hasError: boolean;
  onChange: (value: T) => void;
  compact?: boolean;
  equalHeight?: boolean;
}) {
  return (
    <fieldset className={equalHeight ? "flex h-full min-w-0 flex-col" : undefined}>
      <legend
        className={`font-medium text-[#08132f] ${compact ? "mb-1.5 text-[14px] 2xl:text-[15px]" : "mb-2 text-[15px] 2xl:mb-3 2xl:text-[17px]"}`}
      >
        {legend}
      </legend>
      <div
        className={`flex min-w-0 flex-wrap ${compact ? "gap-1.5" : "gap-2"} ${equalHeight ? "flex-1 items-stretch" : ""}`}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = Boolean(option.disabled);

          return (
            <label
              key={option.value}
              title={
                isDisabled
                  ? "Not available for Campaign Page"
                  : undefined
              }
              aria-disabled={isDisabled}
              className={`whitespace-nowrap rounded-lg border font-medium transition ${equalHeight ? "inline-flex flex-1 items-center justify-center" : ""} ${compact ? (equalHeight ? "h-9 px-2 text-[11px] sm:text-[12px]" : "px-2.5 py-1.5 text-[12px]") : "px-3 py-2 text-[13px] 2xl:px-4 2xl:py-2.5 2xl:text-[15px]"} ${
                isDisabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70"
                  : isSelected
                    ? "cursor-pointer border-[#315ff4] bg-blue-50 text-[#315ff4] active:scale-[.97]"
                    : hasError
                      ? "cursor-pointer border-red-400 bg-white text-slate-700 active:scale-[.97]"
                      : "cursor-pointer border-blue-100 bg-white text-slate-700 shadow-sm hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 active:scale-[.97]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => {
                  if (isDisabled) return;
                  onChange(option.value);
                }}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {hasError && <ErrorLine message="Please select an option." />}
    </fieldset>
  );
}

function ErrorLine({ message }: { message: string }) {
  return (
    <span
      role="alert"
      className="mt-1 flex items-center gap-1.5 text-[11px] font-medium leading-none text-red-500 animate-onboarding-swap"
    >
      <span className="h-px w-3 shrink-0 bg-red-500" aria-hidden="true" />
      {message}
    </span>
  );
}

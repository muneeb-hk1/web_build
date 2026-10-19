"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  buildReadableNgoServiceBody,
  extractNgoServiceThemeCategories,
  findNgoService,
  NGO_SERVICE_DETAIL_LAYOUT,
  NGO_SERVICE_DETAIL_SLUG_EVENT,
  readNgoServiceDetailSlug,
  resolveNgoServiceCategoryLabel,
  resolveNgoServiceDetailSlug,
  resolveNgoServiceSlug,
  resolveServicePackFromMap,
  writeNgoServiceDetailSlug,
} from "../../../lib/ngoServiceDetails";
import { normalizeServiceDetailLayout } from "../../../lib/serviceLayouts";
import NgoServiceDetailArticle, {
  type ServiceDetailCategory,
  type ServiceDetailSidebarCta,
  type ServiceDetailSubService,
} from "./NgoServiceDetailArticle";

const FALLBACK_IMAGE =
  "/categories/ngo/template1/children-speaking-holding-book.jpg";

type ServiceListItem = Record<string, unknown>;

const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const serviceImage = (value: unknown) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const src = (value as { src?: unknown }).src;
    if (typeof src === "string" && src.trim()) return src.trim();
  }
  return "";
};

const slugifyLabel = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDetailSlug = (value?: string) => {
  const aliased = resolveNgoServiceDetailSlug(value);
  if (aliased) return aliased;
  const slug = slugifyLabel(value);
  if (!slug || slug === "service-details" || slug === "servicedetails") {
    return "";
  }
  return slug;
};

const readCategories = (
  sectionData: Record<string, unknown>,
): ServiceDetailCategory[] => {
  const pools = [
    sectionData.categories,
    site.servicesdetailsPage?.categories,
    site.serviceDetail?.categories,
  ];
  for (const pool of pools) {
    if (!Array.isArray(pool) || !pool.length) continue;
    const mapped: ServiceDetailCategory[] = [];
    for (let index = 0; index < pool.length; index += 1) {
      const entry = pool[index];
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      const name = text(record.name) || text(record.label) || text(record.title);
      if (!name) continue;
      const slug =
        text(record.slug) ||
        resolveNgoServiceDetailSlug(name) ||
        slugifyLabel(name);
      mapped.push({
        id: text(record.id) || String(index + 1),
        name,
        slug,
      });
    }
    if (mapped.length) return mapped;
  }

  return extractNgoServiceThemeCategories().map((name, index) => ({
    id: String(index + 1),
    name,
    slug: resolveNgoServiceDetailSlug(name) || slugifyLabel(name),
  }));
};

const readSidebarCta = (
  sectionData: Record<string, unknown>,
): ServiceDetailSidebarCta | null => {
  const raw =
    (sectionData.sidebarCta && typeof sectionData.sidebarCta === "object"
      ? sectionData.sidebarCta
      : null) ||
    site.servicesdetailsPage?.sidebarCta ||
    site.serviceDetail?.sidebarCta ||
    null;
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  return {
    icon: text(record.icon) || text(record.iconName) || "hand-heart",
    iconName: text(record.iconName) || text(record.icon) || "hand-heart",
    tagline: text(record.tagline),
    title: text(record.title),
    buttonText: text(record.buttonText),
    buttonUrl: text(record.buttonUrl) || "/contact-us",
    bgImage: text(record.bgImage),
  };
};

export default function NgoServiceDetail1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const searchParams = useSearchParams();
  const sectionData = (customData || {}) as Record<string, unknown>;
  const pageParam = (searchParams.get("page") || "").trim().toLowerCase();
  const slugFromRoute = pageParam.startsWith("service-details-")
    ? pageParam.slice("service-details-".length)
    : "";

  const categories = useMemo(
    () => readCategories(sectionData),
    [sectionData.categories],
  );

  const sidebarCta = useMemo(
    () => readSidebarCta(sectionData),
    [sectionData.sidebarCta],
  );

  const listingServices = useMemo(() => {
    const pools: ServiceListItem[][] = [];
    if (Array.isArray(sectionData.services) && sectionData.services.length) {
      pools.push(sectionData.services as ServiceListItem[]);
    }
    if (Array.isArray(sectionData.items) && sectionData.items.length) {
      pools.push(sectionData.items as ServiceListItem[]);
    }
    if (Array.isArray(site.service?.services) && site.service.services.length) {
      pools.push(site.service.services as ServiceListItem[]);
    }
    if (
      Array.isArray(site.servicePage?.services) &&
      site.servicePage.services.length
    ) {
      pools.push(site.servicePage.services as ServiceListItem[]);
    }
    const byKey = new Map<string, ServiceListItem>();
    for (const pool of pools) {
      for (const item of pool) {
        const key = resolveNgoServiceSlug({
          id: item.id as string | number | undefined,
          title: text(item.title),
          href: text(item.href),
          slug: text(item.slug),
        });
        if (!key) continue;
        const existing = byKey.get(key);
        if (!existing) {
          byKey.set(key, item);
          continue;
        }
        const existingContent = text(existing.content);
        const nextContent = text(item.content);
        if (!existingContent && nextContent) {
          byKey.set(key, { ...existing, ...item, content: nextContent });
        } else if (nextContent && nextContent.length > existingContent.length) {
          byKey.set(key, { ...existing, ...item, content: nextContent });
        } else {
          byKey.set(key, {
            ...item,
            ...existing,
            content: existingContent || nextContent,
          });
        }
      }
    }
    return Array.from(byKey.values());
  }, [sectionData.services, sectionData.items]);

  const [selectedSlug, setSelectedSlug] = useState(slugFromRoute);

  useEffect(() => {
    if (slugFromRoute) setSelectedSlug(slugFromRoute);
  }, [slugFromRoute]);

  useEffect(() => {
    const syncSlug = (event?: Event) => {
      const fromClick = (event as CustomEvent<{ slug?: string }> | undefined)
        ?.detail?.slug;
      if (typeof fromClick === "string" && fromClick.trim()) {
        setSelectedSlug(fromClick.trim());
        return;
      }
      const fromStore = readNgoServiceDetailSlug();
      if (fromStore) setSelectedSlug(fromStore);
    };
    syncSlug();
    window.addEventListener(NGO_SERVICE_DETAIL_SLUG_EVENT, syncSlug);
    return () =>
      window.removeEventListener(NGO_SERVICE_DETAIL_SLUG_EVENT, syncSlug);
  }, [preview?.currentPage]);

  const fallbackCategorySlug = categories[0]?.slug || "";

  const activeSlug =
    normalizeDetailSlug(slugFromRoute) ||
    normalizeDetailSlug(selectedSlug) ||
    normalizeDetailSlug(text(sectionData.activeSlug)) ||
    (listingServices[0]
      ? resolveNgoServiceSlug({
          id: listingServices[0].id as string | number | undefined,
          title: text(listingServices[0].title),
          href: text(listingServices[0].href),
          slug: text(listingServices[0].slug),
        })
      : "") ||
    fallbackCategorySlug;

  const selectedService = useMemo(
    () => findNgoService(listingServices, activeSlug),
    [listingServices, activeSlug],
  );

  const packMap =
    sectionData.servicesDataMap ||
    site.servicesdetailsPage?.servicesDataMap ||
    site.serviceDetail?.servicesDataMap;

  const packFallback = useMemo(
    () =>
      resolveServicePackFromMap(
        packMap,
        activeSlug,
        text(selectedService?.title),
      ),
    [packMap, activeSlug, selectedService?.title],
  );

  const activeCategory =
    categories.find(
      (category) =>
        category.slug === activeSlug ||
        resolveNgoServiceDetailSlug(category.slug) === activeSlug ||
        slugifyLabel(category.name) === activeSlug,
    ) || null;

  const sectionActiveSlug = normalizeDetailSlug(text(sectionData.activeSlug));
  const sectionMatchesSelected =
    !sectionActiveSlug || sectionActiveSlug === activeSlug;

  const title = sectionMatchesSelected
    ? text(sectionData.title) ||
      text(selectedService?.title) ||
      text(packFallback?.heading) ||
      activeCategory?.name ||
      "Service"
    : text(selectedService?.title) ||
      text(packFallback?.heading) ||
      activeCategory?.name ||
      text(sectionData.title) ||
      "Service";

  const category =
    activeCategory?.name ||
    resolveNgoServiceCategoryLabel({
      category: sectionMatchesSelected
        ? text(sectionData.category) || text(selectedService?.category) || ""
        : text(selectedService?.category) || text(sectionData.category) || "",
      href: text(selectedService?.href),
      slug: activeSlug,
      title,
      id: selectedService?.id as string | number | undefined,
      label: text(selectedService?.label),
    });

  const excerpt = sectionMatchesSelected
    ? text(sectionData.excerpt) ||
      text(selectedService?.desc) ||
      text(selectedService?.description) ||
      text(selectedService?.excerpt) ||
      text(packFallback?.subHeading)
    : text(selectedService?.desc) ||
      text(selectedService?.description) ||
      text(selectedService?.excerpt) ||
      text(packFallback?.subHeading) ||
      text(sectionData.excerpt);

  const image = sectionMatchesSelected
    ? text(sectionData.image) ||
      serviceImage(selectedService?.image) ||
      text(packFallback?.mainImage) ||
      FALLBACK_IMAGE
    : serviceImage(selectedService?.image) ||
      text(packFallback?.mainImage) ||
      text(sectionData.image) ||
      FALLBACK_IMAGE;

  const rawContent = sectionMatchesSelected
    ? text(sectionData.content) || text(selectedService?.content)
    : text(selectedService?.content) || text(sectionData.content);

  const content = buildReadableNgoServiceBody(
    {
      title,
      category,
      excerpt,
      desc: excerpt,
      content: rawContent,
    },
    packFallback,
  );

  const features = useMemo(() => {
    const grid = Array.isArray(packFallback?.featureGrid)
      ? packFallback.featureGrid
      : [];
    return grid
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        return text((item as { text?: unknown }).text);
      })
      .filter(Boolean);
  }, [packFallback]);

  const subServices = useMemo(() => {
    const rows = Array.isArray(packFallback?.subServices)
      ? packFallback.subServices
      : [];
    const next: ServiceDetailSubService[] = [];
    rows.forEach((item, index) => {
      if (!item || typeof item !== "object") return;
      const record = item as Record<string, unknown>;
      const itemTitle = text(record.title);
      if (!itemTitle) return;
      next.push({
        id: text(record.id) || `sub-${index + 1}`,
        title: itemTitle,
        description: text(record.description),
        image: text(record.image),
      });
    });
    return next;
  }, [packFallback]);

  const layout = normalizeServiceDetailLayout(
    text(selectedService?.layout) ||
      text(selectedService?.detailLayout) ||
      text(sectionData.layout) ||
      text(sectionData.detailLayout) ||
      NGO_SERVICE_DETAIL_LAYOUT,
  );

  const handleSelectCategory = (slug: string) => {
    const next = normalizeDetailSlug(slug);
    if (!next) return;
    writeNgoServiceDetailSlug(next);
    setSelectedSlug(next);
  };

  if (
    !selectedService &&
    !packFallback &&
    !text(sectionData.title) &&
    !categories.length
  ) {
    return null;
  }

  return (
    <main
      className="bg-white font-sans"
      style={{
        fontFamily:
          "var(--font-body, var(--font-general-sans-medium), ui-sans-serif, system-ui, sans-serif)",
      }}
      data-editor-section-label="Service Details"
      data-editor-fields="title,category,excerpt,content,image,layout,categories,sidebarCta"
      data-active-service-slug={activeSlug}
    >
      <NgoServiceDetailArticle
        key={`${title}-${layout}-${activeSlug}`}
        service={{
          title,
          category,
          excerpt,
          content,
          image,
          layout,
        }}
        categories={categories}
        activeCategorySlug={activeSlug}
        onSelectCategory={handleSelectCategory}
        sidebarCta={sidebarCta}
        features={features}
        subServices={subServices}
      />
    </main>
  );
}

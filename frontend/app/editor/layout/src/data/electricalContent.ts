import categoryContentJson from "./categoryContent.json";

type VariantRecord = Record<string, unknown>;

type ElectricalSource = {
  common?: VariantRecord;
  templateComponents?: {
    "template-1"?: { pages?: VariantRecord; sections?: VariantRecord };
  };
  templateData?: Record<string, ElectricalSource | undefined>;
  sections?: ElectricalSource;
};

const categoryPacks = (
  categoryContentJson as {
    categories?: Record<string, ElectricalSource | undefined>;
  }
).categories;

function electricalPack(source: ElectricalSource | undefined) {
  return (
    source?.templateData?.["template-electrical-1"] ||
    (source?.templateComponents || source?.common ? source : undefined)
  );
}

const electrical =
  electricalPack(categoryPacks?.["Home Services"]) ||
  categoryPacks?.Electrical;

const template = electrical?.templateComponents?.["template-1"];

export const electricalCommon = (electrical?.common || {}) as VariantRecord;
export const electricalPages = (template?.pages || {}) as VariantRecord;
export const electricalSections = (template?.sections || {}) as VariantRecord;

function asRecord(value: unknown): VariantRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as VariantRecord)
    : {};
}

export function electricalData<T>(data: unknown, fallback: T, _signature?: string): T {
  const record = asRecord(data);
  const base = asRecord(fallback);
  if (!Object.keys(base).length) {
    return (Object.keys(record).length ? record : fallback) as T;
  }
  // JSON fills anything the editor has not set. Editor values win so popup
  // changes (stats icons, labels, footer logo text) show on the page.
  return { ...base, ...record } as T;
}

function buildElectricalVariants(
  electricalCommon: VariantRecord,
  electricalPages: VariantRecord,
  electricalSections: VariantRecord,
) {
const topbarSource = asRecord(electricalCommon.Topbar);
const topbarContacts = Array.isArray(topbarSource.contact_info)
  ? (topbarSource.contact_info as { icon?: string; value?: string }[])
  : [];
const topbarValue = (icon: string) =>
  topbarContacts.find((item) => item.icon === icon)?.value || "";
const headerSource = asRecord(electricalCommon.Header);

return {
  ElectricalTopbar1: {
    ...topbarSource,
    phone: topbarValue("Phone"),
    email: topbarValue("Mail"),
    location: topbarValue("MapPin"),
    socialLinks: Array.isArray(topbarSource.socials)
      ? (topbarSource.socials as { icon?: string; href?: string }[]).map((item) => ({
          label:
            (
              {
                Facebook: "facebook",
                Instagram: "instagram",
                Twitter: "x",
                Linkedin: "linkedin",
              } as Record<string, string>
            )[item.icon || ""] || "facebook",
          href: item.href || "",
        }))
      : [],
    topbarBackgroundType: "solid",
    topbarBackgroundColor: "#06243b",
    topbarGradientColor: "#1B8A3E",
    topbarTextColor: "#ffffff",
    text: [typeof topbarSource.follow_text === "string" ? topbarSource.follow_text : ""],
  },
  ElectricalHeader1: {
    ...headerSource,
    logo: typeof headerSource.logo_text === "string" ? headerSource.logo_text : "",
    logoDisplay: "image",
    logoImage:
      typeof headerSource.logo_image === "string" && headerSource.logo_image
        ? headerSource.logo_image
        : "/categories/electrical/logo/logo.png",
    logoImageTitle:
      typeof headerSource.logo_text === "string" ? headerSource.logo_text : "Logo",
    buttons: [
      {
        label: typeof headerSource.button_text === "string" ? headerSource.button_text : "",
        href: typeof headerSource.button_link === "string" ? headerSource.button_link : "/get-a-quote",
        variant: "primary",
        icon: "arrow-right",
        iconPosition: "after",
      },
    ],
    menu: Array.isArray(headerSource.links)
      ? (headerSource.links as { name?: string; href?: string; sublinks?: { name?: string; href?: string }[] }[]).map(
          (link) => ({
            label: link.name || "",
            href: link.href || "/",
            menuType: link.sublinks?.length ? "dropdown" : "link",
            children: (link.sublinks || []).map((sub) => ({
              label: sub.name || "",
              href: sub.href || "/",
            })),
          }),
        )
      : [],
  },
  ElectricalFooter1: asRecord(electricalCommon.Footer),
  ElectricalBanner1: asRecord(electricalSections.hero),
  ElectricalAbout1: asRecord(electricalSections.about),
  ElectricalService1: asRecord(electricalSections.services),
  ElectricalStats1: asRecord(electricalSections.stats),
  ElectricalTestimonial1: asRecord(electricalSections.testimonials),
  ElectricalWhyChooseUs1: asRecord(electricalSections.why_choose),
  ElectricalHowWeWork1: asRecord(electricalSections.work_process),
  ElectricalContact1: asRecord(electricalSections.contact),
  ElectricalGallery1: asRecord(electricalSections.photo_gallery),
  ElectricalQuote1: asRecord(electricalSections.get_a_quote),
  ElectricalThankYou1: asRecord(electricalSections.thank_you),
  ElectricalNotFound1: asRecord(electricalPages.not_found),
  ElectricalBreadcrumb1: {
    title:
      typeof asRecord(electricalPages.about).title === "string"
        ? asRecord(electricalPages.about).title
        : "About Us",
    homeLabel: "Home",
    currentLabel:
      typeof asRecord(electricalPages.about).title === "string"
        ? asRecord(electricalPages.about).title
        : "About Us",
    backgroundImage: "/categories/electrical/img/breadcrumb.png",
    backgroundType: "image",
    backgroundColor: "#0b1a28",
    gradientColor: "#1B8A3E",
  },
  ElectricalServicePage1: asRecord(electricalSections.services),
  ElectricalAboutPage1: {
    page: asRecord(electricalPages.about),
    about: asRecord(electricalSections.about),
    stats: asRecord(electricalSections.stats),
    whyChoose: asRecord(electricalSections.why_choose),
    workProcess: asRecord(electricalSections.work_process),
  },
  ElectricalServiceDetails1: {
    services: asRecord(electricalSections.services),
    details: electricalSections.service_details,
    page: asRecord(electricalPages.service_details),
  },
};
}

export const electricalVariants = new Map<string, VariantRecord>(
  Object.entries(
    buildElectricalVariants(electricalCommon, electricalPages, electricalSections),
  ),
);

/** Replace local JSON copy when the admin bundle has HomeServices / Electrical content. */
export function applyElectricalCategoryPack(
  categories: Record<string, unknown> | undefined,
) {
  if (!categories) return;
  const raw =
    categories["Home Services"] ||
    categories.HomeServices ||
    categories.Electrical;
  if (!raw || typeof raw !== "object") return;
  const record = raw as ElectricalSource;
  const scoped = record.templateData?.["template-electrical-1"];
  const nested = scoped
    ? scoped
    : record.sections &&
        (record.sections.common || record.sections.templateComponents)
      ? record.sections
      : record;
  const common = (nested.common || {}) as VariantRecord;
  const pages = (nested.templateComponents?.["template-1"]?.pages ||
    {}) as VariantRecord;
  const sections = (nested.templateComponents?.["template-1"]?.sections ||
    {}) as VariantRecord;
  if (!Object.keys(common).length && !Object.keys(sections).length) return;
  const next = buildElectricalVariants(common, pages, sections);
  electricalVariants.clear();
  for (const [key, value] of Object.entries(next)) {
    electricalVariants.set(key, value);
  }
}

export function getElectricalVariant(name: string) {
  return electricalVariants.get(name);
}

/** Fields that are actually painted, in on-page order. */
export const electricalPopupFields: Record<string, readonly string[]> = {
  ElectricalTopbar1: ["follow_text", "contact_info", "socials"],
  ElectricalHeader1: ["logoImage", "logo_text", "links", "button_text", "button_link"],
  ElectricalBanner1: ["slides"],
  ElectricalAbout1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "title_line2",
    "description",
    "image",
    "badge",
    "cards",
    "features",
    "phone",
    "button",
  ],
  ElectricalService1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "title_line2",
    "description",
    "items",
    "button",
  ],
  ElectricalStats1: ["items"],
  ElectricalTestimonial1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "title_line2",
    "description",
    "reviews",
  ],
  ElectricalWhyChooseUs1: [
    "subtitle",
    "title_line1",
    "title_line2",
    "title_highlight",
    "description",
    "image",
    "badge_title",
    "badge_text",
    "items",
    "button",
  ],
  ElectricalHowWeWork1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "description",
    "steps",
    "button",
  ],
  ElectricalGallery1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "description",
    "filters",
    "items",
  ],
  ElectricalGalleryPage1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "description",
    "filters",
    "items",
  ],
  ElectricalFooter1: [
    "logo_text",
    "description",
    "socials",
    "quick_links",
    "our_services",
    "contact",
    "copyright",
  ],
  ElectricalContact1: ["cards", "form", "center", "features", "map"],
  ElectricalContactPage1: ["cards", "form", "center", "features", "map"],
  ElectricalQuote1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "description",
    "form",
    "image",
    "info_card",
    "features",
  ],
  ElectricalQuotePage1: [
    "subtitle",
    "title_line1",
    "title_highlight",
    "description",
    "form",
    "image",
    "info_card",
    "features",
  ],
  ElectricalThankYou1: ["title", "title_highlight", "description", "button"],
  ElectricalBreadcrumb1: [
    "title",
    "homeLabel",
    "currentLabel",
    "backgroundImage",
    "backgroundType",
    "backgroundColor",
    "gradientColor",
  ],
  ElectricalAboutPage1: ["about", "stats", "whyChoose", "workProcess"],
  ElectricalServicePage1: ["services", "stats"],
  ElectricalServiceDetails1: ["services", "details"],
};

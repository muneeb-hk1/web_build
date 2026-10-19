import categoryContentJson from "../../../data/ngoTheme2CategoryContent.json";

export type SiteSectionData = Record<string, any>;
export type CategorySite = Record<string, any>;

type SectionPack = {
  variants?: Record<string, unknown>;
} & Record<string, unknown>;

type CategoryPack = {
  sections?: Record<string, SectionPack>;
};

const categories = (
  categoryContentJson as { categories?: Record<string, CategoryPack> }
).categories ?? {};

const siteCache = new Map<string, CategorySite>();

const toSiteKey = (sectionName: string) => {
  if (/^[A-Z0-9]{2,4}$/.test(sectionName)) return sectionName.toLowerCase();
  return sectionName.charAt(0).toLowerCase() + sectionName.slice(1);
};

const normalizeSectionValue = (value: unknown) => {
  if (Array.isArray(value)) return { items: value };
  return (value ?? {}) as SiteSectionData;
};

const pickVariant = (pack: SectionPack | undefined, variantKey?: string) => {
  if (!pack) return {};
  const variants = pack.variants;
  if (variants && typeof variants === "object") {
    if (variantKey && variantKey in variants) return variants[variantKey];
    const firstKey = Object.keys(variants)[0];
    return firstKey ? variants[firstKey] : {};
  }
  const { variants: _ignored, ...flat } = pack;
  return flat;
};

const withAliases = (site: CategorySite): CategorySite => {
  if (site.about) {
    const aboutPage = site.aboutPage;
    const aboutPageMissingBody =
      !aboutPage ||
      !Array.isArray(aboutPage.features) ||
      !aboutPage.features.length;
    site.aboutPage = aboutPageMissingBody
      ? {
          ...site.about,
          ...(aboutPage ?? {}),
          banner: {
            ...(site.about.banner ?? {}),
            ...(aboutPage?.banner ?? {}),
          },
          sideImages: {
            ...(site.about.sideImages ?? {}),
            ...(aboutPage?.sideImages ?? {}),
          },
          features:
            Array.isArray(aboutPage?.features) && aboutPage.features.length
              ? aboutPage.features
              : site.about.features ?? [],
          checklist:
            Array.isArray(aboutPage?.checklist) && aboutPage.checklist.length
              ? aboutPage.checklist
              : site.about.checklist ?? [],
          button: {
            ...(site.about.button ?? {}),
            ...(aboutPage?.button ?? {}),
          },
        }
      : aboutPage;
  }
  if (site.howWeHelp && !site.help) {
    site.help = site.howWeHelp;
  } else if (site.help && !site.howWeHelp) {
    site.howWeHelp = site.help;
  }
  if (site.projectsPage && !site.portfolioPage) {
    site.portfolioPage = site.projectsPage;
  } else if (
    site.projectsPage &&
    (!Array.isArray(site.portfolioPage?.projects) ||
      !site.portfolioPage.projects.length)
  ) {
    site.portfolioPage = {
      ...site.projectsPage,
      ...site.portfolioPage,
      banner: {
        ...(site.projectsPage.banner ?? {}),
        ...(site.portfolioPage?.banner ?? {}),
      },
      projects:
        Array.isArray(site.portfolioPage?.projects) &&
        site.portfolioPage.projects.length
          ? site.portfolioPage.projects
          : site.projectsPage.projects ?? [],
      categories:
        Array.isArray(site.portfolioPage?.categories) &&
        site.portfolioPage.categories.length
          ? site.portfolioPage.categories
          : site.projectsPage.categories ?? [],
    };
  }
  if (site.portfolioPage && !site.projectsPage) {
    site.projectsPage = site.portfolioPage;
  }
  if (site.team && !site.teamPage) site.teamPage = site.team;
  if (site.teamPage && !site.team) site.team = site.teamPage;
  if (site.events && !site.eventPage) site.eventPage = site.events;
  if (site.eventPage && !site.events) site.events = site.eventPage;
  if (site.service && !site.servicePage) site.servicePage = site.service;
  if (site.servicePage && !site.service) site.service = site.servicePage;
  if (site.award && !site.awards) site.awards = site.award;
  if (site.csr && !site.csrPage) site.csrPage = site.csr;
  return site;
};

/** Build the `site` fallback object used by NGO-style templates. */
export function getSite(category: string, variantPrefix?: string): CategorySite {
  const cacheKey = `${category}::${variantPrefix || ""}`;
  const cached = siteCache.get(cacheKey);
  if (cached) return cached;

  const pack =
    categories[category] ||
    Object.entries(categories).find(
      ([name]) => name.toLowerCase() === category.toLowerCase(),
    )?.[1];

  const sections = pack?.sections ?? {};
  const site: CategorySite = {};

  for (const [sectionName, sectionPack] of Object.entries(sections)) {
    const preferredKey = variantPrefix
      ? Object.keys(sectionPack.variants ?? {}).find((key) =>
          key.toLowerCase().startsWith(variantPrefix.toLowerCase()),
        )
      : undefined;
    site[toSiteKey(sectionName)] = normalizeSectionValue(
      pickVariant(sectionPack, preferredKey),
    );
  }

  const resolved = withAliases(site);
  siteCache.set(cacheKey, resolved);
  return resolved;
}

export function getSection<T = SiteSectionData>(
  category: string,
  sectionName: string,
  variantKey?: string,
): T {
  const pack = (
    categories[category] ||
    Object.entries(categories).find(
      ([name]) => name.toLowerCase() === category.toLowerCase(),
    )?.[1]
  )?.sections?.[sectionName];

  return normalizeSectionValue(pickVariant(pack, variantKey)) as T;
}

/** Current NGO template. New categories should call `getSite("Hospital")` instead of adding a new file. */
export const site = getSite("NGO", "NGO");

export type NGOHeaderData = SiteSectionData;
export type NGOFooterData = SiteSectionData;
export type NGOBannerData = SiteSectionData;
export type NGOAboutPageData = SiteSectionData;
export type NGOWhyChooseUsData = SiteSectionData;
export type NGOHowWeHelpData = SiteSectionData;
export type NGOStatsDataData = SiteSectionData;
export type NGOGalleryData = SiteSectionData;
export type NGOBlogData = SiteSectionData;
export type NGOBlogDetailsData = SiteSectionData;
export type NGOTeamData = SiteSectionData;
export type NGOTeamDetailsData = SiteSectionData;
export type NGOTestimonialData = SiteSectionData;
export type NGOContactData = SiteSectionData;
export type NGOFaqData = SiteSectionData;
export type NGOPrivacyPolicyData = SiteSectionData;
export type NGORefundPolicyData = SiteSectionData;
export type NGOCookiePolicyData = SiteSectionData;
export type NGODisclaimerData = SiteSectionData;
export type NGOTermsConditionsData = SiteSectionData;
export type NGOEventsData = SiteSectionData;
export type NGOEventDetailsData = SiteSectionData;
export type NGOCareerData = SiteSectionData;
export type NGOJobDetailsDataData = SiteSectionData;
export type NGOProjectsPageData = SiteSectionData;
export type NGOProjectDetailData = SiteSectionData;
export type NGOPartnersSponsorsData = SiteSectionData;
export type NGOSitemapData = SiteSectionData;
export type NGOServiceData = SiteSectionData;
export type NGOServicesdetailsPageData = SiteSectionData;
export type NGOAwardData = SiteSectionData;
export type NGOCsrData = SiteSectionData;
export type NGOEnquiryData = SiteSectionData;
export type NGOSupportData = SiteSectionData;
export type NGOBranchesData = SiteSectionData;
export type NGOBrochureData = SiteSectionData;
export type NGOMediaData = SiteSectionData;
export type NGODonateData = SiteSectionData;
export type NGOCtaBannerData = SiteSectionData;
export type NGOFactsData = SiteSectionData;
export type NGOMissionPageData = SiteSectionData;
export type NGOVisionData = SiteSectionData;
export type NGOCaseStudyPageData = SiteSectionData;

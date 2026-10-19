type NavLinkLike = {
  href?: string;
  label?: string;
  kind?: string;
  hidden?: boolean;
  children?: NavLinkLike[];
};

type SectionLike = {
  id?: string;
  type?: string;
  page?: string;
};

type FooterColumnLike = {
  title?: string;
  links?: NavLinkLike[];
  hidden?: boolean;
  [key: string]: unknown;
};

const normalizeHref = (href?: string) => (href || "").trim().toLowerCase();

const flattenLinks = (links: NavLinkLike[]): NavLinkLike[] =>
  links.flatMap((link) => [link, ...flattenLinks(link.children || [])]);

const hrefSlug = (href?: string) => {
  const value = normalizeHref(href);
  if (!value.startsWith("#page-")) return "";
  return value.slice("#page-".length);
};

const normalizeLabel = (label?: string) => (label || "").trim().toLowerCase();

const normalizePageSlug = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Manager “Show on website” pages — match nav even when href slug differs (blog vs blogs). */
export const managerFamily = (link: NavLinkLike): string => {
  const kind = (link.kind || "").trim().toLowerCase();
  const href = normalizeHref(link.href);
  const label = normalizeLabel(link.label);
  const slug = hrefSlug(link.href);

  if (kind === "blogindex") return "blogs";
  // Individual blog posts are not the manager index.
  if (kind === "blog") return "";
  if (
    href === "#page-blogs" ||
    href === "#page-blog" ||
    href === "#blogs" ||
    slug === "blogs" ||
    slug === "blog" ||
    label === "blogs" ||
    label === "blog"
  ) {
    return "blogs";
  }
  if (
    href === "#page-services" ||
    href === "#page-service" ||
    slug === "services" ||
    slug === "service" ||
    label === "services" ||
    label === "service"
  ) {
    return "services";
  }
  if (
    href === "#page-events" ||
    href === "#page-event" ||
    slug === "events" ||
    slug === "event" ||
    label === "events" ||
    label === "event"
  ) {
    return "events";
  }
  if (
    href === "#page-properties" ||
    href === "#page-property" ||
    slug === "properties" ||
    slug === "property" ||
    label === "properties" ||
    label === "property"
  ) {
    return "properties";
  }
  if (
    href === "#page-portfolio" ||
    href === "#page-projects" ||
    href === "#page-project" ||
    slug === "portfolio" ||
    slug === "projects" ||
    slug === "project" ||
    label === "portfolio" ||
    label === "projects" ||
    label === "project"
  ) {
    return "portfolio";
  }
  if (
    href === "#page-teams" ||
    href === "#page-team" ||
    slug === "teams" ||
    slug === "team" ||
    label === "teams" ||
    label === "team"
  ) {
    return "teams";
  }
  if (
    href === "#page-gallery" ||
    slug === "gallery" ||
    label === "gallery"
  ) {
    return "gallery";
  }
  return "";
};

/** Hidden manager families from pageLinks (Show on website off). */
export function getHiddenManagerFamilies(
  pageLinks: NavLinkLike[] | undefined | null,
): Set<string> {
  const hidden = new Set<string>();
  for (const link of flattenLinks(Array.isArray(pageLinks) ? pageLinks : [])) {
    if (!link.hidden || link.kind === "blog") continue;
    const family = managerFamily(link);
    if (family) hidden.add(family);
  }
  return hidden;
}

const labelHitsFamily = (label: string, family: string) => {
  if (family === "blogs") return /\bblogs?\b/.test(label);
  if (family === "services") return /\bservices?\b/.test(label);
  if (family === "events") return /\bevents?\b/.test(label);
  if (family === "properties") return /\bpropert(?:y|ies)\b/.test(label);
  if (family === "portfolio")
    return /\bportfolio\b|\bprojects?\b/.test(label);
  if (family === "teams") return /\bteams?\b/.test(label);
  if (family === "gallery") return /\bgallery\b/.test(label);
  return false;
};

/** Map a canvas section to a manager family (home teaser + dedicated pages). */
export function sectionManagerFamily(section: SectionLike): string {
  const id = (section.id || "").trim();
  const type = (section.type || "").trim();
  const page = normalizePageSlug(section.page);

  if (type === "CountriesServe") return "countries";

  if (
    id === "BlogPage" ||
    type === "BlogPage" ||
    page === "blogs" ||
    page === "blog" ||
    (type === "Blog" && !page)
  ) {
    return "blogs";
  }
  if (
    id === "ServicePage" ||
    type === "ServicePage" ||
    page === "services" ||
    page === "service" ||
    (type === "Service" && !page)
  ) {
    return "services";
  }
  if (
    id === "EventPage" ||
    type === "EventPage" ||
    page === "events" ||
    page === "event" ||
    (type === "Event" && !page)
  ) {
    return "events";
  }
  if (
    id === "GalleryPage" ||
    type === "GalleryPage" ||
    page === "gallery" ||
    (type === "Gallery" && !page)
  ) {
    return "gallery";
  }
  if (
    id === "TeamPage" ||
    type === "TeamPage" ||
    page === "teams" ||
    page === "team" ||
    (type === "Team" && !page)
  ) {
    return "teams";
  }
  if (
    id === "PortfolioPage" ||
    type === "PortfolioPage" ||
    type === "Cities" ||
    page === "portfolio" ||
    page === "projects" ||
    page === "project" ||
    (type === "Portfolio" && !page)
  ) {
    return "portfolio";
  }
  if (
    id === "PropertyPage" ||
    type === "PropertyPage" ||
    type === "Highlight" ||
    type === "Featured" ||
    type === "BuyPropertyPage" ||
    type === "RentPage" ||
    page === "properties" ||
    page === "property" ||
    (type === "Property" && !page)
  ) {
    return "properties";
  }
  return "";
}

export function shouldHideSectionForManagers(
  section: SectionLike,
  pageLinks: NavLinkLike[] | undefined | null,
): boolean {
  const hidden = getHiddenManagerFamilies(pageLinks);
  if (!hidden.size) return false;
  const family = sectionManagerFamily(section);
  return Boolean(family && hidden.has(family));
}

export function filterSectionsByHiddenManagers<T extends SectionLike>(
  sections: T[] | undefined | null,
  pageLinks: NavLinkLike[] | undefined | null,
  opts?: { onlyHomeTeasers?: boolean },
): T[] {
  if (!Array.isArray(sections) || !sections.length) return [];
  const hidden = getHiddenManagerFamilies(pageLinks);
  if (!hidden.size) return sections;
  return sections.filter((section) => {
    // Keep chrome so header/footer still render (they filter their own links).
    if (
      section.type === "Topbar" ||
      section.type === "Header" ||
      section.type === "Footer"
    ) {
      return true;
    }
    const family = sectionManagerFamily(section);
    if (!(family && hidden.has(family))) return true;
    // Editor: keep dedicated manager pages editable; only strip home teasers.
    if (opts?.onlyHomeTeasers) {
      const page = normalizePageSlug(section.page);
      if (page && page !== "home") return true;
    }
    return false;
  });
}

export function filterFooterColumnsByHiddenPageLinks<T extends FooterColumnLike>(
  columns: T[] | undefined | null,
  pageLinks: NavLinkLike[] | undefined | null,
): T[] {
  if (!Array.isArray(columns) || !columns.length) return [];
  const hidden = getHiddenManagerFamilies(pageLinks);
  if (!hidden.size) return columns;

  return columns.map((column) => {
    const links = Array.isArray(column.links) ? column.links : [];
    return {
      ...column,
      links: links.filter((link) => {
        const family = managerFamily(link);
        if (family && hidden.has(family)) return false;
        const label = normalizeLabel(link.label);
        for (const fam of hidden) {
          if (labelHitsFamily(label, fam)) return false;
        }
        return true;
      }),
    } as T;
  });
}

/** Hide nav entries whose matching pageLink is marked hidden (Show on website off). */
export function filterMenuByHiddenPageLinks<T extends NavLinkLike>(
  menu: T[] | undefined | null,
  pageLinks: NavLinkLike[] | undefined | null,
): T[] {
  if (!Array.isArray(menu) || !menu.length) return [];
  const flat = flattenLinks(Array.isArray(pageLinks) ? pageLinks : []);
  if (!flat.some((link) => link.hidden)) {
    return menu;
  }

  const isHiddenItem = (item: NavLinkLike) => {
    const itemHref = normalizeHref(item.href);
    const itemSlug = hrefSlug(item.href);
    const itemLabel = normalizeLabel(item.label);
    const itemFamily = managerFamily(item);

    return flat.some((link) => {
      if (!link.hidden) return false;
      // Never hide individual blog *posts* via this nav filter — only index/manager pages.
      if (link.kind === "blog") return false;

      const linkHref = normalizeHref(link.href);
      const linkSlug = hrefSlug(link.href);
      const linkLabel = normalizeLabel(link.label);
      const linkFamily = managerFamily(link);

      if (itemHref && linkHref && itemHref === linkHref) return true;
      if (itemSlug && linkSlug && itemSlug === linkSlug) return true;
      if (itemFamily && linkFamily && itemFamily === linkFamily) return true;
      if (itemLabel && linkLabel && itemLabel === linkLabel) return true;
      if (linkFamily && labelHitsFamily(itemLabel, linkFamily)) return true;
      return false;
    });
  };

  return menu.flatMap((item) => {
    if (isHiddenItem(item)) return [];
    const children = Array.isArray(item.children)
      ? filterMenuByHiddenPageLinks(item.children as T[], pageLinks)
      : item.children;
    return [{ ...item, children } as T];
  });
}

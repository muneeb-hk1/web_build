/**
 * Blog posts live in pageLinks (kind: "blog") and as BlogPage sections.
 * If pageLinks records are lost but BlogPage sections or template blogItems remain,
 * rebuild the links so /blogs and the Blog manager stay in sync with saved content.
 */

type BlogLinkLike = {
  label: string;
  href: string;
  kind?: string;
  hidden?: boolean;
  layout?: string;
  author?: string;
  image?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  category?: string;
  createdAt?: string;
  children?: BlogLinkLike[];
};

type BlogSectionLike = {
  type?: string;
  page?: string;
  variant?: string;
  data?: Record<string, Record<string, unknown> | undefined>;
};

const flattenLinks = <T extends { children?: T[] }>(links: T[]): T[] =>
  links.flatMap((link) => [link, ...flattenLinks(link.children || [])]);

const normalizeHref = (href?: string) => (href || "").trim().toLowerCase();

const isBlogPostPageSlug = (page?: string) => {
  const slug = (page || "").trim().toLowerCase();
  if (!slug) return false;
  // Index / reserved — not individual posts
  if (slug === "blog" || slug === "blogs") return false;
  return true;
};

const blogSlugFromSectionPage = (page: string) => {
  const normalized = page.trim().toLowerCase();
  if (normalized.startsWith("blog-") && normalized.length > "blog-".length) {
    return normalized.slice("blog-".length);
  }
  return normalized;
};

const blogSlugFromHref = (href?: string) => {
  const normalized = normalizeHref(href);
  if (!normalized.startsWith("#page-")) return "";
  return blogSlugFromSectionPage(normalized.slice("#page-".length));
};

const slugifyBlogTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type BlogItemLike = {
  title?: unknown;
  label?: unknown;
  href?: unknown;
  slug?: unknown;
  image?: unknown;
  excerpt?: unknown;
  desc?: unknown;
  description?: unknown;
  body?: unknown;
  content?: unknown;
  date?: unknown;
  category?: unknown;
  author?: unknown;
};

const asText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const GENERIC_BLOG_HREF_SLUGS = new Set([
  "blog",
  "blogs",
  "blog-detail",
  "blog-details",
  "blogdetails",
  "detail",
  "details",
  "index",
  "post",
  "posts",
]);

const normalizeBlogSlugCandidate = (value: string) =>
  value
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

const isUsableBlogSlug = (value: string) => {
  const normalized = normalizeBlogSlugCandidate(value);
  if (!normalized) return false;
  if (normalized.includes("/")) return false;
  if (GENERIC_BLOG_HREF_SLUGS.has(normalized)) return false;
  return true;
};

const slugFromBlogItem = (item: BlogItemLike) => {
  const explicit = asText(item.slug);
  if (explicit && isUsableBlogSlug(explicit)) {
    return blogSlugFromSectionPage(normalizeBlogSlugCandidate(explicit));
  }

  const href = asText(item.href);
  if (href && !href.startsWith("#") && href !== "/") {
    const last =
      href
        .split("?")[0]
        .replace(/\/+$/, "")
        .split("/")
        .filter(Boolean)
        .pop() || "";
    if (last && isUsableBlogSlug(last)) {
      return last;
    }
  }

  const title = asText(item.title) || asText(item.label);
  return title ? slugifyBlogTitle(title) : "";
};

const isHomeBlogSection = (section: BlogSectionLike) =>
  section.type === "Blog" && !(section.page || "").trim();

const isBlogListingSection = (section: BlogSectionLike) => {
  if (section.type !== "BlogPage") return false;
  const page = (section.page || "").trim().toLowerCase();
  return page === "blog" || page === "blogs";
};

const readBlogItemsFromSection = (section: BlogSectionLike): BlogItemLike[] => {
  const data = section.data || {};
  const variant = section.variant;
  const variantKeys = [
    variant,
    "Blog-11",
    "Blog-10",
    "Blog-9",
    "Blog-5",
    "Blog-1",
    "BlogPage-11",
    "BlogPage-10",
    "BlogPage-9",
    "BlogPage-1",
    "BlogPage-6",
    ...Object.keys(data),
  ].filter(Boolean) as string[];

  const seenKeys = new Set<string>();
  for (const key of variantKeys) {
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    const variantData = data[key];
    if (!variantData || typeof variantData !== "object") continue;
    const raw =
      (variantData as Record<string, unknown>).articles ??
      (variantData as Record<string, unknown>).blogItems ??
      (variantData as Record<string, unknown>).posts ??
      (variantData as Record<string, unknown>).galleryItems;
    if (!Array.isArray(raw)) continue;
    const items = raw.filter(
      (entry): entry is BlogItemLike =>
        Boolean(entry) && typeof entry === "object",
    );
    if (items.length) return items;
  }
  return [];
};

const blogItemToLink = (item: BlogItemLike): BlogLinkLike | null => {
  const title = asText(item.title) || asText(item.label);
  if (!title) return null;

  const slug = slugFromBlogItem(item);
  if (!slug) return null;

  const excerpt =
    asText(item.excerpt) || asText(item.desc) || asText(item.description);
  const content = asText(item.body) || asText(item.content) || excerpt;

  return {
    label: title,
    href: `#page-blog-${slug}`,
    kind: "blog",
    hidden: false,
    slug,
    layout: "BlogPage-1",
    author: asText(item.author) || "Website author",
    image: typeof item.image === "string" ? item.image : undefined,
    shortDescription: excerpt || undefined,
    longDescription: content || undefined,
    category: asText(item.category) || "General",
    createdAt: asText(item.date) || undefined,
  };
};

const blogLinkScore = (link: BlogLinkLike) => {
  let score = 0;
  const author = (link.author || "").trim().toLowerCase();
  if (author && author !== "website author") score += 4;
  const category = (link.category || "").trim().toLowerCase();
  if (category && category !== "general") score += 2;
  const description = (link.shortDescription || "").trim();
  if (
    description &&
    !/^a short intro for /i.test(description) &&
    description.toLowerCase() !== "read this blog post."
  ) {
    score += 1;
  }
  return score;
};

/** Home teasers and the blog page repeat the same posts under different slugs. */
const collapseDuplicateBlogTitles = <T extends BlogLinkLike>(links: T[]): T[] => {
  const bestByTitle = new Map<string, T>();
  const visit = (items: T[]) => {
    for (const link of items) {
      if (link.kind === "blog") {
        const key = (link.label || "").trim().toLowerCase();
        if (key) {
          const current = bestByTitle.get(key);
          if (!current || blogLinkScore(link) > blogLinkScore(current)) {
            bestByTitle.set(key, link);
          }
        }
      }
      if (link.children?.length) visit(link.children as T[]);
    }
  };
  visit(links);
  const filter = (items: T[]): T[] =>
    items.flatMap((link) => {
      if (link.kind === "blog") {
        const key = (link.label || "").trim().toLowerCase();
        if (key && bestByTitle.get(key) !== link) return [];
      }
      if (!link.children?.length) return [link];
      return [{ ...link, children: filter(link.children as T[]) }];
    });
  return filter(links);
};

const readSectionData = (section: BlogSectionLike) => {
  const data = section.data || {};
  const variant = section.variant || "BlogPage-1";
  const variantData =
    data[variant] ||
    data["BlogPage-1"] ||
    data["BlogPage-2"] ||
    data["BlogPage-3"] ||
    Object.values(data)[0];
  return variantData && typeof variantData === "object" ? variantData : {};
};

const isPlaceholderBlogLink = (link: BlogLinkLike) => {
  if (link.kind !== "blog") return false;
  const rawSlug = (link.slug || blogSlugFromHref(link.href) || "").trim();
  return !isUsableBlogSlug(rawSlug);
};

export function recoverBlogPageLinksFromSections<T extends BlogLinkLike>(
  pageLinks: T[],
  sections: BlogSectionLike[] | undefined,
): T[] {
  // Drop theme stubs that all shared `/blog-details` so unique title slugs can recover.
  const prunePlaceholders = (items: T[]): T[] =>
    items.flatMap((link) => {
      if (isPlaceholderBlogLink(link)) return [];
      if (!link.children?.length) return [link];
      return [{ ...link, children: prunePlaceholders(link.children as T[]) }];
    });
  const workingLinks = prunePlaceholders(pageLinks);

  const existingHrefs = new Set<string>();
  const existingSlugs = new Set<string>();

  for (const link of flattenLinks(workingLinks)) {
    if (link.kind !== "blog") continue;
    existingHrefs.add(normalizeHref(link.href));
    const slug = (link.slug || blogSlugFromHref(link.href)).trim().toLowerCase();
    if (slug) existingSlugs.add(slug);
  }

  const recovered: T[] = [];

  const rememberBlogLink = (link: BlogLinkLike) => {
    const slug = (link.slug || blogSlugFromHref(link.href)).trim().toLowerCase();
    if (slug && existingSlugs.has(slug)) return false;
    const hrefKey = normalizeHref(link.href);
    if (existingHrefs.has(hrefKey)) return false;
    recovered.push(link as T);
    existingHrefs.add(hrefKey);
    if (slug) existingSlugs.add(slug);
    return true;
  };

  for (const section of sections || []) {
    if (section.type !== "BlogPage") continue;
    const page = (section.page || "").trim();
    if (!isBlogPostPageSlug(page)) continue;

    const href = `#page-${page}`;
    if (existingHrefs.has(normalizeHref(href))) continue;

    const data = readSectionData(section);
    const title =
      (typeof data.title === "string" && data.title.trim()) ||
      blogSlugFromSectionPage(page) ||
      "Untitled post";
    const layout =
      (typeof data.layout === "string" && data.layout) ||
      section.variant ||
      "BlogPage-1";

    rememberBlogLink({
      label: title,
      href,
      kind: "blog",
      hidden: false,
      slug: blogSlugFromSectionPage(page),
      layout,
      author: typeof data.author === "string" ? data.author : undefined,
      image: typeof data.image === "string" ? data.image : undefined,
      shortDescription:
        typeof data.excerpt === "string" ? data.excerpt : undefined,
      longDescription:
        typeof data.content === "string" ? data.content : undefined,
      category: typeof data.category === "string" ? data.category : undefined,
    });
  }

  for (const section of sections || []) {
    if (!isHomeBlogSection(section) && !isBlogListingSection(section)) continue;
    for (const item of readBlogItemsFromSection(section)) {
      const link = blogItemToLink(item);
      if (link) rememberBlogLink(link);
    }
  }

  if (!recovered.length) return collapseDuplicateBlogTitles(workingLinks);
  return collapseDuplicateBlogTitles([...workingLinks, ...recovered]);
}

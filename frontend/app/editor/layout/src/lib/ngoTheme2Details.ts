const slugify = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/^#page-/, "")
    .replace(/^\/+/, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isBareDetailSlug = (value: string) =>
  /^(blog|event|team|project|service)-?details?$/.test(value);

const slugFromHref = (href?: string) => {
  const raw = String(href || "");
  const query = raw.match(/[?&]slug=([^&]+)/i);
  if (query?.[1]) {
    try {
      return slugify(decodeURIComponent(query[1]));
    } catch {
      return slugify(query[1]);
    }
  }
  return slugify(raw);
};

const meaningfulSlug = (...values: unknown[]) => {
  for (const value of values) {
    const hrefSlug = slugFromHref(String(value ?? ""));
    if (hrefSlug && !isBareDetailSlug(hrefSlug)) return hrefSlug;
    const next = slugify(String(value ?? ""));
    if (next && !isBareDetailSlug(next)) return next;
  }
  return "";
};

const itemSlug = (item: Record<string, unknown>) =>
  meaningfulSlug(
    item.slug,
    item.href,
    item.title,
    item.label,
    item.name,
    item.id,
  );

const findBySlug = (
  list: unknown,
  slug: string,
): Record<string, unknown> | undefined => {
  if (!Array.isArray(list) || !slug) return undefined;
  return list.find((item) => {
    if (!item || typeof item !== "object") return false;
    return itemSlug(item as Record<string, unknown>) === slugify(slug);
  }) as Record<string, unknown> | undefined;
};

const readStoredSlug = (key: string) => {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
};

const writeStoredSlug = (key: string, slug: string) => {
  if (typeof window === "undefined") return slug;
  try {
    window.sessionStorage.setItem(key, slugify(slug));
  } catch {
    /* ignore */
  }
  return slugify(slug);
};

export const NGO_BLOG_DETAIL_SLUG_EVENT = "ngo-blog-detail-slug";
export const resolveNgoBlogPostSlug = (input: {
  slug?: string;
  href?: string;
  title?: string;
  label?: string;
  name?: string;
  id?: string | number;
}) =>
  meaningfulSlug(
    input.slug,
    input.href,
    input.title,
    input.label,
    input.name,
    input.id,
  ) || "post";
export const getNgoBlogDetailHref = (input: {
  slug?: string;
  title?: string;
  href?: string;
}) => `/blog-details?slug=${resolveNgoBlogPostSlug(input)}`;
export const writeNgoBlogDetailSlug = (slug: string) => {
  const value = writeStoredSlug("ngo-blog-slug", slug);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NGO_BLOG_DETAIL_SLUG_EVENT, { detail: { slug: value } }),
    );
  }
  return value;
};
export const readNgoBlogDetailSlug = () => readStoredSlug("ngo-blog-slug");
export const findNgoBlogPost = (list: unknown, slug: string) =>
  findBySlug(list, slug);
export const buildNgoBlogDetailFields = (post: Record<string, unknown> = {}) =>
  post;
export const buildReadableNgoBlogBody = (post: Record<string, unknown> = {}) =>
  String(post.content || post.body || post.description || post.desc || "");

export const NGO_SERVICE_DETAIL_SLUG_EVENT = "ngo-service-detail-slug";
export const NGO_SERVICE_DETAIL_LAYOUT = "ServiceDetail-1";
export const resolveNgoServiceSlug = resolveNgoBlogPostSlug;
export const resolveNgoServiceDetailSlug = resolveNgoServiceSlug;
export const getNgoServiceDetailHref = (input: {
  slug?: string;
  title?: string;
  href?: string;
}) => `/service-details?slug=${resolveNgoServiceSlug(input)}`;
export const writeNgoServiceDetailSlug = (slug: string) => {
  const value = writeStoredSlug("ngo-service-slug", slug);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NGO_SERVICE_DETAIL_SLUG_EVENT, {
        detail: { slug: value },
      }),
    );
  }
  return value;
};
export const readNgoServiceDetailSlug = () => readStoredSlug("ngo-service-slug");
export const findNgoService = (list: unknown, slug: string) =>
  findBySlug(list, slug);
export const buildReadableNgoServiceBody = (
  item: Record<string, unknown> = {},
) => String(item.content || item.body || item.description || item.desc || "");
export const extractNgoServiceThemeCategories = () => [] as string[];
export const resolveNgoServiceCategoryLabel = (value?: string) => value || "";
export const resolveServicePackFromMap = (
  map: unknown,
  slug: string,
) => findBySlug(map, slug) || {};

export const NGO_PROJECT_DETAIL_SLUG_EVENT = "ngo-project-detail-slug";
export const resolveNgoProjectSlug = resolveNgoBlogPostSlug;
export const getNgoProjectDetailHref = (input: {
  slug?: string;
  title?: string;
  href?: string;
}) => `/project-details?slug=${resolveNgoProjectSlug(input)}`;
export const writeNgoProjectDetailSlug = (slug: string) => {
  const value = writeStoredSlug("ngo-project-slug", slug);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NGO_PROJECT_DETAIL_SLUG_EVENT, {
        detail: { slug: value },
      }),
    );
  }
  return value;
};
export const readNgoProjectDetailSlug = () =>
  readStoredSlug("ngo-project-slug");
export const findNgoProject = (list: unknown, slug: string) =>
  findBySlug(list, slug);
export const buildNgoProjectDetailFields = (
  item: Record<string, unknown> = {},
) => item;
export const buildReadableNgoProjectBody = (
  item: Record<string, unknown> = {},
) => String(item.content || item.body || item.description || item.desc || "");

export const NGO_TEAM_DETAIL_SLUG_EVENT = "ngo-team-detail-slug";
export const resolveNgoTeamSlug = resolveNgoBlogPostSlug;
export const getNgoTeamDetailHref = (input: {
  slug?: string;
  title?: string;
  href?: string;
}) => `/team-details?slug=${resolveNgoTeamSlug(input)}`;
export const writeNgoTeamDetailSlug = (slug: string) => {
  const value = writeStoredSlug("ngo-team-slug", slug);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NGO_TEAM_DETAIL_SLUG_EVENT, { detail: { slug: value } }),
    );
  }
  return value;
};
export const readNgoTeamDetailSlug = () => readStoredSlug("ngo-team-slug");
export const findNgoTeamMember = (list: unknown, slug: string) =>
  findBySlug(list, slug);
export const buildReadableNgoTeamBody = (item: Record<string, unknown> = {}) =>
  String(item.bio || item.content || item.description || item.desc || "");
export const isAutoGeneratedTeamBody = () => false;
export const isMismatchedTeamPackBody = () => false;

export const NGO_EVENT_DETAIL_SLUG_EVENT = "ngo-event-detail-slug";
export const resolveNgoEventSlug = resolveNgoBlogPostSlug;
export const getNgoEventDetailHref = (input: {
  slug?: string;
  title?: string;
  href?: string;
}) => `/event-details?slug=${resolveNgoEventSlug(input)}`;
export const writeNgoEventDetailSlug = (slug: string) => {
  const value = writeStoredSlug("ngo-event-slug", slug);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NGO_EVENT_DETAIL_SLUG_EVENT, { detail: { slug: value } }),
    );
  }
  return value;
};
export const readNgoEventDetailSlug = () => readStoredSlug("ngo-event-slug");
export const findNgoEvent = (list: unknown, slug: string) =>
  findBySlug(list, slug);
export const buildReadableNgoEventBody = (item: Record<string, unknown> = {}) =>
  String(item.content || item.body || item.description || item.desc || "");
export const isAutoGeneratedEventBody = () => false;
export const isMismatchedEventPackBody = () => false;

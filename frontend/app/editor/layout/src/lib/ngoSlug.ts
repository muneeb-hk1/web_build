const slugify = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/^#page-/, "")
    .replace(/^\/+/, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const makeDetailHelpers = (pagePath: string) => {
  const resolveSlug = (input: {
    slug?: string;
    href?: string;
    title?: string;
    label?: string;
  }) =>
    slugify(input.slug) ||
    slugify(input.href) ||
    slugify(input.title) ||
    slugify(input.label) ||
    "item";

  const getHref = (input: {
    slug?: string;
    title?: string;
    href?: string;
  }) => {
    const slug = resolveSlug(input);
    return `${pagePath}${slug}`;
  };

  const writeSlug = (slug: string) => slugify(slug);

  return { resolveSlug, getHref, writeSlug };
};

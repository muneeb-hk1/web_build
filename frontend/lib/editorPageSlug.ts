/** Editor URL `page=` query + section.page slug helpers */

export function createPageSlug(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePageSlug(value: string) {
  const slug = createPageSlug(value);
  if (slug === "service") return "services";
  if (slug === "event") return "events";
  if (slug === "property") return "properties";
  if (slug === "portfolios") return "portfolio";
  if (slug === "project" || slug === "our-projects") return "projects";
  if (slug === "team") return "teams";
  if (slug === "about-us") return "about";
  if (slug === "contact-us") return "contact";
  // Legacy URL with literal "&" → mission-&-vision
  if (slug === "mission-and-vision" || slug === "mission-vision") {
    return "mission-vision";
  }
  return slug;
}

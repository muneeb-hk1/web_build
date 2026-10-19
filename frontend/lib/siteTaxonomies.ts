/** Per-site editor category/type lists — local cache synced into Site.config.taxonomies */

export type SiteTaxonomies = {
  galleryCategories?: string[];
  teamCategories?: string[];
  portfolioCategories?: string[];
  blogCategories?: string[];
  serviceCategories?: string[];
  eventCategories?: string[];
  propertyCategories?: string[];
  propertyTypes?: unknown[];
  propertyListingTypes?: unknown[];
};

export type TaxonomyStringField = Exclude<
  keyof SiteTaxonomies,
  "propertyTypes" | "propertyListingTypes"
>;

export const TAXONOMIES_CHANGED_EVENT = "ai-builder-taxonomies-changed";

const LEGACY_KEYS: Record<keyof SiteTaxonomies, string> = {
  galleryCategories: "ai-builder-gallery-categories",
  teamCategories: "ai-builder-team-categories",
  portfolioCategories: "ai-builder-portfolio-categories",
  blogCategories: "ai-builder-blog-categories",
  serviceCategories: "ai-builder-service-categories",
  eventCategories: "ai-builder-event-categories",
  propertyCategories: "ai-builder-property-categories",
  propertyTypes: "ai-builder-property-types",
  propertyListingTypes: "ai-builder-property-listing-types",
};

const USER_ACTIVE_SITE_ID_KEY = "user_active_site_id";

function legacyKey(prefix: string, siteId?: string | null) {
  return `${prefix}:${siteId || "draft"}`;
}

function readJsonArray(storageKey: string): unknown[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonArray(storageKey: string, value: unknown[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Prefer real siteId over the "draft" placeholder used before URL hydration. */
export function resolveTaxonomySiteId(siteId?: string | null): string {
  const trimmed = typeof siteId === "string" ? siteId.trim() : "";
  if (trimmed && trimmed !== "draft") return trimmed;
  if (typeof window === "undefined") return trimmed || "draft";
  try {
    const fromUrl = new URLSearchParams(window.location.search)
      .get("siteId")
      ?.trim();
    if (fromUrl) return fromUrl;
    const active =
      sessionStorage.getItem(USER_ACTIVE_SITE_ID_KEY) ||
      localStorage.getItem(USER_ACTIVE_SITE_ID_KEY);
    if (active?.trim()) return active.trim();
  } catch {
    /* ignore */
  }
  return trimmed || "draft";
}

function emitTaxonomiesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TAXONOMIES_CHANGED_EVENT));
}

/** Write a manager category list + optionally notify editor to cloud-sync. */
export function persistTaxonomyStringList(
  field: TaxonomyStringField,
  siteId: string | null | undefined,
  values: string[],
  options?: { syncCloud?: boolean },
) {
  const id = resolveTaxonomySiteId(siteId);
  writeJsonArray(legacyKey(LEGACY_KEYS[field], id), asStringList(values));
  if (options?.syncCloud !== false) {
    emitTaxonomiesChanged();
  }
}

export function persistTaxonomyJsonList(
  field: "propertyTypes" | "propertyListingTypes",
  siteId: string | null | undefined,
  values: unknown[],
  options?: { syncCloud?: boolean },
) {
  const id = resolveTaxonomySiteId(siteId);
  writeJsonArray(
    legacyKey(LEGACY_KEYS[field], id),
    Array.isArray(values) ? values : [],
  );
  if (options?.syncCloud !== false) {
    emitTaxonomiesChanged();
  }
}

/** Collect current taxonomy lists from localStorage for a site. */
export function readSiteTaxonomiesFromLocal(
  siteId?: string | null,
): SiteTaxonomies {
  const id = resolveTaxonomySiteId(siteId);
  return {
    galleryCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.galleryCategories, id)),
    ),
    teamCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.teamCategories, id)),
    ),
    portfolioCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.portfolioCategories, id)),
    ),
    blogCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.blogCategories, id)),
    ),
    serviceCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.serviceCategories, id)),
    ),
    eventCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.eventCategories, id)),
    ),
    propertyCategories: asStringList(
      readJsonArray(legacyKey(LEGACY_KEYS.propertyCategories, id)),
    ),
    propertyTypes: readJsonArray(legacyKey(LEGACY_KEYS.propertyTypes, id)),
    propertyListingTypes: readJsonArray(
      legacyKey(LEGACY_KEYS.propertyListingTypes, id),
    ),
  };
}

function hasTaxonomyData(taxonomies: SiteTaxonomies | null | undefined) {
  if (!taxonomies) return false;
  return Object.values(taxonomies).some(
    (value) => Array.isArray(value) && value.length > 0,
  );
}

function mergeStringLists(a: unknown[], b: unknown[]): string[] {
  return Array.from(new Set([...asStringList(a), ...asStringList(b)]));
}

function optionKey(item: unknown): string {
  if (item && typeof item === "object") {
    const rec = item as Record<string, unknown>;
    const id = typeof rec.id === "string" ? rec.id : "";
    const value = typeof rec.value === "string" ? rec.value : "";
    const label = typeof rec.label === "string" ? rec.label : "";
    return (id || value || label).trim().toLowerCase();
  }
  return String(item ?? "")
    .trim()
    .toLowerCase();
}

function mergeOptionLists(existing: unknown[], fromDb: unknown[]): unknown[] {
  if (!existing.length) return fromDb;
  if (!fromDb.length) return existing;
  const map = new Map<string, unknown>();
  [...fromDb, ...existing].forEach((item, index) => {
    const key = optionKey(item) || `idx:${index}`;
    map.set(key, item);
  });
  return Array.from(map.values());
}

/**
 * Hydrate localStorage from DB Site.config.taxonomies after site load.
 * Unions with any newer local lists so a refresh cannot wipe unsynced adds.
 */
export function hydrateSiteTaxonomiesToLocal(
  siteId: string | null | undefined,
  taxonomies: SiteTaxonomies | null | undefined,
) {
  if (!siteId || typeof window === "undefined" || !hasTaxonomyData(taxonomies)) {
    return;
  }

  const id = resolveTaxonomySiteId(siteId);

  (Object.keys(LEGACY_KEYS) as (keyof SiteTaxonomies)[]).forEach((field) => {
    const value = taxonomies?.[field];
    if (!Array.isArray(value) || value.length === 0) return;
    const key = legacyKey(LEGACY_KEYS[field], id);
    const existing = readJsonArray(key);
    if (
      field === "propertyTypes" ||
      field === "propertyListingTypes"
    ) {
      writeJsonArray(key, mergeOptionLists(existing, value));
      return;
    }
    writeJsonArray(key, mergeStringLists(existing, value));
  });
}

export function normalizeSiteTaxonomies(
  value: unknown,
): SiteTaxonomies | null {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  if (!record) return null;

  const next: SiteTaxonomies = {};
  (Object.keys(LEGACY_KEYS) as (keyof SiteTaxonomies)[]).forEach((field) => {
    if (!(field in record)) return;
    const raw = record[field];
    if (!Array.isArray(raw)) return;
    if (
      field === "propertyTypes" ||
      field === "propertyListingTypes"
    ) {
      next[field] = raw;
    } else {
      next[field] = asStringList(raw);
    }
  });

  return hasTaxonomyData(next) ? next : null;
}

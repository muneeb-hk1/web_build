/** Lightweight account activity log (localStorage). Additive only — never blocks flows. */

export type UserActivityType =
  | "plan"
  | "payment"
  | "publish"
  | "domain"
  | "export"
  | "other";

export type UserActivityItem = {
  id: string;
  at: string;
  type: UserActivityType;
  title: string;
  detail?: string;
};

const STORAGE_KEY = "lestow-user-activity:v1";
const MAX_ITEMS = 40;

function readAll(): UserActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserActivityItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.id === "string" && typeof item.title === "string",
    );
  } catch {
    return [];
  }
}

function writeAll(items: UserActivityItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* quota — ignore */
  }
}

export function listUserActivity(limit = 12): UserActivityItem[] {
  return readAll().slice(0, Math.max(1, limit));
}

export function appendUserActivity(input: {
  type: UserActivityType;
  title: string;
  detail?: string;
}) {
  if (typeof window === "undefined") return;
  const title = input.title.trim();
  if (!title) return;
  const next: UserActivityItem = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    type: input.type,
    title,
    detail: input.detail?.trim() || undefined,
  };
  writeAll([next, ...readAll()]);
}

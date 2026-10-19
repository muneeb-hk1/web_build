import {
  CREATE_AI_CHAT_KEY,
  CREATE_AI_PAYLOAD_KEY,
  getCreateAiChat,
  getCreateAiPayload,
  getCreateAiSite,
  type CreateAiPayload,
  type CreateAiSite,
} from "@/lib/create-ai-storage";

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let lastKey = "";

const DELETED_KEYS = "lestow-create-ai-deleted-keys";

function readDeletedDesignKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DELETED_KEYS);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string" && /^ca_/i.test(id))
      : [];
  } catch {
    return [];
  }
}

export function isCreateAiDesignDeleted(designId: string) {
  const id = (designId || "").trim();
  if (!id) return false;
  return readDeletedDesignKeys().some((key) => key.toLowerCase() === id.toLowerCase());
}

/** Stop deleted designs from syncing back as Draft cards. */
export function tombstoneAndClearCreateAiLocal(designId: string) {
  if (typeof window === "undefined") return;
  const id = (designId || "").trim();
  if (!id || !/^ca_/i.test(id)) return;
  try {
    const next = readDeletedDesignKeys().filter(
      (key) => key.toLowerCase() !== id.toLowerCase(),
    );
    next.push(id);
    window.localStorage.setItem(DELETED_KEYS, JSON.stringify(next.slice(-200)));
  } catch {
    /* ignore */
  }
  const keys = [
    `lestow-create-ai-payload:${id}`,
    `lestow-create-ai-site:${id}`,
    `lestow-create-ai-chat:${id}`,
    `lestow-create-ai-published-site:${id}`,
    `lestow-create-ai-published-url:${id}`,
    `lestow-create-ai-edit-mode:${id}`,
  ];
  for (const store of [window.localStorage, window.sessionStorage]) {
    for (const key of keys) {
      try {
        store.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }
  try {
    const active =
      window.localStorage.getItem("lestow-create-ai-active-id") || "";
    if (active.toLowerCase() === id.toLowerCase()) {
      window.localStorage.removeItem("lestow-create-ai-active-id");
      window.sessionStorage.removeItem("lestow-create-ai-active-id");
    }
  } catch {
    /* ignore */
  }
}

/** Debounced sync for logged-in users — payload + HTML + chat. */
export function scheduleCreateAiDesignSync(designId?: string) {
  if (typeof window === "undefined") return;
  const id = (designId || "").trim();
  if (!id || !/^ca_/i.test(id)) return;

  lastKey = id;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void flushCreateAiDesignSync(lastKey);
  }, 1200);
}

export async function flushCreateAiDesignSync(designId?: string) {
  if (typeof window === "undefined") return;
  const id = (designId || lastKey || "").trim();
  if (!id || !/^ca_/i.test(id) || isCreateAiDesignDeleted(id)) return;

  const payload = getCreateAiPayload(id);
  const site = getCreateAiSite(id);
  const chat = getCreateAiChat(id);
  if (!payload && !site && !chat.length) return;

  const body = buildSyncBody(id, payload, site, chat);
  try {
    await fetch("/api/user/create-ai-designs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch {
    /* offline / guest — localStorage still holds chat */
  }
}

/** After login: push every local ca_… design (payload + HTML + chat) to the server. */
export async function claimLocalCreateAiDesigns() {
  if (typeof window === "undefined") return;
  const ids = new Set<string>();
  const collect = (store: Storage) => {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i) || "";
      const match = key.match(
        new RegExp(`^${CREATE_AI_PAYLOAD_KEY}:(ca_[^:]+)$`, "i"),
      );
      if (match?.[1]) ids.add(match[1]);
      const siteMatch = key.match(/^lestow-create-ai-site:(ca_[^:]+)$/i);
      if (siteMatch?.[1]) ids.add(siteMatch[1]);
      const chatMatch = key.match(
        new RegExp(`^${CREATE_AI_CHAT_KEY}:(ca_[^:]+)$`, "i"),
      );
      if (chatMatch?.[1]) ids.add(chatMatch[1]);
    }
  };
  try {
    collect(window.localStorage);
    collect(window.sessionStorage);
  } catch {
    /* ignore */
  }
  try {
    const active =
      window.localStorage.getItem("lestow-create-ai-active-id") ||
      window.sessionStorage.getItem("lestow-create-ai-active-id");
    if (active && /^ca_/i.test(active)) ids.add(active.trim());
  } catch {
    /* ignore */
  }

  for (const id of ids) {
    if (isCreateAiDesignDeleted(id)) continue;
    await flushCreateAiDesignSync(id);
  }
}

function buildSyncBody(
  designKey: string,
  payload: CreateAiPayload | null,
  site: CreateAiSite | null,
  chat: ReturnType<typeof getCreateAiChat>,
) {
  const pageLabels =
    site?.pages?.map((page) => page.label || page.id).filter(Boolean) || [];
  const body: Record<string, unknown> = {
    designKey,
    title: payload?.brandName || undefined,
    brandName: payload?.brandName || undefined,
    category: payload?.category || payload?.websiteRelated || undefined,
    pageType: payload?.pageType || undefined,
    pageCount: site?.pages?.length || 1,
    pageLabels,
    status: "draft",
  };
  if (payload) body.payload = payload;
  if (site?.pages?.length) body.site = site;
  if (chat.length) body.chat = chat;
  return body;
}

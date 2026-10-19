/**
 * Editor AI Assist credits:
 * - Free (no paid plan on that site): 5 free messages per website, then buy packs
 * - Paid page plans (per website / calendar month):
 *   Starter 100 · Professional 250 · Business 750 · Enterprise 2500
 * - Purchased packs: account-wide (usable on any site)
 */

import {
  CREATE_AI_CHAT_CREDIT_PACKS,
  getCreateAiChatCreditPack,
  type CreateAiChatCreditPack,
  type CreateAiChatCreditPackId,
} from "@/lib/create-ai-chat-credits";
import { PAGE_PLAN_AI_TOKENS } from "@/lib/pagePlans";
import { getSitePagePlan } from "@/lib/userPlan";

export const EDITOR_AI_ASSIST_FREE_CREDITS = 5;
/** @deprecated Prefer getPaidPlanMonthlyAiTokens(siteId). Legacy Core = Starter. */
export const EDITOR_AI_ASSIST_CORE_MONTHLY = PAGE_PLAN_AI_TOKENS.starter;

export function getPaidPlanMonthlyAiTokens(siteId?: string | null): number {
  const pagePlan = getSitePagePlan(siteId || undefined);
  if (!pagePlan) return PAGE_PLAN_AI_TOKENS.starter;
  return PAGE_PLAN_AI_TOKENS[pagePlan];
}

export type EditorAiAssistCreditPackId = CreateAiChatCreditPackId;
export type EditorAiAssistCreditPack = CreateAiChatCreditPack;

export const EDITOR_AI_ASSIST_CREDIT_PACKS = CREATE_AI_CHAT_CREDIT_PACKS;

export function getEditorAiAssistCreditPack(
  id: string,
): EditorAiAssistCreditPack | null {
  return getCreateAiChatCreditPack(id);
}

export type EditorAiAssistSiteCreditBucket = {
  freeUsed: number;
  coreUsed: number;
  corePeriodKey: string;
};

export type EditorAiAssistCreditWallet = {
  /** @deprecated Prefer siteCredits[siteId]. Kept for older sync payloads. */
  freeUsed: number;
  purchasedRemaining: number;
  purchasedUsed: number;
  /** @deprecated Prefer siteCredits[siteId]. */
  coreUsed: number;
  /** @deprecated Prefer siteCredits[siteId]. */
  corePeriodKey: string;
  /** Per-website Core monthly + Starter free usage. */
  siteCredits: Record<string, EditorAiAssistSiteCreditBucket>;
  updatedAt: string;
};

export type EditorAiAssistCreditPurchase = {
  id: string;
  packId: EditorAiAssistCreditPackId;
  credits: number;
  amountInr: number;
  paymentId: string;
  orderId: string;
  purchasedAt: string;
};

function emptySiteBucket(period = currentPeriodKey()): EditorAiAssistSiteCreditBucket {
  return {
    freeUsed: 0,
    coreUsed: 0,
    corePeriodKey: period,
  };
}

function emptyWallet(): EditorAiAssistCreditWallet {
  return {
    freeUsed: 0,
    purchasedRemaining: 0,
    purchasedUsed: 0,
    coreUsed: 0,
    corePeriodKey: currentPeriodKey(),
    siteCredits: {},
    updatedAt: new Date().toISOString(),
  };
}

export function currentPeriodKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function storageKey(userKey: string) {
  const safe = (userKey || "guest").trim() || "guest";
  return `lestow-editor-ai-assist-credits:v1:${safe}`;
}

function purchasesStorageKey(userKey: string) {
  const safe = (userKey || "guest").trim() || "guest";
  return `lestow-editor-ai-assist-credit-purchases:v1:${safe}`;
}

function accountCreditKey(userKey: string) {
  const key = (userKey || "").trim();
  if (!key || key === "guest" || key.startsWith("guest:")) return "";
  return key;
}

function normalizeSiteId(siteId?: string | null) {
  const id = (siteId || "").trim();
  return id || "";
}

function normalizeSiteBucket(
  parsed: Partial<EditorAiAssistSiteCreditBucket> | null | undefined,
): EditorAiAssistSiteCreditBucket {
  const period = currentPeriodKey();
  const storedPeriod =
    typeof parsed?.corePeriodKey === "string" && parsed.corePeriodKey.trim()
      ? parsed.corePeriodKey.trim()
      : period;
  const coreUsedRaw = Math.max(0, Math.floor(Number(parsed?.coreUsed) || 0));
  return {
    freeUsed: Math.max(0, Math.floor(Number(parsed?.freeUsed) || 0)),
    coreUsed: storedPeriod === period ? coreUsedRaw : 0,
    corePeriodKey: period,
  };
}

function normalizeSiteCreditsMap(
  raw: unknown,
): Record<string, EditorAiAssistSiteCreditBucket> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, EditorAiAssistSiteCreditBucket> = {};
  for (const [siteId, value] of Object.entries(
    raw as Record<string, unknown>,
  )) {
    const id = normalizeSiteId(siteId);
    if (!id || !value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }
    out[id] = normalizeSiteBucket(
      value as Partial<EditorAiAssistSiteCreditBucket>,
    );
  }
  return out;
}

function normalizeWallet(
  parsed: Partial<EditorAiAssistCreditWallet> | null | undefined,
): EditorAiAssistCreditWallet {
  const period = currentPeriodKey();
  const storedPeriod =
    typeof parsed?.corePeriodKey === "string" && parsed.corePeriodKey.trim()
      ? parsed.corePeriodKey.trim()
      : period;
  const coreUsedRaw = Math.max(0, Math.floor(Number(parsed?.coreUsed) || 0));
  return {
    freeUsed: Math.max(0, Math.floor(Number(parsed?.freeUsed) || 0)),
    purchasedRemaining: Math.max(
      0,
      Math.floor(Number(parsed?.purchasedRemaining) || 0),
    ),
    purchasedUsed: Math.max(0, Math.floor(Number(parsed?.purchasedUsed) || 0)),
    coreUsed: storedPeriod === period ? coreUsedRaw : 0,
    corePeriodKey: period,
    siteCredits: normalizeSiteCreditsMap(
      (parsed as { siteCredits?: unknown } | null | undefined)?.siteCredits,
    ),
    updatedAt:
      typeof parsed?.updatedAt === "string"
        ? parsed.updatedAt
        : new Date().toISOString(),
  };
}

function readSiteBucket(
  wallet: EditorAiAssistCreditWallet,
  siteId: string,
): EditorAiAssistSiteCreditBucket {
  const id = normalizeSiteId(siteId);
  if (!id) {
    return normalizeSiteBucket({
      freeUsed: wallet.freeUsed,
      coreUsed: wallet.coreUsed,
      corePeriodKey: wallet.corePeriodKey,
    });
  }
  return normalizeSiteBucket(wallet.siteCredits[id] || emptySiteBucket());
}

function writeSiteBucket(
  wallet: EditorAiAssistCreditWallet,
  siteId: string,
  bucket: EditorAiAssistSiteCreditBucket,
): EditorAiAssistCreditWallet {
  const id = normalizeSiteId(siteId);
  const nextBucket = normalizeSiteBucket(bucket);
  if (!id) {
    return {
      ...wallet,
      freeUsed: nextBucket.freeUsed,
      coreUsed: nextBucket.coreUsed,
      corePeriodKey: nextBucket.corePeriodKey,
    };
  }
  return {
    ...wallet,
    siteCredits: {
      ...wallet.siteCredits,
      [id]: nextBucket,
    },
    // Keep legacy fields as a coarse mirror of the active site for older readers.
    freeUsed: nextBucket.freeUsed,
    coreUsed: nextBucket.coreUsed,
    corePeriodKey: nextBucket.corePeriodKey,
  };
}

export function readEditorAiAssistCreditWallet(
  userKey: string,
): EditorAiAssistCreditWallet {
  if (typeof window === "undefined") return emptyWallet();
  try {
    const raw = window.localStorage.getItem(storageKey(userKey));
    if (!raw) return emptyWallet();
    return normalizeWallet(JSON.parse(raw) as Partial<EditorAiAssistCreditWallet>);
  } catch {
    return emptyWallet();
  }
}

export function writeEditorAiAssistCreditWallet(
  userKey: string,
  wallet: EditorAiAssistCreditWallet,
) {
  if (typeof window === "undefined") return;
  const next = normalizeWallet(wallet);
  next.updatedAt = new Date().toISOString();
  window.localStorage.setItem(storageKey(userKey), JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("css-ai-editor-assist-credits"));
  queueAccountCreditSync(userKey);
}

export function getEditorAiAssistCreditBalance(
  userKey: string,
  hasCorePlan: boolean,
  siteId?: string | null,
) {
  const w = readEditorAiAssistCreditWallet(userKey);
  const site = readSiteBucket(w, siteId || "");
  const monthlyCap = getPaidPlanMonthlyAiTokens(siteId);
  const freeLeft = hasCorePlan
    ? 0
    : Math.max(0, EDITOR_AI_ASSIST_FREE_CREDITS - site.freeUsed);
  const coreLeft = hasCorePlan
    ? Math.max(0, monthlyCap - site.coreUsed)
    : 0;
  const used =
    (hasCorePlan ? site.coreUsed : site.freeUsed) + w.purchasedUsed;
  return {
    freeLeft,
    coreLeft,
    purchasedRemaining: w.purchasedRemaining,
    total: freeLeft + coreLeft + w.purchasedRemaining,
    used,
    freeUsed: site.freeUsed,
    coreUsed: site.coreUsed,
    purchasedUsed: w.purchasedUsed,
    freeCap: EDITOR_AI_ASSIST_FREE_CREDITS,
    coreCap: monthlyCap,
    hasCorePlan,
    siteId: normalizeSiteId(siteId) || null,
  };
}

export function consumeEditorAiAssistCredit(
  userKey: string,
  hasCorePlan: boolean,
  siteId?: string | null,
): "core" | "free" | "purchased" | false {
  const w = readEditorAiAssistCreditWallet(userKey);
  const site = readSiteBucket(w, siteId || "");
  const monthlyCap = getPaidPlanMonthlyAiTokens(siteId);
  if (hasCorePlan && site.coreUsed < monthlyCap) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        coreUsed: site.coreUsed + 1,
        corePeriodKey: currentPeriodKey(),
      }),
    );
    return "core";
  }
  if (!hasCorePlan && site.freeUsed < EDITOR_AI_ASSIST_FREE_CREDITS) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        freeUsed: site.freeUsed + 1,
      }),
    );
    return "free";
  }
  if (w.purchasedRemaining > 0) {
    writeEditorAiAssistCreditWallet(userKey, {
      ...w,
      purchasedRemaining: w.purchasedRemaining - 1,
      purchasedUsed: w.purchasedUsed + 1,
    });
    return "purchased";
  }
  return false;
}

/** Consume up to `count` credits; returns how many were actually spent. */
export function consumeEditorAiAssistCredits(
  userKey: string,
  hasCorePlan: boolean,
  count: number,
  siteId?: string | null,
): number {
  const n = Math.max(0, Math.floor(count));
  let spent = 0;
  for (let i = 0; i < n; i += 1) {
    if (!consumeEditorAiAssistCredit(userKey, hasCorePlan, siteId)) break;
    spent += 1;
  }
  return spent;
}

export function refundEditorAiAssistCredit(
  userKey: string,
  source: "core" | "free" | "purchased" = "free",
  siteId?: string | null,
): boolean {
  const w = readEditorAiAssistCreditWallet(userKey);
  const site = readSiteBucket(w, siteId || "");
  if (source === "core" && site.coreUsed > 0) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        coreUsed: site.coreUsed - 1,
      }),
    );
    return true;
  }
  if (source === "purchased" && w.purchasedUsed > 0) {
    writeEditorAiAssistCreditWallet(userKey, {
      ...w,
      purchasedUsed: w.purchasedUsed - 1,
      purchasedRemaining: w.purchasedRemaining + 1,
    });
    return true;
  }
  if (source === "free" && site.freeUsed > 0) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        freeUsed: site.freeUsed - 1,
      }),
    );
    return true;
  }
  if (site.freeUsed > 0) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        freeUsed: site.freeUsed - 1,
      }),
    );
    return true;
  }
  if (w.purchasedUsed > 0) {
    writeEditorAiAssistCreditWallet(userKey, {
      ...w,
      purchasedUsed: w.purchasedUsed - 1,
      purchasedRemaining: w.purchasedRemaining + 1,
    });
    return true;
  }
  if (site.coreUsed > 0) {
    writeEditorAiAssistCreditWallet(
      userKey,
      writeSiteBucket(w, siteId || "", {
        ...site,
        coreUsed: site.coreUsed - 1,
      }),
    );
    return true;
  }
  return false;
}

export function addPurchasedEditorAiAssistCredits(
  userKey: string,
  credits: number,
) {
  const n = Math.max(0, Math.floor(credits || 0));
  if (!n) return;
  const w = readEditorAiAssistCreditWallet(userKey);
  writeEditorAiAssistCreditWallet(userKey, {
    ...w,
    purchasedRemaining: w.purchasedRemaining + n,
  });
}

export function listEditorAiAssistCreditPurchases(
  userKey: string,
): EditorAiAssistCreditPurchase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(purchasesStorageKey(userKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const pack = getEditorAiAssistCreditPack(String(row.packId || ""));
        if (!pack) return null;
        return {
          id:
            typeof row.id === "string" && row.id.trim()
              ? row.id.trim()
              : `EAI-${String(row.orderId || row.paymentId || Date.now()).slice(0, 14)}`,
          packId: pack.id,
          credits: Math.max(0, Math.floor(Number(row.credits) || pack.credits)),
          amountInr: Math.max(
            0,
            Math.floor(Number(row.amountInr) || pack.priceInr),
          ),
          paymentId: String(row.paymentId || "").trim(),
          orderId: String(row.orderId || "").trim(),
          purchasedAt:
            typeof row.purchasedAt === "string"
              ? row.purchasedAt
              : new Date().toISOString(),
        } satisfies EditorAiAssistCreditPurchase;
      })
      .filter((item): item is EditorAiAssistCreditPurchase => Boolean(item));
  } catch {
    return [];
  }
}

function writePurchaseList(
  userKey: string,
  purchases: EditorAiAssistCreditPurchase[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    purchasesStorageKey(userKey),
    JSON.stringify(purchases.slice(0, 100)),
  );
}

export function recordEditorAiAssistCreditPurchase(
  userKey: string,
  input: {
    packId: EditorAiAssistCreditPackId | string;
    credits: number;
    amountInr: number;
    paymentId: string;
    orderId: string;
  },
) {
  const pack = getEditorAiAssistCreditPack(String(input.packId || ""));
  if (!pack) return;
  const credits = Math.max(0, Math.floor(input.credits || pack.credits));
  addPurchasedEditorAiAssistCredits(userKey, credits);

  const purchase: EditorAiAssistCreditPurchase = {
    id: `EAI-${(input.orderId || input.paymentId || Date.now().toString()).slice(0, 14)}`,
    packId: pack.id,
    credits,
    amountInr: Math.max(0, Math.floor(input.amountInr || pack.priceInr)),
    paymentId: String(input.paymentId || "").trim(),
    orderId: String(input.orderId || "").trim(),
    purchasedAt: new Date().toISOString(),
  };

  const withoutDup = listEditorAiAssistCreditPurchases(userKey).filter((item) => {
    if (purchase.orderId && item.orderId === purchase.orderId) return false;
    if (purchase.paymentId && item.paymentId === purchase.paymentId) return false;
    return true;
  });
  writePurchaseList(userKey, [purchase, ...withoutDup]);
  window.dispatchEvent(new Event("css-ai-plan-updated"));
  queueAccountCreditSync(userKey);
}

function grantedPurchased(wallet: EditorAiAssistCreditWallet) {
  return wallet.purchasedRemaining + wallet.purchasedUsed;
}

function pickRicherPurchased(
  current: EditorAiAssistCreditWallet,
  incoming: EditorAiAssistCreditWallet,
) {
  const a = grantedPurchased(current);
  const b = grantedPurchased(incoming);
  if (b > a) return incoming;
  if (b === a && incoming.purchasedUsed > current.purchasedUsed) return incoming;
  return current;
}

function mergeSiteCreditsMaps(
  a: Record<string, EditorAiAssistSiteCreditBucket>,
  b: Record<string, EditorAiAssistSiteCreditBucket>,
): Record<string, EditorAiAssistSiteCreditBucket> {
  const ids = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out: Record<string, EditorAiAssistSiteCreditBucket> = {};
  for (const id of ids) {
    const left = normalizeSiteBucket(a[id] || emptySiteBucket());
    const right = normalizeSiteBucket(b[id] || emptySiteBucket());
    out[id] = {
      freeUsed: Math.max(left.freeUsed, right.freeUsed),
      coreUsed: Math.max(left.coreUsed, right.coreUsed),
      corePeriodKey: currentPeriodKey(),
    };
  }
  return out;
}

function accountCreditPayload(userKey: string) {
  const wallet = readEditorAiAssistCreditWallet(userKey);
  return {
    ...wallet,
    purchases: listEditorAiAssistCreditPurchases(userKey),
  };
}

let accountCreditSyncTimer: number | undefined;

function queueAccountCreditSync(userKey: string) {
  if (typeof window === "undefined") return;
  const key = accountCreditKey(userKey);
  if (!key) return;
  if (accountCreditSyncTimer) window.clearTimeout(accountCreditSyncTimer);
  accountCreditSyncTimer = window.setTimeout(() => {
    const payload = accountCreditPayload(key);
    void fetch("/api/user/state", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editorAiAssistCredits: payload }),
    }).catch(() => undefined);
  }, 400);
}

export async function reconcileEditorAiAssistCredits(canonicalKey: string) {
  const key = accountCreditKey(canonicalKey);
  if (!key || typeof window === "undefined") return false;
  try {
    const res = await fetch("/api/user/state", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { editorAiAssistCredits?: unknown };
    const remoteRaw = data.editorAiAssistCredits;
    if (!remoteRaw || typeof remoteRaw !== "object" || Array.isArray(remoteRaw)) {
      return false;
    }
    const remoteObj = remoteRaw as Record<string, unknown>;
    const remoteWallet = normalizeWallet(remoteObj);
    const local = readEditorAiAssistCreditWallet(key);
    const chosen = pickRicherPurchased(local, remoteWallet);
    const next: EditorAiAssistCreditWallet = {
      ...chosen,
      freeUsed: Math.max(local.freeUsed, remoteWallet.freeUsed),
      coreUsed: Math.max(local.coreUsed, remoteWallet.coreUsed),
      corePeriodKey: currentPeriodKey(),
      siteCredits: mergeSiteCreditsMaps(
        local.siteCredits,
        remoteWallet.siteCredits,
      ),
    };
    writeEditorAiAssistCreditWallet(key, next);
    const remotePurchases = Array.isArray(remoteObj.purchases)
      ? (remoteObj.purchases as EditorAiAssistCreditPurchase[])
      : [];
    const merged = [
      ...listEditorAiAssistCreditPurchases(key),
      ...remotePurchases,
    ];
    const seen = new Set<string>();
    const purchases = merged.filter((item) => {
      const k = `${item.orderId}|${item.paymentId}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    writePurchaseList(key, purchases);
    if (grantedPurchased(next) > grantedPurchased(remoteWallet)) {
      queueAccountCreditSync(key);
    }
    return true;
  } catch {
    return false;
  }
}

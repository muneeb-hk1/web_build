/**
 * Create-with-AI chat credits: 10 free, then buy packs.
 * Paid balance is stored per account on the server, and copied into
 * localStorage for the editor. Guest / design keys are merged on login
 * so a purchase is not dropped when the storage key changes.
 */

export const CREATE_AI_FREE_CHAT_CREDITS = 10;

export type CreateAiChatCreditPackId = "pack-100" | "pack-500" | "pack-1000";

export type CreateAiChatCreditPack = {
  id: CreateAiChatCreditPackId;
  credits: number;
  /** Whole USD for UI (kept as priceInr for existing callers). */
  priceInr: number;
  /** Stripe/Razorpay amount in cents */
  chargeAmount: number;
  label: string;
};

/** Mid pricing: ~10 credits / $1 → $10 / $50 / $100 */
export const CREATE_AI_CHAT_CREDIT_PACKS: CreateAiChatCreditPack[] = [
  {
    id: "pack-100",
    credits: 100,
    priceInr: 10,
    chargeAmount: 1000,
    label: "100 chat credits",
  },
  {
    id: "pack-500",
    credits: 500,
    priceInr: 50,
    chargeAmount: 5000,
    label: "500 chat credits",
  },
  {
    id: "pack-1000",
    credits: 1000,
    priceInr: 100,
    chargeAmount: 10000,
    label: "1000 chat credits",
  },
];

export type CreateAiChatCreditWallet = {
  freeUsed: number;
  purchasedRemaining: number;
  /** Credits spent from purchased packs */
  purchasedUsed: number;
  updatedAt: string;
};

export function getCreateAiChatCreditPack(
  id: string,
): CreateAiChatCreditPack | null {
  return CREATE_AI_CHAT_CREDIT_PACKS.find((p) => p.id === id) || null;
}

function storageKey(userKey: string) {
  const safe = (userKey || "guest").trim() || "guest";
  return `lestow-create-ai-chat-credits:v1:${safe}`;
}

function emptyWallet(): CreateAiChatCreditWallet {
  return {
    freeUsed: 0,
    purchasedRemaining: 0,
    purchasedUsed: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function readCreateAiChatCreditWallet(
  userKey: string,
): CreateAiChatCreditWallet {
  if (typeof window === "undefined") return emptyWallet();
  try {
    const raw = window.localStorage.getItem(storageKey(userKey));
    if (!raw) return emptyWallet();
    const parsed = JSON.parse(raw) as Partial<CreateAiChatCreditWallet>;
    const freeUsed = Math.max(0, Math.floor(Number(parsed.freeUsed) || 0));
    const purchasedRemaining = Math.max(
      0,
      Math.floor(Number(parsed.purchasedRemaining) || 0),
    );
    const purchasedUsed = Math.max(
      0,
      Math.floor(Number(parsed.purchasedUsed) || 0),
    );
    return {
      freeUsed,
      purchasedRemaining,
      purchasedUsed,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return emptyWallet();
  }
}

export function writeCreateAiChatCreditWallet(
  userKey: string,
  wallet: CreateAiChatCreditWallet,
) {
  if (typeof window === "undefined") return;
  const next: CreateAiChatCreditWallet = {
    freeUsed: Math.max(0, Math.floor(wallet.freeUsed || 0)),
    purchasedRemaining: Math.max(0, Math.floor(wallet.purchasedRemaining || 0)),
    purchasedUsed: Math.max(0, Math.floor(wallet.purchasedUsed || 0)),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(storageKey(userKey), JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
  queueAccountCreditSync(userKey);
}

export function getCreateAiChatCreditBalance(userKey: string) {
  const w = readCreateAiChatCreditWallet(userKey);
  const freeLeft = Math.max(0, CREATE_AI_FREE_CHAT_CREDITS - w.freeUsed);
  const used = w.freeUsed + w.purchasedUsed;
  return {
    freeLeft,
    purchasedRemaining: w.purchasedRemaining,
    total: freeLeft + w.purchasedRemaining,
    used,
    freeUsed: w.freeUsed,
    purchasedUsed: w.purchasedUsed,
    freeCap: CREATE_AI_FREE_CHAT_CREDITS,
  };
}

/** Spend 1 credit: free first, then purchased. Returns which pool was used. */
export function consumeCreateAiChatCredit(
  userKey: string,
): "free" | "purchased" | false {
  const w = readCreateAiChatCreditWallet(userKey);
  if (w.freeUsed < CREATE_AI_FREE_CHAT_CREDITS) {
    writeCreateAiChatCreditWallet(userKey, {
      ...w,
      freeUsed: w.freeUsed + 1,
    });
    return "free";
  }
  if (w.purchasedRemaining > 0) {
    writeCreateAiChatCreditWallet(userKey, {
      ...w,
      purchasedRemaining: w.purchasedRemaining - 1,
      purchasedUsed: w.purchasedUsed + 1,
    });
    return "purchased";
  }
  return false;
}

/** Undo / failed apply — put 1 credit back. */
export function refundCreateAiChatCredit(
  userKey: string,
  source: "free" | "purchased" = "free",
): boolean {
  const w = readCreateAiChatCreditWallet(userKey);
  if (source === "purchased" && w.purchasedUsed > 0) {
    writeCreateAiChatCreditWallet(userKey, {
      ...w,
      purchasedUsed: w.purchasedUsed - 1,
      purchasedRemaining: w.purchasedRemaining + 1,
    });
    return true;
  }
  if (w.freeUsed > 0) {
    writeCreateAiChatCreditWallet(userKey, {
      ...w,
      freeUsed: w.freeUsed - 1,
    });
    return true;
  }
  if (w.purchasedUsed > 0) {
    writeCreateAiChatCreditWallet(userKey, {
      ...w,
      purchasedUsed: w.purchasedUsed - 1,
      purchasedRemaining: w.purchasedRemaining + 1,
    });
    return true;
  }
  return false;
}

export function addPurchasedCreateAiChatCredits(
  userKey: string,
  credits: number,
) {
  const n = Math.max(0, Math.floor(credits || 0));
  if (!n) return;
  const w = readCreateAiChatCreditWallet(userKey);
  writeCreateAiChatCreditWallet(userKey, {
    ...w,
    purchasedRemaining: w.purchasedRemaining + n,
  });
}

export type CreateAiChatCreditPurchase = {
  id: string;
  packId: CreateAiChatCreditPackId;
  credits: number;
  amountInr: number;
  paymentId: string;
  orderId: string;
  purchasedAt: string;
};

function purchasesStorageKey(userKey: string) {
  const safe = (userKey || "guest").trim() || "guest";
  return `lestow-create-ai-chat-credit-purchases:v1:${safe}`;
}

export function listCreateAiChatCreditPurchases(
  userKey: string,
): CreateAiChatCreditPurchase[] {
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
        const packId = String(row.packId || "");
        const pack = getCreateAiChatCreditPack(packId);
        if (!pack) return null;
        const credits = Math.max(0, Math.floor(Number(row.credits) || pack.credits));
        const amountInr = Math.max(
          0,
          Math.floor(Number(row.amountInr) || pack.priceInr),
        );
        const paymentId = String(row.paymentId || "").trim();
        const orderId = String(row.orderId || "").trim();
        const purchasedAt =
          typeof row.purchasedAt === "string"
            ? row.purchasedAt
            : new Date().toISOString();
        const id =
          typeof row.id === "string" && row.id.trim()
            ? row.id.trim()
            : `CAI-${(orderId || paymentId || purchasedAt).slice(0, 12)}`;
        return {
          id,
          packId: pack.id,
          credits,
          amountInr,
          paymentId,
          orderId,
          purchasedAt,
        } satisfies CreateAiChatCreditPurchase;
      })
      .filter((item): item is CreateAiChatCreditPurchase => Boolean(item))
      .sort(
        (a, b) =>
          new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
      );
  } catch {
    return [];
  }
}

/** Persist purchase for Billing invoices + add credits to wallet. */
export function recordCreateAiChatCreditPurchase(
  userKey: string,
  input: {
    packId: CreateAiChatCreditPackId | string;
    credits: number;
    amountInr: number;
    paymentId: string;
    orderId: string;
  },
) {
  const pack = getCreateAiChatCreditPack(String(input.packId || ""));
  if (!pack) return;
  const credits = Math.max(0, Math.floor(input.credits || pack.credits));
  addPurchasedCreateAiChatCredits(userKey, credits);

  const purchase: CreateAiChatCreditPurchase = {
    id: `CAI-${(input.orderId || input.paymentId || Date.now().toString()).slice(0, 14)}`,
    packId: pack.id,
    credits,
    amountInr: Math.max(0, Math.floor(input.amountInr || pack.priceInr)),
    paymentId: String(input.paymentId || "").trim(),
    orderId: String(input.orderId || "").trim(),
    purchasedAt: new Date().toISOString(),
  };

  if (typeof window === "undefined") return;
  const withoutDup = listCreateAiChatCreditPurchases(userKey).filter((item) => {
    if (purchase.orderId && item.orderId === purchase.orderId) return false;
    if (purchase.paymentId && item.paymentId === purchase.paymentId) return false;
    return true;
  });
  const next = [purchase, ...withoutDup].slice(0, 100);
  window.localStorage.setItem(
    purchasesStorageKey(userKey),
    JSON.stringify(next),
  );
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("css-ai-plan-updated"));
  queueAccountCreditSync(userKey);
}

function grantedPurchased(wallet: CreateAiChatCreditWallet) {
  return wallet.purchasedRemaining + wallet.purchasedUsed;
}

function pickRicherPurchased(
  current: CreateAiChatCreditWallet,
  incoming: CreateAiChatCreditWallet,
) {
  const currentGranted = grantedPurchased(current);
  const incomingGranted = grantedPurchased(incoming);
  if (incomingGranted > currentGranted) return incoming;
  if (
    incomingGranted === currentGranted &&
    incoming.purchasedUsed > current.purchasedUsed
  ) {
    return incoming;
  }
  return current;
}

function accountCreditKey(userKey: string) {
  const key = (userKey || "").trim();
  if (!key || key === "guest" || key.startsWith("design:")) return "";
  return key;
}

function writePurchaseList(
  userKey: string,
  purchases: CreateAiChatCreditPurchase[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    purchasesStorageKey(userKey),
    JSON.stringify(purchases.slice(0, 100)),
  );
}

function mergePurchaseLists(
  left: CreateAiChatCreditPurchase[],
  right: CreateAiChatCreditPurchase[],
) {
  const merged = [...left];
  for (const item of right) {
    const dup = merged.some((saved) => {
      if (item.paymentId && saved.paymentId === item.paymentId) return true;
      if (item.orderId && saved.orderId === item.orderId) return true;
      return false;
    });
    if (!dup) merged.push(item);
  }
  return merged
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
    )
    .slice(0, 100);
}

function adoptLocalCreditKeys(canonicalKey: string, aliasKeys: string[]) {
  const keys = [canonicalKey, ...aliasKeys].filter(
    (key, index, all) => Boolean(key) && all.indexOf(key) === index,
  );
  let purchased = emptyWallet();
  let freeUsed = 0;
  let purchases: CreateAiChatCreditPurchase[] = [];
  for (const key of keys) {
    const wallet = readCreateAiChatCreditWallet(key);
    purchased = pickRicherPurchased(purchased, wallet);
    freeUsed = Math.max(freeUsed, wallet.freeUsed);
    purchases = mergePurchaseLists(
      purchases,
      listCreateAiChatCreditPurchases(key),
    );
  }
  const next: CreateAiChatCreditWallet = { ...purchased, freeUsed };
  const current = readCreateAiChatCreditWallet(canonicalKey);
  const currentPurchases = listCreateAiChatCreditPurchases(canonicalKey);
  const changed =
    current.freeUsed !== next.freeUsed ||
    current.purchasedRemaining !== next.purchasedRemaining ||
    current.purchasedUsed !== next.purchasedUsed ||
    currentPurchases.length !== purchases.length;
  if (!changed) return false;
  writeCreateAiChatCreditWallet(canonicalKey, next);
  writePurchaseList(canonicalKey, purchases);
  return true;
}

type RemoteCreditState = {
  wallet: CreateAiChatCreditWallet;
  purchases: CreateAiChatCreditPurchase[];
};

function readRemoteCreditState(value: unknown): RemoteCreditState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const wallet: CreateAiChatCreditWallet = {
    freeUsed: Math.max(0, Math.floor(Number(row.freeUsed) || 0)),
    purchasedRemaining: Math.max(
      0,
      Math.floor(Number(row.purchasedRemaining) || 0),
    ),
    purchasedUsed: Math.max(0, Math.floor(Number(row.purchasedUsed) || 0)),
    updatedAt:
      typeof row.updatedAt === "string"
        ? row.updatedAt
        : new Date().toISOString(),
  };
  const purchases = Array.isArray(row.purchases)
    ? row.purchases
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const purchase = item as Record<string, unknown>;
          const packId = String(purchase.packId || "");
          const pack = getCreateAiChatCreditPack(packId);
          if (!pack) return null;
          return {
            id:
              typeof purchase.id === "string" && purchase.id.trim()
                ? purchase.id
                : `CAI-${pack.id}`,
            packId: pack.id,
            credits: Math.max(
              0,
              Math.floor(Number(purchase.credits) || pack.credits),
            ),
            amountInr: Math.max(
              0,
              Math.floor(Number(purchase.amountInr) || pack.priceInr),
            ),
            paymentId: String(purchase.paymentId || "").trim(),
            orderId: String(purchase.orderId || "").trim(),
            purchasedAt:
              typeof purchase.purchasedAt === "string"
                ? purchase.purchasedAt
                : new Date().toISOString(),
          } satisfies CreateAiChatCreditPurchase;
        })
        .filter((item): item is CreateAiChatCreditPurchase => Boolean(item))
    : [];
  return { wallet, purchases };
}

function accountCreditPayload(userKey: string) {
  const wallet = readCreateAiChatCreditWallet(userKey);
  return {
    freeUsed: wallet.freeUsed,
    purchasedRemaining: wallet.purchasedRemaining,
    purchasedUsed: wallet.purchasedUsed,
    updatedAt: wallet.updatedAt,
    purchases: listCreateAiChatCreditPurchases(userKey),
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
      body: JSON.stringify({ createAiChatCredits: payload }),
    }).catch(() => undefined);
  }, 400);
}

/** Pull the account wallet and fold guest/design copies into it. */
export async function reconcileCreateAiChatCredits(
  canonicalKey: string,
  aliasKeys: string[],
) {
  const key = accountCreditKey(canonicalKey);
  if (!key || typeof window === "undefined") return false;
  const before = getCreateAiChatCreditBalance(key);
  adoptLocalCreditKeys(key, aliasKeys);

  try {
    const res = await fetch("/api/user/state", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { createAiChatCredits?: unknown };
      const remote = readRemoteCreditState(data.createAiChatCredits);
      if (remote) {
        const local = readCreateAiChatCreditWallet(key);
        const chosen = pickRicherPurchased(local, remote.wallet);
        const next: CreateAiChatCreditWallet = {
          ...chosen,
          freeUsed: Math.max(local.freeUsed, remote.wallet.freeUsed),
        };
        const purchases = mergePurchaseLists(
          listCreateAiChatCreditPurchases(key),
          remote.purchases,
        );
        writeCreateAiChatCreditWallet(key, next);
        writePurchaseList(key, purchases);
        const remoteGranted = grantedPurchased(remote.wallet);
        const localGranted = grantedPurchased(next);
        if (
          localGranted > remoteGranted ||
          (localGranted === remoteGranted &&
            next.purchasedUsed > remote.wallet.purchasedUsed) ||
          purchases.length > remote.purchases.length
        ) {
          queueAccountCreditSync(key);
        }
      }
    }
  } catch {
    /* account copy stays in this browser until the next open */
  }

  const after = getCreateAiChatCreditBalance(key);
  return before.total !== after.total || before.used !== after.used;
}

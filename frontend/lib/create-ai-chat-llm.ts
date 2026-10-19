/**
 * Create-with-AI chat LLM routing — Gemini only (GEMINI_MODEL / gemini-3.6-flash).
 * Creative Desktop SiteForge–style path: one model, no OpenAI primary.
 */

export type CreateAiChatMode = "speed" | "quality";
export type CreateAiLlmProvider = "openai" | "gemini";

export type CreateAiLlmRoute = {
  primary: CreateAiLlmProvider;
  fallback: CreateAiLlmProvider;
  tier: "fast" | "quality";
};

const GEMINI_ONLY: CreateAiLlmRoute = {
  primary: "gemini",
  fallback: "gemini",
  tier: "fast",
};

/** Intent clarify + action planner */
export function createAiPlannerRoute(_mode: CreateAiChatMode): CreateAiLlmRoute {
  return { ...GEMINI_ONLY, tier: "fast" };
}

/** Free-form / surgical HTML edits — Gemini Flash for creative + speed */
export function createAiEditRoute(
  mode: CreateAiChatMode,
  _opts?: { screenshotSection?: boolean; screenshotUi?: boolean },
): CreateAiLlmRoute {
  return {
    primary: "gemini",
    fallback: "gemini",
    tier: mode === "quality" ? "quality" : "fast",
  };
}

/** Header invent / surgical header rewrite */
export function createAiHeaderRoute(
  _mode: CreateAiChatMode,
  invent?: boolean,
): CreateAiLlmRoute {
  return {
    primary: "gemini",
    fallback: "gemini",
    tier: invent ? "quality" : "fast",
  };
}

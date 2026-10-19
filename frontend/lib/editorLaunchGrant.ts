/** One-shot (TTL) grant so Create Custom can open /editor after clearing drafts. */

const GRANT_KEY = "css-ai-editor-launch-grant";
const GRANT_TTL_MS = 10 * 60 * 1000;

type EditorLaunchGrant = {
  templateId: string;
  category: string;
  at: number;
};

export function grantEditorLaunch(templateId: string, category: string): void {
  if (typeof window === "undefined") return;
  if (!templateId || !category) return;
  try {
    const payload: EditorLaunchGrant = {
      templateId,
      category,
      at: Date.now(),
    };
    sessionStorage.setItem(GRANT_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function hasEditorLaunchGrant(
  templateId: string | null | undefined,
  category: string | null | undefined,
): boolean {
  if (typeof window === "undefined") return false;
  if (!templateId || !category) return false;
  try {
    const raw = sessionStorage.getItem(GRANT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<EditorLaunchGrant>;
    if (
      !parsed?.templateId ||
      !parsed?.category ||
      typeof parsed.at !== "number"
    ) {
      sessionStorage.removeItem(GRANT_KEY);
      return false;
    }
    if (Date.now() - parsed.at > GRANT_TTL_MS) {
      sessionStorage.removeItem(GRANT_KEY);
      return false;
    }
    return (
      parsed.templateId === templateId && parsed.category === category
    );
  } catch {
    return false;
  }
}

import type { ReactNode } from "react";

export function renderNgoEditorPart(
  editorPart: number | undefined,
  parts: ReactNode[],
  page: ReactNode,
) {
  if (typeof editorPart === "number" && parts[editorPart]) {
    return <>{parts[editorPart]}</>;
  }
  return page;
}

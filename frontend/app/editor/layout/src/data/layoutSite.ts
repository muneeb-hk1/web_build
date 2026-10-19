import type { SiteData } from "../types/serviceHome1";
import layoutSiteData from "./layoutSiteData.json";

const ASSET = "/categories/cleaning/template1";

const isMediaPath = (value: string) =>
  /\.(png|jpe?g|webp|gif|svg|avif|mp4|webm|pdf|ico)$/i.test(value);

const remapValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    if (
      isMediaPath(value) &&
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.startsWith("/categories/")
    ) {
      return `${ASSET}${value}`;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(remapValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        remapValue(nested),
      ]),
    );
  }
  return value;
};

export const serviceHome1Content = remapValue(layoutSiteData) as SiteData;

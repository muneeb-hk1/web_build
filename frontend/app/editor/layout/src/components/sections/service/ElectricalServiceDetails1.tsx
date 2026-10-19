"use client";

import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  electricalData,
  electricalPages,
  electricalSections,
} from "../../../data/electricalContent";
import { editorSlug } from "../pet/editorSlug";
import { toSlug } from '../header/electricalTypes';
import type {
  ServiceDetailsData,
  ServiceItem,
  ServiceSidebarData,
} from '../header/electricalTypes';
import ServiceDetails from './ElectricalServiceDetailsView';

type Detail = {
  slug?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  badge?: string;
  overlay_line1?: string;
  overlay_highlight?: string;
  overlay_tagline?: string;
  content_blocks?: { title: string; text: string }[];
};

export default function ElectricalServiceDetails1({ data }: SectionProps) {
  const preview = useOptionalPreview();
  const packed = electricalData(
    data,
    {
      services: electricalSections.services as {
        items?: ServiceItem[];
        sidebar?: ServiceSidebarData;
      },
      details: (electricalSections.service_details || []) as Detail[],
      page: electricalPages.service_details as { title?: string },
    },
    "details",
  );
  const items = ((packed.services?.items || []) as ServiceItem[]).filter(
    (item) => item.active !== false,
  );
  const pageSlug = editorSlug(preview?.currentPage || "");
  const storedService =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("electrical-active-service") || ""
      : "";
  const compact = (value: string) =>
    editorSlug(value).replace(/[^a-z0-9]+/g, "");
  const wanted = compact(preview?.currentPage || storedService || pageSlug);
  const active =
    items.find(
      (item) =>
        compact(item.title) === wanted ||
        compact(toSlug(item.title)) === wanted ||
        compact(item.link || "") === wanted,
    ) || items[0];
  if (!active) return null;
  const details = ((packed.details || []) as Detail[]).find(
    (item) =>
      compact(item.slug || "") === compact(active.title) ||
      compact(item.title || "") === compact(active.title),
  );
  const title = details?.title || active.title;
  const titleWords = title.split(" ");
  const serviceData: ServiceDetailsData = {
    title,
    description: details?.description || active.description,
    image: active.image || "/categories/electrical/services/service-01.png",
    icon: active.icon,
    subtitle: details?.subtitle,
    badge: details?.badge || "PROFESSIONAL",
    overlay_line1: details?.overlay_line1 || titleWords[0],
    overlay_highlight: details?.overlay_highlight || titleWords.slice(1).join(" "),
    overlay_tagline: details?.overlay_tagline || "Safe Solutions for a Brighter Tomorrow",
    content_blocks: details?.content_blocks,
    benefits: [],
    process: [],
    gallery: [],
  };
  return (
    <>
      <ServiceDetails
        data={serviceData}
        allServices={items}
        sidebarData={packed.services?.sidebar}
      />
    </>
  );
}

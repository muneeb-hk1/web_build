"use client";

import NgoService1 from "./NgoService1";
import NgoStats1 from "../stats/NgoStats1";
import NgoTestimonial1 from "../testimonial/NgoTestimonial1";
import type { SectionProps } from "../../../types/section";
import { site, type NGOServiceData } from "../data/categorySite";
import { renderNgoEditorPart } from "../../../lib/ngoEditorParts";

/**
 * Services page (Pattern B) — one section composes Services + Stats + Testimonials.
 * Nested packs: `stats`, `testimonials`, plus `partOrder`.
 */
export default function NgoServicePage1({
  data: customData,
  editorPart,
}: SectionProps & { editorPart?: number }) {
  const custom = (customData ?? {}) as Partial<NGOServiceData> & {
    stats?: Record<string, unknown>;
    testimonials?: Record<string, unknown>;
    partOrder?: number[];
  };
  const fallback = site.servicePage ?? site.service ?? {};
  const serviceData = {
    ...fallback,
    ...custom,
    banner: { ...(fallback.banner ?? {}), ...custom.banner },
    introduction: {
      ...(fallback.introduction ?? {}),
      ...custom.introduction,
      title: {
        ...(fallback.introduction?.title ?? {}),
        ...custom.introduction?.title,
      },
    },
    services:
      Array.isArray(custom.services) && custom.services.length
        ? custom.services
        : Array.isArray((fallback as { services?: unknown[] }).services) &&
            (fallback as { services: unknown[] }).services.length
          ? (fallback as { services: unknown[] }).services
          : site.service?.services ?? [],
  };

  const parts = [
    <main key="services" className="bg-white">
      <NgoService1
        data={serviceData as unknown as SectionProps["data"]}
        limit={serviceData.services.length}
        editorLabel="Services"
      />
    </main>,
    <NgoStats1 key="stats" data={custom.stats} />,
    <NgoTestimonial1 key="testimonials" data={custom.testimonials} />,
  ];

  const stored: number[] = Array.isArray(custom.partOrder)
    ? custom.partOrder.filter(
        (index: unknown): index is number => typeof index === "number",
      )
    : [0, 1, 2];
  const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
  parts.forEach((part, index) => {
    if (part && !order.includes(index)) order.push(index);
  });
  const page = <>{order.map((index) => parts[index])}</>;

  return renderNgoEditorPart(editorPart, parts, page);
}

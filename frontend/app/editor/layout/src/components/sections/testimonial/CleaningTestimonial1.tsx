"use client";

import { Quote } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { getAccentStyle } from "../../../lib/accentStyle";
import CleaningSlider from "../shared/CleaningSlider";

const ACCENT = "#1FA463";

const defaultItems = [
  {
    name: "Petar Mansion",
    role: "Senior Designer",
    image: "https://i.pravatar.cc/150?img=11",
    quote:
      "Hymenaeos rhoncus proin aliquam justo sum mauris rutrum nullam semper purus rutru non sociis libero varius cumer to duine felis enisa porta ridiculus nisl acequis.",
  },
  {
    name: "Jhon Doe",
    role: "Senior Developer",
    image: "https://i.pravatar.cc/150?img=68",
    quote:
      "Hymenaeos rhoncus proin aliquam justo sum mauris rutrum nullam semper purus rutru non sociis libero varius cumer to duine felis enisa porta ridiculus nisl acequis.",
  },
  {
    name: "Shane Watson",
    role: "Senior Designer",
    image: "https://i.pravatar.cc/150?img=44",
    quote:
      "Hymenaeos rhoncus proin aliquam justo sum mauris rutrum nullam semper purus rutru non sociis libero varius cumer to duine felis enisa porta ridiculus nisl acequis.",
  },
  {
    name: "Sarah Smith",
    role: "Project Manager",
    image: "https://i.pravatar.cc/150?img=5",
    quote:
      "Hymenaeos rhoncus proin aliquam justo sum mauris rutrum nullam semper purus rutru non sociis libero varius cumer to duine felis enisa porta ridiculus nisl acequis.",
  },
];

export default function CleaningTestimonial1({ data = {} }: SectionProps) {
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(
    data.pretitle || data.subtitle || "Customer Feedback",
  );
  const title = String(data.title || "Quality Cleaning Making");
  const titleLine2 = String(data.titleLine2 || "");
  const items = (
    Array.isArray(data.testimonialItems) && data.testimonialItems.length
      ? data.testimonialItems
      : Array.isArray(data.testimonials) && data.testimonials.length
        ? data.testimonials
        : defaultItems
  ) as Array<Record<string, any>>;
  const layout = String(data.layout || "slider");

  const cards = items.map((item, index) => {
    const name = String(item.name || "Client");
    const role = String(item.role || "");
    const quote = String(item.quote || item.content || "");
    const image = String(item.image || "");

    return (
      <article
        key={`${name}-${index}`}
        className="group relative flex h-full flex-col bg-white p-8 shadow-[0_5px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
      >
        <div className="absolute top-0 right-0 flex h-[60px] w-[60px] items-center justify-center rounded-bl-[10px] bg-[#16A361]">
          <Quote size={28} className="text-white" strokeWidth={1.5} />
        </div>
        <div className="relative z-10 mb-6 flex items-center gap-4">
          {image ? (
            <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full">
              <img src={image} alt={name} className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div>
            {role ? (
              <p className="mb-0.5 text-[13px] font-medium text-[#888]">{role}</p>
            ) : null}
            <h4 className="text-[18px] leading-none font-extrabold text-[#0D2235]">
              {name}
            </h4>
          </div>
        </div>
        {quote ? (
          <p className="relative z-10 grow text-[14px] leading-[1.8] font-medium text-[#777] md:text-[15px]">
            {quote}
          </p>
        ) : null}
      </article>
    );
  });

  return (
    <section
      className="relative bg-[#F8F9FA] pt-8 pb-10 md:pt-10 md:pb-12"
      style={getAccentStyle(accent)}
      data-editor-fields="accentColor pretitle title titleLine2 testimonialItems"
    >
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
            {pretitle}
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
            {title}
            {titleLine2 ? (
              <>
                <br />
                {titleLine2}
              </>
            ) : null}
          </h2>
        </div>
        {layout === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards}
          </div>
        ) : (
          <CleaningSlider
            showDots
            gapClassName="gap-6"
            itemClassName="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            {cards}
          </CleaningSlider>
        )}
      </div>
    </section>
  );
}

(
  CleaningTestimonial1 as typeof CleaningTestimonial1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "accentColor",
  "pretitle",
  "title",
  "titleLine2",
  "desc",
  "testimonialItems",
];

"use client";

import { site, type NGOCareerData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import NgoCareerOpenPositions1 from "./NgoCareerOpenPositions1";
import { renderNgoEditorPart } from "../../../lib/ngoEditorParts";

/**
 * Career page (Pattern B) — Why Work With Us + Open Positions on one section.
 * Nested pack: `openPositions` + `partOrder`.
 */
export default function NgoCareer1({
  data: customData,
  editorPart,
}: SectionProps & { editorPart?: number }) {
  const custom = customData as unknown as Partial<NGOCareerData> & {
    openPositions?: Record<string, unknown>;
    partOrder?: number[];
  };
  const whyWorkWithUs = {
    ...site.career.whyWorkWithUs,
    ...custom?.whyWorkWithUs,
    items: Array.isArray(custom?.whyWorkWithUs?.items)
      ? custom.whyWorkWithUs.items
      : site.career.whyWorkWithUs.items,
  };

  const whyPart = (
    <main key="why" className="w-full bg-white font-sans">
      <section
        data-editor-section-label="Why Work With Us"
        data-editor-fields="whyWorkWithUs"
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] mx-auto tracking-tight mb-2 max-w-2xl">
          {whyWorkWithUs.title}
        </h2>
        <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
          {whyWorkWithUs.items?.map(
            (item: {
              id?: string | number;
              title?: string;
              desc?: string;
              icon?: string;
            }) => (
              <div
                key={item.id}
                data-editor-item-type="CareerReason"
                data-editor-item-label={item.title || "Career reason"}
                className="flex flex-col items-center bg-[#fdfbf9] border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 md:w-20 md:h-20 h-14 rounded-full bg-[#eaf5eb] text-[#2ba048] flex items-center justify-center text-2xl mb-4 border border-[#2ba048]/10">
                  <EditableNgoIcon
                    name={item.icon || "target"}
                    className="w-7 md:w-10 md:h-10 h-7"
                  />
                </div>
                <h3 className="text-base font-bold text-[#1a0c2e] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );

  const parts = [
    whyPart,
    <NgoCareerOpenPositions1
      key="openPositions"
      data={custom?.openPositions}
    />,
  ];

  const stored: number[] = Array.isArray(custom?.partOrder)
    ? custom.partOrder.filter(
        (index: unknown): index is number => typeof index === "number",
      )
    : [0, 1];
  const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
  parts.forEach((part, index) => {
    if (part && !order.includes(index)) order.push(index);
  });
  const page = <>{order.map((index) => parts[index])}</>;

  return renderNgoEditorPart(editorPart, parts, page);
}

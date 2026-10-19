"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { site, type NGOCsrData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { getCsrIconTheme, renderCsrIcon } from "./ngoCsrShared";
import NgoCsrFocusAreas1 from "./NgoCsrFocusAreas1";
import NgoCsrImpact1 from "./NgoCsrImpact1";
import NgoCsrInitiatives1 from "./NgoCsrInitiatives1";
import NgoStats1 from "../stats/NgoStats1";
import { renderNgoEditorPart } from "../../../lib/ngoEditorParts";

/**
 * CSR page (Pattern B) — Commitment + Focus + Impact + Initiatives + Stats
 * nested on one section (`focusAreas`, `impact`, `recentInitiatives`, `stats`).
 */
export default function NgoCSRPage1({
  data: customData,
  editorPart,
}: SectionProps & { editorPart?: number }) {
  const custom = customData as unknown as Partial<NGOCsrData> & {
    stats?: Record<string, unknown>;
    partOrder?: number[];
  };
  const commitment = {
    ...site.csr.commitment,
    ...custom?.commitment,
    cards: custom?.commitment?.cards ?? site.csr.commitment.cards,
  };

  const commitmentPart = (
    <main key="commitment" className="w-full bg-white font-sans">
      <section
        data-editor-section-label="CSR Commitment"
        data-editor-fields="commitment"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            <div className="flex items-center md:items-start md:justify-start justify-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
              <EditableNgoIcon
                name={
                  (commitment as { icon?: string } | undefined)?.icon ||
                  "hand-heart"
                }
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{commitment.subtitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-3">
              {commitment.title}
            </h2>
            <div className="w-20 h-1 mx-auto lg:mx-0 bg-[#16a34a] rounded-full" />

            <p className="md:text-base mt-2 text-md text-center md:text-start sm:text-lg text-gray-600">
              {commitment.description}
            </p>

            <div className="pt-4 flex justify-center md:justify-start">
              <Link
                href={commitment.buttonUrl || "/about-us"}
                data-editor-keep-click="true"
                data-editor-nav="true"
                className="inline-flex items-center gap-3 border-2 border-[#ff5a36] text-[#ff5a36] hover:bg-[#ff5a36] hover:text-white transition-all px-8 py-3.5 rounded-full text-base font-bold shadow-xs hover:shadow-md"
              >
                <span>{commitment.buttonText}</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(commitment.cards ?? []).map(
              (card: {
                id?: string;
                title?: string;
                description?: string;
                iconName?: string;
                icon?: string;
              }) => {
                const cardIcon = card.iconName || card.icon || "users";
                const theme = getCsrIconTheme(cardIcon);
                return (
                  <div
                    key={card.id}
                    data-editor-item-type="CsrCommitmentCard"
                    data-editor-item-label={card.title || "Commitment card"}
                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center border ${theme.border}`}
                    >
                      {renderCsrIcon(cardIcon, "w-8 h-8")}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a0c2e]">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>
    </main>
  );

  const parts = [
    commitmentPart,
    <NgoCsrFocusAreas1 key="focusAreas" data={custom?.focusAreas} />,
    <NgoCsrImpact1 key="impact" data={custom?.impact} />,
    <NgoCsrInitiatives1
      key="recentInitiatives"
      data={custom?.recentInitiatives}
    />,
    <NgoStats1 key="stats" data={custom?.stats} />,
  ];

  const stored: number[] = Array.isArray(custom?.partOrder)
    ? custom.partOrder.filter(
        (index: unknown): index is number => typeof index === "number",
      )
    : [0, 1, 2, 3, 4];
  const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
  parts.forEach((part, index) => {
    if (part && !order.includes(index)) order.push(index);
  });
  const page = <>{order.map((index) => parts[index])}</>;

  return renderNgoEditorPart(editorPart, parts, page);
}

"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import { CSR_FALLBACK_IMAGE } from "./ngoCsrShared";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  getNgoEventDetailHref,
  resolveNgoEventSlug,
  writeNgoEventDetailSlug,
} from "../../../lib/ngoEventDetails";

type InitiativeCard = {
  id?: string;
  date?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkText?: string;
  linkUrl?: string;
};

export default function NgoCsrInitiatives1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const custom = (customData || {}) as {
    subtitle?: string;
    cards?: InitiativeCard[];
    recentInitiatives?: {
      subtitle?: string;
      cards?: InitiativeCard[];
    };
  };
  const fallback = site.csr?.recentInitiatives;
  const subtitle =
    custom.subtitle ||
    custom.recentInitiatives?.subtitle ||
    fallback?.subtitle ||
    "RECENT INITIATIVES";
  const cards =
    (Array.isArray(custom.cards) && custom.cards.length
      ? custom.cards
      : Array.isArray(custom.recentInitiatives?.cards) &&
          custom.recentInitiatives.cards.length
        ? custom.recentInitiatives.cards
        : fallback?.cards) || [];

  return (
    <section
      data-editor-section-label="Recent Initiatives"
      data-editor-fields="subtitle cards"
      className="pt-8 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white font-sans"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5a36]" />
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#ff5a36]">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={card.id || index}
            data-editor-item-type="CsrInitiative"
            data-editor-item-label={card.title || "Initiative"}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full">
                <Image
                  src={card.imageUrl || CSR_FALLBACK_IMAGE}
                  alt={card.title || "Initiative"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  data-editor-media
                  data-editor-media-type="image"
                  data-editor-media-src={card.imageUrl || CSR_FALLBACK_IMAGE}
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span>{card.date}</span>
                </div>

                <h3 className="text-lg font-bold text-[#1a0c2e]">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <Link
                href={getNgoEventDetailHref({
                  title: card.title,
                  href: card.linkUrl,
                })}
                data-editor-keep-click="true"
                data-editor-nav="true"
                onClick={(event: ReactMouseEvent<HTMLAnchorElement>) => {
                  if (!preview) return;
                  event.preventDefault();
                  event.stopPropagation();
                  writeNgoEventDetailSlug(
                    resolveNgoEventSlug({
                      title: card.title,
                      slug: undefined,
                      href: undefined,
                    }),
                  );
                  preview.setCurrentPage("Event Details");
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#ff5a36] hover:text-[#e04f2e] transition-colors"
              >
                <span>{card.linkText || "Read More"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

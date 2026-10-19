"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { site, type NGOEventsData } from "../data/categorySite";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  getNgoEventDetailHref,
  resolveNgoEventSlug,
  writeNgoEventDetailSlug,
} from "../../../lib/ngoEventDetails";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  HandHeart,
} from "lucide-react";

type NGOEventItem = NGOEventsData["items"][number];

const FALLBACK_IMAGE =
  "/categories/ngo/template1/children-speaking-holding-book.jpg";

export default function NgoEvent1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const candidate = customData as unknown as Partial<NGOEventsData> | undefined;
  const hasOwnItems = Array.isArray(candidate?.items);
  const data = (
    hasOwnItems
      ? {
          ...site.events,
          ...candidate,
          items: candidate?.items ?? [],
        }
      : candidate?.banner
        ? { ...site.events, ...candidate }
        : site.events
  ) as NGOEventsData;

  const { pretitle, title, items = [], pagination } = data;
  const visibleItems = useMemo(
    () =>
      (items || []).filter(
        (item) => (item as { active?: boolean }).active !== false,
      ),
    [items],
  );
  const itemsPerPage = pagination?.itemperpage || 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const currentItems = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return visibleItems.slice(startIndex, startIndex + itemsPerPage);
  }, [visibleItems, itemsPerPage, safePage]);

  const titleParts = (title || "").split(" Event ");
  const hasEventHighlight = titleParts.length > 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEventDetail = (
    event: ReactMouseEvent,
    item: NGOEventItem,
  ) => {
    if (!preview) return;
    event.preventDefault();
    event.stopPropagation();
    writeNgoEventDetailSlug(
      resolveNgoEventSlug({
        id: item.id,
        title: item.title,
        // Force id-based identity even when slug is bare "/event-details".
        slug: undefined,
        href: undefined,
      }),
    );
    preview.setCurrentPage("Event Details");
  };

  return (
    <main className="bg-white">
      <section data-editor-section-label="Events" data-editor-fields="pretitle title items pagination" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mx-auto mb-12 md:mb-16">
            <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
              <HandHeart className="w-8 h-8 text-emerald-600" />
              <span className="italic font-serif">{pretitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
              {hasEventHighlight ? (
                <>
                  {titleParts[0]}{" "}
                  <span className="text-[#ff5500]">Event</span> {titleParts[1]}
                </>
              ) : (
                title
              )}
            </h2>
            <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((item: NGOEventItem) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden shadow-lg group h-[400px] flex flex-col justify-end"
              >
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="relative z-10 bg-gradient-to-t from-[#08121e] via-[#08121e]/90 to-transparent p-6 pt-20 flex flex-col justify-end w-full">
                  <div className="mb-2.5">
                    <span className="bg-[#ff5500] text-white text-sm font-extrabold px-3.5 py-1.5 rounded-md shadow-md inline-flex items-center gap-2 uppercase tracking-wide">
                      <Calendar className="w-4 h-4 text-white" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#ff5500] transition-colors duration-200 line-clamp-2 mb-3 leading-snug drop-shadow-sm">
                    <Link
                      href={getNgoEventDetailHref({
                        id: item.id,
                        title: item.title,
                      })}
                      data-editor-keep-click="true"
                      onClick={(event) => openEventDetail(event, item)}
                    >
                      {item.title}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                    <MapPin className="w-4 h-4 text-[#ff5500] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ff5500] hover:text-[#ff5500] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    safePage === page
                      ? "bg-[#ff5500] text-white shadow-md scale-105"
                      : "border border-gray-200 cursor-pointer text-gray-700 hover:border-[#ff5500] hover:text-[#ff5500]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ff5500] hover:text-[#ff5500] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

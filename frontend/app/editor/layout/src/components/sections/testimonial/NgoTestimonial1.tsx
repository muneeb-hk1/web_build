"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type { SectionProps } from "../../../types/section";
import { site, type NGOTestimonialData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

type TestimonialItem = {
  id?: string | number;
  name?: string;
  role?: string;
  image?: string;
  quote?: string;
  rating?: number;
};

export default function TestimonialSection({ data: customData }: SectionProps) {
  const custom = (customData ?? {}) as Partial<NGOTestimonialData> & {
    pageLayout?: boolean;
    layout?: string;
    subtitle?: string;
  };
  const data = {
    ...site.testimonial,
    ...custom,
    testimonialItems: custom.testimonialItems?.length
      ? custom.testimonialItems
      : site.testimonial.testimonialItems,
  };
  const {
    pretitle,
    title,
    description,
    testimonialItems = [],
  } = data;

  // Page layout is explicit only — never infer from banner (home pack may still have it).
  const isPageLayout =
    custom.pageLayout === true || custom.layout === "page";

  // Home carousel: up to 9. Full page grid: show all seeded cards.
  const visibleItems = (
    isPageLayout ? testimonialItems : testimonialItems.slice(0, 9)
  ) as TestimonialItem[];
  const totalItems = visibleItems.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    if (isPageLayout) return;
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [isPageLayout]);

  const totalPages = Math.ceil(totalItems / Math.max(itemsPerPage, 1));
  const activePage = Math.floor(currentIndex / Math.max(itemsPerPage, 1));

  const handleNext = () => {
    if (!totalItems) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    if (!totalItems) return;
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentIndex(pageIndex * itemsPerPage);
  };

  if (isPageLayout) {
    const heading =
      title === "Our Valuable Customer Awesome Feedback" || !title
        ? "Testimonial"
        : title;
    const pageSize = 3;
    const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
    const safePage = Math.min(Math.max(activePage, 0), pageCount - 1);
    const pageItems = visibleItems.slice(
      safePage * pageSize,
      safePage * pageSize + pageSize,
    );

    const goToPage = (pageIndex: number) => {
      const next = ((pageIndex % pageCount) + pageCount) % pageCount;
      setCurrentIndex(next * pageSize);
    };

    return (
      <main className="w-full bg-white font-sans">
        <section
          data-editor-section-label="Testimonial"
          data-editor-fields="title description testimonialItems"
          className="w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#1a1a1a] tracking-tight">
                {heading}
              </h1>
              {description ? (
                <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
              {pageItems.map((item, index) => {
                const absoluteIndex = safePage * pageSize + index;
                const isFeatured = absoluteIndex % 3 === 0;

                return (
                  <article
                    key={item.id || `${safePage}-${index}`}
                    data-editor-item-type="TestimonialItem"
                    data-editor-item-label={item.name || `Testimonial ${index + 1}`}
                    className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg border transition-all duration-300 ${
                      isFeatured
                        ? "border-amber-400 shadow-amber-100"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="absolute -top-4 left-6 z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${
                          isFeatured ? "bg-amber-500" : "bg-emerald-800"
                        }`}
                      >
                        <FaQuoteLeft className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center gap-1 mb-4 justify-center">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <FaStar key={i} className="text-amber-400 w-4 h-4" />
                        ))}
                      </div>

                      <p className="text-gray-600 text-sm sm:text-sm text-center leading-relaxed mb-6 italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-400">
                        <Image
                          src={
                            item.image ||
                            "/categories/ngo/template1/girl-is-reading-book-with-word-one-it.jpg"
                          }
                          alt={item.name || "Testimonial"}
                          fill
                          sizes="48px"
                          className="object-cover"
                          data-editor-media
                          data-editor-media-type="image"
                          data-editor-media-src={
                            item.image ||
                            "/categories/ngo/template1/girl-is-reading-book-with-word-one-it.jpg"
                          }
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-base">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.role}</p>
                      </div>
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl ${
                        isFeatured ? "bg-amber-500" : "bg-emerald-800"
                      }`}
                    />
                  </article>
                );
              })}
            </div>

            {pageCount > 1 ? (
              <nav
                className="mt-10 md:mt-12 flex items-center justify-center gap-2"
                aria-label="Testimonial pages"
              >
                <button
                  type="button"
                  onClick={() => goToPage(safePage - 1)}
                  aria-label="Previous page"
                  className="h-9 w-9 rounded-md bg-gray-100 text-slate-700 hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: pageCount }).map((_, pageIdx) => (
                  <button
                    key={pageIdx}
                    type="button"
                    onClick={() => goToPage(pageIdx)}
                    aria-label={`Page ${pageIdx + 1}`}
                    aria-current={safePage === pageIdx ? "page" : undefined}
                    className={`h-9 min-w-9 px-2.5 rounded-md text-sm font-semibold transition-colors ${
                      safePage === pageIdx
                        ? "bg-[#f9570c] text-white"
                        : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageIdx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(safePage + 1)}
                  aria-label="Next page"
                  className="h-9 w-9 rounded-md bg-gray-100 text-slate-700 hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </nav>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <section
      data-editor-section-label="Testimonials"
      data-editor-fields="icon pretitle title description testimonialItems"
      className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
            <EditableNgoIcon
              name={data.icon || data.iconName || "hand-heart"}
              className="w-8 h-8 text-emerald-600"
            />
            <span className="italic font-serif">{pretitle}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2 max-w-3xl">
            {title}
          </h2>
          <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto" />

          {description && (
            <p className="text-gray-600 mt-2 text-base sm:text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="relative px-2 sm:px-10 lg:px-12">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md text-emerald-800 flex items-center justify-center hover:bg-emerald-700 hover:text-white transition-all duration-300 focus:outline-none"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {visibleItems.map((item, index) => {
                const isFeatured = index % 3 === 0;

                return (
                  <div
                    key={item.id || index}
                    data-editor-item-type="TestimonialItem"
                    data-editor-item-label={item.name || `Testimonial ${index + 1}`}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-3 sm:p-4 box-border"
                  >
                    <div
                      className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg border transition-all duration-300 ${
                        isFeatured
                          ? "border-amber-400 shadow-amber-100"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="absolute -top-4 left-6 z-10">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${
                            isFeatured ? "bg-amber-500" : "bg-emerald-800"
                          }`}
                        >
                          <FaQuoteLeft className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center gap-1 mb-4 justify-center">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <FaStar key={i} className="text-amber-400 w-4 h-4" />
                          ))}
                        </div>

                        <p className="text-gray-600 text-sm sm:text-sm text-center leading-relaxed mb-6 italic">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-400">
                          <Image
                            src={
                              item.image ||
                              "/categories/ngo/template1/girl-is-reading-book-with-word-one-it.jpg"
                            }
                            alt={item.name || "Testimonial"}
                            fill
                            sizes="48px"
                            className="object-cover"
                            data-editor-media
                            data-editor-media-type="image"
                            data-editor-media-src={
                              item.image ||
                              "/categories/ngo/template1/girl-is-reading-book-with-word-one-it.jpg"
                            }
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-slate-900 text-base">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">{item.role}</p>
                        </div>
                      </div>

                      <div
                        className={`absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl ${
                          isFeatured ? "bg-amber-500" : "bg-emerald-800"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md text-emerald-800 flex items-center justify-center hover:bg-emerald-700 hover:text-white transition-all duration-300 focus:outline-none"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-center gap-2 mt-2">
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <button
              key={pageIdx}
              onClick={() => handlePageClick(pageIdx)}
              aria-label={`Go to page ${pageIdx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                activePage === pageIdx
                  ? "w-4 h-4 bg-amber-500"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

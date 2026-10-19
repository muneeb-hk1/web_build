"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import siteData from "../../../data/pestContent";
import { usePestPath } from "../header/PestLink";

interface GalleryFilter {
  label: string;
  value: string;
  field?: string;
}

export default function Gallery({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePestPath();
  const onGalleryPage = /galler/i.test(pathname || "");

  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const galleryData = {
    ...(pestControl?.sections?.Gallery?.variants?.PestGallery1 || {}),
    ...data,
  };

  const badge = galleryData.pretitle || galleryData.badge || "GALLERY";
  const title = galleryData.title || "Our Work in Action";
  const desc =
    galleryData.desc ||
    galleryData.description ||
    "Explore photos of our professional team protecting homes, offices, and commercial sites.";

  const filters: GalleryFilter[] =
    galleryData.categories || galleryData.filters || [
      { label: "All Work", value: "all" },
      { label: "Residential", value: "residential" },
      { label: "Commercial", value: "commercial" },
      { label: "Termite Defense", value: "termite" },
      { label: "Outdoor & Yard", value: "outdoor" },
    ];

  const rawItems: any[] = (
    galleryData.items ||
    galleryData.galleryItems ||
    galleryData.images ||
    []
  ).filter((item: { showOnHome?: boolean }) => onGalleryPage || item.showOnHome !== false);

  const fallbackItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      alt: "Outdoor Pest Treatment",
      title: "Outdoor Yard Defense",
      category: "Outdoor",
      description: "Comprehensive perimeter spray to keep external garden pests away.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80",
      alt: "Kitchen Pest Inspection",
      title: "Commercial Kitchen Sanitation",
      category: "Commercial",
      description: "Targeted safe treatments tailored for hospitality and food preparation zones.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      alt: "Residential Living Room Care",
      title: "Residential Pest Protection",
      category: "Residential",
      description: "Eco-friendly, odorless treatment safe for pets and young children.",
    },
  ];

  const items =
    rawItems.length > 0
      ? rawItems.map((item, idx) => ({
          id: item.id || idx,
          image:
            item.image ||
            item.src ||
            item.img ||
            fallbackItems[idx % fallbackItems.length].image,
          alt: item.alt || item.title || "Gallery Image",
          title: item.title || item.heading || "Pest Control Service",
          category: item.category || item.tag || "Residential",
          description: item.description || item.body || item.desc || "",
        }))
      : fallbackItems;

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter(
          (item) =>
            item.category?.toLowerCase().trim() ===
            activeFilter.toLowerCase().trim()
        );

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handleFilterChange = (filterVal: string) => {
    setActiveFilter(filterVal);
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#3fd080]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#00482B]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3fd080]/12 rounded-full blur-[100px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Image Grid / Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="w-full min-w-full md:w-auto md:min-w-0 flex-shrink-0 md:flex-shrink snap-center"
            >
              <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-black/5 relative h-[380px] sm:h-[400px] group transition-all duration-300 flex flex-col justify-end p-6 sm:p-7">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />

                <div className="relative z-20 flex flex-col gap-1.5">
                  <span className="text-[#3fd080] text-xs font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  
                  <h3 className="text-white font-bold text-[18px] sm:text-[20px] leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-neutral-200 text-xs sm:text-[13px] line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Indicator Dots */}
        {filteredItems.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {filteredItems.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToCard(dotIdx)}
                aria-label={`Slide to photo ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === dotIdx
                    ? "w-6 bg-[#00482B]"
                    : "w-2 bg-[#00482B]/25 hover:bg-[#00482B]/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
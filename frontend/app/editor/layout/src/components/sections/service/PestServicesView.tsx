"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link, { usePestPath } from "../header/PestLink";
import { ArrowRight } from "lucide-react";
import siteData from "../../../data/pestContent";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getHiddenManagerFamilies } from "../../../lib/navVisibility";

interface ServiceItem {
  slug: string;
  name?: string;
  title?: string;
  image?: string;
  heading?: string;
  desc1?: string;
  desc2?: string;
  description?: string;
  keyBenefits?: string[];
}

export default function Services({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const preview = useOptionalPreview();
  const pathname = usePestPath();
  if (getHiddenManagerFamilies(preview?.pageLinks).has("services")) return null;
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const servicesData = {
    ...(pestControl?.sections?.ServicesGrid?.variants?.PestServicesGrid1 ||
      pestControl?.sections?.Services?.variants?.PestServices1 ||
      {}),
    ...data,
  };

  const badge = servicesData.badge || "OUR SERVICES";
  const title =
    servicesData.title || "Professional Pest Control Services for a Safer Space";
  const onServicePage = /service/i.test(pathname || "");
  const items: ServiceItem[] = (
    servicesData.items ||
    servicesData.services ||
    []
  ).filter(
    (item: ServiceItem & { showOnHome?: boolean }) =>
      onServicePage || item.showOnHome !== false,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-hidden">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#3fd080]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-88 h-88 bg-[#00482B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3fd080]/12 rounded-full blur-[120px] pointer-events-none" />

      {/* Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-7 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] px-5 py-1.5 rounded-full mb-2.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00482B] animate-pulse" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-neutral-900 leading-[1.25]">
            {title.includes("Pest Control") ? (
              <>
                {title.split("Pest Control")[0]}
                <span className="text-[#00482B]">Pest Control</span>
                {title.split("Pest Control")[1]}
              </>
            ) : (
              title
            )}
          </h2>

          {servicesData?.description && (
            <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
              {servicesData.description}
            </p>
          )}
        </div>

        {/* Cards Wrapper */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => {
            const serviceName = item.name || item.title || `Service ${index + 1}`;
            const serviceSlug =
              item.slug ||
              serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const cardImg =
              item.image ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
            const serviceDesc =
              item.desc1 ||
              item.description ||
              "Keep your home safe and pest-free with our effective and eco-friendly solutions.";

            return (
              <div
                key={serviceSlug || index}
                className="w-full min-w-full md:w-auto md:min-w-0 flex-shrink-0 md:flex-shrink snap-start px-1 md:px-0"
              >
                <div className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full text-neutral-900 border border-neutral-200/80">
                  
                  {/* Top Image */}
                  <div>
                    <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-neutral-100">
                      <Image
                        src={cardImg}
                        alt={serviceName}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-[19px] sm:text-[21px] font-bold text-neutral-900 tracking-tight mb-2 group-hover:text-[#00482B] transition-colors">
                        {serviceName}
                      </h3>
                      
                      <p className="text-neutral-600 text-[14px] sm:text-[15px] font-normal leading-relaxed line-clamp-3">
                        {serviceDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 pb-5 pt-0">
                    <Link
                      href={`/services/${serviceSlug}`}
                      className="inline-flex items-center gap-2 text-[14px] sm:text-[14.5px] font-bold text-[#00482B] group-hover:text-[#28a760] transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight
                        size={15}
                        strokeWidth={2.4}
                        className="group-hover:translate-x-1.5 transition-transform"
                      />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Dots */}
        {items.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToCard(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
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
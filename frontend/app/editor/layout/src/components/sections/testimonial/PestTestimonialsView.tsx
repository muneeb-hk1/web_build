"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import siteData from "../../../data/pestContent";

export default function Testimonials({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const testimonialData = {
    ...(pestControl?.sections?.Testimonials?.variants?.PestTestimonials1 ||
      pestControl?.sections?.Reviews?.variants?.PestReviews1 ||
      {}),
    ...data,
  };

  const badge = testimonialData.badge || "TESTIMONIALS";
  const title = testimonialData.title || "What Our Clients Say";

  const fallbackItems = [
    {
      name: "Rohit Sharma",
      role: "Home Owner",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      content:
        "The pest control service was excellent! The team was professional, on-time, and very thorough. Our home is now completely pest-free, and we couldn’t be happier with the results. Highly recommended!",
    },
    {
      name: "Priya Mehta",
      role: "Business Owner",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      content:
        "We have been using their pest control services for our office, and the experience has been great. The team is knowledgeable, uses safe methods, and ensures long-lasting protection. Our workspace is now much cleaner and safer.",
    },
  ];

  const rawItems: any[] =
    testimonialData.items || testimonialData.reviews || testimonialData.testimonials || [];

  const items =
    rawItems.length > 0
      ? rawItems.map((item, idx) => ({
          name: item.name || item.author || fallbackItems[idx % fallbackItems.length].name,
          role: item.role || item.designation || fallbackItems[idx % fallbackItems.length].role,
          rating: item.rating || 5,
          image: item.image || item.avatar || fallbackItems[idx % fallbackItems.length].image,
          content: item.content || item.review || item.message || item.text || fallbackItems[idx % fallbackItems.length].content,
        }))
      : fallbackItems;

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
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#3fd080]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#00482B]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-5 md:mb-6 max-w-3xl">
          <div className="inline-block bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] px-5 py-1.5 rounded-full mb-2.5 shadow-xs">
            {badge}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-neutral-900 leading-[1.25]">
            {title.includes("Clients Say") ? (
              <>
                {title.split("Clients Say")[0]}
                <span className="text-[#00482B]">Clients Say</span>
              </>
            ) : (
              title
            )}
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto md:grid md:grid-cols-2 gap-6 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-full min-w-full md:w-auto md:min-w-0 flex-shrink-0 md:flex-shrink snap-center"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col justify-between h-full min-h-[290px]">
                <p className="text-neutral-700 text-[15px] sm:text-[17px] leading-[1.65] font-medium mb-6">
                  {item.content}
                </p>

                <div className="pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-[#00482B] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-[16px] sm:text-[18px] font-bold text-neutral-900 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-[#00482B] mb-1">
                        {item.role}
                      </p>
                      <div className="flex items-center gap-1 text-[#f5a623]">
                        {Array.from({ length: item.rating }).map((_, starIdx) => (
                          <Star key={starIdx} size={15} fill="currentColor" stroke="none" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-[#a8d6bf] font-serif text-4xl sm:text-5xl leading-none select-none font-bold">
                    ”
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Indicator Dots */}
        {items.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToCard(dotIdx)}
                aria-label={`Slide to card ${dotIdx + 1}`}
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
import Image from "next/image";
import { site, type NGOFactsData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import { Heart, Leaf } from "lucide-react";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
  
export default function NgoFacts1({ data: customData }: SectionProps) {
  const custom = (customData ?? {}) as Partial<NGOFactsData>;
  const fallback = site.facts ?? {};
  const data = {
    ...fallback,
    ...custom,
    stats:
      Array.isArray(custom.stats) && custom.stats.length
        ? custom.stats
        : Array.isArray(fallback.stats)
          ? fallback.stats
          : [],
  };
  const stats = Array.isArray(data.stats) ? data.stats : [];

  return (
    <>
      <section
        data-editor-section-label="Some Fact"
        data-editor-fields="icon badgeIcon badge title highlightedTitle description mainImage secondaryImage stats footerText"
        className="py-8 md:py-12 px-3 sm:px-6 lg:px-16 bg-white font-sans overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Side: Image Composition with Decorative Borders */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            {/* Background Dot Grid */}
            <div className="absolute -left-8 top-6 grid grid-cols-4 gap-2.5 z-0 opacity-40 hidden sm:grid">
              {[...Array(48)].map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-emerald-700 rounded-full"
                />
              ))}
            </div>

            {/* Decorative Green Outer Border Frame */}
            <div className="absolute -left-3 -bottom-3 w-[82%] h-[92%] border-2 border-[#005c36] rounded-[2.5rem] z-0 hidden sm:block" />

            {/* Main Large Image Card */}
            <div className="relative z-10 w-[100%] sm:w-[90%] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg bg-[#e8f0ea]">
              {data.mainImage ? (
                <Image
                  src={data.mainImage}
                  alt="Main impact illustration"
                  width={600}
                  height={700}
                  sizes="(min-width: 640px) 90vw, 100vw"
                  className="w-full h-[380px] sm:h-[480px] object-cover"
                  data-editor-media
                  data-editor-media-type="image"
                  data-editor-media-src={data.mainImage}
                />
              ) : null}
            </div>

            {/* Secondary Overlapping Image Card */}
            <div className="absolute bottom-[-20px] right-2 sm:right-6 w-[52%] sm:w-[48%] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl z-20 bg-[#e8f0ea]">
              {data.secondaryImage ? (
                <Image
                  src={data.secondaryImage}
                  alt="Sub impact illustration"
                  width={350}
                  height={300}
                  sizes="(min-width: 640px) 48vw, 52vw"
                  className="w-full h-[180px] sm:h-[220px] object-cover"
                  data-editor-media
                  data-editor-media-type="image"
                  data-editor-media-src={data.secondaryImage}
                />
              ) : null}
            </div>

            {/* Floating Heart Badge */}
            <div className="absolute bottom-[-30px] left-[35%] sm:left-[38%] z-30 bg-[#005c36] rounded-full p-4 border-4 border-white shadow-xl flex items-center justify-center">
              <div className="border border-white/40 rounded-full p-2">
                <EditableNgoIcon
                  name={data.badgeIcon || "heart-handshake"}
                  className="w-7 h-7 text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Text & Stat Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center mt-6 lg:mt-0 text-center lg:text-left items-center lg:items-start">
            {/* Section Header */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
              <EditableNgoIcon
                name={data.icon || "hand-heart"}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{data.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
              {data.title}{" "}
              <span className="text-[#ff5500]">{data.highlightedTitle}</span>
            </h2>
            <div className="w-20 mb-1 h-1 mx-auto lg:mx-0 bg-[#16a34a] rounded-full"></div>

            <p className="text-gray-500 text-sm sm:text-base text-center md:text-start leading-relaxed mb-3 ">
              {data.description}
            </p>

            {/* Stats Cards Row (Responsive: 1 Mobile, 2 Tablet, 3 Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => {
                const isDark = stat.variant === "dark";
                return (
                  <div
                    key={stat.id}
                    className={`relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between border transition-all duration-300 ${isDark
                      ? "bg-[#005c36] text-white border-[#005c36] shadow-md"
                      : "bg-white text-[#08121e] border-gray-100 shadow-sm"
                      }`}
                  >
                    {/* Decorative Leaf Graphic for 3rd/Dark Card */}
                    {isDark && (
                      <Leaf className="absolute -right-3 -top-3 w-24 h-24 text-emerald-700/30 rotate-45 pointer-events-none" />
                    )}

                    {/* Icon Circle */}
                    <div className="mb-4 relative z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark
                          ? "bg-emerald-700/40 border border-white/20"
                          : stat.accentColor === "orange"
                            ? "bg-orange-50"
                            : "bg-emerald-50"
                          }`}
                      >
                        <EditableNgoIcon
                          name={stat.icon || "calendar"}
                          className={`w-6 h-6 ${
                            isDark
                              ? "text-white"
                              : stat.accentColor === "orange"
                                ? "text-[#ff5500]"
                                : "text-[#005c36]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Stat Content */}
                    <div className="relative z-10">
                      <h3
                        className={`text-2xl sm:text-3xl font-extrabold mb-1 ${isDark
                          ? "text-white"
                          : stat.accentColor === "orange"
                            ? "text-[#ff5500]"
                            : "text-[#005c36]"
                          }`}
                      >
                        {stat.value}
                      </h3>
                      <p
                        className={`text-sm font-semibold leading-snug ${isDark ? "text-emerald-100" : "text-gray-600"
                          }`}
                      >
                        {stat.label}
                      </p>

                      {/* Bottom Indicator Line */}
                      <div
                        className={`w-8 h-1 mt-3 rounded-full ${isDark
                          ? "bg-emerald-400/40"
                          : stat.accentColor === "orange"
                            ? "bg-[#ff5500]"
                            : "bg-[#005c36]"
                          }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Callout */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#005c36]">
                <Heart className="w-4 h-4 fill-emerald-100 text-[#005c36]" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {data.footerText}
              </span>
              {/* <ArrowRight className="w-4 h-4 text-[#005c36] ml-1" /> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

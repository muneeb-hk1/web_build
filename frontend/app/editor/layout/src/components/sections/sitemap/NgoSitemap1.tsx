import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { site, type NGOSitemapData } from "../data/categorySite";

export default function NgoSitemap1({ data: customData }: SectionProps) {
  const custom = customData as unknown as Partial<NGOSitemapData> | undefined;
  const data = {
    ...site.sitemap,
    ...custom,
    pageHeader: {
      ...site.sitemap.pageHeader,
      ...custom?.pageHeader,
      banner: {
        ...site.sitemap.pageHeader.banner,
        ...custom?.pageHeader?.banner,
      },
    },
    sitemapCategories: custom?.sitemapCategories ?? site.sitemap.sitemapCategories,
  };

  const { pageHeader, sitemapCategories } = data;

  return (
    <main className="w-full bg-[#fbfbfb] text-[#111827] font-sans antialiased min-h-screen">
      <section
        data-editor-section-label="Sitemap Links"
        data-editor-fields="sitemapCategories"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-[#112117] tracking-tight">
            {pageHeader?.title || "Sitemap"}
          </h1>
          <div className="relative w-48 sm:w-64 h-[2px] bg-[#2d7d52]/40 mt-4 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e3a] absolute" />
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#05311e] text-white py-4 px-6 text-center font-semibold text-base sm:text-lg tracking-wide border-b border-[#05311e]">
            Quick Links
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80">
            {(sitemapCategories ?? []).map((category, index) => (
              <div key={category.id || index} className="flex flex-col">
                <div className="p-4 sm:p-5 bg-white border-b border-gray-100 min-h-[58px] flex items-center">
                  <h2 className="text-sm sm:text-base font-bold text-[#0f2419] tracking-tight leading-snug">
                    {index + 1}. {category.category}
                  </h2>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5 flex-1 bg-white">
                  {(category.links ?? []).map((link, idx) => (
                    <Link
                      key={`${category.id}-${idx}`}
                      href={link.href || "/"}
                      className="group flex items-center gap-1.5 text-sm sm:text-[13px] font-semibold text-gray-800 hover:text-[#1b5e3a] transition-colors leading-relaxed"
                    >
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-700 group-hover:text-[#1b5e3a] stroke-[2.5]" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

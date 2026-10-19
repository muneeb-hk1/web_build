import type { InnerBannerAppearance } from "../../../types/innerBannerAppearance";
import { CheckCircle2 } from "lucide-react";
export type NgoLegalSection = {
  title: string;
  text?: string;
  items?: string[];
  number?: string;
};

export type NgoLegalLayoutData = {
  innerBannerAppearance?: InnerBannerAppearance;
  banner?: {
    title?: string;
    breadcrumbHome?: string;
    breadcrumbCurrent?: string;
    bgImageUrl?: string;
  };
  sections?: NgoLegalSection[];
};

export function mergeNgoLegalData(
  custom: Partial<NgoLegalLayoutData> | undefined,
  fallback: NgoLegalLayoutData,
): NgoLegalLayoutData {
  return {
    ...fallback,
    ...custom,
    banner: { ...fallback.banner, ...custom?.banner },
    sections: custom?.sections ?? fallback.sections,
  };
}

export default function NgoLegalLayout({ data }: { data: NgoLegalLayoutData }) {
  const { sections } = data;

  return (
    <main className="w-full bg-[#fcfcfc] text-slate-800 font-sans antialiased min-h-screen">
      <section
        data-editor-section-label="Policy Content"
        data-editor-fields="sections"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16"
      >
        <div className="space-y-10">
          {sections && sections.length > 0 && (
            <div className="space-y-8">
              {sections.map((section, index) => {
                const sectionNumber =
                  section.number || (index + 1).toString().padStart(2, "0");
                const cleanTitle = (section.title ?? "").replace(
                  /^\d+[\.\s-]+\s*/,
                  "",
                );

                return (
                  <div key={`${section.title}-${index}`} className="group">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f0f9f4] text-[#005d3b] flex items-center justify-center font-extrabold text-lg sm:text-xl tracking-tight shrink-0">
                        {sectionNumber}
                      </div>

                      <div className="bg-emerald-800 hidden sm:block w-0.5 h-14 mt-1 opacity-35" />

                      <div className="space-y-2.5 flex-1 pt-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                          {cleanTitle}
                        </h3>

                        {section.text && (
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                            {section.text}
                          </p>
                        )}

                        {section.items && section.items.length > 0 && (
                          <ul className="pt-1.5 space-y-2">
                            {section.items.map((item, itemIdx) => (
                              <li key={`${item}-${itemIdx}`} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#005d3b] shrink-0 mt-1" />
                                <span className="text-sm font-medium text-slate-600 leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {index < sections.length - 1 && (
                      <div className="border-b border-dashed border-slate-200 my-8 sm:my-10" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

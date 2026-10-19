import Image from "next/image";
import { site, type NGOMissionPageData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

export default function NgoMissionVision1({ data: customData }: SectionProps) {
    const candidate = customData as unknown as Partial<NGOMissionPageData> | undefined;
    const fallback = site.missionPage ?? {};
    const data = {
        ...fallback,
        ...candidate,
        highlights:
          Array.isArray(candidate?.highlights) && candidate.highlights.length
            ? candidate.highlights
            : fallback.highlights ?? [],
    };

    return (
        <main>
            <section data-editor-section-label="Our Mission" data-editor-fields="icon eyebrow sectionTitle highlightedTitle sectionText sectionImage highlights" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
                            <EditableNgoIcon
                                name={data.icon || data.iconName || "hand-heart"}
                                className="w-8 h-8 text-emerald-600"
                            />
                            <span className="italic font-serif">{data.eyebrow}</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                            {data.sectionTitle}{" "}
                            <span className="text-[#005c36] block sm:inline">{data.highlightedTitle}</span>
                        </h2>

                        <div className="w-20 mb-1 h-1 mx-auto lg:mx-0 bg-[#16a34a] rounded-full"></div>

                        <p className="text-gray-600 text-sm text-center md:text-start sm:text-base leading-relaxed mb-8 ">
                            {data.sectionText}
                        </p>

                        <div className="relative pl-3 space-y-6">
                            {data.highlights.map((item: Record<string, any>, index: number) => {
                                const isLast = index === data.highlights.length - 1;
                                return (
                                    <div key={item.id || index} className="relative flex items-start gap-4">
                                        {!isLast && (
                                            <div className="absolute left-5 top-10 w-[2px] h-[calc(100%+12px)] bg-dashed border-l-2 border-dashed border-gray-200" />
                                        )}

                                        <div className="relative z-10 w-10 h-10 md:w-20 md:h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                            <EditableNgoIcon
                                                name={item.icon || item.iconName}
                                                className={`w-5 h-5 md:w-12 md:h-12 ${item.icon === "skill" || item.icon === "community" ? "text-[#ff5500]" : "text-[#005c36]"}`}
                                            />
                                        </div>

                                        <div className="pt-1">
                                            <h3 className="text-base font-bold text-[#08121e] mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm sm:text-sm text-gray-500 leading-relaxed max-w-md">
                                                {item.description || item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg lg:max-w-none rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src={data.sectionImage}
                                alt={data.sectionTitle}
                                width={700}
                                sizes="(min-width: 1024px) 50vw, 512px"
                                height={850}
                                className="w-full h-[480px] sm:h-[620px] object-cover rounded-[2.5rem]"
                                data-editor-media
                                data-editor-media-type="image"
                                data-editor-media-src={data.sectionImage}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

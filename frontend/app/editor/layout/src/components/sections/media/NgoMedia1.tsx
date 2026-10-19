"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, HandHeart } from "lucide-react";
import { site, type NGOMediaData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";

export default function NgoMedia1({ data: customData }: SectionProps) {
    const custom = customData as unknown as Partial<NGOMediaData> | undefined;
    const legacyRootCards = (custom as { mediaCards?: unknown } | undefined)?.mediaCards;
    const contentCards = custom?.content?.mediaCards;
    const customCards = Array.isArray(contentCards) && contentCards.length
        ? contentCards
        : Array.isArray(legacyRootCards) && legacyRootCards.length
          ? legacyRootCards
          : null;
    const mediaCards =
        customCards && customCards.length
            ? customCards
            : site.media.content.mediaCards;
    const data = {
        ...site.media,
        ...custom,
        banner: { ...site.media.banner, ...custom?.banner },
        content: {
            ...site.media.content,
            ...custom?.content,
            mediaCards,
        },
    };
    const { content } = data;

    return (
        <>
            {/* Media Section */}
            <section data-editor-section-label="Media" data-editor-fields="banner content" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 font-sans">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Section Header */}
                    <div className="space-y-0 mb-7">
                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
                            <HandHeart className="w-8 h-8 text-emerald-600" />
                            <span className="italic font-serif">{content?.tagline}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                            {content?.sectionTitle || "As Seen In The News"}
                        </h2>
                        <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                        <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                            {content?.sectionDescription ||
                                "Our work and initiatives have been recognized and featured by leading media houses and news platforms."}
                        </p>
                        <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-4" />
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {content?.mediaCards?.map((card, index) => (
                            <Link
                                key={card.title ? `${card.title}-${index}` : `media-card-${index}`}
                                href={card.articleUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-xl border border-gray-200/80 p-2 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-24 sm:h-28 group"
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={card.logoUrl}
                                        alt={card.title}
                                        fill
                                        sizes="100%"
                                        className="object-contain filter transition-all duration-300"
                                        unoptimized
                                        data-editor-media
                                        data-editor-media-type="image"
                                        data-editor-media-src={card.logoUrl}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>


                </div>
            </section>
        </>
    );
}

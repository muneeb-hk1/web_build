"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Download, HandHeart } from "lucide-react";
import { site, type NGOBrochureData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";

export default function NgoBrochure1({ data: customData }: SectionProps) {
    const custom = customData as unknown as Partial<NGOBrochureData> | undefined;
    const legacyRootBrochures = (custom as { brochures?: unknown } | undefined)?.brochures;
    const contentBrochures = custom?.content?.brochures;
    const customBrochures = Array.isArray(contentBrochures) && contentBrochures.length
        ? contentBrochures
        : Array.isArray(legacyRootBrochures) && legacyRootBrochures.length
          ? legacyRootBrochures
          : null;
    const brochures =
        customBrochures && customBrochures.length
            ? customBrochures
            : site.brochure.content.brochures;
    const legacyRootCategories = (custom as { categories?: unknown } | undefined)?.categories;
    const contentCategories = custom?.content?.categories;
    const categories = Array.isArray(contentCategories) && contentCategories.length
        ? contentCategories
        : Array.isArray(legacyRootCategories) && legacyRootCategories.length
          ? legacyRootCategories
          : site.brochure.content.categories;
    const data = {
        ...site.brochure,
        ...custom,
        banner: { ...site.brochure.banner, ...custom?.banner },
        content: {
            ...site.brochure.content,
            ...custom?.content,
            brochures,
            categories,
        },
    };
    const { content } = data;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // Filtering Logic based on Search Input & Selected Category
    const filteredBrochures = content?.brochures?.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All Categories" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <>
            {/* Main Content Section */}
            <section data-editor-section-label="Brochure" data-editor-fields="banner content" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60 font-sans">
                <div className="max-w-7xl mx-auto">

                    {/* Header Title & Subtitle */}
                    <div className="text-center max-w-2xl mx-auto mb-5">
                        <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
                            <HandHeart className="w-8 h-8 text-emerald-600" />
                            <span className="italic font-serif">{content?.mainTitle}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                            {content?.title}
                        </h2>
                        <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                        <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                            {content?.description ||
                                "Explore our brochures to learn more about our initiatives, programs and impact."}
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-10">

                        {/* Search Input */}
                        <div className="relative w-full sm:w-2/3">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={content?.searchPlaceholder || "Search brochures..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="w-full sm:w-1/3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 font-medium cursor-pointer"
                            >
                                {content?.categories?.map((cat, idx) => (
                                    <option key={idx} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* 8 Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredBrochures.map((item, index) => (
                            <div
                                key={item.title ? `${item.title}-${index}` : `brochure-${index}`}
                                className="bg-white rounded-xl border border-gray-200/80 p-2.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-stretch gap-3 overflow-hidden"
                            >
                                {/* Left Side: Thumbnail Preview Image */}
                                <div className="relative w-28 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 min-h-[140px]">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        sizes="(min-width: 640px) 128px, 112px"
                                        className="object-cover object-center"
                                        data-editor-media
                                        data-editor-media-type="image"
                                        data-editor-media-src={item.imageUrl}
                                    />
                                </div>

                                {/* Right Side: Details & Action */}
                                <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                                    <div>
                                        <h3 className="font-bold  min-h-[70px] text-gray-900 text-md leading-snug ">
                                            {item.title}
                                        </h3>

                                        {/* Badge */}
                                        <div className="mt-2">
                                            <span className="inline-block max-w-full truncate bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-2 py-0.5 rounded">
                                                {item.category}
                                            </span>
                                        </div>

                                        {/* Meta info */}
                                        <p className="text-gray-400 text-sm font-medium mt-1.5 truncate">
                                            {item.fileType || "PDF"} • {item.fileSize}
                                        </p>
                                    </div>

                                    {/* Download Button */}
                                    <Link
                                        href={item.fileUrl}
                                        download
                                        className="mt-2 inline-flex items-center justify-center gap-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors duration-200 text-sm font-semibold py-1.5 px-2 rounded-md w-full"
                                    >
                                        <Download className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">Download</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredBrochures.length === 0 && (
                        <div className="text-center py-12 text-gray-500 font-medium">
                            No brochures found matching your search.
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}

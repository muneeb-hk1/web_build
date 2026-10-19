"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, HandHeart } from "lucide-react";
import { site, type NGOGalleryData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";

type GalleryVideo = NGOGalleryData["videoItems"][number];

export default function NgoGallery1({ data: customData }: SectionProps) {
    const candidate = customData as unknown as Partial<NGOGalleryData> & {
      galleryItems?: Array<{ id?: string; image?: string; alt?: string; title?: string }>;
    } | undefined;
    const isPlaceholderImage = (src?: string) => {
      const value = (src || "").trim();
      if (!value) return true;
      if (/\/categories\/ngo\//i.test(value)) return false;
      return (
        /(?:^|\/)(?:bg[12]\.jpg|blackbay\.png|shaye\.png|stylam\.png|prod2\.jpg)$/i.test(
          value,
        ) || /\/categories\/realestate\//i.test(value)
      );
    };
    const mappedLegacyItems = Array.isArray(candidate?.galleryItems)
      ? candidate.galleryItems.map((item, index) => ({
          id: item.id || `gallery-${index + 1}`,
          image: item.image || "",
          alt: item.alt || item.title || "",
          title: item.title || item.alt || "",
          active: (item as { active?: boolean }).active !== false,
        }))
      : [];
    const ownItems = Array.isArray(candidate?.items) ? candidate.items : [];
    const rawItems = (
      ownItems.length && !ownItems.every((item) => isPlaceholderImage(item.image))
        ? ownItems
        : mappedLegacyItems.length &&
            !mappedLegacyItems.every((item) => isPlaceholderImage(item.image))
          ? mappedLegacyItems
          : site.gallery.items
    ) as Array<NGOGalleryData["items"][number] & { active?: boolean }>;
    const items = rawItems.filter((item) => item.active !== false) as NGOGalleryData["items"];
    const ownVideos = Array.isArray(candidate?.videoItems)
      ? candidate.videoItems
      : [];
    const videoItems = (
      ownVideos.length &&
      !ownVideos.every((item) => isPlaceholderImage(item.image))
        ? ownVideos
        : site.gallery.videoItems
    ) as NGOGalleryData["videoItems"];
    const data = {
      ...site.gallery,
      ...candidate,
      items,
      videoItems,
    } as NGOGalleryData;
    const { title, pretitle } = data;

    // Lightbox state for images
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null,
    );

    // Lightbox state for videos
    const [activeVideo, setActiveVideo] = useState<GalleryVideo | null>(null);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? items.length - 1 : (prev as number) - 1,
            );
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) =>
                prev === items.length - 1 ? 0 : (prev as number) + 1,
            );
        }
    };

    // Helper function to extract YouTube embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return "";

        // Handles standard embed links
        if (url.includes("youtube.com/embed/")) {
            return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
        }

        // Handles standard watch links (https://www.youtube.com/watch?v=VIDEO_ID)
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&enablejsapi=1`
            : url;
    };

    return (
        <>
            <section data-editor-section-label="Gallery" data-editor-fields="banner pretitle title items videoItems galleryItems" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans">
                {/* Section Header */}
                <div className="text-center  mx-auto mb-10">
                    <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
                        <HandHeart className="w-8 h-8 text-emerald-600" />
                        <span className="italic font-serif">{pretitle}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                        {title}
                    </h2>
                    <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                </div>
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* IMAGE GALLERY SECTION */}
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        sizes="(min-width: 768px) 33.33vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VIDEO GALLERY SECTION HEADER */}
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                                {title}
                            </h2>
                            <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                        </div>

                        {/* VIDEO GALLERY GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {videoItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveVideo(item)}
                                    className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                        {/* Play Button Icon Overlay */}
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-6 h-6 fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* IMAGE LIGHTBOX DIALOGUE */}
            {selectedImageIndex !== null && items[selectedImageIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 cursor-pointer text-white/80 hover:text-white p-2 rounded-full bg-black/40 transition-colors z-20"
                        aria-label="Close modal"
                    >
                        <X className="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>

                    {/* Left Arrow */}
                    <button
                        onClick={handlePrevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-[#ff5500] transition-colors z-20"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Main Image */}
                    <div
                        className="relative w-full max-w-4xl h-[70vh] sm:h-[75vh] max-h-[85vh] rounded-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={items[selectedImageIndex].image}
                            alt={items[selectedImageIndex].alt}
                            fill
                            sizes="(min-width: 896px) 896px, 100vw"
                            className="object-contain"
                        />

                        <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm sm:text-sm font-medium bg-black/60 px-3 py-2">
                            {items[selectedImageIndex].alt}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-[#ff5500] transition-colors z-20"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            )}

            {/* VIDEO LIGHTBOX DIALOGUE */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setActiveVideo(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setActiveVideo(null)}
                        className="absolute top-6 cursor-pointer right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-[#ff5500] transition-colors z-20"
                        aria-label="Close video"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Video Player Box */}
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={getEmbedUrl(activeVideo.videoUrl || "")}
                            title={activeVideo.alt}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}

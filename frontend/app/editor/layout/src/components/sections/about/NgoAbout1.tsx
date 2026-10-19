"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiPhoneCall,
  FiArrowRight,
  FiPlay,
  FiX,
} from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { site, type NGOAboutPageData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

type AboutSectionProps = SectionProps & {
  showButton?: boolean;
};

// Helper: detect if the URL is a YouTube/Vimeo link (needs an iframe embed)
// or a direct video file (needs an <video> tag).
function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null; // not a known embed provider, treat as direct file
}

export default function NgoAbout1({
  data: customData,
  showButton = true,
}: AboutSectionProps) {
  const custom = (customData ?? {}) as Partial<NGOAboutPageData>;
  const fallback = site.aboutPage ?? site.about ?? {};
  const fallbackFeatures = Array.isArray(fallback.features)
    ? fallback.features
    : [];
  const fallbackChecklist = Array.isArray(fallback.checklist)
    ? fallback.checklist
    : [];
  const data: NGOAboutPageData = {
    ...fallback,
    ...custom,
    sideImages: {
      ...(fallback.sideImages ?? {}),
      ...custom.sideImages,
    },
    features: (Array.isArray(custom.features) && custom.features.length
      ? custom.features
      : fallbackFeatures
    ).map((feature: Record<string, unknown>, idx: number) => ({
      icon: idx === 0 ? "heart" : "book",
      ...(fallbackFeatures[idx] ?? {}),
      ...feature,
    })),
    checklist:
      Array.isArray(custom.checklist) && custom.checklist.length
        ? custom.checklist
        : fallbackChecklist,
    button: {
      ...(fallback.button ?? {}),
      ...custom.button,
    },
  };
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = useCallback(() => setIsVideoOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVideoOpen, closeVideo]);

  const embedUrl = data.videoUrl ? getEmbedUrl(data.videoUrl) : null;
  const sideImages = {
    topLeft:
      data.sideImages?.topLeft ||
      fallback.sideImages?.topLeft ||
      "",
    topLeftAlt:
      data.sideImages?.topLeftAlt ||
      fallback.sideImages?.topLeftAlt ||
      "Volunteers",
    mainLeft:
      data.sideImages?.mainLeft ||
      fallback.sideImages?.mainLeft ||
      "",
    mainLeftAlt:
      data.sideImages?.mainLeftAlt ||
      fallback.sideImages?.mainLeftAlt ||
      "Children",
    bottomRight:
      data.sideImages?.bottomRight ||
      fallback.sideImages?.bottomRight ||
      "",
    bottomRightAlt:
      data.sideImages?.bottomRightAlt ||
      fallback.sideImages?.bottomRightAlt ||
      "Impact story",
  };

  return (
      <section
        data-editor-fields="pretitle icon title desc donationBadge donationBadgeIcon sideImages videoUrl features checklist button phone"
        className="relative w-full bg-white pt-8 md:pt-12 font-sans text-[#111827] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* =========================================================
                LEFT SIDE - IMAGE COLLAGE (Matched to Content Height)
            ========================================================== */}
            <div className="lg:col-span-6 relative w-full min-h-[450px] lg:min-h-full flex justify-center lg:justify-start">
              <div className="relative w-full h-full max-w-[620px]">
                {/* TOP LEFT IMAGE */}
                <div className="absolute top-0 left-[2.5%] w-[46.5%] h-[31.5%] rounded-[18px] overflow-hidden border-[4px] border-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] z-30">
                  {sideImages.topLeft ? (
                    <Image
                      src={sideImages.topLeft}
                      alt={sideImages.topLeftAlt}
                      fill
                      sizes="(max-width: 1024px) 46vw, 240px"
                      className="object-cover"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={sideImages.topLeft}
                    />
                  ) : null}
                </div>
                {/* LEFT VERTICAL DONATION BADGE */}
                <div className="absolute left-[2.5%] top-[31.5%] bottom-0 w-[16.5%] bg-[#0B2545] rounded-[18px] z-20 overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.12)]">
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <EditableNgoIcon
                      name={data.donationBadgeIcon || data.icon || "hand-heart"}
                      className="w-6 h-6 text-white"
                    />
                  </div>

                  <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rotate-[-90deg] text-white font-semibold text-[13px] sm:text-[18px] tracking-wide">
                    {data.donationBadge}
                  </div>
                </div>
                {/* MAIN CENTER IMAGE */}
                <div className="absolute top-[8.5%] left-[20%] w-[79%] h-[76%] rounded-[18px] overflow-hidden border-[4px] border-white shadow-[0_5px_18px_rgba(0,0,0,0.14)] z-20 bg-[#243B5A]">
                  {sideImages.mainLeft ? (
                    <Image
                      src={sideImages.mainLeft}
                      alt={sideImages.mainLeftAlt}
                      fill
                      sizes="(max-width: 1024px) 80vw, 410px"
                      className="object-cover grayscale"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={sideImages.mainLeft}
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-[#16385F]/25 pointer-events-none" />

                  <button
                    type="button"
                    aria-label="Play video"
                    onClick={openVideo}
                    className="absolute cursor-pointer left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-full bg-[#FF8A00] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.25)] z-20 transition-transform duration-300 hover:scale-110"
                  >
                    <span className="absolute inset-[7px] rounded-full border-[1.5px] border-dashed border-[#0B2545]" />
                    <FiPlay className="relative z-10 text-[#0B2545] text-[23px] fill-[#0B2545] ml-1" />
                  </button>
                </div>
                {/* BOTTOM RIGHT IMAGE */}
                <div className="absolute right-[0%] bottom-[0%] w-[46.5%] h-[30.5%] rounded-[18px] overflow-hidden border-[4px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.14)] z-30">
                  {sideImages.bottomRight ? (
                    <Image
                      src={sideImages.bottomRight}
                      alt={sideImages.bottomRightAlt}
                      fill
                      sizes="(max-width: 1024px) 46vw, 240px"
                      className="object-cover"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={sideImages.bottomRight}
                    />
                  ) : null}
                </div>
                {/* ORANGE DECORATIVE LINE */}
                <div className="absolute left-[34%] bottom-[1.5%] sm:bottom-[2%] w-[27%] sm:w-[18%] h-[20%] sm:h-[22%] pointer-events-none z-10">
                  {/* L-shaped curved border line */}
                  <div className="w-full h-full border-l-[2px] border-b-[2px] border-[#FF8A00] rounded-bl-[16px] sm:rounded-bl-[20px]" />

                  {/* Filled circle dot terminal point at the right end */}
                  <div className="absolute -right-1 -bottom-[4px] sm:-bottom-[5px] w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF8A00] shadow-xs" />
                </div>
              </div>
            </div>

            {/* =========================================================
                RIGHT SIDE - CONTENT
            ========================================================== */}
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div className="text-center lg:text-left">
                {/* Subtitle */}
                {data.pretitle && (
                  <div className="flex justify-center lg:justify-start items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
                    <EditableNgoIcon
                      name={data.icon || "hand-heart"}
                      className="w-8 h-8 text-emerald-600"
                    />
                    <span className="italic font-serif">{data.pretitle}</span>
                  </div>
                )}

                {/* Heading */}
                {data.title && (
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B2545] leading-[1.2] tracking-tight mb-4">
                    {data.title.includes("World") ? (
                      <>
                        {data.title.split("World")[0]}
                        <span className="text-[#E0A053]">World</span>
                        {data.title.split("World")[1]}
                      </>
                    ) : (
                      data.title
                    )}
                  </h2>
                )}

                {/* Description */}
                {data.desc && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                    {data.desc}
                  </p>
                )}

                {/* Features Section - Always 2 columns */}
                {data.features && data.features.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 items-center">
                    {data.features.map((feature: Record<string, any>, idx: number) => (
                      <div
                        key={`about-feature-${idx}-${String(feature.id ?? feature.title ?? "item")}`}
                        className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
                          idx === 1 ? "border-l border-gray-300 pl-3 sm:pl-6" : ""
                        }`}
                      >
                        <div
                          className={`w-12 h-12 sm:w-[68px] sm:h-[68px] rounded-full flex items-center justify-center flex-shrink-0 ${
                            idx === 0 ? "bg-[#FFE0C2]" : "bg-[#DDE7F0]"
                          }`}
                        >
                          <EditableNgoIcon
                            name={feature.icon || (idx === 0 ? "heart" : "book")}
                            className="w-5 h-5 sm:w-8 sm:h-8 text-[#0B2545]"
                          />
                        </div>

                        <div>
                          <h3 className="font-bold text-[#0B2545] text-sm sm:text-base mb-0.5 sm:mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm sm:text-sm text-gray-600 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklist */}
                {data.checklist && data.checklist.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {data.checklist.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 text-sm">
                          <FiCheck className="stroke-[3]" />
                        </div>
                        <span className="text-sm sm:text-sm text-[#0B2545] font-semibold">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Action Buttons - Centered & Compact on Mobile */}
              <div className="flex flex-nowrap items-center justify-start gap-2 sm:gap-4 pt-4 w-full px-1 sm:px-0">
                {showButton && data.button && (
                  <Link
                    href={data.button.href || "/about-us"}
                    className="inline-flex items-center justify-between gap-2 sm:gap-4 bg-[#FF8A00] hover:bg-[#e07900] text-white font-semibold pl-3 sm:pl-6 pr-1.5 sm:pr-2 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm sm:text-base shrink-0"
                  >
                    <span>{data.button.label}</span>
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                      <FiArrowRight className="text-sm sm:text-base text-[#FF8A00]" />
                    </span>
                  </Link>
                )}

                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="inline-flex items-center gap-2 sm:gap-3 bg-[#DDE7F5] hover:bg-[#cfdcf0] text-[#0B2545] px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 shrink-0"
                  >
                    <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#0B2545] flex items-center justify-center text-white shrink-0">
                      <FiPhoneCall className="text-sm sm:text-base" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-[9px] sm:text-[11px] text-gray-600 font-medium leading-tight">
                        Phone
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#0B2545] sm:tracking-wide">
                        {data.phone}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            VIDEO MODAL - centered on screen for all devices
        ========================================================== */}
        {isVideoOpen && data.videoUrl && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            {/* Backdrop - click to close */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeVideo}
            />

            {/* Modal content */}
            <div className="relative z-10 w-full max-w-4xl">
              {/* Close button */}
              <button
                type="button"
                aria-label="Close video"
                onClick={closeVideo}
                className="absolute -top-11 right-0 sm:-right-2 sm:-top-11 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>

              {/* Video container - 16:9 aspect ratio, centered */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Video player"
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={data.videoUrl}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </section>
  );
}

(
  NgoAbout1 as typeof NgoAbout1 & { editorFields: readonly string[] }
).editorFields = [
  "pretitle",
  "icon",
  "title",
  "desc",
  "donationBadge",
  "donationBadgeIcon",
  "sideImages",
  "videoUrl",
  "features",
  "checklist",
  "button",
  "phone",
];

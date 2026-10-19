"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";
import { site, type NGOCtaBannerData } from "../data/categorySite";
import { X } from "lucide-react";
import { useOptionalPreview } from "../../context/PreviewContext";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import type { MouseEvent as ReactMouseEvent } from "react";

// Custom SVG path for the realistic rough torn-paper edge
const RoughTornEdge = ({ position }: { position: "left" | "right" }) => {
  const isRight = position === "right";

  return (
    <div
      className={`hidden lg:block absolute ${
        isRight ? "-right-3" : "-left-3"
      } top-0 bottom-0 w-8 sm:w-10 z-20 pointer-events-none fill-[#FDB813]`}
    >
      <svg
        className={`h-full w-full ${isRight ? "" : "scale-x-[-1]"}`}
        viewBox="0 0 50 500"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,0 C 15,12 5,28 18,45 C 32,60 12,78 25,95 C 38,110 8,128 20,145 C 35,160 15,182 28,200 C 40,218 10,235 22,255 C 36,272 14,290 26,310 C 42,328 12,345 24,365 C 38,380 18,392 30,410 C 40,428 15,445 25,465 C 35,480 10,490 0,500 L 50,500 L 50,0 Z"
        />
      </svg>
    </div>
  );
};

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }

      // https://www.youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/embed/")) {
        const videoId = parsedUrl.pathname.split("/embed/")[1];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      // https://www.youtube.com/shorts/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/shorts/")[1];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }
    }

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default function CtaBannerSection({ data:customData }: SectionProps) {
  const preview = useOptionalPreview();
  const data = {
    ...site.ctaBanner,
    ...((customData ?? {}) as Partial<NGOCtaBannerData>),
  };
  const { leftCard, centerVideo, rightCard } = data;
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openCtaPage = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
    fallback: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    const slug = (href || "")
      .trim()
      .toLowerCase()
      .replace(/^\/+/, "")
      .replace(/[?#].*$/, "");
    const label =
      slug.includes("contact") || fallback.toLowerCase().includes("contact")
        ? "Contact"
        : slug.includes("donate") || fallback.toLowerCase().includes("donate")
          ? "Donate"
          : fallback;
    preview.setCurrentPage(label);
  };

  return(
    <>
     <section
      data-editor-section-label="Call to Action"
      data-editor-fields="leftCard centerVideo rightCard"
      className="w-full relative  overflow-hidden bg-[#081E38]"
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[380px] sm:min-h-[440px]">
          {/* =========================================================
              LEFT CARD: BECOME A VOLUNTEER (Deep Navy Blue)
          ========================================================== */}
          <div className="relative flex flex-col items-center justify-center text-center p-8 lg:p-12 text-white overflow-hidden group">
            {/* Decorative bg — no media hover so section Edit plate can open */}
            {leftCard?.bgImageUrl && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <Image
                  src={leftCard.bgImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}

            {/* Color Overlay - #081E38 at 92% opacity to match dark blue in image */}
            <div className="pointer-events-none absolute inset-0 bg-[#081E38]/92" />

            {/* Right Rough Torn Edge Divider */}
            <RoughTornEdge position="right" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center text-white">
                <EditableNgoIcon
                  name={leftCard?.icon || leftCard?.iconName || "hand-heart"}
                  className="w-10 h-10"
                />
              </div>

              <p className="text-sm sm:text-sm font-medium tracking-wide text-gray-200 mb-2">
                {leftCard?.subtitle || "We Give Child A Gift Of A Education"}
              </p>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-8 tracking-tight">
                {leftCard?.title || "Become A Volunteer?"}
              </h3>

              <Link
                href={leftCard?.buttonHref || "/contact-us"}
                data-editor-keep-click
                data-editor-nav
                onClick={(event) =>
                  openCtaPage(
                    event,
                    leftCard?.buttonHref || "/contact-us",
                    leftCard?.buttonText || "Contact",
                  )
                }
                className={`px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:brightness-110 bg-[#00785B] ${
                  leftCard?.buttonTextColor || "text-white"
                }`}
              >
                {leftCard?.buttonText || "Contact Now"}
              </Link>
            </div>
          </div>

          {/* =========================================================
              CENTER SECTION: VIDEO PLAY (Grayscale Child Photo)
          ========================================================== */}
          <div className="relative flex items-center justify-center p-8 lg:p-12 min-h-[300px] lg:min-h-auto group overflow-hidden">
            {centerVideo?.bgImageUrl && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <Image
                  src={centerVideo.bgImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}

            {/* Center Dark Tint Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/25" />

            {/* Left & Right Rough Torn Edges */}
            <RoughTornEdge position="left" />
            <RoughTornEdge position="right" />

            {/* Play Button */}
            <button
              onClick={() => setIsVideoOpen(true)}
              aria-label="Play Video"
              className="relative z-30 cursor-pointer group/btn flex items-center justify-center"
            >
              {/* Outer Dark Translucent Circle */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/70 flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-105">
                {/* Inner Yellow Dashed Circle */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC708] border-2 border-dashed border-slate-900 flex items-center justify-center text-slate-900 shadow-2xl">
                  <FaPlay className="w-5 h-5 ml-1 text-slate-900" />
                </div>
              </div>
            </button>
          </div>

          {/* =========================================================
              RIGHT CARD: MAKE DONATION (Warm Orange)
          ========================================================== */}
          <div className="relative flex flex-col items-center justify-center text-center p-8 lg:p-12 text-white overflow-hidden group">
            {rightCard?.bgImageUrl && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <Image
                  src={rightCard.bgImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}

            {/* Color Overlay - #DD5C00 at 90% opacity */}
            <div className="pointer-events-none absolute inset-0 bg-[#DD5C00]/90" />

            {/* Left Rough Torn Edge Divider */}
            <RoughTornEdge position="left" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center text-white">
                <EditableNgoIcon
                  name={rightCard?.icon || rightCard?.iconName || "hand-heart"}
                  className="w-10 h-10"
                />
              </div>

              <p className="text-sm sm:text-sm font-medium tracking-wide text-amber-100 mb-2">
                {rightCard?.subtitle || "We Give Child A Gift Of A Education"}
              </p>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-8 tracking-tight">
                {rightCard?.title || "Make Donation To Us?"}
              </h3>

              <Link
                href={rightCard?.buttonHref || "/donate"}
                data-editor-keep-click
                data-editor-nav
                onClick={(event) =>
                  openCtaPage(
                    event,
                    rightCard?.buttonHref || "/donate",
                    rightCard?.buttonText || "Donate",
                  )
                }
                className={`px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:brightness-105 bg-[#FFC708] ${
                  rightCard?.buttonTextColor || "text-slate-900"
                }`}
              >
                {rightCard?.buttonText || "Donate Now"}
              </Link>
            </div>
          </div>
        </div>

        {/* Video Modal Placeholder */}
        {isVideoOpen && centerVideo?.videoUrl && (
          <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsVideoOpen(false)}
          >
            <div
              className="relative w-full max-w-3xl bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-[#f9570c] border border-white/20 text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Video */}
              <div className="w-full aspect-video">
                {(() => {
                  const youtubeUrl = getYouTubeEmbedUrl(centerVideo.videoUrl);

                  if (youtubeUrl) {
                    return (
                      <iframe
                        key={youtubeUrl}
                        className="w-full h-full"
                        src={youtubeUrl}
                        title="Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    );
                  }

                  // Local / direct video
                  return (
                    <video
                      key={centerVideo.videoUrl}
                      className="w-full h-full object-contain bg-black"
                      src={centerVideo.videoUrl}
                      controls
                      autoPlay
                      playsInline
                    >
                      Your browser does not support the video player.
                    </video>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

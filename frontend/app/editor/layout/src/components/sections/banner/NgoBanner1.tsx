"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  X,
} from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import type { SectionProps } from "../../../types/section";
import { site, type NGOBannerData } from "../data/categorySite";
import { useEditorContentPaused } from "../../context/PreviewContext";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

type BannerSlide = {
  pretitle?: string;
  title?: string;
  desc?: string;
  bgImageUrl?: string;
  videoUrl?: string;
  buttons?: {
    label?: string;
    href?: string;
    variant?: string;
    icon?: string;
    iconPosition?: "before" | "after";
    openInNewTab?: boolean;
  }[];
};

type FeatureCard = {
  icon?: string;
  title?: string;
  desc?: string;
};

const isBannerSlide = (value: unknown): value is Record<string, unknown> =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      ("title" in value ||
        "pretitle" in value ||
        "bgImageUrl" in value ||
        "image" in value ||
        "backgroundImage" in value),
  );

const normalizeBannerSlide = (raw: Record<string, unknown>): BannerSlide => ({
  pretitle: typeof raw.pretitle === "string" ? raw.pretitle : undefined,
  title: typeof raw.title === "string" ? raw.title : undefined,
  desc: typeof raw.desc === "string" ? raw.desc : undefined,
  bgImageUrl:
    (typeof raw.bgImageUrl === "string" && raw.bgImageUrl) ||
    (typeof raw.image === "string" && raw.image) ||
    (typeof raw.backgroundImage === "string" && raw.backgroundImage) ||
    undefined,
  videoUrl: typeof raw.videoUrl === "string" ? raw.videoUrl : undefined,
  buttons: Array.isArray(raw.buttons)
    ? (raw.buttons as BannerSlide["buttons"])
    : undefined,
});

const collectBannerSlides = (source: unknown): BannerSlide[] => {
  if (Array.isArray(source)) {
    return source.filter(isBannerSlide).map(normalizeBannerSlide);
  }
  if (!source || typeof source !== "object") return [];

  const record = source as Record<string, unknown>;
  if (Array.isArray(record.items)) {
    const fromItems = record.items.filter(isBannerSlide).map(normalizeBannerSlide);
    if (fromItems.length) return fromItems;
  }
  if (Array.isArray(record.bannerSlides)) {
    return record.bannerSlides.filter(isBannerSlide).map(normalizeBannerSlide);
  }
  return [];
};

const mergeBannerSlides = (
  current: BannerSlide[],
  fallback: BannerSlide[],
) => {
  if (!fallback.length) return current;
  if (!current.length) return fallback;
  if (current.length >= fallback.length) return current;

  const seen = new Set(
    current.map((slide) => `${slide.title ?? ""}|${slide.bgImageUrl ?? ""}`),
  );
  return [
    ...current,
    ...fallback.filter(
      (slide) => !seen.has(`${slide.title ?? ""}|${slide.bgImageUrl ?? ""}`),
    ),
  ];
};

export default function NgoBanner1({ data }: SectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const isEditorContentPaused = useEditorContentPaused();

  const bannerData = (data ?? {}) as unknown as Partial<NGOBannerData>;
  const banners = mergeBannerSlides(
    collectBannerSlides(bannerData),
    collectBannerSlides(site.banner),
  );
  const featureCardsRaw = bannerData.featureCards ?? site.featureCards;
  const featureCards = (Array.isArray(featureCardsRaw)
    ? featureCardsRaw
    : Array.isArray(featureCardsRaw?.items)
      ? featureCardsRaw.items
      : []) as FeatureCard[];

  /*
   * ============================================================
   * AUTO PLAY SLIDER
   * Pause slider while video modal is open
   * ============================================================
   */
  useEffect(() => {
    if (banners.length <= 1 || isVideoOpen || isEditorContentPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isVideoOpen, isEditorContentPaused]);

  useEffect(() => {
    if (banners.length && currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  /*
   * ============================================================
   * SLIDER CONTROLS
   * ============================================================
   */
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  /*
   * ============================================================
   * OPEN VIDEO
   * ============================================================
   */
  const handleOpenVideo = (videoUrl?: string) => {
    if (!videoUrl) return;

    setActiveVideo(videoUrl);
    setIsVideoOpen(true);
  };

  /*
   * ============================================================
   * CLOSE VIDEO
   * ============================================================
   */
  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    setActiveVideo(null);
  };

  /*
   * ============================================================
   * YOUTUBE URL DETECTION
   * ============================================================
   */
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.searchParams.get("v")
      ) {
        const videoId = parsedUrl.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }

      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.slice(1);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        const videoId = parsedUrl.pathname.split("/embed/")[1];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/shorts/")[1];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  /*
   * ============================================================
   * RENDER VIDEO
   * ============================================================
   */
  const renderVideo = () => {
    if (!activeVideo) return null;

    const youtubeEmbedUrl = getYouTubeEmbedUrl(activeVideo);

    if (youtubeEmbedUrl) {
      return (
        <iframe
          src={youtubeEmbedUrl}
          title="Video Player"
          className="w-full aspect-video rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }

    return (
      <video
        key={activeVideo}
        src={activeVideo}
        className="w-full aspect-video rounded-xl object-contain bg-black"
        controls
        autoPlay
        playsInline
      >
        Your browser does not support the video player.
      </video>
    );
  };

  /*
   * ============================================================
   * FEATURE CARD ICON
   * ============================================================
   */
  const renderCardIcon = (iconName: string, index: number) => {
    const isEven = index % 2 === 0;

    const glowingClasses = isEven
      ? "bg-green-500 border border-white/30 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
      : "bg-orange-500 border border-white/30 shadow-[0_0_15px_rgba(249,115,22,0.4)]";

    return (
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${glowingClasses}`}
      >
        <EditableNgoIcon
          name={iconName || "graduation-cap"}
          className="h-5 w-5 fill-white text-white sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-9 lg:w-9"
        />
      </div>
    );
  };

  if (!banners.length) return null;

  const bannerHeight =
    typeof data?.bannerHeight === "number" && Number.isFinite(data.bannerHeight)
      ? Math.max(40, Math.min(100, data.bannerHeight))
      : 90;
  // Extra room so the hero image continues behind the feature strip.
  const featureStripOffset = featureCards.length > 0 ? "7.5rem" : "0rem";
  const safeIndex = banners.length ? currentSlide % banners.length : 0;

  return (
    <section
      data-editor-fields="bannerSlides items bannerHeight featureCards"
      className="relative -mt-32 w-full overflow-hidden bg-slate-950 text-white"
    >
        <div
          className="relative flex w-full flex-col"
          style={{
            height: `max(calc(32rem + ${featureStripOffset}), calc(${bannerHeight}dvh + ${featureStripOffset}))`,
          }}
        >
          {/* Image fills the whole banner — including behind the feature strip */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${safeIndex * 100}%)`,
              }}
            >
              {banners.map((item, index) => (
                <div
                  key={`${item.title ?? "slide"}-${index}`}
                  className="relative h-full w-full shrink-0"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${item.bgImageUrl})` }}
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={item.bgImageUrl}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clears sticky header (-mt-20 tuck + h-20 nav) */}
          <div
            className="pointer-events-none relative z-10 h-32 shrink-0 sm:h-36 md:h-40"
            aria-hidden
          />

          {/* Copy sits in the band between header and feature strip */}
          <div className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col justify-center overflow-hidden px-5 pb-28 pt-3 sm:px-8 sm:pb-32 sm:pt-4 md:px-10 md:pb-36 lg:px-16 xl:px-20">
            {banners[safeIndex] ? (
              <div className="w-full max-w-2xl space-y-3 text-center sm:space-y-4 sm:text-left md:space-y-5">
                {banners[safeIndex].pretitle ? (
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#f9570c]/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-400 sm:px-3.5 sm:text-sm">
                    <Heart className="h-3.5 w-3.5 shrink-0 fill-current" />
                    <span className="truncate">{banners[safeIndex].pretitle}</span>
                  </div>
                ) : null}

                <h1 className="line-clamp-3 w-full text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
                  {banners[safeIndex].title}
                  <span className="ml-2 inline-block rotate-12 align-baseline text-[0.55em] text-orange-500 sm:ml-3">
                    <FaRegHeart />
                  </span>
                </h1>

                <div className="mx-auto h-0.5 w-28 bg-orange-600 sm:mx-0 sm:w-40 md:w-48" />

                <p className="max-w-lg text-[clamp(0.9rem,1.4vw+0.5rem,1.125rem)] font-normal leading-relaxed text-slate-200">
                  {banners[safeIndex].desc}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  {banners[safeIndex].buttons?.map((btn, bIdx) => {
                    const iconName =
                      btn.icon && btn.icon !== "none" ? btn.icon : null;
                    const iconBefore = (btn.iconPosition ?? "after") === "before";
                    const renderButtonIcon = (className: string) => {
                      if (!iconName) return null;
                      if (iconName === "play") {
                        return (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                            <EditableNgoIcon
                              name="play"
                              className="ml-0.5 h-2.5 w-2.5 fill-current text-white"
                              size={10}
                            />
                          </span>
                        );
                      }
                      return (
                        <EditableNgoIcon
                          name={iconName}
                          className={className}
                          size={16}
                        />
                      );
                    };

                    if (btn.variant === "primary") {
                      return (
                        <Link
                          key={bIdx}
                          href={btn.href || "#"}
                          target={btn.openInNewTab ? "_blank" : undefined}
                          rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#f9570c] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-[#e04a05] sm:px-6"
                        >
                          {iconBefore ? renderButtonIcon("h-4 w-4 fill-current") : null}
                          <span>{btn.label}</span>
                          {!iconBefore ? renderButtonIcon("h-4 w-4 fill-current") : null}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={bIdx}
                        type="button"
                        onClick={() =>
                          handleOpenVideo(banners[safeIndex].videoUrl)
                        }
                        disabled={!banners[safeIndex].videoUrl}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                      >
                        {iconBefore ? renderButtonIcon("h-4 w-4") : null}
                        <span>{btn.label}</span>
                        {!iconBefore
                          ? renderButtonIcon("h-4 w-4") || (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                                <Play className="ml-0.5 h-2.5 w-2.5 fill-current text-white" />
                              </span>
                            )
                          : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-[42%] z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#f9570c] sm:left-4 sm:h-10 sm:w-10 md:left-6 md:h-12 md:w-12"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-[42%] z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#f9570c] sm:right-4 sm:h-10 sm:w-10 md:right-6 md:h-12 md:w-12"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}

          {featureCards.length > 0 && (
            <div className="relative z-10 w-full shrink-0 px-3 pb-4 pt-2 sm:px-5 sm:pb-5 md:px-8 lg:px-12 xl:px-16">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-black/65 shadow-2xl backdrop-blur-md sm:grid-cols-2 sm:rounded-2xl lg:grid-cols-4">
                  {featureCards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="group relative flex min-w-0 items-center gap-2.5 p-3 transition-all duration-300 hover:bg-white/5 sm:items-start sm:gap-3 sm:p-3.5 md:p-4"
                    >
                      {renderCardIcon(card.icon ?? "", cIdx)}

                      <div className="min-w-0 text-left">
                        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-orange-400 sm:text-sm">
                          {card.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-gray-400 sm:text-sm">
                          {card.desc}
                        </p>
                      </div>

                      {cIdx !== featureCards.length - 1 && (
                        <span className="absolute bottom-0 right-4 left-4 h-px bg-white/10 lg:bottom-5 lg:left-auto lg:right-0 lg:top-5 lg:h-auto lg:w-px" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            VIDEO MODAL
        ============================================================ */}
        {isVideoOpen && activeVideo && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={handleCloseVideo}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            <div
              className="relative w-full max-w-3xl overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleCloseVideo}
                className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:bg-[#f9570c] hover:border-[#f9570c] cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="w-full aspect-video">{renderVideo()}</div>
            </div>
          </div>
        )}
    </section>
  );
}

(
  NgoBanner1 as typeof NgoBanner1 & { editorFields: readonly string[] }
).editorFields = ["bannerSlides", "items", "bannerHeight", "featureCards"];

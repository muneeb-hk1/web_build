"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  resolveBannerSlideButtons,
  type BannerSlideData,
  type ButtonData,
  type SectionProps,
} from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderEventsIcon } from "../../../lib/eventsIcons";

type Slide = BannerSlideData & { secondButton?: ButtonData };

const bannerButtonFace = (button: ButtonData) => {
  const icon =
    button.icon && button.icon !== "none"
      ? renderEventsIcon(button.icon, "h-4 w-4 shrink-0")
      : null;
  const before = button.iconPosition === "before";
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {before ? icon : null}
      <span>{button.label}</span>
      {!before ? icon : null}
    </span>
  );
};

const withBannerButtonIcon = (
  button: ButtonData | undefined,
  fallback?: ButtonData,
) => {
  if (!button) return undefined;
  if (button.icon && button.icon !== "none") return button;
  if (!fallback?.icon || fallback.icon === "none") return button;
  return {
    ...button,
    icon: fallback.icon,
    iconPosition: button.iconPosition ?? fallback.iconPosition,
  };
};

export default function EventsBanner1({ data = {} }: SectionProps) {
  const slides = useMemo<Slide[]>(() => {
    if (Array.isArray(data.bannerSlides)) {
      if (data.bannerSlides.length === 0) return [];

      return data.bannerSlides.map((slide) => {
        const slideButtons = resolveBannerSlideButtons(slide, data.buttons);
        return {
          ...slide,
          image: slide.image ?? data.backgroundImage ?? "",
          video: slide.video ?? data.backgroundVideo,
          alt: slide.alt ?? data.backgroundImageTitle ?? "Banner slide",
          title: slide.title ?? data.title ?? "",
          desc: slide.desc ?? data.desc,
          pretitle: slide.pretitle || data.pretitle,
          button: withBannerButtonIcon(
            slideButtons[0] ?? slide.button ?? data.buttons?.[0],
            data.buttons?.[0],
          ),
          secondButton: withBannerButtonIcon(
            slideButtons[1] ?? slide.secondButton ?? data.buttons?.[1],
            data.buttons?.[1],
          ),
        };
      });
    }

    return [
      {
        image: data.backgroundImage ?? "",
        video: data.backgroundVideo,
        alt: data.backgroundImageTitle ?? "Background",
        title: data.title ?? "",
        desc: data.desc,
        pretitle: data.pretitle,
        button: data.buttons?.[0],
        secondButton: data.buttons?.[1],
        buttons: data.buttons,
      },
    ];
  }, [data]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const goToSlide = (nextIndex: number) => {
    setActiveIndex((current) => {
      if (current === nextIndex) return current;
      setPrevIndex(current);
      return nextIndex;
    });
  };

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % slides.length;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const isVideo = data.bannerBackgroundMode === "video";

  return (
    <div className="relative flex w-full min-h-[80vh] items-center justify-center overflow-hidden font-sans">
      {slides.map((slide, index) => {
        const base =
          "absolute inset-0 transition-transform transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";
        const positionClass =
          index === activeIndex
            ? "translate-x-0 opacity-100 z-20"
            : index === prevIndex
              ? "-translate-x-full opacity-0 z-20"
              : "translate-x-full opacity-0 z-0";

        return (
          <div
            key={index}
            className={`${base} ${positionClass}`}
            aria-hidden={index !== activeIndex}
          >
            {isVideo && slide.video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={slide.image}
                data-editor-media
                data-editor-media-type="video"
                data-editor-media-src={slide.video}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={slide.video} />
              </video>
            ) : slide.image ? (
              <Image
                src={slide.image}
                alt={slide.alt ?? "Banner slide"}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={slide.image}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
                unoptimized={isUnoptimizedImageSrc(slide.image)}
              />
            ) : null}
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

      <div className="relative z-30 mx-auto flex w-full max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="max-w-3xl space-y-3 text-white">
          {activeSlide?.pretitle && (
            <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d7e]" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/90">
                {activeSlide.pretitle}
              </span>
            </div>
          )}

          {activeSlide?.title && (
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl sm:leading-[1.04] md:text-5xl md:leading-[1.02] lg:text-6xl">
              {activeSlide.title}
            </h1>
          )}

          {activeSlide?.desc && (
            <p className="max-w-2xl text-base font-normal text-white sm:text-lg md:text-xl lg:text-xl">
              {activeSlide.desc}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {(() => {
              const primaryBtn = activeSlide?.button ?? data.buttons?.[0];

              return primaryBtn ? (
                <Link href={primaryBtn.href ?? "#"}>
                  <button className="inline-flex cursor-pointer items-center justify-center rounded-[20px] bg-[#ff2d70] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#ff2d70]/30 transition hover:bg-[#d61b58] sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3 md:text-base">
                    {bannerButtonFace(primaryBtn)}
                  </button>
                </Link>
              ) : null;
            })()}

            {(() => {
              const secondaryBtn = activeSlide?.secondButton ?? data.buttons?.[1];

              return secondaryBtn ? (
                <Link href={secondaryBtn.href ?? "#"}>
                  <button className="inline-flex cursor-pointer items-center justify-center rounded-[20px] bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ff2d70] hover:text-white sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3 md:text-base">
                    {bannerButtonFace(secondaryBtn)}
                  </button>
                </Link>
              ) : null;
            })()}
          </div>

          {slides.length > 1 && (
            <div className="flex items-center gap-2 pt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 w-8 cursor-pointer rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

(
  EventsBanner1 as typeof EventsBanner1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "bannerSlides",
  "buttons",
  "pretitle",
  "title",
  "desc",
  "backgroundImage",
  "backgroundImageTitle",
  "backgroundVideo",
  "bannerBackgroundMode",
  "bannerHeight",
  "bannerBackgroundColor",
  "bannerGradientColor",
];

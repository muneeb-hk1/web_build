"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

type VisionCard = {
  id?: string;
  icon?: string;
  title?: string;
  description?: string;
  image?: { src?: string; alt?: string };
};

type VisionData = {
  banner?: {
    title?: string;
    breadcrumbHome?: string;
    breadcrumbCurrent?: string;
    bgImageUrl?: string;
    bgImageAlt?: string;
  };
  icon?: string;
  eyebrow?: string;
  introduction?: {
    title?: string;
    icon?: string;
    heading?: { line1?: string; highlight?: string };
    underline?: boolean;
    highlightColor?: string;
    headingColor?: string;
    mainStatement?: string;
    description?: string;
  };
  sideImage?: { src?: string; alt?: string } | string;
  visionCards?: VisionCard[];
  quote?: {
    icon?: string;
    text?: string;
    showWorldMap?: boolean;
  };
};

const FALLBACK_IMAGE =
  "/categories/ngo/template1/group-indian-children-running.jpg";

const ORANGE_ICONS = new Set(["flag", "skill", "community", "spread"]);

export default function NgoVision1({ data: customData }: SectionProps) {
  const custom = (customData ?? {}) as Partial<VisionData>;
  const fallback = ((site as { vision?: VisionData }).vision ??
    {}) as VisionData;
  const data: VisionData = {
    ...fallback,
    ...custom,
    banner: { ...(fallback.banner ?? {}), ...(custom.banner ?? {}) },
    introduction: {
      ...(fallback.introduction ?? {}),
      ...(custom.introduction ?? {}),
      heading: {
        ...(fallback.introduction?.heading ?? {}),
        ...(custom.introduction?.heading ?? {}),
      },
    },
    visionCards:
      Array.isArray(custom.visionCards) && custom.visionCards.length
        ? custom.visionCards
        : fallback.visionCards ?? [],
    quote: { ...(fallback.quote ?? {}), ...(custom.quote ?? {}) },
    sideImage: custom.sideImage ?? fallback.sideImage,
  };

  const intro = data.introduction ?? {};
  const headingColor = intro.headingColor || "#102A43";
  const highlightColor = intro.highlightColor || "#C99524";
  const eyebrowIcon =
    data.icon || intro.icon || "hand-heart";
  const eyebrow =
    data.eyebrow || intro.title || "Our Vision";

  const sideImageSrc =
    (typeof data.sideImage === "string"
      ? data.sideImage
      : data.sideImage?.src) ||
    data.visionCards?.[0]?.image?.src ||
    FALLBACK_IMAGE;
  const sideImageAlt =
    (typeof data.sideImage === "object" && data.sideImage?.alt) ||
    data.visionCards?.[0]?.image?.alt ||
    intro.heading?.highlight ||
    "Our Vision";

  return (
    <main>
      <section
        data-editor-section-label="Our Vision"
        data-editor-fields="icon eyebrow introduction sideImage visionCards quote"
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
              <EditableNgoIcon
                name={eyebrowIcon}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{eyebrow}</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 max-w-3xl"
              style={{ color: headingColor }}
            >
              {intro.heading?.line1 || "Our"}{" "}
              <span className="block sm:inline" style={{ color: highlightColor }}>
                {intro.heading?.highlight || "Vision"}
              </span>
            </h2>

            {intro.underline !== false ? (
              <div className="w-20 mb-4 h-1 mx-auto lg:mx-0 bg-[#16a34a] rounded-full" />
            ) : null}

            {intro.mainStatement ? (
              <p className="text-[#1F2B20] text-base sm:text-lg font-semibold leading-snug mb-3 text-center lg:text-left">
                {intro.mainStatement}
              </p>
            ) : null}

            {intro.description ? (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 text-center lg:text-left">
                {intro.description}
              </p>
            ) : null}

            {data.visionCards && data.visionCards.length > 0 ? (
              <div className="relative pl-3 space-y-6 w-full max-w-xl">
                {data.visionCards.map((item, index) => {
                  const isLast = index === data.visionCards!.length - 1;
                  const iconName = item.icon || "target";
                  const isOrange = ORANGE_ICONS.has(iconName);
                  return (
                    <div
                      key={item.id || index}
                      className="relative flex items-start gap-4 text-left"
                    >
                      {!isLast ? (
                        <div className="absolute left-5 top-10 w-[2px] h-[calc(100%+12px)] border-l-2 border-dashed border-gray-200" />
                      ) : null}

                      <div
                        className={`relative z-10 w-10 h-10 md:w-16 md:h-16 rounded-full border flex items-center justify-center shrink-0 ${
                          isOrange
                            ? "bg-orange-50 border-orange-100"
                            : "bg-emerald-50 border-emerald-100"
                        }`}
                      >
                        <EditableNgoIcon
                          name={iconName}
                          className={`w-5 h-5 md:w-8 md:h-8 ${
                            isOrange ? "text-[#ff5500]" : "text-[#005c36]"
                          }`}
                        />
                      </div>

                      <div className="pt-1">
                        <h3 className="text-base font-bold text-[#08121e] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {data.quote?.text ? (
              <div className="relative mt-8 flex w-full max-w-xl items-start gap-4 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-6 text-left">
                <EditableNgoIcon
                  name={data.quote.icon || "quote"}
                  className="mt-0.5 h-6 w-6 shrink-0 text-[#C99524]"
                />
                <p className="text-sm font-medium italic leading-relaxed text-slate-800">
                  “{data.quote.text}”
                </p>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={sideImageSrc}
                alt={sideImageAlt}
                width={700}
                sizes="(min-width: 1024px) 50vw, 512px"
                height={850}
                className="w-full h-[480px] sm:h-[620px] object-cover rounded-[2.5rem]"
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={sideImageSrc}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

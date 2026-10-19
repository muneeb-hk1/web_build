"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultFeatures = [
  "Deep Cleaning Service",
  "Fully Equipment",
  "Disinfecting Service",
  "Professional Sanitizing",
];

export default function CleaningAbout1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "Our Features");
  const title = String(
    data.title || "We Offer A Wide Range Of Disinfection & Cleaning Services",
  );
  const desc = String(
    data.desc ||
      data.description ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis suspendisse ultrice.",
  );
  const desc2 = String(
    data.desc2 ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis suspendisse ultrices gravida. commodo viverra maecenas accumsan lacus vel facilisis.",
  );
  const image = String(data.image || `${ASSET}/banner/aboutimg.png`);
  const imageTitle = String(data.imageTitle || "About Cleaning Service");
  const experienceYears = String(data.experienceYears ?? "30");
  const experienceText = String(data.experienceText || "Years");
  const buttonText = String(data.buttonText || "Read More");
  const buttonHref = String(data.buttonHref || data.buttonLink || "/about");

  const rawFeatures = Array.isArray(data.features) ? data.features : defaultFeatures;
  const features = rawFeatures.map((item: any) =>
    typeof item === "string" ? item : String(item?.title || item?.label || ""),
  ).filter(Boolean);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  return (
    <section
      className="relative overflow-hidden bg-white py-10 md:py-12 lg:py-16"
      style={getAccentStyle(accent)}
      data-editor-fields="pretitle title desc desc2 features experienceYears experienceText image imageTitle buttonText buttonHref"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 xl:gap-20">
          <div className="relative mx-auto w-full max-w-[560px] pt-4 pl-4 lg:pt-8 lg:pl-8">
            <div className="absolute top-0 left-0 z-0 hidden h-[85%] w-[85%] border-t-[8px] border-l-[8px] border-[#0A7A51] lg:block" />

            <div className="absolute right-8 bottom-0 z-0 hidden lg:block">
              <div className="grid grid-cols-6 gap-[8px]">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-[5px] w-[5px] rounded-full bg-[#D7D7D7]"
                  />
                ))}
              </div>
            </div>

            <div
              className="relative z-10 h-[550px] w-full overflow-hidden"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)" }}
            >
              <img
                src={image}
                alt={imageTitle}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute top-[48%] -right-4 z-30 -translate-y-1/2 md:-right-8">
              <div
                className="flex h-[135px] w-[105px] flex-col items-center justify-center bg-[#0A7A51] text-white shadow-lg"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
              >
                <h2 className="text-[44px] leading-none font-bold tracking-tight">
                  {experienceYears}
                </h2>
                <p className="mt-1 text-[15px] font-semibold tracking-wide">
                  {experienceText}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[620px] lg:pl-6">
            <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
              {pretitle}
            </span>

            <h2 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
              {title}
            </h2>

            {desc ? (
              <p className="mt-4 text-[15px] leading-[26px] text-[#6B7280]">
                {desc}
              </p>
            ) : null}

            {desc2 ? (
              <p className="mt-3 text-[15px] leading-[26px] text-[#6B7280]">
                {desc2}
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="group flex cursor-pointer items-center gap-3 rounded-full bg-[#EAF2EE] px-5 py-3.5 shadow-sm transition-all duration-300 hover:bg-[#0A7A51] hover:shadow-md"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A7A51] transition-colors duration-300 group-hover:bg-white">
                    <Check
                      size={16}
                      className="stroke-[3] text-white transition-colors duration-300 group-hover:text-[#0A7A51]"
                    />
                  </div>
                  <span className="text-[14px] font-semibold text-[#0A7A51] transition-colors duration-300 group-hover:text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={buttonHref}
              onClick={(event) => handleNavigate(event, buttonHref, buttonText)}
              className="mt-7 inline-block rounded-[8px] bg-[#0A7A51] px-9 py-3.5 text-[15px] font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#0B2942] hover:shadow-md active:scale-95"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

(
  CleaningAbout1 as typeof CleaningAbout1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "pretitle",
  "title",
  "desc",
  "desc2",
  "features",
  "experienceYears",
  "experienceText",
  "image",
  "imageTitle",
  "buttonText",
  "buttonHref",
];

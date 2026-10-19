"use client";

import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";
import { WebsiteIcon } from "../../../lib/websiteIcons";
import { handleManagerCardClick } from "../../../lib/editorManagerCards";
import CleaningSlider from "../shared/CleaningSlider";
import CalculateCTA from "../layout-src/calculatecta/page";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultServices = [
  {
    title: "Floor Cleaning",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod sis.",
    image: `${ASSET}/services/service-1.png`,
    icon: "PaintRoller",
  },
  {
    title: "Window Cleaning",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod sis.",
    image: `${ASSET}/services/service-2.png`,
    icon: "AppWindow",
  },
  {
    title: "Domestic Sanitizing",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod sis.",
    image: `${ASSET}/services/service-3.png`,
    icon: "House",
  },
  {
    title: "Corona Control",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod sis.",
    image: `${ASSET}/services/service-4.png`,
    icon: "Biohazard",
  },
];

export default function CleaningService1({
  data = {},
  editorMode,
}: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "Our Services");
  const title = String(data.title || "Commercial Disinfection Services");
  const services = (
    Array.isArray(data.services) ? data.services : defaultServices
  ) as Array<Record<string, any>>;
  const detailBase = String(data.detailBasePath || "/services/detail");
  const layout = String(data.layout || "slider");

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

  const serviceCards = services.map((service, index) => {
    const serviceTitle = String(service.title || "Service");
    const serviceDesc = String(service.desc || service.description || "");
    const image = String(service.image || `${ASSET}/services/service-1.png`);
    const iconKey = String(service.icon || service.iconName || "PaintRoller");
    const href = String(service.href || detailBase);
    const slug =
      String(service.slug || "").trim() ||
      (href.match(/\/services\/([^/?#]+)/i)?.[1]
        ? decodeURIComponent(href.match(/\/services\/([^/?#]+)/i)![1])
        : "") ||
      serviceTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const onServiceClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      handleManagerCardClick(event, editorMode, "Services", {
        slug,
        href,
        title: serviceTitle,
      });
      if (!editorMode) handleNavigate(event, href, serviceTitle);
    };

    return (
      <article
        key={`${serviceTitle}-${index}`}
        className="group flex h-full w-full flex-col rounded-[16px] bg-[#EAF2EE] p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
        data-editor-no-inline
      >
        <div className="relative h-[220px] w-full">
          <Link
            href={href}
            onClick={onServiceClick}
            className="relative block h-full w-full overflow-hidden rounded-[12px]"
          >
            <img
              src={image}
              alt={serviceTitle}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>
          <div className="absolute -bottom-6 right-4 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[4px] border-[#EAF2EE] bg-[#0A7A51] text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0B2942]">
            <WebsiteIcon name={iconKey} size={24} className="stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-8 flex flex-1 flex-col text-left">
          <h3 className="cursor-pointer text-[22px] leading-[1.3] font-bold text-[#0B2942] transition-colors duration-300 group-hover:text-[#0A7A51]">
            <Link href={href} onClick={onServiceClick}>
              {serviceTitle}
            </Link>
          </h3>
          {serviceDesc ? (
            <p className="mt-3 flex-1 text-[15px] leading-[26px] text-[#6B7280]">
              {serviceDesc}
            </p>
          ) : (
            <div className="flex-1" />
          )}
          <div className="mt-6 text-left">
            <Link
              href={href}
              onClick={onServiceClick}
              className="inline-block rounded-full bg-[#0A7A51] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#0B2942] hover:shadow-md active:scale-95"
            >
              Read More +
            </Link>
          </div>
        </div>
      </article>
    );
  });

  return (
    <>
    <section
      className="bg-[#F8F9FA] pt-8 pb-10 md:pt-10 md:pb-14"
      style={getAccentStyle(accent)}
      data-editor-fields="pretitle title services"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
            {pretitle}
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
            {title}
          </h2>
        </div>

        <div className="mt-8 md:mt-10">
          {layout === "grid" ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
              {serviceCards}
            </div>
          ) : (
            <CleaningSlider
              showDots
              autoplayMs={4000}
              gapClassName="gap-7"
              itemClassName="w-full sm:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] xl:w-[calc(25%-21px)]"
            >
              {serviceCards}
            </CleaningSlider>
          )}
        </div>
      </div>
    </section>
    {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

(
  CleaningService1 as typeof CleaningService1 & {
    editorFields: readonly string[];
  }
).editorFields = ["pretitle", "title", "services"];

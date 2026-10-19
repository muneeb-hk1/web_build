"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { site, type NGOServiceData } from "../data/categorySite";
import { FiArrowRight } from "react-icons/fi";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  resolveNgoServiceSlug,
  writeNgoServiceDetailSlug,
} from "../../../lib/ngoServiceDetails";
import type { MouseEvent as ReactMouseEvent } from "react";

interface ServicesSectionProps extends SectionProps {
  limit?: number;
  editorLabel?: string;
}

export default function NgoService1({
  data: customData,
  limit = 3,
  editorLabel = "Services",
}: ServicesSectionProps) {
  const custom = (customData ?? {}) as Partial<NGOServiceData>;
  const data = {
    ...site.service,
    ...custom,
    introduction: {
      ...site.service.introduction,
      ...custom.introduction,
      title: {
        ...site.service.introduction?.title,
        ...custom.introduction?.title,
      },
    },
    services: custom.services?.length
      ? custom.services
      : site.service.services,
  };
  const { introduction, services = [] } = data;
  const visibleServices = (services || []).filter(
    (service: { active?: boolean }) => service.active !== false,
  );

  const pageLimit = limit > 0 ? limit : visibleServices.length;
  const displayedServices = visibleServices.slice(0, pageLimit);
  const showAllServicesCta = displayedServices.length < visibleServices.length;
  const preview = useOptionalPreview();

  const openServiceDetail = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    service: Record<string, any>,
  ) => {
    if (!preview) return;
    event.preventDefault();
    event.stopPropagation();
    writeNgoServiceDetailSlug(
      resolveNgoServiceSlug({
        id: service.id,
        title: service.title,
        href: service.href,
        slug: service.slug,
      }),
    );
    preview.setCurrentPage("Service Details");
  };

  const openAllServices = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage("Services");
  };

  return (
    <section
      data-editor-section-label={editorLabel}
      data-editor-fields="introduction services"
      className="w-full bg-white pt-8 md:pt-12 px-2 sm:px-6 lg:px-8 font-sans"
    >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
              <EditableNgoIcon
                name={introduction?.icon || introduction?.iconName || "hand-heart"}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{introduction?.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2">
              {introduction?.title?.normal}{" "}
              <span className="text-[#F15A24]">
                {introduction?.title?.highlighted}
              </span>
            </h2>
            <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

            <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {introduction?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {displayedServices.map((service: Record<string, any>, index: number) => {
              const isHighlight = index === 1;

              return (
                <div
                  key={service.id || index}
                  className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-[#EAE5D9]/60"
                >
                  <div className="relative w-full h-[230px] sm:h-[250px] bg-gray-100 flex-shrink-0">
                    <Image
                      src={
                        service.image?.src ||
                        "/NGO_Images/happy-diverse-kinds-park.jpg"
                      }
                      alt={service.image?.alt || service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />

                    <div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 sm:w-18 sm:h-18 rounded-full border-[4px] border-white flex items-center justify-center z-10 shadow-md ${
                        isHighlight ? "bg-[#F15A24]" : "bg-[#24422D]"
                      }`}
                    >
                      <EditableNgoIcon
                        name={service.iconName || service.icon}
                        className="w-7 h-7 text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-12 pb-8 px-6 sm:px-8 text-center flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F2B20] mb-3">
                        <Link
                          href={service.href || "#"}
                          data-editor-keep-click
                          data-editor-nav
                          className="hover:text-[#F15A24] transition-colors"
                          onClick={(event) => openServiceDetail(event, service)}
                        >
                          {service.title}
                        </Link>
                      </h3>

                      <p className="text-[#556052] text-sm sm:text-base leading-relaxed max-w-xs mx-auto mb-3">
                        {service.description}
                      </p>

                      <center>
                        <div className="w-[100px] mx-auto h-[1px] bg-[#24422D] mb-3" />
                      </center>

                      <Link
                        href={service.href || "#"}
                        data-editor-keep-click
                        data-editor-nav
                        className="inline-flex items-center justify-center gap-2 text-[#24422D] hover:text-[#F15A24] font-bold text-sm sm:text-base tracking-wide transition-colors duration-300 group"
                        onClick={(event) => openServiceDetail(event, service)}
                      >
                        <span>{service.label || "Read More"}</span>
                        <FiArrowRight className="w-4 h-4 text-[#24422D] group-hover:text-[#F15A24] group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showAllServicesCta ? (
            <div className="text-center mt-10 md:mt-12 pb-2">
              <Link
                href="/services"
                data-editor-keep-click="true"
                data-editor-nav="true"
                onClick={openAllServices}
                className="inline-flex items-center justify-center gap-2 bg-[#F15A24] text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-full hover:bg-[#e04b00] transition-colors shadow-md"
              >
                <span>All Services</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : null}
        </div>
    </section>
  );
}

(
  NgoService1 as typeof NgoService1 & { editorFields: readonly string[] }
).editorFields = ["introduction", "services"];

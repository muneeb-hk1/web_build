"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import {site, type NGOWhyChooseUsData} from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

const getFeatureIcon = (iconName: string, themeColor: string) => {
  const iconClass =
    themeColor === "orange"
      ? "w-5 h-5 sm:w-8 sm:h-8 text-[#F15A24]"
      : "w-5 h-5 sm:w-8 sm:h-8 text-[#24422D]";

  return <EditableNgoIcon name={iconName} className={iconClass} />;
};

export default function NgoWhyChooseUs1({ data:customData }: SectionProps) {
    const data = {
    ...site.whyChooseUs,
    ...((customData ?? {}) as Partial<NGOWhyChooseUsData>),
  };
  const { introduction, features = [], sideImage, overlayCard } = data;

  return(
    <>
    <section
      data-editor-section-label="Why Choose Us"
      data-editor-fields="introduction features sideImage overlayCard"
      className="w-full bg-white  py-8 md:py-16 px-4 sm:px-6 lg:px-8 font-sans"
    >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* =========================================================
              LEFT COLUMN - HEADER & FEATURE CARDS
          ========================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Badge with side lines */}
            <div className="inline-flex items-center gap-1.5 sm:gap-3 max-w-full px-2">
              {/* LEFT DECORATIVE GRADIENT LINE */}
              {/* <div className="flex items-center shrink-0">
                <span className="w-6 sm:w-20 h-[2px] bg-gradient-to-l from-[#F15A24] to-transparent inline-block" />
                <span className="w-1.5 sm:w-2.5 h-[2px] bg-[#F15A24] inline-block ml-0.5 sm:ml-1" />
              </div> */}

              {/* CENTER BADGE CONTENT */}
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
                <EditableNgoIcon
                  name={introduction?.icon || introduction?.iconName || "hand-heart"}
                  className="w-8 h-8 text-emerald-600"
                />
                <span className="italic font-serif">{introduction?.badge}</span>
              </div>

              {/* RIGHT DECORATIVE GRADIENT LINE */}
              {/* <div className="flex items-center shrink-0">
                <span className="w-1.5 sm:w-2.5 h-[2px] bg-[#F15A24] inline-block mr-0.5 sm:mr-1" />
                <span className="w-6 sm:w-20 h-[2px] bg-gradient-to-r from-[#F15A24] to-transparent inline-block" />
              </div> */}
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-3">
              {introduction?.title?.normal}{" "}
              <span className="text-[#F15A24]">
                {introduction?.title?.highlighted}
              </span>
            </h2>
            <div className="w-20 h-1 mx-auto lg:mx-0 bg-[#16a34a] rounded-full"></div>


            {/* Description */}
            <p className="text-[#556052] text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {introduction?.description}
            </p>

            {/* Feature Item List (1 column on Mobile, 2 columns on Tablet, 1 column on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
              {features?.map((feature) => {
                const isOrange = feature.themeColor === "orange";

                return (
                  <div
                    key={feature.id}
                    className={`group relative flex items-center justify-between bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-[4px] text-left ${
                      isOrange ? "border-l-[#F15A24]" : "border-l-[#24422D]"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Circle Icon Container */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isOrange ? "bg-[#FFF2EB]" : "bg-[#EBF2EC]"
                        }`}
                      >
                        {getFeatureIcon(
                          feature.iconName || feature.icon,
                          feature.themeColor,
                        )}
                      </div>

                      {/* Text Details */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1F2B20] mb-1 group-hover:text-[#F15A24] transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-sm text-[#556052] leading-relaxed max-w-md">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow Action Badge */}
                    {/* <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-transform duration-300 group-hover:translate-x-1 ${
                        isOrange
                          ? "bg-[#FFF2EB] text-[#F15A24]"
                          : "bg-[#EBF2EC] text-[#24422D]"
                      }`}
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN - IMAGE & OVERLAY CARD
          ========================================================== */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] h-[520px] sm:h-[620px] rounded-[36px] overflow-hidden shadow-lg">
              {/* Side Image */}
              <Image
                src={sideImage?.src || "/NGO_Images/happy-diverse-kinds-park.jpg"}
                alt={sideImage?.alt || "Why choose us image"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-src={sideImage?.src || "/NGO_Images/happy-diverse-kinds-park.jpg"}
              />

              {/* OVERLAY CARD (GREEN BG WITH SEMI-TRANSPARENCY & LEAF DECORATION) */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 bg-[#0F2916]/90 backdrop-blur-sm rounded-[24px] p-3 sm:p-8 text-white z-10 overflow-hidden border border-white/10">
                {/* REALISTIC DECORATIVE LEAF ACCENT (RIGHT CORNER) */}
                <div className="absolute right-[-15px] bottom-[-10px] w-28 h-36 sm:w-32 sm:h-44 pointer-events-none z-20">
                  <svg
                    viewBox="0 0 120 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-md"
                  >
                    <defs>
                      {/* Leaf Green Gradient */}
                      <linearGradient
                        id="leafGradient"
                        x1="20"
                        y1="150"
                        x2="100"
                        y2="10"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#1E5629" />
                        <stop offset="45%" stopColor="#2E8B46" />
                        <stop offset="85%" stopColor="#41B35D" />
                        <stop offset="100%" stopColor="#5CD679" />
                      </linearGradient>

                      {/* Leaf Highlights */}
                      <linearGradient
                        id="leafHighlight"
                        x1="50"
                        y1="10"
                        x2="100"
                        y2="80"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#7FF099" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#41B35D" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Main Outer Leaf Shape */}
                    <path
                      d="M25 155 C 20 110, 5 70, 45 25 C 70 2, 95 0, 105 5 C 112 10, 110 35, 95 65 C 75 105, 55 135, 25 155 Z"
                      fill="url(#leafGradient)"
                    />

                    {/* Glossy Top Highlight */}
                    <path
                      d="M45 25 C 70 2, 95 0, 105 5 C 108 8, 106 22, 95 45 C 80 25, 60 15, 45 25 Z"
                      fill="url(#leafHighlight)"
                    />

                    {/* Center Main Stem */}
                    <path
                      d="M25 155 C 40 120, 65 70, 105 5"
                      stroke="#123B1B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Leaf Side Veins */}
                    <path
                      d="M42 120 C 52 115, 65 116, 72 122 M53 95 C 68 88, 80 90, 88 98 M66 70 C 80 62, 92 65, 98 72 M78 45 C 90 38, 98 42, 103 48 M36 135 C 30 125, 22 122, 18 124 M47 108 C 38 98, 28 95, 22 98 M58 82 C 48 72, 38 70, 32 73"
                      stroke="#184822"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeOpacity="0.7"
                    />
                  </svg>
                </div>

                <div className="flex flex-col md:flex-row gap-2 text-left">
                  {/* Icon */}
                  <div className="mb-4 relative z-10">
                    <EditableNgoIcon
                      name={overlayCard?.iconName || overlayCard?.icon}
                      className="w-8 h-8 text-white"
                    />
                  </div>

                  {/* Overlay Card Heading */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2 relative z-10">
                      {overlayCard?.title?.normal}{" "}
                      <span className="text-[#F15A24]">
                        {overlayCard?.title?.highlighted}
                      </span>
                    </h3>

                    {/* Overlay Card Description */}
                    <p className="text-sm md:text-lg w-[80%] text-gray-200 leading-relaxed max-w-sm relative z-10">
                      {overlayCard?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

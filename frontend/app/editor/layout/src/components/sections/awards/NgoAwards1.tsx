"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Trophy,
    Award as CertificateIcon,
    Calendar,
    Users,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Heart,
} from "lucide-react";
import { site, type NGOAwardData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";

export default function NgoAwards1({ data: customData }: SectionProps) {
    const custom = customData as unknown as Partial<NGOAwardData> | undefined;
    const looksReAwards =
        Array.isArray((custom as { awardItems?: unknown } | undefined)?.awardItems) &&
        !(Array.isArray(custom?.awardsList) && custom.awardsList.length);
    const hasAwards = Array.isArray(custom?.awardsList) && custom.awardsList.length > 0;
    const useCustom = Boolean(custom) && hasAwards && !looksReAwards;
    const headingPatch =
        useCustom && custom?.heading && typeof custom.heading === "object"
            ? custom.heading
            : {};
    const data = {
        ...site.award,
        ...(useCustom ? custom : {}),
        banner: { ...site.award.banner, ...(useCustom ? custom?.banner : {}) },
        heading: { ...site.award.heading, ...headingPatch },
        certificatesHeading: {
            ...site.award.certificatesHeading,
            ...(useCustom ? custom?.certificatesHeading : {}),
        },
        bannerCTA: { ...site.award.bannerCTA, ...(useCustom ? custom?.bannerCTA : {}) },
        awardsList: useCustom ? custom?.awardsList : site.award.awardsList,
        certificatesList:
            useCustom && Array.isArray(custom?.certificatesList) && custom.certificatesList.length
                ? custom.certificatesList
                : site.award.certificatesList,
        stats:
            useCustom && Array.isArray(custom?.stats) && custom.stats.length
                ? custom.stats
                : site.award.stats,
    };
    const {
        heading,
        awardsList = [],
        certificatesHeading,
        certificatesList = [],
        stats = [],
        bannerCTA,
    } = data;

    const [certIndex, setCertIndex] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const nextItemsPerPage = window.innerWidth >= 1024
                ? 4
                : window.innerWidth >= 768
                    ? 3
                    : window.innerWidth >= 640
                        ? 2
                        : 1;

            setItemsPerPage(nextItemsPerPage);
            setCertIndex((previous) =>
                Math.min(previous, Math.max(0, certificatesList.length - nextItemsPerPage)),
            );
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, [certificatesList.length]);

    const handlePrevCert = () => {
        setCertIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNextCert = () => {
        setCertIndex((prev) =>
            Math.min(Math.max(0, certificatesList.length - itemsPerPage), prev + 1),
        );
    };

    const renderStatIcon = (type: string) => {
        switch (type) {
            case "trophy":
                return <Trophy className="w-8 h-8 text-[#047857]" />;
            case "certificate":
                return <CertificateIcon className="w-8 h-8 text-[#047857]" />;
            case "calendar":
                return <Calendar className="w-8 h-8 text-[#047857]" />;
            case "users":
                return <Users className="w-8 h-8 text-[#047857]" />;
            default:
                return <Trophy className="w-8 h-8 text-[#047857]" />;
        }
    };

    return (
        <>
            <section data-editor-section-label="Awards" data-editor-fields="heading awardsList certificatesHeading certificatesList stats bannerCTA" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 font-sans">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* SECTION 1: OUR AWARDS GRID */}
                    <div>
                        <div className="text-center mb-12 ">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                                {heading?.title}
                            </h2>
                            <div className="w-16 h-1 bg-[#047857] mx-auto mt-2 rounded-full" />

                            <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                {heading?.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {awardsList.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-stretch gap-4"
                                >
                                    {/* Fixed container and object-cover vertically fills the entire frame without top/bottom empty whitespace */}
                                    <div className="relative w-32 h-44 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-gray-100">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                            data-editor-media
                                            data-editor-media-type="image"
                                            data-editor-media-src={item.imageUrl}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between h-full py-0.5 space-y-2">
                                        <div>
                                            <h3 className="text-base font-extrabold text-[#047857] leading-snug line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className="text-sm font-black text-[#047857] tracking-wide uppercase">
                                            {item.issuedBy}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: OUR CERTIFICATES SLIDER */}
                    <div>
                        <div className="text-center mb-8 space-y-2">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl mx-auto font-extrabold text-[#1F2B20] tracking-tight mb-3 max-w-3xl">
                                {certificatesHeading?.title || "Our Certificates"}
                            </h2>
                            <div className="w-12 h-1 bg-[#047857] mx-auto mt-2 rounded-full" />
                        </div>

                        <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
                            {/* Previous Button */}
                            <button
                                onClick={handlePrevCert}
                                disabled={certIndex === 0}
                                className="absolute -left-2 sm:-left-3 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-gray-700 hover:text-[#047857] hover:border-[#047857] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                aria-label="Previous Certificate"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Viewport Container */}
                            <div className="w-full overflow-hidden py-2 rounded-xl">
                                <div
                                    className="flex gap-3 transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `translateX(calc(-${certIndex} * (100% / ${itemsPerPage} + ${12 / itemsPerPage
                                            }px)))`,
                                    }}
                                >
                                    {certificatesList.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)] flex-shrink-0 bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                        >
                                            <div className="relative w-full h-36 bg-slate-50 rounded-lg border border-gray-100 mb-2.5 overflow-hidden">
                                                <Image
                                                    src={cert.imageUrl}
                                                    alt={cert.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                    className="object-cover"
                                                    data-editor-media
                                                    data-editor-media-type="image"
                                                    data-editor-media-src={cert.imageUrl}
                                                />
                                            </div>

                                            <h4 className="text-sm sm:text-sm font-extrabold text-[#0a192f]">
                                                {cert.title}
                                            </h4>
                                            <p className="text-[11px] sm:text-sm font-bold text-[#047857] mt-0.5">
                                                {cert.issuedBy}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNextCert}
                                disabled={certIndex >= certificatesList.length - itemsPerPage}
                                className="absolute -right-2 sm:-right-3 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-gray-700 hover:text-[#047857] hover:border-[#047857] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                aria-label="Next Certificate"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* SECTION 3: STATS STRIP */}
                    {stats.length > 0 && (
                        <div className="bg-[#e6f4ed] rounded-2xl sm:p-8 p-3 sm:p-10 grid grid-cols-2 sm:grid-cols-4 gap-8  border border-emerald-200 shadow-sm">
                            {stats.map((stat) => (
                                <div
                                    key={stat.id}
                                    className="flex flex-col md:flex-row gap-2 space-y-3"
                                >
                                    <div className="w-14 h-14 rounded-full bg-emerald-200/80 flex items-center justify-center shadow-inner">
                                        {renderStatIcon(stat.type)}
                                    </div>
                                    <div className="text">
                                        <span className="text-3xl sm:text-4xl font-black text-[#0a192f]">
                                            {stat.value}
                                        </span>
                                        <h5 className="text-sm font-extrabold text-[#0a192f] mt-1">
                                            {stat.label}
                                        </h5>
                                        <p className="text-sm sm:text-sm text-gray-700 font-semibold">
                                            {stat.sublabel}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SECTION 4: CALL TO ACTION BANNER */}
                    {bannerCTA && (
                        <div className="bg-[#e6f4ed] rounded-2xl p-6 sm:p-8 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                                {/* Icon */}
                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-emerald-200/80 flex-shrink-0 flex items-center justify-center">
                                    <Heart className="h-9 w-9 text-emerald-700" aria-hidden="true" />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0a192f]">
                                        {bannerCTA.title}
                                    </h3>

                                    <p className="text-sm sm:text-base font-semibold text-gray-700 max-w-xl leading-relaxed mx-auto md:mx-0">
                                        {bannerCTA.description}
                                    </p>
                                </div>
                            </div>

                            {/* Button */}
                            <Link
                                href={bannerCTA.buttonUrl}
                                className="whitespace-nowrap bg-[#047857] hover:bg-[#035e44] text-white text-sm font-extrabold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-colors shadow-md shrink-0 uppercase tracking-wide"
                            >
                                <span>{bannerCTA.buttonText}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

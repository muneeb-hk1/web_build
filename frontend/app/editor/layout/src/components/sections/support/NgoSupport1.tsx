"use client";

import React, { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import NgoStats1 from "../stats/NgoStats1";
import { site, type NGOStatsDataData, type NGOSupportData } from "../data/categorySite";
import type { SectionData, SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import { renderNgoEditorPart } from "../../../lib/ngoEditorParts";

const flattenPreviewLinks = (
    links: Array<{ label?: string; href?: string; children?: unknown[] }> = [],
): Array<{ label?: string; href?: string }> =>
    links.flatMap((link) => [
        { label: link.label, href: link.href },
        ...flattenPreviewLinks(
            (link.children as Array<{
                label?: string;
                href?: string;
                children?: unknown[];
            }>) || [],
        ),
    ]);

const hrefSlug = (value?: string) =>
    (value || "")
        .trim()
        .toLowerCase()
        .replace(/^#page-/, "")
        .replace(/^\/+/, "")
        .replace(/[?#].*$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const renderHighlightedTitle = (html?: string) => {
    const raw = html || "Frequently Asked Questions";
    const match = raw.match(/^(.*?)<span[^>]*>(.*?)<\/span>(.*)$/i);
    if (!match) return raw.replace(/<[^>]+>/g, "");
    return (
        <>
            {match[1]}
            <span className="text-amber-500">{match[2]}</span>
            {match[3]}
        </>
    );
};

type SupportEditorData = NGOSupportData & {
    stats?: NGOStatsDataData["stats"] | Record<string, unknown>;
    bgImage?: string;
    partOrder?: number[];
};

export default function NgoSupport1({
    data: customData,
    editorPart,
}: SectionProps & { editorPart?: number }) {
    const preview = useOptionalPreview();
    const custom = customData as unknown as Partial<SupportEditorData> | undefined;
    const statsPack =
        custom?.stats &&
        typeof custom.stats === "object" &&
        !Array.isArray(custom.stats)
            ? (custom.stats as Record<string, unknown>)
            : {
                  stats: custom?.stats ?? site.statsData.stats,
                  bgImage: custom?.bgImage ?? site.statsData.bgImage,
              };
    const data = {
        ...site.support,
        ...custom,
        banner: { ...site.support.banner, ...custom?.banner },
        waysToSupport: { ...site.support.waysToSupport, ...custom?.waysToSupport },
        helpSection: { ...site.support.helpSection, ...custom?.helpSection },
        stats: Array.isArray(statsPack.stats)
            ? statsPack.stats
            : site.statsData.stats,
        bgImage:
            (typeof statsPack.bgImage === "string" && statsPack.bgImage) ||
            custom?.bgImage ||
            site.statsData.bgImage,
    };
    const { waysToSupport, helpSection } = data;

    const keepEditorOnCanvas = (event: ReactMouseEvent<HTMLAnchorElement>) => {
        if (!preview) return;
        event.preventDefault();
    };

    const openEditorPage = (
        event: ReactMouseEvent<HTMLAnchorElement>,
        href: string,
        fallbackLabel: string,
    ) => {
        keepEditorOnCanvas(event);
        if (!preview) return;
        const slug = hrefSlug(href);
        const match = flattenPreviewLinks(preview.pageLinks).find((link) => {
            const linkSlug = hrefSlug(link.href) || hrefSlug(link.label);
            return Boolean(slug) && (linkSlug === slug || hrefSlug(link.label) === slug);
        });
        preview.setCurrentPage(match?.label || fallbackLabel);
    };

    // Track active accordion state for FAQs
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Helper function to dynamically map icons for "Ways You Can Support"
    const getIcon = (iconName: string) => {
        const colorClass =
            iconName?.toLowerCase() === "volunteer"
                ? "text-amber-600"
                : iconName?.toLowerCase() === "partner"
                  ? "text-sky-600"
                  : iconName?.toLowerCase() === "fundraise"
                    ? "text-purple-600"
                    : iconName?.toLowerCase() === "spread"
                      ? "text-amber-500"
                      : "text-emerald-700";
        return (
            <EditableNgoIcon
                name={iconName}
                className={`w-7 md:w-12 md:h-12 h-7 ${colorClass}`}
            />
        );
    };

    // Helper function to dynamically map button outline/border colors
    const getButtonClass = (iconName: string) => {
        switch (iconName?.toLowerCase()) {
            case "donate":
                return "border-emerald-600 text-emerald-700 hover:bg-emerald-50";
            case "volunteer":
                return "border-amber-500 text-amber-600 hover:bg-amber-50";
            case "partner":
                return "border-sky-500 text-sky-600 hover:bg-sky-50";
            case "fundraise":
                return "border-purple-500 text-purple-600 hover:bg-purple-50";
            case "spread":
                return "border-amber-400 text-amber-500 hover:bg-amber-50";
            default:
                return "border-emerald-600 text-emerald-700 hover:bg-emerald-50";
        }
    };

    const waysPart = waysToSupport ? (
                <section key="ways" data-editor-section-label="Ways to Support" data-editor-fields="waysToSupport" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2">
                            {waysToSupport.sectionTitle}
                        </h2>
                        <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {waysToSupport.items?.map((item, index) => (
                            <div
                                key={index}
                                data-editor-item-type="SupportWay"
                                data-editor-item-label={item.title || "Way to support"}
                                className="bg-[#fafbfb] border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                {/* Rounded Icon Circle */}
                                <div
                                    className={`w-16 md:w-24 md:h-24 h-16 rounded-full flex items-center justify-center mb-5 ${item.icon === "donate"
                                        ? "bg-emerald-100/60"
                                        : item.icon === "volunteer"
                                            ? "bg-amber-100/60"
                                            : item.icon === "partner"
                                                ? "bg-sky-100/60"
                                                : item.icon === "fundraise"
                                                    ? "bg-purple-100/60"
                                                    : "bg-amber-100/50"
                                        }`}
                                >
                                    {getIcon(item.icon)}
                                </div>

                                {/* Card Title */}
                                <h3 className="text-base font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>

                                {/* Card Description */}
                                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                                    {item.description}
                                </p>

                                {/* Action Button */}
                                <Link
                                    href={item.buttonUrl || "#"}
                                    data-editor-keep-click="true"
                                    data-editor-nav="true"
                                    onClick={(event) =>
                                        openEditorPage(
                                            event,
                                            item.buttonUrl || "/contact-us",
                                            "Contact",
                                        )
                                    }
                                    className={`w-full py-2 px-3 border rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${getButtonClass(
                                        item.icon
                                    )}`}
                                >
                                    <span>{item.buttonText}</span>
                                    <span className="text-sm">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null;

    const statsPart = (
            <div key="stats" className="mt-8 md:mt-12">
                <NgoStats1
                    data={
                        { stats: data.stats, bgImage: data.bgImage } as unknown as SectionData
                    }
                />
            </div>
    );

    const faqPart = helpSection ? (
                <section key="faq" data-editor-section-label="FAQ" data-editor-fields="helpSection" className="w-full relative overflow-hidden bg-white">
                    <div className=" mx-auto grid grid-cols-1 sm:grid-cols-12 min-h-[500px] sm:min-h-[580px]">
                        {/* Left Column: FAQ Accordion */}
                        <div className="sm:col-span-7 py-8 sm:py-12 md:py-16 px-4 sm:px-6  lg:pr-12 sm:pl-4 md:pl-10 z-10">
                            {/* Section Subtitle */}
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
                                <EditableNgoIcon
                                    name={(helpSection as { icon?: string } | undefined)?.icon || "hand-heart"}
                                    className="w-8 h-8 text-emerald-600"
                                />
                                <span className="italic font-serif">
                                    {helpSection.subTitle}
                                </span>
                            </div>

                            {/* Section Main Title */}
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2 max-w-2xl">
                                {renderHighlightedTitle(helpSection.title)}
                            </h2>
                            <div className="w-20 h-1 bg-[#16a34a] rounded-full mb-4"></div>


                            {/* Accordion Container */}
                            <div className="space-y-4">
                                {helpSection.accordions?.map((accordion, idx) => {
                                    const isOpen = openFaqIndex === idx;
                                    return (
                                        <div
                                            key={idx}
                                            data-editor-item-type="SupportFaq"
                                            data-editor-item-label={accordion.title || "Question"}
                                            data-editor-keep-click="true"
                                            className={`rounded-2xl transition-all duration-200 overflow-hidden ${isOpen
                                                ? "bg-[#036a38] text-white shadow-md"
                                                : "bg-slate-50 hover:bg-slate-100/80 text-slate-800 border border-slate-200/80"
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(idx)}
                                                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm cursor-pointer"
                                            >
                                                <span>{accordion.title}</span>
                                                <div
                                                    data-editor-no-inline="true"
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isOpen
                                                        ? "bg-white/20 text-white"
                                                        : "bg-slate-200/60 text-slate-600"
                                                        }`}
                                                >
                                                    {isOpen ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-sm bg-white text-slate-800 border-t border-white/10 pt-3">
                                                    <p className="cursor-text">{accordion.content}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Teal Background & Dual Overlapping Images */}
                        <div className="sm:col-span-5 relative bg-[#036a38] min-h-[380px] sm:min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
                            {/* Exact Pixel-Matched Torn Paper Edge SVG */}
                            <div className="hidden sm:block absolute top-0 bottom-0 -left-12 w-12 h-full z-20 pointer-events-none">
                                <svg
                                    viewBox="0 0 100 1000"
                                    preserveAspectRatio="none"
                                    className="w-full h-full fill-[#036a38]"
                                    aria-hidden="true"
                                >
                                    <path d="M100 0 C85 10 50 15 52 35 C54 50 40 60 48 75 C52 85 60 95 50 105 L42 110 L58 120 C50 135 38 145 46 160 C52 172 65 180 52 195 C40 210 68 225 60 240 L50 255 L42 270 L68 285 C55 300 62 315 58 330 C52 350 40 365 48 385 C54 400 68 415 60 435 C52 455 45 470 50 490 C55 510 32 525 40 540 L28 555 L55 565 C42 585 38 605 45 625 C52 645 20 660 35 680 C48 700 38 720 50 735 L30 750 L48 760 C55 775 42 790 52 810 C62 830 48 850 58 870 C68 890 25 905 35 925 C45 945 40 965 50 980 C58 990 85 995 100 1000 Z" />
                                </svg>
                            </div>

                            {/* Overlapping Image Cards Wrapper */}
                            <div className="relative w-full  aspect-4/5 flex items-center justify-center z-10">
                                {/* Main Image Frame */}
                                <div className="w-[75%] h-[82%] relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl translate-x-[-10%] translate-y-[-5%]">
                                    <Image
                                        src={
                                            helpSection.mainImage ||
                                            "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"
                                        }
                                        alt="FAQ Primary Community"
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
                                        className="object-cover"
                                        data-editor-media
                                        data-editor-media-type="image"
                                        data-editor-media-src={helpSection.mainImage || "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"}
                                    />
                                </div>

                                {/* Secondary Inset Image Frame */}
                                <div className="absolute top-[25%] right-[0%] w-[55%] h-[48%] rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-20">
                                    <Image
                                        src={
                                            helpSection.secondaryImage ||
                                            "/categories/ngo/template1/group-doctors-putting-their-hands-together-closeup.jpg"
                                        }
                                        alt="FAQ Secondary Detail"
                                        fill
                                        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
                                        className="object-cover"
                                        data-editor-media
                                        data-editor-media-type="image"
                                        data-editor-media-src={helpSection.secondaryImage || "/categories/ngo/template1/group-doctors-putting-their-hands-together-closeup.jpg"}
                                    />
                                </div>

                                {/* Decorative Amber Bar Accent */}
                                <div className="absolute bottom-[8%] right-[8%] w-2.5 h-20 bg-amber-400 rounded-full z-30"></div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null;

    const parts = [waysPart, statsPart, faqPart];
    const stored: number[] = Array.isArray(custom?.partOrder)
        ? custom.partOrder.filter(
              (index: unknown): index is number => typeof index === "number",
          )
        : [0, 1, 2];
    const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
    parts.forEach((part, index) => {
        if (part && !order.includes(index)) order.push(index);
    });
    const page = <>{order.map((index) => parts[index])}</>;
    return renderNgoEditorPart(editorPart, parts, page);
}

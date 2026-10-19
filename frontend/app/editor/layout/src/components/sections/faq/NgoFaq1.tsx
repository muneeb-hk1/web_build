"use client";

import React, { useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Plus,
    Minus,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import { site, type NGOFaqData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import { normalizeNgoIconId } from "../../../lib/ngoIcons";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";

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

export default function NgoFaq1({ data: customData }: SectionProps) {
    const preview = useOptionalPreview();
    const custom = customData as unknown as Partial<NGOFaqData> | undefined;
    const looksReFaq =
        Array.isArray((custom as { faqItems?: unknown } | undefined)?.faqItems) &&
        !(Array.isArray(custom?.faqSections) && custom.faqSections.length);
    const useCustom = Boolean(custom) && !looksReFaq;
    const data = {
        banner: {
            ...site.faq.banner,
            ...(useCustom ? custom?.banner : {}),
        },
        sidebarCategories:
            useCustom && Array.isArray(custom?.sidebarCategories)
                ? custom.sidebarCategories
                : site.faq.sidebarCategories,
        sidebarBanner: {
            ...site.faq.sidebarBanner,
            ...(useCustom ? custom?.sidebarBanner : {}),
        },
        faqSections:
            useCustom && Array.isArray(custom?.faqSections)
                ? custom.faqSections
                : site.faq.faqSections,
    };
    const { sidebarCategories, sidebarBanner, faqSections } = data;
    const keepEditorOnCanvas = (event: ReactMouseEvent<HTMLAnchorElement>) => {
        if (!preview) return;
        event.preventDefault();
    };

    const openQuotePage = (event: ReactMouseEvent<HTMLAnchorElement>) => {
        keepEditorOnCanvas(event);
        if (!preview) return;
        const href = sidebarBanner?.buttonUrl || "/contact-us";
        const slug = hrefSlug(href);
        const match = flattenPreviewLinks(preview.pageLinks).find((link) => {
            const linkSlug = hrefSlug(link.href) || hrefSlug(link.label);
            return Boolean(slug) && (linkSlug === slug || hrefSlug(link.label) === slug);
        });
        preview.setCurrentPage(match?.label || "Contact");
    };

    // Active Category State
    const [activeCategoryId, setActiveCategoryId] = useState<string>(
        sidebarCategories?.[0]?.id || "general"
    );

    // Active Accordion State
    const [openFaqKey, setOpenFaqKey] = useState<string | null>("general-0");

    const toggleFaq = (key: string) => {
        setOpenFaqKey(openFaqKey === key ? null : key);
    };

    // Helper function to render sidebar icons
    const getSidebarIcon = (iconName?: string) => {
        const resolved = iconName || "help-circle";
        const isHelp = normalizeNgoIconId(resolved) === "help-circle";
        return (
            <EditableNgoIcon
                name={resolved}
                className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${
                    isHelp ? "text-orange-500" : "text-slate-500"
                }`}
            />
        );
    };

    // Dynamic styling based on colorScheme
    const getColorStyles = (colorScheme?: string) => {
        switch (colorScheme) {
            case "emerald":
                return {
                    title: "text-slate-900 border-b-2 border-emerald-600 pb-1 inline-block",
                    activeCard: "bg-[#f2f8f5] border-emerald-100",
                    activeText: "text-emerald-700",
                    activeIconBg: "bg-emerald-600 text-white",
                    inactiveIconBg: "text-emerald-600 border border-emerald-500/30",
                    hoverCard: "hover:border-emerald-200",
                };
            case "sky":
                return {
                    title: "text-slate-900 border-b-2 border-sky-500 pb-1 inline-block",
                    activeCard: "bg-[#f0f7fc] border-sky-100",
                    activeText: "text-sky-600",
                    activeIconBg: "bg-sky-500 text-white",
                    inactiveIconBg: "text-sky-500 border border-sky-400/30",
                    hoverCard: "hover:border-sky-200",
                };
            case "purple":
                return {
                    title: "text-slate-900 border-b-2 border-purple-500 pb-1 inline-block",
                    activeCard: "bg-[#f8f5fc] border-purple-100",
                    activeText: "text-purple-700",
                    activeIconBg: "bg-purple-600 text-white",
                    inactiveIconBg: "text-purple-600 border border-purple-400/30",
                    hoverCard: "hover:border-purple-200",
                };
            case "orange":
            default:
                return {
                    title: "text-slate-900 border-b-2 border-orange-500 pb-1 inline-block",
                    activeCard: "bg-[#fff7f2] border-orange-100",
                    activeText: "text-orange-600",
                    activeIconBg: "bg-orange-500 text-white",
                    inactiveIconBg: "text-orange-500 border border-orange-400/30",
                    hoverCard: "hover:border-orange-200",
                };
        }
    };

    // Filter sections to show selected category
    const filteredSections = faqSections?.filter(
        (sec) => sec.id === activeCategoryId
    );

    return (
        <>
            {/* 2. Main Content Container */}
            <div
                data-editor-section-label="FAQ"
                data-editor-fields="banner sidebarCategories sidebarBanner faqSections"
                className="w-full bg-[#fcfcfc] text-slate-800 font-sans antialiased max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16"
            >

                {/* Layout Setup: 
              - Mobile: Stacked (Categories -> FAQ Section -> Banner Image)
              - Tablet (md to lg): 2-Column Side-by-Side (Categories Left, Q&A Right), Banner Image Full-Width Below
              - Desktop (xl): Side-by-Side (Categories + Banner Image Left, Q&A Right)
          */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Sidebar Navigation: Mobile Top | Tablet Left Col (4/12) | Desktop Left Col (4/12) */}
                    <div className="md:col-span-4 xl:col-span-4 flex flex-col gap-6">
                        {sidebarCategories && (
                            <div
                                className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 space-y-1"
                            >
                                {sidebarCategories.map((cat) => {
                                    const isActive = activeCategoryId === cat.id;
                                    return (
                                        <div
                                            key={cat.id}
                                            role="button"
                                            tabIndex={0}
                                            data-editor-keep-click="true"
                                            data-editor-active={isActive ? "true" : undefined}
                                            data-editor-item-type="FaqCategory"
                                            data-editor-item-label={cat.title || "FAQ category"}
                                            onClick={() => {
                                                setActiveCategoryId(cat.id);
                                                setOpenFaqKey(`${cat.id}-0`);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key !== "Enter" && event.key !== " ") return;
                                                event.preventDefault();
                                                setActiveCategoryId(cat.id);
                                                setOpenFaqKey(`${cat.id}-0`);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-200 cursor-pointer ${isActive
                                                ? "bg-slate-50 text-orange-500 shadow-2xs"
                                                : "text-slate-700 hover:bg-slate-50/70"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span data-editor-no-inline="true" className="inline-flex">
                                                    {getSidebarIcon(cat.icon)}
                                                </span>
                                                <span className="cursor-text">{cat.title}</span>
                                            </div>
                                            <span data-editor-no-inline="true" className="inline-flex">
                                                <ChevronRight
                                                    className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${isActive ? "text-orange-500" : "text-slate-400"
                                                        }`}
                                                />
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Desktop Banner Image (Hidden on Mobile & Tablet) */}
                        {sidebarBanner && (
                            <div
                                className="hidden xl:flex relative rounded-2xl overflow-hidden min-h-[400px] flex-col justify-end p-6 text-white shadow-md"
                            >
                                <Image
                                    src={
                                        sidebarBanner.imageUrl ||
                                        "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"
                                    }
                                    alt={sidebarBanner.title}
                                    fill
                                    sizes="100%"
                                    className="object-cover"
                                    data-editor-media
                                    data-editor-media-type="image"
                                    data-editor-media-src={sidebarBanner.imageUrl || "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

                                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white/20 backdrop-blur-xs p-3 rounded-2xl border border-white/20">
                                    <EditableNgoIcon
                                        name={sidebarBanner?.icon || "hand-heart"}
                                        className="w-10 h-10 text-white stroke-[1.5]"
                                    />
                                </div>

                                <div className="relative z-20 flex flex-col">
                                    <p className="text-sm text-amber-300 font-medium tracking-wide mb-1">
                                        {sidebarBanner.tagline}
                                    </p>
                                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-5 max-w-[220px]">
                                        {sidebarBanner.title}
                                    </h3>
                                    <Link
                                        href={sidebarBanner.buttonUrl || "/contact-us"}
                                        data-editor-keep-click="true"
                                        data-editor-nav="true"
                                        onClick={openQuotePage}
                                        className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 w-fit rounded-full transition-all shadow-md group"
                                    >
                                        <span>{sidebarBanner.buttonText || "Get A Quote"}</span>
                                        <span data-editor-no-inline="true" className="inline-flex">
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ Accordion Section: Mobile Middle | Tablet Right Col (8/12) | Desktop Right Col (8/12) */}
                    <div
                        className="md:col-span-8 xl:col-span-8 space-y-10"
                    >
                        {(filteredSections && filteredSections.length > 0
                            ? filteredSections
                            : faqSections
                        )?.map((section) => {
                            const styles = getColorStyles(section.colorScheme);

                            return (
                                <div
                                    key={section.id}
                                    data-editor-item-type="FaqSection"
                                    data-editor-item-label={section.categoryTitle || "FAQ section"}
                                    className="bg-white rounded-2xl p-4 md:p-8 shadow-2xs border border-slate-100"
                                >
                                    <div className="mb-6">
                                        <h2 className={`text-xl md:text-2xl font-bold cursor-text ${styles.title}`}>
                                            {section.categoryTitle}
                                        </h2>
                                    </div>

                                    <div className="space-y-3.5">
                                        {section.items?.map((item, idx) => {
                                            const itemKey = `${section.id}-${idx}`;
                                            const isOpen = openFaqKey === itemKey;

                                            return (
                                                <div
                                                    key={idx}
                                                    data-editor-item-type="FaqItem"
                                                    data-editor-item-label={item.question || "FAQ item"}
                                                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                                                        ? `${styles.activeCard}`
                                                        : `bg-white border-slate-100 ${styles.hoverCard}`
                                                        }`}
                                                >
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        data-editor-keep-click="true"
                                                        data-editor-active={isOpen ? "true" : undefined}
                                                        onClick={() => toggleFaq(itemKey)}
                                                        onKeyDown={(event) => {
                                                            if (event.key !== "Enter" && event.key !== " ") return;
                                                            event.preventDefault();
                                                            toggleFaq(itemKey);
                                                        }}
                                                        className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-sm md:text-base cursor-pointer"
                                                    >
                                                        <span
                                                            className={`cursor-text ${
                                                                isOpen
                                                                    ? `${styles.activeText}`
                                                                    : "text-slate-800"
                                                            }`}
                                                        >
                                                            {item.question}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            data-editor-no-inline="true"
                                                            aria-label={isOpen ? "Collapse question" : "Expand question"}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                toggleFaq(itemKey);
                                                            }}
                                                            className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0 text-sm transition-colors ${isOpen
                                                                ? styles.activeIconBg
                                                                : styles.inactiveIconBg
                                                                }`}
                                                        >
                                                            {isOpen ? (
                                                                <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            ) : (
                                                                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="px-4 pb-5 md:px-5 md:pb-5 text-sm md:text-base text-slate-600 leading-relaxed pt-1">
                                                            <p className="cursor-text">{item.answer}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile & Tablet Bottom Banner Image (Visible ONLY on Mobile & Tablet/iPad) */}
                    {sidebarBanner && (
                        <div
                            className="col-span-1 md:col-span-12 xl:hidden relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-[360px] flex flex-col justify-end p-6 md:p-8 text-white shadow-md mt-4"
                        >
                            <Image
                                src={
                                    sidebarBanner.imageUrl ||
                                    "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"
                                }
                                alt={sidebarBanner.title}
                                fill
                                sizes="(min-width: 768px) 100vw, 100vw"
                                className="object-cover"
                                data-editor-media
                                data-editor-media-type="image"
                                data-editor-media-src={sidebarBanner.imageUrl || "/categories/ngo/template1/group-environmental-conservation-people-hands-planting-aerial-view.jpg"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white/20 backdrop-blur-xs p-3 rounded-2xl border border-white/20">
                                <EditableNgoIcon
                                    name={sidebarBanner?.icon || "hand-heart"}
                                    className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[1.5]"
                                />
                            </div>

                            <div className="relative z-20 flex flex-col items-center text-center">
                                <p className="text-sm text-amber-300 font-medium tracking-wide mb-1">
                                    {sidebarBanner.tagline}
                                </p>
                                <h3 className="text-lg md:text-2xl font-bold text-white leading-tight mb-5 max-w-md">
                                    {sidebarBanner.title}
                                </h3>
                                <Link
                                    href={sidebarBanner.buttonUrl || "/contact-us"}
                                    data-editor-keep-click="true"
                                    data-editor-nav="true"
                                    onClick={openQuotePage}
                                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm md:text-base px-7 py-3 w-fit rounded-full transition-all shadow-md group"
                                >
                                    <span>{sidebarBanner.buttonText || "Get A Quote"}</span>
                                    <span data-editor-no-inline="true" className="inline-flex">
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

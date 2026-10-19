"use client";

import React from "react";
import Image from "next/image";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    ArrowRight,
    Heart,
} from "lucide-react";

import { site, type NGOBranchesData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import type { MouseEvent as ReactMouseEvent } from "react";

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

export default function NgoBranches1({ data: customData }: SectionProps) {
    const preview = useOptionalPreview();
    const custom = customData as unknown as Partial<NGOBranchesData> | undefined;
    const data = {
        ...site.branches,
        ...custom,
        banner: { ...site.branches.banner, ...custom?.banner },
        content: { ...site.branches.content, ...custom?.content },
    };
    const { content } = data;
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

    return (
        <>
            <div className="w-full bg-[#f8fafc] text-[#1c1c1c] font-sans antialiased pb-16">
            <div data-editor-section-label="Branches" data-editor-fields="content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 space-y-12">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
                        <EditableNgoIcon
                            name={content?.icon || "hand-heart"}
                            className="w-8 h-8 text-emerald-600"
                        />
                        <span className="italic font-serif">{content?.tagline}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2">
                        {content?.mainTitle}
                        <span className="text-orange-500">{content?.highlightTitle}</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>

                    <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        {content?.description}
                    </p>
                </div>

                {/* Branch Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content?.locations?.map((branch, index) => (
                        <div
                            key={index}
                            data-editor-item-type="BranchLocation"
                            data-editor-item-label={branch.name || "Branch"}
                            className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col lg:flex-row hover:shadow-md transition-shadow"
                        >
                            {/* Branch Image */}
                            <div className="relative w-full lg:w-40 h-48 sm:h-52 lg:h-auto lg:self-stretch shrink-0 bg-slate-100 overflow-hidden">
                                <Image
                                    src={branch.image || "/categories/ngo/template1/group-people-making-good-team-while-volunteering.jpg"}
                                    alt={branch.name}
                                    fill
                                    sizes="(min-width: 1024px) 160px, 100vw"
                                    className="rounded-md object-cover"
                                    data-editor-media
                                    data-editor-media-type="image"
                                    data-editor-media-src={branch.image || "/categories/ngo/template1/group-people-making-good-team-while-volunteering.jpg"}
                                />

                                {branch.isHeadOffice && (
                                    <span className="absolute bottom-3 left-3 bg-[#0d7a42] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                                        {branch.headOfficeLabel || "Head Office"}
                                    </span>
                                )}
                            </div>

                            {/* Branch Info */}
                            <div className="p-2 flex-1 flex flex-col justify-between min-w-0">
                                <div className="space-y-3">
                                    <h3 className="font-bold text-emerald-600 text-base">
                                        {branch.name}
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{branch.address}</span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{branch.phone}</span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span className="truncate">{branch.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Pillars Box (Matched directly to reference image) */}
                <div className="bg-[#f2f9f5] border border-emerald-100/60 rounded-3xl p-6 sm:p-7 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                        {content?.features?.map((feature, idx) => {
                            return (
                                <div
                                    key={idx}
                                    data-editor-item-type="BranchFeature"
                                    data-editor-item-label={feature.title || "Feature"}
                                    className={`
            flex flex-col items-center text-center
            sm:flex-row sm:items-start sm:text-left
            lg:flex-row
            gap-4
            px-2 sm:px-4 lg:px-5
            py-6 sm:py-4 lg:py-2
            ${idx !== 0
                                            ? "border-t sm:border-t-0 lg:border-l border-slate-200/70"
                                            : ""
                                        }
            ${idx === 2 ? "lg:border-t-0" : ""}
          `}
                                >
                                    {/* Icon */}
                                    <div className="w-[72px] h-[72px] sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-full bg-[#dcf2e5] flex items-center justify-center shrink-0">
                                        <EditableNgoIcon
                                            name={feature.icon || "users"}
                                            className="w-8 h-8 lg:w-7 lg:h-7 text-[#0d7a42]"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-[#0d7a42] text-sm sm:text-base leading-snug mb-1.5">
                                            {feature.title}
                                        </h4>

                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Partner with Us & Contact Section */}
                <div className="bg-emerald-50 rounded-3xl border border-slate-200/80 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
                    {/* Left Illustration & Text */}
                    <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-full md:w-5/12 h-full bg-emerald-50 rounded-2xl flex items-center justify-center p-4">
                            <EditableNgoIcon
                                name={content?.partnerCta?.icon || "building"}
                                className="h-28 w-28 text-emerald-700"
                            />
                        </div>

                        <div className="space-y-3 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                                {content?.partnerCta?.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                                {content?.partnerCta?.description}
                            </p>
                            <a
                                href={content?.partnerCta?.buttonUrl || "/contact-us"}
                                data-editor-keep-click="true"
                                data-editor-nav="true"
                                onClick={(event) =>
                                    openEditorPage(
                                        event,
                                        content?.partnerCta?.buttonUrl || "/contact-us",
                                        "Contact",
                                    )
                                }
                                className="bg-[#0d7a42] hover:bg-[#0a6335] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                            >
                                <span>{content?.partnerCta?.buttonText}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Contact Info */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">
                            {content?.partnerCta?.getInTouchTitle}
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{content?.partnerCta?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{content?.partnerCta?.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{content?.partnerCta?.website}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Green Callout Banner */}
                <div className="w-full bg-[#036a38] text-white rounded-2xl px-5 sm:px-6 md:px-8 py-6 md:py-5 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        {/* Left Section */}
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5 w-full md:w-auto">
                            {/* Icon */}
                            <div className="shrink-0 flex items-center justify-center">
                                <EditableNgoIcon
                                    name={content?.bottomCta?.icon || "hand-heart"}
                                    className="w-12 h-12 sm:w-11 sm:h-11 md:w-10 md:h-10 stroke-[1.75]"
                                />
                            </div>

                            {/* Primary Text */}
                            <div className="text-sm sm:text-[15px] font-semibold leading-relaxed max-w-md">
                                <p>{content?.bottomCta?.text}</p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-5 w-full md:w-auto">
                            {/* Secondary Text */}
                            <p className="text-sm sm:text-[15px] font-semibold text-white text-center sm:text-left leading-relaxed max-w-sm">
                                {content?.bottomCta?.subtext}
                            </p>

                            {/* Donate Button */}
                            <a
                                href={content?.bottomCta?.buttonUrl || "/donate"}
                                data-editor-keep-click="true"
                                data-editor-nav="true"
                                onClick={(event) =>
                                    openEditorPage(
                                        event,
                                        content?.bottomCta?.buttonUrl || "/donate",
                                        "Donate",
                                    )
                                }
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#036a38] hover:bg-emerald-50 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer whitespace-nowrap"
                            >
                                <Heart className="w-4 h-4 fill-[#036a38] text-[#036a38]" />

                                <span>{content?.bottomCta?.buttonText || "Donate Now"}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

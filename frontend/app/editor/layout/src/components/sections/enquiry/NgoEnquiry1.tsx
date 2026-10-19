"use client";

import React, { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
    Phone,
    Mail,
    Clock,
    Send,
    User,
    Building2,
    MapPinIcon,
    Pencil,
    UploadCloud,
    ArrowRight,
    FileText,
    X,
} from "lucide-react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";

import NgoStats1 from "../stats/NgoStats1";
import { site, type NGOEnquiryData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
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

export default function NgoEnquiry1({
    data: customData,
    editorPart,
}: SectionProps & { editorPart?: number }) {
    const preview = useOptionalPreview();
    const custom = customData as unknown as Partial<NGOEnquiryData> & {
        stats?: Record<string, unknown>;
        partOrder?: number[];
    };
    const data = {
        ...site.enquiry,
        ...custom,
        banner: { ...site.enquiry.banner, ...custom?.banner },
        header: { ...site.enquiry.header, ...custom?.header },
        getInTouch: { ...site.enquiry.getInTouch, ...custom?.getInTouch },
        quickResponse: { ...site.enquiry.quickResponse, ...custom?.quickResponse },
        connectWithUs: { ...site.enquiry.connectWithUs, ...custom?.connectWithUs },
        faqSection: { ...site.enquiry.faqSection, ...custom?.faqSection },
        form: { ...site.enquiry.form, ...custom?.form },
    };
    const {
        header,
        getInTouch,
        quickResponse,
        connectWithUs,
        faqSection,
        form,
    } = data;

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

    const enquiryPart = (
            <div key="enquiry" className="w-full bg-[#f8fafc] text-[#1c1c1c] font-sans antialiased pb-5">
            <div data-editor-section-label="Enquiry" data-editor-fields="header getInTouch quickResponse connectWithUs faqSection form" className="md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form Section */}
                    <div data-editor-fields="header form" className="lg:col-span-8 bg-white p-6 md:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
                        {/* Form Header */}
                        <div className="flex items-start gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Send className="w-5 h-5 -rotate-12" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                    {form.formHeaderTitle || header.title}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    {form.formHeaderSubtitle || header.description}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            {/* Row 1: Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.fullNameLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder={form.fullNamePlaceholder}
                                            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.emailLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="email"
                                            placeholder={form.emailPlaceholder}
                                            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Mobile Number & Organization Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.mobileLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="tel"
                                            placeholder={form.mobilePlaceholder}
                                            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.orgNameLabel}{" "}
                                        <span className="text-slate-400 font-normal">
                                            {form.orgNameOptionalTag}
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder={form.orgNamePlaceholder}
                                            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: City / State & Enquiry Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.cityStateLabel}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPinIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder={form.cityStatePlaceholder}
                                            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.enquiryTypeLabel}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700 cursor-pointer"
                                        required
                                    >
                                        {form.enquiryTypeOptions?.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Subject */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">
                                    {form.subjectLabel} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Pencil className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder={form.subjectPlaceholder}
                                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 5: Message */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">
                                    {form.messageLabel} <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder={form.messagePlaceholder}
                                    className="w-full p-4 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-700 resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Row 6: Upload File & Preferred Contact Method */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">
                                        {form.fileUpload?.label}{" "}
                                        <span className="text-slate-400 font-normal">
                                            {form.fileUpload?.optionalTag}
                                        </span>
                                    </label>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/30 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        {!selectedFile ? (
                                            <>
                                                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />

                                                <p className="text-sm font-bold text-emerald-700">
                                                    {form.fileUpload?.chooseText}{" "}
                                                    <span className="text-slate-500 font-normal">
                                                        {form.fileUpload?.dragText}
                                                    </span>
                                                </p>

                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {form.fileUpload?.supportedFormatsText}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-between gap-3 text-left">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-emerald-600" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 truncate">
                                                            {selectedFile.name}
                                                        </p>

                                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                                            {(selectedFile.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile();
                                                    }}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                                    aria-label="Remove file"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-3">
                                        {form.preferredContactLabel}
                                    </label>
                                    <div className="space-y-2.5">
                                        {form.preferredContactOptions?.map((item, idx) => (
                                            <label
                                                key={idx}
                                                className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700"
                                            >
                                                <input
                                                    type="radio"
                                                    name="preferredContactMethod"
                                                    value={item.value}
                                                    defaultChecked={item.defaultChecked}
                                                    className="accent-emerald-600 w-4 h-4"
                                                />
                                                {item.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    required
                                    className="accent-emerald-600 rounded-sm w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="consent" className="text-sm text-slate-500">
                                    {form.consentText}{" "}
                                    <a
                                        href={form.href}
                                        className="text-emerald-700 font-bold hover:underline"
                                    >
                                        {form.privacyLinkText}
                                    </a>{" "}
                                    {form.termsLinkText}
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#0d7a42] hover:bg-[#0a6335] text-white font-bold text-sm py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <Send className="w-4 h-4 -rotate-12" />
                                {form.submitButtonText}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Info Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Get in Touch Box */}
                        <div data-editor-fields="getInTouch" className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {getInTouch.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                {getInTouch.quoteText}
                            </p>

                            <div className="space-y-5">
                                {getInTouch.contactItems?.map((item, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            data-editor-item-type="ContactItem"
                                            data-editor-item-label={item.title || "Contact item"}
                                            className="flex items-start gap-3.5"
                                        >
                                            <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                                                <EditableNgoIcon
                                                    name={item.icon || "location"}
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-slate-500 leading-snug mt-0.5">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Response Box */}
                        <div data-editor-fields="quickResponse" className="bg-[#f0fdf4] border border-emerald-100 p-6 rounded-3xl flex items-start gap-4">
                            <div className="p-3 bg-emerald-100/80 text-emerald-800 rounded-2xl shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">
                                    {quickResponse?.title}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {quickResponse?.subtitle}
                                </p>
                                <p className="text-xl font-extrabold text-emerald-800 my-0.5">
                                    {quickResponse?.timeframe}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    {quickResponse?.thankYouText}
                                </p>
                            </div>
                        </div>

                        {/* Connect With Us Box */}
                        <div data-editor-fields="connectWithUs" className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                            <h4 className="text-sm font-bold text-slate-900 mb-1">
                                {connectWithUs?.title}
                            </h4>
                            <p className="text-sm text-slate-500 mb-4">
                                {connectWithUs?.description}
                            </p>

                            <div className="flex items-center gap-3">
                                {connectWithUs?.socialLinks?.map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                                    >
                                        {social.platform === "facebook" && (
                                            <FaFacebookF className="w-4 h-4" />
                                        )}
                                        {social.platform === "instagram" && (
                                            <FaInstagram className="w-4 h-4" />
                                        )}
                                        {social.platform === "linkedin" && (
                                            <FaLinkedinIn className="w-4 h-4" />
                                        )}
                                        {social.platform === "youtube" && (
                                            <FaYoutube className="w-4 h-4" />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Frequently Asked Questions Box */}
                        <div data-editor-fields="faqSection" className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                            <h4 className="text-sm font-bold text-slate-900 mb-1">
                                {faqSection?.title}
                            </h4>
                            <p className="text-sm text-slate-500 mb-4">
                                {faqSection?.description}
                            </p>

                            <a
                                href={faqSection?.buttonUrl || "/faq"}
                                data-editor-keep-click="true"
                                data-editor-nav="true"
                                onClick={(event) =>
                                    openEditorPage(
                                        event,
                                        faqSection?.buttonUrl || "/faq",
                                        "FAQ",
                                    )
                                }
                                className="w-full py-2.5 px-4 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span>{faqSection?.buttonText}</span> <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            </div>
    );

    const statsPart = (
        <div key="stats" className="mt-12 md:mt-16">
            <NgoStats1 data={custom?.stats} />
        </div>
    );

    const parts = [enquiryPart, statsPart];
    const stored: number[] = Array.isArray(custom?.partOrder)
        ? custom.partOrder.filter(
              (index: unknown): index is number => typeof index === "number",
          )
        : [0, 1];
    const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
    parts.forEach((part, index) => {
        if (part && !order.includes(index)) order.push(index);
    });
    const page = <>{order.map((index) => parts[index])}</>;
    return renderNgoEditorPart(editorPart, parts, page);
}

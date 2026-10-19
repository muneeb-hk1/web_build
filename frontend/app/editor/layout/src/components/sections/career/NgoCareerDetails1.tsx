"use client";

import Image from "next/image";
import Link from "next/link";
import {
    FiBriefcase,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiLayers,
    FiGlobe,
    FiMail,
    FiPhone,
    FiSend,
    FiUserCheck,
} from "react-icons/fi";
import { site, type NGOJobDetailsDataData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

const renderWhyJoinIcon = (iconName: string, className: string) => {
    return <EditableNgoIcon name={iconName} className={className} />;
};

const iconColors = [
    { text: "text-[#ff5a36]", bg: "bg-orange-50", border: "border-orange-100" },
    { text: "text-[#2ba048]", bg: "bg-emerald-50", border: "border-emerald-100" },
    { text: "text-[#03513a]", bg: "bg-teal-50", border: "border-teal-100" },
    { text: "text-[#6366f1]", bg: "bg-indigo-50", border: "border-indigo-100" },
];

export default function NgoCareerDetails1({ data: customData }: SectionProps) {
    const custom = customData as unknown as Partial<NGOJobDetailsDataData> | undefined;
    const data = {
        ...site.jobDetailsData,
        ...custom,
        banner: { ...site.jobDetailsData.banner, ...custom?.banner },
        title: custom?.title || site.jobDetailsData.title,
        meta: { ...site.jobDetailsData.meta, ...custom?.meta },
        employmentInfo: { ...site.jobDetailsData.employmentInfo, ...custom?.employmentInfo },
        aboutRole: custom?.aboutRole || site.jobDetailsData.aboutRole,
        whyJoinUs:
            Array.isArray(custom?.whyJoinUs) && custom.whyJoinUs.length
                ? custom.whyJoinUs
                : site.jobDetailsData.whyJoinUs,
        responsibilities:
            Array.isArray(custom?.responsibilities) && custom.responsibilities.length
                ? custom.responsibilities
                : site.jobDetailsData.responsibilities,
        requirements:
            Array.isArray(custom?.requirements) && custom.requirements.length
                ? custom.requirements
                : site.jobDetailsData.requirements,
        sidebar: { ...site.jobDetailsData.sidebar, ...custom?.sidebar },
        ctaBox: { ...site.jobDetailsData.ctaBox, ...custom?.ctaBox },
    };
    const {
        banner,
        title,
        meta,
        employmentInfo,
        aboutRole,
        responsibilities,
        requirements,
        whyJoinUs,
        sidebar,
        ctaBox,
    } = data;

    return (
        <>
            <div data-editor-section-label="Job Details" data-editor-fields="banner title meta employmentInfo aboutRole responsibilities requirements whyJoinUs sidebar ctaBox" className="w-full bg-[#fcfcfd] text-base max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Top Feature Hero Banner */}
                <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[380px] rounded-3xl overflow-hidden mb-8 shadow-sm">
                    <Image
                        src={banner?.bgImageUrl || "/categories/ngo/template1/happy-diverse-kinds-park.jpg"}
                        alt="Empower Educate Elevate"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        className="object-cover object-center"
                        data-editor-media
                        data-editor-media-type="image"
                        data-editor-media-src={banner?.bgImageUrl || "/categories/ngo/template1/happy-diverse-kinds-park.jpg"}
                    />
                </div>

                {/* Title & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#03513a]   ">
                            {title}
                        </h1>
                        <div className="flex items-center gap-4 mt-3 text-base text-gray-500 font-medium">
                            <span className="inline-flex items-center gap-2 text-[#03513a] font-semibold bg-[#eaf5eb] px-3.5 py-1.5 rounded-full text-sm">
                                <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                {meta?.type || "Fulltime"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-gray-500">
                                <FiClock className="w-5 h-5 text-gray-400 shrink-0" />
                                {meta?.posted || "Posted 2 days ago"}
                            </span>
                        </div>
                    </div>

                    <a
                        href={`mailto:${ctaBox?.email || "careers@example.org"}`}
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#03513a] text-white rounded-xl font-bold text-base hover:bg-[#1a0c2e] transition-all shadow-md self-start sm:self-center shrink-0"
                    >
                        <FiSend className="w-5 h-5" />
                        <span>Apply Now</span>
                    </a>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column (Job Info & Details) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Employment Information Card */}
                        {employmentInfo && (
                            <div className="bg-[#f8faf9] border border-gray-200/80 rounded-2xl p-6 sm:p-8">
                                <h3 className="text-lg sm:text-xl font-bold text-[#03513a] mb-6 border-b border-gray-200/80 pb-3">
                                    Employment Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 text-base">
                                    {/* Industry */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Industry
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.industry}
                                        </p>
                                    </div>

                                    {/* Job Level */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiLayers className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Job Level
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.jobLevel}
                                        </p>
                                    </div>

                                    {/* Job Type */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiUserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Job Type
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.jobType}
                                        </p>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiClock className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Experience
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.experience}
                                        </p>
                                    </div>

                                    {/* Salary */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Salary
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.salary}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Location
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.location}
                                        </p>
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Deadline
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.deadline}
                                        </p>
                                    </div>

                                    {/* Posted On */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-white text-[#2ba048] border border-gray-100 shadow-xs shrink-0">
                                            <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                                            Posted On
                                        </p>

                                        <p className="font-semibold text-[#1a0c2e] text-base mt-0.5 ">
                                            {employmentInfo.postedOn}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {aboutRole && (
                            <section className="space-y-3">
                                <h3 className="text-xl font-bold text-[#03513a]">About the Role</h3>
                                <p className="whitespace-pre-line text-base leading-relaxed text-gray-600">
                                    {aboutRole}
                                </p>
                            </section>
                        )}

                        {responsibilities && responsibilities.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-xl font-bold text-[#03513a]">Key Responsibilities</h3>
                                <ul className="space-y-3">
                                    {responsibilities.map((responsibility, index) => (
                                        <li key={index} className="flex items-start gap-3 text-base leading-relaxed text-gray-600">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2ba048]" />
                                            <span>{responsibility}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Qualifications & Skills */}
                        {requirements && requirements.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-xl font-bold text-[#03513a]">
                                    Qualifications & Skills
                                </h3>
                                <ul className="space-y-3">
                                    {requirements.map((req, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-base text-gray-600 leading-relaxed"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-[#ff5a36] mt-2 shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Why Join Us? */}
                        {whyJoinUs && whyJoinUs.length > 0 && (
                            <section className="space-y-4 pt-4">
                                <h3 className="text-xl font-bold text-[#03513a]">
                                    Why Join Us?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {whyJoinUs.map((item, idx) => {
                                        // Cycle through the color variants based on index
                                        const color = iconColors[idx % iconColors.length];

                                        return (
                                            <div
                                                key={idx}
                                                data-editor-item-type="JobWhyJoin"
                                                data-editor-item-label={item.title || "Why join us"}
                                                className="bg-[#fdfbf9] border border-gray-200/70 rounded-2xl p-5 text-center flex flex-col items-center"
                                            >
                                                <div
                                                    className={`w-12 h-12 rounded-full ${color.bg} ${color.text} ${color.border} shadow-xs flex items-center justify-center mb-3.5 border`}
                                                >
                                                    {renderWhyJoinIcon(
                                                        item.icon,
                                                        "w-6 h-6 sm:w-7 sm:h-7",
                                                    )}
                                                </div>
                                                <h4 className="text-sm sm:text-base font-bold text-[#1a0c2e] mb-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm sm:text-sm text-gray-500 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* CTA Box */}
                        {ctaBox && (
                            <div className="bg-[#eaf5eb] border border-[#2ba048]/20 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#03513a] text-white flex items-center justify-center shrink-0 mt-0.5">
                                    <FiSend className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base sm:text-lg font-bold text-[#1a0c2e]">
                                        {ctaBox.title}
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
                                        {ctaBox.text}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Organization Info Box */}
                        {sidebar?.organization && (
                            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
                                <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                                        <Image
                                            src={sidebar.organization.image}
                                            alt={`${sidebar.organization.name} logo`}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                            data-editor-media
                                            data-editor-media-type="image"
                                            data-editor-media-src={sidebar.organization.image}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-[#1a0c2e]">
                                            {sidebar.organization.name}
                                        </h4>
                                        <p className="text-sm sm:text-sm text-gray-500">
                                            {sidebar.organization.tagline}
                                        </p>
                                        <Link
                                            href={sidebar.organization.viewAllJobsUrl}
                                            className="text-sm sm:text-sm text-[#2ba048] font-bold hover:underline inline-block mt-0.5"
                                        >
                                            View all jobs
                                        </Link>
                                    </div>
                                </div>

                                {/* Map Mockup */}
                                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200">
                                    {sidebar.organization.mapLocation?.iframeUrl ? (
                                        <iframe
                                            src={sidebar.organization.mapLocation.iframeUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Map location for ${sidebar.organization.mapLocation.address || sidebar.organization.name}`}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                            Map location not available
                                        </div>
                                    )}
                                </div>

                                {/* Contact List */}
                                <div className="space-y-3.5 text-sm sm:text-base text-gray-600 pt-1">
                                    <div className="flex items-start gap-3">
                                        <FiMapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{sidebar.organization.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>{sidebar.organization.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiMail className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <a
                                            href={`mailto:${sidebar.organization.email}`}
                                            className="hover:underline text-gray-700 font-medium"
                                        >
                                            {sidebar.organization.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiGlobe className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <a
                                            href={`https://${sidebar.organization.website}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:underline text-gray-700 font-medium"
                                        >
                                            {sidebar.organization.website}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Similar Jobs List */}
                        {sidebar?.similarJobs && sidebar.similarJobs.length > 0 && (
                            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
                                <h4 className="text-lg font-bold text-[#1a0c2e] border-b border-gray-100 pb-3">
                                    Similar Jobs
                                </h4>

                                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:block lg:space-y-4">
                                    {sidebar.similarJobs.map((job) => (
                                        <a
                                            key={job.id}
                                            href={job.href}
                                            className="group block border-b border-gray-100 last:border-b-0 pb-3.5 last:pb-0 hover:bg-gray-50/50 transition-colors p-2 -mx-2 rounded-xl"
                                        >
                                            <h5 className="text-base font-bold text-[#1a0c2e] group-hover:text-[#2ba048] transition-colors">
                                                {job.title}
                                            </h5>

                                            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-sm text-gray-500 mt-1">
                                                <span>{job.type}</span>
                                                <span>•</span>
                                                <span>{job.posted}</span>
                                            </div>

                                            <p className="text-sm font-semibold text-[#03513a] mt-1">
                                                {job.salary}
                                            </p>

                                            <p className="text-sm sm:text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                                <FiMapPin className="w-4 h-4" />
                                                {job.location}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </>
    );
}

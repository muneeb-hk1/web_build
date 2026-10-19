// @ts-nocheck
"use client";
import { usePetSite } from "../pet/petSite";

import React from "react";
import Image from "../pet/PetImage";
import Link from "../pet/PetLink";
import { motion } from "framer-motion";
import { FadeIn } from "../pet/animations";
import {
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Heart,
    Shield,
} from "lucide-react";
import { FaPaw } from "react-icons/fa";
import { MdEmail } from "react-icons/md";



const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

export default function Footer() {
const petData = usePetSite();

    const { footer } = petData;

    const renderSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "facebook":
                return <FacebookIcon className="w-4 h-4 md:w-5 md:h-5" />;
            case "instagram":
                return <InstagramIcon className="w-4 h-4 md:w-5 md:h-5" />;
            case "twitter":
                return <TwitterIcon className="w-4 h-4 md:w-5 md:h-5" />;
            case "youtube":
                return <YoutubeIcon className="w-4 h-4 md:w-5 md:h-5" />;
            case "linkedin":
                return <LinkedinIcon className="w-4 h-4 md:w-5 md:h-5" />;
            default:
                return null;
        }
    };

    const renderCopyright = (copyrightText: string) => {
        const brandName = petData.brand?.name || "Dodo Cares";
        if (copyrightText.includes(brandName)) {
            const parts = copyrightText.split(brandName);
            return (
                <>
                    {parts[0]}
                    <span className="text-[#F37021] font-semibold">{brandName}</span>
                    {parts.slice(1).join(brandName)}
                </>
            );
        }
        return copyrightText;
    };

    return (
        <footer className="w-full bg-white font-sans">
            {/* Upper Main Footer Section */}
            <FadeIn direction="up" delay={0.05}>
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 mt-2 sm:mt-4 md:mt-6 lg:mt-8 sm:pb-12 lg:pb-14">
                    <div className="px-0">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-x-4 gap-y-6 sm:gap-6 lg:gap-5 xl:gap-8">
                            {/* Column 1: Brand Info */}
                            <div className="col-span-2 sm:col-span-2 md:col-span-6 lg:col-span-3 xl:col-span-3 flex flex-col justify-between">
                                <div>
                                    <Link href="/" className="inline-block ">
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <Image
                                                src={footer.brand.logo}
                                                alt={footer.brand.alt}
                                                width={300}
                                                height={100}
                                                priority
                                                className="w-44 sm:w-52 md:w-56 lg:w-[190px] xl:w-[230px] h-auto object-contain transition-transform duration-300"
                                            />
                                        </motion.div>
                                    </Link>
                                    <p className="text-[#2C1810] text-sm sm:text-base lg:text-[14px] xl:text-base text-left max-w-xl lg:max-w-none leading-relaxed mb-4">
                                        {footer.brand.description}
                                    </p>
                                </div>

                                {/* Feature Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-3.5 xl:gap-5 space-y-0">
                                    <div className="flex items-center gap-3 sm:gap-3.5 lg:gap-3 xl:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0 text-[#F37021]">
                                            <FaPaw className="w-6 h-6 text-[#F37021]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#2C1810] font-bold text-sm sm:text-base lg:text-[14px] xl:text-[17px] leading-snug">
                                                {footer.brand.features[0]?.title}
                                            </h4>
                                            <p className="text-neutral-500 text-[11px] sm:text-sm lg:text-[12px] xl:text-sm mt-0.5 font-medium leading-tight">
                                                {footer.brand.features[0]?.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-3.5 lg:gap-3 xl:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0 text-[#F37021]">
                                            <Shield className="w-6 h-6 text-[#F37021]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#2C1810] font-bold text-sm sm:text-base lg:text-[14px] xl:text-[17px] leading-snug">
                                                {footer.brand.features[1]?.title}
                                            </h4>
                                            <p className="text-neutral-500 text-[11px] sm:text-sm lg:text-[12px] xl:text-sm mt-0.5 font-medium leading-tight">
                                                {footer.brand.features[1]?.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Quick Links */}
                            <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 mt-2 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
                                <h3 className="text-base sm:text-xl lg:text-xl xl:text-2xl font-bold text-[#2C1810] mb-1.5 sm:mb-2">
                                    {footer.quickLinks.title}
                                </h3>
                                <div className="w-8 sm:w-10 h-[3px] bg-[#F37021] rounded-full mb-3 sm:mb-6" />
                                <ul className="space-y-2.5 sm:space-y-4" data-footer-link-list="" data-footer-link-group="quickLinks.links">
                                    {footer.quickLinks.links.map((link: FooterLink, index: number) => (
                                        <li key={index} data-footer-link-item="" data-footer-link-group="quickLinks.links" data-footer-link-index={index}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center text-sm sm:text-base lg:text-[16px] xl:text-[17px] text-[#2C1810] hover:text-[#F37021] transition-colors group"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#F37021] transition-transform group-hover:translate-x-1 shrink-0" />
                                                <span className="truncate">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 3: Our Services */}
                            <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 mt-2 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
                                <h3 className="text-base sm:text-xl lg:text-xl xl:text-2xl font-bold text-[#2C1810] mb-1.5 sm:mb-2">
                                    {footer.ourCauses.title}
                                </h3>
                                <div className="w-8 sm:w-10 h-[3px] bg-[#F37021] rounded-full mb-3 sm:mb-6" />
                                <ul className="space-y-2.5 sm:space-y-4" data-footer-link-list="" data-footer-link-group="ourCauses.links">
                                    {footer.ourCauses.links.map((link: FooterLink, index: number) => (
                                        <li key={index} data-footer-link-item="" data-footer-link-group="ourCauses.links" data-footer-link-index={index}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center text-sm sm:text-base lg:text-[16px] xl:text-[17px] text-[#2C1810] hover:text-[#F37021] transition-colors group"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#F37021] transition-transform group-hover:translate-x-1 shrink-0" />
                                                <span className="truncate">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 4: Useful Links */}
                            <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 mt-2 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
                                <h3 className="text-base sm:text-xl lg:text-xl xl:text-2xl font-bold text-[#2C1810] mb-1.5 sm:mb-2">
                                    {footer.usefullinks.title}
                                </h3>
                                <div className="w-8 sm:w-10 h-[3px] bg-[#F37021] rounded-full mb-3 sm:mb-6" />
                                <ul className="grid grid-cols-2 sm:block gap-2.5 sm:space-y-4" data-footer-link-list="" data-footer-link-group="usefullinks.links">
                                    {footer.usefullinks.links.map((link: FooterLink, index: number) => (
                                        <li key={index} data-footer-link-item="" data-footer-link-group="usefullinks.links" data-footer-link-index={index}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center text-sm sm:text-base lg:text-[16px] xl:text-[17px] text-[#2C1810] hover:text-[#F37021] transition-colors group"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#F37021] transition-transform group-hover:translate-x-1 shrink-0" />
                                                <span className="truncate">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 5: Contact Info - Full width at bottom on mobile */}
                            <div className="col-span-2 sm:col-span-2 md:col-span-6 lg:col-span-3 xl:col-span-3 mt-3 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
                                <h3 className="text-base sm:text-xl lg:text-xl xl:text-2xl font-bold text-[#2C1810] mb-1.5 sm:mb-2">
                                    {footer.contactInfo.title}
                                </h3>
                                <div className="w-8 sm:w-10 h-[3px] bg-[#F37021] rounded-full mb-3 sm:mb-6" />

                                <div className="flex flex-col gap-2.5 sm:gap-0">
                                    {/* Address */}
                                    <div className="flex items-start gap-2.5 sm:gap-3.5 lg:gap-3 xl:gap-4">
                                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0 text-[#F37021] mt-0.5">
                                            <MapPin className="w-8 h-8 fill-[#F37021] text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[#2C1810] font-bold text-sm sm:text-base lg:text-[15px] xl:text-lg mb-0.5">
                                                {footer.contactInfo.address.title}
                                            </h4>
                                            {footer.contactInfo.address.lines.map((line: string, i: number) => (
                                                <p key={i} className="text-neutral-600 text-sm sm:text-sm lg:text-[13px] xl:text-[15px] font-medium leading-relaxed">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-neutral-100 my-2 sm:my-3.5" />

                                    {/* Phone */}
                                    <div className="flex items-start gap-2.5 sm:gap-3.5 lg:gap-3 xl:gap-4">
                                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0 text-[#F37021] mt-0.5">
                                            <Phone className="w-6 h-6 fill-[#F37021] text-[#F37021]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[#2C1810] font-bold text-sm sm:text-base lg:text-[15px] xl:text-lg mb-0.5">
                                                {footer.contactInfo.phone.title}
                                            </h4>
                                            {footer.contactInfo.phone.numbers.map((num: string, i: number) => (
                                                <p key={i} className="text-neutral-600 text-sm sm:text-sm lg:text-[13px] xl:text-[15px] font-medium leading-relaxed">
                                                    {num}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-neutral-100 my-2 sm:my-3.5" />

                                    {/* Email */}
                                    <div className="flex items-start gap-2.5 sm:gap-3.5 lg:gap-3 xl:gap-4">
                                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0 text-[#F37021] mt-0.5">
                                            <MdEmail className="w-6 h-6 text-[#F37021]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[#2C1810] font-bold text-sm sm:text-base lg:text-[15px] xl:text-lg mb-0.5">
                                                {footer.contactInfo.email.title}
                                            </h4>
                                            {footer.contactInfo.email.emails.map((email: string, i: number) => (
                                                <p key={i} className="text-neutral-600 text-sm sm:text-sm lg:text-[13px] xl:text-[15px] font-medium leading-relaxed break-all sm:break-normal">
                                                    {email}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Bottom Bar Section */}
            <div className="bg-[#0A101D] text-neutral-200 py-1 sm:py-1.5 lg:py-2 relative overflow-hidden border-t border-neutral-800/80">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-4 relative z-10 text-center lg:text-left">

                        {/* Left: Copyright & Divider & Made with love */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 xl:gap-5 text-sm md:text-[12px] lg:text-[15px] xl:text-[17px] font-medium text-neutral-200">
                            <div className="text-center sm:text-left leading-normal max-w-full">
                                {renderCopyright(footer.bottomBar.copyright)}
                            </div>

                            {/* Vertical Divider Line */}
                            <div className="hidden sm:block h-5 w-[2px] bg-neutral-700/80 shrink-0" />

                            {/* Made with love for pets */}
                            <div className="flex items-center gap-2 whitespace-nowrap shrink-0 text-sm md:text-[12px] lg:text-[15px] xl:text-[17px]">
                                <Heart className="w-5 h-5 text-[#F37021] stroke-[2.2] fill-none " />
                                <span>{footer.bottomBar.loveText}</span>
                                <Heart className="w-5 h-5 text-[#F37021] stroke-[2.2] fill-none" />
                            </div>
                        </div>

                        {/* Right: Follow Us & Social Icons & Paw Watermark */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-3 shrink-0 max-w-full">
                            <span className="text-sm md:text-[12px] lg:text-[15px] xl:text-[17px] font-medium text-neutral-200 whitespace-nowrap">
                                {footer.bottomBar.followText}
                            </span>
                            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                                {footer.bottomBar.socialLinks.map((social, index: number) => (
                                    <motion.a
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-7.5 h-7.5 sm:w-8 sm:h-8 lg:w-9.5 lg:h-9.5 rounded-full border border-neutral-600/80 flex items-center justify-center text-white hover:bg-[#F37021] hover:border-[#F37021] transition-colors duration-200 shadow-xs shrink-0"
                                        aria-label={social.platform}
                                    >
                                        {renderSocialIcon(social.platform)}
                                    </motion.a>
                                ))}
                            </div>

                            {/* Translucent Paw Watermark */}
                            <div className="hidden sm:flex items-center justify-center opacity-30 text-white/80 ml-2 sm:ml-3 xl:ml-4 shrink-0">
                                <FaPaw className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-13 xl:h-13" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
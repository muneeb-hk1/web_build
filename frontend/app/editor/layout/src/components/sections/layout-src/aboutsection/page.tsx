"use client";

/* ===============================
   Imports
================================ */

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { about } = siteData;

/* ===============================
   Main Component
================================ */

export default function AboutSection() {
    return (
        <section className="relative overflow-hidden bg-white py-10 md:py-12 lg:py-16">
            <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 xl:gap-20">
                    
                    {/* ================= LEFT (Image Side) ================= */}
                    <div className="relative mx-auto w-full max-w-[560px] pl-4 pt-4 lg:pl-8 lg:pt-8">
                        
                        {/* Green Border offset to the top-left */}
                        <div className="hidden lg:block absolute top-0 left-0 w-[85%] h-[85%] border-t-[8px] border-l-[8px] border-[#0A7A51] z-0"></div>

                        {/* Dot Pattern - behind image at bottom right */}
                        <div className="hidden lg:block absolute bottom-0 right-8 z-0">
                            <div className="grid grid-cols-6 gap-[8px]">
                                {Array.from({ length: 36 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="w-[5px] h-[5px] rounded-full bg-[#D7D7D7]"
                                    ></span>
                                ))}
                            </div>
                        </div>

                        {/* Image Container with Diagonal Cut at Bottom */}
                        <div 
                            className="relative z-10 w-full h-[550px] overflow-hidden"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)" }}
                        >
                            <Image
                                src="/banner/aboutimg.png"
                                alt="About Cleaning Service"
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-w-768px) 100vw, 560px"
                            />
                        </div>

                        {/* Experience Badge ("30 Years") */}
                        <div className="absolute top-[48%] -right-4 md:-right-8 -translate-y-1/2 z-30">
                            <div 
                                className="bg-[#0A7A51] text-white w-[105px] h-[135px] flex flex-col justify-center items-center shadow-lg"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
                                }}
                            >
                                <h2 className="text-[44px] font-bold leading-none tracking-tight">
                                    {about.experienceYears}
                                </h2>
                                <p className="text-[15px] font-semibold tracking-wide mt-1">
                                    {about.experienceText}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* ================= RIGHT (Content Side) ================= */}
                    <div className="max-w-[620px] lg:pl-6">
                        
                        <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                            {about.subtitle}
                        </span>

                        {/* Heading exactly split like the target design */}
                        <h2 className="mt-2 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight">
                            <span className="whitespace-nowrap">{about.titleLine1}</span> <br className="hidden sm:block" />
                            {about.titleLine2}
                        </h2>

                        <p className="mt-4 text-[#6B7280] text-[15px] leading-[26px]">
                            {about.description1}
                        </p>

                        <p className="mt-3 text-[#6B7280] text-[15px] leading-[26px]">
                            {about.description2}
                        </p>

                        {/* Feature Boxes exactly matching the target design */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                            {about.features.map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center gap-3 bg-[#EAF2EE] rounded-full px-5 py-3.5 hover:bg-[#0A7A51] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {/* Small circle icon with white Check */}
                                    <div className="w-7 h-7 rounded-full bg-[#0A7A51] group-hover:bg-white flex items-center justify-center transition-colors duration-300 shrink-0">
                                        <Check
                                            size={16}
                                            className="text-white group-hover:text-[#0A7A51] stroke-[3]"
                                        />
                                    </div>

                                    <span className="font-semibold text-[#0A7A51] group-hover:text-white transition-colors duration-300 text-[14px]">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Read More Button with matching padding and font */}
                        <Link href={about.buttonLink || "#"}>
                            <button className="mt-7 bg-[#0A7A51] hover:bg-[#0B2942] text-white font-bold text-[15px] py-3.5 px-9 rounded-[8px] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:scale-105 active:scale-95">
                                {about.buttonText}
                            </button>
                        </Link>

                    </div>

                </div>
            </div>
        </section>
    );
}
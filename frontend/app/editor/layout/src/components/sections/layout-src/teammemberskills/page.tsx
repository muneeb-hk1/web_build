"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { teamDetail } = siteData;

export default function TeamMemberSkills() {
    const { skillsSection } = teamDetail;

    return (
        <section className="py-10 md:py-12 bg-white">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
                    
                    {/* Left: Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-[48%] relative z-10 lg:pr-10"
                    >
                        <div className="absolute top-[-20px] left-[-20px] lg:top-[-40px] lg:left-[-40px] w-full h-[100%] lg:h-[110%] bg-[#f9f9f9] -z-10"></div>
                        <div className="relative w-full aspect-[4/3] bg-gray-200">
                            <Image 
                                src={skillsSection.image} 
                                alt={skillsSection.title}
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <div className="w-full md:w-[50%] lg:w-[45%] lg:ml-auto">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h4 className="text-[#0D2235] font-bold text-[14px] md:text-[15px] tracking-wide mb-3 flex items-center">
                                <span className="bg-[#FFD15B] text-[#0D2235] px-2 py-0.5 rounded-sm mr-2">Our</span> work Experience
                            </h4>
                            
                            <h2 className="text-[#0D2235] text-[38px] md:text-[48px] lg:text-[54px] font-extrabold leading-[1.1] mb-4">
                                {skillsSection.title}
                            </h2>
                            
                            <p className="text-gray-500 text-[15px] md:text-[16px] leading-[1.8] mb-8 pr-0 lg:pr-4">
                                {skillsSection.description}
                            </p>

                            <div className="space-y-8">
                                {skillsSection.skills.map((skill, index) => (
                                    <div key={index} className="relative">
                                        <h5 className="text-[#0D2235] font-bold text-[16px] mb-4">{skill.title}</h5>
                                        
                                        <div className="w-full h-[6px] bg-[#E8EAEB] relative">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.percentage}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                                className="absolute top-0 left-0 h-full bg-[#16A361]"
                                            >
                                                {/* Slant Marker */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[16px] bg-[#16A361] rotate-[15deg]"></div>
                                                
                                                {/* Percentage Text */}
                                                <span className="absolute right-0 bottom-full mb-3 text-[#16A361] font-bold text-[15px] translate-x-1/2">
                                                    {skill.percentage}%
                                                </span>
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

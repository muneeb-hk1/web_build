"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Leaf, ShieldCheck, FileBadge, Star } from 'lucide-react';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { awards } = siteData;

const iconMap: Record<string, React.ReactNode> = {
    "award": (
        <div className="relative flex items-center justify-center w-[48px] h-[48px]">
            <Award size={48} className="text-[#398E3D]" strokeWidth={1.5} />
            <Star size={16} className="text-[#398E3D] absolute top-[11px]" fill="#398E3D" strokeWidth={0} />
        </div>
    ),
    "shield": (
        <div className="relative flex items-center justify-center w-[48px] h-[48px]">
            <Shield size={48} className="text-[#398E3D]" strokeWidth={1.5} />
            <Leaf size={22} className="text-[#398E3D] absolute" strokeWidth={1.5} fill="#398E3D" />
        </div>
    ),
    "shield-check": <ShieldCheck size={48} className="text-[#398E3D]" strokeWidth={1.5} />,
    "file-badge": <FileBadge size={48} className="text-[#398E3D]" strokeWidth={1.5} />
};

export default function AwardsSection({
    subtitle,
    titleLine1,
    titleHighlight,
    description,
    items,
}: {
    subtitle?: string;
    titleLine1?: string;
    titleHighlight?: string;
    description?: string;
    items?: typeof awards.items;
}) {
    const mappedAwards = (items?.length ? items : awards.items).map(item => ({
        ...item,
        icon: iconMap[item.iconType] || <Award size={48} className="text-[#398E3D]" strokeWidth={1.5} />
    }));
    return (
        <section className="pt-8 pb-14 md:pt-10 md:pb-16 bg-[#F5FAED] relative overflow-hidden z-0">
            {/* Background elements */}
            <div className="absolute top-0 right-0 opacity-40 mix-blend-multiply w-1/3 h-[400px] pointer-events-none -z-10 bg-[#e7f5d3] rounded-bl-[100%] blur-3xl"></div>
            {/* Left background shape approximation */}
            <div className="absolute top-0 left-0 opacity-40 w-1/4 h-[300px] pointer-events-none -z-10 bg-[#e7f5d3] rounded-br-[100%] blur-3xl"></div>

            <div className="max-w-[1320px] mx-auto px-4 lg:px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <div className="flex items-center gap-1">
                            <div className="w-[4px] h-[4px] rounded-full bg-[#398E3D]"></div>
                            <div className="w-[40px] h-[1.5px] bg-[#398E3D]"></div>
                        </div>
                        <div className="bg-[#398E3D] text-white px-5 py-2 rounded-sm flex items-center gap-2 text-[13px] font-bold tracking-wider uppercase shadow-sm">
                            <ShieldCheck size={16} />
                            {subtitle || awards.subtitle}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-[40px] h-[1.5px] bg-[#398E3D]"></div>
                            <div className="w-[4px] h-[4px] rounded-full bg-[#398E3D]"></div>
                        </div>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#2A2A2A] text-[32px] md:text-[44px] font-semibold tracking-tight leading-[1.2] mb-6"
                    >
                        {titleLine1 || awards.titleLine1} <span className="text-[#398E3D]">{titleHighlight || awards.titleHighlight}</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="flex items-center justify-center gap-4 mb-6"
                    >
                        <div className="w-[80px] h-[1.5px] bg-[#398E3D]/40"></div>
                        <div className="relative flex items-center justify-center w-[24px] h-[24px]">
                             <Leaf size={18} className="text-[#398E3D] absolute left-0 bottom-0 -rotate-12" fill="#398E3D" />
                             <Leaf size={14} className="text-[#398E3D] absolute right-0 top-0 rotate-45" fill="#398E3D" />
                        </div>
                        <div className="w-[80px] h-[1.5px] bg-[#398E3D]/40"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative inline-block w-full max-w-lg mx-auto"
                    >
                        <div className="absolute -left-12 -top-6 text-[#D4E9D5] opacity-80">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" /></svg>
                        </div>
                        <div className="absolute -left-2 -top-0 text-[#D4E9D5] opacity-80">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" /></svg>
                        </div>
                        <p className="text-[#555555] text-[16px] md:text-[17px] leading-[1.8] relative z-10 px-8">
                            {description || awards.description}
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                    {mappedAwards.map((award, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[20px] p-8 md:p-10 text-center shadow-[0_5px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div className="w-[100px] h-[100px] mx-auto rounded-full bg-[#EAF5EB] flex items-center justify-center mb-8">
                                {award.icon}
                            </div>
                            <h4 className="text-[#0D2235] text-[18px] font-bold mb-4 leading-[1.4]">
                                {award.title}
                            </h4>
                            <div className="w-[20px] h-[1.5px] bg-[#398E3D] mx-auto mb-4 rounded-full"></div>
                            <p className="text-[#666666] text-[14px] leading-[1.8]">
                                {award.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

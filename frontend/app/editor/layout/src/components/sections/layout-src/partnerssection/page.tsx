"use client";

import { motion } from "framer-motion";
import { 
    Leaf, 
    Home, 
    Building2, 
    Sparkles, 
    Building, 
    BarChart3 
} from "lucide-react";

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { partners } = siteData;

const iconMap: Record<string, any> = {
    "leaf": Leaf,
    "home": Home,
    "building-2": Building2,
    "sparkles": Sparkles,
    "building": Building,
    "bar-chart-3": BarChart3
};

export default function PartnersSection({
    subtitle,
    title,
    description,
    items,
}: {
    subtitle?: string;
    title?: string;
    description?: string;
    items?: typeof partners.items;
}) {
    const heading = subtitle || partners.subtitle;
    const headingTitle = title || partners.title;
    const desc = description || partners.description;
    const partnerItems = items?.length ? items : partners.items;

    return (
        <section className="relative bg-[#F8F9FA] pt-4 pb-8 lg:pt-6 lg:pb-10 overflow-hidden">
            
            {/* Background Wavy Mesh - Left Side */}
            <div className="absolute top-0 left-0 w-[50%] h-full opacity-60 pointer-events-none">
                <svg viewBox="0 0 800 600" className="w-full h-full object-cover">
                    <defs>
                        <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#fadeLeft)" strokeWidth="1.5" strokeDasharray="2 4" fill="none">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <path 
                                key={i} 
                                d={`M0,${250 + i * 10} C250,${100 + i * 20} 500,${450 - i * 10} 800,${300}`} 
                            />
                        ))}
                    </g>
                </svg>
            </div>

            {/* Background Wavy Mesh - Right Side */}
            <div className="absolute top-0 right-0 w-[50%] h-full opacity-60 pointer-events-none scale-x-[-1]">
                <svg viewBox="0 0 800 600" className="w-full h-full object-cover">
                    <defs>
                        <linearGradient id="fadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#fadeRight)" strokeWidth="1.5" strokeDasharray="2 4" fill="none">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <path 
                                key={i} 
                                d={`M0,${250 + i * 10} C250,${100 + i * 20} 500,${450 - i * 10} 800,${300}`} 
                            />
                        ))}
                    </g>
                </svg>
            </div>

            <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                            {heading}
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight mb-4"
                    >
                        {headingTitle}
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#6B7280] text-[15px] md:text-[17px] leading-relaxed max-w-lg mx-auto"
                    >
                        {desc}
                    </motion.p>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
                    {partnerItems.map((partner, index) => {
                        const Icon = iconMap[partner.iconName] || Building;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white border border-gray-100 rounded-[12px] px-5 py-4 flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
                                style={{ borderBottom: `3.5px solid ${partner.color}` }}
                            >
                                <Icon size={44} strokeWidth={1.5} style={{ color: partner.color }} className="transition-transform duration-300 group-hover:scale-110 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="font-extrabold text-[#0D2235] text-[16px] leading-tight group-hover:text-black transition-colors duration-300">
                                        {partner.name}
                                    </span>
                                    <span 
                                        className="text-[11px] font-bold tracking-[0.1em] uppercase mt-0.5 transition-colors duration-300" 
                                        style={{ color: partner.color }}
                                    >
                                        {partner.category}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

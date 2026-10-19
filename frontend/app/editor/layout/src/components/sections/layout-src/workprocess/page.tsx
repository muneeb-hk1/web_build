"use client";

import { motion } from "framer-motion";
import { 
    Headset,
    MessageSquareText,
    ClipboardList,
    Home,
    SprayCan,
    Sparkles,
    Search,
    ChevronRight,
    Wand2
} from "lucide-react";

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { workProcess } = siteData;

const iconMap: Record<string, any> = {
    "headset": Headset,
    "message-square-text": MessageSquareText,
    "clipboard-list": ClipboardList,
    "home": Home,
    "spray-can": SprayCan,
    "sparkles": Sparkles,
    "search": Search
};

const renderIcon = (index: number, mainIconName: string, subIconName: string) => {
    const MainIcon = iconMap[mainIconName] || Home;
    const SubIcon = iconMap[subIconName] || Sparkles;

    if (index === 0) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <MainIcon size={56} className="stroke-[1.2] text-[#1F2937] group-hover:text-[#1FA463] transition-colors duration-300" />
                <SubIcon size={22} className="absolute right-7 top-8 stroke-[2] text-[#1FA463]" />
            </div>
        );
    } else if (index === 1) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <MainIcon size={56} className="stroke-[1.2] text-[#1F2937] group-hover:text-[#1FA463] transition-colors duration-300" />
                <div className="absolute right-5 bottom-6 bg-[#FAFCFB] group-hover:bg-white rounded-sm p-0.5 transition-colors duration-300">
                    <SubIcon size={22} className="stroke-[2.5] text-[#1FA463]" />
                </div>
            </div>
        );
    } else if (index === 2) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <MainIcon size={56} className="stroke-[1.2] text-[#1F2937] group-hover:text-[#1FA463] transition-colors duration-300" />
                <SubIcon size={24} className="absolute right-6 top-6 stroke-[2] text-[#1FA463]" />
            </div>
        );
    } else if (index === 3) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <MainIcon size={56} className="stroke-[1.2] text-[#1F2937] group-hover:text-[#1FA463] transition-colors duration-300" />
                <div className="absolute right-3 bottom-5 bg-[#FAFCFB] group-hover:bg-white rounded-full p-0.5 transition-colors duration-300">
                    <SubIcon size={24} className="stroke-[2.5] text-[#1FA463]" />
                </div>
            </div>
        );
    } else {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <MainIcon size={56} className="stroke-[1.2] text-[#1F2937] group-hover:text-[#1FA463] transition-colors duration-300" />
                <SubIcon size={28} className="absolute right-4 top-5 stroke-[2] text-[#1FA463]" />
            </div>
        );
    }
};

export default function WorkProcess() {
    return (
        <section className="relative bg-white pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden">
            
            {/* Background Decor: Bottom Wave */}
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
                <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
                    <path fill="#F4F8F5" d="M0,60 C320,130 420,-10 840,60 C1140,110 1340,30 1440,10 L1440,120 L0,120 Z"></path>
                </svg>
            </div>

            {/* Background Decor: Floating Bubbles Top Right */}
            <div className="absolute top-10 right-20 w-12 h-12 rounded-full border-[1.5px] border-[#1FA463] opacity-10 pointer-events-none"></div>
            <div className="absolute top-24 right-32 w-5 h-5 rounded-full bg-[#1FA463] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute top-32 right-12 w-8 h-8 rounded-full border border-[#1FA463] opacity-10 pointer-events-none"></div>

            {/* Background Decor Elements: Dot Grids */}
            <div className="absolute top-24 left-10 hidden lg:block opacity-[0.15] z-0 pointer-events-none">
                <div className="grid grid-cols-4 gap-2.5">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                    ))}
                </div>
            </div>
            
            <div className="absolute bottom-32 right-10 hidden lg:block opacity-[0.15] z-0 pointer-events-none">
                <div className="grid grid-cols-4 gap-2.5">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                            {workProcess.subtitle}
                        </span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight"
                    >
                        {workProcess.title}
                    </motion.h2>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 my-4"
                    >
                        <div className="h-[1.5px] w-12 bg-[#E5E7EB]"></div>
                        <Home size={26} className="text-[#1FA463]" />
                        <div className="h-[1.5px] w-12 bg-[#E5E7EB]"></div>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-[#6B7280] text-[16px] md:text-[18px] leading-relaxed max-w-lg mx-auto"
                    >
                        {workProcess.description}
                    </motion.p>
                </div>

                {/* Steps Timeline - Reduced Max Width to bring icons closer */}
                <div className="max-w-[1150px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
                    {workProcess.steps.map((step, index) => {
                        return (
                            <div key={index} className="group relative flex-1 w-full flex flex-col items-center cursor-pointer">
                                
                                {/* Connector Line (Desktop Only) */}
                                {index < workProcess.steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-[65px] left-[50%] w-full items-center justify-center z-0 px-[75px]">
                                        <div className="w-full border-t-[2px] border-dashed border-[#D1D5DB] transition-colors duration-300 group-hover:border-[#1FA463]"></div>
                                        <ChevronRight className="text-[#1FA463] -ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1" size={20} strokeWidth={3} />
                                    </div>
                                )}

                                {/* Icon Circle - Larger Size & Thin Border */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                                    className="relative z-10 w-[130px] h-[130px] rounded-full bg-[#FAFCFB] border border-[#1FA463]/30 shadow-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-[#1FA463] group-hover:bg-white group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(84,138,84,0.15)]"
                                >
                                    {renderIcon(index, step.mainIcon, step.subIcon)}
                                    
                                    {/* Number Badge */}
                                    <div className="absolute -bottom-3 w-[30px] h-[30px] rounded-full bg-[#1FA463] text-white flex items-center justify-center text-[12px] font-bold border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        {step.num}
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index + 0.2 }}
                                    className="text-center px-2 transition-all duration-300 group-hover:-translate-y-1"
                                >
                                    <h4 className="text-[#1F2937] font-extrabold text-[13px] md:text-[14px] tracking-wide uppercase transition-colors duration-300 group-hover:text-[#1FA463]">
                                        {step.title}
                                    </h4>
                                    
                                    {/* Small Divider */}
                                    <div className="w-[25px] h-[3px] bg-[#1FA463] mx-auto mt-3 mb-4 rounded-full transition-all duration-300 group-hover:w-[45px]"></div>
                                    
                                    <p className="text-[#6B7280] text-[12px] md:text-[13px] leading-relaxed max-w-[200px] mx-auto transition-colors duration-300 group-hover:text-[#1F2937]">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { project } = siteData;
const projects = project.projects;

export default function ProjectSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current && scrollRef.current.children.length > 0) {
            const itemWidth = scrollRef.current.children[0].clientWidth + 24; // 24px gap
            scrollRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current && scrollRef.current.children.length > 0) {
            const itemWidth = scrollRef.current.children[0].clientWidth + 24;
            scrollRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
    };

    // Duplicate the projects array multiple times to create an "unlimited" scrolling effect
    const displayProjects = Array(20).fill(projects).flat();

    return (
        <section className="bg-[#138A56] py-20 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <motion.h4 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-white font-semibold text-[16px] md:text-[17px] mb-3"
                        >
                            {project.subtitle}
                        </motion.h4>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white text-[38px] md:text-[46px] lg:text-[48px] font-semibold leading-[1.15] tracking-tight"
                        >
                            {project.title}
                        </motion.h2>
                    </div>

                    {/* Navigation Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 shrink-0 mb-1 md:mb-2"
                    >
                        <button 
                            onClick={scrollLeft}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#138A56] hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                        <button 
                            onClick={scrollRight}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#138A56] hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <ChevronRight size={24} strokeWidth={2.5} />
                        </button>
                    </motion.div>
                </div>

                {/* Slider */}
                <div className="relative -mx-4 lg:-mx-6 px-4 lg:px-6">
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-8"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {displayProjects.map((project, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 5) * 0.1 }}
                                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start shrink-0 group cursor-pointer"
                            >
                                <Link href="/projects/detail" className="block h-full">
                                    <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-2 h-full flex flex-col">
                                        {/* Image Container */}
                                        <div className="relative h-[280px] md:h-[320px] w-full overflow-hidden">
                                            <Image 
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        
                                        {/* Content Area */}
                                        <div className="p-6 relative grow flex flex-col justify-center">
                                            {/* Green square button overlaying image/content border */}
                                            <div className="absolute right-6 -top-5 w-10 h-10 rounded-[4px] bg-[#1FA463] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                                                <ArrowRight size={20} className="text-white" strokeWidth={2.5} />
                                            </div>

                                            <h3 className="text-[#0D2235] font-extrabold text-[20px] mb-1.5">
                                                {project.title}
                                            </h3>
                                            <p className="text-[#0D2235] text-[14px] font-bold">
                                                {project.category}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

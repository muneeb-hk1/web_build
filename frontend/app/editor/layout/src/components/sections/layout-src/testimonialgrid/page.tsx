"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { testimonialGrid } = siteData;

export default function TestimonialGrid({
    subtitle,
    title,
    testimonials: testimonialsProp,
}: {
    subtitle?: string;
    title?: string;
    testimonials?: typeof testimonialGrid.testimonials;
}) {
    const testimonials = testimonialsProp?.length
        ? testimonialsProp
        : testimonialGrid.testimonials;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section id="testimonials" className="pt-8 pb-14 md:pt-10 md:pb-16 bg-white relative">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#1FA463] font-bold text-[14px] tracking-wide block mb-3">
                            {subtitle || testimonialGrid.subtitle}
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0D2235] text-[32px] md:text-[44px] font-semibold leading-[1.2] tracking-tight relative inline-block"
                    >
                        {title || testimonialGrid.title}
                        {/* Swirly underline simulation */}
                        <svg className="absolute -bottom-4 right-0 w-[120px] h-auto text-[#F3C2A3] -z-10 opacity-70" viewBox="0 0 100 20" fill="none">
                            <path d="M0 15 C 20 5, 50 20, 100 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                        </svg>
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="bg-[#F9FAFB] p-10 rounded-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-300 hover:-translate-y-2 group"
                        >
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="text-[#FBBF24] fill-[#FBBF24]" />
                                ))}
                            </div>
                            
                            <p className="text-[#666666] text-[14.5px] leading-[1.8] mb-8 group-hover:text-[#555] transition-colors">
                                {testimonial.content}
                            </p>
                            
                            <div>
                                <h4 className="text-[#0D2235] text-[18px] font-bold mb-1 group-hover:text-[#1FA463] transition-colors">
                                    {testimonial.name}
                                </h4>
                                <p className="text-[#888888] text-[13px] font-medium">
                                    {testimonial.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center items-center gap-3"
                    >
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F9FAFB] text-[#0D2235] hover:bg-[#1FA463] hover:text-white'}`}
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#1FA463] text-white' : 'bg-[#F9FAFB] text-[#0D2235] hover:bg-[#1FA463] hover:text-white'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F9FAFB] text-[#0D2235] hover:bg-[#1FA463] hover:text-white'}`}
                        >
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
}

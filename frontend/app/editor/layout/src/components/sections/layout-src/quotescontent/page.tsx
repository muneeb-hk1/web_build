"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Mail, ChevronDown } from 'lucide-react';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { quotes } = siteData;

export default function QuotesContent() {
    return (
        <section className="bg-[#F8F9FA] py-12 md:py-16 relative">
            {/* CSS Dotted Background */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                }}
            ></div>
            
            {/* Removed negative margins to give space from the top */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 mt-4">
                {/* Contact Section Wrapper (White Card) */}
                <div className="bg-white rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row items-stretch overflow-hidden">
                    
                    {/* Left: Illustration (Sits directly on the section background) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2 relative min-h-[350px] md:min-h-[500px]"
                    >
                        <Image 
                            src="/categories/cleaning/template1/illustration-quotes.png" 
                            alt="Cleaning Illustration" 
                            fill
                            sizes="(max-w-768px) 100vw, 50vw"
                            className="object-contain md:object-left"
                            style={{ padding: '0px' }}
                        />
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white shadow-[0_0_30px_rgba(0,0,0,0.08)] rounded-2xl m-4 md:m-8"
                    >
                        <div className="mb-6">
                            <span className="text-[#1FA463] font-bold text-[13px] mb-2 block">{quotes.subtitle}</span>
                            <h2 className="text-[24px] md:text-[28px] leading-tight font-extrabold text-[#0D2235]">{quotes.title}</h2>
                        </div>

                        <form className="space-y-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder={quotes.placeholders.name} 
                                    className="w-full h-12 px-5 bg-[#F6F8FB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1FA463] text-[14px] text-[#333333] placeholder:text-gray-400"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder={quotes.placeholders.email} 
                                    className="w-full h-12 px-5 bg-[#F6F8FB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1FA463] text-[14px] text-[#333333] placeholder:text-gray-400"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            <div className="relative">
                                <select 
                                    className="w-full h-12 px-5 bg-[#F6F8FB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-500 appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled hidden>{quotes.placeholders.select}</option>
                                    {quotes.options.map((opt, i) => (
                                        <option key={i} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            <div className="relative">
                                <textarea 
                                    placeholder={quotes.placeholders.message} 
                                    rows={4}
                                    className="w-full p-5 bg-[#F6F8FB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1FA463] text-[14px] text-[#333333] placeholder:text-gray-400 resize-none min-h-[100px]"
                                ></textarea>
                            </div>

                            <button 
                                type="button"
                                className="bg-[#F8E268] hover:bg-[#E5D154] text-[#0D2235] font-bold text-[14px] px-8 py-3 rounded-full transition-all inline-block mt-2"
                            >
                                {quotes.buttonText}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

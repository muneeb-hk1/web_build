"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { pricing } = siteData;

export default function PricingSection() {
    return (
        <section className="pt-8 pb-14 md:pt-10 md:pb-16 bg-white relative">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#1FA463] font-bold text-[15px] tracking-wide block mb-3">
                            {pricing.subtitle}
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0D2235] text-[32px] md:text-[44px] font-semibold leading-[1.2] tracking-tight"
                    >
                        {pricing.title}
                    </motion.h2>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pricing.plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <div className="bg-[#F9FAFB] transition-all duration-300 rounded-sm p-10 flex flex-col items-center h-full hover:bg-white hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 group/card">
                                
                                <h3 className="text-[#0D2235] text-[18px] font-bold mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-[#888888] text-[13px] mb-8 text-center">
                                    {plan.description}
                                </p>
                                
                                <div className="relative flex items-center justify-center w-full mb-10 py-2">
                                    <div className="absolute w-[75px] h-[75px] bg-[#FFF5F1] rounded-full z-0 translate-x-2 transition-transform duration-500 group-hover/card:scale-110"></div>
                                    <div className="flex items-baseline gap-1 z-10 relative">
                                        <span className="text-[#0D2235] text-[42px] font-extrabold leading-none">{plan.price}</span>
                                        <span className="text-[#6B7280] text-[13px] font-medium">/ Mo</span>
                                    </div>
                                </div>

                                <ul className="space-y-5 mb-12 w-full px-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center justify-between">
                                            <span className="text-[#666666] text-[14px]">{feature.text}</span>
                                            {feature.included ? (
                                                <CheckCircle2 size={18} className="text-[#1FA463] shrink-0" strokeWidth={2.5} />
                                            ) : (
                                                <XCircle size={18} className="text-[#BBE1ED] shrink-0" strokeWidth={2.5} />
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto w-full flex justify-center">
                                    <Link href="/enquiry" className="bg-[#1FA463] hover:bg-[#138A56] text-white text-[14px] font-semibold py-[11px] px-7 rounded-[4px] transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-lg">
                                        <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        Enquiry Now
                                    </Link>
                                </div>
                                
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

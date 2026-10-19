"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { faq } = siteData;

export default function FaqAccordion({
    items,
}: {
    items?: typeof faq.items;
}) {
    const faqs = items?.length ? items : faq.items;
    // Open the first item by default
    const [openIndex, setOpenIndex] = useState<number>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="bg-[#F8F9FA] pt-8 pb-14 md:pt-10 md:pb-16">
            <div className="max-w-[900px] mx-auto px-4 lg:px-6">
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className="bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-sm overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group"
                                >
                                    <h4 className={`text-[16px] md:text-[17px] font-semibold transition-colors duration-300 ${isOpen ? 'text-[#0D2235]' : 'text-[#0D2235] group-hover:text-[#1FA463]'}`}>
                                        {faq.question}
                                    </h4>
                                    
                                    <div className={`ml-4 shrink-0 flex items-center justify-center w-[35px] h-[35px] transition-colors duration-300 ${isOpen ? 'bg-[#1FA463] text-white' : 'bg-transparent text-[#6B7280] group-hover:text-[#1FA463]'}`}>
                                        {isOpen ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
                                    </div>
                                </button>
                                
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 md:p-6 pt-0 border-t border-gray-50 text-[#6B7280] text-[15px] leading-[1.8]">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

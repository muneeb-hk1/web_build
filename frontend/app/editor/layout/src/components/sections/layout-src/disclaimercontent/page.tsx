"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

export default function DisclaimerContent() {
    const data = siteData.disclaimer;

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="italic text-gray-500 mb-8 text-[15px]">{data.lastUpdated}</p>

                    <div className="space-y-10">
                        {data.sections.map((section, index) => (
                            <div key={index}>
                                <h3 className="text-[22px] md:text-[24px] font-bold text-[#0D2235] mb-4">{section.title}</h3>
                                {section.paragraphs && section.paragraphs.map((p, i) => (
                                    <p key={i} className={`text-gray-500 text-[16px] leading-[1.8] ${section.list ? 'mb-4' : ''}`}>
                                        {p}
                                    </p>
                                ))}
                                {section.list && (
                                    section.list.isOrdered ? (
                                        <ol className="list-decimal pl-5 space-y-3 text-gray-500 text-[16px] leading-[1.8]">
                                            {section.list.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <ul className="list-disc pl-5 space-y-3 text-gray-500 text-[16px] leading-[1.8]">
                                            {section.list.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )
                                )}
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";
import CleaningSlider from "../../shared/CleaningSlider";

const { news } = siteData;
const newsItems = news.items;

interface NewsSectionProps {
    limit?: number;
    layout?: 'grid' | 'slider';
}

export default function NewsSection({ limit = 6, layout = 'grid' }: NewsSectionProps) {
    return (
        <section className={`${layout === 'slider' ? 'bg-white pt-4 pb-4 md:pt-6 md:pb-6' : 'bg-[#F8F9FA] pt-6 pb-12 md:pt-8 md:pb-16'} overflow-hidden relative`}>
            {layout === 'slider' && null}
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                            {news.subtitle}
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight"
                    >
                        {news.title}
                    </motion.h2>
                </div>

                {/* Content */}
                {layout === 'slider' ? (
                    <CleaningSlider
                        showDots
                        autoplayMs={4000}
                        gapClassName="gap-7"
                        itemClassName="w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)]"
                    >
                        {newsItems.slice(0, limit).map((news, index) => (
                            <NewsCard key={index} news={news} index={index} />
                        ))}
                    </CleaningSlider>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {newsItems.slice(0, limit).map((news, index) => (
                            <NewsCard key={index} news={news} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function NewsCard({ news, index }: { news: any, index: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 3) * 0.15 }}
            className="bg-white border border-gray-100 shadow-[0_5px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col hover:-translate-y-2 rounded-md overflow-hidden p-3 w-full h-full"
        >
            {/* Image Container */}
            <div className="relative w-full h-[240px] overflow-hidden rounded-sm">
                <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-0 left-0 bg-[#1FA463] text-white text-[13px] font-bold px-4 py-2 rounded-br-sm">
                    {news.date}
                </div>
            </div>

            {/* Content */}
            <div className="pt-6 pb-4 px-2 flex flex-col grow">
                <h4 className="text-[#0D2235] text-[20px] md:text-[22px] font-bold leading-[1.4] mb-6 hover:text-[#1FA463] transition-colors cursor-pointer">
                    {news.title}
                </h4>
                
                <div className="mt-auto">
                    <Link href={news.link || "#"} className="inline-block bg-[#1FA463] hover:bg-[#138A56] text-white text-[15px] font-semibold px-7 py-3 rounded-full transition-colors duration-300 shadow-sm">
                        Read More
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

"use client";
import React from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

export default function BlogSidebar() {
    const { blogSidebar } = siteData;
    return (
        <div className="space-y-12">
            {/* Search Widget */}
            <div className="relative">
                <input
                    type="text"
                    placeholder={blogSidebar.searchPlaceholder}
                    className="w-full bg-[#F5F5F5] rounded-xl py-4 px-6 pr-12 text-[15px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#00B074] transition-colors placeholder:text-[#777777]"
                />
                <button className="absolute right-0 top-0 bottom-0 px-5 text-[#00B074] hover:text-[#054C34] transition-colors flex items-center justify-center">
                    <Search size={18} strokeWidth={2} />
                </button>
            </div>

            {/* Recent News Widget */}
            <div>
                <h4 className="text-[#024933] text-[24px] font-bold mb-1">{blogSidebar.recentNewsTitle}</h4>
                <div className="w-[45px] h-[2px] bg-[#00A562] mb-8"></div>
                
                <div className="space-y-6">
                    {blogSidebar.recentNews.map((post, i) => (
                        <Link href="/blog/detail" key={i} className="flex items-start gap-4 group">
                            <div className="w-[65px] h-[65px] bg-gray-200 overflow-hidden shrink-0 rounded-md">
                                <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h5 className="text-[#0D2235] text-[16px] font-bold leading-[1.3] mb-1.5 group-hover:text-[#1FA463] transition-colors">
                                    {post.title}
                                </h5>
                                <span className="text-[#6B7280] text-[13px] block">
                                    {post.date}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

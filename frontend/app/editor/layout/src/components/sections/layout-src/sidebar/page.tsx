"use client";
import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { sidebar } = siteData;

export default function Sidebar() {
    return (
        <div className="space-y-8">
            {/* Search Widget - No white background wrapper */}
            <div>
                <h4 className="text-[#0D2235] text-[18px] font-bold mb-4">{sidebar.searchTitle}</h4>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={sidebar.searchPlaceholder}
                        className="w-full bg-white shadow-sm py-3.5 px-4 pr-12 text-[14px] text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#1FA463] transition-colors placeholder:text-gray-400"
                    />
                    <button className="absolute right-0 top-0 bottom-0 px-4 text-[#0D2235] hover:text-[#1FA463] transition-colors flex items-center justify-center">
                        <Search size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white shadow-sm p-7">
                <h4 className="text-[#0D2235] text-[18px] font-bold mb-6">{sidebar.categoriesTitle}</h4>
                <ul className="space-y-4">
                    {sidebar.categories.map((cat, i) => (
                        <li key={i}>
                            <Link href="/projects/detail" className="flex items-center justify-between group transition-colors">
                                <span className="text-[#0D2235] text-[15px] group-hover:text-[#1FA463] transition-colors">{cat}</span>
                                <ChevronRight className="text-[#0D2235] group-hover:text-[#1FA463] transition-colors" size={16} strokeWidth={2} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
}

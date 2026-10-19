"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Menu,
    X,
    ChevronDown,
    PhoneCall,
} from "lucide-react";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { header } = siteData;
const navLinks = header.navLinks;

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-[90px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo/newlogo1.png"
                            alt="Logo"
                            width={210}
                            height={70}
                            priority
                            style={{ width: '210px', height: 'auto' }}
                            className="object-contain"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
                        {navLinks.map((item) => (
                            <div key={item.title} className="relative group h-[90px] flex items-center">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 font-bold text-[15px] xl:text-base transition-colors relative
                                        ${item.title === 'Home' ? 'text-[#1FA463]' : 'text-[#0D2235] group-hover:text-[#1FA463]'}
                                    `}
                                >
                                    {item.title}
                                    {item.dropdown && (
                                        <ChevronDown size={16} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                                    )}
                                </Link>

                                {item.dropdown && item.subLinks && (
                                    <div className="absolute top-[90px] left-0 w-48 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-t-[3px] border-[#1FA463] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                        {item.subLinks.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="block px-5 py-2.5 text-[15px] font-semibold text-[#0D2235] hover:text-[#1FA463] hover:bg-gray-50/50 transition-colors"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#EAF8EF] flex items-center justify-center shrink-0">
                                <PhoneCall
                                    size={20}
                                    className="text-[#1FA463]"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-[13px] text-gray-500 font-semibold leading-tight mb-0.5">
                                    {header.phoneLabel}
                                </p>
                                <a
                                    href={`tel:${header.phoneNumber.replace(/[^0-9+]/g, '')}`}
                                    className="font-extrabold text-[#0D2235] text-[15px] leading-tight"
                                >
                                    {header.phoneNumber}
                                </a>
                            </div>
                        </div>

                        <Link href="/quotes" className="bg-[#1FA463] hover:bg-[#18804d] text-white px-7 py-3 rounded-full font-bold text-[15px] transition-colors shadow-sm inline-block">
                            {header.buttonText}
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden text-[#0D2235]"
                    >
                        {menuOpen ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px]" : "max-h-0"}`}
            >
                <div className="border-t border-gray-100 bg-white">
                    <nav className="flex flex-col p-5">
                        {navLinks.map((item) => (
                            <div key={item.title} className="flex flex-col border-b border-gray-100">
                                <Link
                                    href={item.href}
                                    className={`py-3 flex justify-between items-center font-bold text-[15px]
                                        ${item.title === 'Home' ? 'text-[#1FA463]' : 'text-[#0D2235]'}
                                    `}
                                    onClick={(e) => {
                                        if (item.dropdown) {
                                            e.preventDefault();
                                            setMobileDropdowns(prev => ({ ...prev, [item.title]: !prev[item.title] }));
                                        } else {
                                            setMenuOpen(false);
                                        }
                                    }}
                                >
                                    {item.title}

                                    {item.dropdown && (
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${mobileDropdowns[item.title] ? 'rotate-180' : ''}`} />
                                    )}
                                </Link>

                                {item.dropdown && item.subLinks && (
                                    <div className={`overflow-hidden transition-all duration-300 flex flex-col pl-4 ${mobileDropdowns[item.title] ? 'max-h-[200px] pb-3' : 'max-h-0'}`}>
                                        {item.subLinks.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1FA463]"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="mt-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-[#EAF8EF] flex items-center justify-center">
                                    <PhoneCall
                                        size={18}
                                        className="text-[#1FA463]"
                                    />
                                </div>
                                <div>
                                    <p className="text-[13px] text-gray-500 font-semibold">
                                        {header.phoneLabel}
                                    </p>
                                    <p className="font-extrabold text-[#0D2235] text-[15px]">
                                        {header.phoneNumber}
                                    </p>
                                </div>
                            </div>
                            <Link href="/quotes" className="w-full h-12 rounded-full bg-[#1FA463] hover:bg-[#18804d] text-white font-bold text-[15px] transition-colors flex items-center justify-center">
                                {header.buttonText}
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
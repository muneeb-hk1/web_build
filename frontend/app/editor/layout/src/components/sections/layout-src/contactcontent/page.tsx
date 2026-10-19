"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPinned, PhoneCall, Mail,
    User, FileText, PenLine, Send, Phone, ArrowRight,
    LucideIcon
} from 'lucide-react';
import {
    FaFacebookF as Facebook,
    FaTwitter as Twitter,
    FaInstagram as Instagram,
    FaLinkedinIn as Linkedin,
} from 'react-icons/fa';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { contact, footer } = siteData;

const iconMap: Record<string, LucideIcon> = {
    "map-pinned": MapPinned,
    "phone-call": PhoneCall,
    "mail": Mail
};

export default function ContactContent() {
    return (
        <>
            {/* Top Section: Location Cards */}
            <section className="pt-8 pb-14 md:pt-10 md:pb-16 bg-white">
                <div className="max-w-[1140px] mx-auto px-4 lg:px-6">
                <div className="text-center mb-10 md:mb-12">
                    <h5 className="text-[#1FA463] text-[14px] font-bold tracking-widest uppercase mb-3">{contact.locationSubtitle}</h5>
                    <h2 className="text-[#0D2235] text-[32px] md:text-[44px] font-semibold max-w-2xl mx-auto leading-tight">
                        {contact.locationTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {contact.locations.map((loc, index) => {
                        const Icon = iconMap[loc.iconName] || MapPinned;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (index + 1) }}
                                className="bg-white hover:bg-[#1FA463] text-[#0D2235] hover:text-white rounded-md p-10 flex flex-col items-center text-center shadow-[0_5px_30px_rgba(0,0,0,0.05)] border border-[#EAEAEA] hover:border-[#1FA463] transition-all duration-500 group h-full cursor-pointer hover:-translate-y-2"
                            >
                                <div className="w-[80px] h-[80px] rounded-full border border-[#1FA463]/30 group-hover:border-white/30 flex items-center justify-center mb-6 text-[#1FA463] group-hover:text-white transition-all duration-500">
                                    <Icon size={36} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[22px] font-extrabold mb-4 transition-colors duration-500">{loc.title}</h3>
                                <div className="flex flex-col gap-1 text-gray-500 group-hover:text-white/90 text-[15px] leading-relaxed max-w-[200px] transition-colors duration-500">
                                    {loc.lines.map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* Bottom Section: Form */}
        <section className="pt-8 pb-14 md:pt-10 md:pb-16 bg-[#F4F9F7]">
            <div className="max-w-[1140px] mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left: Text & Socials */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:pr-10"
                    >
                        <h5 className="text-[#1FA463] text-[14px] font-bold tracking-widest uppercase mb-4">{contact.formSubtitle}</h5>
                        <h2 className="text-[#0D2235] text-[32px] md:text-[44px] font-semibold leading-[1.2] mb-10">
                            {contact.formTitle}
                        </h2>

                        <div className="flex items-center gap-4">
                            <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1FA463] text-white flex items-center justify-center hover:bg-[#0D2235] transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href={footer.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1FA463] text-white flex items-center justify-center hover:bg-[#0D2235] transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1FA463] text-white flex items-center justify-center hover:bg-[#0D2235] transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href={footer.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1FA463] text-white flex items-center justify-center hover:bg-[#0D2235] transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: The Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 lg:p-12 lg:px-14 rounded-lg shadow-sm"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full h-12 pl-8 border-b border-gray-200 focus:outline-none focus:border-[#1FA463] text-[15px] bg-transparent text-[#333333] placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full h-12 pl-8 border-b border-gray-200 focus:outline-none focus:border-[#1FA463] text-[15px] bg-transparent text-[#333333] placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Enter Number"
                                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                        className="w-full h-12 pl-8 border-b border-gray-200 focus:outline-none focus:border-[#1FA463] text-[15px] bg-transparent text-[#333333] placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-400">
                                        <FileText size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter Subject"
                                        className="w-full h-12 pl-8 border-b border-gray-200 focus:outline-none focus:border-[#1FA463] text-[15px] bg-transparent text-[#333333] placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="relative mt-8">
                                <div className="absolute top-3 left-0 text-gray-400">
                                    <PenLine size={18} />
                                </div>
                                <textarea
                                    placeholder="How can we help you? Feel free to talk..."
                                    rows={4}
                                    className="w-full pl-8 border-b border-gray-200 focus:outline-none focus:border-[#1FA463] text-[15px] bg-transparent text-[#333333] placeholder:text-gray-400 transition-colors resize-none pt-3"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="mt-8 bg-[#1FA463] hover:bg-[#18804d] text-white px-8 py-3.5 rounded-md font-bold text-[15px] transition-colors flex items-center gap-2"
                            >
                                <ArrowRight size={18} />
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
        </>
    );
}

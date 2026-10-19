"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
    FaFacebookF as Facebook,
    FaLinkedinIn as Linkedin,
    FaTwitter as Twitter,
    FaInstagram as Instagram,
} from "react-icons/fa";

import {
    MapPin,
    Mail,
    Smartphone,
    ChevronRight,
} from "lucide-react";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { footer } = siteData;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export default function Footer() {
    return (
        <footer className="bg-[#262626] text-white pt-36 md:pt-44 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                
                {/* Footer Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
                >
                    
                    {/* ================= COLUMN 1 ================= */}
                    <motion.div variants={itemVariants} className="lg:pr-6">
                        {/* Logo */}
                        <Link href="/" className="inline-block -mt-6 mb-1">
                            <img
                                src="/logo/whitelogo.png"
                                alt="CleanPro"
                                className="w-[170px] h-auto object-contain"
                            />
                        </Link>

                        {/* Description */}
                        <p className="text-[#C8C8C8] text-[15px] leading-[1.6] -mt-10 max-w-[280px]">
                            {footer.description}
                        </p>

                        {/* Social */}
                        <div className="flex items-center gap-3 mt-6">
                            <span className="font-bold text-white text-[15px] mr-2">
                                Follow Us:
                            </span>
                            <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#16A361] hover:bg-[#16A361] hover:text-white transition">
                                <Facebook size={14} />
                            </a>
                            <a href={footer.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#16A361] hover:bg-[#16A361] hover:text-white transition">
                                <Linkedin size={14} />
                            </a>
                            <a href={footer.social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#16A361] hover:bg-[#16A361] hover:text-white transition">
                                <Twitter size={14} />
                            </a>
                            <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#16A361] hover:bg-[#16A361] hover:text-white transition">
                                <Instagram size={14} />
                            </a>
                        </div>
                    </motion.div>

                    {/* ================= COLUMN 2 ================= */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[22px] font-bold text-white">
                            Get In Touch
                        </h3>
                        <div className="w-10 h-[2px] bg-[#16A361] mt-3 mb-6"></div>

                        {/* Address */}
                        <div className="flex gap-3 mb-5">
                            <MapPin size={18} className="text-[#16A361] mt-[3px] shrink-0" />
                            <div>
                                <h5 className="font-bold text-white text-[15px]">Location:</h5>
                                <p className="text-[#C8C8C8] text-[14px] mt-[2px] leading-snug">
                                    {footer.address}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex gap-3 mb-5">
                            <Mail size={18} className="text-[#16A361] mt-[3px] shrink-0" />
                            <div>
                                <h5 className="font-bold text-white text-[15px]">Email:</h5>
                                <a href={`mailto:${footer.email}`} className="text-[#C8C8C8] text-[14px] mt-[2px] block hover:text-[#16A361] transition">
                                    {footer.email}
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex gap-3">
                            <Smartphone size={18} className="text-[#16A361] mt-[3px] shrink-0" />
                            <div>
                                <h5 className="font-bold text-white text-[15px]">Phone:</h5>
                                <a href={`tel:${footer.phone.replace(/[^0-9+]/g, '')}`} className="text-[#C8C8C8] text-[14px] mt-[2px] block hover:text-[#16A361] transition">
                                    {footer.phone}
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* ================= COLUMN 3 ================= */}
                    <motion.div variants={itemVariants} className="lg:pl-4">
                        <h3 className="text-[22px] font-bold text-white">
                            Quick Links
                        </h3>
                        <div className="w-10 h-[2px] bg-[#16A361] mt-3 mb-6"></div>

                        <ul className="space-y-4">
                            {footer.quickLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="flex items-center gap-3 text-[#C8C8C8] text-[15px] hover:text-[#16A361] transition">
                                        <ChevronRight size={16} className="text-[#16A361]" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* ================= COLUMN 4 ================= */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[22px] font-bold text-white">
                            Subscribe
                        </h3>
                        <div className="w-10 h-[2px] bg-[#16A361] mt-3 mb-6"></div>

                        <p className="text-[#E5E5E5] text-[15px] leading-relaxed mb-6 max-w-[280px]">
                            Subscribe To Our Newsletter To Get Our Update News!
                        </p>

                        <div className="max-w-[280px]">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full h-[48px] rounded-full px-6 outline-none text-[15px] text-[#333] bg-white placeholder:text-[#999]"
                            />
                            <button className="mt-4 w-full h-[48px] rounded-full bg-[#16A361] hover:bg-[#128a51] transition font-bold text-white text-[16px]">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="border-t border-[#3a3a3a] mt-12"
                >
                    <div className="py-6 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                        <p className="text-[#999] text-[15px] text-center md:text-left mt-4 md:mt-0">
                            Copyright © 2026. All rights reserved. Powered by <a href="https://lestow.com/" target="_blank" rel="noopener noreferrer" className="text-[#16A361] hover:text-white transition-colors font-bold">Lestow</a>
                        </p>
                        <div className="flex items-center flex-wrap justify-center gap-4 md:gap-6">
                            {footer.footerLinks.map((item) => (
                                <Link key={item.label} href={item.href} className="text-[#999] text-[15px] hover:text-[#16A361] transition-colors whitespace-nowrap">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
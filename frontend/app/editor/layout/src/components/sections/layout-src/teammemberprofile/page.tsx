"use client";

import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Mail } from 'lucide-react';
import { FaFacebookF as Facebook, FaTwitter as Twitter, FaInstagram as Instagram, FaLinkedinIn as Linkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { teamDetail } = siteData;

export default function TeamMemberProfile() {
    const { profile } = teamDetail;

    return (
        <section className="py-10 md:py-12 bg-white">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#0e4b2d] p-6 md:p-10 lg:p-[50px] xl:p-[60px] flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-xl"
                >
                    {/* Left: Image */}
                    <div className="w-full md:w-[45%] lg:w-[48%] shrink-0">
                        <div className="relative w-full aspect-[4/4.5] p-3 md:p-4 border-[3px] border-[#E4B351]">
                            <div className="relative w-full h-full">
                                <Image 
                                    src={profile.image} 
                                    alt={profile.name}
                                    fill
                                    sizes="(max-w-768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-[55%] lg:w-[52%] flex flex-col justify-center">
                        <h2 className="text-white text-[36px] md:text-[46px] lg:text-[50px] font-bold leading-tight mb-2">
                            {profile.name}
                        </h2>
                        <h4 className="text-[#E4B351] font-bold text-[18px] md:text-[20px] mb-6 md:mb-8 tracking-wide">
                            {profile.role}
                        </h4>
                        
                        <p className="text-white/90 text-[15px] md:text-[16px] leading-[1.8] mb-10 pr-0 lg:pr-8 font-medium">
                            {profile.description}
                        </p>

                        <div className="space-y-[22px] mb-12">
                            <div className="flex items-center gap-5">
                                <Phone size={20} className="text-[#E4B351] shrink-0" strokeWidth={2.5} />
                                <span className="text-white text-[16px] md:text-[18px] font-bold tracking-wide">{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-5">
                                <MapPin size={20} className="text-[#E4B351] shrink-0" strokeWidth={2.5} />
                                <span className="text-white text-[16px] md:text-[18px] font-bold tracking-wide">{profile.location}</span>
                            </div>
                            <div className="flex items-center gap-5">
                                <Mail size={20} className="text-[#E4B351] shrink-0" strokeWidth={2.5} />
                                <span className="text-white text-[16px] md:text-[18px] font-bold tracking-wide">{profile.email}</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex gap-4">
                            <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] border border-white/40 flex items-center justify-center text-white hover:bg-[#E4B351] hover:border-[#E4B351] transition-all">
                                <Facebook size={16} />
                            </a>
                            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] border border-white/40 flex items-center justify-center text-white hover:bg-[#E4B351] hover:border-[#E4B351] transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href={profile.social.pinterest} target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] border border-white/40 flex items-center justify-center text-white hover:bg-[#E4B351] hover:border-[#E4B351] transition-all">
                                <Instagram size={16} />
                            </a>
                            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] border border-white/40 flex items-center justify-center text-white hover:bg-[#E4B351] hover:border-[#E4B351] transition-all">
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

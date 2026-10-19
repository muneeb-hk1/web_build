"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Briefcase, TrendingUp, DollarSign, BookOpen, 
    MapPin, ChevronRight, CheckCircle, Users, 
    Heart, Shield, Award, Smile,
    Target, ArrowUpRight, CircleDollarSign, GraduationCap, User,
    Map, UserCog, UserCheck, Settings, Headset,
    AlarmClock, ShieldCheck, HeartHandshake,
    LucideIcon
} from 'lucide-react';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { career } = siteData;

const iconMap: Record<string, LucideIcon> = {
    "users": Users,
    "target": Target,
    "circle-dollar-sign": CircleDollarSign,
    "user": User,
    "map": Map,
    "user-cog": UserCog,
    "user-check": UserCheck,
    "settings": Settings,
    "headset": Headset,
    "alarm-clock": AlarmClock,
    "shield-check": ShieldCheck,
    "award": Award,
    "heart-handshake": HeartHandshake
};

const getBenefitIcon = (iconName: string) => {
    const MainIcon = iconMap[iconName] || Users;
    
    let BadgeIcon = Heart;
    let badgeProps: any = { size: 10, fill: "#1FA463", strokeWidth: 0, className: "text-[#1FA463]" };
    let badgeContainerClass = "absolute -top-1 -right-1 bg-[#EAF5EB] rounded-full p-[2px]";

    if (iconName === 'target') {
        BadgeIcon = ArrowUpRight;
        badgeProps = { size: 14, className: "text-[#1FA463]", strokeWidth: 2.5, fill: "none" };
        badgeContainerClass = "absolute top-0 right-0 bg-[#EAF5EB] rounded-full p-[1px]";
    } else if (iconName === 'circle-dollar-sign') {
        BadgeIcon = TrendingUp;
        badgeProps = { size: 14, className: "text-[#1FA463]", strokeWidth: 2.5, fill: "none" };
        badgeContainerClass = "absolute bottom-0 right-0 bg-[#EAF5EB] rounded-full p-[1px]";
    } else if (iconName === 'user') {
        BadgeIcon = Shield;
        badgeProps = { size: 14, className: "text-[#1FA463]", strokeWidth: 1.5, fill: "#EAF5EB" };
        badgeContainerClass = "absolute bottom-0 right-0 bg-[#EAF5EB] rounded-full";
    }

    return (
        <div className="relative flex items-center justify-center w-[32px] h-[32px]">
            <MainIcon size={28} className="text-[#1FA463]" strokeWidth={1.5} />
            <div className={badgeContainerClass}>
                <BadgeIcon {...badgeProps} />
            </div>
        </div>
    );
};

export default function CareerContent() {
    return (
        <section className="pt-8 pb-14 md:pt-10 md:pb-16 bg-white">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center mb-5"
                    >
                        <span className="text-[#1FA463] font-bold text-[14px] tracking-widest uppercase mb-2">
                            {career.subtitle}
                        </span>
                        <div className="w-[40px] h-[2px] bg-[#1FA463]"></div>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#222222] text-[32px] md:text-[44px] font-semibold leading-[1.2] mb-6"
                    >
                        {career.titleLine1}<span className="text-[#1FA463]">{career.titleHighlight}</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#666666] text-[16px] md:text-[17px] leading-[1.8] max-w-2xl mx-auto"
                    >
                        {career.description}
                    </motion.p>
                </div>

                {/* Benefits Row 1 */}
                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-20 mb-28">
                    {career.benefits.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 bg-white group hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="w-[60px] h-[60px] rounded-full bg-[#EAF5EB] flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
                                {getBenefitIcon(item.iconName)}
                            </div>
                            <h4 className="text-[#333333] text-[16px] font-extrabold leading-tight whitespace-pre-line text-left">
                                {item.title}
                            </h4>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-24 max-w-[1100px] mx-auto">
                    
                    {/* Left Col: Current Openings */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-[#222222] text-[26px] font-extrabold mb-2">{career.openingsTitle}</h3>
                            <p className="text-[#666666] text-[15px] mb-6">{career.openingsDescription}</p>
                            
                            <div className="space-y-2.5">
                                {career.jobs.map((job, idx) => {
                                    const JobIcon = iconMap[job.iconName] || Map;
                                    return (
                                        <Link href={`/career/${job.slug}`} key={idx}>
                                            <div className="border border-[#EAEAEA] rounded-md py-2.5 px-4 flex items-center justify-between hover:border-[#1FA463] hover:shadow-sm transition-all duration-300 cursor-pointer group bg-white mb-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-[38px] h-[38px] rounded-lg bg-[#EAF5EB] flex items-center justify-center shrink-0">
                                                        <JobIcon size={22} className="text-[#1FA463]" strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[#222222] font-extrabold text-[15px] leading-tight mb-0.5 group-hover:text-[#1FA463] transition-colors">{job.title}</h4>
                                                        <div className="flex items-center gap-1 text-[#666666] text-[13px]">
                                                            <MapPin size={12} className="text-[#1FA463]" />
                                                            {job.location}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-[#EAF5EB] text-[#1FA463] text-[12px] font-bold px-3 py-1 rounded-full">{job.type}</span>
                                                    <ChevronRight size={18} className="text-[#999999] group-hover:text-[#1FA463] transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            <button className="mt-3 border-2 border-[#1FA463] text-[#1FA463] bg-white hover:bg-[#1FA463] hover:text-white px-4 py-1.5 rounded-md font-bold transition-colors text-[12px]">
                                {career.viewAllText}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Col: Application Form */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-[#EAEAEA] shadow-[0_5px_30px_rgba(0,0,0,0.02)] rounded-xl p-4 lg:p-5"
                        >
                            <h3 className="text-[#222222] text-[22px] font-extrabold mb-1">{career.formTitle}</h3>
                            <p className="text-[#666666] mb-4 text-[13px]">{career.formDescription}</p>
                            
                            <form className="space-y-2.5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#333333] mb-1">Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Enter your full name" className="w-full h-[36px] px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666] placeholder:text-[#999999]" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#333333] mb-1">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" placeholder="Enter your email" className="w-full h-[36px] px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666] placeholder:text-[#999999]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#333333] mb-1">Phone Number <span className="text-red-500">*</span></label>
                                        <input type="tel" placeholder="Enter your phone number" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} className="w-full h-[36px] px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666] placeholder:text-[#999999]" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#333333] mb-1">Position Applying For <span className="text-red-500">*</span></label>
                                        <select className="w-full h-[36px] px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666]">
                                            <option>Select Position</option>
                                            <option>Housekeeping Staff</option>
                                            <option>Cleaning Supervisor</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-bold text-[#333333] mb-1">Experience <span className="text-red-500">*</span></label>
                                    <select className="w-full h-[36px] px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666]">
                                        <option>Select Experience</option>
                                        <option>0-1 Years</option>
                                        <option>1-3 Years</option>
                                        <option>3+ Years</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#333333] mb-1">Upload Resume <span className="text-red-500">*</span></label>
                                    <div className="w-full h-[36px] px-2 rounded-md border border-[#EAEAEA] bg-white flex items-center gap-2 overflow-hidden">
                                        <button type="button" className="bg-[#F5F5F5] text-[#333333] px-2.5 py-1 text-[11px] font-bold rounded border border-[#DDDDDD] hover:bg-gray-200 transition-colors">Choose File</button>
                                        <span className="text-[#666666] text-[11px]">No file chosen</span>
                                    </div>
                                    <p className="text-[10px] text-[#888888] mt-1 font-medium">PDF, DOC, DOCX (Max. 5MB)</p>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#333333] mb-1">Additional Message</label>
                                    <textarea placeholder="Write your message here..." rows={3} className="w-full py-2 px-3 rounded-md border border-[#EAEAEA] focus:outline-none focus:border-[#1FA463] bg-white text-[12px] text-[#666666] placeholder:text-[#999999] resize-none"></textarea>
                                </div>

                                <button type="button" className="w-full bg-[#1FA463] hover:bg-[#18804d] text-white py-2 rounded-md font-extrabold transition-colors text-[12px]">
                                    Submit Application
                                </button>
                            </form>
                        </motion.div>
                    </div>

                </div>

                {/* Why Work With Us - Premium Theme Bento Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-[#1FA463] rounded-3xl p-10 lg:p-16 max-w-[1200px] mx-auto overflow-hidden shadow-2xl"
                >
                    {/* Abstract glowing background blobs */}
                    <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-white rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-white rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center mb-14 text-center">
                        <h3 className="text-white text-[32px] md:text-[38px] font-extrabold mb-5 tracking-tight">{career.whyWorkTitle}</h3>
                        <div className="w-[50px] h-[4px] bg-white/50 rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                        {/* Top Row: 3 Items */}
                        {career.whyWorkItems.slice(0, 3).map((item, i) => {
                            const Icon = iconMap[item.iconName] || Users;
                            return (
                            <div key={i} className={`group ${item.span} bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col items-start`}>
                                <div className="w-[60px] h-[60px] rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    <Icon size={28} className="text-white" />
                                </div>
                                <h4 className="text-white text-[18px] font-bold mb-3">{item.title}</h4>
                                <p className="text-white/80 text-[14px] leading-relaxed">{item.desc}</p>
                            </div>
                            );
                        })}

                        {/* Bottom Row: 2 Items */}
                        {career.whyWorkItems.slice(3, 5).map((item, i) => {
                            const Icon = iconMap[item.iconName] || Award;
                            return (
                            <div key={i} className={`group ${item.span} bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-start md:items-center gap-6`}>
                                <div className="w-[70px] h-[70px] rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    <Icon size={32} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white text-[20px] font-bold mb-3">{item.title}</h4>
                                    <p className="text-white/80 text-[15px] leading-relaxed max-w-[400px]">{item.desc}</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ChevronDown, Send, LucideIcon } from 'lucide-react';
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { enquiry } = siteData;

const iconMap: Record<string, LucideIcon> = {
    phone: Phone,
    mail: Mail,
    "map-pin": MapPin,
    clock: Clock
};

const mappedMethods = enquiry.contactMethods.map(item => ({
    ...item,
    icon: iconMap[item.iconName] || Phone
}));

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function EnquiryContent() {
    return (
        <section className="py-6 md:py-8 bg-white overflow-hidden">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-10"
                >
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#1FA463] font-bold text-[13px] uppercase tracking-wider block mb-2"
                    >
                        {enquiry.subtitle}
                    </motion.span>
                    <h2 className="text-[32px] sm:text-[36px] md:text-[40px] font-extrabold text-[#0D2235] leading-tight mb-4">
                        {enquiry.titleLine1} <span className="text-[#1FA463]">{enquiry.titleHighlight}</span>
                    </h2>
                    <p 
                        className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed px-4 sm:px-0"
                        dangerouslySetInnerHTML={{ __html: enquiry.description }}
                    />
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">
                    
                    {/* Left Column: Get In Touch */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-[40%] bg-[#F3F7F5] rounded-2xl p-6 sm:p-8 flex flex-col group hover:shadow-[0_10px_30px_-10px_rgba(31,164,99,0.1)] transition-all duration-300"
                    >
                        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#14231E] mb-3 tracking-tight">{enquiry.getInTouchTitle}</h3>
                        <p className="text-[#55635F] text-[14px] md:text-[14.5px] leading-relaxed mb-8">
                            {enquiry.getInTouchDescription}
                        </p>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-6 flex-grow flex flex-col justify-center"
                        >
                            {mappedMethods.map((method, index) => {
                                const Icon = method.icon;
                                return (
                                    <motion.div key={index} variants={itemVariants} className="flex items-start gap-4 group/item">
                                        <div className="w-[45px] h-[45px] shrink-0 bg-[#E5EFE9] group-hover/item:bg-[#1FA463] group-hover/item:text-white rounded-full flex items-center justify-center text-[#1FA463] transition-colors duration-300">
                                            <Icon size={20} strokeWidth={2} className="group-hover/item:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="mt-0.5">
                                            <h4 className="font-extrabold text-[#14231E] text-[15px] mb-0.5 group-hover/item:text-[#1FA463] transition-colors">{method.title}</h4>
                                            <p className="text-[#55635F] text-[14px]" dangerouslySetInnerHTML={{ __html: method.description }} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Enquiry Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-[60%] bg-white rounded-2xl shadow-[0_5px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.12)] border border-gray-100 p-6 sm:p-8 flex flex-col transition-shadow duration-300"
                    >
                        <h3 className="text-[20px] font-bold text-[#14231E] mb-6 tracking-tight">{enquiry.formTitle}</h3>

                        <motion.form 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-4 flex-grow flex flex-col justify-between"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <motion.div variants={itemVariants}>
                                    <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your full name" 
                                        className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-800 placeholder:text-gray-400 transition-colors"
                                    />
                                </motion.div>

                                {/* Email Address */}
                                <motion.div variants={itemVariants}>
                                    <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-800 placeholder:text-gray-400 transition-colors"
                                    />
                                </motion.div>

                                {/* Phone Number */}
                                <motion.div variants={itemVariants}>
                                    <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="tel" 
                                        placeholder="Enter your phone number" 
                                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                        className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-800 placeholder:text-gray-400 transition-colors"
                                    />
                                </motion.div>

                                {/* Enquiry Type */}
                                <motion.div variants={itemVariants}>
                                    <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                        Enquiry Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-500 appearance-none cursor-pointer transition-colors"
                                            defaultValue=""
                                        >
                                            <option value="" disabled hidden>Select Enquiry Type</option>
                                            <option value="residential">Residential Cleaning</option>
                                            <option value="commercial">Commercial Cleaning</option>
                                            <option value="industrial">Industrial Cleaning</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#1FA463] transition-colors pointer-events-none" size={14} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Subject */}
                            <motion.div variants={itemVariants}>
                                <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter subject" 
                                    className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-800 placeholder:text-gray-400 transition-colors"
                                />
                            </motion.div>

                            {/* Message */}
                            <motion.div variants={itemVariants}>
                                <label className="block text-[13px] font-extrabold text-[#14231E] mb-1.5">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    placeholder="Write your message here..." 
                                    rows={3}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1FA463] focus:ring-1 focus:ring-[#1FA463] text-[14px] text-gray-800 placeholder:text-gray-400 resize-none transition-colors min-h-[90px]"
                                ></textarea>
                            </motion.div>

                            {/* Footer / Checkbox / Submit */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                                <div className="flex items-center gap-2.5">
                                    <input 
                                        type="checkbox" 
                                        id="privacy" 
                                        className="w-[14px] h-[14px] rounded border-gray-300 text-[#007A50] focus:ring-[#007A50] cursor-pointer" 
                                    />
                                    <label htmlFor="privacy" className="text-[13.5px] text-[#14231E] font-bold cursor-pointer">
                                        I agree to the <Link href="/privacy-policy" className="text-[#007A50] hover:underline transition-colors">privacy policy</Link>.
                                    </label>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="w-full sm:w-auto bg-[#007A50] hover:bg-[#00603f] text-white font-bold text-[14px] px-7 py-3 rounded-md transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Send Enquiry 
                                    <Send size={14} className="-rotate-45 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

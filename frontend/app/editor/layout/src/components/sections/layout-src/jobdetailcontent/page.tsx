"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, MapPin, Calendar, GraduationCap, 
    Clock, Building, UploadCloud, ChevronDown 
} from 'lucide-react';
import type { Job } from "../../../../types/serviceHome1";

export default function JobDetailContent({ job, allJobs }: { job: Job, allJobs: Job[] }) {
    if (!job) return <div>Job not found</div>;

    return (
        <section className="py-10 md:py-12 bg-[#F8F9FA]">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-[#0D2235] text-[36px] md:text-[42px] font-extrabold mb-4 leading-tight">Apply for Position</h2>
                    <div className="w-12 h-1 bg-[#1FA463] mx-auto mb-4 rounded-full"></div>
                    <p className="text-gray-500 text-[15px]">Fill out the form below to apply for the position.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 items-start relative">
                    
                    {/* Left: Sticky Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[300px] shrink-0 bg-white border border-gray-200 rounded-xl p-5 lg:sticky lg:top-24 shadow-sm"
                    >
                        <div className="flex flex-col items-center text-center border-b border-gray-100 pb-5 mb-5">
                            <div className="w-[70px] h-[70px] rounded-full bg-[#EAF5EB] text-[#1FA463] flex items-center justify-center mb-4">
                                <Briefcase size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-[#0D2235] text-[22px] font-bold mb-3 leading-tight">{job.title}</h3>
                            <div className="flex items-center justify-center gap-4 text-gray-500 text-[13px] font-medium mb-4">
                                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.type}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                            </div>
                            <p className="text-gray-500 text-[13px] leading-[1.6]">
                                Join our team and make an impact in the cleaning services industry.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Building size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Department</h5>
                                    <p className="text-gray-500 text-[13px]">Operations</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <Briefcase size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Job Type</h5>
                                    <p className="text-gray-500 text-[13px]">{job.type}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <Clock size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Experience</h5>
                                    <p className="text-gray-500 text-[13px]">1+ Years</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <GraduationCap size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Education</h5>
                                    <p className="text-gray-500 text-[13px]">High School / Diploma</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Calendar size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Posted On</h5>
                                    <p className="text-gray-500 text-[13px]">Aug 01, 2026</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Calendar size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-[#0D2235] text-[13px] font-bold mb-1">Application Deadline</h5>
                                    <p className="text-gray-500 text-[13px]">Sep 01, 2026</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Application Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm w-full"
                    >
                        <form className="space-y-5">
                            
                            {/* Personal Information */}
                            <div>
                                <h4 className="text-[#0D2235] text-[17px] font-bold mb-3 pb-2 border-b border-gray-100">Personal Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Enter your full name" className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" placeholder="Enter your email address" className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                                        <input type="tel" placeholder="Enter your phone number" className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Location <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Enter your current location" className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div>
                                <h4 className="text-[#0D2235] text-[17px] font-bold mb-3 pb-2 border-b border-gray-100">Professional Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Current Position</label>
                                        <input type="text" placeholder="Enter your current position" className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Total Experience <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors appearance-none cursor-pointer text-gray-500">
                                                <option value="">Select experience</option>
                                                <option value="0-1">0-1 Years</option>
                                                <option value="1-3">1-3 Years</option>
                                                <option value="3-5">3-5 Years</option>
                                                <option value="5+">5+ Years</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Notice Period</label>
                                        <div className="relative">
                                            <select className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors appearance-none cursor-pointer text-gray-500">
                                                <option value="">Select notice period</option>
                                                <option value="Immediate">Immediate</option>
                                                <option value="15 Days">15 Days</option>
                                                <option value="1 Month">1 Month</option>
                                                <option value="2 Months+">2 Months+</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Resume */}
                            <div>
                                <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Upload Resume <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center hover:bg-[#F8F9FA] hover:border-[#1FA463] transition-colors cursor-pointer group">
                                    <UploadCloud size={24} className="text-gray-400 group-hover:text-[#1FA463] mx-auto mb-1.5 transition-colors" />
                                    <h5 className="text-[#0D2235] font-bold text-[13px] mb-0.5">Click to upload your resume</h5>
                                    <p className="text-gray-400 text-[12px]">PDF, DOC, DOCX (Max. 5MB)</p>
                                    <input type="file" className="hidden" />
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label className="block text-[13px] font-bold text-[#0D2235] mb-1.5">Cover Letter</label>
                                <textarea 
                                    rows={3} 
                                    placeholder="Write a few lines about yourself..."
                                    className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#1FA463] transition-colors resize-y"
                                ></textarea>
                            </div>

                            <button type="button" className="bg-[#1FA463] hover:bg-[#0D2235] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 text-[14px] mt-2">
                                Submit Application
                            </button>                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

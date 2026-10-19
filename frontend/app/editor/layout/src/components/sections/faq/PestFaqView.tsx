"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import siteData from "../../../data/pestContent";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqContent() {
  const common = siteData.common;
  const faqData =
    siteData.categories.PestControl.sections.FAQ.variants.PestFAQ1;
  const faqList: FaqItem[] = faqData.items;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-visible">
      {/* Background Dot Matrix Pattern & Ambient Glow */}
      <div className="absolute top-0 right-10 w-[450px] h-[350px] bg-[#3fd080]/10 rounded-full blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-5 sm:mb-7">
          <span className="bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] px-5 py-1.5 rounded-full mb-2.5 shadow-xs">
            {faqData.badge || "FAQ"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight max-w-4xl leading-[1.25] text-neutral-900">
            {faqData.title}
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            {faqData.description}
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
          
          {/* Left Column: FAQ Accordion List */}
          <div className="lg:col-span-8 flex flex-col gap-3.5">
            {faqList.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border border-neutral-200/90 rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-neutral-50/70 transition cursor-pointer"
                  >
                    <span className="font-semibold text-neutral-800 text-[15px] sm:text-base md:text-[17px] pr-4 leading-snug">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "bg-[#00482B] text-white rotate-180"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      <ChevronDown size={18} strokeWidth={2} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-5 text-[13.5px] sm:text-[14.5px] font-normal text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3.5">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Support Box */}
          <div className="lg:col-span-4 sticky top-24 z-20 self-start">
            <div className="bg-[#003822] text-white rounded-3xl p-5 sm:p-6 flex flex-col shadow-xl border border-[#00482B] relative">
              
              {/* Question Icon + Title in One Row */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#3fd080] border border-white/10">
                  <HelpCircle size={20} strokeWidth={2.2} />
                </div>
                <h3 className="text-lg sm:text-[19px] font-bold tracking-tight text-white leading-snug">
                  {faqData.supportCard?.title || "Still have any question?"}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed mb-4 font-normal">
                Cannot find the answer you are looking for? Our friendly pest management specialists are ready to help.
              </p>

              {/* Phone and Email in One Line (50% - 50%) */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <a
                  href={`tel:${common.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-2.5 rounded-xl transition text-xs font-semibold border border-white/5 truncate"
                >
                  <Phone size={14} className="text-[#3fd080] flex-shrink-0" />
                  <span className="truncate">{common.phone}</span>
                </a>
                <a
                  href={`mailto:${common.email}`}
                  className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-2.5 rounded-xl transition text-xs font-semibold border border-white/5 truncate"
                >
                  <Mail size={14} className="text-[#3fd080] flex-shrink-0" />
                  <span className="truncate">{common.email}</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
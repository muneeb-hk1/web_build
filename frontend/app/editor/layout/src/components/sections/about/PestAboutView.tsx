"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import siteData from "../../../data/pestContent";

export default function About({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const aboutData = {
    ...(pestControl?.sections?.About?.variants?.PestAbout1 || {}),
    ...data,
  };

  const badge = aboutData.badge || "ABOUT US";
  const title = aboutData.title || "Your Trusted Partner in";
  const titleHighlight = aboutData.titleHighlight || "Pest Control";
  const subtitle =
    aboutData.subtitle ||
    "We are a professional pest control company committed to creating healthier and safer spaces for your home and business.";
  const description =
    aboutData.description ||
    "With years of experience in the industry, we provide reliable and effective pest control solutions for residential, commercial, and industrial properties. Our team uses safe, eco-friendly methods and advanced equipment to ensure long-lasting protection from unwanted pests.";
  const highlights: string[] = aboutData.highlights || [
    "Experienced and trained pest control professionals.",
    "Safe, effective and eco-friendly pest control solutions.",
    "Customized services for homes, offices, and industries.",
  ];
  const image =
    aboutData.image ||
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-[#3fd080]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[480px] h-[480px] bg-[#00482B]/10 rounded-full blur-[110px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <div className="lg:col-span-6 w-full">
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-xs border border-neutral-100">
            <Image
              src={image}
              alt="Pest Control Specialist"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="inline-block bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-xs">
            {badge}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold text-neutral-900 tracking-tight leading-tight mb-3">
            {title} <br className="hidden sm:inline" />
            <span className="text-[#00482B]">{titleHighlight}</span>
          </h2>

          <p className="text-neutral-900 font-semibold text-[15px] sm:text-[16px] leading-snug mb-2.5">
            {subtitle}
          </p>

          <p className="text-neutral-600 text-[14px] sm:text-[15px] leading-relaxed mb-5 font-normal">
            {description}
          </p>

          <div className="flex flex-col gap-2.5 w-full">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00482B] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                  <Check size={12} strokeWidth={3.5} />
                </div>
                <span className="text-[14px] sm:text-[14.5px] font-medium text-neutral-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
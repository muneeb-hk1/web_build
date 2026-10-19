"use client";
import Link from "../header/PestLink";
import { ChevronRight, Phone, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import siteData from "../../../data/pestContent";
import { servicesData as fallbackServices } from "../../../data/pestServicesData";

export default function PestServiceDetails1() {
  const slug = "ant-control";

  // 1. Dynamic Extraction from websiteData.json
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const servicesSection =
    pestControl?.sections?.Services?.variants?.PestServices1 ||
    pestControl?.sections?.ServicesGrid?.variants?.PestServicesGrid1 ||
    {};

  const jsonServices: any[] =
    servicesSection?.items || servicesSection?.services || [];

  // Combine JSON items with fallback list
  const allServices = (jsonServices.length > 0 ? jsonServices : fallbackServices).map(
    (item: any, idx: number) => {
      const name = item.name || item.title || `Service ${idx + 1}`;
      const serviceSlug =
        item.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      return {
        slug: serviceSlug,
        name,
        image:
          item.image ||
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
        heading: item.heading || `${name} Protection & Prevention`,
        desc1:
          item.desc1 ||
          item.description ||
          "We offer comprehensive, eco-friendly pest elimination solutions customized to your residential or commercial space.",
        desc2:
          item.desc2 ||
          "Our certified technicians inspect hidden hotspots, eliminate pest colonies, and implement proactive barriers to ensure long-term, odorless protection.",
        keyBenefits: item.keyBenefits || [
          "Rapid turnaround with guaranteed inspection",
          "Child, pet and plant-safe botanical chemicals",
          "Certified pest technicians with advanced equipment",
          "Long-term post-treatment prevention coverage",
        ],
      };
    }
  );

  const currentService = allServices.find((s) => s.slug === slug);

  if (!currentService) {
    return null;
  }

  // 2. Dynamic Contact info from common / footer
  const common = (siteData as any).common || {};
  const footerData = pestControl?.sections?.Footer?.variants?.PestFooter1 || {};
  const rawPhone = String(
    footerData.phone || common.phone || "+1 00000 00000"
  );
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#00482B] selection:text-white">
      {/* Dynamic Title and Breadcrumbs mapped to currentService */}
      {/* Standardized Spacing: pt-4 sm:pt-6 md:pt-8 to eliminate empty gap */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 sm:pt-6 md:pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Left Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Hero Image */}
            <div className="relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-md border border-neutral-100 group">
              <img
                src={currentService.image}
                alt={currentService.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* High-Emphasis Key Benefits Card */}
            <div className="relative rounded-3xl p-6 sm:p-8 md:p-9 bg-gradient-to-br from-[#eef9f3] via-[#f4fbf7] to-[#e4f4ec] border-2 border-[#3fd080]/60 shadow-lg overflow-hidden">
              {/* Mint ambient glow */}
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#3fd080]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#00482B]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header with Glowing Icon Badge */}
              <div className="relative z-10 flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#003822] text-[#3fd080] flex items-center justify-center shadow-md flex-shrink-0">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#00482B] block">
                    Why Choose This Solution
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#003822] tracking-tight">
                    Key Service Benefits
                  </h3>
                </div>
              </div>

              {/* Benefit Cards Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {currentService.keyBenefits?.map((benefit: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-[#3fd080]/30 shadow-xs hover:shadow-md hover:border-[#3fd080]/60 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#003822] text-[#3fd080] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <CheckCircle2 size={16} strokeWidth={2.6} />
                    </div>
                    <p className="text-[14px] sm:text-[15px] font-bold text-neutral-800 leading-snug">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Deep Dive Text */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                {currentService.heading}
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg font-medium leading-relaxed">
                {currentService.desc1}
              </p>
              {currentService.desc2 && (
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {currentService.desc2}
                </p>
              )}
            </div>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6 self-start">
            
            {/* All Services Navigation Box */}
            <div className="bg-[#003822] rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10">
              <h3 className="text-white font-black text-xl tracking-tight mb-5 px-1 flex items-center gap-2">
                <span>Our Services</span>
                <span className="w-2 h-2 rounded-full bg-[#3fd080] animate-pulse" />
              </h3>

              <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {allServices.map((service) => {
                  const isActive = service.slug === currentService.slug;

                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-between transition-all duration-200 ${
                        isActive
                          ? "bg-[#3fd080] text-black shadow-md font-extrabold translate-x-1"
                          : "bg-white/95 text-neutral-900 hover:bg-white hover:text-[#00482B] hover:translate-x-1"
                      }`}
                    >
                      <span className="truncate pr-2">{service.name}</span>
                      <ChevronRight
                        size={17}
                        strokeWidth={2.8}
                        className={isActive ? "text-black" : "text-[#00482B]"}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact CTA Card */}
            <div className="relative rounded-3xl p-6 sm:p-7 text-white text-center shadow-xl overflow-hidden bg-gradient-to-b from-[#003822] to-[#04281a] border border-white/10">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3fd080]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="w-11 h-11 rounded-2xl bg-[#3fd080]/20 border border-[#3fd080]/40 flex items-center justify-center mx-auto mb-3.5 text-[#3fd080]">
                <ShieldCheck size={24} />
              </div>

              <p className="text-[11px] font-black uppercase tracking-widest text-[#3fd080] mb-1">
                Emergency Support
              </p>
              
              <h4 className="text-xl sm:text-2xl font-black tracking-tight mb-2.5">
                Need {currentService.name}?
              </h4>

              <p className="text-xs sm:text-[13px] text-neutral-300 font-medium mb-5">
                Get an instant inspection scheduled with our certified specialists.
              </p>

              <a
                href={`tel:${cleanPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#3fd080] hover:bg-[#34b66f] text-black font-black text-sm sm:text-base py-3 px-5 rounded-2xl shadow-lg transition-transform duration-200 active:scale-95"
              >
                <Phone size={17} strokeWidth={2.5} />
                <span className="truncate">{rawPhone}</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      </main>
  );
}
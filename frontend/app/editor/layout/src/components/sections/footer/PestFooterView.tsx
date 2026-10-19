"use client";

import Image from "next/image";
import Link from "../header/PestLink";
import { ChevronRight, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import siteData from "../../../data/pestContent";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getHiddenManagerFamilies } from "../../../lib/navVisibility";

export default function Footer({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const preview = useOptionalPreview();
  const hiddenFamilies = getHiddenManagerFamilies(preview?.pageLinks);
  const common = (siteData as any).common || {};
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const footerData = {
    ...(pestControl?.sections?.Footer?.variants?.PestFooter1 || {}),
    ...data,
  };
  const servicesData =
    pestControl?.sections?.Services?.variants?.PestServices1 ||
    pestControl?.sections?.ServicesGrid?.variants?.PestServicesGrid1 ||
    {};

  const aboutText =
    footerData?.about ||
    footerData?.description ||
    common?.description ||
    "We provide safe, effective and eco-friendly pest control solutions for homes, offices and commercial spaces. Our goal is to create a healthier and pest-free environment for you.";

  const locationText = footerData?.location || common?.address || "";
  const phoneText = footerData?.phone || common?.phone || "";
  const emailText = footerData?.email || common?.email || "";
  const copyrightText =
    footerData?.copyright ||
    `© 2026 ${common?.siteName || "PestControl"}. All Rights Reserved.`;

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ].filter((item) => {
    const label = item.label.toLowerCase();
    if (hiddenFamilies.has("services") && /\bservices?\b/.test(label)) return false;
    if (hiddenFamilies.has("blogs") && /\bblogs?\b/.test(label)) return false;
    if (hiddenFamilies.has("gallery") && /\bgallery\b/.test(label)) return false;
    return true;
  });

  const servicesList: Array<{ name: string; slug: string }> =
    servicesData?.services ||
    servicesData?.items || [
      { name: "Residential Pest Control", slug: "residential-pest-control" },
      { name: "Commercial Pest Control", slug: "commercial-pest-control" },
      { name: "Termite Control", slug: "termite-control" },
      { name: "Rodent Control", slug: "rodent-control" },
      { name: "Mosquito Control", slug: "mosquito-control" },
      { name: "Bed Bug Treatment", slug: "bed-bug-control" },
      { name: "Fumigation Services", slug: "fumigation-services" },
    ];

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#003822] text-white pt-12 pb-8 overflow-hidden border-t border-[#00482B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-neutral-800/80">
          
          {/* Column 1: Brand Logo & About */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <Link href="/" className="mb-6 inline-block">
              <div className="inline-flex items-center justify-center bg-[#eef9f3] px-4 py-2 rounded-2xl border border-[#3fd080]/30 shadow-xs">
                <Image
                  src="/categories/petcare/logo.jpeg"
                  alt={common?.siteName || "PestControl"}
                  width={280}
                  height={76}
                  priority
                  className="h-14 sm:h-16 md:h-[68px] w-auto object-contain brightness-125 contrast-125 [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.2))]"
                />
              </div>
            </Link>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              {aboutText}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h4 className="text-white font-bold text-lg tracking-tight">
                Quick Links
              </h4>
              <span className="block w-9 h-[2.5px] bg-[#3fd080] mt-2 rounded-full" />
            </div>

            <ul className="flex flex-col gap-3 text-sm text-neutral-300">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 hover:text-[#3fd080] transition group"
                  >
                    <ChevronRight
                      size={14}
                      className="text-[#3fd080] group-hover:translate-x-0.5 transition-transform"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hiddenFamilies.has("services") ? null : (
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h4 className="text-white font-bold text-lg tracking-tight">
                Our Services
              </h4>
              <span className="block w-9 h-[2.5px] bg-[#3fd080] mt-2 rounded-full" />
            </div>

            <ul className="flex flex-col gap-3 text-sm text-neutral-300">
              {servicesList.slice(0, 7).map((svc, idx) => {
                const svcName = svc.name || (svc as any).title;
                const svcSlug =
                  svc.slug ||
                  svcName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <li key={svcSlug || idx}>
                    <Link
                      href={`/services/${svcSlug}`}
                      className="inline-flex items-center gap-2 hover:text-[#3fd080] transition group"
                    >
                      <ChevronRight
                        size={14}
                        className="text-[#3fd080] group-hover:translate-x-0.5 transition-transform"
                      />
                      <span>{svcName}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          )}

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h4 className="text-white font-bold text-lg tracking-tight">
                Contact Us
              </h4>
              <span className="block w-9 h-[2.5px] bg-[#3fd080] mt-2 rounded-full" />
            </div>

            <div className="flex flex-col gap-5 text-sm">
              {locationText && (
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#3fd080] text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin size={18} strokeWidth={2.4} />
                  </div>
                  <p className="font-bold text-white leading-snug">
                    {locationText}
                  </p>
                </div>
              )}

              {phoneText && (
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#3fd080] text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone size={18} strokeWidth={2.4} />
                  </div>
                  <a
                    href={`tel:${String(phoneText).replace(/\s+/g, "")}`}
                    className="font-bold text-white hover:text-[#3fd080] transition leading-snug"
                  >
                    {phoneText}
                  </a>
                </div>
              )}

              {emailText && (
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#3fd080] text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail size={18} strokeWidth={2.4} />
                  </div>
                  <a
                    href={`mailto:${String(emailText)}`}
                    className="font-bold text-white hover:text-[#3fd080] transition leading-snug truncate max-w-[210px]"
                  >
                    {emailText}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-neutral-400">
            {copyrightText}
          </p>

          <div className="flex items-center gap-3">
            <a
              href={common?.socialLinks?.facebook || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-[#3fd080] text-black flex items-center justify-center hover:bg-[#34b66f] transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            <a
              href={common?.socialLinks?.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#3fd080] text-black flex items-center justify-center hover:bg-[#34b66f] transition"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href={`https://wa.me/${String(phoneText || common?.phone || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-[#3fd080] text-black flex items-center justify-center hover:bg-[#34b66f] transition"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              </svg>
            </a>

            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Scroll to top"
              className="w-9 h-9 rounded-full bg-[#3fd080] text-black flex items-center justify-center hover:bg-[#34b66f] transition cursor-pointer ml-1"
            >
              <ArrowUp size={16} strokeWidth={2.8} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
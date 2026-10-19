"use client";

import Link, { usePestPath } from "./PestLink";
import { MapPin, Phone, Mail } from "lucide-react";
import siteData from "../../../data/pestContent";

export default function TopBar({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const common = (siteData as any).common || {};
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const fallback = pestControl?.sections?.Topbar?.variants?.PestTopbar1 || {};
  const topbarData = { ...fallback, ...data };

  const phone = common.phone || topbarData.phone || "+91 98765 43210";
  const email = common.email || topbarData.email || "support@pestcontrol.com";
  const address =
    topbarData.address ||
    common.address ||
    topbarData.location ||
    "Delhi NCR, India";

  const quoteLink =
    topbarData.buttons?.[0]?.href || topbarData.quoteButtonLink || "/quote";
  const quoteText =
    topbarData.buttons?.[0]?.label || topbarData.quoteButtonText || "GET A QUOTE";

  const backgroundType =
    topbarData.topbarBackgroundType === "gradient" ? "gradient" : "solid";
  const solidColor =
    typeof topbarData.topbarBackgroundColor === "string" &&
    topbarData.topbarBackgroundColor
      ? topbarData.topbarBackgroundColor
      : "#00482B";
  const gradientColor =
    typeof topbarData.topbarGradientColor === "string" &&
    topbarData.topbarGradientColor
      ? topbarData.topbarGradientColor
      : "#0668FF";
  const textColor =
    typeof topbarData.topbarTextColor === "string" && topbarData.topbarTextColor
      ? topbarData.topbarTextColor
      : "#ffffff";

  return (
    <div
      className="py-2.5 px-4 sm:px-6 md:px-8 border-b border-white/10 hidden md:block"
      style={{
        background:
          backgroundType === "gradient"
            ? `linear-gradient(90deg, ${solidColor}, ${gradientColor})`
            : solidColor,
        color: textColor,
      }}
    >
      {/* max-w-[1240px] container prevents the stretched/spread-out look */}
      <div className="max-w-[1240px] mx-auto flex items-center justify-between">
        
        {/* Left Section: Crisp White Icons & Balanced Text */}
        <div className="flex items-center gap-5 lg:gap-6 text-white text-[13px] font-medium tracking-normal">
          
          {/* Address */}
          <div className="flex items-center gap-2 text-white/95">
            <MapPin size={15} className="text-white fill-white/20 flex-shrink-0" />
            <span className="truncate max-w-[260px] lg:max-w-none">{address}</span>
          </div>

          <span className="text-white/30 text-xs font-light">|</span>

          {/* Phone */}
          <a
            href={`tel:${String(phone).replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-white hover:text-[#3fd080] transition"
          >
            <Phone size={14} className="text-white fill-white flex-shrink-0" />
            <span className="font-semibold">{phone}</span>
          </a>

          <span className="text-white/30 text-xs font-light">|</span>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-white/95 hover:text-[#3fd080] transition"
          >
            <Mail size={14} className="text-white flex-shrink-0" />
            <span className="truncate max-w-[220px] lg:max-w-none">{email}</span>
          </a>
        </div>

        {/* Right Section: Compact GET A QUOTE Button */}
        <div>
          <Link
            href={quoteLink}
            className="bg-white text-[#00482B] hover:bg-[#3fd080] hover:text-black font-extrabold text-xs px-5 py-2 rounded-md tracking-wider transition-all duration-200 shadow-xs inline-block uppercase"
          >
            {quoteText}
          </Link>
        </div>

      </div>
    </div>
  );
}
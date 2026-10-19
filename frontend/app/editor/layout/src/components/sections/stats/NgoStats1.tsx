"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { site, type NGOStatsDataData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

export interface StatItem {
  id?: string | number;
  number: string | number;
  suffix?: string;
  title: string;
  iconName?: string;
}

export interface StatsProps extends SectionProps {}

const renderStatIcon = (iconName?: string) => {
  return <EditableNgoIcon name={iconName || "users"} className="w-6 h-6 text-white" />;
};

// Animated Counter Sub-Component
function AnimatedCounter({
  value,
  isVisible,
}: {
  value: string | number;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  // Extract raw numeric value and non-numeric letters (e.g. "80K" -> target 80, letter "K")
  const strVal = String(value);
  const targetNumber = parseFloat(strVal.replace(/[^0-9.]/g, "")) || 0;
  const letterSuffix = strVal.replace(/[0-9.]/g, "");

  useEffect(() => {
    // Only start counting once the section becomes visible
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds animation duration

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease-out quad formula for smooth deceleration
      const easeOutProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutProgress * targetNumber));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [targetNumber, isVisible]);

  return (
    <span>
      {count}
      {letterSuffix}
    </span>
  );
}

export default function NgoStats1({ data: customData }: StatsProps) {
  const custom = (customData ?? {}) as Partial<NGOStatsDataData>;
  const data = {
    ...site.statsData,
    ...custom,
    stats: custom.stats?.length ? custom.stats : site.statsData.stats,
  };
  const {
    stats = [],
    bgImage = "/NGO_Images/happy-diverse-kinds-park.jpg",
  } = (data as any);

  // Scroll visibility observer state & ref
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once triggered
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 } // Triggers when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-editor-section-label="Stats"
      data-editor-fields="bgImage stats"
      className="relative w-full overflow-hidden mt-8 font-sans py-5 md:py-12 px-4 sm:px-6 lg:px-12 bg-[#0B2219]"
    >
      {/* Background Image with Overlay — pointer-events-none so canvas
          section plate / Edit modal are not stolen by full-bleed media hover. */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src={bgImage || "/NGO_Images/happy-diverse-kinds-park.jpg"}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center grayscale contrast-125 opacity-80"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0B2219 0%, #0B2219 35%, rgba(11, 34, 25, 0.85) 60%, rgba(11, 34, 25, 0.3) 100%)",
          }}
        />
      </div>

      {/* Stats Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((item: any, index: number) => {
            const isLast = index === stats.length - 1;

            return (
              <div
                key={item.id || index}
                className="relative flex flex-col items-center justify-center text-center px-4 py-4 lg:py-0"
              >
                {/* Outlined Circle Icon */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-white/40 flex items-center justify-center mb-6 bg-black/10 backdrop-blur-[2px]">
                  {renderStatIcon(item.iconName)}
                </div>

                {/* Stat Number with Animated Increment */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                  <AnimatedCounter value={item.number} isVisible={isVisible} />{" "}
                  {item.suffix || "+"}
                </h3>

                {/* Title */}
                <p className="text-sm sm:text-base font-medium text-gray-200 tracking-wide">
                  {item.title}
                </p>

                {!isLast && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-3/4 w-[1px] border-r-2 border-dashed border-[#E2B859]/70" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsProps } from '../header/electricalTypes';
import { fadeUp, stagger, inView } from '../header/electricalMotion';

function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: value };
  return { target: Number(match[1]), suffix: match[2] };
}

function CountUp({ value }: { value: string }) {
  const { target, suffix } = parseStat(value);
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    started.current = false;
    setN(0);

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1600;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, value]);

  return (
    <div ref={ref} className="text-[40px] font-extrabold leading-none sm:text-[44px]">
      {n}
      {suffix}
    </div>
  );
}

export default function Stats({ data }: StatsProps) {
  if (!data?.items?.length) return null;

  return (
    <section className="relative overflow-hidden py-8 sm:py-10">
      <img
        src="/categories/electrical/hero/darkblue.png"
        alt=""
        data-editor-no-media="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#06243b]/45" />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-5 sm:px-8 lg:grid-cols-4 lg:gap-5"
      >
        {data.items.map((item, index) => {
          const iconName =
            (
              {
                "arrow-left": "ArrowLeft",
                "arrow-right": "ArrowRight",
                plus: "Plus",
                phone: "Phone",
                mail: "Mail",
                "external-link": "ExternalLink",
                none: "Users",
              } as Record<string, string>
            )[item.icon] || item.icon;
          const Icon =
            (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] ||
            LucideIcons.Users;

          return (
            <motion.div
              key={`${item.label || "stat"}-${index}`}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative flex min-h-[200px] flex-col items-center justify-center rounded-[4px] border-2 border-white px-5 py-9 text-center text-white sm:min-h-[220px] sm:py-10"
            >
              <span className="absolute left-[-2px] top-1/2 h-[52%] w-[5px] -translate-y-1/2 bg-[#1B8A3E]" />
              <span className="absolute right-[-2px] top-1/2 h-[52%] w-[5px] -translate-y-1/2 bg-[#1B8A3E]" />

              <Icon className="mb-4 text-[#1B8A3E]" size={48} strokeWidth={1.8} />
              <CountUp value={item.value || "0+"} />
              <div className="mt-2.5 text-[14px] font-medium text-white">{item.label || "New stat"}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

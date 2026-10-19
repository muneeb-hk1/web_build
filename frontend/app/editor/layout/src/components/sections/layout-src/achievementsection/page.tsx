"use client";

import { useEffect, useState, useRef } from "react";
import { PartyPopper, Users, Award, LucideIcon } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { achievements } = siteData;

const iconMap: Record<string, LucideIcon> = {
  PartyPopper,
  Users,
  Award,
};

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");
  const num = parseFloat(value);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, num, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplay(Math.floor(latest).toString());
        },
      });
      return controls.stop;
    }
  }, [inView, num]);

  return <span ref={ref}>{display}</span>;
}

export default function AchievementSection({
  items,
}: {
  items?: typeof achievements.items;
}) {
  const mappedAchievements = (items?.length ? items : achievements.items).map(
    (item) => ({
      ...item,
      icon: iconMap[item.iconName] || PartyPopper,
    }),
  );

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14">
          {mappedAchievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex items-start gap-5 lg:gap-6"
              >
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[16px] bg-[#E8F4EE] text-[#138A56] lg:h-[85px] lg:w-[85px]">
                  <Icon size={38} strokeWidth={1.5} />
                </div>
                <div className="mt-1">
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <h3 className="text-[42px] leading-none font-extrabold tracking-tight text-[#138A56] lg:text-[48px]">
                      <Counter value={item.value} />
                    </h3>
                    <span className="text-[18px] font-semibold text-[#138A56] lg:text-[22px]">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#6B7280] lg:text-[14px]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

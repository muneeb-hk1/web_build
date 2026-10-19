'use client';

import React from 'react';
import Link from '../header/ElectricalLink';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { WhyChooseProps } from '../header/electricalTypes';
import { fadeUp, stagger, inView } from '../header/electricalMotion';

export default function WhyChoose({
  data,
  mediaField = "image",
}: WhyChooseProps & { mediaField?: string }) {
  if (!data) return null;

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-[52px] lg:py-[60px]">
      <div className="relative mx-auto grid max-w-[1280px] items-start gap-8 px-5 sm:gap-10 sm:px-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12 xl:gap-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <div className="mb-3 flex items-center gap-2 sm:gap-3">
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
            <span data-editor-inline-format-key="electrical-why:subtitle" className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-[#1B8A3E] sm:text-[13px] sm:tracking-[2.2px]">
              {data.subtitle}
            </span>
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
          </div>

          <h2 className="mb-3 max-w-[540px] text-[24px] font-extrabold leading-[1.2] text-[#0b2540] sm:mb-4 sm:text-[36px] lg:text-[44px]">
            <span data-editor-inline-format-key="electrical-why:title_line1">{data.title_line1}</span>
            <br />
            {data.title_line2 ? <span data-editor-inline-format-key="electrical-why:title_line2">{data.title_line2} </span> : null}
            <span className="text-[#1B8A3E]" data-editor-inline-format-key="electrical-why:title_highlight">{data.title_highlight}</span>
          </h2>

          <p data-editor-inline-format-key="electrical-why:description" className="mb-6 max-w-[520px] text-[13px] leading-[1.75] text-[#6b7285] sm:mb-8 sm:text-[15px]">
            {data.description}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-[560px] lg:mx-0"
          >
            <div className="pointer-events-none absolute -left-[6px] -top-[6px] h-[58%] w-[72%] rounded-[22px] border-[7px] border-[#1B8A3E] sm:-left-[10px] sm:-top-[10px] sm:rounded-[28px] sm:border-[9px]" />
            <div className="pointer-events-none absolute -bottom-[6px] -right-[6px] h-[42%] w-[78%] rounded-[22px] bg-[#1B8A3E] sm:-bottom-[10px] sm:-right-[10px] sm:rounded-[28px]" />

            <div className="relative z-10 overflow-hidden rounded-[18px] sm:rounded-[22px]">
              <img
                src={data.image}
                data-editor-media="true"
                data-editor-media-role={mediaField}
                alt=""
                className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[360px]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 mt-6 flex items-center gap-3 rounded-[16px] bg-[#eaf8ef] px-4 py-3.5 sm:mt-8 sm:gap-4 sm:rounded-[18px] sm:px-5 sm:py-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#1B8A3E] sm:h-12 sm:w-12">
              <Users size={24} strokeWidth={1.8} />
            </span>
            <span className="h-9 w-px bg-[#cfe8d8] sm:h-10" />
            <div>
              <p className="text-[14px] font-extrabold leading-snug text-[#0b2540] sm:text-[16px]">
                {data.badge_title}
              </p>
              <p className="mt-0.5 text-[12px] text-[#6b7285] sm:text-[13px]">{data.badge_text}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="relative pt-1"
        >
          <div className="pointer-events-none absolute bottom-[72px] left-[18px] top-[22px] hidden w-px border-l-2 border-dashed border-[#1B8A3E]/55 sm:left-[22px] md:block" />

          <div className="space-y-3 sm:space-y-4">
            {data.items.map((item, i) => {
              const Icon =
                (LucideIcons as unknown as Record<string, React.ElementType>)[item.icon] ||
                LucideIcons.Check;
              const isClock = item.icon === 'Clock';

              return (
                <motion.div
                  key={item.number}
                  variants={fadeUp}
                  whileHover={{ x: 4 }}
                  className="relative flex items-center gap-2.5 sm:gap-4"
                >
                  <span className="relative z-10 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#1B8A3E] text-[13px] font-extrabold text-white sm:h-[44px] sm:w-[44px] sm:rounded-[12px] sm:text-[15px]">
                    {item.number}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[16px] bg-[#f3f6f8] px-3 py-3 sm:gap-5 sm:rounded-[18px] sm:px-6 sm:py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1B8A3E] shadow-[0_4px_14px_rgba(15,40,70,0.06)] sm:h-[62px] sm:w-[62px]">
                      {isClock ? (
                        <span className="text-center text-[12px] font-extrabold leading-none tracking-tight sm:text-[14px]">
                          24/7
                        </span>
                      ) : (
                        <Icon size={22} className="sm:hidden" strokeWidth={1.8} />
                      )}
                      {!isClock && (
                        <Icon size={30} className="hidden sm:block" strokeWidth={1.8} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-0.5 text-[14px] font-extrabold leading-snug text-[#0b2540] sm:mb-1 sm:text-[19px]">
                        {item.title}
                      </h3>
                      <p className="text-[12px] leading-[1.55] text-[#6b7285] sm:text-[15px] sm:leading-[1.6]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-5 inline-block sm:mt-6">
            <Link
              href={data.button.href}
              className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#1B8A3E] px-6 text-[12px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#146C31] sm:h-[46px] sm:px-7 sm:text-[13px]"
            >
              {data.button.text}
              <ArrowRight size={16} strokeWidth={2.6} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from '../header/ElectricalLink';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { WorkProcessProps } from '../header/electricalTypes';
import { fadeUp, stagger, inView } from '../header/electricalMotion';

function DashArrow() {
  return (
    <motion.svg
      className="pointer-events-none absolute -right-[18%] top-[48px] z-20 hidden h-[58px] w-[38%] text-[#94a3b8] lg:block"
      viewBox="0 0 100 58"
      fill="none"
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <path
        d="M6 48 C 28 8, 62 4, 82 28"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeDasharray="4.5 5.5"
        strokeLinecap="round"
      />
      <path
        d="M70 20 L86 32 L72 36"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function MobileArrow() {
  return (
    <div className="flex justify-center py-1 sm:hidden" aria-hidden>
      <svg viewBox="0 0 28 36" className="h-8 w-6 text-[#94a3b8]">
        <path
          d="M14 2 C 14 12, 14 18, 14 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="3.5 4.5"
          strokeLinecap="round"
        />
        <path
          d="M8 22 L14 30 L20 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function WorkProcess({ data }: WorkProcessProps) {
  if (!data) return null;

  return (
    <section className="relative bg-white py-10 sm:py-[52px] lg:py-[60px]">
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-8 text-center sm:mb-12 lg:mb-14"
        >
          <div className="mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
            <Settings size={15} className="shrink-0 text-[#1B8A3E]" strokeWidth={2.2} />
            <span data-editor-inline-format-key="electrical-work:subtitle" className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-[#1B8A3E] sm:text-[13px] sm:tracking-[2.2px]">
              {data.subtitle}
            </span>
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
          </div>
          <h2 className="text-[24px] font-extrabold leading-[1.2] text-[#0b2540] sm:text-[36px] lg:text-[44px]">
            <span data-editor-inline-format-key="electrical-work:title_line1">{data.title_line1}</span>{' '}
            <span className="text-[#1B8A3E]" data-editor-inline-format-key="electrical-work:title_highlight">{data.title_highlight}</span>
          </h2>
          {data.description && (
            <p data-editor-inline-format-key="electrical-work:description" className="mx-auto mt-3 max-w-[560px] px-1 text-[13px] leading-[1.75] text-[#6b7285] sm:text-[15px]">
              {data.description}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8"
        >
          {data.steps.map((step, i) => {
            const Icon =
              (LucideIcons as unknown as Record<string, React.ElementType>)[step.icon] ||
              LucideIcons.Check;
            const isAccent = i % 2 === 1;

            return (
              <div key={step.number}>
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="relative mx-auto w-full max-w-[340px] sm:max-w-none"
                >
                  {i < data.steps.length - 1 && <DashArrow />}

                  <div
                    className={`relative rounded-[22px] px-3 py-5 text-center sm:px-2.5 ${
                      isAccent ? 'bg-[#eef8f1]' : 'bg-[#f3f6f8]'
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 16 }}
                      className="relative mx-auto mb-3 h-[78px] w-[78px]"
                    >
                      <span
                        className={`absolute -left-1.5 -top-1.5 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full text-[14px] font-extrabold text-white ${
                          isAccent ? 'bg-[#1B8A3E]' : 'bg-[#0b2540]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#0b2540] shadow-[0_8px_24px_rgba(15,40,70,0.06)]">
                        <Icon
                          size={30}
                          strokeWidth={1.7}
                          className={isAccent ? 'text-[#1B8A3E]' : 'text-[#0b2540]'}
                        />
                      </span>
                    </motion.div>

                    <h3 className="mb-2 text-[16px] font-extrabold text-[#0b2540] sm:text-[18px]">
                      {step.title}
                    </h3>
                    <p className="mx-auto max-w-[260px] text-[13px] leading-[1.65] text-[#6b7285] sm:max-w-[220px] sm:text-[14px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {i < data.steps.length - 1 && <MobileArrow />}
              </div>
            );
          })}
        </motion.div>

        {data.button && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center sm:mt-10"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href={data.button.href}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-[#1B8A3E] px-7 text-[13px] font-bold text-white hover:bg-[#146C31]"
              >
                {data.button.text}
                <ArrowRight size={16} strokeWidth={2.6} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

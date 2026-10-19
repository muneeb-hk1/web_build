'use client';

import React from 'react';
import Link, { useElectricalPath } from '../header/ElectricalLink';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Headset, Phone, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ServiceDetailsProps, toSlug } from '../header/electricalTypes';
import { fadeUp, inView } from '../header/electricalMotion';

export default function ServiceDetails({ data, allServices, sidebarData }: ServiceDetailsProps) {
  const pathname = useElectricalPath();
  const words = data.title.split(' ');
  const overlayLine1 = data.overlay_line1 || words[0] || data.title;
  const overlayHighlight = data.overlay_highlight || words.slice(1).join(' ');
  const blocks =
    data.content_blocks && data.content_blocks.length
      ? data.content_blocks
      : [
          { title: `${data.title} Services`, text: data.description },
          ...(data.benefits || []).slice(0, 4).map((b) => ({
            title: b.title,
            text: b.description,
          })),
        ];

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-[60px]">
      <div className="mx-auto grid max-w-[1280px] items-start gap-8 px-5 sm:px-8 lg:grid-cols-[300px_1fr] lg:gap-10 xl:grid-cols-[320px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={inView}
          className="order-2 space-y-5 lg:sticky lg:top-0 lg:order-1 lg:self-start"
        >
          <div className="rounded-[22px] bg-[#0b2540] px-5 py-6 sm:px-6 sm:py-7">
            <h3 className="text-[20px] font-extrabold text-white">
              {sidebarData?.services_title || 'Our Services'}
            </h3>
            <span className="mb-5 mt-2 block h-[3px] w-10 rounded-full bg-[#1B8A3E]" />
            <div className="space-y-1.5">
              {allServices.map((s) => {
                const href = s.link || `/services/${toSlug(s.title)}`;
                const active =
                  pathname === href ||
                  pathname === `/${toSlug(s.title)}` ||
                  pathname.endsWith(`/${toSlug(s.title)}`);
                const Icon =
                  (LucideIcons as unknown as Record<string, React.ElementType>)[s.icon] || Zap;
                return (
                  <Link
                    key={s.title}
                    href={href}
                    className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-[13px] font-semibold transition-colors sm:text-[14px] ${
                      active
                        ? 'bg-[#1B8A3E] font-bold text-white'
                        : 'text-white/90 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-white">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">{s.title}</span>
                    <ChevronRight size={16} className="shrink-0 text-white/80" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[22px] bg-[#0b2540] px-6 py-7 text-white">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center text-[#1B8A3E]">
                <Headset size={32} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-[18px] font-extrabold leading-tight sm:text-[20px]">
                  {sidebarData?.help?.title || 'Need Assistance?'}
                </h3>
                <p className="mt-1 text-[13px] text-white/75">
                  {sidebarData?.help?.description || "We're here to help you."}
                </p>
              </div>
            </div>
            <a
              href={`tel:${(sidebarData?.help?.phone || '').replace(/[^0-9+]/g, '')}`}
              className="mb-5 flex items-center gap-3 text-[18px] font-extrabold tracking-tight sm:text-[20px]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-[#1B8A3E]">
                <Phone size={16} strokeWidth={2.2} />
              </span>
              {sidebarData?.help?.phone}
            </a>
            <Link
              href={sidebarData?.help?.button_href || '/contact'}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-[#1B8A3E] px-6 text-[13px] font-bold text-white hover:bg-[#146C31]"
            >
              {sidebarData?.help?.button_text || 'Contact Us'}
              <ArrowRight size={15} strokeWidth={2.6} />
            </Link>
          </div>
        </motion.aside>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="order-1 lg:order-2">
          <div className="relative mb-8 overflow-hidden rounded-[22px]">
            <img
              src={data.image}
              alt={data.title}
              className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06243b]/88 via-[#06243b]/55 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[3px] text-white sm:text-[12px]">
                {data.badge || 'PROFESSIONAL'}
              </p>
              <h2 className="max-w-[420px] text-[28px] font-extrabold leading-[1.15] text-white sm:text-[36px] lg:text-[42px]">
                {overlayLine1}{' '}
                <span className="text-white">{overlayHighlight}</span>
              </h2>
              {(data.overlay_tagline || data.subtitle) && (
                <p className="mt-3 max-w-[280px] text-[14px] leading-snug text-white sm:text-[15px]">
                  {data.overlay_tagline || data.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-7">
            {blocks.map((block) => (
              <div key={block.title}>
                <h3 className="text-[22px] font-extrabold leading-tight text-[#0b2540] sm:text-[26px]">
                  {block.title}
                </h3>
                <span className="mb-3 mt-2 block h-[3px] w-11 rounded-full bg-[#1B8A3E]" />
                <p className="text-[14px] leading-[1.85] text-[#7a8190] sm:text-[16px]">{block.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

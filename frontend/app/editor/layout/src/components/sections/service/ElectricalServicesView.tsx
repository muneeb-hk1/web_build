'use client';

import React, { useState } from 'react';
import Link, { useElectricalNavigate } from '../header/ElectricalLink';
import { useOptionalPreview } from '../../context/PreviewContext';
import { editorSlug } from '../pet/editorSlug';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { fadeUp, inView } from '../header/electricalMotion';
import { ServicesProps, toSlug } from '../header/electricalTypes';

export default function Services({
  data,
  isGrid = false,
  itemsPerPage = 8,
  showPagination = true,
  bgClass = 'bg-[#f4f7f6]',
}: ServicesProps) {
  const goTo = useElectricalNavigate();
  const preview = useOptionalPreview();
  const [page, setPage] = useState(1);
  if (!data) return null;

  const items = (data.items || []).filter((item) => {
    if (item.active === false) return false;
    if (!isGrid && item.showOnHome === false) return false;
    return true;
  });
  const totalPages = isGrid && showPagination ? Math.ceil(items.length / itemsPerPage) : 1;
  const current = isGrid
    ? items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : items;

  return (
    <section className={`${bgClass} relative overflow-hidden py-10 sm:py-[52px] lg:py-[60px]`}>
      <div
        className="pointer-events-none absolute left-[40px] top-[70px] hidden h-[90px] w-[90px] opacity-50 lg:block"
        style={{
          backgroundImage: 'radial-gradient(#d4dce4 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div className="pointer-events-none absolute left-[-30px] top-[40px] hidden text-[#e8f5ee] lg:block">
        <Zap size={280} strokeWidth={1} />
      </div>
      <div className="pointer-events-none absolute right-[-20px] top-[20px] hidden text-[#eef2f5] lg:block">
        <Zap size={320} strokeWidth={1} />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-[2px] w-10 bg-[#1B8A3E]" />
            <Zap size={16} className="fill-[#1B8A3E] text-[#1B8A3E]" />
            <span data-editor-inline-format-key="electrical-services:subtitle" className="text-[12px] font-extrabold uppercase tracking-[2px] text-[#1B8A3E] sm:text-[14px] sm:tracking-[2.6px]">
              {data.subtitle}
            </span>
            <span className="h-[2px] w-10 bg-[#1B8A3E]" />
          </div>

          <h2 className="mb-3 text-[26px] font-extrabold leading-tight text-[#0b2540] sm:text-[36px] lg:text-[48px]">
            <span data-editor-inline-format-key="electrical-services:title_line1">{data.title_line1}</span>{' '}
            <span className="text-[#1B8A3E]" data-editor-inline-format-key="electrical-services:title_highlight">{data.title_highlight}</span>{' '}
            <span data-editor-inline-format-key="electrical-services:title_line2">{data.title_line2}</span>
          </h2>
          <p data-editor-inline-format-key="electrical-services:description" className="mx-auto max-w-[640px] px-1 text-[14px] leading-[1.7] text-[#6b7285] sm:text-[15px]">{data.description}</p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {current.map((item) => {
            const Icon =
              (LucideIcons as unknown as Record<string, React.ElementType>)[item.icon] ||
              LucideIcons.Zap;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                data-editor-card="true"
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest("button, a")) return;
                  try {
                    window.sessionStorage.setItem(
                      "ai-builder-open-manager-item:Services",
                      JSON.stringify({ title: item.title, href: item.link || "" }),
                    );
                  } catch {
                    /* ignore storage errors */
                  }
                  window.dispatchEvent(
                    new CustomEvent("ai-builder-open-manager", {
                      detail: { manager: "Services", preservePage: true },
                    }),
                  );
                }}
                className="relative cursor-pointer overflow-hidden rounded-[10px] bg-white shadow-[0_14px_40px_rgba(15,40,70,0.1)]"
              >
                <div className="h-[170px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <span className="absolute left-5 top-[170px] z-20 flex h-[56px] w-[56px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1B8A3E]">
                    {item.icon === 'Home' ? (
                      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden>
                        <path
                          d="M8 22.5L24 8l16 14.5V38a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V22.5z"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 18l-3.2 7.2h6.2L24 33"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <Icon size={28} strokeWidth={1.8} />
                    )}
                  </span>

                <div className="flex items-center gap-3 px-5 pb-5 pt-9">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 text-[15px] font-extrabold text-[#0b2540]">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed text-[#6b7285]">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const slug = toSlug(item.title);
                      const compact = (value: string) =>
                        editorSlug(value).replace(/[^a-z0-9]+/g, "");
                      try {
                        sessionStorage.setItem("electrical-active-service", slug);
                      } catch {
                        /* ignore */
                      }
                      const detailPage = preview?.pageLinks
                        .flatMap(function walk(link): NonNullable<typeof preview>["pageLinks"] {
                          return [link, ...(link.children || []).flatMap(walk)];
                        })
                        .find(
                          (link) =>
                            compact(link.label || "") === compact(item.title) ||
                            compact(link.href || "") === compact(slug),
                        );
                      if (detailPage?.label && preview) {
                        preview.setCurrentPage(detailPage.label);
                        return;
                      }
                      goTo(item.link || `/services/${slug}`);
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B8A3E] text-white hover:bg-[#146C31]"
                    aria-label={item.title}
                  >
                    <ArrowRight size={18} strokeWidth={2.4} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {!isGrid && data.button && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              href={data.button.href}
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#1B8A3E] px-8 text-[13px] font-bold uppercase tracking-[0.6px] text-white hover:bg-[#146C31]"
            >
              {data.button.text}
              <ArrowRight size={16} strokeWidth={2.6} />
            </Link>
          </motion.div>
        )}

        {isGrid && showPagination && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                page === 1
                  ? 'cursor-not-allowed bg-[#eef1f4] text-[#c5ccd4]'
                  : 'bg-white text-[#0b2540] shadow-[0_4px_14px_rgba(15,40,70,0.08)] hover:bg-[#1B8A3E] hover:text-white'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.max(totalPages, 1) }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  page === i + 1
                    ? 'bg-[#1B8A3E] text-white shadow-[0_6px_16px_rgba(27,138,62,0.28)]'
                    : 'bg-white text-[#0b2540] shadow-[0_4px_14px_rgba(15,40,70,0.08)] hover:bg-[#1B8A3E] hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, Math.max(totalPages, 1)))}
              disabled={page === Math.max(totalPages, 1)}
              aria-label="Next page"
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                page === Math.max(totalPages, 1)
                  ? 'cursor-not-allowed bg-[#eef1f4] text-[#c5ccd4]'
                  : 'bg-white text-[#0b2540] shadow-[0_4px_14px_rgba(15,40,70,0.08)] hover:bg-[#1B8A3E] hover:text-white'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

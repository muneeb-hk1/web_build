'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PhotoGalleryProps } from '../header/electricalTypes';
import { fadeUp, inView } from '../header/electricalMotion';
import { useOptionalPreview } from '../../context/PreviewContext';

export default function PhotoGallery({ data }: PhotoGalleryProps) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const preview = useOptionalPreview();
  const pageName = (preview?.currentPage || "").toLowerCase();
  const onGalleryPage = pageName.includes("galler");

  const filters = data.filters?.length
    ? data.filters
    : [{ label: 'All Projects', value: 'all' }];
  const perPage = data.items_per_page || 12;

  const filtered = useMemo(() => {
    const source = (data.items || []).filter(
      (item) => onGalleryPage || (item as { showOnHome?: boolean }).showOnHome !== false,
    );
    if (filter === 'all') return source;
    return source.filter((item) => item.category === filter);
  }, [data.items, filter, onGalleryPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const current = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const currentLabel = filters.find((f) => f.value === filter)?.label || 'All Projects';

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const goLightbox = (dir: number) => {
    if (active === null || !filtered.length) return;
    const next = (active + dir + filtered.length) % filtered.length;
    setDirection(dir);
    setActive(next);
  };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') goLightbox(1);
      if (e.key === 'ArrowLeft') goLightbox(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, filtered.length]);

  return (
    <section className="bg-white py-10 sm:py-[52px] lg:py-[60px]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div ref={dropdownRef} className="relative z-20 mb-8 hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[#e5e9ee] bg-white px-4 text-left text-[14px] font-bold text-[#0b2540] shadow-[0_8px_24px_rgba(15,40,70,0.08)]"
          >
            {currentLabel}
            <ChevronDown
              size={18}
              className={`text-[#1B8A3E] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
          {open && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-[14px] border border-[#e5e9ee] bg-white py-1.5 shadow-[0_16px_40px_rgba(15,40,70,0.14)]">
              {filters.map((f) => {
                const isActive = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      setFilter(f.value);
                      setPage(1);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-[14px] font-semibold ${
                      isActive
                        ? 'bg-[#1B8A3E] text-white'
                        : 'text-[#334155] hover:bg-[#eef8f1] hover:text-[#1B8A3E]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {current.map((item, i) => (
            <motion.button
              key={`${item.image}-${i}`}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => {
                setDirection(0);
                setActive((currentPage - 1) * perPage + i);
              }}
              className="overflow-hidden rounded-[14px]"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="h-[140px] w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-[180px] lg:h-[190px]"
              />
            </motion.button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              currentPage === 1
                ? 'cursor-not-allowed bg-[#eef1f4] text-[#c5ccd4]'
                : 'bg-[#eef1f4] text-[#0b2540] hover:bg-[#1B8A3E] hover:text-white'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                currentPage === i + 1
                  ? 'bg-[#1B8A3E] text-white'
                  : 'bg-[#eef1f4] text-[#0b2540] hover:bg-[#1B8A3E] hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              currentPage === totalPages
                ? 'cursor-not-allowed bg-[#eef1f4] text-[#c5ccd4]'
                : 'bg-[#eef1f4] text-[#0b2540] hover:bg-[#1B8A3E] hover:text-white'
            }`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {active !== null && filtered[active] && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div className="absolute inset-0 bg-black/85" />

            <motion.button
              type="button"
              aria-label="Close"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#1B8A3E] sm:right-6 sm:top-6"
            >
              <X size={22} />
            </motion.button>

            {filtered.length > 1 && (
              <motion.button
                type="button"
                aria-label="Previous"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(-1);
                }}
                className="absolute left-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b2540] shadow-lg hover:bg-[#1B8A3E] hover:text-white sm:left-6 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
            )}

            <div className="relative z-10 mx-12 max-h-[82vh] w-full max-w-4xl overflow-hidden sm:mx-16" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={filtered[active].image + active}
                  src={filtered[active].image}
                  alt={filtered[active].alt}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -80, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
                />
              </AnimatePresence>
            </div>

            {filtered.length > 1 && (
              <motion.button
                type="button"
                aria-label="Next"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(1);
                }}
                className="absolute right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b2540] shadow-lg hover:bg-[#1B8A3E] hover:text-white sm:right-6 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

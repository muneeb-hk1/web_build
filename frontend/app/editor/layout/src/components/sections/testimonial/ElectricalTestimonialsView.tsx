'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TestimonialsProps } from '../header/electricalTypes';
import { fadeUp, inView } from '../header/electricalMotion';
import { Star, Quote, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

type Review = TestimonialsProps['data']['reviews'][number];

function ReviewCard({ review, featured }: { review: Review; featured: boolean }) {
  return (
    <div
      className={`h-full rounded-[18px] bg-white px-4 py-5 shadow-[0_12px_40px_rgba(15,40,70,0.08)] sm:px-6 sm:py-6 ${
        featured ? 'border-2 border-[#1B8A3E]' : 'border border-zinc-100'
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <Quote className="text-[#1B8A3E]" size={32} fill="currentColor" strokeWidth={0} />
        <div className="flex gap-[3px] text-[#f5b301]">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={15} fill="currentColor" />
          ))}
        </div>
      </div>

      <p className="mb-6 min-h-0 text-[15px] font-medium italic leading-[1.7] text-[#3d4f63] sm:mb-7 sm:min-h-[108px] sm:text-[16px]">
        “{review.text}”
      </p>

      <div className="flex items-center gap-4">
        <div className="relative h-[68px] w-[68px] shrink-0">
          <span className="absolute -bottom-[3px] -left-[3px] h-[74px] w-[74px] rounded-full border-[3px] border-transparent border-b-[#1B8A3E] border-l-[#1B8A3E]" />
          <img
            src={review.avatar}
            alt={review.author}
            className="relative z-10 h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <div className="text-[17px] font-extrabold leading-tight text-[#0b2540]">{review.author}</div>
          <div className="mt-0.5 text-[14px] font-normal text-[#6b7285]">{review.role}</div>
          <span className="mt-2 block h-[2px] w-9 bg-[#1B8A3E]" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({
  data,
  isGrid = false,
  itemsPerPage = 6,
  showPagination = true,
  bgClass = 'bg-white',
}: TestimonialsProps) {
  const reviews = data.reviews || [];
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const perView = width > 0 ? (width < 640 ? 1 : width < 1024 ? 2 : 3) : 1;
  const totalPages = isGrid && showPagination ? Math.ceil(reviews.length / itemsPerPage) : 1;
  const current =
    isGrid && showPagination
      ? reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      : reviews;

  const slides = reviews.length ? [...reviews, ...reviews.slice(0, perView)] : [];
  const gap = width < 640 ? 12 : 20;
  const cardW = width ? (width - gap * (perView - 1)) / perView : 0;
  const step = cardW + gap;
  const dot = reviews.length ? index % reviews.length : 0;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [isGrid]);

  useEffect(() => {
    if (isGrid || reviews.length < 2) return;
    const id = window.setInterval(() => {
      setAnim(true);
      setIndex((i) => i + 1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [isGrid, reviews.length]);

  useEffect(() => {
    if (index !== reviews.length) return;
    const t = window.setTimeout(() => {
      setAnim(false);
      setIndex(0);
    }, 700);
    return () => window.clearTimeout(t);
  }, [index, reviews.length]);

  const goNext = () => {
    if (!reviews.length) return;
    setAnim(true);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!reviews.length) return;
    if (index === 0) {
      setAnim(false);
      setIndex(reviews.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setAnim(true);
          setIndex(reviews.length - 1);
        });
      });
      return;
    }
    setAnim(true);
    setIndex((i) => i - 1);
  };

  return (
    <section className={`${bgClass} relative overflow-hidden py-10 sm:py-[52px] lg:py-[60px]`} id="testimonials">
      <div
        className="pointer-events-none absolute left-[36px] top-[70px] hidden h-[90px] w-[90px] opacity-50 lg:block"
        style={{
          backgroundImage: 'radial-gradient(#d4dce4 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />
      <Quote
        className="pointer-events-none absolute right-[40px] top-[70px] hidden text-[#e8f3ec] lg:block"
        size={140}
        strokeWidth={1.2}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-8 text-center sm:mb-12"
        >
          <div className="mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-10" />
            <Zap size={14} className="fill-[#1B8A3E] text-[#1B8A3E] sm:h-4 sm:w-4" />
            <span data-editor-inline-format-key="electrical-testimonials:subtitle" className="text-[12px] font-extrabold uppercase tracking-[2px] text-[#1B8A3E] sm:text-[14px] sm:tracking-[2.6px]">
              {data.subtitle}
            </span>
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-10" />
          </div>

          <h2 className="mb-3 text-[26px] font-extrabold leading-tight text-[#0b2540] sm:text-[36px] lg:text-[48px]">
            <span data-editor-inline-format-key="electrical-testimonials:title_line1">{data.title_line1}</span>{' '}
            <span className="text-[#1B8A3E]">
              <span data-editor-inline-format-key="electrical-testimonials:title_highlight">{data.title_highlight}</span>{' '}
              <span data-editor-inline-format-key="electrical-testimonials:title_line2">{data.title_line2}</span>
            </span>
          </h2>
          <p data-editor-inline-format-key="electrical-testimonials:description" className="mx-auto max-w-[640px] px-1 text-[14px] leading-[1.7] text-[#6b7285] sm:text-[15px]">{data.description}</p>
        </motion.div>

        {isGrid ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((review, i) => (
              <ReviewCard key={`${review.author}-${i}`} review={review} featured={i === 1} />
            ))}
          </div>
        ) : (
          <div ref={wrapRef} className="overflow-hidden">
            <div
              className={`flex ${anim ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{
                gap,
                transform: width ? `translateX(-${index * step}px)` : undefined,
              }}
            >
              {slides.map((review, i) => (
                <div
                  key={`${review.author}-${i}`}
                  className="shrink-0"
                  style={{ width: cardW || undefined }}
                >
                  <ReviewCard
                    review={review}
                    featured={perView === 1 ? i === index : i === index + Math.floor((perView - 1) / 2)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isGrid && reviews.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b2540] text-white hover:bg-[#1B8A3E] sm:h-11 sm:w-11"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAnim(true);
                    setIndex(i);
                  }}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === dot ? 'bg-[#1B8A3E]' : 'bg-[#d5dbe3]'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b2540] text-white hover:bg-[#1B8A3E] sm:h-11 sm:w-11"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {isGrid && showPagination && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-md ${
                  page === i + 1 ? 'bg-[#1B8A3E] text-white' : 'border bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

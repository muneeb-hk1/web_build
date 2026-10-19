"use client";

import React, { useState } from 'react';
import Link from '../header/ElectricalLink';
import { HeroProps } from '../header/electricalTypes';
import { ArrowRight, Phone, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const greenDesk = 'polygon(3% 0, 61% 0, 46% 100%, 0 100%)';
const blueDesk = 'polygon(5.2% 0, 58.4% 0, 43.4% 100%, 1.6% 100%)';
const greenMob = 'polygon(0 0, 84% 0, 100% 10%, 100% 32%, 42% 70%, 0 76%)';
const blueMob = 'polygon(0 0, 80% 0, 96% 10%, 96% 30%, 39% 66%, 0 72%)';

export default function Hero({ data }: HeroProps) {
  const slide = data.slides?.[0];
  const [open, setOpen] = useState(false);
  if (!slide) return null;

  const tel = slide.phone ? `tel:${slide.phone.replace(/[^0-9+]/g, '')}` : '/contact';
  const videoSrc = slide.video_button_link?.includes('watch?v=')
    ? slide.video_button_link.replace('watch?v=', 'embed/')
    : slide.video_button_link || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  return (
    <section className="relative h-[620px] overflow-hidden bg-[#06243b] sm:h-[480px] lg:h-[520px]">
      <motion.img
        src={slide.image || "/categories/electrical/hero/electrician.png"}
        alt=""
        initial={{ scale: 1.08, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover object-[78%_80%] sm:object-[68%_center]"
      />

      <div className="absolute inset-0 bg-[#1B8A3E] md:hidden" style={{ clipPath: greenMob }} />
      <img
        src="/categories/electrical/hero/darkblue.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        style={{ clipPath: blueMob }}
      />
      <div className="absolute inset-0 hidden bg-[#1B8A3E] md:block" style={{ clipPath: greenDesk }} />
      <img
        src="/categories/electrical/hero/darkblue.png"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        style={{ clipPath: blueDesk }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-start px-5 pt-28 sm:items-center sm:px-8 sm:pt-0 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[540px] pl-2 text-white sm:pl-14 lg:pl-[88px]"
        >
          <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
            <span className="inline-flex items-center text-white">
              <span className="h-[2px] w-7 bg-white" />
              <ArrowRight size={16} className="-ml-[2px]" />
            </span>
            <p
              data-editor-inline-format-key="electrical-hero:subtitle"
              className="text-[10px] font-bold uppercase tracking-[1.6px] text-white sm:text-[11px] sm:tracking-[2.2px]"
            >
              {slide.subtitle}
            </p>
          </div>

          <h1 className="mb-4 text-[28px] font-extrabold leading-[1.12] text-white sm:text-[40px] lg:text-[46px]">
            <span
              className="block"
              data-editor-inline-format-key="electrical-hero:title_line1"
            >
              {slide.title_line1}
            </span>
            <span className="block whitespace-nowrap">
              <span data-editor-inline-format-key="electrical-hero:title_highlight">
                {slide.title_highlight}
              </span>{" "}
              <span data-editor-inline-format-key="electrical-hero:title_line2">
                {slide.title_line2}
              </span>
            </span>
          </h1>

          <p
            data-editor-inline-format-key="electrical-hero:description"
            className="mb-6 max-w-[320px] text-[14px] leading-[1.7] text-white/85 sm:mb-7 sm:max-w-[430px]"
          >
            {slide.description}
          </p>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={slide.primary_button.href}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-[#1B8A3E] px-7 text-[13px] font-bold uppercase tracking-[0.6px] text-white shadow-[0_8px_20px_rgba(27,138,62),0.35)] hover:bg-[#146C31]"
            >
              <span data-editor-inline-format-key="electrical-hero:button">
                {slide.primary_button.text}
              </span>
              <ArrowRight size={16} strokeWidth={2.6} />
            </Link>
            <a
              href={tel}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white text-[#0b2a44] hover:bg-transparent hover:text-white"
              aria-label="Call us"
            >
              <Phone size={18} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* <motion.button
        type="button"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={() => setOpen(true)}
        className="absolute right-[16%] top-[48%] z-20 hidden h-[68px] w-[68px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1B8A3E] shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:flex"
        aria-label="Play video"
      >
        <Play fill="currentColor" size={24} className="ml-1" />
      </motion.button> */}

      {/* <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          >
            <button className="absolute right-6 top-6 text-white" onClick={() => setOpen(false)}>
              <X size={28} />
            </button>
            <iframe
              className="aspect-video w-full max-w-3xl"
              src={videoSrc}
              title="ElectroCare video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence> */}
    </section>
  );
}

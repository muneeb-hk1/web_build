"use client";

import { useRef, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { SectionProps } from "../../../types/section";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";
import CalculateCTA from "../layout-src/calculatecta/page";

type FeedbackItem = {
  name?: string;
  role?: string;
  image?: string;
  content?: string;
  quote?: string;
};

export default function CleaningFeedback1({ data = {} }: SectionProps) {
  const source = siteData.feedback;
  const subtitle = String(data.subtitle || source.subtitle);
  const titleLine1 = String(data.titleLine1 || data.pretitle || source.titleLine1);
  const titleLine2 = String(data.titleLine2 || source.titleLine2);
  const feedbacks = (
    Array.isArray(data.testimonialItems) && data.testimonialItems.length
      ? data.testimonialItems
      : Array.isArray(data.feedbacks) && data.feedbacks.length
        ? data.feedbacks
        : source.feedbacks
  ) as FeedbackItem[];
  const backgroundImage = String(data.backgroundImage || "");
  const withBackgroundImage = Boolean(backgroundImage);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const displayFeedbacks = Array(15).fill(feedbacks).flat();

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    setIsDragging(true);
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftPos.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleScroll = () => {
    if (scrollRef.current?.children[0]) {
      const itemWidth = (scrollRef.current.children[0] as HTMLElement).clientWidth + 24;
      setActiveIndex(Math.round(scrollRef.current.scrollLeft / itemWidth));
    }
  };

  const scrollTo = (dotIndex: number) => {
    if (!scrollRef.current?.children[0]) return;
    const itemWidth = (scrollRef.current.children[0] as HTMLElement).clientWidth + 24;
    const currentGroup = Math.floor(activeIndex / feedbacks.length);
    let targetIndex = currentGroup * feedbacks.length + dotIndex;
    if (targetIndex < 0) targetIndex = 0;
    scrollRef.current.scrollTo({ left: targetIndex * itemWidth, behavior: "smooth" });
    setActiveIndex(targetIndex);
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-[#F8F9FA] bg-cover bg-center pt-8 pb-6 md:pt-10 md:pb-8"
        style={
          withBackgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="subtitle titleLine1 titleLine2 testimonialItems backgroundImage"
      >
        {withBackgroundImage ? <div className="absolute inset-0 bg-[#F8F9FA]/90" /> : null}
        <div className="relative mx-auto max-w-[1320px] px-4 lg:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
                {subtitle}
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]"
            >
              {titleLine1}
              <br />
              {titleLine2}
            </motion.h2>
          </div>

          <div className="relative -mx-4 px-4 lg:-mx-6 lg:px-6">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`hide-scrollbar flex cursor-grab gap-6 overflow-x-auto pb-8 active:cursor-grabbing ${
                isDragging ? "snap-none" : "snap-x snap-mandatory"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayFeedbacks.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % feedbacks.length) * 0.15 }}
                  className="w-full shrink-0 snap-start group md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="relative flex h-full flex-col bg-white p-8 shadow-[0_5px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                    <div className="absolute top-0 right-0 flex h-[60px] w-[60px] items-center justify-center rounded-bl-[10px] bg-[#16A361]">
                      <Quote size={28} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10 mb-6 flex items-center gap-4">
                      <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="pointer-events-none h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="pointer-events-none mb-0.5 text-[13px] font-medium text-[#888]">
                          {item.role}
                        </p>
                        <h4 className="pointer-events-none text-[18px] leading-none font-extrabold text-[#0D2235]">
                          {item.name}
                        </h4>
                      </div>
                    </div>
                    <p className="pointer-events-none relative z-10 grow text-[14px] leading-[1.8] font-medium text-[#777] md:text-[15px]">
                      {item.content || item.quote}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {feedbacks.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                  activeIndex % feedbacks.length === index
                    ? "h-[20px] w-[20px] border-[2px] border-[#16A361]"
                    : "h-[10px] w-[10px] bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {activeIndex % feedbacks.length === index ? (
                  <span className="h-[8px] w-[8px] rounded-full bg-[#16A361]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

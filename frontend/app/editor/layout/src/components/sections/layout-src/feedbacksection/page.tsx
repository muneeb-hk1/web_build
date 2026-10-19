"use client";

import { useRef, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { feedback } = siteData;
const feedbacks = feedback.feedbacks;

export default function FeedbackSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftPos = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

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
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.children[0].clientWidth + 24; // 24px gap
            const newIndex = Math.round(scrollLeft / itemWidth);
            setActiveIndex(newIndex);
        }
    };

    const scrollTo = (dotIndex: number) => {
        if (scrollRef.current) {
            const itemWidth = scrollRef.current.children[0].clientWidth + 24;
            const currentGroup = Math.floor(activeIndex / feedbacks.length);
            let targetIndex = currentGroup * feedbacks.length + dotIndex;
            // Prevent scrolling out of bounds if near the end
            if (targetIndex < 0) targetIndex = 0;
            scrollRef.current.scrollTo({ left: targetIndex * itemWidth, behavior: "smooth" });
            setActiveIndex(targetIndex);
        }
    };

    const displayFeedbacks = Array(15).fill(feedbacks).flat();

    return (
        <section className="bg-[#F8F9FA] pt-8 pb-6 md:pt-10 md:pb-8 overflow-hidden relative">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                            {feedback.subtitle}
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight"
                    >
                        {feedback.titleLine1}<br/>{feedback.titleLine2}
                    </motion.h2>
                </div>

                {/* Slider */}
                <div className="relative -mx-4 lg:-mx-6 px-4 lg:px-6">
                    <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={`flex overflow-x-auto gap-6 hide-scrollbar pb-8 cursor-grab active:cursor-grabbing ${isDragging ? 'snap-none' : 'snap-x snap-mandatory'}`}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {displayFeedbacks.map((feedback, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % feedbacks.length) * 0.15 }}
                                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start shrink-0 group"
                            >
                                <div className="bg-white shadow-[0_5px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 h-full p-8 relative flex flex-col">
                                    
                                    {/* Quote Icon Box */}
                                    <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-[#16A361] flex items-center justify-center rounded-bl-[10px]">
                                        <Quote size={28} className="text-white" strokeWidth={1.5} />
                                    </div>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0">
                                            <img 
                                                src={feedback.image} 
                                                alt={feedback.name}
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[#888] text-[13px] font-medium mb-0.5 pointer-events-none">
                                                {feedback.role}
                                            </p>
                                            <h4 className="text-[#0D2235] text-[18px] font-extrabold leading-none pointer-events-none">
                                                {feedback.name}
                                            </h4>
                                        </div>
                                    </div>
                                    
                                    {/* Review Text */}
                                    <p className="text-[#777] text-[14px] md:text-[15px] leading-[1.8] font-medium grow relative z-10 pointer-events-none">
                                        {feedback.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-3 mt-4">
                    {feedbacks.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`transition-all duration-300 flex items-center justify-center rounded-full ${
                                (activeIndex % feedbacks.length) === index 
                                ? "w-[20px] h-[20px] border-[2px] border-[#16A361]" 
                                : "w-[10px] h-[10px] bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {(activeIndex % feedbacks.length) === index && (
                                <span className="w-[8px] h-[8px] bg-[#16A361] rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>

            </div>
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Users, ThumbsUp, ClipboardCheck, Award } from "lucide-react";
import { motion, useInView, animate, Variants } from "framer-motion";

import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { stat } = siteData;

const iconMap: Record<string, any> = {
    "users": Users,
    "thumbs-up": ThumbsUp,
    "clipboard-check": ClipboardCheck,
    "award": Award
};

function Counter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [display, setDisplay] = useState("0");

    const numMatch = value.match(/[\d\.]+/);
    const suffix = value.replace(/[\d\.]+/, '');
    const num = numMatch ? parseFloat(numMatch[0]) : 0;
    const isDecimal = value.includes('.');

    useEffect(() => {
        if (inView) {
            const controls = animate(0, num, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate: (latest) => {
                    setDisplay(isDecimal ? latest.toFixed(1) : Math.floor(latest).toString());
                }
            });
            return controls.stop;
        }
    }, [inView, num, isDecimal]);

    return <span ref={ref}>{display}{suffix}</span>;
}

export default function StatsSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    return (
        <section className="bg-[#0B4C34] py-2 lg:py-4 overflow-hidden relative">
            {/* Subtle gradient to mimic image depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>

            <div className="max-w-[1320px] mx-auto px-5 lg:px-8 relative z-10">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 md:gap-y-8 lg:gap-y-0"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {stat.stats.map((item, index) => {
                        const Icon = iconMap[item.iconName] || Users;

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`
                                    flex items-center gap-5 px-4 lg:px-8 py-4 lg:py-2
                                    border-white/10
                                    max-lg:border-b max-lg:last:border-b-0
                                    md:max-lg:[&:nth-child(even)]:border-b
                                    lg:border-r lg:last:border-r-0
                                    hover:-translate-y-1 transition-transform duration-300
                                `}
                            >
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white/20 transition-colors duration-300">
                                    <Icon
                                        size={28}
                                        className="text-white"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-white text-3xl lg:text-[40px] font-bold leading-none mb-2 tracking-tight">
                                        <Counter value={item.value} />
                                    </h3>
                                    <p className="text-white/80 text-sm lg:text-base font-medium">
                                        {item.title}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
"use client";

/* ===============================
   Imports
================================ */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PaintRoller,
    AppWindow,
    House,
    Biohazard,
    LucideIcon,
} from "lucide-react";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";
import CleaningSlider from "../../shared/CleaningSlider";

const iconMap: Record<string, LucideIcon> = {
    PaintRoller,
    AppWindow,
    House,
    Biohazard,
};

/* ===============================
   Types & Interfaces
================================ */

interface ServiceItem {
    id: number;
    title: string;
    description: string;
    image: string;
    icon: LucideIcon;
}

/* ===============================
   Services Data
================================ */

const { services } = siteData;

const mappedServices: ServiceItem[] = services.items.map(item => ({
    ...item,
    icon: iconMap[item.iconName] || PaintRoller // fallback icon
}));

/* ===============================
   Main Component
================================ */

interface ServicesSectionProps {
    layout?: 'grid' | 'slider';
}

export default function ServicesSection({ layout = 'grid' }: ServicesSectionProps) {
    return (
        <section className={`${layout === 'slider' ? 'pt-8 pb-4 md:pt-10 md:pb-6 bg-[#F8F9FA]' : 'pt-10 pb-16 md:pt-14 md:pb-20 bg-white'}`}>
            {layout === 'slider' && null}
            <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8">
                {/* Section Header */}
                <SectionHeader />

                {layout === 'slider' ? (
                    <div className="mt-8 md:mt-10">
                        <CleaningSlider
                            showDots
                            autoplayMs={4000}
                            gapClassName="gap-7"
                            itemClassName="w-full sm:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] xl:w-[calc(25%-21px)]"
                        >
                            {mappedServices.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                />
                            ))}
                        </CleaningSlider>
                    </div>
                ) : (
                    <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {mappedServices.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ===============================
   Section Header
================================ */

function SectionHeader() {
    return (
        <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-[#22A46D] font-bold text-[18px] tracking-wide">
                {services.subtitle}
            </span>

            <h2 className="mt-3 text-[#0B2942] text-3xl sm:text-4xl md:text-[45px] font-semibold leading-tight tracking-tight">
                {services.title}
            </h2>
        </div>
    );
}

/* ===============================
   Service Card
================================ */

interface ServiceCardProps {
    service: ServiceItem;
    index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
    const Icon = service.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: "easeOut",
            }}
            whileHover={{ y: -8 }}
            className="group bg-[#EAF2EE] rounded-[16px] p-5 flex flex-col transition-all duration-300 shadow-sm hover:shadow-md w-full h-full"
        >
            {/* Image Wrapper */}
            <div className="relative w-full h-[220px]">
                {/* Rounded Image with Padding */}
                <Link href="/services/detail" className="block relative w-full h-full overflow-hidden rounded-[12px]">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                    />
                </Link>
                
                {/* Floating Icon Overlaid on Bottom Right Corner */}
                <div className="absolute -bottom-6 right-4 z-10 w-[52px] h-[52px] rounded-full bg-[#0A7A51] text-white flex items-center justify-center border-[4px] border-[#EAF2EE] shadow-sm transition-transform duration-300 group-hover:bg-[#0B2942] group-hover:scale-110">
                    <Icon size={24} className="stroke-[2.5]" />
                </div>
            </div>

            {/* Content */}
            <div className="mt-8 flex-1 flex flex-col text-left">
                <h3 className="text-[22px] font-bold text-[#0B2942] leading-[1.3] group-hover:text-[#0A7A51] transition-colors duration-300 cursor-pointer">
                    <Link href="/services/detail">{service.title}</Link>
                </h3>
                
                <p className="mt-3 text-[#6B7280] text-[15px] leading-[26px] flex-1">
                    {service.description}
                </p>

                {/* Read More Button (Solid Green Pill) */}
                <div className="mt-6 text-left">
                    <Link href="/services/detail" className="inline-block bg-[#0A7A51] hover:bg-[#0B2942] text-white font-bold text-[14px] py-2.5 px-6 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:scale-105 active:scale-95">
                        Read More +
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

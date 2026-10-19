"use client";

import Image from "next/image";
import Link from "../header/PestLink";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import siteData from "../../../data/pestContent";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getHiddenManagerFamilies } from "../../../lib/navVisibility";

interface ServiceItem {
  slug: string;
  name: string;
  desc1?: string;
  description?: string;
  image?: string;
}

export default function ServicesGrid() {
  const preview = useOptionalPreview();
  if (getHiddenManagerFamilies(preview?.pageLinks).has("services")) return null;
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const servicesSection =
    pestControl?.sections?.Services?.variants?.PestServices1 || {};

  const badge = servicesSection.badge || "OUR SERVICES";
  const title = servicesSection.title || "Professional Pest Control Services for a Safer Space";
  const items: ServiceItem[] = servicesSection.items || [];

  return (
    <section className="bg-white py-20 px-6 md:px-12 text-neutral-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bg-[#e4f4ed] text-[#00482B] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl leading-snug">
            Professional <span className="text-[#00482B]">Pest Control</span> Services for a Safer Space
          </h2>
        </div>

        {/* Dynamic Grid from websiteData.json */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => {
            const cardImg =
              service.image ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";

            return (
              <motion.div
                key={service.slug || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={cardImg}
                      alt={service.name}
                      fill
                      unoptimized
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {service.name}
                    </h3>
                    <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {service.desc1 || service.description || "Effective pest control treatment."}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#00482B] hover:text-[#063321] transition"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
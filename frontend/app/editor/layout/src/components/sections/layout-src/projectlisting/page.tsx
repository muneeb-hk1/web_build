"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { project } = siteData;

export default function ProjectListing({
  items,
}: {
  items?: typeof project.projects;
}) {
  const projects = items?.length ? items : project.projects;

  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href="/projects/detail" className="block h-full">
                <div className="flex h-full flex-col bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="relative h-[280px] w-full overflow-hidden md:h-[320px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative flex grow flex-col justify-center p-6">
                    <div className="absolute -top-5 right-6 flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#1FA463] shadow-md transition-transform duration-300 group-hover:scale-110">
                      <ArrowRight
                        size={20}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="mb-1.5 text-[20px] font-extrabold text-[#0D2235] transition-colors group-hover:text-[#1FA463]">
                      {item.title}
                    </h3>
                    <p className="text-[14px] font-bold text-[#1FA463]">
                      {item.category}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

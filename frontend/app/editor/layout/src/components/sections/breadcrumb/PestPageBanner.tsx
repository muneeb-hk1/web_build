"use client";

import Link from "../header/PestLink";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundType?: "image" | "solid" | "gradient";
  backgroundImage?: string;
  backgroundColor?: string;
  gradientColor?: string;
}

export default function PageBanner({
  title,
  breadcrumbs,
  backgroundType = "solid",
  backgroundImage = "",
  backgroundColor = "#00482B",
  gradientColor = "#1B8A3E",
}: PageBannerProps) {
  const style: {
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundColor?: string;
  } =
    backgroundType === "image" && backgroundImage
      ? {
          backgroundImage: `linear-gradient(rgba(0,40,24,0.55), rgba(0,40,24,0.55)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : backgroundType === "gradient"
        ? {
            backgroundImage: `linear-gradient(90deg, ${backgroundColor}, ${gradientColor})`,
          }
        : { backgroundColor };
  return (
    <section className="text-white py-16 md:py-24 text-center" style={style}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-200"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white font-medium" : ""}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight size={14} className="text-white/60" />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
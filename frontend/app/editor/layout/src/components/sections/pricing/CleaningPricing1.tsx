"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

type PlanFeature = { text?: string; included?: boolean };
type Plan = {
  name?: string;
  description?: string;
  price?: string;
  features?: PlanFeature[];
};

export default function CleaningPricing1({ data = {} }: SectionProps) {
  const pricing = siteData.pricing;
  const subtitle = String(data.subtitle || pricing.subtitle);
  const heading = String(data.sectionTitle || pricing.title);
  const plans = (
    Array.isArray(data.plans) && data.plans.length ? data.plans : pricing.plans
  ) as Plan[];
  const backgroundImage = String(data.backgroundImage || "");
  const withBackgroundImage = Boolean(backgroundImage);

  return (
    <section
      className="relative bg-white bg-cover bg-center pt-8 pb-14 md:pt-10 md:pb-16"
      style={
        withBackgroundImage
          ? { backgroundImage: `url('${backgroundImage}')` }
          : undefined
      }
      data-editor-fields="subtitle sectionTitle plans backgroundImage"
    >
      {withBackgroundImage ? (
        <div className="absolute inset-0 bg-white/88" />
      ) : null}
      <div className="relative mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 block text-[15px] font-bold tracking-wide text-[#1FA463]">
              {subtitle}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] leading-[1.2] font-semibold tracking-tight text-[#0D2235] md:text-[44px]"
          >
            {heading}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={`${plan.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="group/card flex h-full flex-col items-center rounded-sm bg-[#F9FAFB] p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <h3 className="mb-2 text-[18px] font-bold text-[#0D2235]">
                  {plan.name}
                </h3>
                <p className="mb-8 text-center text-[13px] text-[#888888]">
                  {plan.description}
                </p>
                <div className="relative mb-10 flex w-full items-center justify-center py-2">
                  <div className="absolute z-0 h-[75px] w-[75px] translate-x-2 rounded-full bg-[#FFF5F1] transition-transform duration-500 group-hover/card:scale-110"></div>
                  <div className="relative z-10 flex items-baseline gap-1">
                    <span className="text-[42px] leading-none font-extrabold text-[#0D2235]">
                      {plan.price}
                    </span>
                    <span className="text-[13px] font-medium text-[#6B7280]">
                      / Mo
                    </span>
                  </div>
                </div>
                <ul className="mb-12 w-full space-y-5 px-1">
                  {(plan.features ?? []).map((feature, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-[14px] text-[#666666]">
                        {feature.text}
                      </span>
                      {feature.included ? (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-[#1FA463]"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <XCircle
                          size={18}
                          className="shrink-0 text-[#BBE1ED]"
                          strokeWidth={2.5}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex w-full justify-center">
                  <Link
                    href="/enquiry"
                    className="group/btn flex items-center justify-center gap-2 rounded-[4px] bg-[#1FA463] px-7 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#138A56] hover:shadow-lg"
                  >
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                    Enquiry Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

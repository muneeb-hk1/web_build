"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { TestimonialsSectionData } from "../header/electricalTypes";
import Testimonials from "./ElectricalTestimonialsView";

export default function ElectricalTestimonial1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.testimonials as TestimonialsSectionData,
    "testimonials",
  );
  return <Testimonials data={packed} />;
}

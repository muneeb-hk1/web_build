"use client";

import type { SectionProps } from "../../../types/section";
import { electricalData, electricalSections } from "../../../data/electricalContent";
import type { PhotoGalleryData } from "../header/electricalTypes";
import PhotoGallery from "./ElectricalGalleryView";

export default function ElectricalGalleryPage1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    electricalSections.photo_gallery as PhotoGalleryData,
    "gallery",
  );
  return <PhotoGallery data={packed} />;
}

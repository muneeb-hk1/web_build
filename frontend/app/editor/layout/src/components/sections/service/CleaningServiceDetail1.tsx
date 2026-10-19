"use client";

import type { SectionProps } from "../../../types/section";
import ServiceDetailContent from "../layout-src/servicedetailcontent/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningServiceDetail1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const gallery = Array.isArray(data.gallery)
    ? data.gallery.map((item) => String(item))
    : [];
  const overview = Array.isArray(data.overview)
    ? data.overview.map((item) => String(item))
    : [];
  const categories = Array.isArray(data.categories)
    ? data.categories.map((item) => String(item))
    : [];

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="title description description2 image gallery overview categories searchTitle searchPlaceholder categoriesTitle backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-white/90" />
        ) : null}
        <div className="relative">
          <ServiceDetailContent
            title={String(data.title || siteData.services.items[0].title)}
            description={String(
              data.description || siteData.services.items[0].description,
            )}
            description2={String(data.description2 || "")}
            image={String(data.image || siteData.services.items[0].image)}
            gallery={gallery}
            overview={overview}
            categories={categories}
            searchTitle={String(data.searchTitle || "")}
            searchPlaceholder={String(data.searchPlaceholder || "")}
            categoriesTitle={String(data.categoriesTitle || "")}
          />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

"use client";

import type { SectionProps } from "../../../types/section";
import ProjectListing from "../layout-src/projectlisting/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningProjectList1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const items =
    Array.isArray(data.projectItems) && data.projectItems.length
      ? data.projectItems
      : siteData.project.projects;

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="projectItems backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-[#F8F9FA]/90" />
        ) : null}
        <div className="relative">
          <ProjectListing items={items as typeof siteData.project.projects} />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

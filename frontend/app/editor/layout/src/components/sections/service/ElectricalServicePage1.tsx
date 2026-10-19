"use client";

import type { SectionProps } from "../../../types/section";
import {
  electricalData,
  electricalPages,
  electricalSections,
} from "../../../data/electricalContent";
import type { ServicesSectionData, StatsSectionData } from '../header/electricalTypes';
import Services from './ElectricalServicesView';
import Stats from "../stats/ElectricalStatsView";

export default function ElectricalServicePage1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    {
      page: electricalPages.services as { title?: string },
      services: electricalSections.services as ServicesSectionData,
      stats: electricalSections.stats as StatsSectionData,
    },
    "services",
  );
  const direct = electricalData(data, null as ServicesSectionData | null, "items");
  const services = (direct?.items ? direct : packed.services) as ServicesSectionData;
  const hidden = new Set(
    Array.isArray(data.hiddenBlocks) ? (data.hiddenBlocks as string[]) : [],
  );
  return (
    <>
      {hidden.has("ElectricalService1") ? null : (
      <div data-editor-block="Services" data-editor-section-label="Services" data-editor-block-variant="ElectricalService1">
        <Services data={services} isGrid showPagination />
      </div>
      )}
      {hidden.has("ElectricalStats1") ? null : (
      <div data-editor-block="Stats" data-editor-section-label="Stats" data-editor-block-variant="ElectricalStats1">
        <Stats data={(packed.stats || electricalSections.stats) as StatsSectionData} />
      </div>
      )}
    </>
  );
}

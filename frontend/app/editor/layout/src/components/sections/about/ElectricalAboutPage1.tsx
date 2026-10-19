"use client";

import type { SectionProps } from "../../../types/section";
import {
  electricalData,
  electricalPages,
  electricalSections,
} from "../../../data/electricalContent";
import type {
  AboutSectionData,
  StatsSectionData,
  WhyChooseSectionData,
  WorkProcessSectionData,
} from '../header/electricalTypes';
import About from "./ElectricalAboutView";
import Stats from "../stats/ElectricalStatsView";
import WhyChoose from "../whychooseus/ElectricalWhyChooseView";
import WorkProcess from "../how-we-work/ElectricalWorkProcessView";

export default function ElectricalAboutPage1({ data }: SectionProps) {
  const packed = electricalData(
    data,
    {
      page: electricalPages.about as { title?: string },
      about: electricalSections.about as AboutSectionData,
      stats: electricalSections.stats as StatsSectionData,
      whyChoose: electricalSections.why_choose as WhyChooseSectionData,
      workProcess: electricalSections.work_process as WorkProcessSectionData,
    },
    "about",
  );
  const hidden = new Set(
    Array.isArray(data.hiddenBlocks) ? (data.hiddenBlocks as string[]) : [],
  );
  return (
    <>
      {hidden.has("ElectricalAbout1") ? null : (
      <div data-editor-block="About" data-editor-section-label="About" data-editor-block-variant="ElectricalAbout1">
        <About data={packed.about as AboutSectionData} hideCta mediaField="about.image" />
      </div>
      )}
      {hidden.has("ElectricalStats1") ? null : (
      <div data-editor-block="Stats" data-editor-section-label="Stats" data-editor-block-variant="ElectricalStats1">
        <Stats data={(packed.stats || electricalSections.stats) as StatsSectionData} />
      </div>
      )}
      {hidden.has("ElectricalWhyChooseUs1") ? null : (
      <div data-editor-block="Why Choose Us" data-editor-section-label="Why Choose Us" data-editor-block-variant="ElectricalWhyChooseUs1">
        <WhyChoose data={packed.whyChoose as WhyChooseSectionData} mediaField="whyChoose.image" />
      </div>
      )}
      {hidden.has("ElectricalHowWeWork1") ? null : (
      <div data-editor-block="Work Process" data-editor-section-label="Work Process" data-editor-block-variant="ElectricalHowWeWork1">
        <WorkProcess data={packed.workProcess as WorkProcessSectionData} />
      </div>
      )}
    </>
  );
}

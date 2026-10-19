"use client";

import type { SectionProps } from "../../../types/section";
import AchievementSection from "../layout-src/achievementsection/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningAchievement1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const items =
    Array.isArray(data.items) && data.items.length
      ? data.items
      : siteData.achievements.items;

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="items backgroundImage"
      >
        {backgroundImage ? <div className="absolute inset-0 bg-white/88" /> : null}
        <div className="relative">
          <AchievementSection items={items as typeof siteData.achievements.items} />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

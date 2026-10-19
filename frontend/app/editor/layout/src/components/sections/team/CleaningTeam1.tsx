"use client";

import type { SectionProps } from "../../../types/section";
import TeamSection from "../layout-src/teamsection/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningTeam1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const members =
    Array.isArray(data.members) && data.members.length
      ? data.members
      : siteData.team.members;

  return (
    <div
      className="relative bg-cover bg-center"
      style={
        backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined
      }
      data-editor-fields="subtitle title members backgroundImage"
    >
      {backgroundImage ? <div className="absolute inset-0 bg-white/88" /> : null}
      <div className="relative">
        <TeamSection
          layout={data.teamLayout === "grid" ? "grid" : "slider"}
          subtitle={String(data.subtitle || siteData.team.subtitle)}
          title={String(data.title || siteData.team.title)}
          members={members as typeof siteData.team.members}
        />
      </div>
    </div>
  );
}

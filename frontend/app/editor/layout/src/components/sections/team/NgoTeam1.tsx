"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import { site, type NGOTeamData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import { Plus } from "lucide-react";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  getNgoTeamDetailHref,
  resolveNgoTeamSlug,
  writeNgoTeamDetailSlug,
} from "../../../lib/ngoTeamDetails";

export default function NgoTeam1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const candidate = customData as unknown as Partial<NGOTeamData> | undefined;
  const fallback = site.team ?? site.teamPage ?? {};
  const data = {
    ...fallback,
    ...candidate,
    banner: { ...(fallback.banner ?? {}), ...candidate?.banner },
    heading: { ...(fallback.heading ?? {}), ...candidate?.heading },
    members:
      Array.isArray(candidate?.members) && candidate.members.length
        ? candidate.members
        : Array.isArray(candidate?.productItems) && candidate.productItems.length
          ? candidate.productItems.map((item: any, index: number) => ({
              id: item.id ?? index + 1,
              image: item.image,
              name: item.title || item.name,
              role: item.category || item.role,
              href: item.slug || item.href || getNgoTeamDetailHref(item),
              content: item.content,
              desc: item.desc,
              layout: item.layout,
            }))
          : fallback.members ?? [],
  };
  const members = (Array.isArray(data.members) ? data.members : []).filter(
    (member: { active?: boolean }) => member.active !== false,
  );
  const heading = {
    pretitle: "",
    title: "",
    ...(data.heading ?? {}),
  };

  const openTeamDetail = (
    event: ReactMouseEvent,
    member: Record<string, unknown>,
  ) => {
    if (!preview) return;
    event.preventDefault();
    event.stopPropagation();
    writeNgoTeamDetailSlug(
      resolveNgoTeamSlug({
        id: member.id as string | number | undefined,
        // Force id-based identity even when href is bare "/team-details".
        slug: undefined,
        href: undefined,
        name: typeof member.name === "string" ? member.name : undefined,
        title: typeof member.title === "string" ? member.title : undefined,
      }),
    );
    preview.setCurrentPage("Team Details");
  };

  return (
    <main>
      <section
        data-editor-section-label="Team"
        data-editor-fields="icon banner heading members"
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white font-sans"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center  gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
              <EditableNgoIcon
                name={heading.icon || data.icon || data.iconName || "hand-heart"}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{heading.pretitle}</span>
            </div>
            <div className="flex justifyt-center flex-col">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mx-auto max-w-3xl">
                {heading.title}
              </h2>
              <div className="w-20 mb-1 mt-2 h-1 mx-auto bg-[#16a34a] rounded-full "></div>
            </div>

            <div className="absolute -right-4 md:right-[10%] -top-2 md:top-[60%] hidden md:block">
              <svg
                width="60"
                height="60"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M49 25
           C40 10 21 9 14 24
           C7 38 14 52 23 65
           C30 76 36 89 45 91
           C54 93 59 80 65 70
           C69 64 72 61 77 57"
                  stroke="#A8CFCA"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M49 25
           C59 9 78 10 87 24
           C96 39 90 51 83 61
           C78 68 75 73 76 78"
                  stroke="#A8CFCA"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M49 25
           C53 30 56 34 60 38"
                  stroke="#A8CFCA"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member: any) => {
              return (
                <div
                  key={member.id}
                  className="group relative bg-[#f8f9fa] rounded-2xl overflow-hidden p-3 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-gray-200">
                    <Image
                      src={member.image}
                      alt={member.name || member.title || "Team member"}
                      fill
                      sizes="(min-width: 1024px) 33.33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={member.image}
                    />
                    <Link
                      href={getNgoTeamDetailHref({
                        id: member.id,
                        name: member.name,
                        title: member.title,
                      })}
                      data-editor-keep-click="true"
                      onClick={(event) => openTeamDetail(event, member)}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#0d2a20] group-hover:bg-[#ffaa00] text-white group-hover:text-black flex items-center justify-center shadow-md transition-colors duration-300"
                    >
                      <Plus className="w-5 h-5" />
                    </Link>
                  </div>

                  <div className="pt-4 pb-2 px-2">
                    <h3 className="text-lg font-bold text-[#08121e] group-hover:text-[#005c36] transition-colors">
                      <Link
                        href={getNgoTeamDetailHref({
                          id: member.id,
                          name: member.name,
                          title: member.title,
                        })}
                        data-editor-keep-click="true"
                        onClick={(event) => openTeamDetail(event, member)}
                      >
                        {member.name || member.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      {member.role || member.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import NgoAbout1 from "./NgoAbout1";
import NgoHelp1 from "../help/NgoHelp1";
import NgoWhyChooseUs1 from "../whychooseus/NgoWhyChooseUs1";
import NgoFacts1 from "../facts/NgoFacts1";
import type { SectionProps } from "../../../types/section";
import { site, type NGOAboutPageData } from "../data/categorySite";
import { renderNgoEditorPart } from "../../../lib/ngoEditorParts";

/** Common AboutPage corporate seed leaked into NGO AboutPage-11 before category override. */
const CORPORATE_ABOUT_TITLE =
  "We build thoughtful websites for growing brands.";

const stripLeakedCommonAboutPage = (
  input: Record<string, unknown>,
): Record<string, unknown> => {
  const next = { ...input };
  const title = typeof next.title === "string" ? next.title.trim() : "";
  const hasCorporateLeak =
    title === CORPORATE_ABOUT_TITLE ||
    typeof next.philosophyTitle === "string" ||
    typeof next.philosophyDesc === "string";
  if (!hasCorporateLeak) return next;

  delete next.philosophyTitle;
  delete next.philosophyDesc;
  delete next.subtitle;
  delete next.sideImage;
  delete next.sideImageTitle;
  delete next.desc2;
  if (title === CORPORATE_ABOUT_TITLE) delete next.title;
  if (
    typeof next.pretitle === "string" &&
    next.pretitle.trim().toLowerCase() === "about us"
  ) {
    delete next.pretitle;
  }
  if (
    typeof next.desc === "string" &&
    (next.desc.includes("strategy, design, and technology") ||
      /^(c+|test|asdf|xxx+|n+\/a+)$/i.test(next.desc.trim()))
  ) {
    delete next.desc;
  }
  return next;
};

export default function NgoAboutPage1({
  data: customData,
  editorPart,
}: SectionProps & { editorPart?: number }) {
  const custom = stripLeakedCommonAboutPage(
    (customData ?? {}) as Record<string, unknown>,
  ) as Partial<NGOAboutPageData> & {
    howWeHelp?: Record<string, unknown>;
    whyChooseUs?: Record<string, unknown>;
    facts?: Record<string, unknown>;
    partOrder?: number[];
  };
  const fallback = site.aboutPage ?? site.about ?? {};
  const aboutData: NGOAboutPageData = {
    ...fallback,
    ...custom,
    banner: {
      ...(fallback.banner ?? {}),
      ...custom.banner,
    },
    sideImages: {
      ...(fallback.sideImages ?? {}),
      ...custom.sideImages,
    },
    features:
      Array.isArray(custom.features) && custom.features.length
        ? custom.features
        : Array.isArray(fallback.features)
          ? fallback.features
          : [],
    checklist:
      Array.isArray(custom.checklist) && custom.checklist.length
        ? custom.checklist
        : Array.isArray(fallback.checklist)
          ? fallback.checklist
          : [],
    button: {
      ...(fallback.button ?? {}),
      ...custom.button,
    },
  };

  const parts = [
    <main key="about" className="bg-white">
      <NgoAbout1 data={aboutData} showButton={false} />
    </main>,
    <NgoHelp1 key="howWeHelp" data={custom.howWeHelp} />,
    <NgoWhyChooseUs1 key="whyChooseUs" data={custom.whyChooseUs} />,
    <NgoFacts1 key="facts" data={custom.facts} />,
  ];

  const stored: number[] = Array.isArray(custom.partOrder)
    ? custom.partOrder.filter(
        (index: unknown): index is number => typeof index === "number",
      )
    : [0, 1, 2, 3];
  const order = [...new Set(stored.filter((index) => Boolean(parts[index])))];
  parts.forEach((part, index) => {
    if (part && !order.includes(index)) order.push(index);
  });
  const page = <>{order.map((index) => parts[index])}</>;

  return renderNgoEditorPart(editorPart, parts, page);
}

(
  NgoAboutPage1 as typeof NgoAboutPage1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "pretitle",
  "icon",
  "title",
  "desc",
  "donationBadge",
  "donationBadgeIcon",
  "sideImages",
  "videoUrl",
  "features",
  "checklist",
  "button",
  "phone",
];

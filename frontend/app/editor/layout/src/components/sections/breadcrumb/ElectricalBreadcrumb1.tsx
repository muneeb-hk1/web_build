import type { SectionProps } from "../../../types/section";
import { ElectricalCrumb } from "./ElectricalPageBits";

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

function ElectricalBreadcrumb1({ data = {} }: SectionProps) {
  const saved =
    data.breadcrumbSettings && typeof data.breadcrumbSettings === "object"
      ? (data.breadcrumbSettings as SectionProps["data"])
      : data;
  return (
    <ElectricalCrumb
      title={text(saved.title, "Page")}
      settings={{
        title: text(saved.title, "Page"),
        homeLabel: text(saved.homeLabel, "Home"),
        currentLabel: text(saved.currentLabel || saved.title, "Page"),
        backgroundImage: text(saved.backgroundImage || data.backgroundImage, "/categories/electrical/img/breadcrumb.png"),
        backgroundType:
          saved.backgroundType === "solid" || saved.backgroundType === "gradient"
            ? saved.backgroundType
            : "image",
        backgroundColor: text(saved.backgroundColor, "#0b1a28"),
        gradientColor: text(saved.gradientColor, "#1B8A3E"),
      }}
    />
  );
}

(
  ElectricalBreadcrumb1 as typeof ElectricalBreadcrumb1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "title",
  "homeLabel",
  "currentLabel",
  "backgroundImage",
  "backgroundType",
  "backgroundColor",
  "gradientColor",
];

export default ElectricalBreadcrumb1;

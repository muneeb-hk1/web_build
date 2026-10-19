import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { normalizeNgoIconId } from "../../../lib/ngoIcons";

export const CSR_FALLBACK_IMAGE =
  "/categories/ngo/template1/children-speaking-holding-book.jpg";

const iconThemeMap: Record<string, { bg: string; text: string; border: string }> =
  {
    users: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    community: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    team: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    leaf: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    tree: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    environment: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    handshake: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    partner: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    shield: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    integrity: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    education: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
    },
    healthcare: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
    },
    health: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
    "heart-pulse": {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
    },
    plus: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
    medical: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-100",
    },
    review: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
    project: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-100",
    },
    award: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100",
    },
  };

export const getCsrIconTheme = (iconName: string) =>
  iconThemeMap[normalizeNgoIconId(iconName)] ||
  iconThemeMap[iconName] || {
    bg: "bg-orange-50",
    text: "text-[#ff5a36]",
    border: "border-orange-100",
  };

export const renderCsrIcon = (iconName: string, className = "w-7 h-7") => (
  <EditableNgoIcon name={iconName} className={className} />
);

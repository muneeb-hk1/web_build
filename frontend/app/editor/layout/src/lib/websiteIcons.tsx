import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Biohazard,
  Brush,
  Building,
  Building2,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Droplets,
  ExternalLink,
  FileText,
  Handshake,
  Headset,
  Heart,
  Home,
  House,
  Key,
  Eye,
  Leaf,
  Mail,
  MapPin,
  MessageSquareText,
  PaintRoller,
  PartyPopper,
  Phone,
  PhoneCall,
  Plus,
  Quote,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SprayCan,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";

export const WEBSITE_ICON_OPTIONS = [
  "Users",
  "ThumbsUp",
  "ClipboardCheck",
  "Award",
  "PartyPopper",
  "PaintRoller",
  "AppWindow",
  "House",
  "Biohazard",
  "Headset",
  "MessageSquareText",
  "ClipboardList",
  "Home",
  "Key",
  "Eye",
  "SprayCan",
  "Sparkles",
  "Search",
  "Quote",
  "Check",
  "CheckCircle2",
  "XCircle",
  "ArrowRight",
  "ArrowLeft",
  "PhoneCall",
  "Phone",
  "MapPin",
  "Mail",
  "Send",
  "Plus",
  "ExternalLink",
  "Smartphone",
  "Star",
  "Heart",
  "Clock",
  "Shield",
  "ShieldCheck",
  "Brush",
  "Droplets",
  "Leaf",
  "Wrench",
  "Building",
  "Building2",
  "BarChart3",
  "BadgeCheck",
  "Handshake",
  "Calendar",
  "FileText",
  "Target",
  "TrendingUp",
  "UserCheck",
] as const;

const ICON_COMPONENTS: LucideIcon[] = [
  Users,
  ThumbsUp,
  ClipboardCheck,
  Award,
  PartyPopper,
  PaintRoller,
  AppWindow,
  House,
  Biohazard,
  Headset,
  MessageSquareText,
  ClipboardList,
  Home,
  Key,
  Eye,
  SprayCan,
  Sparkles,
  Search,
  Quote,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  Phone,
  MapPin,
  Mail,
  Send,
  Plus,
  ExternalLink,
  Smartphone,
  Star,
  Heart,
  Clock,
  Shield,
  ShieldCheck,
  Brush,
  Droplets,
  Leaf,
  Wrench,
  Building,
  Building2,
  BarChart3,
  BadgeCheck,
  Handshake,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  UserCheck,
];

/** Editor / Events / kebab slugs → registered Website icon keys. */
const ICON_ALIASES: Record<string, string> = {
  phone: "PhoneCall",
  telephone: "PhoneCall",
  "phone-call": "PhoneCall",
  phonecall: "PhoneCall",
  email: "Mail",
  mail: "Mail",
  send: "Send",
  plus: "Plus",
  "arrow-right": "ArrowRight",
  arrowright: "ArrowRight",
  "arrow-left": "ArrowLeft",
  arrowleft: "ArrowLeft",
  "external-link": "ExternalLink",
  externallink: "ExternalLink",
  user: "Users",
  users: "Users",
  location: "MapPin",
  "map-pin": "MapPin",
  mappin: "MapPin",
  verified: "BadgeCheck",
  support: "Headset",
  shield: "ShieldCheck",
  star: "Star",
  heart: "Heart",
  home: "Home",
  building: "Building",
  clock: "Clock",
  award: "Award",
  key: "Key",
  handshake: "Handshake",
  quote: "Quote",
  inspect: "ClipboardCheck",
  finish: "Brush",
  quality: "BarChart3",
  none: "ArrowRight",
};

export const toLucideIconName = (value: string) =>
  value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

export const toKebabIconName = (value: string) =>
  toLucideIconName(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const ICON_LOOKUP: Record<string, LucideIcon> = {};

WEBSITE_ICON_OPTIONS.forEach((pascal, index) => {
  const component = ICON_COMPONENTS[index];
  ICON_LOOKUP[pascal] = component;
  ICON_LOOKUP[pascal.toLowerCase()] = component;
  ICON_LOOKUP[toKebabIconName(pascal)] = component;
});

export const isIconFieldName = (fieldName: string) =>
  /^(icon|iconname|mainicon|subicon)$/i.test(fieldName);

export const isSvgIconValue = (value: string) =>
  /<svg[\s>]/i.test(value) ||
  /^data:image\/svg/i.test(value.trim()) ||
  /\.svg(\?|#|$)/i.test(value.trim());

/** Normalize any editor / seed icon value to a WebsiteIcon lookup key. */
export function resolveWebsiteIconName(
  name: unknown,
  fallback = "Users",
): string {
  const raw = String(name ?? "").trim();
  if (!raw || raw === "none") return fallback;
  const stripped = raw.replace(/^Icon/i, "").trim() || raw;
  const lower = stripped.toLowerCase();
  const aliased = ICON_ALIASES[lower] || ICON_ALIASES[toKebabIconName(stripped)];
  if (aliased) return aliased;
  const pascal = toLucideIconName(stripped);
  if (ICON_LOOKUP[pascal] || ICON_LOOKUP[pascal.toLowerCase()]) return pascal;
  return pascal || fallback;
}

export function getLucideIcon(
  name: string,
  fallback: LucideIcon = Users,
): LucideIcon {
  if (!name || isSvgIconValue(name)) return fallback;

  const resolved = resolveWebsiteIconName(name, "");
  if (!resolved) return fallback;

  return (
    ICON_LOOKUP[resolved] ||
    ICON_LOOKUP[resolved.toLowerCase()] ||
    ICON_LOOKUP[toLucideIconName(resolved)] ||
    ICON_LOOKUP[toKebabIconName(resolved)] ||
    ICON_LOOKUP[name] ||
    ICON_LOOKUP[toLucideIconName(name)] ||
    ICON_LOOKUP[toKebabIconName(name)] ||
    fallback
  );
}

export function formatIconLabel(name: string) {
  const pascal = toLucideIconName(name.replace(/^Icon/i, ""));
  return pascal.replace(/([A-Z])/g, " $1").trim() || name;
}

type WebsiteIconProps = {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

export function WebsiteIcon({
  name,
  size = 24,
  className,
  strokeWidth = 1.5,
  style,
}: WebsiteIconProps) {
  const value = String(name || "");

  if (/<svg[\s>]/i.test(value)) {
    return (
      <span
        className={`inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full ${className ?? ""}`}
        style={{ width: size, height: size, ...style }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  if (/^data:image\/svg/i.test(value) || /\.svg(\?|#|$)/i.test(value)) {
    return (
      <img
        src={value}
        alt=""
        width={size}
        height={size}
        className={className}
        style={style}
      />
    );
  }

  const Icon = getLucideIcon(value);
  return (
    <Icon
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}

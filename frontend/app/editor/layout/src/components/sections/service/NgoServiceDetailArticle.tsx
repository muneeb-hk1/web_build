import type { ReactNode } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { normalizeServiceDetailLayout } from "../../../lib/serviceLayouts";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

export type ServiceDetailContent = {
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  layout?: string;
};

export type ServiceDetailCategory = {
  id?: string;
  name: string;
  slug: string;
};

export type ServiceDetailSidebarCta = {
  icon?: string;
  iconName?: string;
  tagline?: string;
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgImage?: string;
};

export type ServiceDetailSubService = {
  id?: string;
  title: string;
  description?: string;
  image?: string;
};

type NgoServiceDetailArticleProps = {
  service: ServiceDetailContent;
  backSlot?: ReactNode;
  categories?: ServiceDetailCategory[];
  activeCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
  sidebarCta?: ServiceDetailSidebarCta | null;
  features?: string[];
  subServices?: ServiceDetailSubService[];
};

const PAGE_SHELL =
  "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12";

/** Same stack as NGO sections (General Sans from site root / --font-body). */
const SITE_FONT_STYLE = {
  fontFamily:
    "var(--font-body, var(--font-general-sans-medium), ui-sans-serif, system-ui, sans-serif)",
} as const;

const PROSE_CLASS =
  "service-detail-prose theme-prose max-w-none text-left text-base leading-8 text-[#556052] sm:text-lg [&_p]:mb-5 [&_h1]:mb-3 [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-[#1F2B20] [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-[#1F2B20] [&_h2:first-child]:mt-0 sm:[&_h2]:text-[1.75rem] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-[#1F2B20] [&_h1]:![font-family:inherit] [&_h2]:![font-family:inherit] [&_h3]:![font-family:inherit] [&_h4]:![font-family:inherit] [&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-[#007A5E] [&_blockquote]:bg-[#f8faf8] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-lg [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:leading-8 [&_blockquote]:text-[#1F2B20] sm:[&_blockquote]:text-xl sm:[&_blockquote]:leading-9 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6 [&_li]:leading-7 [&_strong]:font-bold [&_strong]:text-[#1F2B20] [&_em]:italic [&_a]:font-semibold [&_a]:underline";

const stripHtmlText = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const HtmlOrText = ({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) => {
  const trimmed = value.trim();
  if (!trimmed || !stripHtmlText(trimmed)) return null;
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return (
      <div
        className={`${PROSE_CLASS} ${className}`}
        style={SITE_FONT_STYLE}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }
  return (
    <div
      className={`whitespace-pre-wrap text-left text-lg leading-8 text-[#556052] ${className}`}
      style={SITE_FONT_STYLE}
    >
      {trimmed}
    </div>
  );
};

const BackRow = ({
  children,
  light = false,
}: {
  children?: ReactNode;
  light?: boolean;
}) => {
  if (!children) return null;
  return (
    <div
      className={`mb-6 sm:mb-8 ${light ? "[&_a]:text-white/90 [&_a]:hover:text-white" : ""}`}
    >
      {children}
    </div>
  );
};

const CategoryFilterSidebar = ({
  categories,
  activeCategorySlug,
  onSelectCategory,
  sidebarCta,
}: {
  categories: ServiceDetailCategory[];
  activeCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
  sidebarCta?: ServiceDetailSidebarCta | null;
}) => {
  const active = (activeCategorySlug || "").trim().toLowerCase();

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-[#E8E4D9] bg-white shadow-[0_12px_40px_rgba(31,43,32,0.06)]">
        <div className="border-b border-[#E8E4D9] bg-[#F7F5EF] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
            Categories
          </p>
          <p className="mt-1 text-sm font-semibold text-[#1F2B20]">
            Explore our programs
          </p>
        </div>
        <nav className="p-2" aria-label="Service categories">
          <ul className="space-y-1">
            {categories.map((category) => {
              const slug = (category.slug || "").trim();
              const isActive =
                Boolean(active) &&
                (slug.toLowerCase() === active ||
                  category.name.trim().toLowerCase() === active);
              return (
                <li key={category.id || slug || category.name}>
                  <button
                    type="button"
                    data-editor-keep-click="true"
                    onClick={() => {
                      if (!slug || !onSelectCategory) return;
                      onSelectCategory(slug);
                    }}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#24422D] text-white shadow-md shadow-[#24422D]/20"
                        : "text-[#1F2B20] hover:bg-[#F4F1E8] hover:text-[#F15A24]"
                    }`}
                  >
                    <span className="min-w-0 leading-snug">{category.name}</span>
                    <FiArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "translate-x-0.5 text-white"
                          : "text-[#9CA3AF] group-hover:translate-x-0.5 group-hover:text-[#F15A24]"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {sidebarCta?.title ? (
        <div className="relative overflow-hidden rounded-2xl bg-[#24422D] text-white shadow-[0_16px_40px_rgba(36,66,45,0.28)]">
          {sidebarCta.bgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sidebarCta.bgImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-[#24422D]/95 via-[#24422D]/85 to-[#F15A24]/55" />
          <div className="relative space-y-3 px-5 py-6">
            <div
              data-editor-icon-host
              className="inline-flex rounded-xl border border-white/20 bg-white/10 p-2.5"
            >
              <EditableNgoIcon
                name={sidebarCta.icon || sidebarCta.iconName || "hand-heart"}
                className="h-6 w-6 text-orange-300"
                strokeWidth={1.6}
              />
            </div>
            {sidebarCta.tagline ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                {sidebarCta.tagline}
              </p>
            ) : null}
            <p className="text-xl font-extrabold leading-snug tracking-tight">
              {sidebarCta.title}
            </p>
            {sidebarCta.buttonText ? (
              <a
                href={sidebarCta.buttonUrl || "#"}
                data-editor-keep-click="true"
                data-editor-nav="true"
                className="inline-flex items-center gap-2 rounded-full bg-[#F15A24] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e04b00]"
              >
                <span>{sidebarCta.buttonText}</span>
                <FiArrowRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
};

const FeatureChips = ({ features }: { features: string[] }) => {
  if (!features.length) return null;
  return (
    <div className="mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
        What we deliver
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 rounded-xl border border-[#E8E4D9] bg-[#FBFaf6] px-4 py-3 text-sm font-semibold leading-snug text-[#1F2B20]"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <FiCheck className="h-3 w-3" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SubServicesGrid = ({
  subServices,
}: {
  subServices: ServiceDetailSubService[];
}) => {
  if (!subServices.length) return null;
  return (
    <div className="mt-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
        Focus areas
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {subServices.map((item, index) => (
          <article
            key={item.id || `${item.title}-${index}`}
            className="overflow-hidden rounded-2xl border border-[#E8E4D9] bg-white shadow-[0_10px_30px_rgba(31,43,32,0.05)]"
          >
            {item.image ? (
              <div className="relative aspect-[16/10] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div className="space-y-2 px-5 py-4">
              <h3 className="text-lg font-extrabold tracking-tight text-[#1F2B20]">
                {item.title}
              </h3>
              {item.description ? (
                <p className="text-sm leading-6 text-[#556052]">
                  {item.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default function NgoServiceDetailArticle({
  service,
  backSlot,
  categories = [],
  activeCategorySlug,
  onSelectCategory,
  sidebarCta,
  features = [],
  subServices = [],
}: NgoServiceDetailArticleProps) {
  const layout = normalizeServiceDetailLayout(service.layout);
  const title = service.title || "Untitled service";
  const category = service.category?.trim() || "";
  const excerpt = service.excerpt?.trim() || "";
  const content =
    service.content?.trim() ||
    excerpt ||
    "No content has been added to this service yet.";
  const image = service.image?.trim() || "/bg1.jpg";
  const hasCategoryFilter = categories.length > 0;

  // ServiceDetail-2 — Split inside same page width
  if (layout === "ServiceDetail-2") {
    return (
      <article className="w-full bg-[#f4f7f6] text-slate-950">
        <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
          <BackRow>{backSlot}</BackRow>
          <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid lg:min-h-[560px] lg:grid-cols-2">
            <div className="relative min-h-[280px] bg-slate-200 sm:min-h-[360px] lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/45 via-transparent to-teal-900/15" />
              {category ? (
                <p className="absolute left-6 top-6 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800 shadow-sm">
                  {category}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
                What we offer
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-5 text-lg leading-8 text-slate-600 sm:text-xl">
                  {excerpt}
                </p>
              ) : null}
              <div className="mt-8 border-t border-slate-200 pt-8">
                <HtmlOrText value={content} />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ServiceDetail-3 — Cover image same width as content
  if (layout === "ServiceDetail-3") {
    return (
      <article className="w-full bg-white text-slate-950">
        <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
          <BackRow>{backSlot}</BackRow>
          <div className="relative isolate min-h-[min(58vh,520px)] overflow-hidden rounded-[1.75rem] bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/45 to-slate-950/90" />
            <div className="relative flex min-h-[min(58vh,520px)] flex-col justify-end px-6 pb-10 pt-16 sm:px-10 sm:pb-12">
              {category ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal-200">
                  {category}
                </p>
              ) : null}
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85 sm:text-xl">
                  {excerpt}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-12 sm:mt-14">
            <HtmlOrText value={content} />
          </div>
        </div>
      </article>
    );
  }

  // ServiceDetail-4 — Sidebar categories filter + rich article (NGO default)
  if (layout === "ServiceDetail-4") {
    if (hasCategoryFilter) {
      return (
        <article
          className="w-full bg-[#FBFaf6] font-sans text-[#1F2B20]"
          style={SITE_FONT_STYLE}
        >
          <div className={`${PAGE_SHELL} py-6 sm:py-10`}>
            <BackRow>{backSlot}</BackRow>
            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
              <CategoryFilterSidebar
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                onSelectCategory={onSelectCategory}
                sidebarCta={sidebarCta}
              />

              <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#E8E4D9] bg-white shadow-[0_18px_50px_rgba(31,43,32,0.07)]">
                <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2B20]/55 via-transparent to-transparent" />
                  {category ? (
                    <p className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm">
                      {category}
                    </p>
                  ) : null}
                </div>

                <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2B20] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12] ![font-family:inherit]">
                    {title}
                  </h1>
                  {excerpt ? (
                    <p className="mt-4 max-w-3xl text-base leading-7 text-[#556052] sm:text-lg sm:leading-8">
                      {excerpt}
                    </p>
                  ) : null}

                  <div className="mt-8 border-t border-[#EFEBE0] pt-8">
                    <HtmlOrText value={content} />
                  </div>

                  <FeatureChips features={features} />
                  <SubServicesGrid subServices={subServices} />
                </div>
              </div>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article
        className="w-full bg-white font-sans text-[#1F2B20]"
        style={SITE_FONT_STYLE}
      >
        <div className={`${PAGE_SHELL} pt-4 pb-6 sm:pt-5 sm:pb-8`}>
          <BackRow>{backSlot}</BackRow>
          <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="min-w-0">
              {category ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {category}
                </p>
              ) : null}
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1F2B20] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ![font-family:inherit]">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-3 max-w-xl text-base leading-7 text-[#556052] sm:text-lg sm:leading-8">
                  {excerpt}
                </p>
              ) : null}
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_16px_40px_rgba(15,23,42,0.1)] lg:aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className={`${PAGE_SHELL} py-8 sm:py-10`}>
            <HtmlOrText value={content} />
            <FeatureChips features={features} />
            <SubServicesGrid subServices={subServices} />
          </div>
        </div>
      </article>
    );
  }

  // ServiceDetail-5 — Title, image, content — same width
  if (layout === "ServiceDetail-5") {
    return (
      <article className="w-full bg-slate-50 text-slate-950">
        <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
          <BackRow>{backSlot}</BackRow>
          {category ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal-800">
              {category}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {excerpt ? (
            <p className="mt-6 border-l-[3px] border-teal-700 pl-5 text-xl font-medium leading-9 text-slate-700 sm:text-2xl">
              {excerpt}
            </p>
          ) : null}
          <div className="relative mt-10 aspect-[21/9] w-full overflow-hidden rounded-2xl sm:mt-12 sm:aspect-[2.4/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-12 sm:mt-14">
            <HtmlOrText value={content} />
          </div>
        </div>
      </article>
    );
  }

  // ServiceDetail-1 — Hero image + text, same page width
  return (
    <article className="w-full bg-white text-slate-950">
      <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
        <BackRow>{backSlot}</BackRow>
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="aspect-[16/7] w-full object-cover sm:aspect-[2.4/1] lg:aspect-[2.8/1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-20 sm:px-10 sm:pb-10">
            {category ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200">
                {category}
              </p>
            ) : null}
            <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {excerpt ? (
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85 sm:text-xl">
                {excerpt}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-12 sm:mt-14">
          <HtmlOrText value={content} />
        </div>
      </div>
    </article>
  );
}

import type { ReactNode } from "react";
import { normalizePortfolioDetailLayout } from "../../../lib/portfolioLayouts";

export type PortfolioDetailContent = {
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  layout?: string;
};

type NgoPortfolioDetailArticleProps = {
  portfolioItem: PortfolioDetailContent;
  backSlot?: ReactNode;
};

const PAGE_SHELL = "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12";

const PROSE_CLASS =
  "portfolio-detail-prose manager-detail-prose theme-prose max-w-none text-left text-base leading-8 text-slate-700 sm:text-lg [&_p]:mb-5 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-slate-950 sm:[&_h2]:text-3xl [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:theme-accent-border-l [&_blockquote]:bg-slate-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-xl [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:leading-9 [&_blockquote]:text-slate-700 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:leading-7 [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic [&_a]:font-semibold [&_a]:underline";

const MetaRow = ({
  category,
  light = false,
}: {
  category?: string;
  light?: boolean;
}) => {
  if (!category) return null;
  return (
    <p
      className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold ${
        light ? "text-white/80" : "text-slate-500"
      }`}
    >
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          light ? "bg-white/15 text-white" : "theme-accent-soft"
        }`}
      >
        {category}
      </span>
    </p>
  );
};

const HtmlOrText = ({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return (
      <div
        className={`${PROSE_CLASS} ${className}`}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }
  return (
    <div
      className={`whitespace-pre-wrap text-left text-lg leading-8 text-slate-700 ${className}`}
    >
      {trimmed}
    </div>
  );
};

const BackRow = ({ children }: { children?: ReactNode }) => {
  if (!children) return null;
  return <div className="mb-6 sm:mb-8">{children}</div>;
};

export default function NgoPortfolioDetailArticle({
  portfolioItem,
  backSlot,
}: NgoPortfolioDetailArticleProps) {
  const layout = normalizePortfolioDetailLayout(portfolioItem.layout);
  const title = portfolioItem.title || "Untitled portfolio item";
  const category = portfolioItem.category?.trim() || "";
  const excerpt = portfolioItem.excerpt?.trim() || "";
  const rawContent = portfolioItem.content?.trim() || "";
  const plainContent = rawContent
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const contentIsOnlyExcerpt =
    Boolean(excerpt) && plainContent.toLowerCase() === excerpt.toLowerCase();
  const content =
    rawContent && !contentIsOnlyExcerpt
      ? rawContent
      : "No content has been added to this project yet. Open the Portfolio manager and edit the Content field to add quotes, bold text, and bullet points.";
  const image = portfolioItem.image?.trim() || "/bg1.jpg";

  // PortfolioDetail-2 — Split showcase
  if (layout === "PortfolioDetail-2") {
    return (
      <article className="w-full bg-slate-50 text-slate-950">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-blue-900/10" />
              {category ? (
                <p className="absolute left-6 top-6 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] theme-accent shadow-sm">
                  {category}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] theme-accent">
                Project
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-5 text-lg leading-8 text-slate-600">{excerpt}</p>
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

  // PortfolioDetail-3 — Cover hero
  if (layout === "PortfolioDetail-3") {
    return (
      <article className="w-full bg-white text-slate-950">
        <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
          <BackRow>{backSlot}</BackRow>
          <div className="relative isolate min-h-[min(58vh,520px)] overflow-hidden rounded-[1.75rem] bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/45 to-slate-950/90" />
            <div className="relative flex min-h-[min(58vh,520px)] flex-col justify-end px-6 pb-10 pt-16 sm:px-10 sm:pb-12">
              <MetaRow category={category || "Project"} light />
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

  // PortfolioDetail-4 — Intro + sticky summary
  if (layout === "PortfolioDetail-4") {
    return (
      <article className="w-full bg-white text-slate-950">
        <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#eef4ff_0%,#ffffff_100%)]">
          <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
            <BackRow>{backSlot}</BackRow>
            <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <div>
                <MetaRow category={category} />
                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                {excerpt ? (
                  <p className="mt-5 text-xl font-medium leading-9 text-slate-600">
                    {excerpt}
                  </p>
                ) : null}
              </div>
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[1.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.12)] lg:aspect-[5/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${PAGE_SHELL} grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16`}
        >
          <HtmlOrText value={content} />
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-l-2 theme-accent-border-l pl-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                About this project
              </p>
              <p className="mt-3 text-xl font-bold text-slate-950">{title}</p>
              {category ? (
                <p className="mt-2 text-sm font-semibold theme-accent">
                  {category}
                </p>
              ) : null}
              {excerpt ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">{excerpt}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </article>
    );
  }

  // PortfolioDetail-5 — Editorial story
  if (layout === "PortfolioDetail-5") {
    return (
      <article className="w-full bg-slate-50 text-slate-950">
        <div className={`${PAGE_SHELL} py-10 sm:py-14`}>
          <BackRow>{backSlot}</BackRow>
          {category ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] theme-accent">
              {category}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {excerpt ? (
            <p className="mt-6 border-l-[3px] theme-accent-border-l pl-5 text-xl font-medium leading-9 text-slate-700 sm:text-2xl">
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

  // PortfolioDetail-1 — Hero image + body (default)
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
            <MetaRow category={category || "Project"} light />
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

"use client";

import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";
import CleaningSlider from "../shared/CleaningSlider";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultPosts = [
  {
    title: "How To Clean And Spread Disinfect Home & Office",
    date: "20 Mar 2024",
    image: `${ASSET}/news/1.jpg`,
    href: "/blog/detail",
  },
  {
    title: "Superior Clean Through Our Trained Cleaning Staff",
    date: "21 Mar 2024",
    image: `${ASSET}/news/2.jpg`,
    href: "/blog/detail",
  },
  {
    title: "Corona Virus Infection Prevention Everywhere",
    date: "22 Mar 2024",
    image: `${ASSET}/news/3.jpg`,
    href: "/blog/detail",
  },
];

export default function CleaningBlog1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const pretitle = String(data.pretitle || data.subtitle || "News");
  const title = String(data.title || "Our Latest News");
  const posts = (
    Array.isArray(data.blogItems) && data.blogItems.length
      ? data.blogItems
      : Array.isArray(data.blogs) && data.blogs.length
        ? data.blogs
        : defaultPosts
  ) as Array<Record<string, any>>;
  const readMore = String(data.readMoreText || "Read More");
  const layout = String(data.layout || "slider");

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  const postCards = posts.map((post, index) => {
    const postTitle = String(post.title || "Article");
    const date = String(post.date || "");
    const image = String(post.image || `${ASSET}/news/1.jpg`);
    const href = String(
      post.href || post.link || `${data.detailBasePath || "/blog"}/detail`,
    );

    return (
      <article
        key={`${postTitle}-${index}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-md border border-gray-100 bg-white p-3 shadow-[0_5px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
      >
        <div className="relative h-[240px] w-full overflow-hidden rounded-sm">
          <img
            src={image}
            alt={postTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {date ? (
            <div className="absolute top-0 left-0 rounded-br-sm bg-[var(--accent)] px-4 py-2 text-[13px] font-bold text-white">
              {date}
            </div>
          ) : null}
        </div>
        <div className="flex grow flex-col px-2 pt-6 pb-4">
          <h4 className="mb-6 text-[20px] leading-[1.4] font-bold text-[#0D2235] transition-colors hover:text-[var(--accent)] md:text-[22px]">
            <Link
              href={href}
              onClick={(event) => handleNavigate(event, href, postTitle)}
            >
              {postTitle}
            </Link>
          </h4>
          <div className="mt-auto">
            <Link
              href={href}
              onClick={(event) => handleNavigate(event, href, postTitle)}
              className="inline-block rounded-full bg-[var(--accent)] px-7 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[#138A56]"
            >
              {readMore}
            </Link>
          </div>
        </div>
      </article>
    );
  });

  return (
    <section
      className="relative bg-white pt-4 pb-6 md:pt-6 md:pb-8"
      style={getAccentStyle(accent)}
      data-editor-fields="accentColor pretitle title blogItems"
    >
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-block text-[18px] font-bold tracking-wide text-[#22A46D]">
            {pretitle}
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-[#0B2942] sm:text-4xl md:text-[45px]">
            {title}
          </h2>
        </div>

        {layout === "grid" ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {postCards}
          </div>
        ) : (
          <CleaningSlider
            showDots
            autoplayMs={4000}
            gapClassName="gap-7"
            itemClassName="w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)]"
          >
            {postCards}
          </CleaningSlider>
        )}
      </div>
    </section>
  );
}

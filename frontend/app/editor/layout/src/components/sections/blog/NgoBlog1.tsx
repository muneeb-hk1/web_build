"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { site, type NGOBlogData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  getNgoBlogDetailHref,
  resolveNgoBlogPostSlug,
  writeNgoBlogDetailSlug,
} from "../../../lib/ngoBlogDetails";

type BlogSectionProps = SectionProps & {
  showAll?: boolean;
};

const flattenPreviewLinks = (
  links: Array<{ label?: string; href?: string; children?: unknown[] }> = [],
): Array<{ label?: string; href?: string }> =>
  links.flatMap((link) => [
    { label: link.label, href: link.href },
    ...flattenPreviewLinks(
      (link.children as Array<{
        label?: string;
        href?: string;
        children?: unknown[];
      }>) || [],
    ),
  ]);

const hrefSlug = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/^#page-/, "")
    .replace(/^\/+/, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function NgoBlog1({
  data: customData,
  showAll = false,
}: BlogSectionProps) {
  const preview = useOptionalPreview();
  const data = {
    ...site.blog,
    ...((customData ?? {}) as Partial<NGOBlogData>),
  };
  const { pretitle, title, desc, button } = data;
  const incomingPosts = Array.isArray(data.posts) ? data.posts : [];
  const fallbackPosts = Array.isArray(site.blog?.posts) ? site.blog.posts : [];
  const incomingTitles = incomingPosts
    .map((post) =>
      typeof post?.title === "string" ? post.title.trim().toLowerCase() : "",
    )
    .filter(Boolean);
  // Recover when a bad overlay cloned one post across the whole grid.
  const postsCollapsed =
    incomingTitles.length > 1 && new Set(incomingTitles).size <= 1;
  const posts =
    postsCollapsed && fallbackPosts.length > 1 ? fallbackPosts : incomingPosts;
  const displayPosts = showAll ? posts : posts.slice(0, 3);

  const openEditorPage = (href: string, fallbackLabel: string) => {
    if (!preview) return;
    const slug = hrefSlug(href);
    const match = flattenPreviewLinks(preview.pageLinks).find((link) => {
      const linkSlug = hrefSlug(link.href) || hrefSlug(link.label);
      return Boolean(slug) && (linkSlug === slug || hrefSlug(link.label) === slug);
    });
    preview.setCurrentPage(match?.label || fallbackLabel);
  };

  const openBlogDetail = (
    event: ReactMouseEvent,
    post: (typeof posts)[number],
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!preview) return;
    const slug = resolveNgoBlogPostSlug(post);
    writeNgoBlogDetailSlug(slug);
    // Always open the shared Blog Details page — never a per-post page slug.
    preview.setCurrentPage("Blog Details");
  };

  const openBlogListing = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!preview) return;
    event.preventDefault();
    openEditorPage(button?.href || "/blog", "Blog");
  };

  return (
    <>
      <section
        data-editor-section-label="Blog"
        data-editor-fields="icon pretitle title desc button posts"
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa] font-sans"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-9">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg ">
              <EditableNgoIcon
                name={data.icon || data.iconName || "hand-heart"}
                className="w-8 h-8 text-emerald-600"
              />
              <span className="italic font-serif">{pretitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2 max-w-3xl">
              {title}
            </h2>
            <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto"></div>


            <p className="text-base sm:text-lg leading-relaxed text-gray-500 leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Blog Posts Grid — posts edit via Blogs manager / Edit, not canvas inline */}
          <div
            data-editor-no-inline="true"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayPosts.map((post, index) => {
              const detailHref = getNgoBlogDetailHref(post);
              return (
              <div
                key={String(post.id ?? post.slug ?? post.title ?? index)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
                data-editor-keep-click="true"
                onClick={(event) => openBlogDetail(event, post)}
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.image || "/NGO_Images/happy-diverse-kinds-park.jpg"}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#ff5500] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-[#08121e] group-hover:text-[#ff5500] transition-colors duration-200 line-clamp-2 mb-2">
                      <Link
                        href={detailHref}
                        data-editor-keep-click="true"
                        onClick={(event) => openBlogDetail(event, post)}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={detailHref}
                    onClick={(event) => {
                      if (!preview) return;
                      event.preventDefault();
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#ff5500] hover:text-[#e04b00] transition-colors"
                  >
                    <span>Read More</span>
                    <span
                      data-editor-no-inline
                      title="Open blog details"
                      className="inline-flex"
                      onClick={(event) => openBlogDetail(event, post)}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            );
            })}
          </div>

          {/* View All Button (Hidden on full blog page) */}
          {!showAll && button && (
            <div className="text-center mt-12">
              <Link
                href={button.href || "/blog"}
                data-editor-keep-click="true"
                onClick={openBlogListing}
                className="inline-flex items-center justify-center bg-[#ff5500] text-white text-sm font-bold px-7 py-3.5 rounded-full hover:bg-[#e04b00] transition-colors shadow-md"
              >
                {button.label}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

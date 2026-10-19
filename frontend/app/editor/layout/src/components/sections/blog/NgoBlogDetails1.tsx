"use client";

import { useEffect, useMemo, useState } from "react";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  buildNgoBlogDetailFields,
  buildReadableNgoBlogBody,
  findNgoBlogPost,
  NGO_BLOG_DETAIL_SLUG_EVENT,
  readNgoBlogDetailSlug,
  resolveNgoBlogPostSlug,
} from "../../../lib/ngoBlogDetails";
import {
  DEFAULT_BLOG_DETAIL_LAYOUT,
  normalizeBlogDetailLayout,
} from "../../../lib/blogLayouts";
import NgoBlogDetailArticle from "./NgoBlogDetailArticle";

const flattenPreviewLinks = (
  links: Array<{
    label?: string;
    href?: string;
    slug?: string;
    kind?: string;
    image?: string;
    author?: string;
    category?: string;
    shortDescription?: string;
    longDescription?: string;
    layout?: string;
    createdAt?: string;
    children?: unknown[];
  }> = [],
) =>
  links.flatMap((link) => [
    link,
    ...flattenPreviewLinks(
      (link.children as typeof links | undefined) || [],
    ),
  ]);

export default function NgoBlogDetails1({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const sectionData = (customData || {}) as Record<string, unknown>;
  const articleFallback =
    sectionData.article && typeof sectionData.article === "object"
      ? (sectionData.article as Record<string, unknown>)
      : ((site.blogDetails?.article || site.blogDetail?.article || null) as
          | Record<string, unknown>
          | null);

  const blogPosts = useMemo(() => {
    const fromDetail = Array.isArray(sectionData.posts)
      ? (sectionData.posts as Record<string, unknown>[])
      : [];
    const fromSiteBlog = Array.isArray(site.blog?.posts)
      ? (site.blog.posts as Record<string, unknown>[])
      : [];
    const fromSiteBlogPage = Array.isArray(site.blogPage?.posts)
      ? (site.blogPage.posts as Record<string, unknown>[])
      : [];
    if (fromDetail.length) return fromDetail;
    if (fromSiteBlog.length) return fromSiteBlog;
    return fromSiteBlogPage;
  }, [sectionData.posts]);

  const managerPosts = useMemo(
    () =>
      flattenPreviewLinks(preview?.pageLinks || []).filter(
        (link) => link.kind === "blog",
      ),
    [preview?.pageLinks],
  );

  const [selectedSlug, setSelectedSlug] = useState("");

  useEffect(() => {
    const syncSlug = () => setSelectedSlug(readNgoBlogDetailSlug());
    syncSlug();
    window.addEventListener(NGO_BLOG_DETAIL_SLUG_EVENT, syncSlug);
    return () => window.removeEventListener(NGO_BLOG_DETAIL_SLUG_EVENT, syncSlug);
  }, [preview?.currentPage]);

  const selectedListingPost = useMemo(() => {
    const matched = findNgoBlogPost(blogPosts, selectedSlug);
    if (matched) return matched;
    return blogPosts[0] || null;
  }, [blogPosts, selectedSlug]);

  const selectedManagerPost = useMemo(() => {
    const target =
      resolveNgoBlogPostSlug(selectedListingPost || undefined) || selectedSlug;
    if (!target) return null;
    return (
      managerPosts.find(
        (post) =>
          resolveNgoBlogPostSlug({
            slug: post.slug,
            href: post.href,
            title: post.label,
          }) === target,
      ) ||
      managerPosts.find(
        (post) =>
          (post.label || "").trim().toLowerCase() ===
          String(selectedListingPost?.title || "")
            .trim()
            .toLowerCase(),
      ) ||
      null
    );
  }, [managerPosts, selectedListingPost, selectedSlug]);

  const mergedSource = useMemo(() => {
    const listing = selectedListingPost || {};
    const manager = selectedManagerPost
      ? {
          title: selectedManagerPost.label,
          label: selectedManagerPost.label,
          author: selectedManagerPost.author,
          category: selectedManagerPost.category,
          excerpt: selectedManagerPost.shortDescription,
          shortDescription: selectedManagerPost.shortDescription,
          content: selectedManagerPost.longDescription,
          longDescription: selectedManagerPost.longDescription,
          image: selectedManagerPost.image,
          layout: selectedManagerPost.layout,
          slug: selectedManagerPost.slug || selectedManagerPost.href,
          href: selectedManagerPost.href,
        }
      : {};
    return { ...listing, ...manager };
  }, [selectedListingPost, selectedManagerPost]);

  const fallbackLayout = normalizeBlogDetailLayout(
    (typeof sectionData.layout === "string" && sectionData.layout) ||
      (typeof sectionData.detailLayout === "string" &&
        sectionData.detailLayout) ||
      DEFAULT_BLOG_DETAIL_LAYOUT,
  );

  const built = buildNgoBlogDetailFields(
    mergedSource,
    fallbackLayout,
    articleFallback,
  );

  const sectionMatchesSelected =
    typeof sectionData.title === "string" &&
    sectionData.title.trim().length > 0 &&
    (typeof sectionData.activeSlug !== "string" ||
      !sectionData.activeSlug ||
      !selectedSlug ||
      resolveNgoBlogPostSlug({ slug: String(sectionData.activeSlug) }) ===
        built.activeSlug);

  const fields = sectionMatchesSelected
    ? {
        title: String(sectionData.title || built.title),
        author:
          typeof sectionData.author === "string"
            ? sectionData.author
            : built.author,
        category:
          typeof sectionData.category === "string"
            ? sectionData.category
            : built.category,
        excerpt:
          typeof sectionData.excerpt === "string"
            ? sectionData.excerpt
            : built.excerpt,
        content: (() => {
          const sectionContent =
            typeof sectionData.content === "string"
              ? sectionData.content.trim()
              : "";
          const sectionExcerpt =
            typeof sectionData.excerpt === "string"
              ? sectionData.excerpt.trim()
              : built.excerpt;
          if (!sectionContent || sectionContent === sectionExcerpt) {
            return built.content;
          }
          // Re-expand when saved body is only the short blurb / thin HTML.
          return buildReadableNgoBlogBody(
            {
              title: String(sectionData.title || built.title),
              excerpt: sectionExcerpt,
              content: sectionContent,
              longDescription: sectionContent,
            },
            articleFallback,
          );
        })(),
        image:
          typeof sectionData.image === "string" && sectionData.image.trim()
            ? sectionData.image
            : built.image,
        layout: normalizeBlogDetailLayout(
          (typeof sectionData.layout === "string" && sectionData.layout) ||
            (typeof sectionData.detailLayout === "string" &&
              sectionData.detailLayout) ||
            built.layout,
        ),
      }
    : built;

  return (
    <main
      className="bg-white"
      data-editor-section-label="Blog Details"
      data-editor-fields="title,author,category,excerpt,content,image,layout"
    >
      <NgoBlogDetailArticle
        key={`${fields.title}-${fields.layout}-${selectedSlug || "blog"}`}
        post={{
          title: fields.title,
          author: fields.author,
          category: fields.category,
          excerpt: fields.excerpt,
          content: fields.content,
          image: fields.image,
          layout: fields.layout,
        }}
      />
    </main>
  );
}

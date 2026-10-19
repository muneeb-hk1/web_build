"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import NgoBlog1 from "./NgoBlog1";
import NgoBlogIndexList, { type NgoBlogIndexItem } from "./NgoBlogIndexList";
import type { SectionProps } from "../../../types/section";
import { site, type NGOBlogData } from "../data/categorySite";
import { useOptionalPreview } from "../../context/PreviewContext";
import {
  getNgoBlogDetailHref,
  resolveNgoBlogPostSlug,
  writeNgoBlogDetailSlug,
} from "../../../lib/ngoBlogDetails";
import {
  DEFAULT_BLOG_INDEX_LAYOUT,
  normalizeBlogIndexLayout,
} from "../../../lib/blogLayouts";

const flattenPreviewLinks = <T extends { children?: T[] }>(links: T[] = []): T[] =>
  links.flatMap((link) => [link, ...flattenPreviewLinks(link.children || [])]);

export default function NgoBlog2({ data: customData }: SectionProps) {
  const preview = useOptionalPreview();
  const candidate = customData as unknown as Partial<NGOBlogData> | undefined;
  const fallback = site.blog ?? {};
  const incomingPosts =
    Array.isArray(candidate?.posts) && candidate.posts.length
      ? candidate.posts
      : [];
  const fallbackPosts = Array.isArray(fallback.posts) ? fallback.posts : [];
  const incomingTitles = incomingPosts
    .map((post) =>
      typeof post?.title === "string" ? post.title.trim().toLowerCase() : "",
    )
    .filter(Boolean);
  const postsCollapsed =
    incomingTitles.length > 1 && new Set(incomingTitles).size <= 1;
  const posts =
    postsCollapsed && fallbackPosts.length
      ? fallbackPosts
      : incomingPosts.length
        ? incomingPosts
        : fallbackPosts;
  const blogData = {
    ...fallback,
    ...candidate,
    banner: { ...(fallback.banner ?? {}), ...candidate?.banner },
    button: { ...(fallback.button ?? {}), ...candidate?.button },
    posts,
  } as NGOBlogData;

  const indexLayout = normalizeBlogIndexLayout(
    flattenPreviewLinks(preview?.pageLinks || []).find(
      (link) =>
        (link as { kind?: string }).kind === "blogIndex" ||
        (link.href || "").trim().toLowerCase() === "#page-blogs" ||
        (link.href || "").trim().toLowerCase() === "#page-blog",
    )?.layout ||
      (typeof (candidate as { indexLayout?: string } | undefined)?.indexLayout ===
      "string"
        ? (candidate as { indexLayout?: string }).indexLayout
        : DEFAULT_BLOG_INDEX_LAYOUT),
  );

  const managerBlogs = flattenPreviewLinks(preview?.pageLinks || []).filter(
    (link) =>
      (link as { kind?: string; hidden?: boolean }).kind === "blog" &&
      !(link as { hidden?: boolean }).hidden,
  );

  const toIndexItem = (input: {
    title?: string;
    label?: string;
    href?: string;
    slug?: string;
    image?: string;
    category?: string;
    excerpt?: string;
    shortDescription?: string;
    author?: string;
    date?: string;
    createdAt?: string;
  }): NgoBlogIndexItem => {
    const title = (input.title || input.label || "Untitled post").trim();
    const slug = resolveNgoBlogPostSlug({
      slug: input.slug,
      href: input.href,
      title,
      label: title,
    });
    return {
      // Always point at the shared Blog Details route (never #page-blog-<slug>).
      href: getNgoBlogDetailHref({ slug, title, href: input.href }),
      label: title,
      image: input.image,
      category: input.category,
      shortDescription: input.shortDescription || input.excerpt,
      author: input.author,
      createdAt: input.createdAt || input.date,
    };
  };

  const indexItems: NgoBlogIndexItem[] = (
    managerBlogs.length
      ? managerBlogs.map((link) =>
          toIndexItem({
            label: (link as { label?: string }).label,
            href: link.href,
            slug: (link as { slug?: string }).slug,
            image: (link as { image?: string }).image,
            category: (link as { category?: string }).category,
            shortDescription: (link as { shortDescription?: string })
              .shortDescription,
            author: (link as { author?: string }).author,
            createdAt: (link as { createdAt?: string }).createdAt,
          }),
        )
      : posts.map((post) =>
          toIndexItem({
            title: String(post.title || "Untitled post"),
            href: typeof post.href === "string" ? post.href : undefined,
            slug: typeof post.slug === "string" ? post.slug : undefined,
            image: typeof post.image === "string" ? post.image : undefined,
            category:
              typeof post.category === "string" ? post.category : undefined,
            excerpt: typeof post.excerpt === "string" ? post.excerpt : undefined,
            author: typeof post.author === "string" ? post.author : undefined,
            date: typeof post.date === "string" ? post.date : undefined,
          }),
        )
  ).filter((item) => item.label.trim());

  const openBlogDetail = (
    blog: NgoBlogIndexItem,
    event: ReactMouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!preview) return;

    const matchPost =
      posts.find(
        (post) =>
          resolveNgoBlogPostSlug(post) ===
          resolveNgoBlogPostSlug({
            slug: blog.href,
            href: blog.href,
            title: blog.label,
          }),
      ) ||
      posts.find(
        (post) =>
          String(post.title || "")
            .trim()
            .toLowerCase() === blog.label.trim().toLowerCase(),
      );

    const slug =
      resolveNgoBlogPostSlug(
        matchPost || {
          slug: blog.href,
          href: blog.href,
          title: blog.label,
        },
      ) || blog.label;

    writeNgoBlogDetailSlug(slug);
    preview.setCurrentPage("Blog Details");
  };

  return (
    <main className="bg-white">
      <div
        data-editor-section-label="Blog"
        data-editor-fields="icon pretitle title desc button posts"
      >
        {indexItems.length ? (
          <NgoBlogIndexList
            blogs={indexItems}
            layout={indexLayout}
            showHeader={false}
            title={
              /real estate/i.test(String(blogData.title || ""))
                ? "Our Blogs"
                : blogData.title || "Blogs"
            }
            subtitle={blogData.desc || "Stories and updates from our work."}
            getHref={(blog) => blog.href || "/blog-details"}
            onNavigate={openBlogDetail}
          />
        ) : (
          <NgoBlog1 data={blogData} showAll={true} />
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "../header/PestLink";
import { ArrowRight } from "lucide-react";
import siteData from "../../../data/pestContent";
import { useOptionalPreview } from "../../context/PreviewContext";

interface BlogPost {
  id?: number | string;
  title: string;
  slug?: string;
  href?: string;
  image?: string;
  date?: string;
  author?: string;
  summary?: string;
  desc?: string;
}

export default function Blog({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const preview = useOptionalPreview();
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const blogData = {
    ...(pestControl?.sections?.Blog?.variants?.PestBlog1 ||
      pestControl?.sections?.Blogs?.variants?.PestBlogs1 ||
      {}),
    ...data,
  };

  const badge = blogData.pretitle || blogData.badge || "BLOG";
  const title = blogData.title || "Latest Insights & Tips on Pest Control";
  const desc =
    blogData.desc ||
    blogData.description ||
    "Stay informed with expert tips, guides, and updates to keep your home and workplace pest-free.";

  const fallbackPosts: BlogPost[] = [
    {
      title: "10 Expert Tips to Keep Your Home Pest-Free All Year Round",
      slug: "10-expert-tips-to-keep-your-home-pest-free",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Common Household Pests in Delhi NCR and How to Get Rid of Them",
      slug: "common-household-pests-delhi-ncr",
      image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Early Signs of a Pest Infestation Every Homeowner Should Know",
      slug: "early-signs-of-a-pest-infestation",
      image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "How to Protect Your Family from Mosquito-Borne Diseases",
      slug: "how-to-protect-your-family-from-mosquito-borne-diseases",
      image: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Effective Rodent Control Tips for a Cleaner and Safer Home",
      slug: "effective-rodent-control-tips-cleaner-safer-home",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Understanding Termite Damage and How to Prevent It",
      slug: "understanding-termite-damage-how-to-prevent-it",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const rawPosts: any[] =
    blogData.posts || blogData.items || blogData.blogItems || [];
  const pageName = (preview?.currentPage || "").trim().toLowerCase();
  const onBlogListing = pageName === "blog" || pageName === "blogs";
  const homePosts = onBlogListing
    ? rawPosts
    : rawPosts.filter((item) => item?.showOnHome !== false);

  const posts: BlogPost[] =
    rawPosts.length > 0
      ? homePosts.slice(0, 6).map((item, idx) => ({
          title: item.title || item.name || fallbackPosts[idx % fallbackPosts.length].title,
          slug:
            item.slug ||
            (item.title || item.name || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") ||
            fallbackPosts[idx % fallbackPosts.length].slug,
          image: item.image || fallbackPosts[idx % fallbackPosts.length].image,
        }))
      : fallbackPosts;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(posts.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDots = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setDotsCount(Math.max(1, Math.ceil(posts.length / 3)));
        } else if (window.innerWidth >= 768) {
          setDotsCount(Math.max(1, Math.ceil(posts.length / 2)));
        } else {
          setDotsCount(posts.length);
        }
      }
    };

    updateDots();
    window.addEventListener("resize", updateDots);
    return () => window.removeEventListener("resize", updateDots);
  }, [posts.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#3fd080]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#00482B]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3fd080]/12 rounded-full blur-[100px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col items-center px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-5 md:mb-6 max-w-3xl">
          <div className="inline-block bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] px-5 py-1.5 rounded-full mb-2.5 shadow-xs">
            {badge}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-neutral-900 leading-[1.25]">
            {title.includes("Pest Control") ? (
              <>
                {title.split("Pest Control")[0]}
                <span className="text-[#00482B]">Pest Control</span>
                {title.split("Pest Control")[1]}
              </>
            ) : (
              title
            )}
          </h2>

          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
            {desc}
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex gap-6 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post, idx) => {
            const postSlug = post.slug || `post-${idx + 1}`;
            const postLink = `/blog/${postSlug}`;

            return (
              <div
                key={postSlug || idx}
                className="w-full min-w-full md:w-[calc(50%-12px)] md:min-w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] lg:min-w-[calc((100%-48px)/3)] flex-shrink-0 snap-start"
              >
                <Link
                  href={postLink}
                  className="group relative rounded-3xl overflow-hidden h-[390px] sm:h-[410px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-7 border border-black/5 block"
                >
                  <Image
                    src={post.image || fallbackPosts[idx % fallbackPosts.length].image!}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

                  <div className="relative z-20 flex flex-col justify-end w-full">
                    <h3 className="text-white text-[18px] sm:text-[20px] font-bold leading-snug tracking-tight mb-3.5 group-hover:text-[#3fd080] transition-colors line-clamp-3">
                      {post.title}
                    </h3>

                    <div className="w-full h-[1px] bg-white/20 mb-3" />

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-[#3fd080] transition-colors">
                      <span>Read More</span>
                      <ArrowRight
                        size={15}
                        strokeWidth={2.4}
                        className="group-hover:translate-x-1.5 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {dotsCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: dotsCount }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToSlide(dotIdx)}
                aria-label={`Slide to page ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === dotIdx
                    ? "w-6 bg-[#00482B]"
                    : "w-2 bg-[#00482B]/20 hover:bg-[#00482B]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
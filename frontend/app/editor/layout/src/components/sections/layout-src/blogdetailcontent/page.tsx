"use client";

import { Calendar, User, MessageSquare, Quote } from "lucide-react";
import BlogSidebar from "../blogsidebar/page";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { news, about, team } = siteData;

export default function BlogDetailContent({
  title,
  date,
  author,
  comments,
  image,
  innerImage,
  description,
  quote,
  quoteAuthor,
  heading,
  description2,
  description3,
}: {
  title?: string;
  date?: string;
  author?: string;
  comments?: string;
  image?: string;
  innerImage?: string;
  description?: string;
  quote?: string;
  quoteAuthor?: string;
  heading?: string;
  description2?: string;
  description3?: string;
}) {
  const post = news.items[0];
  const nextPost = news.items[1] ?? post;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <div className="lg:w-[65%]">
            <div className="mb-6 overflow-hidden rounded-sm">
              <img
                src={image || post.image}
                alt={title || post.title}
                className="h-[450px] w-full object-cover"
              />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-5 pt-4">
              <div className="flex items-center gap-2 text-[14px] text-[#4A4A4A]">
                <Calendar size={16} className="text-[#00A562]" />
                {date || post.date}
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#4A4A4A]">
                <User size={16} className="text-[#00A562]" />
                {author || team.members[0]?.name}
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#4A4A4A]">
                <MessageSquare size={16} className="text-[#00A562]" />
                {comments || "No Comments"}
              </div>
            </div>

            <h2 className="mb-6 text-[28px] leading-[1.3] font-bold text-[#024933] md:text-[34px]">
              {title || post.title}
            </h2>

            <p className="mb-10 text-[14px] leading-[1.8] text-[#555555]">
              {description || about.description1}
            </p>

            {quote || about.description2 ? (
              <div className="mb-10 bg-[#F9FAFB] p-8 md:p-10">
                <Quote size={32} className="mb-6 text-[#1FA463]" strokeWidth={1.5} />
                <p className="mb-6 text-[14px] leading-[1.8] text-[#555555]">
                  {quote || about.description2}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-[1.5px] w-[30px] bg-[#333333]" />
                  <span className="text-[14px] text-[#333333]">
                    {quoteAuthor || team.members[0]?.name}
                  </span>
                </div>
              </div>
            ) : null}

            {description2 ? (
              <p className="mb-10 text-[14px] leading-[1.8] text-[#555555]">
                {description2}
              </p>
            ) : null}

            <div className="mb-8 overflow-hidden">
              <img
                src={innerImage || nextPost.image}
                alt={heading || nextPost.title}
                className="h-[300px] w-full object-cover"
              />
            </div>

            <h3 className="mb-5 text-[22px] font-extrabold text-[#0B4F2F]">
              {heading || nextPost.title}
            </h3>

            <p className="mb-5 text-[14px] leading-[1.8] text-[#555555]">
              {description3 || about.description1}
            </p>
            <p className="text-[14px] leading-[1.8] text-[#555555]">
              {about.description2}
            </p>
          </div>

          <div className="sticky top-28 z-10 lg:w-[35%]">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}

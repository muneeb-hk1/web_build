"use client";

import type { SectionProps } from "../../../types/section";
import BlogDetailContent from "../layout-src/blogdetailcontent/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import { serviceHome1Content as siteData } from "../../../data/layoutSite";

export default function CleaningBlogDetail1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const post = siteData.news.items[0];

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="title date author comments image innerImage description quote quoteAuthor heading description2 description3 backgroundImage"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-white/90" />
        ) : null}
        <div className="relative">
          <BlogDetailContent
            title={String(data.title || post.title)}
            date={String(data.date || post.date)}
            author={String(data.author || "")}
            comments={String(data.comments || "")}
            image={String(data.image || post.image)}
            innerImage={String(data.innerImage || "")}
            description={String(data.description || "")}
            quote={String(data.quote || "")}
            quoteAuthor={String(data.quoteAuthor || "")}
            heading={String(data.heading || "")}
            description2={String(data.description2 || "")}
            description3={String(data.description3 || "")}
          />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}

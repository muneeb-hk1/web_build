"use client";

import Link from "next/link";
import { Search, ChevronRight, FileText, CheckCircle2, Download } from "lucide-react";
import { serviceHome1Content as siteData } from "../../../../data/layoutSite";

const { services, about, sidebar } = siteData;

export default function ServiceDetailContent({
  title,
  description,
  description2,
  image,
  gallery,
  overview,
  categories,
  searchTitle,
  searchPlaceholder,
  categoriesTitle,
}: {
  title?: string;
  description?: string;
  description2?: string;
  image?: string;
  gallery?: string[];
  overview?: string[];
  categories?: string[];
  searchTitle?: string;
  searchPlaceholder?: string;
  categoriesTitle?: string;
}) {
  const service = services.items[0];
  const heading = title || service.title;
  const heroImage = image || service.image;
  const body = description || service.description;
  const extra = description2 || about.description1;
  const closing = about.description2;
  const bullets = overview?.length ? overview : about.features;
  const images = gallery?.length
    ? gallery
    : services.items.slice(0, 3).map((item) => item.image);
  const cats = categories?.length ? categories : sidebar.categories;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="lg:w-2/3">
            <div className="mb-8">
              <img
                src={heroImage}
                alt={heading}
                className="h-[350px] w-full rounded-md object-cover md:h-[450px]"
              />
            </div>

            <h2 className="mb-5 text-3xl font-bold text-[#0D2235] md:text-[36px]">
              {heading}
            </h2>
            <p className="mb-6 leading-relaxed text-[#6B7280]">{body}</p>
            {extra ? (
              <p className="mb-10 leading-relaxed text-[#6B7280]">{extra}</p>
            ) : null}

            <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {images.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${heading} ${index + 1}`}
                  className="h-[180px] w-full rounded-md object-cover"
                />
              ))}
            </div>

            <h3 className="mb-5 text-2xl font-bold text-[#0D2235]">
              Service Overview
            </h3>
            <ul className="mb-10 space-y-4">
              {bullets.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-[#078B55]" size={20} />
                  <span className="text-[#6B7280]">{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mb-5 text-2xl font-bold text-[#0D2235]">
              We give the Best Services
            </h3>
            {closing ? (
              <p className="mb-10 leading-relaxed text-[#6B7280]">{closing}</p>
            ) : null}

            <h3 className="mb-5 text-2xl font-bold text-[#0D2235]">
              Have you Any Question?
            </h3>
          </div>

          <div className="sticky top-28 z-10 space-y-8 lg:w-1/3">
            <div className="rounded-md bg-[#F8F9FA] p-8">
              <h4 className="mb-6 text-xl font-bold text-[#0D2235]">
                {searchTitle || sidebar.searchTitle}
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder || sidebar.searchPlaceholder}
                  className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 pr-12 transition-colors focus:border-[#078B55] focus:outline-none"
                />
                <button className="absolute top-0 right-0 bottom-0 rounded-r-sm bg-[#078B55] px-4 text-white transition-colors hover:bg-[#067246]">
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div className="rounded-md bg-[#F8F9FA] p-8">
              <h4 className="mb-6 text-xl font-bold text-[#0D2235]">
                {categoriesTitle || sidebar.categoriesTitle}
              </h4>
              <ul className="space-y-3">
                {cats.map((cat) => (
                  <li key={cat}>
                    <Link
                      href="/services/detail"
                      className="group flex items-center justify-between rounded-sm border border-gray-100 bg-white px-5 py-3.5 shadow-sm transition-colors hover:bg-[#078B55]"
                    >
                      <span className="font-medium text-[#6B7280] transition-colors group-hover:text-white">
                        {cat}
                      </span>
                      <ChevronRight
                        className="text-[#078B55] transition-colors group-hover:text-white"
                        size={18}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-[#F8F9FA] p-8">
              <h4 className="mb-6 text-xl font-bold text-[#0D2235]">
                Download Brochures
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Company Brochure", href: "/quotes" },
                  { label: "Service Details", href: "/services/detail" },
                ].map((file) => (
                  <Link
                    key={file.label}
                    href={file.href}
                    className="group flex items-center justify-between rounded-sm border border-gray-100 bg-white px-5 py-4 shadow-sm transition-colors hover:border-[#078B55]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-[#078B55]" size={24} />
                      <span className="font-semibold text-[#0D2235] transition-colors group-hover:text-[#078B55]">
                        {file.label}
                      </span>
                    </div>
                    <Download
                      className="text-gray-400 transition-colors group-hover:text-[#078B55]"
                      size={20}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";

interface PageBannerProps {
  title: string;
  breadcrumb: string;
  backgroundImage?: string;
  backgroundColor?: string;
  withBackgroundImage?: boolean;
}

export default function PageBanner({
  title,
  breadcrumb,
  backgroundImage = "/categories/cleaning/template1/banner/herobanner.png",
  backgroundColor = "#0B4C34",
  withBackgroundImage = true,
}: PageBannerProps) {
  return (
    <section
      className="relative flex h-[250px] items-center justify-center overflow-hidden bg-cover bg-center lg:h-[300px]"
      style={
        withBackgroundImage
          ? { backgroundImage: `url('${backgroundImage}')` }
          : { backgroundColor }
      }
    >
      {withBackgroundImage ? (
        <div className="absolute inset-0 bg-[#0B4C34]/85"></div>
      ) : null}

      <div className="relative z-10 px-5 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white lg:text-[45px]">
          {title}
        </h1>
        <p className="flex items-center justify-center gap-2 text-[15px] font-medium text-white/90">
          <Link href="/" className="transition-colors hover:text-green-400">
            Home
          </Link>
          <span>/</span>
          <span className="text-green-400">{breadcrumb}</span>
        </p>
      </div>
    </section>
  );
}

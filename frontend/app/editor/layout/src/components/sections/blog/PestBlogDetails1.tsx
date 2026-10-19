"use client";
import Link from "../header/PestLink";
import { Folder, User, MessageSquare, Clock, Check } from "lucide-react";

export default function PestBlogDetails1({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;
  const title = text(data.title, "Common Diseases Caused by Mice and Rodents");
  const image = text(
    data.image,
    "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80",
  );
  const author = text(data.author, "pestcontroladmin");
  const category = text(data.category, "Rodent Control");
  const excerpt = text(data.excerpt, "");
  const content = text(data.content, text(data.longDescription, ""));
  const recentPosts = [
    {
      slug: "how-to-kill-roaches-around-the-home-fast",
      title: "How to Kill Roaches Around the Home Fast",
      date: "JUNE 26, 2024",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80",
    },
    {
      slug: "home-remedies-to-prevent-bed-bugs",
      title: "Home Remedies to Prevent Bed Bugs",
      date: "JUNE 26, 2024",
      image: "/categories/petcare/bedbug.webp",
    },
    {
      slug: "6-most-common-pests-around-the-home",
      title: "6 Most Common Pests Around the Home",
      date: "JUNE 26, 2024",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80",
    },
    {
      slug: "wood-treatment-to-prevent-termites",
      title: "Wood Treatment to Prevent Termites",
      date: "JUNE 26, 2024",
      image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?auto=format&fit=crop&w=200&q=80",
    },
    {
      slug: "how-to-keep-mosquitoes-away-naturally",
      title: "How to Keep Mosquitoes Away Naturally",
      date: "JUNE 26, 2024",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const diseases = [
    { name: "Salmonella", desc: "causes food poisoning" },
    { name: "Leptospirosis", desc: "bacterial infection" },
    { name: "Hantavirus", desc: "respiratory illness" },
    { name: "Lymphocytic Choriomeningitis", desc: "viral infection" },
    { name: "Rat-Bite Fever", desc: "bacterial infection" },
    { name: "Tularemia", desc: "rare but serious illness" },
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#00482B] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="w-full h-[360px] sm:h-[430px] rounded-2xl overflow-hidden shadow-sm">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="bg-[#00482B] text-white text-base font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                  26
                </span>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  JUN 2024
                </span>
              </div>

              <div className="h-4 w-px bg-neutral-200" />

              <div className="flex items-center gap-1.5 text-neutral-700">
                <Folder size={14} className="text-[#00482B] fill-[#00482B]/20" />
                <span>{category}</span>
              </div>

              <div className="h-4 w-px bg-neutral-200" />

              <div className="flex items-center gap-1.5 text-neutral-700">
                <User size={14} className="text-[#00482B]" />
                <span>{author}</span>
              </div>

              <div className="h-4 w-px bg-neutral-200" />

              <div className="flex items-center gap-1.5 text-neutral-700">
                <MessageSquare size={14} className="text-[#00482B]" />
                <span>3 Comments</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-[34px] font-extrabold text-[#00482B] tracking-tight leading-snug pb-2 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-14 after:h-[3px] after:bg-[#00482B] after:rounded-full">
                {title}
              </h1>
              {content ? (
                <div
                  className="prose prose-neutral max-w-none text-neutral-600 text-sm sm:text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : excerpt ? (
                <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed mt-2">
                  {excerpt}
                </p>
              ) : null}
              {content ? null : (
              <>

              <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed mt-2">
                Mice and rodents are more than just a nuisance. They can carry harmful bacteria, viruses, and parasites that can cause serious health problems for you and your family. Understanding the risks and taking preventive measures is essential to maintain a safe and healthy environment.
              </p>

              <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed">
                In this article, we will explain the common diseases caused by mice and rodents, how they spread, and what you can do to protect your home or workplace from potential health hazards.
              </p>

            <div className="bg-[#eef7f2] border border-[#d6ecdf] rounded-2xl p-6 sm:p-8 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-[#00482B] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                  <circle cx="5" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="7" cy="7" r="1" />
                  <circle cx="17" cy="17" r="1" />
                  <circle cx="7" cy="17" r="1" />
                  <circle cx="17" cy="7" r="1" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#00482B] tracking-tight mb-2 pb-1 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#00482B]">
                  How Mice and Rodents Spread Diseases
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  Mice and rodents can spread diseases through their urine, droppings, saliva and by contaminating food, water and surfaces. They often sneak into homes, offices and commercial spaces in search of food and shelter, leaving behind harmful pathogens that can affect human health.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#00482B] tracking-tight pb-1 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-[#00482B] after:rounded-full">
                Common Diseases Linked to Mice and Rodents
              </h2>

              <div className="bg-[#f2f8f4] border border-[#ddead5] rounded-2xl p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  {diseases.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00482B] flex items-center justify-center flex-shrink-0 text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800">
                        <strong className="font-bold text-neutral-900">{item.name}</strong>{" "}
                        – {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-extrabold text-[#00482B] tracking-tight pb-1 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-[#00482B] after:rounded-full">
                How to Prevent Mice and Rodent Infestations
              </h3>
              <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed">
                To keep your home or workplace safe, it's important to take preventive measures such as sealing entry points, keeping food properly stored, maintaining cleanliness and scheduling regular pest control treatments. Professional pest control services can help identify the source of infestation and eliminate rodents using safe and effective methods.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-extrabold text-[#00482B] tracking-tight pb-1 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-[#00482B] after:rounded-full">
                Conclusion
              </h3>
              <p className="text-neutral-600 text-sm sm:text-[15px] leading-relaxed">
                Mice and rodents can cause serious health risks, but with the right preventive measures and professional pest control services, you can keep your property safe and disease-free. If you notice signs of rodent activity, contact our expert team for reliable and effective rodent control solutions.
              </p>
            </div>
              </>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#f4f9f6] border border-[#dceddf] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#00482B] tracking-tight mb-5 pb-1 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[3px] after:bg-[#00482B] after:rounded-full">
                Recent Posts
              </h3>

              <div className="flex flex-col divide-y divide-neutral-200">
                {recentPosts.map((recent, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/${recent.slug}`}
                    className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={recent.image}
                        alt={recent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs sm:text-[13px] font-extrabold text-neutral-900 group-hover:text-[#00482B] leading-snug line-clamp-2 transition">
                        {recent.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        <Clock size={12} className="text-[#00482B]" />
                        <span>{recent.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      </main>
  );
}
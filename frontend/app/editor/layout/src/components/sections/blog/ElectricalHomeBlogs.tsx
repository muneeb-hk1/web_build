"use client";

const managerForHref = (href: string) => {
  const value = href.trim().toLowerCase();
  if (value.includes("team")) return "Teams";
  if (value.includes("event")) return "Events";
  if (value.includes("portfolio") || value.includes("project")) return "Portfolio";
  if (value.includes("service")) return "Services";
  if (value.includes("blog")) return "Blogs";
  return "Blogs";
};

const openHomeCardManager = (card: HomeBlogCard) => {
  const manager = managerForHref(card.href || "");
  try {
    window.sessionStorage.setItem(
      `ai-builder-open-manager-item:${manager}`,
      JSON.stringify({ title: card.label, href: card.href }),
    );
  } catch {
    /* ignore storage errors */
  }
  window.dispatchEvent(
    new CustomEvent("ai-builder-open-manager", {
      detail: { manager, preservePage: true },
    }),
  );
};

export type HomeBlogCard = {
  href: string;
  label: string;
  image?: string;
  shortDescription?: string;
  category?: string;
};

export default function ElectricalHomeBlogs({
  blogs,
  eyebrow = "Latest articles",
  title = "From Our",
  highlight = "Blog",
  emptyText,
  headingEditable = false,
}: {
  blogs: HomeBlogCard[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  emptyText?: string;
  headingEditable?: boolean;
}) {
  const cards = blogs.slice(0, 3);
  if (!cards.length && !emptyText) return null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-[#1B8A3E]" />
            <span
              className="text-[13px] font-extrabold uppercase tracking-[2.2px] text-[#1B8A3E]"
              data-editor-inline-format-key={headingEditable ? "electrical-home:homeEyebrow" : undefined}
            >
            {eyebrow}
          </span>
            <span className="h-[2px] w-8 bg-[#1B8A3E]" />
          </div>
          <h2 className="text-[32px] font-extrabold text-[#0b2540] sm:text-[40px]">
            <span data-editor-inline-format-key={headingEditable ? "electrical-home:homeTitle" : undefined}>
              {title}
            </span>{" "}
            <span
              className="text-[#1B8A3E]"
              data-editor-inline-format-key={headingEditable ? "electrical-home:homeHighlight" : undefined}
            >
              {highlight}
            </span>
          </h2>
        </div>
        {!cards.length ? (
          <p className="text-center text-[15px] text-[#6b7285]">{emptyText}</p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((blog) => (
            <button
              key={blog.href || blog.label}
              type="button"
              data-editor-card=""
              onClick={() => openHomeCardManager(blog)}
              className="overflow-hidden rounded-[16px] bg-white text-left shadow-[0_12px_32px_rgba(15,40,70,0.08)]"
            >
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.label}
                  className="h-[190px] w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                {blog.category ? (
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#1B8A3E]">
                    {blog.category}
                  </p>
                ) : null}
                <h3 className="text-[18px] font-extrabold text-[#0b2540]">{blog.label}</h3>
                {blog.shortDescription ? (
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#6b7285]">
                    {blog.shortDescription}
                  </p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

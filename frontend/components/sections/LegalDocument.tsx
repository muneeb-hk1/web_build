type LegalSection = {
  title: string;
  body: string;
};

export default function LegalDocument({
  updatedAt,
  sections,
}: {
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <article className="mx-auto max-w-[760px] px-5 pb-20 pt-4 sm:px-8 sm:pb-28">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
        Last updated {updatedAt}
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-medium tracking-[-0.03em] text-zinc-950">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-[15px]">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}

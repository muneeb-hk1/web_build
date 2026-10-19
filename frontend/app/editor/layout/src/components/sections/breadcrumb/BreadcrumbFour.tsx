import { SectionProps } from "../../../types/section";
import InlineRichText from "../../builder/InlineRichText";

export default function BreadcrumbFour({ data = {} }: SectionProps) {
  const title = String(data.title || "Page");
  const homeLabel = String(data.homeLabel || "Home");
  const parentLabel = String(data.parentLabel || "").trim();
  const description = String(data.desc || "");
  const backgroundType = String(data.breadcrumbBackgroundType || "solid");
  const backgroundColor = String(data.breadcrumbBackgroundColor || "#ffffff");
  const gradientColor = String(data.breadcrumbGradientColor || "#e2e8f0");
  const backgroundImage = String(data.backgroundImage || "");
  const style =
    backgroundType === "image" && backgroundImage
      ? {
          backgroundImage: `linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.72)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : backgroundType === "gradient"
        ? { backgroundImage: `linear-gradient(90deg, ${backgroundColor}, ${gradientColor})` }
        : { backgroundColor };

  return (
    <section className="border-b-2 border-slate-200 bg-white" style={style}>
      <div className="mx-auto w-full max-w-7xl px-5 py-10 text-center md:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-400"
        >
          <span data-editor-inline-format-key="breadcrumb-four:home-label">
            <InlineRichText value={homeLabel} formatKey="breadcrumb-four:home-label" />
          </span>
          {parentLabel ? (
            <>
              {" "}
              ·{" "}
              <span data-editor-inline-format-key="breadcrumb-four:parent-label">
                <InlineRichText
                  value={parentLabel}
                  formatKey="breadcrumb-four:parent-label"
                />
              </span>
            </>
          ) : null}{" "}
          ·{" "}
          <span data-editor-inline-format-key="breadcrumb-four:current-label">
            <InlineRichText value={title} formatKey="breadcrumb-four:current-label" />
          </span>
        </nav>
        <h1
          className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl"
          data-editor-inline-format-key="breadcrumb-four:title"
        >
          <InlineRichText value={title} formatKey="breadcrumb-four:title" />
        </h1>
        {description ? (
          <p
            className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600"
            data-editor-inline-format-key="breadcrumb-four:description"
          >
            <InlineRichText value={description} formatKey="breadcrumb-four:description" />
          </p>
        ) : null}
      </div>
    </section>
  );
}

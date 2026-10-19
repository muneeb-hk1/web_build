import EditorRemoteImage from "../../EditorRemoteImage";
import {
  getBlocksByType,
  getTextBlockByRole,
  resolveSectionBlocks,
} from "../types/section";
import { SectionProps } from "./../../../types/section";
import BlockRenderer from "../blocks/BlockRenderer";

export default function BannerTwo({ data = {}, blocks }: SectionProps) {
  const resolvedBlocks = resolveSectionBlocks({ blocks, data });
  const heading = getTextBlockByRole(resolvedBlocks, "heading");
  const paragraph = getTextBlockByRole(resolvedBlocks, "paragraph");
  const backgroundImage = getBlocksByType(resolvedBlocks, "image").find(
    (block) => block.role === "background" || !block.role,
  );
  const backgroundVideo = getBlocksByType(resolvedBlocks, "video").find(
    (block) => block.role === "background" || !block.role,
  );
  const buttonBlocks = getBlocksByType(resolvedBlocks, "button").slice(0, 3);
  const backgroundMode = data.bannerBackgroundMode ?? "image";
  const bannerHeight = data.bannerHeight ?? 70;
  const titleColor =
    (typeof data.titleColor === "string" && data.titleColor.trim()) ||
    (typeof data.textColor === "string" && data.textColor.trim()) ||
    "";
  const descColor =
    (typeof data.descColor === "string" && data.descColor.trim()) ||
    (typeof data.textColor === "string" && data.textColor.trim()) ||
    "";
  const pretitleColor =
    (typeof data.pretitleColor === "string" && data.pretitleColor.trim()) ||
    "";
  const bannerBackground =
    backgroundMode === "gradient"
      ? `linear-gradient(90deg, ${data.bannerBackgroundColor ?? "#0f172a"}, ${
          data.bannerGradientColor ?? "#0ea5e9"
        })`
      : backgroundMode === "solid"
        ? (data.bannerBackgroundColor ?? "#0f172a")
        : undefined;

  return (
    <section
      className="flex w-full items-center"
      style={{
        height: `${bannerHeight}dvh`,
        ...(pretitleColor
          ? ({ ["--secondary-pretitle-text"]: pretitleColor } as object)
          : {}),
        ...(descColor
          ? ({ ["--secondary-subtitle-text"]: descColor } as object)
          : {}),
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ background: bannerBackground }}
      >
        {backgroundMode === "image" && backgroundImage && (
          <EditorRemoteImage
            src={backgroundImage.src}
            alt={backgroundImage.alt ?? heading?.content ?? ""}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={backgroundImage.src}
            data-editor-media-role="background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}

        {backgroundMode === "video" && backgroundVideo && (
          <BlockRenderer
            block={backgroundVideo}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-black/40"
          style={{
            backgroundColor: data.overlayColor,
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-5 py-12 text-center sm:px-6">
          <div style={pretitleColor ? { color: pretitleColor } : undefined}>
            <BlockRenderer
              block={getTextBlockByRole(resolvedBlocks, "pretitle")}
              className={
                pretitleColor
                  ? "text-sm font-medium sm:text-base lg:text-xl"
                  : "text-sm font-medium text-(--secondary-pretitle-text) sm:text-base lg:text-xl"
              }
            />
          </div>

          <div style={titleColor ? { color: titleColor } : undefined}>
            <BlockRenderer
              block={heading}
              className={
                titleColor
                  ? "max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl"
                  : "max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
              }
            />
          </div>

          <div style={descColor ? { color: descColor } : undefined}>
            <BlockRenderer
              block={paragraph}
              className={
                descColor
                  ? "max-w-3xl text-sm leading-6 sm:text-base"
                  : "max-w-3xl text-sm leading-6 text-(--secondary-subtitle-text) sm:text-base"
              }
            />
          </div>

          {!!buttonBlocks.length && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {buttonBlocks.map((button) => (
                <BlockRenderer
                  key={button.id}
                  block={button}
                  className="mt-2 inline-block rounded-full bg-(--secondary-link-bg) px-5 py-2 font-medium text-(--secondary-link-color)"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

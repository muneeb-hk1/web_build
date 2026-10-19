import NgoService1 from "../service/NgoService1";
import { site, type NGOServiceData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";

export default function NgoActivity1({ data: customData }: SectionProps) {
    const candidate = customData as unknown as Partial<NGOServiceData> | undefined;
    const fallback = site.servicePage ?? site.service ?? {};
    const data = {
        ...fallback,
        ...candidate,
        banner: { ...(fallback.banner ?? {}), ...candidate?.banner },
        introduction: {
            ...(fallback.introduction ?? {}),
            ...candidate?.introduction,
            title: {
                ...(fallback.introduction?.title ?? {}),
                ...candidate?.introduction?.title,
            },
        },
        services:
          Array.isArray(candidate?.services) && candidate.services.length
            ? candidate.services
            : fallback.services ?? [],
        stats:
          Array.isArray(candidate?.stats) && candidate.stats.length
            ? candidate.stats
            : fallback.stats ?? [],
        bottomBanner: {
            ...(fallback.bottomBanner ?? {}),
            ...candidate?.bottomBanner,
        },
    };
    return (
        <main className="bg-white">
            <div data-editor-section-label="Services" data-editor-fields="banner introduction services stats bottomBanner" className="mb-10">
                <NgoService1
                    data={data as unknown as SectionProps["data"]}
                    limit={data.services.length}
                    editorLabel="Services"
                />
            </div>
        </main>
    );
}

import categoryContentJson from "./categoryContent.json";

type PestPack = {
  common?: Record<string, unknown>;
  categories?: { PestControl?: Record<string, unknown> };
};

const homeServices = (
  categoryContentJson as {
    categories?: {
      "Home Services"?: {
        pest?: PestPack;
        templateData?: Record<string, PestPack | undefined>;
      };
    };
  }
).categories?.["Home Services"];

/** Each Home Services template keeps its own pack, keyed by template id. */
const pestWebsiteData = homeServices?.templateData?.["template-pest-1"] ??
  homeServices?.pest ?? {
    common: {},
    categories: { PestControl: {} },
  };

export default pestWebsiteData;

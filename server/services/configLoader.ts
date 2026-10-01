// Load nhaDamConfigs as JSON for the web API.
// We import the TSX module and serialize configs to plain objects.

import path from "path";
import { CONFIGS } from "../../src/nhaDamConfigs";
import { totalFrames, type VideoConfig } from "../../src/NhaDamSeries";

// Fields the user never edits but the render must keep. They used to be dropped
// here, and NhaDamSeries falls back to DEFAULT_PRODUCT ("dichnhadam.jpg") when
// `product` is absent - so losing hideProduct stamped an aloe vera bottle onto
// the 96 knowledge episodes that switch it off. Kept as one opaque blob so the
// browser can carry it back untouched instead of whitelisting each field.
// Derived from VideoConfig so the types can never drift from the composition.
export type RenderFlags = Pick<
  VideoConfig,
  | "product"
  | "productOutro"
  | "productTall"
  | "hideProduct"
  | "jarOverlay"
  | "jarScenes"
  | "useImages"
  | "bottleLabels"
>;

export interface ConfigSummary {
  slug: string;
  titleText: string;
  subText: string;
  tips: Array<{ label: string; title: string; desc: string }>;
  outroText: string;
  colors: Record<string, string>;
  scenes: Record<string, number>;
  product?: string;
  flags: RenderFlags;
  totalFrames: number;
}

let cached: ConfigSummary[] | null = null;

export function getAllConfigs(): ConfigSummary[] {
  if (cached) return cached;
  cached = CONFIGS.map((cfg) => ({
    slug: cfg.slug,
    titleText: cfg.titleText,
    subText: cfg.subText,
    tips: cfg.tips.map((t) => ({ label: t.label, title: t.title, desc: t.desc ?? "" })),
    outroText: cfg.outroText,
    colors: { ...cfg.colors },
    scenes: { ...cfg.scenes },
    product: cfg.product,
    flags: {
      product: cfg.product,
      productOutro: cfg.productOutro,
      productTall: cfg.productTall,
      hideProduct: cfg.hideProduct,
      jarOverlay: cfg.jarOverlay,
      jarScenes: cfg.jarScenes,
      useImages: cfg.useImages,
      bottleLabels: cfg.bottleLabels,
    },
    totalFrames: totalFrames(cfg),
  }));
  return cached;
}

export function getConfigBySlug(slug: string): ConfigSummary | undefined {
  return getAllConfigs().find((c) => c.slug === slug);
}

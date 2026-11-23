import { drochiaAsset } from "@/data/land/drochia";
import type { Approvals, LandAsset } from "@/data/land/model";

/**
 * The land assets of the v2 experience (OWNER «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE» §14, 2026-11-23). A new site = one file of
 * the LandAsset shape + one line here + its project record (`template: "land"`) — the page is never rewritten.
 */
export const landAssets: Record<string, LandAsset> = { drochia: drochiaAsset };

export const landAssetFor = (slug: string): LandAsset | null => landAssets[slug] ?? null;

/** the OWNER preview shows the whole architecture; the public edition only what the OWNER approved (§15) */
export const experienceVisible = (asset: LandAsset, preview: boolean) => preview || asset.approvals.experience;
export const moduleVisible = (asset: LandAsset, key: Exclude<keyof Approvals, "experience">, preview: boolean) => preview || (asset.approvals.experience && asset.approvals[key]);

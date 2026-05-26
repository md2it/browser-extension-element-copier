import { getToolbarIconSets } from "../src/icons";

export type ManifestIconRaster = {
  size: number;
  data: Buffer;
};

function toolbarRasters(mode: "inactive" | "active"): ManifestIconRaster[] {
  const sets = getToolbarIconSets()[mode];
  return ([16, 32, 48, 128] as const).map((size) => ({
    size,
    data: Buffer.from(sets[String(size)].data),
  }));
}

export function getInactiveManifestRasters(): ManifestIconRaster[] {
  return toolbarRasters("inactive");
}

export function getActiveManifestRasters(): ManifestIconRaster[] {
  return toolbarRasters("active");
}

export const manifestIconOutputs = [
  { prefix: "icon", getRasters: getInactiveManifestRasters },
  { prefix: "toolbar-active", getRasters: getActiveManifestRasters },
] as const;

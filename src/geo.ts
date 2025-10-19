// geo.ts

import { point } from "@turf/helpers";
import type { CoordinatePair, GeoData } from "./types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

export async function countryCodeFromPoint(coordinate: CoordinatePair) {
  const response = await fetch("./ne_50m_admin_0_countries.json");
  const json = (await response.json()) as GeoData;

  const pointObj = point([coordinate.longitude, coordinate.latitude]);

  for (const feature of json.features) {
    if (booleanPointInPolygon(pointObj, feature))
      return feature.properties?.ISO_A2 || feature.properties?.ADM0_A3;
  }
  return null;
}

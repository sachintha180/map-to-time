// geo.ts

import { point } from "@turf/helpers";
import type { CoordinatePair, GeoData } from "./types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { POINT_TO_CC_URL } from "./constants";

export async function getCountryCodeFromPoint(coordinate: CoordinatePair) {
  const response = await fetch(POINT_TO_CC_URL);
  const json = (await response.json()) as GeoData;

  const pointObj = point([coordinate.longitude, coordinate.latitude]);

  for (const feature of json.features) {
    if (booleanPointInPolygon(pointObj, feature))
      return feature.properties?.ISO_A2 || feature.properties?.ADM0_A3;
  }
  return null;
}

// countries.ts

import { point } from "@turf/helpers";
import type {
  CoordinatePair,
  CurrencyData,
  CurrencyDataRow,
  GeoData,
} from "./types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { CC_TO_CURRENCY_URL, POINT_TO_CC_URL } from "./constants";

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

export async function fetchCctoCurrencyData(): Promise<CurrencyData> {
  const response = await fetch(CC_TO_CURRENCY_URL);
  const rows = (await response.json()) as Record<string, any>[];

  // "ISO4217-currency_alphabetic_code" -> currencyCode
  // "ISO3166-1-Alpha-2" -> countryCode
  // "Capital" -> capital
  // "Region Name" -> continent

  const filteredRows: CurrencyDataRow[] = rows.map((row) => {
    return {
      currencyCode: row["ISO4217-currency_alphabetic_code"] as string,
      countryCode: row["ISO3166-1-Alpha-2"] as string,
      capital: row["Capital"] as string,
      continent: row["Region Name"] as string,
    };
  });

  const data = filteredRows.reduce(
    (acc: CurrencyData, row: CurrencyDataRow) => {
      acc[row.countryCode] = row;
      return acc;
    },
    {}
  );

  return data;
}

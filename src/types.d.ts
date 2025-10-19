// types.d.ts

import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";

export type CoordinatePair = {
  latitude: number;
  longitude: number;
};

export type TZDataRow = {
  countryCodes: string;
  coordinates: string;
  timezone: string;
};
export type TZData = Record<string, TZDataRow>;

export type GeoData = FeatureCollection<Polygon | MultiPolygon>;

type CurrencyDataRow = {
  countryCode: string;
  currencyCode: string;
  capital: string;
  continent: string;
};
export type CurrencyData = Record<string, CurrencyDataRow>;

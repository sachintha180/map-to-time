// main.ts

import tzlookup from "tz-lookup";
import { GOOGLE_MAPS_URL_2 } from "./constants";
import { extractCoordinateFromUrl, getLocalCoordinates } from "./coordinates";
import { fetchTzToCodesData } from "./timezone";
import { getCountryCodeFromPoint } from "./geo";
import { fetchCctoCurrencyData, fetchConversionRate } from "./currency";

const tzToCodesData = await fetchTzToCodesData();
const ccToCurrencyData = await fetchCctoCurrencyData();

const localCoord = await getLocalCoordinates();
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localCc = await getCountryCodeFromPoint(localCoord);
const localCurrency = ccToCurrencyData[localCc].currencyCode;

console.log("Local Data:\n", {
  coordinate: localCoord,
  timezone: localTz,
  countryCode: localCc,
  currency: localCurrency,
});

const externalCoord = extractCoordinateFromUrl(GOOGLE_MAPS_URL_2);
const externalTz = tzlookup(externalCoord.latitude, externalCoord.longitude);
const externalCc = await getCountryCodeFromPoint(externalCoord);
const externalCurrency = ccToCurrencyData[externalCc].currencyCode;

console.log("\nExternal Data:\n", {
  coordinate: externalCoord,
  timezone: tzToCodesData[externalTz].timezone,
  countryCode: externalCc,
  currency: externalCurrency,
});

const currencyData = await fetchConversionRate(localCurrency, externalCurrency);
console.log("\nCurrency Data:\n", currencyData);

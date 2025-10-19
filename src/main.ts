// main.ts

import tzlookup from "tz-lookup";
import {
  countryCodeFromPoint,
  extractCoordinateFromUrl,
  fetchTzToCodesData,
  getLocalCoordinates,
} from "./utils";
import {
  GOOGLE_MAPS_URL_1,
  GOOGLE_MAPS_URL_2,
  GOOGLE_MAPS_URL_3,
} from "./constants";

const externalCoord = extractCoordinateFromUrl(GOOGLE_MAPS_URL_2);
const localCoord = await getLocalCoordinates();

const externalTz = tzlookup(externalCoord.latitude, externalCoord.longitude);
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const tzToCodesData = await fetchTzToCodesData();
console.log("External Timezone:", tzToCodesData[externalTz].timezone);
console.log("Local Timezone:", localTz);

const externalCc = await countryCodeFromPoint(externalCoord);
const localCc = await countryCodeFromPoint(localCoord);
console.log("External Country Code:", externalCc);
console.log("Local Country Code:", localCc);

// utils.ts

import { point } from "@turf/helpers";
import type { CoordinatePair, GeoData, TZData, TZDataRow } from "./types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

function validateCoordinateDomain(latitude: number, longitude: number) {
  if (latitude < -90 || latitude > 90) {
    throw Error("Latitude value is out of bounds.");
  }
  if (longitude < -180 || longitude > 180) {
    throw Error("Longitude value is out of bounds.");
  }
}

export function extractCoordinateFromUrl(urlString: string): CoordinatePair {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    throw Error("Cannot construct URL object from provided urlString.");
  }

  let coordinateString;
  try {
    coordinateString = url.pathname.split("@")[1].split("/")[0];
  } catch {
    throw Error("Cannot parse URL pathname to extract the coordinate string.");
  }

  let coordinatePair;
  try {
    const coordinateArray = coordinateString.split(",");
    coordinatePair = {
      latitude: parseFloat(coordinateArray[0]),
      longitude: parseFloat(coordinateArray[1]),
    };
  } catch {
    throw Error(
      "Cannot extract latitude, longitude pair from coordinate string."
    );
  }

  validateCoordinateDomain(coordinatePair.latitude, coordinatePair.longitude);

  return coordinatePair;
}

export async function fetchTzToCodesData(): Promise<TZData> {
  const response = await fetch("./zone1970.tab");
  const text = await response.text();

  const rows = text
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const [countryCodes, coordinates, timezone, _] = line.split("\t");
      return {
        countryCodes, // e.g. "US,CA"
        coordinates, // e.g. "+404251-0740023"
        timezone, // e.g. "America/New_York"
      };
    });

  const data = rows.reduce((acc: TZData, row: TZDataRow) => {
    acc[row.timezone] = row;
    return acc;
  }, {});

  return data;
}

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

export function getLocalCoordinates(): Promise<CoordinatePair> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("User denied the request for Geolocation."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("The request to get user location timed out."));
            break;
          default:
            reject(new Error("An unknown geolocation error occurred."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

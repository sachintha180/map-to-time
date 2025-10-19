// coordinates.ts

import type { CoordinatePair } from "./types";

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

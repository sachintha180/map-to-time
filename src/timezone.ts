// timezone.ts

import type { TZData, TZDataRow } from "./types";

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

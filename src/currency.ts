// currency.ts

import type {
  CurrencyConversionData,
  CurrencyData,
  CurrencyDataRow,
} from "./types";
import { CC_TO_CURRENCY_URL, FX_RATES_BASE_URL } from "./constants";
import { FX_RATES_API_KEY } from "./settings";

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

export async function fetchConversionRate(
  fromCurrency: string,
  toCurrency: string,
  amount: number = 1
): Promise<CurrencyConversionData> {
  const queryString = new URLSearchParams({
    api_key: FX_RATES_API_KEY,
    currencies: toCurrency,
    base: fromCurrency,
    amount: amount.toFixed(),
  }).toString();

  const url = `${FX_RATES_BASE_URL}?${queryString}`;
  const response = await fetch(url);
  const data = (await response.json()) as Record<string, any>;

  return {
    date: new Date(data["date"]),
    base: data["base"] as string,
    rate: data["rates"][toCurrency] as number,
  };
}

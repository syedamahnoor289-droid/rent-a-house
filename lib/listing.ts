import type { PropertyType } from "@/lib/generated/prisma/client";

export function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function formatPrice(price: number): string {
  return `Rs ${new Intl.NumberFormat("en-US").format(price)}`;
}

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
];

export interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: "Any price" },
  { label: "Under Rs 10,000", max: 9_999 },
  { label: "Rs 10,000 – Rs 25,000", min: 10_000, max: 25_000 },
  { label: "Rs 25,000 – Rs 50,000", min: 25_000, max: 50_000 },
  { label: "Rs 50,000 – Rs 100,000", min: 50_000, max: 100_000 },
  { label: "Rs 100,000 – Rs 200,000", min: 100_000, max: 200_000 },
  { label: "Rs 200,000 – Rs 500,000", min: 200_000, max: 500_000 },
  { label: "Rs 500,000+", min: 500_000 },
];

export function parsePriceRange(value: string): PriceRange {
  const index = Number(value);
  if (Number.isInteger(index) && index > 0 && index < PRICE_RANGES.length) {
    return PRICE_RANGES[index];
  }
  return PRICE_RANGES[0];
}

export function propertyTypeLabel(type: PropertyType): string {
  switch (type) {
    case "HOUSE":
      return "House";
    case "FLAT":
      return "Flat";
    case "ROOM":
      return "Room";
  }
}
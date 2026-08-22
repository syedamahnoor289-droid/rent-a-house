import { Search } from "lucide-react";
import { PropertyType } from "@/lib/generated/prisma/client";
import { PRICE_RANGES } from "@/lib/listing";

interface ListingFiltersProps {
  cities: string[];
  q: string;
  city: string;
  type: string;
  price: string;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function ListingFilters({
  cities,
  q,
  city,
  type,
  price,
}: ListingFiltersProps) {
  return (
    <form
      method="get"
      action="/"
      className="grid gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-zinc-200 sm:grid-cols-2 lg:grid-cols-12"
    >
      <div className="lg:col-span-3">
        <label
          htmlFor="q"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Search
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="City, neighbourhood, keyword"
          className={inputClass}
        />
      </div>
      <div className="lg:col-span-2">
        <label
          htmlFor="city"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          City
        </label>
        <select id="city" name="city" defaultValue={city} className={inputClass}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label
          htmlFor="type"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Type
        </label>
        <select id="type" name="type" defaultValue={type} className={inputClass}>
          <option value="">All types</option>
          {Object.values(PropertyType).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-3">
        <label
          htmlFor="price"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Price range
        </label>
        <select id="price" name="price" defaultValue={price} className={inputClass}>
          <option value="">{PRICE_RANGES[0].label}</option>
          {PRICE_RANGES.slice(1).map((range, i) => (
            <option key={range.label} value={String(i + 1)}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end lg:col-span-2">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}
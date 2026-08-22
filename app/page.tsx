import Link from "next/link";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import ListingFilters from "@/components/ListingFilters";
import { prisma } from "@/lib/prisma";
import { Prisma, PropertyType } from "@/lib/generated/prisma/client";
import { PAKISTAN_CITIES, parsePriceRange } from "@/lib/listing";

type SearchParams = { [key: string]: string | string[] | undefined };

function asString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

const validTypes = new Set<string>(Object.values(PropertyType));

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = asString(params.q).trim();
  const city = asString(params.city).trim();
  const typeRaw = asString(params.type).trim();
  const type = validTypes.has(typeRaw) ? typeRaw : "";
  const price = asString(params.price).trim();
  const range = parsePriceRange(price);

  const where: Prisma.ListingWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { city: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (city) where.city = city;
  if (type) where.propertyType = type as Prisma.ListingWhereInput["propertyType"];
  if (range.min !== undefined || range.max !== undefined) {
    where.price = {
      ...(range.min !== undefined ? { gte: range.min } : {}),
      ...(range.max !== undefined ? { lte: range.max } : {}),
    };
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const hasFilters = Boolean(q || city || type || price);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-6 pb-16 pt-12 text-white">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Find your next home to rent
            </h1>
            <p className="mt-3 max-w-xl text-brand-100">
              Browse houses, flats, and rooms across the country — or list your own
              property in minutes.
            </p>
            <div className="mt-8">
              <ListingFilters
                cities={PAKISTAN_CITIES}
                q={q}
                city={city}
                type={type}
                price={price}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              {hasFilters ? "Search results" : "Featured listings"}
            </h2>
            <p className="text-sm text-zinc-500">
              {listings.length} {listings.length === 1 ? "listing" : "listings"}
            </p>
          </div>

          {listings.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
              <p className="font-medium text-zinc-700">No listings match your filters.</p>
              <p className="mt-1 text-sm text-zinc-500">
                Try adjusting your search or clear the filters.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                View all listings
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
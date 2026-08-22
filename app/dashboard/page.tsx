import type { Metadata } from "next";
import { Edit3, MapPin, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { deleteListing } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseStringArray } from "@/lib/listing";

export const metadata: Metadata = {
  title: "Dashboard | RentAHouse",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, listings] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.listing.findMany({
      where: { hostId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Your listings
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Welcome back, {user?.name ?? "host"}.
            </p>
          </div>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Listing
          </Link>
        </div>

        {listings.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {listings.map((listing) => {
              const cover = parseStringArray(listing.images)[0];
              return (
                <li
                  key={listing.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:w-40">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={listing.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-brand-200 to-brand-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-zinc-900">
                      {listing.title}
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500">
                      <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                      {listing.address}, {listing.city}
                    </p>
                    <p className="mt-1 font-bold text-zinc-900">
                      {formatPrice(listing.price)}
                      <span className="text-sm font-normal text-zinc-500"> / month</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Link>
                    <form action={deleteListing.bind(null, listing.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
            <p className="font-medium text-zinc-700">You haven&apos;t listed anything yet.</p>
            <p className="mt-1 text-sm text-zinc-500">
              Add your first listing to start renting out your property.
            </p>
            <Link
              href="/dashboard/listings/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Listing
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
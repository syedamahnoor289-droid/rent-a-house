import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  DoorOpen,
  Home,
  MapPin,
  Phone,
  User,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AmenityBadge from "@/components/AmenityBadge";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseStringArray, propertyTypeLabel } from "@/lib/listing";

const propertyTypeIcons: Record<string, LucideIcon> = {
  HOUSE: Home,
  FLAT: Building2,
  ROOM: DoorOpen,
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();

  const images = parseStringArray(listing.images);
  const amenities = parseStringArray(listing.amenities);
  const [cover, ...rest] = images;
  const TypeIcon = propertyTypeIcons[listing.propertyType];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to listings
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                <TypeIcon className="h-4 w-4" aria-hidden="true" />
                {propertyTypeLabel(listing.propertyType)}
              </span>
              {!listing.available && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                  Currently unavailable
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              {listing.title}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-zinc-600">
              <MapPin className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {listing.address}, {listing.city}
            </p>

            {cover && (
              <div className="mt-6 overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={cover}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rest.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={src}
                      alt={`${listing.title} photo ${i + 2}`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 px-2 py-3 text-center">
                <BedDouble className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-zinc-900">
                  {listing.bedrooms} bedrooms
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 px-2 py-3 text-center">
                <Bath className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-zinc-900">
                  {listing.bathrooms} bathrooms
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 px-2 py-3 text-center">
                <TypeIcon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-zinc-900">
                  {propertyTypeLabel(listing.propertyType)}
                </span>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-900">About this place</h2>
              <p className="mt-2 whitespace-pre-line text-zinc-700">{listing.description}</p>
            </section>

            {amenities.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-semibold text-zinc-900">Facilities</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <AmenityBadge key={amenity} amenity={amenity} />
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-zinc-900">
                {formatPrice(listing.price)}
                <span className="text-base font-normal text-zinc-500"> / month</span>
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-600">
                {listing.available ? "Available to rent" : "Currently unavailable"}
              </p>
              <a
                href={`tel:${listing.contactPhone.replace(/[^\d+]/g, "")}`}
                className="mt-4 block w-full rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Call to inquire
              </a>
            </div>

            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                Contact the host
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <User className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-zinc-900">{listing.contactName}</p>
                  <p className="flex items-center gap-1.5 text-sm text-zinc-600">
                    <Phone className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {listing.contactPhone}
                  </p>
                </div>
              </div>
              {(() => {
                const digits = listing.contactPhone.replace(/\D/g, "");
                const phone =
                  digits.startsWith("92") ? digits
                  : digits.startsWith("0") ? `92${digits.slice(1)}`
                  : `92${digits}`;
                const msg = encodeURIComponent(
                  `Hi, I'm interested in your listing '${listing.title}' on RentAHouse. Is it still available?`,
                );
                const href = `https://wa.me/${phone}?text=${msg}`;
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1da851]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Contact via WhatsApp
                  </a>
                );
              })()}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
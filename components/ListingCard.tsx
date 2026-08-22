import { Bath, BedDouble, Building2, DoorOpen, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/generated/prisma/client";
import { formatPrice, parseStringArray } from "@/lib/listing";

const propertyTypeIcons: Record<Listing["propertyType"], LucideIcon> = {
  HOUSE: Home,
  FLAT: Building2,
  ROOM: DoorOpen,
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const images = parseStringArray(listing.images);
  const cover = images[0];
  const TypeIcon = propertyTypeIcons[listing.propertyType];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-200 to-brand-400" />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur">
          <TypeIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {listing.propertyType.toLowerCase()}
        </span>
        {!listing.available && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white">
            Unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-1 font-semibold text-zinc-900">{listing.title}</h2>
        <p className="mt-0.5 text-sm text-zinc-500">{listing.city}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            {listing.bedrooms} bd
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            {listing.bathrooms} ba
          </span>
        </div>
        <p className="mt-3 border-t border-zinc-100 pt-3 text-lg font-bold text-zinc-900">
          {formatPrice(listing.price)}
          <span className="text-sm font-normal text-zinc-500"> / month</span>
        </p>
      </div>
    </Link>
  );
}
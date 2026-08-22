import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Listing | RentAHouse",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();
  if (listing.hostId !== session.user.id) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
          Edit listing
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Update the details of your property.
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <ListingForm listing={listing} />
        </div>
      </main>
    </div>
  );
}
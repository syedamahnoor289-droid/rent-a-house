"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PropertyType } from "@/lib/generated/prisma/client";

export type AuthFormState = { message?: string; ok?: boolean } | undefined;

function asString(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

export async function signup(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = asString(formData.get("name"));
  const email = asString(formData.get("email")).toLowerCase();
  const password = asString(formData.get("password"));
  const phone = asString(formData.get("phone"));

  if (name.length < 2) return { message: "Please enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { message: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { message: "Password must be at least 8 characters long." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { message: "An account with this email already exists." };
  } catch (error) {
    console.error("signup: failed to check for existing user", error);
    return { message: "Could not verify your details. Please try again." };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: await bcrypt.hash(password, 10),
      },
    });
  } catch (error) {
    console.error("signup: failed to create user", error);
    return { message: "Could not create your account. Please try again." };
  }

  return { ok: true };
}

const propertyTypes = new Set<string>(Object.values(PropertyType));

type ListingFormState = { message?: string } | undefined;

function parseListingsData(formData: FormData): {
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  contactPhone: string;
} {
  const title = asString(formData.get("title"));
  const description = asString(formData.get("description"));
  const city = asString(formData.get("city"));
  const address = asString(formData.get("address"));
  const contactPhone = asString(formData.get("contactPhone"));
  const propertyType = asString(formData.get("propertyType"));
  const price = Number(formData.get("price"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));

  const amenities = asString(formData.get("amenities"))
    .split(",")
    .map((a) => a.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean);
  const images = asString(formData.get("images"))
    .split("\n")
    .map((src) => src.trim())
    .filter(Boolean);

  return {
    title,
    description,
    price,
    city,
    address,
    propertyType,
    bedrooms,
    bathrooms,
    amenities,
    images,
    contactPhone,
  };
}

export async function createListing(
  prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "You must be signed in." };

  const data = parseListingsData(formData);

  if (!data.title || !data.description || !data.city || !data.address) {
    return { message: "Please fill in all required fields." };
  }
  if (!Number.isFinite(data.price) || data.price <= 0) {
    return { message: "Please enter a valid monthly price." };
  }
  if (!propertyTypes.has(data.propertyType)) {
    return { message: "Please select a valid property type." };
  }
  if (!Number.isInteger(data.bedrooms) || data.bedrooms < 0) {
    return { message: "Please enter a valid number of bedrooms." };
  }
  if (!Number.isInteger(data.bathrooms) || data.bathrooms < 0) {
    return { message: "Please enter a valid number of bathrooms." };
  }

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      city: data.city,
      address: data.address,
      propertyType: data.propertyType as PropertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      amenities: JSON.stringify(data.amenities),
      images: JSON.stringify(data.images),
      contactName: session.user.name ?? "Host",
      contactPhone: data.contactPhone,
      available: true,
      hostId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/listings/${listing.id}`);
}

export async function updateListing(
  listingId: string,
  prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "You must be signed in." };

  const existing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!existing || existing.hostId !== session.user.id) {
    return { message: "You can only edit your own listings." };
  }

  const data = parseListingsData(formData);

  if (!data.title || !data.description || !data.city || !data.address) {
    return { message: "Please fill in all required fields." };
  }
  if (!Number.isFinite(data.price) || data.price <= 0) {
    return { message: "Please enter a valid monthly price." };
  }
  if (!propertyTypes.has(data.propertyType)) {
    return { message: "Please select a valid property type." };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      city: data.city,
      address: data.address,
      propertyType: data.propertyType as PropertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      amenities: JSON.stringify(data.amenities),
      images: JSON.stringify(data.images),
      contactPhone: data.contactPhone,
    },
  });

  revalidatePath("/");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const existing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!existing || existing.hostId !== session.user.id) redirect("/dashboard");

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
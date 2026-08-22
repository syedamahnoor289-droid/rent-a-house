"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, updateListing } from "@/lib/actions";
import { PropertyType } from "@/lib/generated/prisma/enums";
import type { Listing } from "@/lib/generated/prisma/client";
import { PAKISTAN_CITIES, parseStringArray } from "@/lib/listing";

interface ListingFormProps {
  listing?: Listing;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500";

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImagesState, setExistingImagesState] = useState<string[]>(
    listing ? parseStringArray(listing.images) : [],
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const amenities = listing
    ? parseStringArray(listing.amenities).join(", ")
    : "";

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files ?? []);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [],
  );

  const removeFile = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index]);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [previews],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    let uploadedUrls: string[] = [];

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append("images", file);
      }

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to upload images.");
          setPending(false);
          return;
        }
        uploadedUrls = data.urls;
      } catch {
        setError("Failed to upload images. Please try again.");
        setPending(false);
        return;
      }
    }

    const allImages = [...existingImagesState, ...uploadedUrls];

    const formEl = formRef.current;
    if (!formEl) return;
    const fd = new FormData(formEl);
    fd.set("images", allImages.join("\n"));

    try {
      if (listing) {
        await updateListing(listing.id, { message: "" }, fd);
      } else {
        await createListing({ message: "" }, fd);
      }
      previews.forEach((url) => URL.revokeObjectURL(url));
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest: string }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        previews.forEach((url) => URL.revokeObjectURL(url));
        router.push("/dashboard");
        return;
      }
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={listing?.title}
            className={inputClass}
            placeholder="e.g. Modern 2-bed flat in DHA Phase 6"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={listing?.description}
            className={inputClass}
            placeholder="Describe the property, neighbourhood, and anything renters should know."
          />
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            Monthly price (Rs)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min={0}
            defaultValue={listing?.price}
            className={inputClass}
            placeholder="e.g. 85000"
          />
        </div>

        <div>
          <label htmlFor="propertyType" className={labelClass}>
            Property type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            required
            defaultValue={listing?.propertyType}
            className={inputClass}
          >
            <option value="" disabled>
              Select type
            </option>
            {Object.values(PropertyType).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <select
            id="city"
            name="city"
            required
            defaultValue={listing?.city}
            className={inputClass}
          >
            <option value="" disabled>
              Select city
            </option>
            {PAKISTAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            defaultValue={listing?.address}
            className={inputClass}
            placeholder="Street, block, area"
          />
        </div>

        <div>
          <label htmlFor="bedrooms" className={labelClass}>
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            required
            min={0}
            defaultValue={listing?.bedrooms}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="bathrooms" className={labelClass}>
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            required
            min={0}
            defaultValue={listing?.bathrooms}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Contact phone
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            required
            defaultValue={listing?.contactPhone}
            className={inputClass}
            placeholder="e.g. +92 300 1234567"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="amenities" className={labelClass}>
            Facilities (comma-separated)
          </label>
          <input
            id="amenities"
            name="amenities"
            type="text"
            defaultValue={amenities}
            className={inputClass}
            placeholder="e.g. wifi, kitchen, parking, air-conditioning"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Images</label>
          <div className="mt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50"
            >
              <svg
                className="mx-auto h-10 w-10 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-zinc-700">
                Click to upload images
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                JPG, PNG or WebP (max 5MB each)
              </p>
            </label>
          </div>

          {(existingImagesState.length > 0 || previews.length > 0) && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {existingImagesState.map((src, i) => (
                <div key={`existing-${i}`} className="group relative">
                  <img
                    src={src}
                    alt={`Existing image ${i + 1}`}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImagesState((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 shadow-sm transition group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
              {previews.map((src, i) => (
                <div key={`preview-${i}`} className="group relative">
                  <img
                    src={src}
                    alt={`Upload preview ${i + 1}`}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 shadow-sm transition group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <a
          href="/dashboard"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? listing
              ? "Saving…"
              : "Publishing…"
            : listing
              ? "Save changes"
              : "Publish listing"}
        </button>
      </div>
    </form>
  );
}
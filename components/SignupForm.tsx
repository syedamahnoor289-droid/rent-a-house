"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signup } from "@/lib/actions";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const state = await signup(undefined, formData);
    if (!state?.ok) {
      setError(state?.message ?? "Could not create your account. Please try again.");
      setPending(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Full name
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-zinc-500">At least 8 characters.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
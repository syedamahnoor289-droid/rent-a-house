"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Logout"}
    </button>
  );
}
import Link from "next/link";
import { auth } from "@/auth";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
          <Link href="/" className="hidden hover:text-zinc-900 sm:block">
            Browse
          </Link>
          {session?.user ? (
            <>
              <span className="hidden max-w-[10rem] truncate font-semibold text-zinc-900 md:block">
                {session.user.name}
              </span>
              <Link
                href="/dashboard"
                className="rounded-full bg-brand-600 px-4 py-2 text-white transition hover:bg-brand-700"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full px-4 py-2 transition hover:bg-zinc-100"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-700"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" fill="#0d9488" />
        <path
          d="M9 20L18 11L27 20V27H9V20Z"
          fill="white"
        />
        <rect x="16" y="23.5" width="4" height="3.5" rx="0.5" fill="#0d9488" />
        <circle cx="18" cy="25" r="0.8" fill="white" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-zinc-900">
        Rent<span className="text-brand-600">AHouse</span>
      </span>
    </Link>
  );
}

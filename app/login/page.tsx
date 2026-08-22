import type { Metadata } from "next";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | RentAHouse",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to manage your rental listings.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
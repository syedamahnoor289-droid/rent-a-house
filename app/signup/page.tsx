import type { Metadata } from "next";
import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign up | RentAHouse",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign up to list and manage your properties.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  );
}
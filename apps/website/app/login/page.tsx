"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const next = searchParams.get("next") ?? "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setMessage("Incorrect email or password.");
      setIsSubmitting(false);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            PromptProfit OS
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sign in to respond to leads, review conversion activity, and keep revenue moving.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Work email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                className="w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in to PromptProfit"}
            </button>
          </form>

          {message && (
            <p
              className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              role="alert"
            >
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
          <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
            <p className="text-sm text-slate-300">Loading sign-in…</p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Anchor, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/field";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white md:flex-row">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 md:flex md:w-1/2 lg:w-3/5">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Anchor className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold leading-tight">Horizon Freight</p>
            <p className="text-xs text-white/60">&amp; Logistics</p>
          </div>
        </div>

        <div className="relative max-w-md space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            Moving Business <span className="text-cyan-200">Forward</span>
          </h1>
          <p className="text-white/70">
            Every shipment. Every customer. Every dollar. One command centre for
            shipping, freight, clearing and vehicle logistics.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>✓ Track every shipment in real time</li>
            <li>✓ Know every customer balance</li>
            <li>✓ See profitability per shipment</li>
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          © 2026 Horizon Freight &amp; Logistics · Moving Business Forward
        </p>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center bg-slate-950 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
              <Anchor className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold leading-tight">Horizon Freight</p>
              <p className="text-xs text-slate-400">&amp; Logistics</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Staff Sign In</h2>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back — sign in to manage operations.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Email">
              <Input
                type="email"
                required
                placeholder="you@horizonfreight.co.zw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                required
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </Field>

            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
              icon={loading ? undefined : <LogIn className="h-4 w-4" />}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Customer? Track your shipment
            </p>
            <Button
              href="/portal/login"
              variant="outline"
              className="mt-3 w-full border-slate-700 bg-transparent text-white hover:bg-slate-900"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Open Customer Portal
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-600">
            Demo access: admin@horizonfreight.co.zw
          </p>
        </div>
      </div>
    </div>
  );
}

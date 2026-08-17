"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  LogIn,
  Anchor,
  ArrowRight,
  ShieldCheck,
  ShipWheel,
  WalletCards,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/field";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeLogin, setActiveLogin] = useState<string | null>(null);

  const demoAccounts = [
    {
      label: "Administrator",
      email: "admin@horizonfreight.co.zw",
      icon: ShieldCheck,
    },
    {
      label: "Operations",
      email: "ops@horizonfreight.co.zw",
      icon: ShipWheel,
    },
    {
      label: "Accounts",
      email: "accounts@horizonfreight.co.zw",
      icon: WalletCards,
    },
    {
      label: "Sales",
      email: "sales@horizonfreight.co.zw",
      icon: Handshake,
    },
  ];

  async function signInWithCredentials(
    loginEmail: string,
    loginPassword: string,
    loginKey: string,
  ) {
    setActiveLogin(loginKey);
    setError(null);
    const res = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });
    if (res?.error) {
      setActiveLogin(null);
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signInWithCredentials(email, password, "manual");
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
        <div className="w-full max-w-md">
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

          <section className="mt-7" aria-labelledby="demo-access-heading">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3
                id="demo-access-heading"
                className="text-sm font-semibold text-white"
              >
                Quick demo access
              </h3>
              <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                One click
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                const isActive = activeLogin === account.email;
                return (
                  <Button
                    key={account.email}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      signInWithCredentials(
                        account.email,
                        "#Shipping2026!",
                        account.email,
                      )
                    }
                    disabled={activeLogin !== null}
                    aria-label={`Open the demo as ${account.label}`}
                    className="h-12 justify-start border-slate-700 bg-slate-900 px-3 text-slate-100 hover:border-cyan-400/60 hover:bg-slate-800 active:scale-[0.98]"
                    icon={<Icon className="h-4 w-4 shrink-0 text-cyan-300" />}
                  >
                    {isActive ? "Opening…" : account.label}
                  </Button>
                );
              })}
            </div>
          </section>

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">or sign in manually</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email">
              <Input
                type="email"
                required
                autoComplete="email"
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
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={activeLogin !== null}
              icon={
                activeLogin === "manual" ? undefined : (
                  <LogIn className="h-4 w-4" />
                )
              }
            >
              {activeLogin === "manual" ? "Signing in…" : "Sign In"}
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
        </div>
      </div>
    </div>
  );
}

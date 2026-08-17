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
  CheckCircle2,
  LoaderCircle,
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
      shortLabel: "Admin",
      email: "admin@horizonfreight.co.zw",
      icon: ShieldCheck,
    },
    {
      label: "Operations",
      shortLabel: "Operations",
      email: "ops@horizonfreight.co.zw",
      icon: ShipWheel,
    },
    {
      label: "Accounts",
      shortLabel: "Accounts",
      email: "accounts@horizonfreight.co.zw",
      icon: WalletCards,
    },
    {
      label: "Sales",
      shortLabel: "Sales",
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
    <main className="grid min-h-dvh bg-white lg:grid-cols-[52%_48%]">
      <section className="hidden min-h-dvh flex-col justify-between bg-brand px-12 py-10 text-white lg:flex xl:px-16 xl:py-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-white/30">
            <Anchor className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold leading-tight">Horizon Freight</p>
            <p className="mt-0.5 text-xs text-blue-100/70">&amp; Logistics</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/70">
            Shipping operations system
          </p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-0.035em] xl:text-6xl">
            Freight operations, under control.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-blue-50/75">
            Manage shipments, customers, documents and financial performance
            from one operational workspace.
          </p>

          <ul className="mt-10 grid max-w-lg gap-4 border-t border-white/20 pt-7 text-sm text-blue-50/90 sm:grid-cols-2">
            {[
              "Shipment visibility",
              "Customer balances",
              "Document control",
              "Profitability tracking",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-blue-200"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="border-t border-white/20 pt-5 text-xs text-blue-100/60">
          © 2026 Horizon Freight &amp; Logistics
        </p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-8 text-slate-900 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center bg-brand text-white">
              <Anchor className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold leading-tight">Horizon Freight</p>
              <p className="mt-0.5 text-xs text-slate-500">&amp; Logistics</p>
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Staff workspace
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Sign in
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select a demo role or use your staff credentials.
          </p>

          <section className="mt-7" aria-labelledby="demo-access-heading">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3
                id="demo-access-heading"
                className="text-sm font-medium text-slate-700"
              >
                Demo access
              </h3>
              <span className="text-xs text-slate-400">One-click sign in</span>
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
                    className="h-12 cursor-pointer justify-start rounded-lg border-slate-200 bg-white px-3 text-slate-700 transition-colors duration-200 hover:border-brand/40 hover:bg-brand-light active:bg-blue-100"
                    icon={<Icon className="h-4 w-4 shrink-0 text-brand" />}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1.5">
                        <LoaderCircle
                          className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                        Opening…
                      </span>
                    ) : (
                      <>
                        <span className="sm:hidden">{account.shortLabel}</span>
                        <span className="hidden sm:inline">{account.label}</span>
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </section>

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">staff credentials</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email" className="[&>span]:text-slate-700">
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="you@horizonfreight.co.zw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-brand focus:ring-brand/15 sm:text-sm"
              />
            </Field>
            <Field label="Password" className="[&>span]:text-slate-700">
              <Input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-brand focus:ring-brand/15 sm:text-sm"
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer rounded-lg transition-colors duration-200 active:bg-brand-dark"
              disabled={activeLogin !== null}
              icon={
                activeLogin === "manual" ? undefined : (
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                )
              }
            >
              {activeLogin === "manual" ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-500">
              Looking for a customer shipment?
            </p>
            <Button
              href="/portal/login"
              variant="ghost"
              className="mt-2 h-11 w-full text-brand hover:bg-brand-light"
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Open Customer Portal
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

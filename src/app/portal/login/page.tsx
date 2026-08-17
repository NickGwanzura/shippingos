"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { PackageSearch, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/field";

function PortalLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/portal";
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("portal", {
      email,
      password: code,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or portal code. Please try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
          <PackageSearch className="h-4 w-4" />
        </div>
        <div>
          <p className="font-bold leading-tight">Horizon Freight</p>
          <p className="text-xs text-slate-400">Customer Portal</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Track your shipment</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to follow your cargo, see balances and access documents.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Email">
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </Field>
            <Field label="Portal Code">
              <Input
                type="password"
                required
                placeholder="e.g. TENDAI2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </Field>

            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <Button
            href="/login"
            variant="outline"
            className="mt-6 w-full border-slate-700 bg-transparent text-white hover:bg-slate-900"
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Staff Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PortalLogin() {
  return (
    <Suspense fallback={null}>
      <PortalLoginInner />
    </Suspense>
  );
}

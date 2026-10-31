import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { DEMO_EMAIL, DEMO_PASSWORD, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Agent login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const usingDemo = !process.env.ADMIN_PASSWORD;
  return (
    <div className="max-w-sm mx-auto px-4 pt-16">
      <h1 className="font-display text-3xl">Agent dashboard</h1>
      <p className="text-sm text-ink-soft mt-2">Track enquiries from the website and move them through your pipeline.</p>
      {usingDemo && (
        <div className="mt-6 rounded-xl bg-sand-100 border border-sand-200 p-4 text-sm">
          <p className="font-semibold">Demo login</p>
          <p className="mt-1 font-mono text-xs">{DEMO_EMAIL}</p>
          <p className="font-mono text-xs">{DEMO_PASSWORD}</p>
        </div>
      )}
      <LoginForm defaultEmail={usingDemo ? DEMO_EMAIL : ""} />
    </div>
  );
}

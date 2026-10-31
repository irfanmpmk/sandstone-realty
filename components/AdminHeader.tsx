import Link from "next/link";
import { logout, resetDemo } from "@/app/actions";

export default function AdminHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/admin" className="font-display text-3xl">Enquiries</Link>
      <div className="flex gap-2 text-sm">
        <form action={resetDemo}>
          <button className="rounded-full border border-sand-200 bg-white px-4 py-2 hover:border-sand-500" title="Restore the original demo leads">
            Reset demo data
          </button>
        </form>
        <form action={logout}>
          <button className="rounded-full bg-ink text-white px-4 py-2 hover:bg-ink/85">Sign out</button>
        </form>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveEnquiry } from "@/app/actions";
import AdminHeader from "@/components/AdminHeader";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { getEnquiry, STATUS_LABELS, STATUSES } from "@/lib/enquiries";
import { formatDateTime, whatsappLink } from "@/lib/format";

export const metadata: Metadata = { title: "Enquiry", robots: { index: false } };

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  const e = Number.isInteger(id) ? await getEnquiry(id) : undefined;
  if (!e) notFound();

  const contact = [
    ["Phone", <a key="p" href={`tel:${e.phone.replace(/\s/g, "")}`} className="hover:underline">{e.phone}</a>],
    ["Email", e.email ? <a key="e" href={`mailto:${e.email}`} className="hover:underline">{e.email}</a> : "—"],
    ["Preferred viewing", e.preferred_date ?? "—"],
    ["Received", formatDateTime(e.created_at)],
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
      <AdminHeader />
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">← All enquiries</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl bg-white border border-sand-200 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl">{e.name}</h1>
            <StatusBadge status={e.status} />
          </div>
          <p className="text-sm">
            {e.property_slug ? (
              <Link href={`/properties/${e.property_slug}`} className="font-semibold text-sand-700 hover:underline">{e.property_title}</Link>
            ) : (
              <span className="text-ink-soft">General enquiry (no specific property)</span>
            )}
          </p>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            {contact.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-ink-soft">{k}</dt>
                <dd className="mt-0.5 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="text-xs text-ink-soft">Message</p>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">{e.message || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Notes</p>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">{e.notes || "No notes yet."}</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="rounded-full bg-ink text-white text-sm font-semibold px-4 py-2">Call</a>
            <a
              href={whatsappLink(`Hi ${e.name.split(" ")[0]}, this is Sandstone Realty about your enquiry${e.property_title ? ` for "${e.property_title}"` : ""}.`, e.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] text-white text-sm font-semibold px-4 py-2"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <form action={saveEnquiry} className="rounded-2xl bg-white border border-sand-200 p-6 space-y-4 self-start">
          <input type="hidden" name="id" value={e.id} />
          <p className="font-semibold">Update lead</p>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-ink-soft">Status</span>
            <select name="status" defaultValue={e.status} className="w-full rounded-xl border border-sand-200 bg-white px-3 py-2.5 text-sm">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-ink-soft">Add a note</span>
            <textarea name="note" rows={4} maxLength={500} placeholder="e.g. Called, viewing Saturday 11am" className="w-full rounded-xl border border-sand-200 px-3 py-2.5 text-sm" />
          </label>
          <button className="w-full rounded-xl bg-ink text-white py-2.5 text-sm font-semibold hover:bg-ink/85">Save</button>
        </form>
      </div>
    </div>
  );
}

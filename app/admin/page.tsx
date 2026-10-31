import type { Metadata } from "next";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { enquiryStats, listEnquiries, STATUS_LABELS, STATUSES } from "@/lib/enquiries";
import { timeAgo, whatsappLink } from "@/lib/format";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false } };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const status = (await searchParams).status;
  const filter = typeof status === "string" ? status : undefined;
  const [stats, enquiries] = await Promise.all([enquiryStats(), listEnquiries(filter)]);

  const cards = [
    ["New leads", stats.new, "waiting for a first call"],
    ["This week", stats.week, "enquiries in the last 7 days"],
    ["Viewings booked", stats.viewing, "upcoming"],
    ["Conversion", stats.closed ? `${Math.round((stats.won / stats.closed) * 100)}%` : "—", `${stats.won} won of ${stats.closed} closed`],
  ];
  const tab = (value: string | undefined, label: string, count: number) => (
    <Link
      key={label}
      href={value ? `/admin?status=${value}` : "/admin"}
      className={`rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap ${filter === value ? "bg-ink text-white" : "bg-white border border-sand-200 hover:border-sand-500"}`}
    >
      {label} <span className="opacity-60">{count}</span>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
      <AdminHeader />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, hint]) => (
          <div key={label} className="rounded-2xl bg-white border border-sand-200 p-5">
            <p className="text-xs font-semibold text-ink-soft">{label}</p>
            <p className="text-3xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-ink-soft mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4 min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tab(undefined, "All", stats.total)}
            {STATUSES.map((s) => tab(s, STATUS_LABELS[s], stats.byStatus[s] ?? 0))}
          </div>

          <div className="rounded-2xl bg-white border border-sand-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-ink-soft border-b border-sand-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Viewing</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-sand-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="font-semibold hover:text-sand-700">{e.name}</Link>
                      <p className="text-xs text-ink-soft whitespace-nowrap">{e.phone}</p>
                    </td>
                    <td className="px-4 py-3 max-w-56">
                      <p className="line-clamp-2">{e.property_title ?? <span className="text-ink-soft">General enquiry</span>}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{e.preferred_date ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{timeAgo(e.created_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                      <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="text-sand-700 hover:underline">Call</a>
                      <a href={whatsappLink(`Hi ${e.name.split(" ")[0]}, this is Sandstone Realty about your enquiry.`, e.phone)} target="_blank" rel="noopener noreferrer" className="text-sand-700 hover:underline">
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">No enquiries with this status.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-sand-200 p-5">
            <p className="font-semibold">Most enquired</p>
            <ol className="mt-3 space-y-3 text-sm">
              {stats.topProperties.map((t) => (
                <li key={t.slug} className="flex justify-between gap-3">
                  <Link href={`/properties/${t.slug}`} className="line-clamp-1 hover:text-sand-700">{t.title}</Link>
                  <span className="font-semibold">{t.count}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-ink-soft px-1">
            Submit the form on any property page and the lead appears here immediately. “Reset demo data” restores the sample leads.
          </p>
        </aside>
      </div>
    </div>
  );
}

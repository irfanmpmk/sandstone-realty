import { STATUS_LABELS, type Status } from "@/lib/enquiries";

const COLORS: Record<Status, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-sand-100 text-sand-700",
  viewing: "bg-violet-100 text-violet-800",
  negotiating: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${COLORS[status]}`}>{STATUS_LABELS[status]}</span>;
}

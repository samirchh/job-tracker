import { JobStatus } from "../types";

const STYLES: Record<JobStatus, string> = {
  saved: "bg-slate-100 text-slate-700",
  applied: "bg-blue-100 text-blue-700",
  interviewing: "bg-amber-100 text-amber-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STYLES[status]}`}>
      {status}
    </span>
  );
}

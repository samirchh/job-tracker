import { JobStatus, JOB_STATUSES } from "../types";

export default function StatsBar({ stats }: { stats: Record<JobStatus, number> | null }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {JOB_STATUSES.map((status) => (
        <div
          key={status}
          className="bg-white border border-slate-200 rounded-lg p-3 text-center"
        >
          <p className="text-2xl font-semibold text-slate-800">{stats[status] ?? 0}</p>
          <p className="text-xs text-slate-500 capitalize">{status}</p>
        </div>
      ))}
    </div>
  );
}

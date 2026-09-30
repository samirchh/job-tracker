import { JobApplication, JobStatus, JOB_STATUSES } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  job: JobApplication;
  onStatusChange: (id: string, status: JobStatus) => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onStatusChange, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-sm text-slate-900 hover:underline"
          >
            {job.title}
          </a>
          <p className="text-sm text-slate-500">{job.company}</p>
          {job.location && <p className="text-xs text-slate-400">{job.location}</p>}
        </div>
        <StatusBadge status={job.status} />
      </div>

      {job.notes && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{job.notes}</p>}

      <div className="flex items-center justify-between mt-3">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
          className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-slate-50"
        >
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(job)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job._id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, FormEvent, useEffect } from "react";
import { JobApplication, JobStatus, JOB_STATUSES } from "../types";

interface Props {
  initial?: JobApplication | null;
  onClose: () => void;
  onSubmit: (payload: Partial<JobApplication>) => Promise<void>;
}

export default function JobFormModal({ initial, onClose, onSubmit }: Props) {
  const [company, setCompany] = useState(initial?.company || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [status, setStatus] = useState<JobStatus>(initial?.status || "saved");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ company, title, url, location, status, notes });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-slate-800">
          {initial ? "Edit application" : "Add application"}
        </h2>

        <div className="grid gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Company</label>
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Job title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Posting URL</label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Location (optional)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            >
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-sm px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

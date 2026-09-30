import { useEffect, useState, useCallback } from "react";
import { JobApplication, JobStatus, JOB_STATUSES } from "../types";
import * as jobsApi from "../api/jobs";
import { useAuth } from "../AuthContext";
import JobCard from "../components/JobCard";
import JobFormModal from "../components/JobFormModal";
import StatsBar from "../components/StatsBar";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<Record<JobStatus, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsData, statsData] = await Promise.all([
        jobsApi.fetchJobs(),
        jobsApi.fetchStats(),
      ]);
      setJobs(jobsData);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusChange(id: string, status: JobStatus) {
    const updated = await jobsApi.updateJob(id, { status });
    setJobs((prev) => prev.map((j) => (j._id === id ? updated : j)));
    const statsData = await jobsApi.fetchStats();
    setStats(statsData);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    await jobsApi.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
    const statsData = await jobsApi.fetchStats();
    setStats(statsData);
  }

  async function handleSubmit(payload: Partial<JobApplication>) {
    if (editingJob) {
      const updated = await jobsApi.updateJob(editingJob._id, payload);
      setJobs((prev) => prev.map((j) => (j._id === editingJob._id ? updated : j)));
    } else {
      const created = await jobsApi.createJob(payload);
      setJobs((prev) => [created, ...prev]);
    }
    const statsData = await jobsApi.fetchStats();
    setStats(statsData);
    setEditingJob(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Job Application Tracker</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingJob(null);
              setModalOpen(true);
            }}
            className="bg-slate-900 text-white text-sm px-4 py-2 rounded hover:bg-slate-800"
          >
            + Add application
          </button>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <StatsBar stats={stats} />

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {JOB_STATUSES.map((status) => {
              const columnJobs = jobs.filter((j) => j.status === status);
              return (
                <div key={status}>
                  <h2 className="text-sm font-semibold text-slate-600 capitalize mb-2">
                    {status} ({columnJobs.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {columnJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onStatusChange={handleStatusChange}
                        onEdit={(j) => {
                          setEditingJob(j);
                          setModalOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                    {columnJobs.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Nothing here yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalOpen && (
        <JobFormModal
          initial={editingJob}
          onClose={() => {
            setModalOpen(false);
            setEditingJob(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

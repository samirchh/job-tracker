import { api } from "./client";
import { JobApplication, JobStatus } from "../types";

export async function fetchJobs(status?: JobStatus) {
  const { data } = await api.get<JobApplication[]>("/jobs", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get<Record<JobStatus, number>>("/jobs/stats");
  return data;
}

export async function createJob(payload: Partial<JobApplication>) {
  const { data } = await api.post<JobApplication>("/jobs", payload);
  return data;
}

export async function updateJob(id: string, payload: Partial<JobApplication>) {
  const { data } = await api.patch<JobApplication>(`/jobs/${id}`, payload);
  return data;
}

export async function deleteJob(id: string) {
  await api.delete(`/jobs/${id}`);
}

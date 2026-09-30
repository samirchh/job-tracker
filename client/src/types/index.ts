export type JobStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

export const JOB_STATUSES: JobStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
];

export interface JobApplication {
  _id: string;
  company: string;
  title: string;
  url: string;
  location?: string;
  status: JobStatus;
  notes?: string;
  descriptionSnippet?: string;
  source?: string;
  appliedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

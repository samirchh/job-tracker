// Shared API helper for the extension's popup and content script.
// Uses chrome.storage.local (not localStorage) since Manifest V3 service
// workers and popups don't share a DOM/localStorage the way tabs do.

export const API_URL = "http://localhost:5000/api";

export async function getToken(): Promise<string | null> {
  const data = await chrome.storage.local.get("token");
  return data.token || null;
}

export async function setToken(token: string): Promise<void> {
  await chrome.storage.local.set({ token });
}

export async function clearToken(): Promise<void> {
  await chrome.storage.local.remove("token");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(`${API_URL}${path}`, { ...options, headers });
}

export async function login(email: string, password: string) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Login failed");
  }
  const data = await res.json();
  await setToken(data.token);
  return data;
}

export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  descriptionSnippet: string;
  source: string;
}

export async function saveJob(job: {
  company: string;
  title: string;
  url: string;
  location?: string;
  status?: string;
  notes?: string;
  descriptionSnippet?: string;
  source?: string;
}) {
  const res = await apiFetch("/jobs", {
    method: "POST",
    body: JSON.stringify({ ...job, source: job.source || "extension" }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to save job");
  }
  return res.json();
}

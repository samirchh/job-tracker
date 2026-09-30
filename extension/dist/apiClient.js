// Shared API helper for the extension's popup and content script.
// Uses chrome.storage.local (not localStorage) since Manifest V3 service
// workers and popups don't share a DOM/localStorage the way tabs do.
export const API_URL = "http://localhost:5000/api";
export async function getToken() {
    const data = await chrome.storage.local.get("token");
    return data.token || null;
}
export async function setToken(token) {
    await chrome.storage.local.set({ token });
}
export async function clearToken() {
    await chrome.storage.local.remove("token");
}
export async function apiFetch(path, options = {}) {
    const token = await getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token)
        headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
}
export async function login(email, password) {
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
export async function saveJob(job) {
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

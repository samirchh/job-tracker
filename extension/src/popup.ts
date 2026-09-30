import { getToken, clearToken, login, saveJob } from "./apiClient";
import { scrapeCurrentPage } from "./contentScript";

const loginForm = document.getElementById("loginForm") as HTMLDivElement;
const jobForm = document.getElementById("jobForm") as HTMLDivElement;
const statusEl = document.getElementById("statusMessage") as HTMLParagraphElement;

const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;

const companyInput = document.getElementById("company") as HTMLInputElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const locationInput = document.getElementById("location") as HTMLInputElement;
const statusSelect = document.getElementById("statusSelect") as HTMLSelectElement;
const notesInput = document.getElementById("notes") as HTMLTextAreaElement;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let currentUrl = "";

function setMessage(msg: string, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#dc2626" : "#16a34a";
}

async function init() {
  const token = await getToken();
  if (token) {
    await showJobForm();
  } else {
    loginForm.style.display = "block";
    jobForm.style.display = "none";
  }
}

async function showJobForm() {
  loginForm.style.display = "none";
  jobForm.style.display = "block";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    setMessage("Could not read the current tab.", true);
    return;
  }
  currentUrl = tab.url;

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeCurrentPage,
    });
    const scraped = injection.result;
    if (scraped) {
      titleInput.value = scraped.title;
      companyInput.value = scraped.company;
      locationInput.value = scraped.location;
      notesInput.value = scraped.descriptionSnippet
        ? `Snippet: ${scraped.descriptionSnippet.slice(0, 200)}...`
        : "";
    }
  } catch (err) {
    // Scraping can fail on chrome:// pages, PDFs, etc. — not fatal.
    console.warn("Scrape failed:", err);
  }
}

loginBtn.addEventListener("click", async () => {
  setMessage("");
  loginBtn.disabled = true;
  try {
    await login(emailInput.value, passwordInput.value);
    await showJobForm();
  } catch (err: any) {
    setMessage(err.message || "Login failed", true);
  } finally {
    loginBtn.disabled = false;
  }
});

saveBtn.addEventListener("click", async () => {
  setMessage("");
  saveBtn.disabled = true;
  try {
    await saveJob({
      company: companyInput.value,
      title: titleInput.value,
      url: currentUrl,
      location: locationInput.value,
      status: statusSelect.value,
      notes: notesInput.value,
      source: "extension",
    });
    setMessage("Saved! Check your dashboard.");
  } catch (err: any) {
    setMessage(err.message || "Failed to save job", true);
  } finally {
    saveBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await clearToken();
  loginForm.style.display = "block";
  jobForm.style.display = "none";
  setMessage("");
});

init();

// Minimal background service worker. Not doing anything yet, but Manifest V3
// requires the file referenced in manifest.json to exist. Kept here as a
// natural place to add features later (e.g. a context-menu "Save this job"
// item, or a badge showing how many jobs are in "applied" status).

chrome.runtime.onInstalled.addListener(() => {
  console.log("Job Tracker extension installed.");
});

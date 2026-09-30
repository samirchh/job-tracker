// This function is injected into the active tab via
// chrome.scripting.executeScript({ func: scrapeCurrentPage }) — see popup.ts.
// It must be fully self-contained (no imports), since it runs in the page's
// context, not the extension's module context.
//
// It's intentionally best-effort: the popup lets the user edit whatever gets
// scraped, so a rough guess for title/company/location is good enough.
export function scrapeCurrentPage() {
    function text(selector) {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || "";
    }
    const host = window.location.hostname;
    if (host.includes("linkedin.com")) {
        return {
            title: text(".top-card-layout__title") || text("h1"),
            company: text(".topcard__org-name-link") || text(".top-card-layout__second-subline a"),
            location: text(".topcard__flavor--bullet"),
            descriptionSnippet: text(".description__text").slice(0, 500),
        };
    }
    if (host.includes("indeed.com")) {
        return {
            title: text("h1.jobsearch-JobInfoHeader-title") || text("h1"),
            company: text('[data-testid="inlineHeader-companyName"]'),
            location: text('[data-testid="inlineHeader-companyLocation"]'),
            descriptionSnippet: text("#jobDescriptionText").slice(0, 500),
        };
    }
    // Generic fallback for any other site.
    const ogSite = document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute("content");
    return {
        title: document.title || "",
        company: ogSite || "",
        location: "",
        descriptionSnippet: document.body.innerText.slice(0, 500),
    };
}

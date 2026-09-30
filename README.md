# Job Application Tracker (MERN + TS) with Chrome Extension

Track job applications you're applying to, with a browser extension that
captures the job posting you're currently viewing (title, company, URL,
description snippet) straight into your tracker with one click.

## Stack
- **Server**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth
- **Client**: React, TypeScript, Vite, TailwindCSS, React Router, Axios
- **Extension**: Chrome Manifest V3, vanilla TS, calls the same API

## Project structure
```
job-tracker/
├── server/          # Express API
├── client/          # React dashboard (Vite)
└── extension/       # Chrome extension (Manifest V3)
```

## Quick start

### 1. Server
```bash
cd server
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```

### 2. Client
```bash
cd client
cp .env.example .env     # points VITE_API_URL at the server
npm install
npm run dev               # http://localhost:5173
```

### 3. Extension
1. Run `cd extension && npm install && npm run build` (bundles TS -> dist/)
2. Open `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked**, select the `extension/dist` folder
4. Click the extension icon on any job posting page, log in, then hit
   **Save this job** — it POSTs the captured data to your API.

## Core features
- Register/login (JWT, bcrypt password hashing)
- CRUD for job applications: company, title, URL, status, notes, applied date
- Status pipeline: `saved → applied → interviewing → offer / rejected`
- Dashboard with counts per status and a simple kanban-style board
- Extension auto-fills title/company/URL by scraping common job-board page
  patterns (LinkedIn, Indeed, generic `<title>` fallback) — you edit before
  saving, so accuracy of scraping isn't critical
- Each application stores a reference to the browser tab's URL and can
  round-trip that link back open in one click

## Extending this project (ideas)
- Add reminders/follow-up dates with email or cron notifications
- Auto-parse job description tags (skills) with a simple keyword matcher
- Add resume version tracking (which resume was sent per application)
- Deploy server to Render/Railway, client to Vercel, and publish the
  extension privately via a `.zip` you load unpacked (no store review needed
  for personal use)

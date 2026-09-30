import { Router, Response } from "express";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { JobApplication, JOB_STATUSES } from "../models/JobApplication";

const router = Router();

router.use(requireAuth);

// GET /api/jobs?status=applied  -> list current user's applications
router.get("/", async (req: AuthRequest, res: Response, next) => {
  try {
    const { status } = req.query as { status?: string };
    const filter: Record<string, unknown> = { user: req.userId };
    if (status) filter.status = status;

    const jobs = await JobApplication.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/stats -> counts per status, for the dashboard
router.get("/stats", async (req: AuthRequest, res: Response, next) => {
  try {
    const counts = await JobApplication.aggregate([
      { $match: { user: req.userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result: Record<string, number> = Object.fromEntries(
      JOB_STATUSES.map((s) => [s, 0])
    );
    for (const c of counts) {
      result[c._id as string] = c.count;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs -> create (used by both the dashboard "add manually" form
// and the browser extension's "Save this job" button)
router.post("/", async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      company,
      title,
      url,
      location,
      status,
      notes,
      descriptionSnippet,
      source,
    } = req.body as Record<string, string | undefined>;

    if (!company || !title || !url) {
      return res.status(400).json({ message: "company, title and url are required" });
    }

    const job = await JobApplication.create({
      user: req.userId,
      company,
      title,
      url,
      location,
      status: status && JOB_STATUSES.includes(status as any) ? status : "saved",
      notes,
      descriptionSnippet,
      source: source || "manual",
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id -> update status, notes, appliedDate, etc.
router.patch("/:id", async (req: AuthRequest, res: Response, next) => {
  try {
    const allowedFields = [
      "company",
      "title",
      "url",
      "location",
      "status",
      "notes",
      "descriptionSnippet",
      "appliedDate",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in req.body) updates[field] = req.body[field];
    }

    if (updates.status && !JOB_STATUSES.includes(updates.status as any)) {
      return res.status(400).json({ message: `status must be one of ${JOB_STATUSES.join(", ")}` });
    }

    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job application not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req: AuthRequest, res: Response, next) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!job) return res.status(404).json({ message: "Job application not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Schema, model, Document, Types } from "mongoose";

export type JobStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export const JOB_STATUSES: JobStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
];

export interface IJobApplication extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  company: string;
  title: string;
  url: string;
  location?: string;
  status: JobStatus;
  notes?: string;
  descriptionSnippet?: string;
  source?: string; // e.g. "linkedin", "indeed", "manual", "extension"
  appliedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    status: { type: String, enum: JOB_STATUSES, default: "saved" },
    notes: { type: String, trim: true },
    descriptionSnippet: { type: String, trim: true },
    source: { type: String, trim: true, default: "manual" },
    appliedDate: { type: Date },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ user: 1, createdAt: -1 });

export const JobApplication = model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);

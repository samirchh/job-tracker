import { Request, Response, NextFunction } from "express";

// Centralized error handler. Route handlers should call next(err) on
// unexpected failures; validation issues should be handled inline with
// a normal 4xx response.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[error]", err);
  const message = err instanceof Error ? err.message : "Unexpected server error";
  res.status(500).json({ message });
}

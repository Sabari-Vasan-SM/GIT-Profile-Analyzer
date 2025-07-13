import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGitHubUser } from "./routes/github";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/github/:username", handleGitHubUser);

  return app;
}

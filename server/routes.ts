import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.leaderboard.list.path, async (req, res) => {
    try {
      const scores = await storage.getLeaderboard();
      res.status(200).json(scores);
    } catch (error) {
      console.error("Error fetching leaderboard", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.post(api.leaderboard.create.path, async (req, res) => {
    try {
      const input = api.leaderboard.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error creating score", err);
      res.status(500).json({ message: "Failed to submit score" });
    }
  });

  return httpServer;
}

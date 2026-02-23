import { db } from "./db";
import {
  leaderboard,
  type InsertScore,
  type Score
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getLeaderboard(): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
}

export class DatabaseStorage implements IStorage {
  async getLeaderboard(): Promise<Score[]> {
    // Get top 50 scores, ordered by nights survived (desc), then energy left (desc)
    return await db.select().from(leaderboard).orderBy(desc(leaderboard.survivedNights), desc(leaderboard.remainingEnergy)).limit(50);
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const [score] = await db.insert(leaderboard).values(insertScore).returning();
    return score;
  }
}

export const storage = new DatabaseStorage();

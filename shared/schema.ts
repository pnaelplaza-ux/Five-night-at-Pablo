import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  survivedNights: integer("survived_nights").notNull(),
  remainingEnergy: integer("remaining_energy").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoreSchema = createInsertSchema(leaderboard).omit({ id: true, createdAt: true });

export type Score = typeof leaderboard.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;

export type CreateScoreRequest = InsertScore;
export type ScoreResponse = Score;
export type LeaderboardResponse = Score[];

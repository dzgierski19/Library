export type userId = string;
import { randomUUID } from "crypto";
import { clock, Clock } from "./Clock";

export class User {
  id: userId = randomUUID();
  createdAt: Date;
  penaltyPoints?: number;
  banDays?: number;
  bannedUntilDate?: Date;
  constructor(clock: Clock) {
    this.createdAt = clock();
  }
}

export const Megan = new User(clock);

export type userId = string;
import { randomUUID } from "crypto";
import { BookList } from "./BookList";

export class User {
  id: userId = randomUUID();
  borrowedBooks: BookList;
  penaltyPoints?: number;
  createdAt: Date = new Date();
}

export const Megan = new User();

console.log(Megan);

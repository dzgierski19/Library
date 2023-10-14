import { ISBN } from "./Book";
import { BookList } from "./BookList";
import { userId } from "./User";
import { randomUUID } from "crypto";

export const AMOUNT_OF_ALLOWED_DAYS_TO_KEEP_THE_BOOK_FROM_LIBRARY = 20;
export const AMOUNT_OF_LIBRARY_BAN_DAYS = 30;

export type BookingId = string;

export class Booking {
  id: BookingId = randomUUID();
  booksToBorrow: BookList = new BookList();
  booksToReturn: BookList = new BookList();
  userId: userId;
  constructor(private readonly bookList: BookList, userId: userId) {
    this.userId = userId;
  }

  borrowBook(ISBN: ISBN): void {
    const book = this.bookList.getOne(ISBN);
    this.booksToBorrow.addOne(ISBN, book);
  }

  returnBook(ISBN: ISBN): void {
    const book = this.bookList.getOne(ISBN);
    this.booksToReturn.addOne(ISBN, book);
  }
}

import { Book } from "./Book";
import { BOOK_CATEGORY } from "./BookCategory";
import { BOOK_LANGUAGE } from "./BookLanguage";
import { userId } from "./User";

export class LibraryBook extends Book {
  borrowedBy?: userId;
  borrowDate?: Date;
}

export const ElonMusk = new LibraryBook(
  BOOK_CATEGORY.BIOGRAPHY,
  "WALTER ISAACSON",
  "ELON MUSK",
  310,
  2023,
  BOOK_LANGUAGE.ENGLISH
);

export const AlbertEinstein = new LibraryBook(
  BOOK_CATEGORY.BIOGRAPHY,
  "WALTER ISAACSON",
  "ALBERT EINSTEIN",
  600,
  2023,
  BOOK_LANGUAGE.ENGLISH
);

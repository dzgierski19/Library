import { Book } from "./Book";
import { userId } from "./User";

export class LibraryBook extends Book {
  borrowedBy?: userId;
  borrowDate?: Date;
}

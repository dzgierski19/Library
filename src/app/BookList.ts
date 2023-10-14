import { Book, ISBN } from "./Book";
import { ItemList } from "./ItemList";
import { LibraryBook } from "./LibraryBook";

export class BookList extends ItemList<ISBN, LibraryBook> {
  constructor() {
    super("Book");
  }
}

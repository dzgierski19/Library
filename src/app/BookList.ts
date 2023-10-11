import { Book, ElonMusk, ISBN } from "./Book";
import { ItemList } from "./ItemList";

export class BookList extends ItemList<ISBN, Book> {
  constructor() {
    super("Book");
  }
}

const newBookList = new BookList();
newBookList.addOne(ElonMusk.ISBN, ElonMusk);

console.log(newBookList);

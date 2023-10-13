import { ISBN } from "./Book";
import { BookList } from "./BookList";
import { Booking, BookingId } from "./Booking";
import { ItemList } from "./ItemList";
import { userId } from "./User";

export class BookingList extends ItemList<BookingId, Booking> {
  constructor() {
    super("Booking");
  }
}

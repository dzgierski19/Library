import { BookList } from "./BookList";
import { ALLOWED_DAYS_TO_KEEP_THE_BOOK, Booking, BookingId } from "./Booking";
import { BookingList } from "./BookingList";
import { Clock, clock } from "./Clock";
import { LibraryBook, ElonMusk, AlbertEinstein } from "./LibraryBook";
import { User, userId } from "./User";
import { UserList } from "./UserList";
import { differenceInDays } from "date-fns";

class Library {
  constructor(
    private readonly bookList: BookList,
    private readonly userList: UserList,
    private readonly bookingList: BookingList
  ) {}

  addBook(...book: LibraryBook[]) {
    book.forEach((element) => this.bookList.addOne(element.ISBN, element));
  }

  deleteBook(...book: LibraryBook[]) {
    book.forEach((element) => this.bookList.deleteOne(element.ISBN));
  }

  getBook(...book: LibraryBook[]) {
    book.forEach((element) => this.bookList.getOne(element.ISBN));
  }

  addUser(...user: User[]) {
    user.forEach((element) => this.userList.addOne(element.id, element));
  }

  deleteUser(...user: User[]) {
    user.forEach((element) => this.userList.deleteOne(element.id));
  }

  getUser(...user: User[]) {
    user.forEach((element) => this.userList.getOne(element.id));
  }

  addBooking(...booking: Booking[]) {
    booking.forEach((element) => this.bookingList.addOne(element.id, element));
  }

  deleteBooking(...booking: Booking[]) {
    booking.forEach((element) => this.bookingList.deleteOne(element.id));
  }

  getBooking(...booking: Booking[]) {
    booking.forEach((element) => this.bookingList.getOne(element.id));
  }

  executeBooking(
    bookingId: BookingId,
    action: "return" | "borrow",
    clock: Clock
  ) {
    const booking = this.bookingList.getOne(bookingId);
    const user = this.userList.getOne(booking.userId);
    this.isUserBanned(user.id);
    if (action === "borrow") {
      booking.booksToBorrow.list.forEach((element) => {
        const book = this.bookList.getOne(element.ISBN);
        this.isBookBorrowed(element.ISBN);
        book.borrowDate = new Date();
        book.borrowedBy = booking.userId;
      });
      this.bookingList.deleteOne(bookingId);
    }
    if (action === "return") {
      booking.booksToReturn.list.forEach((element) => {
        this.calculatePenaltyPoints(
          new Date(),
          new Date(2023, 10, 1),
          ALLOWED_DAYS_TO_KEEP_THE_BOOK,
          user
        );
        const book = this.bookList.getOne(element.ISBN);
        book.borrowDate = null;
        book.borrowedBy = null;
      });
      this.bookingList.deleteOne(bookingId);
    }
  }

  private calculatePenaltyPoints(
    date1: Date,
    date2: Date,
    range: number,
    user: User
  ) {
    const daysDifference = differenceInDays(date1, date2);
    if (daysDifference > range) {
      user.penaltyPoints = daysDifference - range;
    }
  }

  private isBookBorrowed(ISBN: string) {
    const book = this.bookList.getOne(ISBN);
    if (book.borrowedBy) {
      throw new Error("Book is borrowed");
    }
  }

  private isUserBanned(userId: userId) {
    const user = this.userList.getOne(userId);
    if (user.penaltyPoints > 10) {
      throw new Error("User is banned");
    }
  }
}

const newBookList = new BookList();
newBookList.addOne(ElonMusk.ISBN, ElonMusk);
const newUserList = new UserList();
const newBookingList = new BookingList();
const newUser = new User(clock);
newUserList.addOne(newUser.id, newUser);
const newBooking = new Booking(newBookList, newUser.id);
newBookingList.addOne(newBooking.id, newBooking);
newBooking.borrowBook(ElonMusk.ISBN);
const newLibrary = new Library(newBookList, newUserList, newBookingList);
newLibrary.executeBooking(newBooking.id, "borrow", clock);
const newBooking2 = new Booking(newBookList, newUser.id);
newBookingList.addOne(newBooking2.id, newBooking2);
newBooking2.returnBook(ElonMusk.ISBN);
newLibrary.executeBooking(newBooking2.id, "return", clock);
newLibrary.addBook(ElonMusk, AlbertEinstein);
console.dir(newLibrary, { depth: null });

// osobno return
// zmienic na clock
// sprawdzic RANGE

import { Book } from "./Book";
import { BookList } from "./BookList";
import {
  AMOUNT_OF_ALLOWED_DAYS_TO_KEEP_THE_BOOK_FROM_LIBRARY,
  AMOUNT_OF_LIBRARY_BAN_DAYS,
  Booking,
  BookingId,
} from "./Booking";
import { BookingList } from "./BookingList";
import { Clock, clock } from "./Clock";
import { LibraryBook, ElonMusk, AlbertEinstein } from "./LibraryBook";
import { User, userId } from "./User";
import { UserList } from "./UserList";
import { addDays, differenceInDays } from "date-fns";

export interface ILibrary {
  addBook(...book: LibraryBook[]): void;
  deleteBook(...book: LibraryBook[]): void;
  showBook(book: LibraryBook): LibraryBook;
  showBooks(...book: LibraryBook[]): LibraryBook[];
  addUser(...user: User[]): void;
  deleteUser(...user: User[]): void;
  showUsers(...user: User[]): User[];
  addBooking(...booking: Booking[]): void;
  deleteBooking(...booking: Booking[]): void;
  showBooking(booking: Booking): Booking;
  showBookings(...booking: Booking[]): Booking[];
  executeBookBorrow(bookingId: BookingId, clock: Date): void;
  executeBookReturn(bookingId: BookingId, clock: Date): void;
}

export class Library implements ILibrary {
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

  showBook(book: LibraryBook) {
    return this.bookList.getOne(book.ISBN);
  }

  showBooks(...book: LibraryBook[]) {
    return book.map((element) => this.bookList.getOne(element.ISBN));
  }

  addUser(...user: User[]) {
    user.forEach((element) => this.userList.addOne(element.id, element));
  }

  deleteUser(...user: User[]) {
    user.forEach((element) => this.userList.deleteOne(element.id));
  }

  showUser(user: User) {
    return this.userList.getOne(user.id);
  }

  showUsers(...user: User[]) {
    return user.map((element) => this.userList.getOne(element.id));
  }

  addBooking(...booking: Booking[]) {
    booking.forEach((element) => this.bookingList.addOne(element.id, element));
  }

  deleteBooking(...booking: Booking[]) {
    booking.forEach((element) => this.bookingList.deleteOne(element.id));
  }

  showBooking(booking: Booking) {
    return this.bookingList.getOne(booking.id);
  }

  showBookings(...booking: Booking[]) {
    return booking.map((element) => this.bookingList.getOne(element.id));
  }

  executeBookReturn(bookingId: BookingId, clock: Date) {
    const booking = this.bookingList.getOne(bookingId);
    const user = this.userList.getOne(booking.userId);
    this.isUserBanned(user.id, clock);
    booking.booksToReturn.list.forEach((element) => {
      const book = this.bookList.getOne(element.ISBN);
      if (book.borrowedBy !== user.id) {
        throw new Error("Book is not borrowed by this user");
      }
      this.calculatePenaltyPoints(
        clock,
        element.borrowDate,
        AMOUNT_OF_ALLOWED_DAYS_TO_KEEP_THE_BOOK_FROM_LIBRARY,
        user
      );
      book.borrowDate = undefined;
      book.borrowedBy = undefined;
    });
    this.bookingList.deleteOne(bookingId);
  }

  executeBookBorrow(bookingId: BookingId, clock: Date) {
    const booking = this.bookingList.getOne(bookingId);
    const user = this.userList.getOne(booking.userId);
    this.isUserBanned(user.id, clock);
    booking.booksToBorrow.list.forEach((element) => {
      const book = this.bookList.getOne(element.ISBN);
      this.isBookBorrowed(element.ISBN);
      book.borrowDate = clock;
      book.borrowedBy = booking.userId;
    });
    this.bookingList.deleteOne(bookingId);
  }

  private calculatePenaltyPoints(
    date1: Date,
    date2: Date,
    range: number,
    user: User
  ) {
    const daysDifference = differenceInDays(date1, date2);
    if (daysDifference > range) {
      if (!user.penaltyPoints) {
        user.penaltyPoints = 0;
        user.penaltyPoints += daysDifference - range;
        this.calculateLibraryBan(user, date1);
        return;
      }
      user.penaltyPoints += daysDifference - range;
      this.calculateLibraryBan(user, date1);
      return;
    }
  }

  private calculateLibraryBan(user: User, clock: Date) {
    if (
      user.penaltyPoints > AMOUNT_OF_ALLOWED_DAYS_TO_KEEP_THE_BOOK_FROM_LIBRARY
    ) {
      const banDate = clock;
      const bannedUntilDate = addDays(banDate, AMOUNT_OF_LIBRARY_BAN_DAYS);
      const bannedDays = differenceInDays(bannedUntilDate, banDate);
      user.banDays = bannedDays;
      user.bannedUntilDate = bannedUntilDate;
      user.penaltyPoints = 0;
    }
  }

  private isBookBorrowed(ISBN: string) {
    const book = this.bookList.getOne(ISBN);
    if (book.borrowedBy) {
      throw new Error("Book is borrowed");
    }
  }

  private isUserBanned(userId: userId, clock: Date) {
    const user = this.userList.getOne(userId);
    if (differenceInDays(user.bannedUntilDate, clock) > 0) {
      user.banDays = differenceInDays(user.bannedUntilDate, clock);
      console.log(user.banDays);
      throw new Error("User is banned");
    } else user.banDays = 0;
    user.bannedUntilDate = undefined;
  }
}
const clock2: Clock = () => new Date(2023, 9, 10);
const clock3: Clock = () => new Date(2023, 6, 23);
const clock4: Clock = () => new Date(2023, 6, 8);
const clock5: Clock = () => new Date(2023, 6, 29);

// const newBookList = new BookList();
// const newUserList = new UserList();
// const newBookingList = new BookingList();
// const newLibrary = new Library(newBookList, newUserList, newBookingList);
// newLibrary.addBook(ElonMusk, AlbertEinstein);
// console.log(newLibrary.showBook(ElonMusk));
// const newUser = new User(clock);
// newLibrary.addUser(newUser);
// const booking = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(booking);
// booking.borrowBook(ElonMusk.ISBN);
// newLibrary.executeBookBorrow(booking.id, clock);
// const booking2 = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(booking2);
// booking2.returnBook(ElonMusk.ISBN);
// newLibrary.executeBookReturn(booking2.id, clock);
// const booking3 = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(booking3);
// booking3.borrowBook(AlbertEinstein.ISBN);
// newLibrary.executeBookBorrow(booking3.id, clock);
// const booking4 = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(booking4);
// booking4.returnBook(AlbertEinstein.ISBN);
// newLibrary.executeBookReturn(booking4.id, clock);

// console.dir(newLibrary, { depth: null });

// const booking2 = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(booking2);
// booking2.returnBook(book.ISBN);
// newLibrary.executeBookReturn(booking2.id, clock2);
// const bookin3 = new Booking(newBookList, newUser.id);
// newLibrary.addBooking(bookin3);
// bookin3.borrowBook(book.ISBN);
// newLibrary.executeBookBorrow(bookin3.id, clock3);
// console.dir(newLibrary, { depth: null });

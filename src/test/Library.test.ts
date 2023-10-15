import { BOOK_CATEGORY } from "../app/BookCategory";
import { BOOK_LANGUAGE } from "../app/BookLanguage";
import { BookList } from "../app/BookList";
import { Booking } from "../app/Booking";
import { BookingList } from "../app/BookingList";
import { Clock, clock } from "../app/Clock";
import { Library } from "../app/Library";
import { LibraryBook } from "../app/LibraryBook";
import { User } from "../app/User";
import { UserList } from "../app/UserList";

describe("Library test suite", () => {
  let userList: UserList;
  let bookList: BookList;
  let bookingList: BookingList;
  let library: Library;
  let clock: Clock;
  let user: User;
  let elonMusk: LibraryBook;
  let booking: Booking;
  let albertEinstein: LibraryBook;

  beforeEach(() => {
    userList = new UserList();
    bookList = new BookList();
    bookingList = new BookingList();
    library = new Library(bookList, userList, bookingList);
    clock = () => new Date(2023, 9, 14);
    user = new User(clock);
    elonMusk = new LibraryBook(
      BOOK_CATEGORY.BIOGRAPHY,
      "WALTER ISAACSON",
      "ELON MUSK",
      350,
      2018,
      BOOK_LANGUAGE.ENGLISH
    );
    library.addUser(user);
    library.addBook(elonMusk);
    booking = new Booking(bookList, user.id);
    library.addBooking(booking);
    albertEinstein = new LibraryBook(
      BOOK_CATEGORY.BIOGRAPHY,
      "WALTER ISAACSON",
      "ALBERT EINSTEIN",
      550,
      2014,
      BOOK_LANGUAGE.ENGLISH
    );
  });
  it("should add book to BookList", () => {
    expect(library.showBook(elonMusk)).toEqual(elonMusk);
    expect([...bookList.list.values()]).toEqual([elonMusk]);
  });
  it("should delete book from BookList", () => {
    library.addBook(albertEinstein);
    library.deleteBook(elonMusk, albertEinstein);
    expect([...bookList.list.values()]).toHaveLength(0);
  });
  it("should add user to UserList", () => {
    expect(library.showUser(user)).toEqual(user);
    expect([...userList.list.values()]).toEqual([user]);
  });
  it("should delete user from UserList", () => {
    library.deleteUser(user);
    expect([...userList.list.values()]).toHaveLength(0);
  });
  it("should add booking to BookingList", () => {
    expect(library.showBooking(booking)).toEqual(booking);
    expect([...bookingList.list.values()]).toEqual([booking]);
  });
  it("should delete booking from BookingList", () => {
    library.deleteBooking(booking);
    expect([...bookingList.list.values()]).toHaveLength(0);
  });
  describe("returning and borrowing book test suite", () => {
    let booksBorrowDate: Clock;
    let albertEinsteinDateReturn: Clock;
    let steveJobsDateReturn: Clock;
    let returnalbertEinstein: Booking;
    let borrowSteveJobs: Booking;
    let returnSteveJobs: Booking;
    let steveJobs: LibraryBook;
    beforeEach(() => {
      booksBorrowDate = () => new Date(2023, 8, 1);
      albertEinsteinDateReturn = () => new Date(2023, 8, 26);
      steveJobsDateReturn = () => new Date(2023, 8, 27);
      steveJobs = new LibraryBook(
        BOOK_CATEGORY.BIOGRAPHY,
        "WALTER ISAACSON",
        "STEVE JOBS",
        400,
        2006,
        BOOK_LANGUAGE.ENGLISH
      );
      library.addBook(albertEinstein);
      booking.borrowBook(albertEinstein.ISBN);
      library.executeBookBorrow(booking.id, booksBorrowDate);
      returnalbertEinstein = new Booking(bookList, user.id);
      borrowSteveJobs = new Booking(bookList, user.id);
      returnSteveJobs = new Booking(bookList, user.id);
    });
    it("should execute borrowing book", () => {
      expect(albertEinstein.borrowedBy).toEqual(user.id);
      expect(albertEinstein.borrowDate).toEqual(booksBorrowDate());
      expect([...bookingList.list.values()]).toHaveLength(0);
    });
    it("should execute returning book and add penalty points if book is not returned in time", () => {
      returnalbertEinstein.returnBook(albertEinstein.ISBN);
      library.addBooking(returnalbertEinstein);
      library.executeBookReturn(
        returnalbertEinstein.id,
        albertEinsteinDateReturn
      );
      expect(albertEinstein.borrowedBy).toEqual(undefined);
      expect(user.penaltyPoints).toBe(5);
    });
    it("should execute returning book and sum user's penalty points if books are not returned in time", () => {
      returnalbertEinstein.returnBook(albertEinstein.ISBN);
      library.addBooking(returnalbertEinstein);
      library.executeBookReturn(
        returnalbertEinstein.id,
        albertEinsteinDateReturn
      );
    });
    it("should execute returning book and ban user if book is kept for more time than allowed", () => {
      returnalbertEinstein.returnBook(albertEinstein.ISBN);
      library.addBooking(returnalbertEinstein);
      library.executeBookReturn(
        returnalbertEinstein.id,
        albertEinsteinDateReturn
      );
      library.addBook(steveJobs);
      library.addBooking(borrowSteveJobs);
      borrowSteveJobs.borrowBook(steveJobs.ISBN);
      library.executeBookBorrow(borrowSteveJobs.id, booksBorrowDate);
      library.addBooking(returnSteveJobs);
      returnSteveJobs.returnBook(steveJobs.ISBN);
      library.executeBookReturn(returnSteveJobs.id, steveJobsDateReturn);
      expect(user.penaltyPoints).toBe(11);
    });
  });
});

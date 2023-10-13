import { ElonMusk } from "./Book";
import { BookList } from "./BookList";
import { Booking, BookingId } from "./Booking";
import { BookingList } from "./BookingList";
import { clock } from "./Clock";
import { User, userId } from "./User";
import { UserList } from "./UserList";

class Library {
  constructor(
    private readonly booklist: BookList,
    private readonly userList: UserList,
    private readonly bookingList: BookingList
  ) {}
  realizeBooking(bookingId: BookingId, action: "return" | "borrow") {
    const booking = this.bookingList.getOne(bookingId);
    const user = this.userList.getOne(booking.userId);
    this.isUserBanned(user.id);
    if (action === "borrow") {
      booking.booksToBorrow.list.forEach((element) => {
        this.isBookBorrowed(element.ISBN);
        this.booklist.getOne(element.ISBN).borrowDate = new Date();
        this.booklist.getOne(element.ISBN).borrowedBy = booking.userId;
      });
      this.bookingList.deleteOne(bookingId);
    }
  }

  private isBookBorrowed(ISBN: string) {
    const book = this.booklist.getOne(ISBN);
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
newBookingList.addOne(newBooking.userId, newBooking);
newBooking.borrowBook(ElonMusk.ISBN);
const newLibrary = new Library(newBookList, newUserList, newBookingList);
newLibrary.realizeBooking(newBooking.userId, "borrow"); //

console.dir(newLibrary, { depth: null });

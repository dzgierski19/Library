import { BOOK_CATEGORY, BookCategory } from "./BookCategory";
import { BOOK_LANGUAGE, BookLanguage } from "./BookLanguage";
import { userId } from "./User";

export type ISBN = string;

class Book {
  ISBN: string = this.generateRandomISBN2017();
  Category: BookCategory;
  Author: string;
  Title: string;
  NumberOfPages: number;
  YearOfPublication: number;
  Language: BookLanguage;
  BorrowedBy?: userId;
  BorrowedDate?: Date;

  constructor(
    category: BookCategory,
    author: string,
    title: string,
    numberOfPages: number,
    yearOfPublication: number,
    language: BookLanguage
  ) {
    this.Category = category;
    this.Author = author;
    this.isStringEmpty(this.Author);
    this.Title = title;
    this.isStringEmpty(this.Title);
    this.NumberOfPages = numberOfPages;
    this.isNumberOfPagesInRange(this.NumberOfPages);
    this.YearOfPublication = yearOfPublication;
    this.isPublicationYearInRange(this.YearOfPublication);
    this.Language = language;
  }

  private isStringEmpty(str: string): void {
    if (str.length === 0) {
      throw new Error("Please type something");
    }
  }

  private isPublicationYearInRange(yearOfPublication: number) {
    if (yearOfPublication > 2023) {
      throw new Error("Publication year must be before 2023");
    }
  }

  private isNumberOfPagesInRange(numberOfPages: number): void {
    if (numberOfPages <= 0 || numberOfPages > 10710) {
      throw new Error("Number of pages must be between 1 and 10710");
    }
  }

  private generateRandomISBN2017() {
    const generatedRandom12Numbers = this.generateRandom12Numbers();
    const summedRandom12Numbers = this.sum12Numbers(generatedRandom12Numbers);
    const lastISBNDigit = this.lastISBNNumber(summedRandom12Numbers);
    const fullISBNNumber = generatedRandom12Numbers.concat(lastISBNDigit);
    const fullNum = this.generateFullISBNNumber(fullISBNNumber);
    if (/^\d{3}-\d{2}-\d{4}-\d{3}-\d{1}$/.test(fullNum)) {
      return fullNum;
    }
    throw new Error("Bad ISBN number");
  }

  private generateRandom12Numbers() {
    const random12Numbers: number[] = [];
    while (random12Numbers.length < 12) {
      random12Numbers.push(Math.floor(Math.random() * 10));
    }
    return random12Numbers;
  }

  private sum12Numbers(ISBN12Numbers: number[]) {
    return ISBN12Numbers.reduce((acc, element, index) => {
      if (index % 2 === 0) {
        acc += element * 1;
      }
      if (index % 2 === 1) {
        acc += element * 3;
      }
      return acc;
    }, 0);
  }

  private lastISBNNumber(suumedISBN12Numbers: number) {
    if (10 - (suumedISBN12Numbers % 10) === 10) {
      return 0;
    } else return 10 - (suumedISBN12Numbers % 10);
  }

  private generateFullISBNNumber(fullISBNNumber: number[]): string {
    return fullISBNNumber.reduce((acc, element, index) => {
      if (index === 2 || index === 4 || index === 8 || index === 11) {
        acc += element + "-";
      } else acc += element;
      return acc;
    }, "");
  }
}

const ElonMusk = new Book(
  BOOK_CATEGORY.BIOGRAPHY,
  "WALTER ISAACSON",
  "ELON MUSK",
  310,
  2023,
  BOOK_LANGUAGE.ENGLISH
);
console.log(ElonMusk);

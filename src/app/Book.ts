import { BookCategory } from "./BookCategory";
import { BookLanguage } from "./BookLanguage";
import { clock } from "./Clock";

export type ISBN = string;

const MIN_NUMBERS_OF_PAGES = 1;
const MAX_NUMBERS_OF_PAGES = 21450;

const MIN_YEAR_OF_PUBLICATION = -400;
const MAX_YEAR_OF_PUBLICATION = clock().getFullYear();

export class Book {
  ISBN: string = this.generateRandomISBN2017();
  category: BookCategory;
  author: string;
  title: string;
  numberOfPages: number;
  yearOfPublication: number;
  language: BookLanguage;

  constructor(
    category: BookCategory,
    author: string,
    title: string,
    numberOfPages: number,
    yearOfPublication: number,
    language: BookLanguage
  ) {
    this.category = category;
    this.isStringEmpty(author);
    this.author = author;
    this.isStringEmpty(title);
    this.title = title;
    this.isNumberInRange(
      MIN_NUMBERS_OF_PAGES,
      MAX_NUMBERS_OF_PAGES,
      numberOfPages
    );
    this.numberOfPages = numberOfPages;
    this.isNumberInRange(
      MIN_YEAR_OF_PUBLICATION,
      MAX_YEAR_OF_PUBLICATION,
      yearOfPublication
    );
    this.yearOfPublication = yearOfPublication;
    this.language = language;
  }

  private isStringEmpty(str: string): void {
    if (str.length === 0) {
      throw new Error("Please type something");
    }
  }

  private isNumberInRange(
    numberMin: number,
    numberMax: number,
    providedNumber: number
  ): void {
    if (providedNumber < numberMin || providedNumber > numberMax) {
      throw new Error(`Number must be in range: ${numberMin} to ${numberMax}`);
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
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
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

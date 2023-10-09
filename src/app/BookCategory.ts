export const BOOK_CATEGORY = {
  BIOGRAPHY: "Biography",
  HISTORY: "History",
  SPORTS: "Sports",
  ECONOMICS: "Economics",
  PROGRAMMING: "Programming",
  SCIENCE: "Science",
  MYSTERY: "Mystery",
} as const;

export type BookCategory = (typeof BOOK_CATEGORY)[keyof typeof BOOK_CATEGORY];

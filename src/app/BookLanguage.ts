export const BOOK_LANGUAGE = {
  POLISH: "Polish",
  ENGLISH: "English",
  FRENCH: "French",
  GERMAN: "German",
  ITALIAN: "Italian",
  SPANISH: "Spanish",
} as const;

export type BookLanguage = (typeof BOOK_LANGUAGE)[keyof typeof BOOK_LANGUAGE];

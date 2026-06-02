export interface IBookItem {
  key: string;
  title: string;
  author: string;
  genre: string;
  available: string;
}
const bookData: IBookItem[] = [
  {
    key: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    available: "Yes",
  },
  {
    key: "2",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    available: "No",
  },
  {
    key: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Historical Fiction",
    available: "Yes",
  },
  {
    key: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    available: "Yes",
  },
];

export default bookData;

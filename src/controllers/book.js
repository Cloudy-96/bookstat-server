import { Prisma } from "@prisma/client";
import { sendDataResponse } from "../utils/responses.js";
import {
  createBook,
  deleteById,
  findById,
  getAllBooks,
  updateBookById,
  // findByStatus,
  // findByTitle,
  // deleteById,
} from "../domain/book.js";

export const create = async (req, res) => {
  const book = {};

  if (req.body.title) {
    book.title = req.body.title;
  } else {
    return sendDataResponse(res, 400, "Please provide a title");
  }

  if (req.body.authorFirstName) {
    book.authorFirstName = req.body.authorFirstName;
  } else {
    return sendDataResponse(res, 400, "Please provide a authorFirstName");
  }
  if (req.body.authorLastName) {
    book.authorLastName = req.body.authorLastName;
  } else {
    return sendDataResponse(res, 400, "Please provide a authorLastName");
  }
  if (req.body.coverUrl) {
    book.coverUrl = req.body.coverUrl;
  } else {
    //TODO: check this can be used/ find another img
    book.coverUrl =
      "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimg03.deviantart.net%2F323e%2Fi%2F2009%2F028%2F8%2F0%2Fclassic_red_book_cover_by_semireal_stock.jpg&f=1&nofb=1&ipt=c870a101338261a09c317afc76f9857273ebf466bb581e76ee56ab03420e13f1&ipo=images";
  }
  if (req.body.numPages) {
    book.numPages = req.body.numPages;
  } else {
    book.numPages = null;
  }
  if (req.body.publisher) {
    book.publisher = req.body.publisher;
  } else {
    return sendDataResponse(res, 400, "Please provide a publisher");
  }
  if (req.body.yearPublished) {
    book.yearPublished = req.body.yearPublished;
  } else {
    book.yearPublished = null;
  }
  if (req.body.ReadStatus) {
    book.ReadStatus = req.body.ReadStatus;
  } else {
    book.ReadStatus = "Not Read";
  }

  try {
    console.log(book);
    const newBook = await createBook(
      book.title,
      book.authorFirstName,
      book.authorLastName,
      book.coverUrl,
      book.numPages,
      book.publisher,
      book.yearPublished,
      book.ReadStatus
    );
    return sendDataResponse(res, 201, newBook);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
      return sendDataResponse(res, 400, "error");
    } else {
      console.log(e);
      return sendDataResponse(res, 400, "error");
    }
  }

  // return sendDataResponse(res, 201, {
  //   data: {
  //     id: createdBook.id,
  //     title: createdBook.title,
  //     authorFirstName: createdBook.authorFirstName,
  //     authorLastName: createdBook.authorLastName,
  //     coverUrl: createdBook.coverUrl,
  //     numPages: createdBook.numPages,
  //     publisher: createdBook.publisher,
  //     yearPublished: createdBook.yearPublished,
  //     ReadStatus: createdBook.ReadStatus,
  //   },
  // });
};

export const getAll = async (req, res) => {
  const books = await getAllBooks();
  return sendDataResponse(res, 200, { books });
};

export const getById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const foundBook = await findById(id);
    if (!foundBook) {
      return sendDataResponse(res, 404, { error: "Book not found" });
    }
    const book = {
      id: foundBook.id,
      title: foundBook.title,
      authorFirstName: foundBook.authorFirstName,
      authorLastName: foundBook.authorLastName,
      coverUrl: foundBook.coverUrl,
      numPages: foundBook.numPages,
      publisher: foundBook.publisher,
      yearPublished: foundBook.yearPublished,
      ReadStatus: foundBook.ReadStatus,
    };
    return sendDataResponse(res, 200, book);
  } catch (e) {
    return sendDataResponse(res, 500, { error: "Unable to get book" });
  }
};

export const deleteBook = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deletedBook = await deleteById(id);

    const book = {
      id: deletedBook.id,
      title: deletedBook.title,
      authorFirstName: deletedBook.authorFirstName,
      authorLastName: deletedBook.authorLastName,
      coverUrl: deletedBook.coverUrl,
      numPages: deletedBook.numPages,
      publisher: deletedBook.publisher,
      yearPublished: deletedBook.yearPublished,
      ReadStatus: deletedBook.ReadStatus,
    };
    return sendDataResponse(res, 200, book);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return sendDataResponse(res, 404, { error: "Book does not exist." });
      }
    }
    return sendDataResponse(res, 500, { error: "Unable to delete book" });
  }
};

export const updateById = async (req, res) => {
  const data = {};
  const id = Number(req.params.id);
  const foundbook = await findById(id);
  if (!foundbook) {
    console.log(foundbook);
    return sendDataResponse(res, 404, { error: "Book not found" });
  } else {
    // console.log(foundbook);

    if (req.body.title) {
      data.title = req.body.title;
    } else {
      data.title = foundbook.title;
    }

    if (req.body.authorFirstName) {
      data.authorFirstName = req.body.authorFirstName;
    } else {
      data.authorFirstName = foundbook.authorFirstName;
    }

    if (req.body.authorLastName) {
      data.authorLastName = req.body.authorLastName;
    } else {
      data.authorLastName = foundbook.authorLastName;
    }
    if (req.body.coverUrl) {
      data.coverUrl = req.body.coverUrl;
    } else {
      data.coverUrl = foundbook.coverUrl;
    }
    if (req.body.numPages) {
      data.numPages = req.body.numPages;
    } else {
      data.numPages = foundbook.numPages;
    }
    if (req.body.publisher) {
      data.publisher = req.body.publisher;
    } else {
      data.publisher = foundbook.publisher;
    }
    if (req.body.yearPublished) {
      data.yearPublished = req.body.yearPublished;
    } else {
      data.yearPublished = foundbook.yearPublished;
    }
    if (req.body.ReadStatus) {
      data.ReadStatus = req.body.ReadStatus;
    } else {
      data.ReadStatus = foundbook.ReadStatus;
    }
    console.log (data)
  }

  try {
    const updatedBook = await updateBookById(id, data);
    return sendDataResponse(res, 201, { book: updatedBook });
  } catch (e) {
    return sendDataResponse(res, 500, { error: "Unable to update Book" });
  }
};



//TODO: edit
// export const getByStatus = async (req, res) => {
//   const ReadStatus = req.body.ReadStatus;
//   try {
//     if (ReadStatus) {
//       console.log(ReadStatus);
//     }
//     const books = await findByStatus(ReadStatus);
//     console.log("books by status:", books);
//     if (!books) {
//       return sendDataResponse(res, 404, "No books found");
//     }
//     return sendDataResponse(res, 200, { books });
//   } catch (e) {
//     return sendDataResponse(res, 500, "Unable to get all books");
//   }
// };

// export const getByTitle = async (req, res) => {
//   const title = req.body.title;
//   console.log("req.body", title)

//   try {
//   console.log("req.body", req.body);

//     const foundBook = await findByTitle(title);
//     if (!foundBook) {
//       return sendDataResponse(res, 404, { error: "Book not found" });
//     }
//     const book = {
//       id: foundBook.id,
//       title: foundBook.title,
//       authorFirstName: foundBook.authorFirstName,
//       authorLastName: foundBook.authorLastName,
//       coverUrl: foundBook.coverUrl,
//       numPages: foundBook.numPages,
//       publisher: foundBook.publisher,
//       yearPublished: foundBook.yearPublished,
//       ReadStatus: foundBook.ReadStatus,
//     };
//     return sendDataResponse(res, 200, book);
//   } catch (e) {
//     return sendDataResponse(res, 500, { error:  "Unable to get book" });
//   }
// };



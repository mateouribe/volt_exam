import pool from "../db.js";

//* GET FUNCTIONS ----------------------------------------------------------
const getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books");
    res.status(200).json({
      message: "Books fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error while fetching books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Book with id ${id} has not been found.` });
    }

    res.status(200).json({
      message: "Books fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error(`Error while fetching book with id ${id}:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroupedBooks = async (req, res) => {
  try {
    //Ref to get decade -- https://stackoverflow.com/questions/65915114/having-issues-summarizing-years-as-decades-in-mysql
    const [rows] = await pool.query(
      `SELECT 10*FLOOR(published_year/10) AS decade, 
      id, title, author_id, published_year
      FROM books 
      ORDER BY title ASC`
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `Books have not been found.` });
    }

    let groupedBooks = {};

    for (const book of rows) {
      const decade = `${book.decade}s`;

      //If decate does not exist yet, then create it
      if (!groupedBooks[decade]) {
        groupedBooks[decade] = [];
      }

      //Else push the book to the decade
      groupedBooks[decade].push({
        id: book.id,
        title: book.title,
        author_id: book.author_id,
        published_year: book.published_year,
      });
    }

    res.status(200).json({
      message: "Books fetched successfully",
      data: groupedBooks,
    });
  } catch (error) {
    console.error("Error while fetching grouped books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBookWithAuthorData = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books");

    if (rows.length === 0) {
      return res.status(404).json({ message: `Books have not been found.` });
    }

    //For every book create a promise
    const authorFetchPromises = rows.map(async (book) => {
      try {
        const response = await fetch(
          `https://openlibrary.org/authors/${book.author_id}.json`
        );
        const authorData = await response.json();

        return {
          id: book.id,
          title: book.title,
          author_id: book.author_id,
          published_year: book.published_year,
          author_data: authorData.error ? null : authorData, //If not found under id provided then set author_data to null
        };
      } catch (error) {
        //If there is an error fetching the external API then return book with null author_data
        console.error(`Error fetching author for book ${book.id}:`, error);
        return {
          id: book.id,
          title: book.title,
          author_id: book.author_id,
          published_year: book.published_year,
          author_data: null,
        };
      }
    });

    const booksWithAuthorData = await Promise.all(authorFetchPromises);

    res.status(200).json({
      message: "Books with author data fetched successfully",
      data: booksWithAuthorData,
    });
  } catch (error) {
    console.error("Error while getting all books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* POST FUNCTIONS ----------------------------------------------------------
const createBook = async (req, res) => {
  try {
    const { title, author_id, published_year } = req.body;
    const [result] = await pool.query(
      "INSERT INTO books (title, author_id, published_year) VALUES (?, ?, ?)",
      [title, author_id, published_year]
    );

    res.status(201).json({
      message: "Book created successfully",
      data: {
        id: result.insertId,
        title,
        author_id,
        published_year,
      },
    });
  } catch (error) {
    console.error("Error while creating book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createMultipleBooks = async (req, res) => {
  try {
    const books = req.body;

    // Validate body is an array and not empty
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Insert each book
    const insertPromises = books.map((book) => {
      const { title, author_id, published_year } = book;
      return pool.query(
        "INSERT INTO books (title, author_id, published_year) VALUES (?, ?, ?)",
        [title, author_id, published_year]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({
      message: "Books created successfully",
      data: books,
    });
  } catch (error) {
    console.error("Error while creating books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//* PUT FUNCTIONS ----------------------------------------------------------
const updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, author_id, published_year } = req.body;

    const [result] = await pool.query(
      "UPDATE books SET title = ?, author_id = ?, published_year = ? WHERE id = ?",
      [title, author_id, published_year, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `Book with id ${id} has not been found.` });
    }

    res.status(200).json({
      message: `Book with id ${id} has been updated successfully`,
      data: {
        id,
        title,
        author_id,
        published_year,
      },
    });
  } catch (error) {
    console.error("Error while updating book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//* DELETE FUNCTIONS ----------------------------------------------------------
const deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `Book with id ${id} has not been found.` });
    }

    res.status(200).json({
      message: `Book with id ${id} has been deleted successfully`,
    });
  } catch (error) {
    console.error("Error while deleting book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllBooks,
  getBookById,
  createBook,
  createMultipleBooks,
  updateBook,
  deleteBook,
  getGroupedBooks,
  getBookWithAuthorData,
};

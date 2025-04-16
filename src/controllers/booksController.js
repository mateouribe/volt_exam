import pool from "../db.js";

//* GET FUNCTIONS ----------------------------------------------------------
const getAllBooks = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM books");
  res.status(200).json({
    message: "Books fetched successfully",
    books: rows,
  });
};

const getBookById = async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ message: `Book with id ${id} has not been found.` });
  }

  res.status(200).json({
    message: "Books fetched successfully",
    book: rows[0],
  });
};

const getGroupedBooks = async (req, res) => {
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
};

//* POST FUNCTIONS ----------------------------------------------------------
const createBook = async (req, res) => {
  const { title, author_id, published_year } = req.body;
  const [result] = await pool.query(
    "INSERT INTO books (title, author_id, published_year) VALUES (?, ?, ?)",
    [title, author_id, published_year]
  );

  res.status(201).json({
    message: "Book created successfully",
    book: {
      id: result.insertId,
      title,
      author_id,
      published_year,
    },
  });
};

//* PUT FUNCTIONS ----------------------------------------------------------
const updateBook = async (req, res) => {
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
    book: {
      id,
      title,
      author_id,
      published_year,
    },
  });
};

//* DELETE FUNCTIONS ----------------------------------------------------------
const deleteBook = async (req, res) => {
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
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGroupedBooks,
};

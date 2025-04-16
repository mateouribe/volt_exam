import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getBookWithAuthorData,
  getGroupedBooks,
  updateBook,
} from "../controllers/booksController.js";

const router = express.Router();

//* GET ROUTES ----------------------------------------------------------
router.get("/", getAllBooks);
router.get("/grouped", getGroupedBooks);
router.get("/authors_data", getBookWithAuthorData);
router.get("/:id", getBookById);

//* POST ROUTES ----------------------------------------------------------
router.post("/", createBook);

//* PUT ROUTES ----------------------------------------------------------
router.put("/:id", updateBook);

//* DELETE ROUTES ----------------------------------------------------------
router.delete("/:id", deleteBook);

export default router;

import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/booksController.js";

const router = express.Router();

//* GET FUNCTIONS ----------------------------------------------------------
router.get("/", getAllBooks);
router.get("/:id", getBookById);

//* POST FUNCTIONS ----------------------------------------------------------
router.post("/", createBook);

//* PUT FUNCTIONS ----------------------------------------------------------
router.put("/:id", updateBook);

//* DELETE FUNCTIONS ----------------------------------------------------------
router.delete("/:id", deleteBook);

export default router;

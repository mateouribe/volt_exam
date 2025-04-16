import express from "express";
import { getAuthorsByName } from "../controllers/authorsController.js";

const router = express.Router();

router.get("/", getAuthorsByName);

export default router;

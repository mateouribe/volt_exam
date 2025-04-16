import express from "express";
import { initializeDatabase } from "./db.js";

const app = express();
const PORT = process.env.PORT || 1515;

//* MIDDLEWARES
//Convert body to redable JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Books API",
  });
});

//* Initialize database
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running`);
});

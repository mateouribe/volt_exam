import express from "express";

const app = express();
const PORT = process.env.PORT || 1515;

app.listen(PORT, () => {
  console.log(`Server running`);
});

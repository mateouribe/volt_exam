export const getAuthorsByName = (req, res) => {
  const search = req.query.search;

  //Only fetch external API when author name is provided
  if (!search) {
    return res.status(400).json({
      message: "Please provide a search query",
    });
  }

  //Fetch authors by name - use encoreURIComponent to make sure url is readable for the API
  fetch(
    `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
      search
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      const dataToBeSent = data.docs.slice(0, 5).map((author) => ({
        id: author.key,
        name: author.name,
        top_work: author.top_work,
        work_count: author.work_count,
      }));

      res.status(200).json({
        message: "Authors fetched successfully",
        data: dataToBeSent,
      });
    })
    .catch((error) => {
      console.error("Error fetching authors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

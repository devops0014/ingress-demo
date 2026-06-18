const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const books = [
  { id: 1, title: "Clean Code",              author: "Robert C. Martin",  genre: "Programming", rating: 4.8 },
  { id: 2, title: "The Pragmatic Programmer", author: "David Thomas",      genre: "Programming", rating: 4.7 },
  { id: 3, title: "Kubernetes in Action",    author: "Marko Luksa",       genre: "DevOps",      rating: 4.9 },
  { id: 4, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", genre: "Systems", rating: 4.9 },
  { id: 5, title: "The Phoenix Project",     author: "Gene Kim",          genre: "DevOps",      rating: 4.6 },
];

// GET /api/books — list all books
app.get("/api/books", (req, res) => {
  res.json({
    service: "books-service",
    pod: process.env.HOSTNAME || "unknown",
    path_matched: "/api/books",
    routed_by: "Kubernetes Ingress (path prefix: /api/books)",
    count: books.length,
    data: books,
  });
});

// GET /api/books/:id — single book
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json({ service: "books-service", pod: process.env.HOSTNAME, data: book });
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "books-service" }));

app.listen(PORT, () => console.log(`Books service running on port ${PORT}`));

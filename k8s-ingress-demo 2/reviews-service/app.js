const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;

const reviews = [
  { id: 1, bookId: 1, user: "alice",   rating: 5, comment: "A must-read for every developer. Changed how I write code." },
  { id: 2, bookId: 1, user: "bob",     rating: 4, comment: "Very insightful. Some examples feel dated but the principles are timeless." },
  { id: 3, bookId: 3, user: "charlie", rating: 5, comment: "Best K8s book out there. Deep dives into internals." },
  { id: 4, bookId: 2, user: "diana",   rating: 5, comment: "Essential career advice for any software professional." },
  { id: 5, bookId: 4, user: "eve",     rating: 5, comment: "Dense but rewarding. The definitive guide to distributed systems." },
];

// GET /api/reviews         → all reviews
// GET /api/reviews?bookId=3 → filtered by book
app.get("/api/reviews", (req, res) => {
  const { bookId } = req.query;
  const data = bookId ? reviews.filter((r) => r.bookId === parseInt(bookId)) : reviews;
  res.json({
    service: "reviews-service",
    pod: process.env.HOSTNAME || "unknown",
    path_matched: "/api/reviews",
    routed_by: "Kubernetes Ingress (path prefix: /api/reviews)",
    count: data.length,
    data,
  });
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "reviews-service" }));

app.listen(PORT, () => console.log(`Reviews service running on port ${PORT}`));

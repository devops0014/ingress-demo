const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>📚 BookStore</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
          h1 { color: #2c3e50; }
          .card { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          a { color: #3498db; text-decoration: none; font-weight: bold; }
          .badge { background: #3498db; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
          .info { background: #eaf4fb; padding: 10px; border-left: 4px solid #3498db; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>📚 BookStore - Frontend Service</h1>
        <div class="card">
          <h2>Welcome to BookStore!</h2>
          <p>This is the <strong>Frontend Service</strong> running at the root path <code>/</code></p>
          <p>Pod: <strong>${process.env.HOSTNAME || "unknown"}</strong></p>
        </div>
        <div class="card">
          <h3>🔗 Explore Other Services via Ingress</h3>
          <p><a href="/api/books">/api/books</a> <span class="badge">Books Service</span> — Browse the book catalog</p>
          <p><a href="/api/reviews">/api/reviews</a> <span class="badge">Reviews Service</span> — Read customer reviews</p>
        </div>
        <div class="info">
          <strong>🎓 K8s Ingress Demo:</strong> All three services share one external IP.
          The Ingress controller routes requests based on the URL path prefix.
        </div>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "frontend" }));

app.listen(PORT, () => console.log(`Frontend service running on port ${PORT}`));

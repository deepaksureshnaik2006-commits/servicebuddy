import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app).then(() => {
  const port = process.env.PORT || 5000;
  
  // Default route for the API server
  app.get("/", (_req, res) => {
    res.json({ message: "Service Buddy API is running" });
  });

  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});